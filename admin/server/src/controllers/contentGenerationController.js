import { config } from "dotenv";
config();
import dateFormat from "dateformat";
import { GoogleGenerativeAI } from "@google/generative-ai";
import Handlebars from "handlebars";
import fs from "fs-extra";
import * as path from "path";
import mongoose from "mongoose";
import Region from "../models/Region.js";
import Category from "../models/Category.js";

const contentGenerationControllers = {
  post: async (request, reply) => {
    try {
      const payload = request.body;
      const { id, name, keywords, date } = payload;
      const region = await Region.findById(payload.region);
      const category = await Category.findById(payload.category);

      //fetch content
      const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
      const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

      const regionName = region.name;
      const categoryName = category.name;
      const keywordsString = keywords.join(", ");
      const prompt = `Write an article on ${name} categorised under ${categoryName} which is trending in ${regionName} with the following related search keywords ${keywordsString}. The article should include sections such that the content can be made as a webpage. Include html tags as required, so that it can be appended to the body of an html page. Return a JSON with field article and value an object. The object should include following fields "title", "short_description", "keywords", "reading_time" and "body". "keywords" must be a comma seperated string. Do not include the title as h1 tag in "body". The article has to be informal without headings like introduction or conclusion. There can be sub sections if required. If you have any notes, please include it under "notes" field instead of html`;
      const result = await model.generateContent(prompt);
      const articleContainer = JSON.parse(
        result.response.text().slice(8).replaceAll("```", "")
      );
      const article = articleContainer.article;
      article.date = dateFormat(new Date(date), "mmm d, yyyy");
      article.path = `/${region.code}/${category.slug}/${article.title
        .split(" ")
        .join("-")
        .toLowerCase()
        .replace(/[^a-z-]/g, "")}`;
      article.keywords_list = article.keywords.split(", ");

      //#TODO - fetch image
      //render page html
      let template = fs
        .readFileSync(
          path.join(import.meta.dirname, "..", "templates", "page.html")
        )
        .toString();
      template = Handlebars.compile(template, { noEscape: true });
      article.html = template({ article: article });
      if (articleContainer.notes) {
        article.notes = articleContainer.notes;
      }

      article.trend = new mongoose.Types.ObjectId(id);

      //write html file
      const dirPath = path.join(
        import.meta.dirname,
        "..",
        "..",
        "..",
        "..",
        "website",
        "public",
        region.code,
        category.slug
      );
      fs.ensureDirSync(dirPath);
      const filePath = `${dirPath}/${article.title
        .split(" ")
        .join("-")
        .toLowerCase()
        .replace(/[^a-z-]/g, "")}.html`;
      await fs.writeFile(filePath, article.html);
      reply.code(201).send(article);
    } catch (e) {
      reply.code(500).send(e);
    }
  },
};

export default contentGenerationControllers;
