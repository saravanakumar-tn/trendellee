import fs from "fs";
import arrayShuffle from "array-shuffle";

import Handlebars from "handlebars";

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
  });
};

fs.readFile("../website/raw_data/index.json", "utf8", (err, data) => {
  data = JSON.parse(data);
  data.articles = arrayShuffle(data.articles).slice(0, 10);
  const pageHTMLContent = renderHTML(data);
  createHTMLFile(pageHTMLContent);
});
