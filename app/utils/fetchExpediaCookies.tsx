import puppeteer from "puppeteer-core"

async function fetchData() {
	try {
		// const browser = await puppeteer.launch({
		//   args: chromium.args,
		//   defaultViewport: chromium.defaultViewport,
		//   executablePath: await chromium.executablePath(),
		//   headless: chromium.headless,
		//   ignoreHTTPSErrors: true,
		// });
		// ***only for local testing***

		const onLocal = process.env.ON_LOCAL === "true" || false

		// ***only for local testing***
		let browserOptions: object = {
			// executablePath: executablePath(),
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
		await page.goto("https://www.expedia.com/", {
			timeout: 40 * 1000,
			waitUntil: ["domcontentloaded"],
		})
		const cookies = await page.cookies()
		await browser.close()
		let cookiesString: string | null = null
		if (cookies.length > 0) {
			cookiesString = cookies
				.map((cookie) => {
					return `${cookie.name}=${cookie.value}`
				})
				.join(";")
		}
		return cookiesString
	} catch (error: any) {
		console.log("ERR: ", error.message)
		return null
	}
}

export default fetchData
