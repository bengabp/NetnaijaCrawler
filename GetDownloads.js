//Not Completed yet

const { StealthBrowser } = require("./Core")

 
   
async function Main(){
    const browser = await StealthBrowser();

    let MovieDetails = await browser.StealthPage();
    await MovieDetails.goto("https://www.thenetnaija.net/videos/movies/18807-shooting-stars-2023")

 
    //await MovieDetails.waitTillHTMLRendered()
    await MovieDetails.click("#content > div > div > div.content-grid > div.content-main > main > article > div.download-block-con > div > div > div:nth-child(1) > a");

    const btn =  await MovieDetails.waitForSelector ("#action-buttons-con > div > button");
    await btn.click();
 }


Main();
