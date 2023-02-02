    //11.11.2020 Скрипт привязан к Index.html
	//Умеет открывать окно выбора Ком порта и работать как терминал.
	const {dialog} = require('electron').remote;
	//const {app, dialog} = require('electron')
	const MySerial = require('./MySerial')
	const SerialPort = require('serialport');
	const Readline = require('@serialport/parser-readline');
    const  ipcRenderer = require ('electron').ipcRenderer;

	var SelectedCOMParam; //параметры ком порта
	var MyParser;
    	
		
	document.getElementById("Menu_Open_file").addEventListener("click", function (e) {	
		e.preventDefault();
		console.log("Open file will be here");
		ipcRenderer.send('File_open_dialog'); // запрос на открытие файла
	})	
	
	document.getElementById("Menu_Edit_file").addEventListener("click", function (e) {	
		e.preventDefault();
		console.log("Edit file will be here");
		ipcRenderer.send('File_edit_dialog'); // запрос на открытие файла
	})

	document.getElementById("MCBoxSide").addEventListener("click", function (e) {	
		e.preventDefault();
		console.log("Exchange Test");
		ipcRenderer.send('DataExchange', '{"route":"to_MC_cloud","data":"box > cloud test"}'); // запрос на открытие файла
	})
	
	document.getElementById("textToSend").addEventListener("onchange", function (e) {
			e.preventDefault();
		    console.log('Here is string to send');
	});
	

					//открытие промиса. Ожидание параметров ком порта от Econnections.js через main.js
	ipcRenderer.on('COMParametersTransfer', (event,arg) => {
						console.log('This is Index IPC running');
						SelectedCOMParam = arg;
  					  console.log(SelectedCOMParam) // prints "pong"2
					document.getElementById("textComPortStatus").value = SelectedCOMParam.ComName + ' at ' + SelectedCOMParam.ComBaud + ' is set';
	
					MyCOMPort = new SerialPort(SelectedCOMParam.ComName, {
					//MyCOMPort = new SerialPort(SelectedCOMParam.ComName, {
  	 			  baudRate: Number(SelectedCOMParam.ComBaud),
				 parser: new SerialPort.parsers.Readline({ delimiter: '\r\n' })
  	 			  }, function (err) {	
  	 			if (err) {
				   //document.getElementById("ComPortOpenButton").value = document.getElementById("ComNameSelect").value + ' is not available! Reason is:' + err.message;
				   document.getElementById("SendButton").disabled = true;
				   return console.log('Error: ', err.message)
  			    }
			})
	
			console.log('current com port') 
			console.log(MyCOMPort) 
			document.getElementById("SendButton").disabled = false;
	
			MyParser = MyCOMPort.pipe(new Readline({ delimiter: '\r\n' }))
	
			MyParser.on('data', function (data){
			console.log('on Data ' + data);
			document.getElementById("TextRecieved").value = document.getElementById("TextRecieved").value + data + '<br />' ; 
		
			})
	
	})

    //переход в окно статуса теплицы GH
	document.getElementById("go_status_GH").addEventListener("click", function (e) {
		e.preventDefault();
		console.log('INDEXX: GH choice running');
		ipcRenderer.send('WhatIsMain','GH'); // вызов промиса, запрос на открытие окна GHStatus
	});

	//go_status_Wifi
	document.getElementById("WiFiBox").addEventListener("click", function (e) {
		e.preventDefault();
		console.log('here is WiFiBox');
		ipcRenderer.send('WhatIsMain','WiFi'); // вызов промиса, запрос на открытие окна IoT staus
	});

	//go_status_IoT
	document.getElementById("go_status_IoT").addEventListener("click", function (e) {
		e.preventDefault();
		console.log('go_status_IoT');
		ipcRenderer.send('WhatIsMain','IoT'); // вызов промиса, запрос на открытие окна IoT staus
	});
	
	//переход в окно статуса полива Watering
	document.getElementById("go_status_Water").addEventListener("click", function (e) {
		
		e.preventDefault();
		console.log('INDEXX: Watering choice running');
		ipcRenderer.send('WhatIsMain','Watering'); // вызов промиса, запрос на открытие окна Econnections
	});
	//переход в окно сетапа теплицы GH
	document.getElementById("Menu_AddNew_GH").addEventListener("click", function (e) {
	e.preventDefault();
	console.log('INDEX: GH setup running');
	//ipcRenderer.send('WhatIsMain','GH'); // вызов промиса, запрос на открытие окна Econnections
	ipcRenderer.send('OpenSetupWnd','GH'); // запрос на открытие окна GHSetup
	});
	//переход в окно сетапа полива Watering
	document.getElementById("Menu_AddNew_Watering").addEventListener("click", function (e) {
	e.preventDefault();
	console.log('INDEX: Watering setup running');
	//ipcRenderer.send('WhatIsMain','GH'); // вызов промиса, запрос на открытие окна Econnections
	ipcRenderer.send('OpenSetupWnd','Watering'); // запрос на открытие окна GHSetup
	});

	document.getElementById("Menu_AddNew_IoT").addEventListener("click", function (e) {
		e.preventDefault();
		console.log('INDEX: IoT setup running');
		//ipcRenderer.send('WhatIsMain','GH'); // вызов промиса, запрос на открытие окна Econnections
		ipcRenderer.send('OpenSetupWnd','IoT'); // запрос на открытие окна GHSetup
	});

	document.getElementById("Menu_AddNew_Wifi_box").addEventListener("click", function (e) {
		e.preventDefault();
		console.log('WiFi running');
		//ipcRenderer.send('WhatIsMain','GH'); // вызов промиса, запрос на открытие окна Econnections
		ipcRenderer.send('OpenSetupWnd','WiFi_setup'); // запрос на открытие окна GHSetup
	});

	//переход в окно графика
	document.getElementById("gotoChartsWindow").addEventListener("click", function (e) {
	e.preventDefault();
	console.log('Chart will run here');
	ipcRenderer.send('OpenChartWnd','Chart'); // вызов промиса, запрос на открытие окна Chart
	})

	document.getElementById("MenuAboutWindow").addEventListener("click", function (e) {
		console.log('About will be here');
		ipcRenderer.send('AboutWnd','About'); // вызов промиса, запрос на открытие окна Chart
		/*let AbouWindow = new BrowserWindow ({
				width: 600,
				height: 450,
				webPreferences: {
					nodeIntegration: true
				},
			  	parent: MainWin
		   })

		AbouWindow.webContents.openDevTools()
		AbouWindow.loadFile('AboutWindow.html');    
		AbouWindow.on('closed', () => {
		AbouWindow = null; //Закрываем все, что относится к Charts 
		}) */
	})
	
	document.getElementById("MenuChart_FOR_TEST").addEventListener("click", function (e) {
		console.log("Charts debugging");
		ipcRenderer.send("OpenChartWndRequest",[true,"chartsTest.csv"]);
	})

	document.getElementById("chartFromFile").addEventListener("click", function (e) {
		console.log("Charts from file");
		
		let CFGFilePath = dialog.showOpenDialog({ //открываем окно диалога
			//defaultPath : "E:\\DIY\\UniversalGardenBoxProject_v3",
			defaultPath : "\\",
			properties: ["openFile"],
			filters: [
			  { name :'GH*', extensions: ['csv']},
			  { name :'*', extensions: ['*']}
			  ]
			});	
		  //console.log("CFGFilePath = "); console.log(CFGFilePath.filePaths);
		  CFGFilePath.then(function(obj) { //открываем файл исходя из результатов диалога
			  if (obj.filePaths != ''){
			  //console.log("before obj.filePaths = "); console.log(obj.filePaths);
			  let MyCFGFilePath = obj.filePaths;
			  console.log("file = " + MyCFGFilePath)
			  ipcRenderer.send("OpenChartWndRequest",["true",MyCFGFilePath]);
			  //setTimeout(() => {  console.log("wait then Update chart now "); ipcRenderer.send("LogUpdateEvent","20201228GH4.csv");}, 2000);	
			  setTimeout(() => {  console.log("wait then Update chart now "); ipcRenderer.send("LogUpdateEvent",MyCFGFilePath);}, 4000);	
			  } else {console.log(" AnyFilesWereChoosen ")}			
			  })

		//console.log("Update chart now");
		//setTimeout(() => {  console.log("wait then Update chart now "); ipcRenderer.send("LogUpdateEvent","20201228GH4.csv");}, 2000);
		//ipcRenderer.send("LogUpdateEvent","MyCSVFile.txt");
		//LogUpdateEvent
	})

	document.getElementById("ComNameSelect").addEventListener("click", function (e) {
		console.log("com port setup before");console.log(document.getElementById("ComNameSelect").value);
		if (document.getElementById("ComNameSelect").value === "init"){
		console.log("com port setup");
		MySerial.SerialList().then ((MyCOMList) => {
			console.log(MyCOMList);
			for (let i = 0 ; i < MyCOMList.length ; i ++) {
				//console.log(MyCOMList[i].path, ": ", MyCOMList[i].manufacturer)
				//document.getElementById("ComNameSelect").options [i] = new Option (value = MyCOMList[i].path + ": "+ MyCOMList[i].manufacturer, 
				//label = MyCOMList[i].path);
				document.getElementById("ComNameSelect").options [i] = new Option (MyCOMList[i].manufacturer + " at " + MyCOMList[i].path,  MyCOMList[i].path);
			}
			document.getElementById("ComNameSelect").size =  MyCOMList.length;
			})
		}
		else {
			console.log("com port list setup");
			document.getElementById("ComNameSelect").size =  1;
			document.getElementById("ButtonConnectionSetup").disabled = false;
			document.getElementById("ComNameSelect").disabled = true;
			document.getElementById("SendMyStringButton").disabled = false;
		}
	})

	document.getElementById("ButtonConnectionSetup").addEventListener("click", function (e) {
		MyCOMPort = new SerialPort(document.getElementById("ComNameSelect").value, {
			baudRate: Number(document.getElementById("COMPortRate").value),
			parser: new SerialPort.parsers.Readline({ delimiter: '\r\n' })
		}, 
		function (err) {if (err) {return console.log('Error: ', err.message);}}
		);

		MyParser = MyCOMPort.pipe(new Readline({ delimiter: '\r\n' }))
	        
	    MyParser.on('data', function (data){ //Это фрагмент получения строки от порта.
			document.getElementById("TextRecieved").value =document.getElementById("TextRecieved").value + data + '\r\n';

			if (document.getElementById("NoScroll").checked == true){
				document.getElementById("TextRecieved").scrollTop = document.getElementById("TextRecieved").scrollHeight;
			}

		});

		document.getElementById("ButtonConnectionSetup").disabled = true;
	})


	document.getElementById("textToSend").addEventListener("keyup", function (e) {

		if (event.keyCode === 13) {
			console.log(document.getElementById("textToSend").value);
			MyCOMPort.write(document.getElementById("textToSend").value + '\r\n', function(err) {
				if (err) {return console.log('Error on write: ', err.message)}
				console.log('message written')
			 document.getElementById("textToSend").value =' ';
			})
		  }

	})

	document.getElementById("SendMyStringButton").addEventListener("click", function (e) {
		MyCOMPort.write(document.getElementById("textToSend").value + '\r\n', function(err) {
			if (err) {return console.log('Error on write: ', err.message)}
			console.log('message written')
		 document.getElementById("textToSend").value =' ';
		});
	})
	