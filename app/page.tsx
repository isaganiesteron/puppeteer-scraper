"use client"

import { useState } from "react"
import { HotelDetail } from "./const/Interfaces"

export default function Home() {
	const [userdata, setUserdata] = useState<object>({
		hotelname: "Baker's Cay Resort Key Largo",
		guests: 2,
		checkin: "2024-08-04",
		checkout: "2024-08-06",
	})
	const [postData, setPostData] = useState<{
		originalHotel: HotelDetail
		alternativeHotels: HotelDetail[]
	} | null>(null)

	const handleSearch = async () => {
		console.log("***handleSearch***")
		console.log("userdata", userdata)
		setPostData(null)
		const res = await fetch("/api/expedia-search", {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
				Authorization: `${process.env.NEXT_PUBLIC_API_KEY}`,
			},
			body: JSON.stringify(userdata),
		}).then((x) => x.json())
		setPostData(res)
		console.log(res)
	}

	const handleTrigger = async () => {
		const res = await fetch("/api/trigger").then((x) => x.json())
		console.log(res)
	}

	const handleRefreshCookies = async () => {
		const res = await fetch("/api/refreshCookies", {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
				Authorization: `${process.env.NEXT_PUBLIC_API_KEY}`,
			},
		}).then((x) => x.json())
		console.log(res)
	}

	return (
		<main className="flex min-h-screen flex-col items-center p-24 gap-3">
			<h1 className="text-4xl">Search for Expedia Hotels</h1>
			<textarea className="w-full h-48 p-4 border border-gray-300 rounded text-black" placeholder="Enter your search query" value={JSON.stringify(userdata, null, 2)} onChange={(e) => setUserdata(JSON.parse(e.target.value))}></textarea>
			<button className="w-full py-2 bg-blue-500 text-white rounded" onClick={handleSearch}>
				Search (POST request)
			</button>

			<h1 className="text-xl mt-4">Results</h1>
			<textarea className="w-full h-96 p-4 border border-gray-300 rounded text-black" placeholder="Enter your search query" readOnly={true} value={postData ? JSON.stringify(postData, null, 2) : "Send a POST request"}></textarea>

			<button className="mt-5 w-full py-2 bg-red-500 text-white rounded" onClick={handleRefreshCookies}>
				Refresh Cookies
			</button>
		</main>
	)
}
