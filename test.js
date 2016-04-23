var Lyrics = require("./");


new Lyrics("Higher Place" , "Dimitri Vegas").getLyrics()
  .then(function(data){
    console.log(data)
  })
  .catch(function(err){
    console.log(err)
  })