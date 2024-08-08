import puppeteer from "puppeteer-core"
import { executablePath } from "puppeteer"
import chromium from "@sparticuz/chromium-min"
import cheerio from "cheerio"

const expediaHotelSearch = async (hotelId: string, hotelName: string, latLong: string, guests: string, startDate: string, endDate: string, expediaCookie: string) => {
	try {
		if (expediaCookie === "") {
			console.log("ERR: No cookie provided")
			return false
		}

		const urlParams = [
			`destination=${encodeURIComponent(hotelName)}`,
			"regionId",
			"flexibility=0_DAY",
			`d1=${startDate}`,
			`startDate=${startDate}`,
			`d2=${endDate}`,
			`endDate=${endDate}`,
			`adults=${guests}`,
			`latLong=${encodeURIComponent(latLong)}`,
			"rooms=1",
			"theme=",
			"userIntent=",
			"semdtl=",
			"useRewards=true",
			"sort=RECOMMENDED",
			`selected=${hotelId}`,
			"allowPreAppliedFilters=false",
		]
		const url = `https://www.expedia.com/Hotel-Search?${urlParams.join("&")}`

		console.log("****SCRAPE EXPEDIA WEBSITE****")
		console.log("url", url)
		// 1. Launch puppeteer and retrieve the url given
		// const browser = await puppeteer.launch({
		//   args: chromium.args,
		//   defaultViewport: chromium.defaultViewport,
		//   executablePath: await chromium.executablePath(),
		//   headless: chromium.headless,
		//   ignoreHTTPSErrors: true,
		// });

		// // ***only for local testing***
		// const browser = await puppeteer.launch({
		//   executablePath: executablePath(),
		// });

		const onLocal = process.env.ON_LOCAL === "true" || false

		// ***only for local testing***
		let browserOptions: object = {
			executablePath: executablePath(),
		}

		if (!onLocal) {
			browserOptions = {
				args: chromium.args,
				defaultViewport: chromium.defaultViewport,
				executablePath: await chromium.executablePath(),
				// executablePath: await chromium.executablePath(
				//   `https://github.com/Sparticuz/chromium/releases/download/v116.0.0/chromium-v116.0.0-pack.tar`
				// ),
				headless: chromium.headless,
				ignoreHTTPSErrors: true,
			}
		}

		const browser = await puppeteer.launch(browserOptions)

		const page = await browser.newPage()
		await page.setExtraHTTPHeaders({
			accept: "*/*",
			"user-agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/127.0.0.0 Safari/537.36",
			cookie: expediaCookie,
		})
		// Navigate the page to a URL.
		await page.goto(url, {
			timeout: 20 * 1000,
			waitUntil: ["domcontentloaded"],
		})
		// Extract only element with the listing-results
		// NOTE: if reached the maximum searches with not logged in account you would get ""
		const htmlData = await page.evaluate(() => document.querySelector('div[data-stid="property-listing-results"]')?.outerHTML)
		await browser.close()

		// if no data is scraped then return error
		if (htmlData === undefined) return "Error: No data found"
		// console.log('htmlData', htmlData);

		// 2. Parse the html. Get hotel headings (h3.uitk-heading) and hotel Prices (div.uitk-text.uitk-type-500)
		const $ = cheerio.load(htmlData)
		const singleTiles = $("div.uitk-card.uitk-card-roundcorner-all.uitk-card-has-border")

		let targetHotel: { hotel: string; price: string } | null = null
		let allHotels: { hotel: string; price: string }[] = []

		singleTiles.map((ind, item) => {
			const hotelName = $(item).find("h3.uitk-heading").text()
			const price = $(item).find("div.uitk-text.uitk-type-500").text()
			const link = $(item).find("a").attr("href")
			const linkData = link?.split("Hotel-Information?")[0]
			if (linkData?.includes(hotelId))
				targetHotel = {
					hotel: hotelName,
					price: price,
				}
			allHotels.push({
				hotel: hotelName,
				price: price,
			})
		})
		// console.log(allHotels);
		console.log("targetHotel", targetHotel)
		if (targetHotel) return targetHotel
		return { message: "No Match Found", alternatives: allHotels }
	} catch (error: any) {
		console.log("error")
		console.log(error)
		return { message: error.message, error: error as Error }
	}
}

export default expediaHotelSearch
