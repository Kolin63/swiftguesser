import os
import json
import time

# USE WITH CAUTION
# WILL RENAME ALL FILES IN BELOW DIRECTORY
# BE CAREFUL PLEASE
#
# IT WILL RENAME FROM
# 1. Speak Now.mp3
# TO
# Speak Now.mp3
# AND OUTPUT A JSON ARRAY
directory = "C:\\Users\\theve\\Downloads\\Swift Guesser Rename"
jsonOutput = []

input("Confirm to rename all files in " + directory + 
      "\nMake sure you copied the files into this directory rather than move them, because you might need to try again.")

retry_attempts = 5
retry_delay = 2  # seconds

for file in os.listdir(directory):
    filePath = os.path.join(directory, file)

    while file[0] != " ":
        file = file[1:]
    file = file[1:]
    jsonOutput.append(file[:-4])

    renFilePath = os.path.join(directory, file)

    # ADD SUFFIXES HERE
    # renFilePath = renFilePath.replace(" - Annoying Suffix", "")

    for attempt in range(retry_attempts):
        try:
            os.rename(filePath, renFilePath)
            break  
        except Exception as e:
            print(f"Error renaming {filePath} to {renFilePath}: {e}")
            if attempt < retry_attempts - 1:
                print(f"Retrying in {retry_delay} seconds...")
                time.sleep(retry_delay)
            else:
                print(f"Failed to rename {filePath} after {retry_attempts} attempts.")

jsonString = json.dumps(jsonOutput)
jsonString = jsonString.replace("\", ", "\",\n    ")
jsonString = jsonString.replace("[", "\"songs\": [\n    ")
jsonString = jsonString.replace("]", "\n]")

# ADD SUFFIXES HERE
# jsonString = jsonString.replace(" - Annoying Suffix", "")

print("\n\n\n" + jsonString)

input("\n\n\nPress any key to close. Make sure to copy the json first!")
