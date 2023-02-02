	const SerialPort = require('serialport');
	const Readline = require('@serialport/parser-readline');
    const  ipcRenderer = require ('electron').ipcRenderer;
	const {dialog}  = require('electron').remote;
	const MyStringParser = require('./ParsingWorks');
	const MyMCEngine = require('./MCEngine');
	const fs = require('fs');
	const path = require('path');
	const { controllers } = require('chart.js');
	const fileWorks = require('./fileWorks');

	const MyFileWork = require('./fileWorks');
	const setupData = require('./setupData');

    var	  CurrentDate = new Date();
	var LogFileStartDate = new Date();
	//var maxLogFileSize;
	var ChartArray = [];   

	//MyFileWork
	
    var MyExchange;
	var MyChoosenButton = 10;
	var MyCSVFile;
	var remoteMCOn; //false МС выкл true МС вкл
	var LogFileSize = 48; // мин размер логфайла 
	var maxLogFileSize = 72; //макс размер логфайла 

	//console.log('Status script is running here');

	//Поднятие промиса IPC для обмена с Main
	//ipcRenderer.on('ToStatusTransfer', (event,arg) => {
	
	ipcRenderer.on('ToStatusTransfer', (event,arg, LocalControls) => {

		var CurrentDate = new Date();

		console.log("ToStatusTransfer, arg = "); console.log(arg);
		//Получение параметров из Main
        MyExchange = JSON.parse(arg);
		document.title = MyExchange.BoxType + "_" + MyExchange.BoardID;
		document.getElementById("BoxInfo").value = "Box at " + MyExchange.ComName + "/" + MyExchange.ComBaud;
		console.log(MyExchange.Sensors);

		if(MyExchange.CloudMC != undefined){
			document.getElementById("BoxInfo").value = document.getElementById("BoxInfo").value + ' Remote MC via:' +
			MyExchange.CloudMC.MCComName + '/' + MyExchange.CloudMC.MCComBaud;
			document.getElementById("remoteMC").disabled = false;
			document.getElementById("remoteMC").checked= true;
			remoteMCOn = true;
		}
		
		//Поднятие порта, параметры получены из Main
		MyCOMPort = new SerialPort(MyExchange.ComName, {
         		baudRate: Number(MyExchange.ComBaud),
	     		parser: new SerialPort.parsers.Readline({ delimiter: '\r\n' })
			}, 
			function (err) {if (err) {return console.log('Error: ', err.message);}}
		);
			
		//тут должно быть условие: если стоит галка, то файл создается, нет - нет						
		//console.log ("file check = " + document.getElementById("LoggingIsOn").value)
		//формируем имя лог файла исходя из номера платы и даты
		//var MyCSVFile = MyExchange.LogFileName;	//работа с логами. 

		MyCSVFile = MyExchange.LogFileName;	//работа с логами. 
		console.log ("file check = " + document.getElementById("LoggingIsOn").value)
		//если имя файла отсутствует ""
		if ((MyExchange.LogFileName =="") || (document.getElementById("LoggingIsOn").value == false)) {
			document.getElementById("LogFileName").value = 	"any log files defined";	//Вывод имени файла.
			document.getElementById("LoggingIsOn").checked = false;
			MyChoosenButton = 10;
		} 
		else{ //если имя файла присутствует
			//console.log("file name")
			document.getElementById("LogFileName").value = 	MyCSVFile;	//Вывод имени файла.
			
			document.getElementById("LoggingIsOn").checked = true;
			//document.getElementById("BoxInfo").value = document.getElementById("BoxInfo").value + " Log started at " 
			//загрузка в файл
			if (fs.existsSync(MyCSVFile)) { //если файл существует, выдаем сообщение, ждем результат
				//открываем файл, читаем первую строку, выводим дату
				fs.readFile(MyCSVFile, 'utf8', function(err, data){

					let myTmpString = data.toString().split("\\n")
					console.log(myTmpString);
					let myCommIndex = myTmpString[0].indexOf(";",0)
					console.log(myTmpString.slice(0,myCommIndex))
					document.getElementById("LogFileName").value = document.getElementById("LogFileName").value + " started at " + myTmpString[0].slice(0,myCommIndex)
					LogFileStartDate = new Date(myTmpString[0].slice(0,myCommIndex));
					console.log(LogFileStartDate)

					MyChoosenButton = dialog.showMessageBoxSync({type : 'warning', title: "Log file Setup", message: MyCSVFile + " started at " + LogFileStartDate + " already exists",
					buttons:['Add "_X" to file name' ,"Replace","Add to existing"]});	
					console.log("Button after dialog=" + MyChoosenButton);
					if (MyChoosenButton == 0){	//Add "_X" to file name
						MyCSVFile = MyCSVFile.substr(0, MyCSVFile.indexOf('.',0)) + "_X" + ".csv"	
						LogFileStartDate = new Date();						
					}
					//document.getElementById("LogFileName").value = 	MyCSVFile;	//Вывод нового имени файла.
				});
			} else{
				LogFileStartDate = new Date();	
				MyChoosenButton = 2;
			}

				
         	fs.open(MyCSVFile, 'wx', (err) => { //открываем лог
			   	if (err) {if (err.code === "EEXIST") {return;}
					else {
                		throw err;
               		}
            	}
			})
		}	
		//fs.writeFile(MyFileName,MyRshParams, (err) => {if(err) throw err;})			
		//Читаем строку
		MyParser = MyCOMPort.pipe(new Readline({ delimiter: '\r\n' }))
	        
	    MyParser.on('data', function (data){ //Это фрагмент получения строки от порта.

			var CurrentDate = new Date();
			// Загрузка полученной строки в поле мониторинга
		    document.getElementById("RecieveMonitorScreen").value = document.getElementById("RecieveMonitorScreen").value + '<' +
			CurrentDate.getHours() + ":" + ("0" + (CurrentDate.getMinutes()).toString()).slice(-2) + ":" + ("0" + (CurrentDate.getSeconds()).toString()).slice(-2) + " " + 
			data +'\r\n';
				
			if (document.getElementById("monitorScroll").checked == true){
				document.getElementById("RecieveMonitorScreen").scrollTop = document.getElementById("RecieveMonitorScreen").scrollHeight;
			}
			
			let MyRstString = MyStringParser.GHStatusParser(data);
			var delim = ";";

			if (MyRstString != undefined){
				MyRstString= JSON.parse(MyRstString);

				let myValCheck = 1;
				if (MyRstString.Temperature.box < -100){myValCheck = 0}
				if (MyRstString.Temperature.internal < -100){myValCheck = 0}
				if (MyRstString.Temperature.ground < -100){myValCheck = 0}
				if (MyRstString.Temperature.external < -100){myValCheck = 0}
				if (MyRstString.Temperature.bottom < -100){myValCheck = 0}
				if (MyRstString.Temperature.water < -100){myValCheck = 0}
				if (MyRstString.Temperature.zond < -100){myValCheck = 0}
				if (MyRstString.controlNumber != 43690){myValCheck = 0}

				if(myValCheck == 1){
					//var MyStringToSave = CurrentDate.getFullYear() + "/" + ("0" + (CurrentDate.getMonth()+1).toString()).slice(-2) + "/" + ("0" + CurrentDate.getDate().toString()).slice(-2) + " " + 
					var collectWord = CurrentDate.getFullYear() + "/" + ("0" + (CurrentDate.getMonth()+1).toString()).slice(-2) + "/" + ("0" + CurrentDate.getDate().toString()).slice(-2) + " " + 
					CurrentDate.getHours() + ":" + 
					("0" + (CurrentDate.getMinutes()).toString()).slice(-2) + ":" + ("0" + (CurrentDate.getSeconds()).toString()).slice(-2) + 
					delim + MyRstString.Command + 
					delim + MyRstString.BoardID +
					delim + MyRstString.TimerValue +
					delim + MyRstString.Temperature.box +
					delim + MyRstString.Temperature.internal +
					delim + MyRstString.Temperature.ground +
					delim + MyRstString.Temperature.external +
					delim + MyRstString.Temperature.bottom +
					delim + MyRstString.Temperature.water +
					delim + MyRstString.Temperature.zond +
					delim + MyRstString.humidity +
					delim + MyRstString.light +
					delim + MyRstString.rain +
					delim + MyRstString.Actuator1 +
					delim + MyRstString.Actuator2 +
					delim + MyRstString.pins + '\r\n';

					let MyStringToSave = collectWord.toString()

					console.log("MyStringToSave = " + MyStringToSave);
					console.log("Choosen button = " + MyChoosenButton);
					switch (MyChoosenButton) {
					case 1: //Replace
						console.log("Replace");
						fs.writeFile(MyCSVFile,MyStringToSave, (err) => {if(err) throw err;}) ; 
						MyChoosenButton = 2;
						LogFileStartDate = new Date();
						//console.log("button after Replace" + MyChoosenButton);
					break;
					case 2: // Add to end
						console.log("To end of file");
						var CurrentDate = new Date();
						var LogDateTime = new Date(LogFileStartDate);
						

						fs.appendFile(MyCSVFile,MyStringToSave, (err) => {if(err) throw err;}); 
						let timeDifference = Math.abs(LogDateTime.getTime()-CurrentDate.getTime())/3600000

						//console.log(setupData.MyArchChartStructure);
						console.log(LogDateTime);
						console.log(CurrentDate);
						console.log(timeDifference);
						/*
						!_________________________________!________________________________!
						maxLogFileSize             LogFileSize                        CurrentDate

						!__________________arch_______________!
						maxLogFileSize                  LogFileSize    
						
						!__________________log_______________!
						LogFileSize                    CurrentDate  
						*/
						//работа с лог файлами и архивация.
						//если между началом файла и текущим моментом timeDifference
						//больше порога maxLogFileSize - предположительно 72 часов 
						//текущий лог файл уменьшается до 48 часов LogFileSize остаток архивируется.


						if (timeDifference > maxLogFileSize){ //разница между началом файла и текущим моментом больше 
							//порога LogFileSize. Запуск логирования.
								MyReadFile(MyCSVFile).then(myArrayToArc=> {

								fileWorks.MyStringOperator(myArrayToArc);

								console.log(ChartArray)
	
								let dataToArc = []
								let dataToLog = []
								var arcDateTime = new Date();
								//var LogDateTime = new Date();
								arcDateTime.setTime(CurrentDate - maxLogFileSize*3600000); //вычисление даты начала архивирования
								LogFileStartDate = LogDateTime.setTime(CurrentDate - LogFileSize*3600000); //вычисление времени начада архивирования
								console.log(arcDateTime)
								console.log(LogDateTime)
	
								console.log(ChartArray)
	
								let i = 0;
								let j = 0;
								ChartArray.forEach((element) => {
								//console.log(element)
								let myCountDate = new Date(element[0])
								//let myCountDate = new Date(element.split('\n').shift().substring(0, element.split('\n').shift().indexOf(";")));
								//console.log(element)
								//console.log(myCountDate);					
								//console.log(myCountDate.getTime());
								//console.log(LogDateTime);
								//console.log(LogDateTime.getTime());	
	
								if (myCountDate<LogDateTime){
									//console.log(i)
									//dataToArc.push(element + '\n')
									dataToArc.push(element.toString())
									i++
								}
								else{
									//console.log(element)
									//dataToArc.push(element)	
									//console.log(j)
									//dataToLog.push(element)	
									//dataToLog.push(element + '\n')	
									let myElement = element.toString()
									dataToLog.push(myElement.replaceAll(',', ';'))
									j++
								}
								})
								
								/*изменения лог файла:
								закрываем текущий файл -
								открываем поток на запись
								грузим массив в файл (в поток)
								закрываеи поток
								открываем лог файл на запись
								*/
								
								console.log(dataToLog)
								MyCSVFile.close
								let myNewLogFile = fs.createWriteStream(MyCSVFile)
								myNewLogFile.on('error',(err) => {if(err) throw err;})
								dataToLog.forEach((toFile) => {
									console.log(toFile)
									//toFile.forEach((currentString) => {
									//	console.log(currentString)
									//})
									//let StringToSave = ''
									//toFile.replace(',', ';')
									//console.log(toFile)
									//console.log(toFile[0])
									myNewLogFile.write(toFile)
								})
									
								myNewLogFile.end()
								
								fs.open(MyCSVFile, 'wx', (err) => { //открываем лог
									if (err) {if (err.code === "EEXIST") {return;}
										else {
											throw err;
										}
									}
								})
									
								console.log(dataToArc)
								MyFileWork.fileArchivatorforStatus(MyCSVFile,dataToArc)
								
								console.log(ChartArray)
								})
								
						}

						//fs.appendFile(MyCSVFile,MyStringToSave, (err) => {if(err) throw err;}); 

					break;
					case 10: break; //файл не создается
					//default: fs.appendFile(MyCSVFile,MyStringToSave, (err) => {if(err) throw err;}) ; break;	
					default:
						fs.writeFile(MyCSVFile,MyStringToSave, (err) => {if(err) throw err;}) ; 
						MyChoosenButton = 2;
					break;				
					}
					// Активация промиса LogUpdateEvent если стоит галка для открытия charts
					if (document.getElementById("ChartOpened").checked == true){
						console.log("Charts will updated")
						ipcRenderer.send("LogUpdateEvent",MyCSVFile);
					}
				}
			}
		     //console.log("After parsing = " + MyStringParser.GHStatusParser(data));
	    })

		//Поднятие порта МС и работа если стоит флаг
		if (remoteMCOn == true){ //false МС выкл true МС вкл
			console.log(MyExchange.CloudMC)
			MyMCEngine.MCPortSetup(MyExchange)
			//console.log(mySerial)
			//MyMCEngine.MCPortSetup(MyExchange);
		}
	})	
	
	let MyStatusWindowControls = {"LogsIsWriting":document.getElementById("LoggingIsOn").value,
	"ChartWindow":document.getElementById("ChartOpened").value}  

	//Передача информации в главное окно. Это означает, что это окно открыто и готово к приему информации от Main
	//Main использует event, который передается этим запросом
	ipcRenderer.send('WhenStatusIsActive',MyStatusWindowControls);
	
	//отправка в Ардуино содержимого поля.
	document.getElementById("SendButton").addEventListener("click", function (e) {
	e.preventDefault();
	console.log("DoorsInAutoCheck = " + document.getElementById("WateringInAuto").checked);
	console.log("DoorsInAutoCheck = " + document.getElementById("WateringInAuto").disabled);
		//отправка в Ардуино
		MyCOMPort.write(document.getElementById("textToSend").value + '\r\n', function(err) {
 	  		if (err) {return console.log('Error on write: ', err.message)}
     	  	console.log('message written')
			document.getElementById("textToSend").value =' ';

       	})
	})

	
	document.getElementById("textToSend").addEventListener("keypress", function (e) {
		
		if (e.key === "Enter"){
			e.preventDefault();
			MyCOMPort.write(document.getElementById("textToSend").value + '\r\n', function(err) {
				if (err) {return console.log('Error on write: ', err.message)}
				console.log('message written')
			 document.getElementById("textToSend").value =' ';
			})
		}
	})

	document.getElementById("SendToMCButton").addEventListener("click", function (e) {
		e.preventDefault();
			//отправка в ЬС
			if (remoteMCOn == true){
				MCMPort.write(document.getElementById("textToSend").value + '\r\n', function(err) {
					   if (err) {
						   document.getElementById("RecieveMonitorScreen").value = document.getElementById("RecieveMonitorScreen").value + '<!ERR:MC port is not available'
						   return console.log('Error on write: ', err.message)
						}
					   console.log('message written')
					document.getElementById("textToSend").value =' ';
				   })
			}
	})
	
	//отправка в Ардуино запроса на выдачу статуса
	document.getElementById("RefreshButton").addEventListener("click", function (e) {
		e.preventDefault();
		var myArduinoCommand;
		if(document.getElementById("ExchangeMode").checked == true){myArduinoCommand = "rstjs";}else{myArduinoCommand = "rst";}
		MyCOMPort.write(myArduinoCommand + '\r\n', function(err) {
    		if (err) {return console.log('Error on write: ', err.message)}
			console.log('message written')
			document.getElementById("textToSend").value =' ';
	   })	
	   
	})

	//отправка запроса на открытие окна Charts
	document.getElementById("ChartOpened").addEventListener("click", function (e) {
		console.log( "Chart goes opened = " + document.getElementById("ChartOpened").checked);
		ipcRenderer.send("OpenChartWndRequest",[document.getElementById("ChartOpened").checked,MyCSVFile]);
	})

	document.getElementById("RecieveMonitorScreen").addEventListener("change", function (e) {console.log("CHANGE")})

	document.getElementById("DoorsInAutoCheck").addEventListener("click", function (e) {
		e.preventDefault();
		console.log("door mode")
		if (document.getElementById("DoorsInAutoCheck").checked == true) {
			MyCOMPort.write("rdm a" + '\r\n', function(err) {
				if (err) {return console.log('Error on write: ', err.message)}
				//console.log('message written')
		   })	
		}
		else {
			MyCOMPort.write("rdm m" + '\r\n', function(err) {
			if (err) {return console.log('Error on write: ', err.message)}
					//console.log('message written')
		})	
		}
	})

	document.getElementById("WateringInAuto").addEventListener("click", function (e) {
		e.preventDefault();
		console.log("water mode")
		if (document.getElementById("WateringInAuto").checked == true) {
			MyCOMPort.write("rwm a" + '\r\n', function(err) {
				if (err) {return console.log('Error on write: ', err.message)}
				//console.log('message written')
		   })	
		}
		else {
			MyCOMPort.write("rwm m" + '\r\n', function(err) {
			if (err) {return console.log('Error on write: ', err.message)}
					//console.log('message written')
		})	
		}
	})

	document.getElementById("OpenValveButton").addEventListener("click", function (e) {
		MyCOMPort.write("w o" + '\r\n', function(err) {
			if (err) {return console.log('Error on write: ', err.message)}
		})
		document.getElementById("valveStatusField").value = "IN PROGRESS"
	})

	document.getElementById("CloseValveButton1").addEventListener("click", function (e) {
		MyCOMPort.write("w cl" + '\r\n', function(err) {
			if (err) {return console.log('Error on write: ', err.message)}
		})
		document.getElementById("valveStatusField").value = "IN PROGRESS"
	})

	document.getElementById("OpenButton1").addEventListener("click", function (e) {
		MyCOMPort.write("o 1" + '\r\n', function(err) {
			if (err) {return console.log('Error on write: ', err.message)}
		})
		document.getElementById("Actuator1Position").value = "IN PROGRESS"
	})

	document.getElementById("CloseButton1").addEventListener("click", function (e) {
		MyCOMPort.write("cl 1" + '\r\n', function(err) {
			if (err) {return console.log('Error on write: ', err.message)}
		})
		document.getElementById("Actuator1Position").value = "IN PROGRESS"
	})

	document.getElementById("OpenButton2").addEventListener("click", function (e) {
		MyCOMPort.write("o 2" + '\r\n', function(err) {
			if (err) {return console.log('Error on write: ', err.message)}
		})
		document.getElementById("Actuator2Position").value = "IN PROGRESS"
	})

	document.getElementById("CloseButton2").addEventListener("click", function (e) {
		MyCOMPort.write("cl 2" + '\r\n', function(err) {
			if (err) {return console.log('Error on write: ', err.message)}
		})
		document.getElementById("Actuator2Position").value = "IN PROGRESS"
	})

	document.getElementById("MCTest").addEventListener("click", function (e) {
		console.log(MCMPort)
		/*
		if (MCMPort.isOpen == false){
			//MyCOMPort.resume ()
			MCMPort = new SerialPort(MyExchange.CloudMC.MCComName, {
				endOnClose: true,
				baudRate: Number(MyExchange.CloudMC.MCComBaud),
				parser: new SerialPort.parsers.Readline({ delimiter: '\r\n' })
		   	}, 
	   			function (err) {if (err) {
					return console.log('Error: ', err.message);
				}
				}
   			);
		} 
		*/
		//MCData = JSON.parse(document.getElementById("BoxStatus").value);
		let MCdata = document.getElementById("textToSend").value;
		MCMPort.write(MCdata + '\r\n', function(err) {
			if (err) {return console.log('Error on write: ', err.message)}
			console.log('message written')
		})
		//MCParser.on('close', function (err){if (err){return console.log('Error on write: ', err.message)}})  
		let MCArray = MyMCEngine.MCStringParser(MCdata);
		//console.log(MCArray);
		//if (!MCArray){
		//	MyMCEngine.MCPortSetup(MyExchange);
		//	return;
		//}
		switch (MCArray[0]){
			case "delay": {
					if(MCArray[1]=='10'){
						MCMPort.write("rst" + '\r\n', function(err) {
							if (err) {return console.log('Error on write: ', err.message)}
							console.log('thing restart')

						})
						MCMPort.close(function(err) {
							console.log('disconnect!');
							MCDisconnected = true;
						if (err) {return console.log('Error on disconnect: ', err.message)}})
					}
					else if(MCArray[1]=='11'){
						console.log('disconnect!');
						MCDisconnected = true;
						MCMPort.close(function(err) {
							console.log('disconnect!');
							MCDisconnected = true;
						if (err) {return console.log('Error on disconnect: ', err.message)}})
					}
					else if(MCArray[1]=='12'){
						MyCOMPort.resume ()
					}
					else if(MCArray[1]=='13'){
						MCMPort = new SerialPort(MyExchange.CloudMC.MCComName, {
							endOnClose: true,
							baudRate: Number(MyExchange.CloudMC.MCComBaud),
							parser: new SerialPort.parsers.Readline({ delimiter: '\r\n' })
						   }, 
							   function (err) {if (err) {
								return console.log('Error: ', err.message);
							}
							}
						   );
						   MCParser = MCMPort.pipe(new Readline({ delimiter: '\r\n' }))
			
			
						   MCParser.on('data', function (MCdata){ //Это фрагмент получения строки от MC.
							   console.log(MCdata)
						   })
					}
					else if(MCArray[1]=='14'){MyMCEngine.MCExchange('delay 10')}
					else if(MCArray[1]=='15'){MyMCEngine.MCPortSetup(MyExchange)}
					

			}
			break;
			case 'disconnect':{
				MyMCEngine.MCExchange('delay 10');
			}
			break;
			default:{
			}
			break;
		}
	})
	
	function MyReadFile(MyChartFileName){
		return new Promise (function (resolve,reject) {
			ChartArray = [];
			
			fs.readFile(MyChartFileName,(err,myStream) => { 
				var myStream;
				if(err) throw err;
				//console.log("ChartArray in operator = " + ChartArray);
				resolve(myStream.toString());
			})
			
		})       
	}

	function MyString (Myline) {
		//console.log("line from line = " + Myline + " Len = " + Myline.length)
		let MyDelim = ";";
		let i = 0;
		var MyStringArrow = [];
	
		let MyDelimPos = Myline.indexOf(MyDelim);
		while (MyDelimPos > -1){
		   let MyElement = Myline.substring(0, MyDelimPos);
			Myline = Myline.substring (MyDelimPos + 1);  
			MyStringArrow[i] = MyElement.toString();
	
			i++;
			MyDelimPos = Myline.indexOf(MyDelim);
		}
		//console.log("MyLine reminded = " + Myline);
		MyStringArrow[i] = Myline.toString();
	
		return MyStringArrow;
	}



	