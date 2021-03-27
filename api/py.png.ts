import { NextApiRequest, NextApiResponse } from "next";
import path from "path";
import Handlebars from "handlebars";
import axios from "axios";
import fs from "fs";
import chrome from "chrome-aws-lambda";
import puppeteer from "puppeteer-core";
// let playwright = require("playwright-aws-lambda");
// if (!playwright) {
//   playwright = require("playwright");
// }

export default async (req: NextApiRequest, res: NextApiResponse) => {
  let browser = null;
  let source = req.query.c;
  let output = "Error invalid code";

  try {
    try {
      source = (
        await axios.post(
          `${process.env.NO_SSL ? "http" : "https"}://${
            process.env.VERCEL_URL
          }/api/py_pretty`,
          {
            code: req.query.c,
          }
        )
      ).data;
      output = (
        await axios.post(
          `${process.env.NO_SSL ? "http" : "https"}://${
            process.env.VERCEL_URL
          }/api/py_exec`,
          {
            code: req.query.c,
          }
        )
      ).data;
    } catch (e) {
      console.log("axios error");
    }
    const template = Handlebars.compile(
      fs.readFileSync(path.join(__dirname, "template.html"), "utf8")
    );
    const htmlstr = template({ source, output, language: "python" });

    const browser = await puppeteer.launch({
      args: [
        ...chrome.args,
        "--no-sandbox",
        "--disable-setuid-sandbox",
        "--disable-web-security",
      ],
      defaultViewport: chrome.defaultViewport,
      executablePath: await chrome.executablePath,
      headless: true,
      ignoreHTTPSErrors: true,
      dumpio: true,
    });
    const page = await browser.newPage();
    await page.setViewport({
      width: 1200,
      height: 10,
    });
    await page.setContent(htmlstr, {
      waitUntil: "domcontentloaded",
      timeout: 5000,
    });
    const buffer = await (await page.$("#all")).screenshot() as Buffer;

    // const browser = await playwright.launchChromium();
    // const context = await browser.newContext({});
    // const page = await context.newPage();
    // await page.setViewportSize({
    //   width: 1500,
    //   height: 10,
    // });
    // console.log(req.query.c);
    // const path_htmlstr = temp.template("%s.html").writeFileSync(htmlstr);
    // await page.goto(`file:${path_htmlstr}`);
    // const buffer = await (await page.$("#all")).screenshot({ fullPage: true });

    res.writeHead(200, {
      "Content-Type": "image/png",
      "Content-Length": buffer.length,
    });
    res.end(buffer);
  } catch (error) {
    res.end("Error");
    console.log(error);
    // throw error;
  } finally {
    if (browser) {
      await browser.close();
    }
  }
};
