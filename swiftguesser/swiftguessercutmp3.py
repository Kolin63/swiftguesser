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
clipMP3("C:\\LocalDocuments\\Development\\Web\\swiftguesser\\swiftguesser\\play\\music\\sabrinacarpenter\\emailsicantsend")
clipMP3("C:\\LocalDocuments\\Development\\Web\\swiftguesser\\swiftguesser\\play\\music\\sabrinacarpenter\\evolution")
clipMP3("C:\\LocalDocuments\\Development\\Web\\swiftguesser\\swiftguesser\\play\\music\\sabrinacarpenter\\eyeswideopen")
clipMP3("C:\\LocalDocuments\\Development\\Web\\swiftguesser\\swiftguesser\\play\\music\\sabrinacarpenter\\shortnsweet")
clipMP3("C:\\LocalDocuments\\Development\\Web\\swiftguesser\\swiftguesser\\play\\music\\sabrinacarpenter\\singularact1")
clipMP3("C:\\LocalDocuments\\Development\\Web\\swiftguesser\\swiftguesser\\play\\music\\sabrinacarpenter\\singularact2")
clipMP3("C:\\LocalDocuments\\Development\\Web\\swiftguesser\\swiftguesser\\play\\music\\taylorswift\\1989")
clipMP3("C:\\LocalDocuments\\Development\\Web\\swiftguesser\\swiftguesser\\play\\music\\taylorswift\\evermore")
clipMP3("C:\\LocalDocuments\\Development\\Web\\swiftguesser\\swiftguesser\\play\\music\\taylorswift\\fearless")
clipMP3("C:\\LocalDocuments\\Development\\Web\\swiftguesser\\swiftguesser\\play\\music\\taylorswift\\folklore")
clipMP3("C:\\LocalDocuments\\Development\\Web\\swiftguesser\\swiftguesser\\play\\music\\taylorswift\\lover")
clipMP3("C:\\LocalDocuments\\Development\\Web\\swiftguesser\\swiftguesser\\play\\music\\taylorswift\\midnights")
clipMP3("C:\\LocalDocuments\\Development\\Web\\swiftguesser\\swiftguesser\\play\\music\\taylorswift\\red")
clipMP3("C:\\LocalDocuments\\Development\\Web\\swiftguesser\\swiftguesser\\play\\music\\taylorswift\\reputation")
clipMP3("C:\\LocalDocuments\\Development\\Web\\swiftguesser\\swiftguesser\\play\\music\\taylorswift\\speaknow")
clipMP3("C:\\LocalDocuments\\Development\\Web\\swiftguesser\\swiftguesser\\play\\music\\taylorswift\\taylorswift")
clipMP3("C:\\LocalDocuments\\Development\\Web\\swiftguesser\\swiftguesser\\play\\music\\taylorswift\\tpd")
clipMP3("C:\\LocalDocuments\\Development\\Web\\swiftguesser\\swiftguesser\\play\\music\\tobyfox\\deltarune1")
clipMP3("C:\\LocalDocuments\\Development\\Web\\swiftguesser\\swiftguesser\\play\\music\\tobyfox\\deltarune2")
clipMP3("C:\\LocalDocuments\\Development\\Web\\swiftguesser\\swiftguesser\\play\\music\\tobyfox\\undertale")
