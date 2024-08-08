# Puppeteer Scraper

Puppeteer Scraper is a Node.js application that uses the Puppeteer headless browser to scrape hotel prices from the Expedia website. The application also connects to a PostgreSQL database to fetch Expedia cookies, ensuring an authenticated and reliable scraping process.

## Table of Contents

- [Features](#features)
- [Installation](#installation)
- [Usage](#usage)
- [Packages Used](#packages-used)
- [Database](#database)
- [Contributing](#contributing)
- [License](#license)

## Features

Headless Scraping: Utilizes Puppeteer to perform headless browsing and extract hotel prices from Expedia.
Database Integration: Connects to a PostgreSQL database to fetch and utilize Expedia cookies for authenticated sessions.
HTML Parsing: Uses Cheerio for efficient HTML parsing and data extraction.
Efficient & Scalable: Designed to handle multiple requests and scale as needed.

## Installation:

To get started with Puppeteer Scraper, follow these steps:

Clone the repository:

Copy code
git clone https://github.com/yourusername/puppeteer-scraper.git
cd puppeteer-scraper
Install dependencies:

Copy code
npm install
Set up PostgreSQL:

Ensure you have a running PostgreSQL database.

Create a .env file in the root directory and add your PostgreSQL connection string:


## Usage:

The Puppeteer Scraper can be run using a simple command:

Copy code
npm run scrape
This command will launch the Puppeteer headless browser, navigate to Expedia, and scrape hotel prices based on the criteria defined in the script. The cookies fetched from the PostgreSQL database ensure the session remains authenticated.

Packages Used:

The following packages are used in this application:

puppeteer: Provides the headless browser for scraping.
puppeteer-core: A lighter version of Puppeteer that is used in environments where full Puppeteer installation is not needed.
@vercel/postgres: Simplifies database connection and query execution.
cheerio: Parses and manipulates the scraped HTML content.
Database:

Puppeteer Scraper uses a PostgreSQL database to store and retrieve cookies needed for authenticating the scraping sessions. Ensure your database is set up correctly and the connection string is provided in the .env file.

License:

This project is licensed under the MIT License. See the LICENSE file for details.