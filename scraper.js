"use strict";
const cheerio = require("cheerio");
const axios = require("axios");
const purchaser = require("./purchaser");

(async () => {
  try {
    const targetString = 'div[class="fulfillment-add-to-cart-button"] > div > div > button';
    const urls = [
      "https://www.bestbuy.com/site/nvidia-geforce-rtx-3060-ti-8gb-gddr6-pci-express-4-0-graphics-card-steel-and-black/6439402.p?acampID=0&cmp=RMX&loc=Hatch&ref=198&skuId=6439402&intl=nosplash",
    ];

    for (let i = 0; i < urls.length; i++) {
      const url = urls[i];
      const htmlResponse = (await axios.get(url)).data;
      const $ = cheerio.load(htmlResponse);
      const text = $(targetString);
      const status = text.text().trim();

      if (status === "Sold Out") {
        console.log(`[${new Date()}] ${url}: ${status}`);
        await purchaser.makePurchase();
        process.exit(1);
      } else if (status === "Add to Cart") {
        console.log(`[${new Date()}] ${url}: ${status}`);
        await purchaser.makePurchase();
        process.exit(1);
      }
    }
  } catch (error) {
    if (error.errno === "ENOTFOUND") {
      throw new Error(`Couldn't resolve host "${error.config.url}" !`);
      process.exit(1);
    } else {
      throw error;
      process.exit(1);
    }
  }
})();
