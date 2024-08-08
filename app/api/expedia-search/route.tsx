export const maxDuration = 60
import { NextResponse } from "next/server"
import expediaHotelSearch from "@/app/utils/expediaHotelSearch"
import expediaHotelInfo from "@/app/utils/expediaAutosuggest"
import { sql } from "@vercel/postgres"
// import moment from 'moment';

export async function POST(request: Request) {
	console.log("***expedia-search***")
	try {
		let authorization
		const headers = request.headers
		headers.forEach((value, name) => {
			if (name.toLocaleLowerCase() === "authorization") authorization = value
		})
		if (authorization !== process.env.API_ENPOINT_KEY) return NextResponse.json("Unauthorized", { status: 401 })

		const { hotelname, guests, checkin, checkout } = await request.json()

		// *** First retrieve the cookie form database here and pass it on the 2 functions below
		// create own function for this
		// it will also cycle between the cookies that are available
		const { rows } = await sql`SELECT * from Cookies`
		const expediaCookie = rows[0].value || "" // It's currently using the cookie taken from america

		// 1. search for the hotel in expedias autosuggest to get official hotel name and location
		const hotelDetails = await expediaHotelInfo(hotelname, expediaCookie)
		const { id, name, latlong } = hotelDetails as { id: string; name: string; latlong: string }

		if (!(name && latlong)) return NextResponse.json("Unable to fetch hotel details.", { status: 404 })

		// return NextResponse.json({ id, name, latlong, guests, checkin, checkout });
		const expediaData = await expediaHotelSearch(id, name, latlong, guests.toString(), checkin, checkout, expediaCookie)
		return NextResponse.json(expediaData)
	} catch (error: any) {
		return NextResponse.json(error.message || "error", { status: 500 })
	}
}
