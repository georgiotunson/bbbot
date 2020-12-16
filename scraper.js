"use strict";
const cheerio = require("cheerio");
const axios = require("axios");
const purchaser = require("./purchaser");
const config = require("./config");

(async () => {
  try {
    console.log("starting")
    const targetString = 'div[class="fulfillment-add-to-cart-button"] > div > div > button';
    const urls = [
      //"https://www.bestbuy.com/site/nvidia-geforce-rtx-3060-ti-8gb-gddr6-pci-express-4-0-graphics-card-steel-and-black/6439402.p?acampID=0&cmp=RMX&loc=Hatch&ref=198&skuId=6439402&intl=nosplash",
      //"https://www.bestbuy.com/site/microsoft-xbox-series-x-1tb-console-black/6428324.p?skuId=6428324&intl=nosplash"
      config.userInfo.targetPurchaseURLs[0]
    ];

    for (let i = 0; i < urls.length; i++) {
      const url = urls[i];
      const htmlResponse = (await axios.get(url, {timeout: 8000})).data;
      //console.log(htmlResponse)
      const $ = cheerio.load(htmlResponse);
      const text = $(targetString);
      const status = text.text().trim();

      if (status === "Sold Out") {
        console.log(`[${new Date()}] ${url}: ${status}`);
      } else if (status === "Add to Cart") {
        console.log(`[${new Date()}] ${url}: ${status}`);
        await purchaser.makePurchase();
        process.exit(1);
      } else {
        console.log(`[${new Date()}] ${url}: ${status}`);
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
