import spacy
import csv
import os
import re

nlp = spacy.load("en_core_web_lg")

# Open the CSV file for writing
with open("output.csv", "w", newline="", encoding="utf-8") as csvfile:
    writer = csv.writer(csvfile)
    writer.writerow(["Name", "Hits", "Filenames"])

    # Create a dictionary to store the person counts
    person_counts = {}

    # Loop over all the files in the current directory
    for filename in os.listdir("."):
        if filename.endswith(".txt"):
            # Open the text file and read its contents
            with open(filename, "r") as f:
                text = f.read()

            # Process the text with the NLP pipeline
            doc = nlp(text)

            # Extract only entities of the "PERSON" type and count their occurrences
            for ent in doc.ents:
                if ent.label_ == "PERSON":
                    name = ent.text.strip().lower().replace("’s","")
                    key = f"{name}-{filename}"
                    if key not in person_counts:
                        person_counts[key] = {"hits": 1, "filenames": [filename]}
                    else:
                        person_counts[key]["hits"] += 1
                        # person_counts[key]["filenames"].append(filename)

    # Write the person counts to the CSV file
    for key, count in person_counts.items():
        # Split the name and filename
        try:
            name, filename = key.split("-")
        except ValueError:
            # If the key doesn't have a "-" separator, use the entire key as the name
            name = key
            filename = ""
        # Merge any multi-line cells in the CSV file
        name = re.sub(r"\n+", " ", name)
        writer.writerow([name, count["hits"], ", ".join(count["filenames"])])
