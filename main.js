/* MyProject 
//Modules to control application life and create native browser window
//27.02.2020 Развитие, ввод функции MyIOT, пока примитивные вещи, вызов функции печати в консоль
//24.03.2020 Видит список COM портов
//26.03.2020 Получает информацию от портов. Можно открывать несколько окон
//22.10.2020 Перемещено E:\DIY\UniversalGardenBoxProject
//27.10.2020 Очистка комментариев, удаление файлов, не относящихся к ком портам.
//11.11.2020 Реализована функциональность: запуск Main.js -> index.html -> index.js -> Econnections.html -> Econnections.js  
//-> IPC Main.js ->  index.js. Это значит умеет: загружать основное окно, по кнопке включать окно выбора Ком порта
// в этом окне выбирать ком порт -> закрывать окно и вводить параметры в основное окно и работать как терминал в основном окне
//13.11.2020 Переезд в UniversalGardenBoxProject_v1 реализовано: main -> index -> выбор режима -> Main замена окна GHStatus
// надо делать main -> index -> GHSetup -> main -> Main замена окна на GHStatus -> работа с портом
//к концу дня сделано на уровне IPC: main -> index -> GHSetup -> main -> Main замена окна index на GHStatus -> загрузка параметров в GHStatus
// Надо сделать реальное наполнение, отработать обмер данными, научиться работать с файлами
27.11.2020 С учетом КОВИДА: реализована функциональность как предполагалось 13.11, есть обмен данными мкжду ардуино и setup - можно менять
один параметр из формы и видеть это изменение. Вторая половина дня, теперь работа со status.
Status готов к работе, надо заниматься заполнением, как и Setup.
1.12.2020 В процессе наполнения и стыковки с Ардуино. Похоже надо добавить промис для обмена информацией между окнами. Рабочее название: "DataExchange"
для начала он сработает при закрытии окна GHSetup и будет содержать информацию для GHStatus
3.12.2020 переезд в v3. Отработка file manager
4.12.2020 Отработана функциональность: main -> index -> index.js -> menu :
add new -> setup -> setup.js -> обмен -> загрузка файла cfg -> status -> status.js 
file -> open -> status -> status.js 
В этих ветвях есть ряд непрятных завязок: 1 выход в статус через сетап или через файл и правильно ли это?
7.12.2020 При передаче в status из setup:
 Main OpenSetupWnd через index.js - ждет окончания конфигурирования, признак - закрытие Setup. Это была попытка разобраться в ветвях
 передачи информации в результате понятно, что крайне тяжело контролировать однообразие информации, передавемой по двум разным ветвям. Это совсем не правильно,
 хотя JS позволяет делать такие вещи. Надо сделать следующий инфо обмен:

                                              Main js ->  Status js (вместо Index js) ->  Setup js        -> Status js (ToStatusTransfer)\
 Main js -> Index js -> menu -> add new GH ->                                                                                                 ParsingWorks
                                              Main js -> /Status js (вместо Index js) ->  загрузка файла  -> Status js (ToStatusFromCFGFiles)/

 Main js -> Index js -> menu -> add new GH -> Main js -> \                               / Setup js ->    \
                                                           Status js (вместо Index js)                       Status js (ToStatusTransfer) -> ParsingWorks
                                              Main js -> /                               \загрузка файла  / 
Вечером сделал - теперь в Status.js нет отдельного промиса для чтения конфигурации из файла или из Ардуино. Теперь надо внимательно следить за тем что данные,
передаваемые в файл по кнопке LoadIntoFileButton совпадали с вновь вводимыми.
9.12.2020 Надо вести документацию, дальше без этого невозможно двигаться
Примерный перечень документов:
1. То, что передает ардуино во вне; E:\DIY\20201124JS0\ArduinoTxFormatMessage
2. То, что принимает ардуино из вне;
3. Описание внутренних переменных, нужных для внешних связей E:\DIY\20201124JS0\Texts.ino
3. То, что отдает скрипт в ардуино: надо указывать директорию ардуино
4. То, что принимает(ждет) скрипт: надо указывать директорию ардуино
Может сложнвато? Два файла в текущей директории:
notes_Exchange_JS_Arduino
notes_Exchange_Arduino_JS
Довел обмен Ардуино -> JS. Теперь все, что выводится через rsh, близко к html. notes_Exchange_Arduino_JS секция Setup partition скорректированна
Надо уточнить в чем меряются задержки.
17.12.2020 Очень интенсивная работа. Сделано: 
  Setup может менять основные параметры, включая режимы работы, т.е. то, что требует побайного разбора соответствующих переменных
  Status может грузить rst в лог файл. Имя Файла можно изменить как угодно через Setup или добавить к имени _X через setup
Сделан подход к формированию графиков, можно открыть соответствующую форму, но там пока ничего нет.  
12.01.2021 Далее инфа по проекту будет в файле AboutProject.txt
*/
//webPreferences { worldSafeExecuteJavaScript: true, contextIsolation: true }
const {app, BrowserWindow, Menu, dialog} = require('electron')
const {ipcMain} = require('electron')
const {ipcRenderer} = require('electron')
const {IpcMainEvent} = require('electron')

const path = require('path')
const url = require('url');
const fs = require('fs');
const { stringify } = require('csv')
//import * as path from "path";

let MyComPortParam; //Параметры COM порта
var ExchangeParam; //Выход промиса обмена DataExchange
let FormMode; // определяет с какой коробкой работать GH - теплица / Watering - полив
//Это аргументы для IPC 
var MyEventSetup; // можно обратиться к этому ивенту при обращении к OPC окна выбора порта (Econnections.js)
var MyEventComDefinition; // можно обратиться к этому ивенту при обращении к OPC главного окна (Index.js)
var MyGHSetup; // можно обратиться к этому ивенту при обращении к OPC окна выбора порта (GHSetup.js)
var MySetup; // можно обратиться к этому ивенту при обращении к OPC окна выбора setup
var MyStatusIsReady; // можно обратиться к этому ивенту при обращении к OPC окна выбора setup
var ActiveCharts; // ивент для обращения в окно графиков
var ChartStatus; // для отображения параметров окна Charts, например для того, чтобы контролировать открытие окна Charts
var boxSideRemoteMС; // ивент для обращения в окно мониторинга со стороны Ардуино
var cloudSide //ивент для обращения в cloud

let MainWin

function createWindow () {
  // Create the browser window.
  MainWin = new BrowserWindow({
	//icon:'MainIcon.png',  
    width: 1450,
    //height: 900,
	height: 350,
    	webPreferences: {
    	nodeIntegration: true,
		contextIsolation: false,
		enableRemoteModule: true,
    //worldSafeExecuteJavaScript: true,
	//contextIsolation: true
    }

  });
  
  MainWin.loadFile('index.html');
  MainWin.setMenu(null);
  //MainWin.setSize(1450, 900, true);
  MainWin.setSize(1450, 490, true);
  
  MainWin.on('closed', () => {
		MainWin = null;
  });
 MainWin.webContents.openDevTools()
}

let ConnectionSetupWnd;

//Промис, ожидающий когда будет нажата кнопка выбора порта в index.js. При нажатии
//открывает форму EConnections

//ipcMain.on ('add_connectionSetupWind', (MyEventSetup,arg) => {
	
// поднятие промиса, ожидающего какой сетап открыть. Если получит GH то GHSetup, если Watering, то WateringSetup
//после закрытия окна сетапа должен открыть нужное окно статуса и передать туда параметры.
  ipcMain.on ('OpenSetupWnd', (MySetup,arg) => { 

     console.log('this is Main/Setup');	
	 console.log(arg);	
     ConnectionSetupWnd = new BrowserWindow ({

	  width: 1450,
      height: 650,
      webPreferences: {
    	nodeIntegration: true,
		contextIsolation: false,

      },
	  parent: MainWin
     })
      ConnectionSetupWnd.webContents.openDevTools()
	  	 switch (arg){
		 case 'GH': //при выборе GH: загружаем GHSetup, пока больше ничего.
		  console.log('GH setup window should be loaded here')
		  FormMode='GH';
		  ConnectionSetupWnd.loadFile('GHSetup.html'); 
		  MainWin.loadFile('GHStatus.html');
		 break;
		 case 'Watering': //при выборе Watering: сообщение в консоль, пока больше ничего.
		 console.log('Watering setup window should be loaded here');
		 FormMode='Watering'; 
		 break;
		 case 'IoT': 
		 console.log('IoT setup window should be loaded here');
		 FormMode='IoT'; 
		 ConnectionSetupWnd.loadFile('IoTSetup.html'); 
		 //MainWin.loadFile('GHStatus.html');
		 break;

		 default: console.log('Unknown mode');
	 }
	    
	  ConnectionSetupWnd.setMenu(null); //убираем штатное меню
	  
	  //После закрытия окна Setup ответ в окно статуса с передачей параметров. Пока только выбранного порта.
	  ConnectionSetupWnd.on('closed', () => {

	  ConnectionSetupWnd = null; //Закрываем все, что относится к Setup

	 switch (FormMode){ //В зависимости от выбранного режима переход в статус теплицы или полива с передачей параметров порта MyComPortParam
	 //и того, что получено при обмене ExchangeParam
		 case 'GH': //при выборе GH: загружаем GHSetup, пока больше ничего.
		  console.log('GH Status window should be loaded here');
		  console.log({MyComPortParam,ExchangeParam});
		  //MyStatusIsReady.reply('ToStatusTransfer', {MyComPortParam, ExchangeParam});
		  MyStatusIsReady.reply('ToStatusTransfer', JSON.stringify(ExchangeParam), "Controls");
		  //MyStatusIsReady.reply('ToStatusTransfer',  [ExchangeParam,StatusControls]);
		 break;
		 case 'Watering': //при выборе Watering: сообщение в консоль, пока больше ничего.
		  //console.log('Watering setup window should be loaded here');
		  //FormMode='Watering'; 
		 break;
		 default: console.log('Unknown mode');
	 }
	  

	})
	
});

//промис который  фиксирует запуск окна Status
ipcMain.on('WhenStatusIsActive', (event,arg) => {

	MyStatusIsReady = event;


	console.log('Main when Status is Opened = ' + arg);
	//console.log(MyStatusIsReady);
	console.log(arg);
	
});

//промис который  фиксирует запуск окна RemoteMC
ipcMain.on('WhenRemoteMCBoxSideIsActive', (event,arg) => {
	console.log("Promise MC is ready");
	boxSideRemoteMС = event;
});

//промис который  фиксирует запуск окна IoTStatus
ipcMain.on('WhenCloudStatusOpened', (event,arg) => {
	cloudSide = event;
	console.log("config file to send to IoT status")
	//cloudSide.reply('openIoTStatus',"IoT config file name")
})

//Промис, ожидающий выбора режима, потом будет загружать ту или другую форму вместо Index.html
  ipcMain.on('WhatIsMain', (MyEventComDefinition,arg) => {
     //console.log('this is WhatIsMain');
	 //console.log(arg); 
	 switch (arg){
		 case 'GH':FormMode='GH'; MainWin.loadFile('GHStatus.html'); break;
		 case 'Watering': console.log('Watering window should be loaded here');FormMode='Watering'; break;
		 case 'Chart':FormMode='GH'; MainWin.loadFile('GHStatus.html'); ConnectionSetupWnd.loadFile('GHSetup.html');break;
		 case 'IoT':FormMode='GH'; MainWin.loadFile('IoTStatus.html');break;
		 case 'WiFi':FormMode='GH'; MainWin.loadFile('WiFiExchange.html');break;
		 
		 default: console.log('Unknown mode');
	 }

});

//Промис для обмена информацией между окнами по мере необходимости 
//DataExchange
ipcMain.on('DataExchange', (event,arg) => {
	console.log("Data exch, params");
	ExchangeParam = arg;
	//console.log(ExchangeParam);
	ExchangeParam = JSON.parse(arg)
	//console.log(JSON.parse(ExchangeParam));
	console.log(ExchangeParam.route);
	switch (ExchangeParam.route){
		case "to_MC_cloud": {
			console.log("ready to cloud send");
			//boxSideRemoteMС.reply("ToMCTransfer", '{"action":"send","data":"' + ExchangeParam.data + '"}');
			break;
		}
		default: {console.log("unknown route");break;}
	}
	
});

//Промис для работы с файлами (открытия) существующих устройств
ipcMain.on('File_open_dialog', (event, arg) => { 
  let CFGFilePath = dialog.showOpenDialog({ //открываем окно диалога
	  //defaultPath : "E:\\DIY\\UniversalGardenBoxProject_v3",
	  defaultPath : "\\",
	  properties: ["openFile"],
	  filters: [
        { name :'GH*', extensions: ['cfg']},
	    { name :'*', extensions: ['*']}
		]
	  });	
	//console.log("CFGFilePath = "); console.log(CFGFilePath.filePaths);
	CFGFilePath.then(function(obj) { //открываем файл исходя из результатов диалога
    	if (obj.filePaths != ''){
		//console.log("before obj.filePaths = "); console.log(obj.filePaths);
		let MyCFGFilePath = obj.filePaths;
			fs.readFile((obj.filePaths).toString(), (err, rawdata ) => { //чтение открытого файла
				if(err) throw err;
				//console.log("rawdata = " + rawdata.BoxType)
				//if(rawdata.BoxType != undefined){console.log(" GH form running")}
				ExchangeParam = rawdata.toString();
				//JSON.parse(rawdata)
				if(JSON.parse(rawdata).BoxType != undefined){

					let MyNewMaiWindow = MainWin.loadFile('GHStatus.html');
						MyNewMaiWindow.then(function(){
						//MyStatusIsReady.reply('ToStatusTransfer', [ExchangeParam,StatusControls]);
						//MyStatusIsReady.reply('ToStatusTransfer', ExchangeParam);
						MyStatusIsReady.reply('ToStatusTransfer', ExchangeParam, "Controls");
					})	
				}
				else{
					console.log("IoT status will be here")
					let myIOTStatusLoadControl = MainWin.loadFile('IoTStatus.html');
					//boxSideRemoteMС.reply("ToMCTransfer", {"action":"add_new_control","fileName":MyCFGFilePath});
					
					myIOTStatusLoadControl.then(function(){
						console.log("MC box side setup window is ready");
						//ToMCTransfer.reply("MyCFGFilePath");
						//cloudSide.reply('openIoTStatus', JSON.stringify('{"action":"cfg_file_name","fileName":"' + MyCFGFilePath + '"}'));
						//cloudSide.reply('openIoTStatus', '{"action":"cfg_file_name","fileName":"' + MyCFGFilePath + '"}');
						cloudSide.reply('openIoTStatus', {"action":"cfg_file_name","fileName": MyCFGFilePath});
						//boxSideRemoteMС.reply("ToMCTransfer", {"action":"add_new_control","fileName":MyCFGFilePath});
					})
					
				}	  
			})		
	    } else {console.log(" AnyFilesWereChoosen ")}		
		})
})

//Промис для коррекции существующих устройств
ipcMain.on('File_edit_dialog', (event, arg) => {
	console.log("edit dialog is here");
	let CFGFilePath = dialog.showOpenDialog({ //открываем окно диалога
		defaultPath : "\\",
		properties: ["openFile"],
		filters: [
		  { name :'GH*', extensions: ['cfg']},
		  { name :'*', extensions: ['*']}
		  ]
		});	
	  //console.log("CFGFilePath = "); console.log(CFGFilePath.filePaths);
	  CFGFilePath.then(function(obj) { //открываем файл исходя из результатов диалога
		  if (obj.filePaths != ''){
		  //console.log("before obj.filePaths = "); console.log(obj.filePaths);
		  console.log("obj= "); console.log(obj);
			var MyCFGFilePath = obj.filePaths;
			  fs.readFile((obj.filePaths).toString(), (err, rawdata ) => { //чтение открытого файла
				  if(err) throw err;
				  ExchangeParam = rawdata.toString();
				  
				  switch(JSON.parse(rawdata).BoxType){
						case 'GH': console.log(JSON.parse(rawdata));
						//let MyMCBoxSideSetupWinow = loadFile('GHStatus.html');

							let MyMCBoxSideSetupWinow = new BrowserWindow ({

								width: 600,
								height: 450,
								webPreferences: {
								nodeIntegration: true,
								contextIsolation: false,
					  
								},
								  parent: MainWin
					  
							}) 
							
							MyMCBoxSideSetupWinow.setMenu(null); //убираем штатное меню
						   	MyMCBoxSideSetupWinow.webContents.openDevTools()
						  	let MCSetupOpenWindowControl = MyMCBoxSideSetupWinow.loadFile('BoxSideMonitorSet.html'); 
						   
						   	MyMCBoxSideSetupWinow.on('closed', () => {
						   		MyMCBoxSideSetupWinow = null; //Закрываем все, что относится к Charts
						   	})

							MCSetupOpenWindowControl.then(function(){
						 	console.log("MC box side setup window is ready");
							//ToMCTransfer.reply("MyCFGFilePath");
						 	boxSideRemoteMС.reply("ToMCTransfer", {"action":"add_new_control","fileName":MyCFGFilePath});

							})	
						; break;
						default: console.log("Nothing to edit");
				  }
			  })		
		  } else {console.log(" AnyFilesWereChoosen ")}		
		  })
})

//Промис для работы с графиками - запрос на открытие
ipcMain.on ('OpenChartWndRequest', (event,[ChartFormOpen, LogFileName]) => {
//console.log(event);
	console.log(" when chart arg = "+ ChartFormOpen + " / " + LogFileName)
     let ChartsWnd = new BrowserWindow ({

	  width: 600,
      height: 450,
      webPreferences: {
	  nodeIntegration: true,
	  contextIsolation: false,

	  },
		parent: MainWin

     }) 
	  
	 ChartsWnd.setMenu(null); //убираем штатное меню
	 ChartsWnd.webContents.openDevTools()
	 ChartsWnd.loadFile('ChartWindow.html'); 
	 
	 ChartsWnd.on('closed', () => {
     //ipcMain.removeListener('LogUpdateEvent');
	 ChartsWnd = null; //Закрываем все, что относится к Charts
	 })
	//console.log("Charts will be here"); 
})

//Промис для работы с графиками - подтверждение открытия окна Charts
ipcMain.on ('ChartIsReady', (event,arg) => {
	ActiveCharts = event;
	ChartStatus = arg;

	console.log("Chart status " + ActiveCharts.frameId + " arg " + ChartStatus)
	//processId  frameId returnValue
})

//Промис для фиксации события изменения логов
ipcMain.on('LogUpdateEvent', (event,arg)=>{
	var MyChartData = arg;
	//console.log("New RST were got. File name = " + MyChartData);
	//console.log("Chart status = " + ChartStatus)
	if (ChartStatus == true){console.log("Chart Update promise ON");ActiveCharts.reply('ChartsUpdateRequest', MyChartData)}
	else {console.log("chart window is closed")}
})

//Промис для открытия окна About
ipcMain.on ('AboutWnd', (event,arg) => {
console.log("Promis About will be here"); 
		let AbouWindow = new BrowserWindow ({
				width: 600,
				height: 450,
				webPreferences: {
					nodeIntegration: true,
					contextIsolation: false,
				},
			  	parent: MainWin
		   })

		AbouWindow.webContents.openDevTools()
		AbouWindow.loadFile('AboutWindow.html');    
		AbouWindow.on('closed', () => {
		AbouWindow = null; //Закрываем все, что относится к Charts 
		})
})

app.allowRendererProcessReuse = false
app.on('ready', createWindow)


app.on('window-all-closed', function () {

app.quit()
})

