import http from "node:http";
import { createReadStream, statSync, existsSync } from "node:fs";
import { extname, join, normalize } from "node:path";
const root = process.env.ROOT || "dist";
const types = { ".html":"text/html", ".css":"text/css", ".js":"text/javascript", ".mjs":"text/javascript",
  ".png":"image/png", ".jpg":"image/jpeg", ".webp":"image/webp", ".avif":"image/avif", ".svg":"image/svg+xml",
  ".mp4":"video/mp4", ".woff2":"font/woff2", ".xml":"application/xml", ".txt":"text/plain", ".json":"application/json" };
http.createServer((req, res) => {
  let p = decodeURIComponent(req.url.split("?")[0]);
  let f = join(root, normalize(p));
  if (existsSync(f) && statSync(f).isDirectory()) f = join(f, "index.html");
  if (!existsSync(f)) { res.writeHead(404); return res.end("not found"); }
  res.writeHead(200, { "content-type": types[extname(f)] || "application/octet-stream", "content-length": statSync(f).size });
  createReadStream(f).pipe(res);
}).listen(4340, () => console.log("serving dist on 4340"));
