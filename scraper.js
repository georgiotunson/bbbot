"use strict"
const cheerio = require("cheerio");
const axios = require("axios");

(async () => {
  try {
    const targetString = 'div[class="fulfillment-add-to-cart-button"] > div > div > button';
    const urls = [
      "https://www.bestbuy.com/site/sony-playstation-5-console/6426149.p?skuId=6426149&intl=nosplash",
      "https://www.bestbuy.com/site/microsoft-xbox-elite-wireless-controller-series-2-for-xbox-one-xbox-series-x-and-xbox-series-s-black/6352703.p?skuId=6352703&intl=nosplash",
      "https://www.bestbuy.com/site/microsoft-xbox-one-s-1tb-console-bundle-white/6415222.p?skuId=6415222&intl=nosplash",
    ];

    for (let i = 0; i < urls.length; i++) {
      const url = urls[i];
      const htmlResponse = (await axios.get(url)).data;
      const $ = cheerio.load(htmlResponse);
      const text = $(targetString);
      const status = text.text().trim();

      if (status === "Sold Out") {
        console.log(`[${new Date}] ${url}: ${status}`);
      } else if (status === "Add to Cart") {
        console.log(`[${new Date}] ${url}: ${status}`);
        console.log("BUY!");
      }
    }

  } catch (error) {
    if (error.errno === "ENOTFOUND") {
      console.log(`Couldn't resolve host "${error.config.url}" !`);
    } else {
      console.log(error);
    }
  }
})();
