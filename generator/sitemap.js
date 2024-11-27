import { SitemapStream, streamToPromise } from "sitemap";
import { Readable } from "stream";
import fs from "fs";

fs.readFile("../website/raw_data/index.json", "utf8", (err, data) => {
  data = JSON.parse(data);
  const links = data.articles.map((a) => {
    return { url: `/${a.article.slug}`, changefreq: "monthly", priority: 0.5 };
  });

  links.push({ url: "", changefreq: "daily", priority: 0.5 });

  const stream = new SitemapStream({ hostname: "https://trendellee.com" });

  return streamToPromise(Readable.from(links).pipe(stream)).then((data) => {
    fs.writeFile(
      "../website/public/sitemap.xml",
      data.toString(),
      (err, data) => {
        console.log("## sitemap generated !");
      }
    );
  });
});
