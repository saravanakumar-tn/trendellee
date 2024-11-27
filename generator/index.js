import { config } from "dotenv";
config();
import fs from "fs";

import dateFormat from "dateformat";
import { GoogleGenerativeAI } from "@google/generative-ai";
import Handlebars from "handlebars";

import { slugify } from "./helpers/slugify.js";
const now = new Date();

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

const generateBody = async (topic) => {
  const { name, region, category } = topic;
  const prompt = `Write an article on ${name} categorised under ${category} which is trending in ${region}. The article should include sections such that the content can be made as a webpage. Include html tags as required, so that it can be appended to the body of an html page. Return a JSON with field article and value an object. The object should include following fields "title", "short_description", "keywords", "reading_time" and "body". Do not include the title as h1 tag in "body". The article has to be informal without headings like introduction or conclusion. There can be sub sections if required. If you have any notes, please include it under "notes" field instead of html`;
  const result = await model.generateContent(prompt);
  console.log("## Article JSON created !");
  const data = JSON.parse(
    result.response.text().slice(8).replaceAll("```", "")
  );
  data.article.date = dateFormat(now, "mmm d, yyyy");
  data.article.category = category;
  data.article.region = region;
  data.article.slug = slugify(name);
  return data;
};

const renderHTML = (data) => {
  const source = fs
    .readFileSync("../website/base/base.html", "utf8")
    .toString();
  const template = Handlebars.compile(source, { noEscape: true });
  const output = template(data);
  console.log("## HTML page rendered !");
  return output;
};

const createHTMLFile = (htmlContent, topic) => {
  console.log("## Creating HTML file !");
  const { name, region } = topic;
  const filePath = `../website/public/${slugify(name)}.html`;
  fs.writeFile(filePath, htmlContent, (err, data) => {
    console.log("## HTML Page created !");
    console.log(data);
  });
};

const articles = [];
const main = async (topics) => {
  const promises = [];
  topics.forEach(async (topic) => {
    const { name } = topic;
    const promise = new Promise(async (resolve) => {
      const contentJSON = await generateBody(topic);
      articles.push(contentJSON);
      resolve(contentJSON);
    });
    promises.push(promise);

    promise.then((contentJSON) => {
      fs.writeFile(
        `../website/raw_data/articles/${slugify(name)}.json`,
        JSON.stringify(contentJSON),
        (err, data) => {
          console.log("# JSON added to raw data dir");
        }
      );
      const pageHTMLContent = renderHTML(contentJSON);
      createHTMLFile(pageHTMLContent, topic);
    });
  });

  Promise.all(promises).then(() => {
    fs.readFile("../website/raw_data/index.json", "utf8", (err, data) => {
      if (!data) {
        data = { articles: articles };
      } else {
        data = JSON.parse(data);
        data.articles = data.articles.concat(articles);
      }
      fs.writeFile(
        "../website/raw_data/index.json",
        JSON.stringify(data),
        (err, data) => {
          console.log("## Added to index json !");
        }
      );
    });
  });
};

fs.readFile("topics.json", "utf8", (err, topics) => {
  console.log("## Reading Topics");
  main(JSON.parse(topics));
});
