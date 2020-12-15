"use strict";
const readline = require("readline");
const fs = require("fs");
const util = require("util");

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
});

const getUserInput = (question) => {
    return new Promise((resolve) => {
        rl.question(question, (answer) => {
            resolve(answer);
        });
    });
};

const validateCreateInfo = async (purchaserInfo) => {
    console.info(purchaserInfo);
    console.info(); // new line
    let isInfoValid = await validateInfo("Is the above information correct? (yes/no) ", 0);
    if (isInfoValid === true) {
        return purchaserInfo;
    } else if (isInfoValid === false) {
        return await validateCreateInfo(await createInfoObj());
    } else if (isInfoValid === 1) {
        return 1;
    }
};

const validateInfo = (question, depth) => {
    const yes = ["yes", "y"];
    const no = ["no", "n"];
    const maxDepth = 5;

    // if recursion reaches maximum depth, return 1
    if (depth >= maxDepth) {
        return 1;
    }
    return new Promise((resolve) => {
        rl.question(question, (answer) => {
            if (yes.includes(answer.toLowerCase())) {
                resolve(true);
            } else if (no.includes(answer.toLowerCase())) {
                resolve(false);
            } else {
                // :) yes, this is a smiley face
                let repeatPhrase = "Please enter 'yes' or 'no': ";
                if (!question.includes(repeatPhrase)) {
                    resolve(validateInfo(repeatPhrase + question, depth + 1));
                } else {
                    resolve(validateInfo(question, depth + 1));
                }
            }
        });
    });
};

const createInfoObj = async () => {
    return {
        shippingAddr: {
            firstName: await getUserInput("What is your shipping first name? "),
            lastName: await getUserInput("What is your shipping last name? "),
            state: await getUserInput("What is your shipping state? "),
            city: await getUserInput("What is your shipping city? "),
            zipcode: await getUserInput("What is your shipping zipcode? "),
            street: await getUserInput("What is your shipping street address? "),
        },
        billingAddr: {
            firstName: await getUserInput("What is your billing first name? "),
            lastName: await getUserInput("What is your billing last name? "),
            state: await getUserInput("What is your billing state? "),
            city: await getUserInput("What is your billing city? "),
            zipcode: await getUserInput("What is your billing zipcode? "),
            street: await getUserInput("What is your billing street address? "),
        },
        constactInfo: {
            email: await getUserInput("What is your email? "),
            phone: await getUserInput("What is your phone number? "),
        },
        paymentInfo: {
            creditCardNumber: await getUserInput(
                "What is your credit card number with no spaces? "
            ),
            creditCardSecCode: await getUserInput("What is your credit card security code? "),
            creditCardExpMonth: await getUserInput(
                'Credit card expiration month in the following format: "04" '
            ),
            creditCardExpDay: await getUserInput(
                'Credit card expiration day in the following format: "04" '
            ),
            creditCardExpYear: await getUserInput(
                'Credit card expiration year in the following format: "2020" '
            ),
        },
        targetPurchaseURLs: [
            await getUserInput("What is the url of the item that you would like to purchase? "),
        ],
    };
};

// main
(async () => {
    try {
        const purchaserInfo = await createInfoObj();
        const validatedInfo = await validateCreateInfo(purchaserInfo);
        if (validatedInfo === 1) {
            console.info("Maximum tries exceeded!");
            process.exit(1);
        } else {
            // generate config
            const configString = `"user strict";

const userInfo = ${util.inspect(validatedInfo)}

module.exports = {
  userInfo,
}`;
            console.log(bigString);
            fs.writeFileSync(__dirname + "/config.js", configString, "utf-8");
        }
        rl.close();
    } catch (error) {
        throw error;
    }
})();
