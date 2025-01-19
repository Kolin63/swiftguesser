import os
# pip install pydub
from pydub import AudioSegment
directory = "C:\\Users\\theve\\Downloads\\Swift Guesser Rename"

input("Cutting to 60 seconds in " + directory + "\nPress any key to start")

for file in os.listdir(directory):
    if (file.endswith(".mp3") == False): 
        continue

    filePath = os.path.join(directory, file)
    print(filePath)
    song = AudioSegment.from_mp3(filePath)

    cutSong = song[:60000] # 60,000 ms, 60 seconds
    cutSong.export(filePath, format="mp3")


input("Press any key to close")
