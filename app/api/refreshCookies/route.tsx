export const maxDuration = 60
import { NextResponse } from "next/server"
import fetchExpediaCookies from "@/app/utils/fetchExpediaCookies"
import { sql } from "@vercel/postgres"

export async function POST(request: Request) {
	console.log("***Refresh Expedia Cookies***")
	try {
		let authorization
		const headers = request.headers
		headers.forEach((value, name) => {
			if (name.toLocaleLowerCase() === "authorization") authorization = value
		})
		if (authorization !== process.env.API_ENPOINT_KEY) return NextResponse.json("Unauthorized", { status: 401 })
		const expediaCookie = await fetchExpediaCookies()
		await sql.query("DELETE FROM cookies")
		const sqlString = `INSERT INTO cookies (value) VALUES ('${expediaCookie}')`
		const result = await sql.query(sqlString)
		if (result.rowCount === 1) return NextResponse.json({ success: true, message: "Cookies refreshed" })
		return NextResponse.json({ success: false, message: "Failed to refresh cookies" })
	} catch (error: any) {
		return NextResponse.json({ success: false, message: error.message || "error" })
	}
}
