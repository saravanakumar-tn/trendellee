import fastify from "fastify";
import mongoose from "mongoose";

import categoryRoutes from "./routes/categoryRoutes.js";
import regionRoutes from "./routes/regionRoutes.js";
import trendRoutes from "./routes/trendRoutes.js";
import pageRoutes from "./routes/pageRoutes.js";
import contentGenerationRoutes from "./routes/contentGenerationRoutes.js";

import Page from "./models/Page.js";
import _ from "lodash";
import fs from "fs-extra";
import Handlebars from "handlebars";
import * as path from "path";
import dateFormat from "dateformat";
import Region from "./models/Region.js";

import { SitemapStream, streamToPromise } from "sitemap";
import { Readable } from "stream";

const app = fastify({
  logger: true,
});

try {
  mongoose.connect("mongodb://localhost:27017/trendellee");
} catch (e) {
  console.error(e);
}

categoryRoutes(app);
regionRoutes(app);
trendRoutes(app);
pageRoutes(app);
contentGenerationRoutes(app);

app.get("/api/homepage", async (request, reply) => {
  try {
    const regions = await Region.find({});
    const regionMap = {};
    regions.forEach((r) => {
      regionMap[r.name] = r.code.toUpperCase();
    });
    let raisedPages = await Page.find({
      date: dateFormat(new Date(), "mmm d, yyyy"),
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
      const { title, short_description, path, date, keywords, trend } = a;
      let article = { title, short_description, path, date, trend };
      article.keywords_list = keywords;
      return article;
    });
    const byRegion = _.groupBy(raisedPages, "trend.region.name");

    //render html
    let template = fs
      .readFileSync(path.join(import.meta.dirname, "templates", "home.html"))
      .toString();
    template = Handlebars.compile(template, { noEscape: true });
    const html = template({
      by_regions: byRegion,
      articles_seo: raisedPages.slice(0, 3),
      region_map: regionMap,
    });

    const filePath = path.join(
      import.meta.dirname,
      "..",
      "..",
      "..",
      "website",
      "public",
      "index.html"
    );
    await fs.writeFile(filePath, html);

    reply.code(200).send({
      by_regions: byRegion,
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

/**
 * Run the server!
 */
const start = async () => {
  try {
    await app.listen({ port: 5000 });
  } catch (err) {
    app.log.error(err);
    process.exit(1);
  }
};

start();
