#!/usr/bin/env python
# -*- coding: utf-8 -*-

import requests
import pandas as pd
from bs4 import BeautifulSoup
import os
from logit import logger

def format_wikipedia_content(soup):
    # This will store the extracted content in a formatted way
    formatted_content = []

    # Extract the title of the article
    title = soup.find('h1', {'id': 'firstHeading'}).get_text()
    formatted_content.append(f"# {title}\n\n")

    # Extract the main content of the page
    content_div = soup.find('div', {'id': 'bodyContent'})

    # Loop through the elements within the main content
    for element in content_div.find_all(['h2', 'h3', 'p', 'ul', 'ol']):
        if element.name == 'h2' or element.name == 'h3':
            # Format headers (h2 and h3)
            header = element.get_text().strip()
            formatted_content.append(f"## {header}\n\n")
        elif element.name == 'p':
            # Format paragraphs
            paragraph = element.get_text().strip()
            formatted_content.append(f"{paragraph}\n\n")
        elif element.name == 'ul' or element.name == 'ol':
            # Format lists
            for li in element.find_all('li'):
                list_item = li.get_text().strip()
                formatted_content.append(f"- {list_item}\n")
            formatted_content.append("\n")

    return "\n".join(formatted_content)


def download_wikipedia_content(csv_file):
    # Create a directory to save the text files
    if not os.path.exists('wiki_texts'):
        os.makedirs('wiki_texts')

    # Read the CSV file
    data = pd.read_csv(csv_file)

    for index, row in data.iterrows():
        name = row['name']
        url = row['url']
        if not os.path.isfile(f"wiki_texts/{name}.txt"):
            logger.info(f"Processing {name} now")
            # Fetch the content of the Wikipedia page
            response = requests.get(url)

            if response.status_code == 200:
                soup = BeautifulSoup(response.content, 'html.parser')

                formatted_text = format_wikipedia_content(soup)

                # Save the content to a text file
                filename = f"wiki_texts/{name}.txt"
                with open(filename, 'w', encoding='utf-8') as file:
                    file.write(formatted_text)

                logger.info(f"Downloaded content for {name} and saved to {filename}")
            else:
                logger.error(f"Failed to retrieve content for {name} from {url}")
        else:
            logger.info(f"Skipping {name}, since it alredy exists")

# Usage
csv_file = 'wikipedia_urls.csv'  # Replace with your CSV file path
download_wikipedia_content(csv_file)
