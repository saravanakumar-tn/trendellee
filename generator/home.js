import fs from "fs";
import dateFormat from "dateformat";
import arrayShuffle from "array-shuffle";

import open from "open";
import Handlebars from "handlebars";

const now = new Date();

const renderHTML = (data) => {
  const source = fs
    .readFileSync("../website/base/base_home.html", "utf8")
    .toString();
  const template = Handlebars.compile(source, { noEscape: true });
  const output = template(data);
  return output;
};

const createHTMLFile = (htmlContent) => {
  const filePath = `../website/public/index.html`;
  fs.writeFile(filePath, htmlContent, (err, data) => {
    console.log("## Built home page !");
    open(filePath);
  });
};

fs.readFile(
  `../website/raw_data/${dateFormat(now, "m-d-yy")}/index.json`,
  "utf8",
  (err, data) => {
    data = JSON.parse(data);
    data.articles = arrayShuffle(data.articles);
    const pageHTMLContent = renderHTML(data);
    createHTMLFile(pageHTMLContent);
  }
);
