"user strict";
const puppeteer = require("puppeteer");

(async () => {
  try {
    const browser = await puppeteer.launch({
      headless: false,
      defaultViewport: null,
      args: ["--window-size=1920,1080"],
    });
    const page = await browser.newPage();
    await page.goto(
      "https://www.bestbuy.com/site/microsoft-xbox-elite-wireless-controller-series-2-for-xbox-one-xbox-series-x-and-xbox-series-s-black/6352703.p?skuId=6352703&intl=nosplash"
    );
    //await page.screenshot({ path: "example.png" });
    await page.click('div[class="fulfillment-add-to-cart-button"] > div > div > button');
    await page.waitForSelector('div[class="go-to-cart-button"] > a');

    // await page navigation and button press
    await Promise.all([
      page.click('div[class="go-to-cart-button"] > a'),
      page.waitForNavigation({ waitUntil: "networkidle0" }),
    ]);

    await page.click('button[class="btn-default-link change-zipcode-link"]');

    await page.waitForSelector('div[class="update-zip__input "] > input[id="location"]');

    await page.type('div[class="update-zip__input "] > input[id="location"]', "90034");

    await page.waitForSelector(
      'div[class="update-zip__input-group"] > div > button[class="btn btn-secondary btn-md"]'
    );

    await page.click(
      'div[class="update-zip__input-group"] > div > button[class="btn btn-secondary btn-md"]'
    );

    await page.reload({ waitUntil: "networkidle0" });

    await Promise.all([
      page.click('div[class="checkout-buttons__checkout"] > button'),
      page.waitForNavigation({ waitUntil: "networkidle0" }),
    ]);

    await Promise.all([
      page.click('div[class="cia-guest-content"] > div[class="button-wrap "] > button'),
      page.waitForNavigation({ waitUntil: "networkidle0" }),
    ]);

    // regular address
    await page.type('[id="consolidatedAddresses.ui_address_2.firstName"]', "Bill");
    await page.type('[id="consolidatedAddresses.ui_address_2.lastName"]', "Gates");
    await page.select('[id="consolidatedAddresses.ui_address_2.state"]', "CA");
    await page.type('[id="consolidatedAddresses.ui_address_2.street"]', "2823 S Corning St");
    await page.type('[id="consolidatedAddresses.ui_address_2.city"]', "Los Angeles");
    await page.type('[id="consolidatedAddresses.ui_address_2.zipcode"]', "90034");
    await page.type('[id="user.emailAddress"]', "iCow23@yahoo.com");
    await page.type('[id="user.phone"]', "3102834102");

    await Promise.all([
      page.click('div[class="button--continue"] > button'),
      page.waitForNavigation({ waitUntil: "networkidle0" }),
    ]);
    await page.type('[id="optimized-cc-card-number"]', "4815820130002525");
    await page.waitForSelector(
      'label[id="credit-card-expiration-month"] > div > div > select[class="c-dropdown v-medium c-dropdown v-medium smart-select"]'
    );
    await page.select(
      'label[id="credit-card-expiration-month"] > div > div > select[class="c-dropdown v-medium c-dropdown v-medium smart-select"]',
      "04"
    );
    await page.waitForSelector(
      'label[id="credit-card-expiration-year"] > div > div > select[class="c-dropdown v-medium c-dropdown v-medium smart-select"]'
    );
    await page.select(
      'label[id="credit-card-expiration-year"] > div > div > select[class="c-dropdown v-medium c-dropdown v-medium smart-select"]',
      "2021"
    );
    await page.waitForSelector('[id="credit-card-cvv"]');
    await page.type('[id="credit-card-cvv"]', "598");

    // billing address
    const billingAddr = {
      firstName: "Bill",
      lastName: "Gates",
      street: "218 Broadway Street",
      state: "CA",
      city: "Lake Elsinore",
      zipcode: "92530",
    };

    const billingAddrFields = {
      firstName: { kind: "type", selector: '[id="payment.billingAddress.firstName"]' },
      lastName: { kind: "type", selector: '[id="payment.billingAddress.lastName"]' },
      street: { kind: "type", selector: '[id="payment.billingAddress.street"]' },
      state: { kind: "select", selector: '[id="payment.billingAddress.state"]' },
      city: { kind: "type", selector: '[id="payment.billingAddress.city"]' },
      zipcode: { kind: "type", selector: '[id="payment.billingAddress.zipcode"]' },
    };

    let fieldKeys = Object.keys(billingAddrFields);
    for (let i = 0; fieldKeys.length > i; i++) {
      let field = fieldKeys[i];
      let fieldObj = billingAddrFields[field];
      console.log(fieldObj);
      if (fieldObj.kind === "type") {
        const input = await page.$(fieldObj.selector);
        await input.click({ clickCount: 3 });
        await page.type(fieldObj.selector, billingAddr[field], { delay: 100 });
      } else if (fieldObj.kind === "select") {
        await page.select(fieldObj.selector, billingAddr[field]);
      }
    }

    await Promise.all([
      page.click('div[class="button--place-order"] > button'),
      page.waitForNavigation({ waitUntil: "networkidle0" }),
    ]);

    await page.screenshot({ path: "example.png" });
    //await browser.close();
  } catch (error) {
    if (error.errno === "ENOTFOUND") {
      console.log(`Couldn't resolve host "${error.config.url}" !`);
    } else {
      console.log(error);
    }
  }
})();
