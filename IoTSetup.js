    const { ipcRenderer} = require ('electron');
	//const {PromiseIpc} = require('electron-promise-ipc');
	const promiseIpc = require('electron-promise-ipc');
	var MyIOTProperties = require('./MyIOTProperties');
	const fs = require('fs');
	const { Console } = require('console');
	var MyIoTCFGFile = "IoTThing";
	var MyThingsListFile = "IoTThingList.txt";
	var commonThingsList;
	var myFieldsOrder = [[]];
	var PropertiesList = {};
	//var savedTokenFile = 'savedToken.cfg';
	//var myToken;

	//ipcRenderer.on('myreplay', (event,arg)=>{
    //console.log(event);
	//console.log('from renederer ON');
	//document.getElementById('MyTest').value = "Hello from main.js!";
    //document.getElementById('InTemperature').value = arg;	
	//document.getElementById('OutTemperature').value = arg;	
	//});

	MyFileReader(MyThingsListFile).then(thingsList=> {
        //myIotForm(varID);
        console.log("Here is value reading");console.log(thingsList);
		console.log(thingsList.Things);
		console.log(thingsList.Things[0]);
		thingsList.Things.forEach((item, index, array) => {
			//console.log(thingsList.Things[index].Thing_name);
			document.getElementById("deviceID").options [index] = new Option (value = thingsList.Things[index].Thing_name, 
			label = thingsList.Things[index].Device_ID);
		})
		commonThingsList = thingsList;
    })


	document.getElementById("IoT_requests").addEventListener("click", function (e) {
		e.preventDefault();
		console.log("Request is here");
			MyIOTProperties.GetThing(document.getElementById("deviceID").value).then ((ReplayFromAsync) => {
				console.log(commonThingsList);
				var myFileNamePart =  commonThingsList.Things.filter(function(el){
					return el.Device_ID == document.getElementById("deviceID").value;
				})
				//console.log(myFileNamePart);
				//console.log(myFileNamePart[0].Thing_name);


				MyIoTCFGFile = MyIoTCFGFile + "_" + myFileNamePart[0].Thing_name + ".cfg";
				document.getElementById("fieldFileName").value = MyIoTCFGFile;
				
				//console.log("file name ");console.log(MyIoTCFGFile);

				//MyIoTCFGFile = "IoTThing.cfg";

				//fs.open(MyIoTCFGFile, 'w', (err) => {if(err) throw err;});	
				//fs.writeFile(MyIoTCFGFile,JSON.stringify(ReplayFromAsync), (err) => {if(err) throw err;})

				//console.log(" thing ");console.log(myFileNamePart);
				//myIotForm(myFileNamePart[0].Thing_name);
				myIotForm(ReplayFromAsync);
	
			})
	})
	
	document.getElementById("SetFiledsOrder").addEventListener("click", function (e) {
		e.preventDefault();
		

		myFieldsOrder.forEach((item, i, array) => {
			console.log(i);
			myFieldsOrder[i][4] = document.getElementById(myFieldsOrder[i][2]).value
			document.getElementById(myFieldsOrder[i][2]).remove();
			document.getElementById(myFieldsOrder[i][3]).remove();
			document.getElementById("div1").remove();
	


			i++;
		})
		console.log(myFieldsOrder);
		myFieldsOrder.sort((a,b)=> a[4] - b[4])
		console.log(myFieldsOrder);

		var i =0;
		myFieldsOrder.forEach(element => {
			console.log(i);
			console.log(myFieldsOrder[i][0]);
			var newDiv = document.createElement("div");
	
			var myVarFieldID = "VarFieldID";
			var myVarLabelID = "VarLabelID";

			//newDiv.innerHTML = '<label id= ' + myFieldsOrder[i][3] + '>' + myFieldsOrder[i][1] + 
			//' : </label><input type="text" class="form-control" id="' + myFieldsOrder[i][2]+ '"/></br></br>'
			newDiv.innerHTML = '<label id= ' + myFieldsOrder[i][3] + '>' + myFieldsOrder[i][1] + '></br></br>'
			
	
			my_div = document.getElementById(myVarFieldID);
			document.body.insertBefore(newDiv, my_div);
	
			i++;
		});
	    // console.log(myFieldsOrder);
		

	})

	document.getElementById("SaveFileButton").addEventListener("click", function (e) {
		e.preventDefault();
		console.log(PropertiesList);
		var i =0;
		PropertiesList.properties.forEach(element => {
			console.log(PropertiesList.properties[i].name);
			let mySelection = myFieldsOrder.filter((item) => item[1] == PropertiesList.properties[i].name)
			PropertiesList.properties[i].tag = parseInt(mySelection[0][4],10)
			//PropertiesList.properties.concat(PropertiesList.properties[i],{"myOrder": parseInt(mySelection[0][4],10)})
			console.log(mySelection);
			i++;
		})
		PropertiesList.properties.sort((a,b)=> a.tag - b.tag)
		var i =0;
		PropertiesList.properties.forEach(element => {console.log(PropertiesList.properties[i].name);i++;})

		console.log(PropertiesList)
		console.log(JSON.stringify(PropertiesList))

		fs.open(document.getElementById("fieldFileName").value, 'w', (err) => {if(err) throw err;});	
		fs.writeFile(document.getElementById("fieldFileName").value,JSON.stringify(PropertiesList), (err) => {if(err) throw err;})

		console.log(JSON.parse(JSON.stringify(PropertiesList)))
		//fs.writeFile(document.getElementById("fieldFileName").value,PropertiesList, (err) => {if(err) throw err;})

	})

	
	function MyFileReader(MyFileName){
        return new Promise (function (resolve,reject) {
            //console.log(resolve);
            fs.readFile(MyFileName,'utf-8',(err,myData) => { 
                //var myStream;
                if(err) throw err;
                //console.log("my data = " + myData);
                resolve(JSON.parse(myData));
				//resolve(myData);
            })
            
        })       
    }

	function myIotForm(varID){
		console.log(varID)
	    PropertiesList = varID;
        
		var i = 0;
		//myFieldsOrder.push(new Array(3));
		varID.properties.forEach(element => {

			var newDiv = document.createElement("div");
			newDiv.setAttribute("id","div1");

	
			var myVarFieldID = "VarFieldID";
			var myVarLabelID = "VarLabelID";


			//newDiv.innerHTML = '<label id= ' + myVarLabelID + i + '>' + varID.properties[i].variable_name + 
			//' : </label><input type="text" class="form-control" id="' + myVarFieldID + i + '"/></br></br>'
			
			newDiv.innerHTML = '<label id= ' + myVarLabelID + i + '>' + varID.properties[i].name + 
			' : </label><input type="text" class="form-control" id="' + myVarFieldID + i + '"/></br></br>'
	
			my_div = document.getElementById(myVarFieldID);
			document.body.insertBefore(newDiv, my_div);
	
			myFieldsOrder.push(new Array(5));
		    myFieldsOrder[i][0] = i;
			//myFieldsOrder[i][1] = varID.properties[i].variable_name 
			myFieldsOrder[i][1] = varID.properties[i].name 
			myFieldsOrder[i][2] = myVarFieldID + i;
			myFieldsOrder[i][3] = myVarLabelID + i;
			myFieldsOrder[i][4] = i;

			i++;
			});
			myFieldsOrder.pop();
	        console.log(myFieldsOrder);
		}
