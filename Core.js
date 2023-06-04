const puppeteer = require('puppeteer-extra')
// Enable stealth plugin

const { DEFAULT_INTERCEPT_RESOLUTION_PRIORITY} = require("puppeteer")

const StealthPlugin  = require('puppeteer-extra-plugin-stealth')();
const AdblockerPlugin = require('puppeteer-extra-plugin-adblocker') //AddBlocker

//curiosity
// console.log(StealthPlugin.availableEvasions)

// console.log(StealthPlugin.enabledEvasions)
 

puppeteer.use( StealthPlugin )

puppeteer.use(
    AdblockerPlugin({
      // Optionally enable Cooperative Mode for several request interceptors
      interceptResolutionPriority: DEFAULT_INTERCEPT_RESOLUTION_PRIORITY
    }))


async function StealthBrowser(additional = {}, additionalArgs = []){

    const browser = await puppeteer.launch( 
    Object.assign( additional,
    {
       args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-gpu'  ].concat(...additionalArgs)    ,
       //uncomment to set headless
       //headless:  "new",  
       ignoreDefaultArgs: ["--enable-automation"],//Important
       //userDataDir: "./user_data", 
       defaultViewport: { width: 1920, height: 1080 },
       devtools: true,
       ignoreHTTPSErrors: true,
     }) );


     browser.StealthPage = async () => {
        const page = await browser.newPage()

     //Dumb code to hide puppeteer (i don't think they do smt but let's leave them here)
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
    

     page.waitTillHTMLRendered = async (page, timeout = 30000) => {
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
    

     

     return page;
     }
     return browser ;
    }

 
     

module.exports.StealthBrowser = StealthBrowser;