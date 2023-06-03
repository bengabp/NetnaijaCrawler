const puppeteer = require('puppeteer-extra')
// Enable stealth plugin

const StealthPlugin = require('puppeteer-extra-plugin-stealth');
puppeteer.use( StealthPlugin())



const fs = require("fs");


const waitTillHTMLRendered = async (page, timeout = 30000) => {
    const checkDurationMsecs = 1000;
    const maxChecks = timeout / checkDurationMsecs;
    let lastHTMLSize = 0;
    let checkCounts = 1;
    let countStableSizeIterations = 0;
    const minStableSizeIterations = 3;

    while (checkCounts++ <= maxChecks) {
        let html = await page.content();
        let currentHTMLSize = html.length;

        let bodyHTMLSize = await page.evaluate(() => document.body.innerHTML.length);

        console.log('last: ', lastHTMLSize, ' <> curr: ', currentHTMLSize, " body html size: ", bodyHTMLSize);

        if (lastHTMLSize != 0 && currentHTMLSize == lastHTMLSize)
            countStableSizeIterations++;
        else
            countStableSizeIterations = 0; //reset the counter

        if (countStableSizeIterations >= minStableSizeIterations) {
            console.log("Page rendered fully..");
            break;
        }

        lastHTMLSize = currentHTMLSize;
        await page.waitForTimeout(checkDurationMsecs);
    }
};



async function OpenDetails(browser, details_url) {
    const details_page = await browser.newPage()
    await details_page.goto(details_url)
    console.log(await details_page.title())
    return details_page;
}

puppeteer.launch({
    headless: false, 
    args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-gpu'],

    ignoreHTTPSErrors: true,
    defaultViewport: { width: 1920, height: 1080 },
}).then(async browser => {
    // Create a new page 

    // Setting page view 

    // Go to the website 
    const page = await browser.newPage()

    //Dumb code to hide puppeter (i don't think they do smt but let's leave them here)
    await page.evaluateOnNewDocument(() => {
        // Disable navigator.webdriver detection
        Object.defineProperty(navigator, 'webdriver', {
            get: () => false,
        });

        // Remove chrome.runtime
        delete window.chrome.runtime;

        // Remove window.chrome
        delete window.chrome;
    });


    //await page.waitForTimeout(3000); 

    await page.goto('https://www.thenetnaija.net/videos/movies')

    //IDK if i will use cause it seems to be working but seems usefull
    //await waitTillHTMLRendered(page)

    const movieElements = await page.$$("div.video-files > article.file-one.shadow");

    movies = []

    for (const movieElement of movieElements) {
        const imageUrl = await movieElement.$eval("div.thumbnail img", (img) => img.src);
        const titleHyperlink = await movieElement.$("div.info h2 > a");
        const title = await page.evaluate((link) => link.textContent.trim(), titleHyperlink);
        const detailsUrl = await page.evaluate((link) => link.href, titleHyperlink);
        const uploadTime = await movieElement.$eval("div.info .meta .inner span[title]", (span) => span.title);
        const ratingElement = await movieElement.$(".rating span.rating-stars");
        const positiveStars = (await ratingElement.$$("i.filled")).length;
        const totalStars = (await ratingElement.$$("i")).length;
        const ratingStr = `${positiveStars}/${totalStars}`;

        const movieDetails = {
            image_url: imageUrl,
            title: title,
            details_url: detailsUrl,
            upload_time: uploadTime,
            rating: ratingStr,
        };


        console.log(`Movie => ${title}`);
        movies.push(movieDetails);
    }

    const moviesJson = JSON.stringify(movies, null, 4);
    fs.writeFileSync("movies.json", moviesJson);

    //Uncomment to open details page for the first movie
    //FirstMovieDetails = OpenDetails(movies[0].details_url);

    await browser.close();

});