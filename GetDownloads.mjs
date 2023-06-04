//Not Completed yet

const { StealthBrowser } = require("./Core")

 

let MovieDetails = await  StealthBrowser.StealthPage();
await MovieDetails.goto("https://www.thenetnaija.net/videos/movies/18807-shooting-stars-2023")

const download = await MovieDetails.$$("#content > div > div > div.content-grid > div.content-main > main > article > div.download-block-con > div > div > div:nth-child(1) > a");
await MovieDetails.click("#content > div > div > div.content-grid > div.content-main > main > article > div.download-block-con > div > div > div:nth-child(1) > a");