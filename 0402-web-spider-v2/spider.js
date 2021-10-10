import fs from "fs";
import superagent from "superagent";
import mkdirp from "mkdirp";
import { urlToFilename, getPageLinks } from "./utils.js";

const saveFile = (filename, contents, cb) => {
  mkdirp(`${filename}`)
    .then(filename => {
      fs.writeFile(`${filename}/text.html`, contents, cb);
    })
    .catch(err => {
      cb(err);
    });
};
const download = (url, filename, cb) => {
  console.log(`Downloading ${url}`);
  superagent.get(url).end((err, res) => {
    if (err) {
      return cb(err);
    }
    saveFile(filename, res.text, err => {
      if (err) {
        return cb(err);
      }
      console.log(`Downloaded and saved: ${url}`);
      cb(null, res.text);
    });
  });
};
const spiderLinks = (currentUrl, body, nesting, cb) => {
  if (nesting === 0) {
    return process.nextTick(cb);
  }

  const links = getPageLinks(currentUrl, body);

  if (links.length === 0) {
    return cb();
  }

  function iterate (index) {
    if (index === links.length) {
      return cb();
    }

    spider(links[index], nesting - 1, (err) => {
      if (err) {
        return cb(err);
      }
      iterate(index + 1);
    });
  }

  iterate(0);
};

export function spider (url, nesting, cb) {
  console.log(url);
  const filename = `${urlToFilename(url)}/text.html`;

  fs.readFile(filename, "utf8", (err, fileContent) => {
    if (err) {
      if (err.code !== "ENOENT") {
        return cb(err);
      }

      return download(url, filename, (err, requestContent) => {
        if (err) {
          return cb(err);
        }

        spiderLinks(url, requestContent, nesting, cb);
      });
    }

    spiderLinks(url, fileContent, nesting);
  });
}
