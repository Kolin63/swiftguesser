import os
# pip install pydub
from pydub import AudioSegment

def clipMP3(directory):
    for file in os.listdir(directory):
        if (file.endswith(".mp3") == False): 
            continue

        filePath = os.path.join(directory, file)
        print(filePath)
        song = AudioSegment.from_mp3(filePath)

        cutSong = song[:60000] # 60,000 ms, 60 seconds
        cutSong.export(filePath, format="mp3")

# directory = "C:\\Users\\theve\\Downloads\\Swift Guesser Rename"
# clipMP3("C:\\path\\to\\folder\\that\\has\\the\\songs")
