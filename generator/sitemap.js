import { SitemapStream, streamToPromise } from "sitemap";
import { Readable } from "stream";
import fs, { link } from "fs";
import { readdir } from "node:fs/promises";

let links = [];
links.push({ url: "/", changefreq: "daily", priority: 0.5 });
const promises = [];
const dirs = await readdir("../website/raw_data", { recursive: true });

dirs.forEach((dir) => {
  const promise = new Promise((resolve) => {
    fs.readFile(
      `../website/raw_data/${dir}/index.json`,
      "utf8",
      (err, data) => {
        data = JSON.parse(data);
        resolve(
          links.concat(
            data.articles.map((a) => {
              return {
                url: `/${dir}/${a.article.slug}`,
                changefreq: "monthly",
                priority: 0.5,
              };
            })
          )
        );
      }
    );
  });
  promise.then((_links) => {
    links = _links;
  });
  promises.push(promise);
});

Promise.all(promises).then(() => {
  console.log(links.length);
  const stream = new SitemapStream({ hostname: "https://trendellee.com" });
  return streamToPromise(Readable.from(links).pipe(stream)).then((data) => {
    fs.writeFile(
      "../website/public/sitemap.xml",
      data.toString(),
      (err, data) => {
        if (err) console.log(err);
        console.log("## sitemap generated !");
      }
    );
  });
});

