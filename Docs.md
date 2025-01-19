# Documentation
Swift Guesser was designed with modularity and expandability, so adding content is mostly done in JSON files.
## Adding Artists, Albums, or Songs
The easiest way to contribute to Swift Guesser! Most songs will be accepted, but probably won't be added to the vanilla category (meaning that it won't be included in the "Everything" parameter)
### Downloading Songs
I use [a fork of OnTheSpot](https://github.com/justin025/onthespot), because the [original](https://github.com/casualsnek/onthespot) was not working for me. (Yes, this is piracy). I connected my Spotify account and downloaded by the album.

Once you download the songs, they will be formatted with a prefix and maybe a suffix. For example,
`1. Welcome to New York (Taylor's Version).mp3` (make sure they are mp3's)
We can use a Python script I made to easily rename all of the files. In `swiftguesser/swiftguesserrename.py`, add any suffixes to the code (lines 34 and 54). By default, the directory will be set to `C:\Users\theve\Download\Swift Guesser Rename`. I reccommend keeping the directory as an external directory, rather than within the game files. The code might not work, and you might need to try again, but once you run the code once, it is unreversable. 

When you run the script, it will also output a JSON array in the console. Don't close the console window yet because we'll need that. 

### Weight
First, go to `/swiftguesser/weight.json` in the game files. `weight.json` has all of the songs, and their albums and artists. In game, it is used to randomly select a song. If you are adding a song to an album already in game, or an album to an artist already in game, add the following to the preexisting data.

Follow this format to add to `weight.json`. The indentation of the braces should be the same too (Don't put a brace or bracket on the same line as the object name).

Also, when you ran the Python script above, the array it outputted is the "songs" array. So, you can just copy paste that in. 
```
{ (these parentheses are the root JSON parentheses, they already exist)
    "taylorswift":
    {
        "speaknow":
        {
            "amount": 22,
            "songs": 
            [
                "Mine",
                "Sparks Fly",
                ...
                "Timeless"
            ]
        }
    }
}
```

### Config
Next, go to `/swiftguesser/config.json` in the game files. `config.json` only has the artists and albums, because that is what you can disable or enable in the config. 

Follow this format to add to `config.json`
```
{ (root parentheses)
    "taylorswift": {
        "display": {
            "display": "Taylor Swift", 
            "vanilla": false, (Taylor Swift is actually true, but anything you add should probably be false)
            "contributors": "Kolin63" (this is never actually used in game, leave your signature however you want within this string)
        },
        "data": {
            "speaknow": {
                "value": false, (Taylor Swift is actually true, but anything you add should probably be false)
                "display": "Speak Now"
            }
        }
    }
}
```

### Music Files
When you ran the Python script, it renamed all of the .mp3's to automatically remove prefixes and suffixes. Now, we are going to cut the songs to 60 seconds, for storage reasons. The `swiftguessercutmp3.py` does that automatically. 
It uses the same directory as the other script, so keep the audio files in there. I would reccommend copying them somewhere once they have been renamed incase something goes wrong. 
Run the script, and it will cut all of the files. This one is a bit slower so you need to wait about 30 seconds.
Once that is finished, we need to put the files in the game. They should be in the directory `/swiftguesser/play/music/artist/album/song.mp3`
Make sure that the name of the folders and the mp3 are the exact same as in `weight.json` and `config.json`. You may also need to remove any special symbols in all three locations. For example, quotes, question marks, and most special characters are not supported in file names. 

### Cover Image
If you refresh the page now and press the reset button in the config, it should now show. Or at least there will be a silly looking monkey. 
Download the cover image from Spotify or somewhere else. If you go onto the Spotify website, you can press `Ctrl + Shift + C` on Chrome, then click on the cover image and download the source. 
Name the image `cover.jpg` (must be a jpg) and place it in the same directory that you put the songs in. There should be one cover image per album.

### Testing 
Everything should work. I reccommend playing the game a bit, and refreshing the page a bunch to make sure that all of the songs are working. If you ever press play and no audio plays, inspect the audio element and look at the console. The error is most likely a naming discrepancy. Check for special symbols in the audio file, `config.json` and `weight.json`. 

If you are running the website locally for development, the leaderboard won't allow requests to the API. However, the parameters on the leaderboard page and the selection bar should work. 

## Adding Parameters
Adding a Parameter is very similar to adding an album. I am not going to talk about it much here, but I will cover it a bit. 

If you are adding a parameter that is similar to All Swift, All Sabrina, etc. all you need to do is add to `config.json` and make a cover image. Follow the below format.

```
{
    "parameters": {
        "data": {
            "yourparametername": {
                "value": false,
                "display": "Your Parameter Name",
                "category": ["album"],
                "incomp": {"xor": ["album"]},
                "data": {"artists": ["cocomelon"], "albums":{"chappellroan": ["riseandfall", "goodluckbabe"]}}
            }
        }
    }
}
```

`category` and `incomp` are related. They determine the incompatabilites between parameters. `"incomp": {"xor": ...}` means that incompatabilites are handled like a xor gate. Meaning that only one from the category can be enabled, and one must be enabled (they can't be off). Currently, the only other one is `nand` meaning that they can be all off but there can only be one on. 

If you are wondering why `category` and the categories listed inside `incomp` are arrays, it's so that I have room to implement more complex incomps in the future. Right now, having multiple categories in one parameter isn't supported but you still have to put them in arrays.

You only need to include `data` if you are doing an `album` category. The `album` category is parameters like `All Swift`, `All Sabrina`, etc. Inside `data`, `"artists"` enables all albums in the listed artists. `"albums"` enables specific albums. 

If you are making an `album` category parameter, that should be all you need to do. (besides a cover image)

### Non-Album Parameters
If you want to make a parameter that affects gameplay, such as No Pause or One Pause, you will need to edit `/swiftguesser/play/main.js` But be warned that the reason I made all of this JSON framework is because my code is an absolute mess. So you're on your own if you want to navigate it and add to it. Sorry.

### Parameters Cover Image
Put a cover image in `/swiftguesser/art/parameters/parametername.jpg` It has to be a jpg. 
