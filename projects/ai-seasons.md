---
layout: page
title: AI Seasons

permalink: /projects/ai-seasons
header: true
list_title: " "

---

*Note: This research was conducted over a span of fall semester 2024 with Muhlenberg undergraduate student researcher, Andrew Franklin, and was merely a data collection project.*

## 1. Project Overview

This project was a data collection initiative designed to gather a comprehensive dataset of digital content related to the concepts of "AI Winter," "AI Summer," and general "Artificial Intelligence." The primary objective was to systematically scrape, parse, and store information from a diverse range of sources, including technology news sites, academic repositories, and video platforms. This dataset serves as a foundational resource for future research and analysis on the cyclical trends, sentiment, and discourse surrounding AI development.

## 2. Methodology and Workflow

The data collection process was automated through a series of Python scripts, each tailored to a specific data source. The overall workflow was managed by a master script that employed multiprocessing to run the individual scrapers concurrently, enhancing the efficiency of the data gathering process.

The typical workflow for each scraper was as follows:

1. **Target Identification:** The script navigates to a specific website or API endpoint. For broad sources, it uses search queries like "ai winter," "ai summer," or "artificial intelligence."
2. **Content Fetching:** The script downloads the raw content, which could be an HTML page, a PDF document, or a video transcript.
3. **Data Parsing & Extraction:** Key pieces of information (metadata) are parsed from the raw content. Common data points include the title, author(s), publication date, URL, summary/abstract, full text, and associated tags or keywords.
4. **Data Storage:** The extracted information is structured and then inserted into a central MySQL database.

## 3. Data Sources and Collection Scripts

The project aggregated data from seven primary sources, each handled by a dedicated script:

| Data Source | Description |
|-------------|-------------|
| ArXiv | Searched for and downloaded academic papers as PDFs based on topics ("AI spring," "AI winter") and extracted their full text and metadata. |
| TechCrunch | Scraped articles from the "Artificial Intelligence" category, iterating through pages to collect article content and metadata. |
| The Verge | Traversed the website's sitemaps to find and process articles, extracting text and metadata. |
| YouTube | Used the YouTube Data API to find videos based on search terms (e.g., "ai summer") and retrieved video details and full-text transcripts. |
| Hacker News | Queried the Hacker News API for posts related to "ai winter" and scraped the content of the linked articles. |
| Gizmodo | Scraped articles from the "Artificial Intelligence" section of the site. |
| PubMed | Searched for articles related to "artificial intelligence" and extracted titles, URLs, and abstracts. |

## 4. Core System Components

The project was built around a few key components that managed the overall process:

- **Main Execution Script:** The primary script used a thread pool to run scrapers for multiple sources (TechCrunch, ArXiv, YouTube) simultaneously, improving efficiency.
- **Database Insertion Utility:** A standardized function was used to connect to the MySQL database and insert new records of collected data in a consistent manner.
- **Debugging Utility:** A simple utility was available for printing command-line arguments, likely used for testing purposes during development.
