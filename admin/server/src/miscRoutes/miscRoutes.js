import Page from "../models/Page.js";
import Region from "../models/Region.js";
import _ from "lodash";
import fs from "fs-extra";
import Handlebars from "handlebars";
import * as path from "path";
import dateFormat from "dateformat";
import axios from "axios";

import { SitemapStream, streamToPromise } from "sitemap";
import { Readable } from "stream";
import { parse } from "node-html-parser";

const miscRoutes = (app) => {
  app.get("/api/homepage", async (request, reply) => {
    try {
      const regions = await Region.find({});
      const regionMap = {};
      regions.forEach((r) => {
        regionMap[r.name] = r.code.toUpperCase();
      });
      let raisedPages = await Page.find({
        status: "raised",
      })
        .populate({
          path: "trend",
          populate: [
            { path: "category", model: "Category" },
            { path: "region", model: "Region" },
          ],
        })
        .lean()
        .exec();
      raisedPages = raisedPages.map((a) => {
        const {
          title,
          short_description,
          path,
          date,
          keywords,
          trend,
          is_image,
        } = a;
        let article = { title, short_description, path, date, trend, is_image };
        article.keywords_list = keywords;
        return article;
      });

      //render html
      let template = fs
        .readFileSync(
          path.join(import.meta.dirname, "..", "templates", "home.html")
        )
        .toString();
      template = Handlebars.compile(template, { noEscape: true });
      const html = template({
        articles: raisedPages,
        articles_seo: raisedPages.slice(0, 3),
        region_map: regionMap,
      });
      const filePath = path.join(
        import.meta.dirname,
        "..",
        "..",
        "..",
        "..",
        "website",
        "public",
        "index.html"
      );
      await fs.writeFile(filePath, html);

      reply.code(200).send({
        articles: raisedPages,
        articles_seo: raisedPages.slice(0, 3),
        region_map: regionMap,
      });
    } catch (e) {
      reply.code(500).send(e);
    }
  });

  app.get("/api/sitemap", async (request, reply) => {
    try {
      const raisedPages = await Page.find({});
      const links = raisedPages.map((p) => {
        return { url: p.path, changefreq: "monthly", priority: 0.5 };
      });
      links.push({ url: "", changefreq: "daily", priority: 0.6 });
      const stream = new SitemapStream({ hostname: "https://trendellee.com" });
      const data = await streamToPromise(Readable.from(links).pipe(stream));

      const filePath = path.join(
        import.meta.dirname,
        "..",
        "..",
        "..",
        "..",
        "website",
        "public",
        "sitemap.xml"
      );
      await fs.writeFile(filePath, data.toString());
      reply.code(200).send(links);
    } catch (e) {
      reply.code(500).send(e);
    }
  });

  app.get("/api/mark-as-published", async (request, reply) => {
    try {
      await Page.updateMany({}, { status: "published" });
      reply.code(200).send({ message: "Pages status updated" });
    } catch (error) {
      reply.code(500).send(e);
    }
  });

  app.get("/api/images/:type/:query", async (request, reply) => {
    try {
      const { type, query } = request.params;
      let page;
      let searchBy;
      if (type === "id") {
        page = await Page.findById(query).lean();
        searchBy = page.title;
      }
      searchBy = query;

      const url = "https://pixabay.com/api/";
      const res = await axios.get(url, {
        params: {
          key: process.env.PIXABAY_API_KEY,
          orientation: "horizontal",
          min_width: 600,
          q: query,
        },
      });
      let data = {};
      data.images = res.data.hits;
      if (page) {
        data.title = page.title;
      }
      reply.code(200).send(data);
    } catch (e) {
      reply.code(500).send(e);
    }
  });

  app.post("/api/save-image/:id", async (request, reply) => {
    try {
      const id = request.params.id;
      const url = request.body.image;

      const page = await Page.findById(id);
      const filePath = path.join(
        import.meta.dirname,
        "..",
        "..",
        "..",
        "..",
        "website",
        "public",
        "assets",
        "images",
        `${page.path}.jpg`
      );
      await fs.ensureFile(filePath);
      const response = await axios({
        url,
        method: "GET",
        responseType: "stream",
      });
      const writer = fs.createWriteStream(filePath);
      await response.data.pipe(writer);

      page.is_image = true;
      await page.save();
      reply.code(200).send({ message: "Page updated with image" });
    } catch (e) {
      reply.code(500).send(e);
    }
  });

  app.get("/api/render-html/:id", async (request, reply) => {
    try {
      const id = request.params.id;
      const page = await Page.findById(id);
      const article = page.toObject();
      article.keywords_list = article.keywords.split(", ");
      const filePath = path.join(
        import.meta.dirname,
        "..",
        "..",
        "..",
        "..",
        "website",
        "public",
        `${page.path}.html`
      );
      await fs.ensureFile(filePath);

      let template = fs
        .readFileSync(
          path.join(import.meta.dirname, "..", "templates", "page.html")
        )
        .toString();
      template = Handlebars.compile(template, { noEscape: true });
      page.html = template({ article: article });
      await fs.writeFile(filePath, page.html);
      await page.save();

      reply.code(200).send({ message: "Page updated with image" });
    } catch (e) {
      reply.code(500).send(e);
    }
  });

  app.get("/api/render-html", async (request, reply) => {
    try {
      const pages = await Page.find({});
      pages.forEach(async (page, idx) => {
        const article = page.toObject();
        article.keywords_list = article.keywords.split(", ");
        const filePath = path.join(
          import.meta.dirname,
          "..",
          "..",
          "..",
          "..",
          "website",
          "public",
          `${page.path}.html`
        );
        await fs.ensureFile(filePath);

        let template = fs
          .readFileSync(
            path.join(import.meta.dirname, "..", "templates", "page.html")
          )
          .toString();
        template = Handlebars.compile(template, { noEscape: true });
        page.html = template({ article: article });
        await fs.writeFile(filePath, page.html);
        await page.save();
      });

      reply.code(200).send({ message: "Pages updated with image" });
    } catch (e) {
      reply.code(500).send(e);
    }
  });

  app.get("/api/index-now", async (request, reply) => {
    try {
      const pages = await Page.find({ status: "raised" });
      const urls = pages.map((page) => {
        return `https://trendellee.com${page.path}`;
      });
      const res = await axios.post(`https://api.indexnow.org/indexnow`, {
        host: "https://trendellee.com",
        key: "39790ee5acca410b8a4a61c847cc5084",
        urlList: urls,
      });
      reply.code(200).send(urls);
    } catch (e) {
      reply.code(500).send(e);
    }
  });
};

export default miscRoutes;
