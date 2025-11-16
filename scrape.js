import puppeteer from "puppeteer";
// Node file system module
import fs from "fs";

const scrape = async () => {
    // headless browser (browser w/o gui)
    const browser = await puppeteer.launch()
    // creates new page in browser
    const page = await browser.newPage()
    
    // Variables for iterating through multiple pages
    const allCoins = []
    let currentPage = 1
    const maxPages = 5

    while(currentPage <= maxPages) {
        // url we are scraping
        const url = `https://coinmarketcap.com/?page=${currentPage}`
        // uses pages obj to interact with new window
        await page.goto(url)
        // allows us to run javascript in context of the page
        const coins = await page.evaluate(() => {
            // Selects product class (All coins)
            //const coinElements = document.querySelectorAll('*[style="cursor:pointer"]')

            const coinElements = document.querySelectorAll('tr[style="cursor: pointer;"]')

            // Puts product objects into an array
            return Array.from(coinElements).map(coin => {
                // Creates new array with data were looking for (name, price, marketCap, volume)
                const name = coin.querySelector("p.coin-item-name").textContent
                // const price = coin.querySelector('table > tbody > tr > td > div > span').textContent
                // const marketCap = coin.querySelector('span.sc-11478e5d-0.chpohi').textContent 
                // const volume = coin.querySelector('table > tbody > tr > td > div > a > p').textContent
                // returns object with all the data
                return {name}
            })

        })

        // Pushes objects(coins) into an array
        //allCoins.push(...coins)
        console.log(`Coins on page ${currentPage}: `, coins)
        // Increments currentPage until it equals max page
        currentPage++
    }

    // saves data to coins.json
    //fs.writeFileSync('coins.json', JSON.stringify(allCoins, null, 2))

    //console.log('Data saved to coins.json')

    // close browser when done
    await browser.close();
}

scrape();