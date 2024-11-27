import fs from "fs";

fs.readFile("../website/raw_data/index.json", "utf8", (err, data) => {
  data = JSON.parse(data);
  const filtered = [];
  data.articles.forEach((a) => {
    if (!filtered.find((b) => b.article.slug === a.article.slug)) {
      filtered.push(a);
    }
  });
  fs.writeFile(
    "../website/raw_data/index.json",
    JSON.stringify({ articles: filtered }),
    (err, data) => {
      console.log("## Done !");
    }
  );
});
