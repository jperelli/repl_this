import { NextApiRequest, NextApiResponse } from "next";
import path from "path";
import Handlebars from "handlebars";
import temp from "fs-temp";
import axios from "axios";

import fs from "fs";
let playwright = require("playwright-aws-lambda");
if (!playwright) {
  playwright = require("playwright");
}

export default async (req: NextApiRequest, res: NextApiResponse) => {
  let browser = null;
  let source = req.query.c;
  let output = 'Error invalid code'

  try {
    const browser = await playwright.launchChromium();
    const context = await browser.newContext({});

    const page = await context.newPage();
    await page.setViewportSize({
      width: 1500,
      height: 10,
    });
    console.log(req.query.c);

    try {
      source = (
        await axios.post("https://69ee0f2dac98.ngrok.io/api/py_pretty", {
          code: req.query.c,
        })
      ).data;
      output = (
        await axios.post("https://69ee0f2dac98.ngrok.io/api/py_exec", {
          code: req.query.c,
        })
      ).data;
    } catch (e) {
      console.log('axios error');
    }
    const template = Handlebars.compile(
      fs.readFileSync(path.join(__dirname, "template.html"), "utf8")
    );
    const htmlstr = template({ source, output, language: "python" });
    const path_htmlstr = temp.template("%s.html").writeFileSync(htmlstr);

    await page.goto(`file:${path_htmlstr}`);

    const buffer = await (await page.$("#all")).screenshot({ fullPage: true });
    res.writeHead(200, {
      "Content-Type": "image/png",
      "Content-Length": buffer.length,
    });
    res.end(buffer);
  } catch (error) {
    res.end("Error");
    // throw error;
  } finally {
    if (browser) {
      await browser.close();
    }
  }
};
