"use strict"


const music      =  require("musicmatch")();
const crypto     =  require("crypto");
const fs         =  require("fs");
const path       =  require("path");

const LyricsPath =  "lyrics";

class Lyrics {
  constructor(name, artist) {
      this.name     = name;
      this.artist   = artist;
      this.data     = {};
      this.nameHash = crypto.createHash('md5').update(name+artist).digest('hex');
  }
  _readRemote(){
    return music.matcherLyrics({q_track: this.name , q_artist: this.artist})
  }
  _getFilePath(){
    return path.join(LyricsPath , this.nameHash)
  }
  getLyrics(){
    return new Promise(function(resolve, reject) {
      this._readLocal()
        .then(resolve)
        .catch(function(){
          this._readRemote()
          .then(function(){
            this.data.lyrics = data;
            this.saveLyrics();
            this._readLocal()
              .then(resolve)
              .catch(reject)
          })
          .catch(reject)
        })
    })
  }
  _readLocal(){
    return new Promise(function(resolve, reject){
      if(this._checkLocal()){
        fs.readFile(this._getFilePath(), (err, data) => {
          if(err)
            reject(err);
          else{
            try{
              let d = JSON.parse(data);
              resolve(data);
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
    if(this.data.lyrics)
      fs.writeFileSync(this._getFilePath(), this.data);
  }

  checkLocal(){
      var filePath = path.join(LyricsPath , this.nameHash)
      return fs.accessSync(filePath, fs.R_OK);
  }
};

