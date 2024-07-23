const { chromium } = require('playwright');
const fs = require('fs');

async function scraping(link){
    
    const browser = await chromium.launch({ headless: true });

    const context = await browser.newContext();
    const page = await context.newPage();

    try{
        const cookies = require('./cookies.json');
        await context.addCookies(cookies);
        await page.goto(link);
    }
    catch{
        await page.goto(link);
        await page.getByRole('button', {name: 'Accetta'}).click();
        const cookies = await context.cookies()
        fs.writeFileSync('./cookies.json', JSON.stringify(cookies, null, 2));
    }

    console.log(link);
    const product = {};

    const id = page.url().split('/')[4].split('?')[0];
    product.id = id;
    product.name = await page.locator('span[id="productTitle"]').innerText();

    let price;
    try{
        price = (await page.locator('div[id="corePrice_feature_div"]').first().innerText()).split('\n')[0].replace(',', '.');
    }
    catch{
        price = null;
    }

    if(price != null){
        const currency = price[price.length - 1];
        product.price = price.slice(0, -1);
    
        if((await page.locator('div[id="corePriceDisplay_desktop_feature_div"]').first().textContent()).includes('%')){
            product.standardPrice = (await page.locator('span[class="a-price a-text-price"]').first().textContent()).split(currency)[0].replace(',', '.');
            product.discount = Math.round(100 - (product.price * 100 / product.standardPrice));
        }
        else{
            product.standardPrice = product.price;
            product.discount = 0
        }
        product.currency = currency;
    }
    else{
        product.price = null;
        product.standardPrice = null;
        product.discount = 0;
        product.currency = null;
    }

    await page.waitForTimeout(2000);
    //save image
    if(!fs.existsSync(`./assets/images/products/${id}.png`)){
        await page.locator('img[id="landingImage"]').screenshot({path: `./assets/images/products/${id}.png`});
    }

    browser.close();
    return product;
}

module.exports = scraping;