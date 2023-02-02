const ipcRenderer = require('electron').ipcRenderer;
const { Console } = require('console');
const fs = require('fs');
var MyIOTProperties = require('./MyIOTProperties');
var myThing = {};
var myRxParam;

ipcRenderer.on('openIoTStatus', (event,arg) => {
    console.log("IoT status ready to file load");console.log(arg)
    //myRxParam= JSON.parse(arg);
    myRxParam= arg;
    console.log(myRxParam.fileName)
    MyReadFile(myRxParam.fileName.toString()).then(varID=> {
        myIotForm(varID);
        console.log("Here is value reading")
        console.log(varID)
        myThing = varID;
        myVarsRequest(varID);
    })
})

ipcRenderer.send('WhenCloudStatusOpened');

document.getElementById("IoTVarsRequests").addEventListener("click", function (e) {

    MyReadFile(myRxParam.fileName.toString()).then(varID=> {
        //myIotForm(varID);
        console.log("Here is value reading")
        myThing = varID;
        myVarsRequest(varID);
        
    
    })
    });

document.getElementById("timedRequestCheck").addEventListener("click", function (e) {
        var mySeconds = 20;
        var myRequest;
        if (document.getElementById("timedRequestCheck").checked == true){
          myRequest = setInterval(function() { myIotRequest(); }, Number(document.getElementById("requestTime").value) * 1000);
          console.log(myRequest);
        }
        else {clearTimeout(myRequest); }
       
    })

document.getElementById("goPublish").addEventListener("click", function (e) {
    console.log("Go publish here")
    myGoPublish(document.getElementById("valueToPublish").value);
    })   

document.getElementById("goPublishField").addEventListener("click", function (e) {
    //valueToPublishField
    console.log("Go publish here")
    myGoPublish(document.getElementById("valueToPublishField").value);
    }) 
    

//MyReadFile("IoTThing.cfg").then(varID=> {
//    console.log(varID)
//    myIotForm(varID);
//    console.log(varID)
//})


function myIotForm(varID){
    console.log(varID)
    //console.log(varID.varID)
    console.log(varID.properties)
    var i =0;
    varID.properties.forEach(element => {console.log(varID.properties[i].name);i++;})
    //console.log(varID.varID.properties[0])
    //varID.properties.sort((a,b)=> a.tag - b.tag)
    
    var i =0;
    varID.properties.forEach(element => {console.log(varID.properties[i].name);i++;})

    var i = 0;
    varID.properties.forEach(element => {
        //console.log("element " + i );
        //console.log(element);
        //console.log("ID " + varID.properties[i].id + " " + varID.properties[i].variable_name);
        //console.log(varID);
        //console.log(varID.properties);
        var newDiv = document.createElement("div");

        var myVarFieldID = "VarFieldID";
        var myLabelID = "myLabelID";

        newDiv.innerHTML = '<td><textarea id = "' + myLabelID + i + '"> n/a </textarea></td><td><input type="text" class="form-control" id="' + myVarFieldID + i + '"</input></td></br></br>'

        my_div = document.getElementById(myVarFieldID);
        document.body.insertBefore(newDiv, my_div);

        //console.log(my_div);
        document.getElementById(myVarFieldID + i).value = "n/a";
        //console.log(document);

        i++;
        });

    }

function MyReadFile(MyChartFileName){
        return new Promise (function (resolve,reject) {
            //console.log(resolve);
            fs.readFile(MyChartFileName,(err,myData) => { 
                //var myStream;
                if(err) throw err;
                //console.log("ChartArray in operator = " + ChartArray);
                resolve(JSON.parse(myData));
            })
            
        })       
    }

async function myVarsRequest(varID){
    document.getElementById("LastUpdateTime").value = "no sync yet";
    let lastUpdateTime = [];
    for(let i = 0; i < varID.properties.length; i++){
        await MyIOTProperties.GetVarsValue(varID.deviceId,varID.properties[i].id).then ((varValue) => {
        if (varValue.type == "FLOAT"){document.getElementById("VarFieldID" + i).value = (parseInt(varValue.last_value * 100)) / 100}
        else{document.getElementById("VarFieldID" + i).value = varValue.last_value;}
        //console.log(varValue.last_value)
        document.getElementById("myLabelID" + i).value = varValue.name;
        //document.getElementById("myLabelID" + i).value = varValue.name;
        
        //type "FLOAT"
        //document.getElementById("LastUpdateTime").value = varValue.value_updated_at;
        lastUpdateTime.push({timeCounter: varValue.value_updated_at.getTime(), timeFormat: varValue.value_updated_at})
        });
    }
    let myMaxTime = 0;
    let i = 0;
    let maxI = 0;
    lastUpdateTime.forEach( element =>{
        if (Number(lastUpdateTime[i].timeCounter) > myMaxTime) {
            myMaxTime = Number(lastUpdateTime[i].timeCounter);
            maxI = i;
        }
        i++;
    })
    //console.log(lastUpdateTime);
    document.getElementById("LastUpdateTime").value = lastUpdateTime[maxI].timeFormat;

    }

function myIotRequest(){
    console.log(myThing);
    console.log("Timed start!");
    myVarsRequest(myThing);
    }

async function myGoPublish(newValue){
    //MyIOTProperties.GoPublish (myThing,myThing.properties[2].id, document.getElementById("valueToPublish").value);
    //let myCloudSentMessage = document.getElementById("valueToPublish").value + '\n' + '\r';
    console.log(newValue)
    MyIOTProperties.GoPublish (myThing,'0', newValue);
}