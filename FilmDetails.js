const { StealthBrowser } = require("./Core")
 

const fs = require("fs")


OpenDetails = async function (Browser, details_url) {
    const details_page = await Browser.StealthPage()
    await details_page.goto(details_url)
    //console.log(await details_page.title())
    return details_page;
}


const Main = async ()=>{

const browser = await StealthBrowser();

  
const page = await browser.StealthPage();

await page.waitForTimeout(3000);

await page.goto('https://www.thenetnaija.net/videos/movies')

//IDK if i will use this cause it seems to be working, but seems usefull.
//await page.waitTillHTMLRendered( )

const movieElements = await page.$$("div.video-files > article.file-one.shadow");

let movies = []

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
FirstMovieDetailsPage = await OpenDetails(browser, movies[0].details_url);
//console.log(FirstMovieDetailsPage)
await browser.close();
}

 Main();