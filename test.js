var Lyrics = require("./");

new Lyrics("sexy and i know it" , "lmfao").getLyrics()
  .then(function(data){
    console.log(data)
  })
  .catch(function(err){
    console.log(err)
  })