"user strict";
const puppeteer = require("puppeteer");

// fills form fields using user info
const fillForm = async (fields, userInfo, page) => {
  let fieldKeys = Object.keys(fields);
  for (let i = 0; fieldKeys.length > i; i++) {
    let field = fieldKeys[i];
    let fieldObj = fields[field];
    if (fieldObj.kind === "type") {
      const input = await page.$(fieldObj.selector);
      await input.click({ clickCount: 3 });
      await page.type(fieldObj.selector, userInfo[field] /*, { delay: 720 }*/);
    } else if (fieldObj.kind === "select") {
      await page.select(fieldObj.selector, userInfo[field]);
    }
  }
};

// automates page navigation and purchase
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

    // add item to cart & wait for go to cart button
    await page.click('div[class="fulfillment-add-to-cart-button"] > div > div > button');
    await page.waitForSelector('div[class="go-to-cart-button"] > a');

    // await page navigation and button press
    await Promise.all([
      page.click('div[class="go-to-cart-button"] > a'),
      page.waitForNavigation({ waitUntil: "networkidle0" }),
    ]);

    // always use shipping and not pickup
    await page.waitForSelector(
      'div[class="fluid-item__availability"] > form > div[class="availability__list"] > fieldset > div > div > div > div > div > input[id^="fulfillment-shipping"]'
    );
    await page.click(
      'div[class="fluid-item__availability"] > form > div[class="availability__list"] > fieldset > div > div > div > div > div > input[id^="fulfillment-shipping"]'
    );

    // update zip code
    await page.click('button[class="btn-default-link change-zipcode-link"]');
    await page.waitForSelector('div[class="update-zip__input "] > input[id="location"]');
    await page.type('div[class="update-zip__input "] > input[id="location"]', "90034");
    await page.waitForSelector(
      'div[class="update-zip__input-group"] > div > button[class="btn btn-secondary btn-md"]'
    );
    await page.click(
      'div[class="update-zip__input-group"] > div > button[class="btn btn-secondary btn-md"]'
    );

    //await page.waitFor(500)
    //await page.content()
    // need to reload here
    await page.reload({ waitUntil: "networkidle0" });

    // checkout
    await Promise.all([
      page.click('div[class="checkout-buttons__checkout"] > button'),
      page.waitForNavigation({ waitUntil: "networkidle0" }),
    ]);

    // checkout as guest
    await Promise.all([
      page.click('div[class="cia-guest-content"] > div[class="button-wrap "] > button'),
      page.waitForNavigation({ waitUntil: "networkidle0" }),
    ]);

    // do not use autocomplete for address
    await page.click('div[class="clearFloat"] > div[class="autocomplete__wrapper"] > button');

    // shipping address
    const shippingAddr = {
      firstName: "Bill",
      lastName: "Gates",
      state: "CA",
      street: "2823 S Corning St",
      city: "Los Angeles",
      zipcode: "90034",
      email: "iCow23@yahoo.com",
      phone: "3102834102",
    };

    // shipping address form
    const shippingAddrFields = {
      firstName: { kind: "type", selector: '[id="consolidatedAddresses.ui_address_2.firstName"]' },
      lastName: { kind: "type", selector: '[id="consolidatedAddresses.ui_address_2.lastName"]' },
      state: { kind: "select", selector: '[id="consolidatedAddresses.ui_address_2.state"]' },
      street: { kind: "type", selector: '[id="consolidatedAddresses.ui_address_2.street"]' },
      city: { kind: "type", selector: '[id="consolidatedAddresses.ui_address_2.city"]' },
      zipcode: { kind: "type", selector: '[id="consolidatedAddresses.ui_address_2.zipcode"]' },
      email: { kind: "type", selector: '[id="user.emailAddress"]' },
      phone: { kind: "type", selector: '[id="user.phone"]' },
    };

    // fill shipping address
    await fillForm(shippingAddrFields, shippingAddr, page);

    // continue to billing
    await Promise.all([
      page.click('div[class="button--continue"] > button'),
      page.waitForNavigation({ waitUntil: "networkidle0" }),
    ]);

    // first enter credit card num to spawn below fields
    await page.type('[id="optimized-cc-card-number"]', "4815820130002525");
    // below fields only show after entering credit card num
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

    // don't use autocomplete for address
    await page.click('div[class="clearFloat"] > div[class="autocomplete__wrapper"] > button');

    // billing address
    const billingAddr = {
      firstName: "Bill",
      lastName: "Gates",
      state: "CA",
      street: "218 Broadway Street",
      city: "Lake Elsinore",
      zipcode: "92530",
    };

    // billing address form
    const billingAddrFields = {
      firstName: { kind: "type", selector: '[id="payment.billingAddress.firstName"]' },
      lastName: { kind: "type", selector: '[id="payment.billingAddress.lastName"]' },
      state: { kind: "select", selector: '[id="payment.billingAddress.state"]' },
      street: { kind: "type", selector: '[id="payment.billingAddress.street"]' },
      city: { kind: "type", selector: '[id="payment.billingAddress.city"]' },
      zipcode: { kind: "type", selector: '[id="payment.billingAddress.zipcode"]' },
    };

    // fill form
    await fillForm(billingAddrFields, billingAddr, page);

    // place order
    await Promise.all([
      page.click('div[class="button--place-order"] > button'),
      page.waitForNavigation({ waitUntil: "networkidle0" }),
    ]);

    // take a screenshot and wrap up
    await page.screenshot({ path: "log.png" });
    // close browser
    //await browser.close();
  } catch (error) {
    console.log(error);
  }
})();
