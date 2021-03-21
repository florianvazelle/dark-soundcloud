#!/usr/bin/env node
"use strict";

const esc = require("escape-string-regexp");
const fetchCss = require("fetch-css");
const remapCss = require("remap-css");
const {readFile} = require("fs").promises;
const {resolve, basename} = require("path");
const svg64 = require('svg64');

const {name, version, author, description} = require("../package.json");
const {writeFile, exit, glob} = require("./utils");

const sourceFiles = glob("src/*.css").sort((a, b) => {
  // main first
  if (a.endsWith("main.css")) return -1;
  if (b.endsWith("main.css")) return 1;
  // vars last
  if (a.endsWith("vars.css")) return 1;
  if (b.endsWith("vars.css")) return -1;
}).filter(file => basename(file) !== "template.css");

async function getImages() {
  let images = {svg: []};

  for (const path of glob("images/*.svg")) {
    images.svg[basename(path, ".svg")] = await readFile(path, "utf8");
  }

  return images;
}

async function main() {
  const [mappings, ignores, sources] = await Promise.all([
    require("../src/gen/mappings")(),
    require("../src/gen/ignores")(),
    require("../src/gen/sources")(),
  ]);

  const remapOpts = {
    ignoreSelectors: ignores,
    indentCss: 2,
    lineLength: 76,
    comments: false,
    stylistic: true,
    validate: true,
  };

  let css = await readFile(resolve(__dirname, "../src/template.css"), "utf8");
  css = css.trim()
    .replace("{{name}}", name)
    .replace("{{version}}", version)
    .replace("{{author}}", author)
    .replace("{{description}}", description);
  css = `${css}\n`;

  const sections = await Promise.all(sources.map(async source => {
    return remapCss(await fetchCss([source]), mappings, remapOpts);
  }));

  const allImages = await getImages();

  for (const sourceFile of sourceFiles) {
    let sourceCss = await readFile(sourceFile, "utf8");
    for (let [index, section] of Object.entries(sections)) {
      const source = sources[Number(index)];
      if (basename(source.file) === basename(sourceFile)) {
        const prefix = `  /* begin ${source.name} rules */`;
        const suffix = `  /* end ${source.name} rules */`;
        section = `${prefix}\n${section}\n${suffix}`;
        const re = new RegExp(`.*generated ${esc(source.name)} rules.*`, "gm");
        sourceCss = sourceCss.replace(re, section);
        
        // Replace image reference by base64 image 
        for (const [type, images] of Object.entries(allImages)) {
          for (const [_filename, image] of Object.entries(images)) {
            let result = "";
            if (type === "svg") {
                result = svg64(image);
            }
            const re = new RegExp(`--svg-${esc(_filename)}`, "gm");
            sourceCss = sourceCss.replace(re, result);
          }
        }
      }
    }
    
    css += `${sourceCss.trim()}\n`;
  }

  await writeFile(resolve(__dirname, "../dark-soundcloud.user.css"), css);
}

main().then(exit).catch(exit);
