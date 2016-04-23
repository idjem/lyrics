"use strict"
const music      =  require("musicmatch")();
const crypto     =  require("crypto");
const fs         =  require("fs");
const path       =  require("path");
const has        =  require("mout/object/has");
const deepMixIn  =  require("mout/object/deepMixIn")
const LyricsPath =  "lyrics";

class Lyrics {
  constructor(name, artist) {
      this.name     = name.toUpperCase();
      this.artist   = artist.toUpperCase();
      this.data     = {};
      this.nameHash = crypto.createHash('md5').update(this.name + this.artist).digest('hex');
  }
  _readRemote(){
    console.log("check it remotely")
    return music.matcherLyrics({q_track: this.name , q_artist: this.artist})
  }
  _getFilePath(){
    return path.join(LyricsPath , this.nameHash)
  }
  getLyrics(){
    var self = this ;
    return new Promise(function(resolve, reject) {
      self._readLocal()
        .then(resolve)
        .catch(function(){
          self._readRemote()
          .then(function(data){
            if(has(data, 'message.body.lyrics.lyrics_body')){
              self.data.lyrics = data.message.body.lyrics.lyrics_body;
              self._saveLyrics();
              self._readLocal()
                .then(resolve)
                .catch(reject)
            }else{
              reject(Error("cant find message.body.lyrics.lyrics_body"))
            }
          })
          .catch(reject)
        })
    })
  }
  _readLocal(){
    var self = this;
    return new Promise(function(resolve, reject){
      if(self._checkLocal()){
        fs.readFile(self._getFilePath(), (err, data) => {
          if(err)
            reject(err);
          else{
            try{
              let d = JSON.parse(data);
              resolve(d);
            }catch(e){
              reject(e)
            }
          }
        });
      }else{
        reject(Error("no file local"))
      }
    })
  }

  _saveLyrics(){
    console.log("save lyrics locally")
    if(this.data.lyrics)
      fs.writeFileSync(this._getFilePath(), JSON.stringify(this.data));
  }

  _checkLocal(){
    var filePath = path.join(LyricsPath , this.nameHash)
    try{
      fs.accessSync(filePath, fs.R_OK);
      return true
    }catch(e){
      return false
    }
  }

  updateLyrics(data){
    if(!data)
      return
    this.data = deepMixIn(data , this.data);
    this._saveLyrics();
  }
};

module.exports = Lyrics
