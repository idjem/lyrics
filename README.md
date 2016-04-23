##API

```javascript 
var Lyrics = require("./");


new Lyrics("Higher Place" , "Dimitri Vegas").getLyrics()
  .then(function(lyric){
    console.log(lyric)
  })
  .catch(function(err){
    console.log(err)
  })
```