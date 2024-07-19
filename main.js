const {app, BrowserWindow, Menu, dialog} = require('electron')
app.disableHardwareAcceleration();
app.disableDomainBlockingFor3DAPIs();
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
  MainWin.setSize(1550, 490, true);
  
  MainWin.on('closed', () => {
		MainWin = null;
  });
 MainWin.webContents.openDevTools({mode:'detach'})
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
      /*ConnectionSetupWnd.webContents.openDevTools()
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
	 }*/
	    
	  ConnectionSetupWnd.setMenu(null); //убираем штатное меню
	  
	  //После закрытия окна Setup ответ в окно статуса с передачей параметров. Пока только выбранного порта.
	  ConnectionSetupWnd.on('closed', () => {

	  ConnectionSetupWnd = null; //Закрываем все, что относится к Setup

	 /*switch (FormMode){ //В зависимости от выбранного режима переход в статус теплицы или полива с передачей параметров порта MyComPortParam
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
	 }*/
	  

	})
	
});

app.allowRendererProcessReuse = false
app.on('ready', createWindow)


app.on('window-all-closed', function () {

app.quit()
})

