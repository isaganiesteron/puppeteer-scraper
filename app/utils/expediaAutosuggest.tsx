import puppeteer from "puppeteer-core"
import fs from "fs"

const expediaAutosuggest = async (hotelName: string, expediaCookie: string) => {
	try {
		if (expediaCookie === "") {
			console.log("ERR: No cookie provided")
			return false
		}

		console.log("***expediaHotelInfo***")
		const urlParameters = [
			"browser=Chrome",
			"client=SearchForm",
			"dest=true",
			"device=Desktop",
			"features=consistent_display|google",
			"format=json",
			"listing=false",
			"lob=HOTELS",
			"locale=en_US",
			"maxresults=8",
			"personalize=true",
			"siteid=1",
			"ignorePrefillSearchTermForAlternateDestinationsRequest=undefined",
			"googleApiVersion=3.55",
			"popularFilter=true",
			"regiontype=2047", // this is required
			// 'lslatlong=25.06647,-80.47206',
			// 'expuserid=-1',
			// 'guid=3540daa4-dd54-4312-abe4-60920f3f450c',
		]
		const urlString = `https://www.expedia.com/api/v4/typeahead/${hotelName}?${urlParameters.join("&")}`

		// const urlString = `https://www.expedia.com/api/v4/typeahead/${hotelName}`;

		const onLocal = process.env.ON_LOCAL === "true" || false

		// ***only for local testing***
		let browserOptions: object = {
			executablePath: `C:/Program Files (x86)/Google/Chrome/Application/chrome.exe`,
		}

		if (!onLocal) {
			browserOptions = {
				args: ["--no-sandbox"],
				executablePath: "/usr/bin/google-chrome",
				ignoreHTTPSErrors: true,
			}
		}

		const browser = await puppeteer.launch(browserOptions)

		const page = await browser.newPage()
		// set headers, reuired here are accept, user-agent and cookie
		await page.setExtraHTTPHeaders({
			accept: "*/*",
			"user-agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/127.0.0.0 Safari/537.36",
			cookie: expediaCookie,
		})
		await page.goto(urlString, {
			timeout: 40 * 1000,
			waitUntil: ["domcontentloaded"],
		})
		const innerText = await page.evaluate(() => document.querySelector("body")?.innerText)

		await browser.close()
		const data = JSON.parse(innerText || "")

		if (data.rc !== "OK") {
			console.log(`ERR: Fetch Status is not OK `)
			console.log(data)
			return false
		}

		const hotels = data.sr.filter((item: any) => item.type === "HOTEL")
		if (hotels.length < 1) {
			console.log(`ERR: No hotels found matching ${hotelName}`)
			return false
		}
		const id = hotels[0].hotelId
		const name = hotels[0].regionNames.fullName
		const latlong = `${hotels[0].coordinates.lat},${hotels[0].coordinates.long}`
		const returnObj = { id, name, latlong }
		console.log("successfully fetched hotel's full name: ", returnObj)
		return returnObj
	} catch (error: any) {
		console.log("error")
		console.log(error)
		const currentDate = new Date().toLocaleString().replace(/[/, :]/g, "-")
		const formattedDate = currentDate.replace(/, /g, "-")
		const fileName = `./logs/${formattedDate}.txt`
		fs.writeFileSync(fileName, error.toString())
		return false
	}
}

export default expediaAutosuggest
