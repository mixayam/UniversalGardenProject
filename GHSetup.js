//24.03.2020 Видит список COM портов
//20.10.2020 Возобновление. К этому моменту умеет выбирать порт и грузить туда информацию и отображать ее в окне, т.е. 
//фактически это урезанный терминал. Оригинал MyPassport/.../Project_1
//22.10.2020 Перемещено E:\DIY\UniversalGardenBoxProject

//const PortSetupIpc = require('electron-promise-ipc');
//const { ipcRenderer } = require('electron')
//const ipcRenderer = require('electron')
//18.11.2020 Адаптация к форме GHSetup
//22.11.2020 Адаптировано. Работа по сращиванию
//25.11.2020 Стыковка с платой Умеет посылать команду на изменение параметра 0

const ipcRenderer = require('electron').ipcRenderer
const MySerial = require('./MySerial')
const SerialPort = require('serialport')
const Readline = require('@serialport/parser-readline')
const MyStringParser = require('./ParsingWorks')
const ArduinoCommandGener = require('./BoxCommandGener')

const fs = require('fs');

var MyComPortParam;
var MyCOMPort;
var MyParser;
var MySendVarToTest = "To function";
var MyCOMHandler;

//var MyParam;
var MyRshParams; //то что выловил парсер при получении rsh
var JSONParam;
var MyFileName;
var MyCSVFile;
	document.title="new name"
	document.getElementById("clearButton").addEventListener("click", function (e){
	document.getElementById("textToSend").value = null;	
	})

	document.getElementById("ComNameSelect").addEventListener("click", function (e) {
	e.preventDefault();
	//console.log('val before= '+ document.getElementById("ComNameSelect").value);
	document.getElementById("SendButton").disabled = true;
	if (document.getElementById("ComNameSelect").value == 'init'){
		//console.log('Serial port list forming will run here');

	    //MySerial.run(MyCOMListPattern).then ((MyCOMList) => {
		//MySerial.run().then ((MyCOMList) => {
		MySerial.SerialList().then ((MyCOMList) => {
			//console.log('here is connections ');
			//console.log(MyCOMList);
			//console.log('MyCom port length VERY IMPORTANT');
			//console.log(MyCOMList.length);

			for (let i = 0 ; i < MyCOMList.length ; i ++) {
				//console.log(MyCOMList[i].path, ": ", MyCOMList[i].manufacturer)
				//document.getElementById("ComNameSelect").options [i] = new Option (value = MyCOMList[i].path + ": "+ MyCOMList[i].manufacturer, 
				//label = MyCOMList[i].path);
			    document.getElementById("ComNameSelect").options [i] = new Option (value = MyCOMList[i].path, 
				label = MyCOMList[i].path);
				}
			})
		
	}
	
	//console.log('val after= '+ document.getElementById("ComNameSelect").value);
	
	if (document.getElementById("ComNameSelect").value != 'init'){
	 document.getElementById("ComPortOpenButton").value = document.getElementById("ComNameSelect").value + ' is choosen';
	 document.getElementById("ComPortOpenButton").label = document.getElementById("ComNameSelect").label;
	 document.getElementById("ComPortOpenButton").disabled = false
	 //document.getElementsByClassName("RightTable").style.backgroundColor =#00FF00;
	 //document.getElementsByClassName("RightTable").style.backgroundColor ='green';
	 //document.getElementById("SendButton").disabled = false
	}
	});
	
	document.getElementById("ComPortOpenButton").addEventListener("click", function (e) {
	e.preventDefault();
	/*После открытия порта: включает кнопку SendButton, делает зеленым поле, блокирует кнопку open, отправляет данные порта в main через промис PortSetupIsOver
	включает чтение строк из порта, запускает парсер входной строки, выводит данные через промис DataExchange
	*/
	
	document.getElementById("ComPortOpenButton").value = document.getElementById("ComNameSelect").value + ' is open';
	 
	//console.log(document.getElementById("ComNameSelect").value);
	//console.log(document.getElementById("COMPortRate").value);
    
	
	MyCOMPort = new SerialPort(document.getElementById("ComNameSelect").value, {
     baudRate: Number(document.getElementById("COMPortRate").value),
	 parser: new SerialPort.parsers.Readline({ delimiter: '\r\n' })
     }, function (err) {	
      if (err) {
	   //document.getElementById("ComPortOpenButton").value = document.getElementById("ComNameSelect").value + ' is not available! Reason is:' + err.message;
	   
	   var myConnectionsBlock = document.getElementById('ConnectionsBlock');
	   myConnectionsBlock.style.background = 'red';
	   document.getElementById("SendButton").disabled = true;	   
	   document.getElementById("CommonInfo").value = err.message;
	   return console.log('Error: ', err.message);
      }
     }	
	)
	
	document.getElementById("SendButton").disabled = false;
	var myConnectionsBlock = document.getElementById('ConnectionsBlock');
	myConnectionsBlock.style.background = 'lightgreen';
	
	document.getElementById("ComPortOpenButton").disabled = true;
    document.getElementById("CommonInfo").value = document.getElementById("ComNameSelect").value + "/" +  document.getElementById("COMPortRate").value + " is OK "
	
	//if (MyIntoField == '') {document.getElementById("CommonInfo").value = "Board ID = " + MyBoardID + " at " + document.getElementById("CommonInfo").value;}
	//if (document.getElementById("CommonInfo").value == ''){document.getElementById("CommonInfo").value = "Board ID = " + MyBoardID + " at " + document.getElementById("CommonInfo").value;}
	//ipcRenderer.send('PortSetupIsOver',{"ComName":document.getElementById("ComNameSelect").value,"ComBaud":document.getElementById("COMPortRate").value,"ComDelim":"\r\n"});
	
	//MyCOMHandler = MyCOMPort.openHandler();
	
	MyParser = MyCOMPort.pipe(new Readline({ delimiter: '\r\n' }))
	
		MyParser.on('data', function (data){ //Это фрагмент получения строки от порта. Получаем строку, показываем в дисплее, 
		//вызываем парсер, если получено "rsh", вычисляем BoardID и формируем имена файлов конфигурации .cnf и накопления данных .csv 
			console.log('on Data ' + data);
			document.getElementById("MyDisplay").value = document.getElementById("MyDisplay").value+data+'\r\n';

			var MyParam = MyStringParser.GHSetupParser(data);
			console.log("MyParam =" + MyParam);
			if (MyParam !== undefined){
			console.log("when not undef");
			MyRshParams = MyParam;
			JSONParam = JSON.parse(MyRshParams);
			var CurrentDate = new Date();
			MyFileName = 'GH_' + JSONParam.BoardID + '.cfg'; 
			MyCSVFile = CurrentDate.getFullYear()  + ("0" + (CurrentDate.getMonth()+1).toString()).slice(-2) + 
				("0" + (CurrentDate.getDate()).toString()).slice(-2) + 
				'GH' + JSONParam.BoardID + '.csv';
			document.getElementById("LogFileName").value = MyCSVFile;
			document.getElementById("ConfigFileName").value = MyFileName;
			//if (MyParam.indexOf("rsh") !== -1){
		     //if (document.getElementById("CommonInfo").value == ''){document.getElementById("CommonInfo").value = "Board ID = " + MyBoardID + " at " + document.getElementById("CommonInfo").value;}
				var myStrToParamAdd = '{"BoxType":"GH","ComName": "' + document.getElementById("ComNameSelect").value + 
				'","ComBaud": "' + document.getElementById("COMPortRate").value + '",' + '"LogFileName": "' + MyCSVFile + '",';
		
				MyRshParams = MyRshParams.replace(/{/, myStrToParamAdd);
				//MyParam.indexOf('rst',0);
				//console.log("MyParam =" + MyParam);
				//console.log("Command detected " + MyParam.indexOf("rsh"));
				//if (MyParam.indexOf("rsh") !== -1){
				//console.log("Command = " + MyParam.Command);
				ipcRenderer.send('DataExchange',MyRshParams);	
			}
			//if (MyParam.indexOf("rsh") !== -1){console.log("Command = " + MyParam.Command);ipcRenderer.send('DataExchange',MyParam);}
		})
	});
	
	document.getElementById("SendButton").addEventListener("click", function (e) {
		e.preventDefault();

		
	  MyCOMPort.write(document.getElementById("textToSend").value + '\r\n', function(err) {
       if (err) {
        return console.log('Error on write: ', err.message)
		
       }
       //console.log('message written')
	   document.getElementById("textToSend").value =' ';
       }
	  )
		
	   }
    )

	document.getElementById("textToSend").addEventListener("onchange", function (e) {
		e.preventDefault();
	    console.log('Here is string to send');
	   }
    )
	
	document.getElementById("RefreshButton").addEventListener("click", function (e){
	//console.log("refresh button clicked");
	   MyCOMPort.write("rsh\r\n", function(err) {
       if (err) {
        return console.log('Error on write: ', err.message)
		
       }
       //console.log('message written')
	   //document.getElementById("textToSend").value =' ';
       }
	  )  
	})	

	document.getElementById("RefreshJSButton").addEventListener("click", function (e){
		//console.log("refresh button clicked");
		   MyCOMPort.write("rshjs\r\n", function(err) {
		   if (err) {
			return console.log('Error on write: ', err.message)
			
		   }
		   //console.log('message written')
		   //document.getElementById("textToSend").value =' ';
		   }
		  )  
	})	

    //загрузка параметров в файл конфигурации
	document.getElementById("LoadIntoFileButton").addEventListener("click", function (e){
		
				console.log("MyRshParams = " + MyRshParams);
				MyCSVFile = document.getElementById("LogFileName").value;
			    MyFileName= document.getElementById("ConfigFileName").value;
				document.getElementById("StatusInfo").value = "Files " + MyFileName + " and " + MyCSVFile + " are going to be created";
				MyRshParams = JSON.parse(MyRshParams);				
				MyRshParams.LogFileName = document.getElementById("LogFileName").value;	
				MyRshParams	= JSON.stringify(MyRshParams);			
				fs.open(MyFileName, 'w', (err) => {if(err) throw err;});	
			    fs.writeFile(MyFileName,MyRshParams, (err) => {if(err) throw err;})
				ipcRenderer.send('DataExchange', MyRshParams);
			//console.log(MyFileName + ' something is wrong when write ' + err);
			//});
	})

	document.getElementById("GetFromFile").addEventListener("click", function (e){
		var MyFileName = 'GH_3.json';
		//console.log("File name " + MyFileName);	
		fs.readFile(MyFileName, (err, rawdata ) => {
		if(err) throw err;
		//console.log("String from file " + MyFileName + " = "); console.log(rawdata);
		let MaGotString = JSON.parse(rawdata);
    	console.log("String from file " + MyFileName);console.log(MaGotString);
		});
		
	})
	
	window.onbeforeunload = (e) => {
//  console.log('Econn is closing');
//	console.log(MyCOMPort);
	MyCOMPort.close(function (err){console.log('port closed',err);});
//	console.log('after');
//	console.log(MyCOMPort);
}

	document.getElementById("GenDelayField").addEventListener("change", function (e) {
		
		//console.log(document.getElementById("GenDelayField").value*10);
		if (document.getElementById("transmitJSONFormat").checked == false){
			//MyCOMPort.write(ArduinoCommandGener.GHSendToBoxCommand(3,document.getElementById("GenDelayField").value*1000));
			MyCOMPort.write(ArduinoCommandGener.GHSendToBoxCommand(3,document.getElementById("GenDelayField").value));
			MyCOMPort.write('rsh', function(err) {if (err) {return  err.message}});
		} 
		else {
			//MyCOMPort.write('{\"myGeneralDelay\":' + document.getElementById("GenDelayField").value*1000 +'}\n');
			MyCOMPort.write('{\"myGeneralDelay\":' + document.getElementById("GenDelayField").value +'}\n');
			MyCOMPort.write('rshjs\n', function(err) {if (err) {return  err.message}});
		}
		
	})

	document.getElementById("TempMeasurementsDelayField").addEventListener("change", function (e) {
		if (document.getElementById("transmitJSONFormat").checked == false){
			//MyCOMPort.write(ArduinoCommandGener.GHSendToBoxCommand(4,document.getElementById("TempMeasurementsDelayField").value*10));
			MyCOMPort.write(ArduinoCommandGener.GHSendToBoxCommand(4,document.getElementById("TempMeasurementsDelayField").value));	
		 	MyCOMPort.write('rsh', function(err) {if (err) {return  err.message}});
		}
		else{
			//MyCOMPort.write('{\"tempMearurementDelay\":' + document.getElementById("TempMeasurementsDelayField").value*10+'}\n');
			MyCOMPort.write('{\"tempMearurementDelay\":' + document.getElementById("TempMeasurementsDelayField").value +'}\n');
			MyCOMPort.write('rshjs\n', function(err) {if (err) {return  err.message}});

		}
	})

	document.getElementById("TopTempThresTxt").addEventListener("change", function (e) {
		if (document.getElementById("transmitJSONFormat").checked == false){
	 		MyCOMPort.write(ArduinoCommandGener.GHSendToBoxCommand(0,document.getElementById("TopTempThresTxt").value));
	 		MyCOMPort.write('rsh', function(err) {if (err) {return  err.message}});
	 	}
		else{
			MyCOMPort.write('{\"TempThresHigh\":' + document.getElementById("TopTempThresTxt").value+'}\n');
			MyCOMPort.write('rshjs\n', function(err) {if (err) {return  err.message}});
		}
	})
	
	document.getElementById("BottomTempThresTxt").addEventListener("change", function (e) {
		if (document.getElementById("transmitJSONFormat").checked == false){
	 		MyCOMPort.write(ArduinoCommandGener.GHSendToBoxCommand(1,document.getElementById("BottomTempThresTxt").value));
	 		MyCOMPort.write('rsh', function(err) {if (err) {return  err.message}}); 
		}
		else{
			MyCOMPort.write('{\"TempThresLow\":' + document.getElementById("BottomTempThresTxt").value+'}\n');
			MyCOMPort.write('rshjs\n', function(err) {if (err) {return  err.message}});	
		}
	})

	document.getElementById("TempVarDegField").addEventListener("change", function (e) {
		if (document.getElementById("transmitJSONFormat").checked == false){
	 		MyCOMPort.write(ArduinoCommandGener.GHSendToBoxCommand(12,document.getElementById("TempVarDegField").value));
	 		MyCOMPort.write('rsh', function(err) {if (err) {return  err.message}}); 
		}
		else{
			MyCOMPort.write('{\"TempAugment\":' + document.getElementById("TempVarDegField").value+'}\n');
			MyCOMPort.write('rshjs\n', function(err) {if (err) {return  err.message}});	
		}
	})

	document.getElementById("TimeVarDegField").addEventListener("change", function (e) {
		if (document.getElementById("transmitJSONFormat").checked == false){
	 		MyCOMPort.write(ArduinoCommandGener.GHSendToBoxCommand(13,document.getElementById("TimeVarDegField").value));
	 		MyCOMPort.write('rsh', function(err) {if (err) {return  err.message}}); 
		}
		else{
			MyCOMPort.write('{\"TimeAugment\":' + document.getElementById("TimeVarDegField").value+'}\n');
			MyCOMPort.write('rshjs\n', function(err) {if (err) {return  err.message}});	
		}
	})

	document.getElementById("WaterTempThreshold").addEventListener("change", function (e) {
		if (document.getElementById("transmitJSONFormat").checked == false){
	 		MyCOMPort.write(ArduinoCommandGener.GHSendToBoxCommand(15,document.getElementById("WaterTempThreshold").value));
	 		MyCOMPort.write('rsh', function(err) {if (err) {return  err.message}}); 
		}
		else{
			MyCOMPort.write('{\"WaterTempThres\":' + document.getElementById("WaterTempThreshold").value+'}\n');
			MyCOMPort.write('rshjs\n', function(err) {if (err) {return  err.message}});	
		}
	})	

	document.getElementById("HumidityTHresField").addEventListener("change", function (e) {
		if (document.getElementById("transmitJSONFormat").checked == false){
	 		MyCOMPort.write(ArduinoCommandGener.GHSendToBoxCommand(2,document.getElementById("HumidityTHresField").value));
	 		MyCOMPort.write('rsh', function(err) {if (err) {return  err.message}}); 
		}
		else{
			MyCOMPort.write('{\"HumThres\":' + document.getElementById("HumidityTHresField").value+'}\n');
			MyCOMPort.write('rshjs\n', function(err) {if (err) {return  err.message}});	
		}
	})

	document.getElementById("Gear1FullOpen").addEventListener("change", function (e) {
		if (document.getElementById("transmitJSONFormat").checked == false){
	 		MyCOMPort.write(ArduinoCommandGener.GHSendToBoxCommand(8,document.getElementById("Gear1FullOpen").value));
	 		MyCOMPort.write('rsh', function(err) {if (err) {return  err.message}}); 
		}
		else{
			MyCOMPort.write('{\"FullOpenGearPosition1\":' + document.getElementById("Gear1FullOpen").value+'}\n');
			MyCOMPort.write('rshjs\n', function(err) {if (err) {return  err.message}});	
		}
	})
	
	document.getElementById("Gear2FullOpen").addEventListener("change", function (e) {
		if (document.getElementById("transmitJSONFormat").checked == false){
	 		MyCOMPort.write(ArduinoCommandGener.GHSendToBoxCommand(9,document.getElementById("Gear2FullOpen").value));
	 		MyCOMPort.write('rsh', function(err) {if (err) {return  err.message}}); 
		}
		else{
			MyCOMPort.write('{\"FullOpenGearPosition2\":' + document.getElementById("Gear2FullOpen").value+'}\n');
			MyCOMPort.write('rshjs\n', function(err) {if (err) {return  err.message}});	
		}
	})

	document.getElementById("TempCutOffVariationMode").addEventListener("change", function (e) {
		if (document.getElementById("transmitJSONFormat").checked == false){
	 		MyCOMPort.write(ArduinoCommandGener.GHSendToBoxCommand(10,document.getElementById("TempCutOffVariationMode").value));
	 		MyCOMPort.write('rsh', function(err) {if (err) {return  err.message}}); 
		}
		else{
			MyCOMPort.write('{\"TempCutOff\":' + document.getElementById("TempCutOffVariationMode").value+'}\n');
			MyCOMPort.write('rshjs\n', function(err) {if (err) {return  err.message}});	
		}
	 })
		
	//document.getElementById("GroundTemperatureCheck").addEventListener("change", function (e) {
	//MyCOMPort.write(ArduinoCommandGener.GHSendToBoxCommand(8,document.getElementById("GroundTemperatureCheck").value));	
	//MyCOMPort.write('rsh \r\n', function(err) {if (err) {return  err.message}});
	// }
    //)
	
	document.getElementById("IgnoreDoor1SensCheck").addEventListener("change", function (e) {
	MyCOMPort.write(ArduinoCommandGener.GHSendToBoxCommand(10,document.getElementById("IgnoreDoor1SensCheck").value));	
	if (document.getElementById("transmitJSONFormat").checked == false){
		MyCOMPort.write('rsh', function(err) {if (err) {return  err.message}});
	} 
	else {
		MyCOMPort.write('rshjs\n', function(err) {if (err) {return  err.message}});
	}
	 } 
    )
	
	document.getElementById("IgnoreDoor2SensCheck").addEventListener("change", function (e) {
	MyCOMPort.write(ArduinoCommandGener.GHSendToBoxCommand(10,document.getElementById("IgnoreDoor2SensCheck").value));	
	if (document.getElementById("transmitJSONFormat").checked == false){
		MyCOMPort.write('rsh', function(err) {if (err) {return  err.message}});
	} 
	else {
		MyCOMPort.write('rshjs\n', function(err) {if (err) {return  err.message}});
	}
	 }
    )
	
	document.getElementById("ValveHasPosSensCheck").addEventListener("change", function (e) {
	MyCOMPort.write(ArduinoCommandGener.GHSendToBoxCommand(10,document.getElementById("ValveHasPosSensCheck").value));	
	MyCOMPort.write('rsh \r\n', function(err) {if (err) {return  err.message}});
	 }
    )
	
	document.getElementById("PeriodicalRepRemFormat").addEventListener("change", function (e) {
	MyCOMPort.write(ArduinoCommandGener.GHSendToBoxCommand(10,document.getElementById("PeriodicalRepRemFormat").value));	
	if (document.getElementById("transmitJSONFormat").checked == false){
		MyCOMPort.write('rsh', function(err) {if (err) {return  err.message}});
	} 
	else {
		MyCOMPort.write('rshjs\n', function(err) {if (err) {return  err.message}});
	}
	 }
    )	
	
	document.getElementById("PeriodicalRepHumFormat").addEventListener("change", function (e) {
	MyCOMPort.write(ArduinoCommandGener.GHSendToBoxCommand(10,document.getElementById("PeriodicalRepHumFormat").value));	
	if (document.getElementById("transmitJSONFormat").checked == false){
		MyCOMPort.write('rsh', function(err) {if (err) {return  err.message}});
	} 
	else {
		MyCOMPort.write('rshjs\n', function(err) {if (err) {return  err.message}});
	}
	 }
    )	

	//PeriodicalRepJSONFormat

	document.getElementById("PeriodicalRepJSONFormat").addEventListener("change", function (e) {
	MyCOMPort.write(ArduinoCommandGener.GHSendToBoxCommand(10,document.getElementById("PeriodicalRepJSONFormat").value));	
	if (document.getElementById("transmitJSONFormat").checked == false){
		MyCOMPort.write('rsh', function(err) {if (err) {return  err.message}});
	} 
	else {
		MyCOMPort.write('rshjs\n', function(err) {if (err) {return  err.message}});
	}
	 }
	)
	
	document.getElementById("GroundTemperatureCheck").addEventListener("change", function (e) {
	MyCOMPort.write(ArduinoCommandGener.GHSendToBoxCommand(10,document.getElementById("GroundTemperatureCheck").value));	
	if (document.getElementById("transmitJSONFormat").checked == false){
		MyCOMPort.write('rsh', function(err) {if (err) {return  err.message}});
	} 
	else {
		MyCOMPort.write('rshjs\n', function(err) {if (err) {return  err.message}});
	}
	 }
    )	

	document.getElementById("ExternalTemperatureCheck").addEventListener("change", function (e) {
	MyCOMPort.write(ArduinoCommandGener.GHSendToBoxCommand(10,document.getElementById("ExternalTemperatureCheck").value));	
	if (document.getElementById("transmitJSONFormat").checked == false){
		MyCOMPort.write('rsh', function(err) {if (err) {return  err.message}});
	} 
	else {
		MyCOMPort.write('rshjs\n', function(err) {if (err) {return  err.message}});
	}
	 }
    )	

	document.getElementById("ZondTempCheck").addEventListener("change", function (e) {
	MyCOMPort.write(ArduinoCommandGener.GHSendToBoxCommand(10,document.getElementById("ExternalTemperatureCheck").value));	
	if (document.getElementById("transmitJSONFormat").checked == false){
		MyCOMPort.write('rsh', function(err) {if (err) {return  err.message}});
	} 
	else {
		MyCOMPort.write('rshjs\n', function(err) {if (err) {return  err.message}});
	}
	}
	)	

	document.getElementById("DayLightCheck").addEventListener("change", function (e) {
	MyCOMPort.write(ArduinoCommandGener.GHSendToBoxCommand(10,document.getElementById("DayLightCheck").value));	
	if (document.getElementById("transmitJSONFormat").checked == false){
		MyCOMPort.write('rsh', function(err) {if (err) {return  err.message}});
	} 
	else {
		MyCOMPort.write('rshjs\n', function(err) {if (err) {return  err.message}});
	}
	 }
    )	
	
	document.getElementById("ValveHasPosSensCheck").addEventListener("change", function (e) {
	MyCOMPort.write(ArduinoCommandGener.GHSendToBoxCommand(10,document.getElementById("ValveHasPosSensCheck").value));	
	if (document.getElementById("transmitJSONFormat").checked == false){
		MyCOMPort.write('rsh', function(err) {if (err) {return  err.message}});
	} 
	else {
		MyCOMPort.write('rshjs\n', function(err) {if (err) {return  err.message}});
	}
	 }
    )
	
	document.getElementById("AllEventsRepRemFormat").addEventListener("change", function (e) {
	MyCOMPort.write(ArduinoCommandGener.GHSendToBoxCommand(10,document.getElementById("AllEventsRepRemFormat").value));	
	if (document.getElementById("transmitJSONFormat").checked == false){
		MyCOMPort.write('rsh', function(err) {if (err) {return  err.message}});
	} 
	else {
		MyCOMPort.write('rshjs\n', function(err) {if (err) {return  err.message}});
	}
	 }
    )
	
	document.getElementById("AllEventsRepHumFormat").addEventListener("change", function (e) {
	MyCOMPort.write(ArduinoCommandGener.GHSendToBoxCommand(10,document.getElementById("AllEventsRepHumFormat").value));	
	if (document.getElementById("transmitJSONFormat").checked == false){
		MyCOMPort.write('rsh', function(err) {if (err) {return  err.message}});
	} 
	else {
		MyCOMPort.write('rshjs\n', function(err) {if (err) {return  err.message}});
	}
	 }
    )
	
	document.getElementById("GroundZeroTemperatureCheck").addEventListener("change", function (e) {
	MyCOMPort.write(ArduinoCommandGener.GHSendToBoxCommand(10,document.getElementById("GroundZeroTemperatureCheck").value));	
	if (document.getElementById("transmitJSONFormat").checked == false){
		MyCOMPort.write('rsh', function(err) {if (err) {return  err.message}});
	} 
	else {
		MyCOMPort.write('rshjs\n', function(err) {if (err) {return  err.message}});
	}
	 }
    )	

	document.getElementById("WaterTempCheck").addEventListener("change", function (e) {
	MyCOMPort.write(ArduinoCommandGener.GHSendToBoxCommand(10,document.getElementById("WaterTempCheck").value));	
	MyCOMPort.write('rsh \r\n', function(err) {if (err) {return  err.message}});
	 }
    )	

	document.getElementById("HumidityCheck").addEventListener("change", function (e) {
	MyCOMPort.write(ArduinoCommandGener.GHSendToBoxCommand(10,document.getElementById("HumidityCheck").value));	
	MyCOMPort.write('rsh \r\n', function(err) {if (err) {return  err.message}});
	 }
    )	

	document.getElementById("WateringJustTimedRadio").addEventListener("change", function (e) {
		if (document.getElementById("WateringJustTimedRadio").checked == true)
		{
			document.getElementById("WateringTempDependentRadio").checked = false;
			document.getElementById("WateringMostSensDepRadio").checked = false;
		}
		MyCOMPort.write(ArduinoCommandGener.GHSendToBoxCommand(5,document.getElementById("WateringJustTimedRadio").value));	
		MyCOMPort.write('rsh \r\n', function(err) {if (err) {return  err.message}});
	})	

	document.getElementById("WateringTempDependentRadio").addEventListener("change", function (e) {
		if (document.getElementById("WateringTempDependentRadio").checked == true)
		{
			document.getElementById("WateringJustTimedRadio").checked = false;
			document.getElementById("WateringMostSensDepRadio").checked = false;
		}
		MyCOMPort.write(ArduinoCommandGener.GHSendToBoxCommand(5,document.getElementById("WateringTempDependentRadio").value));	
		MyCOMPort.write('rsh \r\n', function(err) {if (err) {return  err.message}});
	})	

	document.getElementById("WateringMostSensDepRadio").addEventListener("change", function (e) {
		if (document.getElementById("WateringMostSensDepRadio").checked == true)
		{
			document.getElementById("WateringJustTimedRadio").checked = false;
			document.getElementById("WateringTempDependentRadio").checked = false;
		}
		MyCOMPort.write(ArduinoCommandGener.GHSendToBoxCommand(5,document.getElementById("WateringMostSensDepRadio").value));	
		MyCOMPort.write('rsh \r\n', function(err) {if (err) {return  err.message}});
	})

	document.getElementById("SimpleScenarioCheck").addEventListener("change", function (e) {
		if (document.getElementById("SimpleScenarioCheck").checked == true)
		{
			document.getElementById("VariationCutOffCheck").checked = false;
			document.getElementById("NightFogCtrlRadio").checked = false;
		}
		MyCOMPort.write(ArduinoCommandGener.GHSendToBoxCommand(5,document.getElementById("SimpleScenarioCheck").value));	
		MyCOMPort.write('rsh \r\n', function(err) {if (err) {return  err.message}});
	})

	document.getElementById("VariationCutOffCheck").addEventListener("change", function (e) {
		if (document.getElementById("VariationCutOffCheck").checked == true)
		{
			document.getElementById("SimpleScenarioCheck").checked = false;
			document.getElementById("NightFogCtrlRadio").checked = false;
		}
		MyCOMPort.write(ArduinoCommandGener.GHSendToBoxCommand(5,document.getElementById("VariationCutOffCheck").value));	
		MyCOMPort.write('rsh \r\n', function(err) {if (err) {return  err.message}});
	})

	document.getElementById("NightFogCtrlRadio").addEventListener("change", function (e) {
		if (document.getElementById("NightFogCtrlRadio").checked == true)
		{
			document.getElementById("SimpleScenarioCheck").checked = false;
			document.getElementById("VariationCutOffCheck").checked = false;
		}
		MyCOMPort.write(ArduinoCommandGener.GHSendToBoxCommand(5,document.getElementById("NightFogCtrlRadio").value));	
		MyCOMPort.write('rsh \r\n', function(err) {if (err) {return  err.message}});
	})

	document.getElementById("HumidityMeasurementsDelayField").addEventListener("change", function (e) {       //25
		if (document.getElementById("transmitJSONFormat").checked == false){
			//MyCOMPort.write(ArduinoCommandGener.GHSendToBoxCommand(25,document.getElementById("HumidityMeasurementsDelayField").value*10));
			MyCOMPort.write(ArduinoCommandGener.GHSendToBoxCommand(25,document.getElementById("HumidityMeasurementsDelayField").value));	
			MyCOMPort.write('rsh \r\n', function(err) {if (err) {return  err.message}});
		}
		else{
			//MyCOMPort.write('{\"humMearurementDelay\":' + document.getElementById("HumidityMeasurementsDelayField").value*10+'}\n');
			MyCOMPort.write('{\"humMearurementDelay\":' + document.getElementById("HumidityMeasurementsDelayField").value +'}\n');
			MyCOMPort.write('rshjs\n', function(err) {if (err) {return  err.message}});
		}
	})

	document.getElementById("ValveOpeningTimeField").addEventListener("change", function (e) {
		if (document.getElementById("transmitJSONFormat").checked == false){
			//MyCOMPort.write(ArduinoCommandGener.GHSendToBoxCommand(26,document.getElementById("ValveOpeningTimeField").value*10));	
			MyCOMPort.write(ArduinoCommandGener.GHSendToBoxCommand(26,document.getElementById("ValveOpeningTimeField").value));	
			MyCOMPort.write('rsh \r\n', function(err) {if (err) {return  err.message}});
		}
		else{
			//MyCOMPort.write('{\"wateringSwiitchOnTime\":' + document.getElementById("ValveOpeningTimeField").value*10+'}\n');
			MyCOMPort.write('{\"wateringSwiitchOnTime\":' + document.getElementById("ValveOpeningTimeField").value +'}\n');
			MyCOMPort.write('rshjs\n', function(err) {if (err) {return  err.message}});			
		}
	})     

	//document.getElementById("remoteControlOn").addEventListener("click", function (e) {
	//	console.log("remote switch on");console.log(document.getElementById("remoteControlOn").checked)
	//})
	
	
	
	
	
	
	
	
	
	
	
	
	