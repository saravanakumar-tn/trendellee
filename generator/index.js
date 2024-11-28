import { config } from "dotenv";
config();
import fs from "fs-extra";
import axios from "axios";
import open from "open";

import dateFormat from "dateformat";
import { GoogleGenerativeAI } from "@google/generative-ai";
import Handlebars from "handlebars";

import { slugify } from "./helpers/slugify.js";
const now = new Date();

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

const generateBody = async (topic) => {
  const { name, region, category, keywords } = topic;
  const prompt = `Write an article on ${name} categorised under ${category} which is trending in ${region} with the following relates search keywords ${keywords}. The article should include sections such that the content can be made as a webpage. Include html tags as required, so that it can be appended to the body of an html page. Return a JSON with field article and value an object. The object should include following fields "title", "short_description", "keywords", "reading_time" and "body". "keywords" must be a comma seperated string. Do not include the title as h1 tag in "body". The article has to be informal without headings like introduction or conclusion. There can be sub sections if required. If you have any notes, please include it under "notes" field instead of html`;
  const result = await model.generateContent(prompt);
  const data = JSON.parse(
    result.response.text().slice(8).replaceAll("```", "")
  );

  data.article.keywords_list = data.article.keywords.split(",");
  data.article.date = dateFormat(now, "mmm d, yyyy");
  data.article.category = category;
  data.article.region = region;
  data.article.slug = slugify(name);
  data.article.date_slug = dateFormat(now, "m-d-yy");
  data.article.image = await fetchImage(
    data.article.keywords_list.slice(0, 5).join(" ")
  );
  return data;
};

const renderHTML = (data) => {
  const source = fs
    .readFileSync("../website/base/base.html", "utf8")
    .toString();
  const template = Handlebars.compile(source, { noEscape: true });
  const output = template(data);
  return output;
};

const createHTMLFile = (htmlContent, topic) => {
  const { name, region } = topic;
  const dirPath = `../website/public/${dateFormat(now, "m-d-yy")}/`;
  fs.ensureDirSync(dirPath);
  const filePath = `${dirPath}${slugify(name)}.html`;
  fs.writeFile(filePath, htmlContent, (err, data) => {
    console.log(err);
    open(filePath);
  });
};

const fetchImage = async (q) => {
  q = q.slice(0, 100);
  return new Promise(async (resolve, reject) => {
    const url = "https://pixabay.com/api/";
    const res = await axios.get(url, {
      params: {
        key: process.env.PIXABAY_API_KEY,
        orientation: "horizontal",
        min_width: 600,
        q,
      },
    });

    let currentAspRatio = 0;
    let image;
    res.data.hits.forEach((img) => {
      const {
        previewURL,
        webformatURL,
        largeImageURL,
        id,
        type,
        tags,
        webformatWidth,
        webformatHeight,
      } = img;
      const aspRatio = webformatWidth / webformatHeight;
      if (aspRatio > currentAspRatio) {
        currentAspRatio = aspRatio;
        image = { previewURL, webformatURL, largeImageURL, id, type, tags };
      }
    });
    resolve(image);
  });
};

//articles - will be written to index.json
const articles = [];

//start fo generator
const main = async (topics) => {
  const promises = [];

  //iterate topics
  topics.forEach(async (topic) => {
    //for each topic generate content
    const { name } = topic;
    const promise = new Promise(async (resolve) => {
      const contentJSON = await generateBody(topic);
      articles.push(contentJSON);
      resolve(contentJSON);
    });
    promises.push(promise);

    promise.then((contentJSON) => {
      //write generated content to raw_data dir as json
      const dirPath = `../website/raw_data/${dateFormat(now, "m-d-yy")}/`;
      fs.ensureDirSync(dirPath);
      const filePath = `${dirPath}${slugify(name)}.json`;
      fs.writeFile(filePath, JSON.stringify(contentJSON), (err, data) => {
        console.log(err);
      });

      //bind data with template, create HTML string
      const pageHTMLContent = renderHTML(contentJSON);

      //write HTML content to resp file
      createHTMLFile(pageHTMLContent, topic);
    });
  });

  Promise.all(promises).then(() => {
    const dirPath = `../website/raw_data/${dateFormat(now, "m-d-yy")}/`;
    fs.ensureDirSync(dirPath);
    const filePath = `${dirPath}index.json`;
    fs.ensureFile(filePath)
      .then(() => {
        //file already exists
        fs.readFile(filePath, "utf8", (err, data) => {
          if (!data) {
            data = { articles: articles };
          } else {
            data = JSON.parse(data);
            data.articles = data.articles.concat(articles);
          }
          fs.writeFile(filePath, JSON.stringify(data), (err, data) => {
            console.log(err);
          });
        });
      })
      .catch((err) => {
        console.log(err);
      });
  });
};

fs.readFile("topics.json", "utf8", (err, topics) => {
  console.log(err);
  //read topics from topics.json
  main(JSON.parse(topics));
});
