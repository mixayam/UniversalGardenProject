exports.portParser = function (str) {
    if (myMsgWord != undefined) {
      // if (document.getElementById("modeChooseSLCT").value == "arduino") {
        //return str.slice(str.indexOf(":") + 1, str.length);
        // return str.slice(str.indexOf("Ch:") + 3, str.length);}
       if (document.getElementById("modeChooseSLCT").value == "TRLTBoard") {
        //return str.slice(str.indexOf("data") + 4, str.length);
        //console.log(str.slice(str.indexOf("Ch:") + 6, str.length))
        //console.log(str.slice(str.indexOf("_"), str.length))
        return str.slice(str.indexOf("Ch:") + 6, str.length);
       
      }
    } else {
      return undefined;
    }
  }