//11.11.2020 Скрипт привязан к Index.html
//Умеет открывать окно выбора Ком порта и работать как терминал.
//11.02.2024 строка status: 1.Научиться распознавать слово status в текстбоксе. 2.Передать строку с распознанным словом во второй текстбокс
//следует брать строку прямо из ком порта...
//12.02.2024 функция на 87 строке открывает поток для обмена информацией с ком портом.
//13.02.2024 дублировал окно с получаемыми данными из порта
// data - данные из порта, сервисное слово, если его изменить, работать ничего не будет.
//исходя из этого объявляем переменную, в которую записываются данные из порта, после чего проделываем с ней действия, необходимые для получения искомой строки.
//если теория верна, то я близко..
//14.02.2024 теория верна и данные вписались в переменную, попробовал преобразовать её в массив с последующим выводом элемента, но не вышло.
//MyData динамическая, теперь точно.
//поскольку делимитер делил исходную строку на субстроки, то сплит сделал из каждой строки масссив. Решение: убрать делимитер и получить каждую строку в виде элемента массива.
//EEShow
//15.02.2024 parser: new SerialPort.parsers.Readline({ delimiter: '\r\n' }) - старая функция строка 88
//21.05.2024 - v0.2.5 - есть запись/чтение из двух файлов
//21.05.2024 - v0.2.6 - добавление БД neDB. -- надо было дожать sqlite...
//29.05.2024 - v0.2.6.5 - переработка интерфейса + работа конкретно с БД.
//30.05.2024 - v0.3.0 - отработка записи в файл
//03.06.2024 - v0.3.0 - работа с БД
//03.06.2024 - v0.3.0 - работа с БД - чтение, запись, замена данных, запросы
//10.06.2024 - v0.4.0 - добавлена БД с маршрутами.
const { dialog } = require("electron").remote;
//const fs = require('fs');
//import { writeFile } from 'fs/promises';
//const {BrowserWindow} = require('electron');
//const {app, dialog} = require('electron')
const MySerial = require("./MySerial");
const SerialPort = require("serialport");
const Readline = require("@serialport/parser-readline");
const { clipboard } = require("electron");
//const { channel } = require('diagnostics_channel');
//const nodeNotifier = require('node-notifier');
const ipcRenderer = require("electron").ipcRenderer;
//import { generator } from './comStringGenerator';

var SelectedCOMParam; //параметры ком порта
var MyParser;
//--переменные для генератора--
let myMsgWord;
var mesWrdGet;
var myStr;
var parcedByteOne;
var parcedByteTwo;

const xlsx = require("xlsx");
const path = require("path");

const fileLocation = path.join(__dirname, "Data.xlsx");

const fileContents = xlsx.readFile(fileLocation);

const firstSheet = fileContents.SheetNames[0];

const workbook = xlsx.readFile(fileLocation);

const sheetNames = workbook.SheetNames;

const sheetValues = fileContents.Sheets[firstSheet];

const JsonData = xlsx.utils.sheet_to_json(workbook.Sheets[sheetNames[0]]);

function addEntry(text) {
  xlsx.utils.sheet_add_aoa(sheetValues, [text], { origin: -1 }); //свойство 'origin' указывает Node добавить запись в следующую доступную строку
  xlsx.writeFile(fileContents, fileLocation);
}

let valuesToGetArr = ["data 85 32 1", "data 85 32 2", "data 85 32 3",
                      "data 85 32 4", "data 85 32 5", "data 85 32 6",
                      "data 85 32 7", "data 85 32 8", "data 85 32 9",
                      "data 85 32 10", "data 85 32 11", "data 85 32 12",
                      "data 85 32 13", "data 85 32 14", "data 85 32 15",
];

let valuesFromComPortArr = new Array();
let valuesFromFormToGetArr = ["parcedValuesGetUnitAddrA", "parcedValuesGetUnitAddr", "parcedValuesGetdefPWR", "parcedValuesGetminPWR", "parcedValuesGetMINRPM", "parcedValuesGetMAXRPM",
                              "parcedValuesGetRaizedDivider", "parcedValuesGetReduceDivider", "parcedValuesGetConfig", "parcedValuesGetWaitDelay", "parcedValuesGetSlowMovingDelay",
                              "parcedValuesGetVoltThress", "parcedValuesGetNoRPMPWR", "parcedValuesGetunitID", "parcedValuesGetSoftInfo", "parcedValuesGetPinsInfo",
];
let valuesToGetSavedArr = [
  "data 85 32 101", "data 85 32 21", "data 85 32 31", "data 85 32 41",
  "data 85 32 51", "data 85 32 61", "data 85 32 71", "data 85 32 81",
  "data 85 32 91", "data 85 32 110", "data 85 32 111", "data 85 32 112",
  "data 85 32 113",
];

/*let valuesToGetSavedArrTRLT = [`mdata ${document.getElementById('portChooseSLCT').value} 85 32 101`,
	`mdata ${document.getElementById('portChooseSLCT').value} 85 32 21`,`mdata ${document.getElementById('portChooseSLCT').value} 85 32 31`,
	`mdata ${document.getElementById('portChooseSLCT').value} 85 32 41`,`mdata ${document.getElementById('portChooseSLCT').value} 85 32 51`,
	`mdata ${document.getElementById('portChooseSLCT').value} 85 32 61`,`mdata ${document.getElementById('portChooseSLCT').value} 85 32 71`,
	`mdata ${document.getElementById('portChooseSLCT').value} 85 32 81`,`mdata ${document.getElementById('portChooseSLCT').value} 85 32 91`,
	`mdata ${document.getElementById('portChooseSLCT').value} 85 32 110`,`mdata ${document.getElementById('portChooseSLCT').value} 85 32 111`,
	`mdata ${document.getElementById('portChooseSLCT').value} 85 32 112`,`mdata ${document.getElementById('portChooseSLCT').value} 85 32 113`,
	`mdata ${document.getElementById('portChooseSLCT').value} 85 32 14`,`mdata ${document.getElementById('portChooseSLCT').value} 85 32 15`];*/

let valuesFromFormSavedArr = [
  "parcedValuesSavedUnitAddrA", "parcedValuesSavedUnitAddr", "parcedValuesSaveddefPWR", "parcedValuesSavedminPWR",
  "parcedValuesSavedMINRPM", "parcedValuesSavedMAXRPM", "parcedValuesSavedRaizedDivider", "parcedValuesSavedReduceDivider",
  "parcedValuesSavedConfig", "parcedValuesSavedWaitDelay", "parcedValuesSavedSlowMovingDelay", "parcedValuesSavedVoltThress",
  "parcedValuesSavedNoRPMPWR", "parcedValuesSavedunitID",
];

let valuesFromFormToChangeArr = [
  "parcedValuesSendUnitAddr",
  "parcedValuesSenddefPWR",
  "parcedValuesSendminPWR",
  "parcedValuesSendMINRPM",
  "parcedValuesSendMAXRPM",
  "parcedValuesSendRaizedDivider",
  "parcedValuesSendReduceDivider",
  "parcedValuesSendConfig",
  "parcedValuesSendWaitDelay",
  "parcedValuesSendSlowMovingDelay",
  "parcedValuesSendVoltThress",
  "parcedValuesSendNoRPMPWR",
  "parcedValuesSendunitID",
  "parcedValuesSendSoftInfo",
  "parcedValuesSendPinsInfo",
  "parcedValuesSendInitInfo",
];

let commandsToSaveChangedValuesArr = [
  "data 85 41",
  "data 85 42",
  "data 85 43",
  "data 85 44",
  "data 85 45",
  "data 85 46",
  "data 85 47",
  "data 85 48",
  "data 85 49",
  "data 85 50",
  "data 85 51",
  "data 85 52",
  "data 85 53",
];

/*let commandsToSaveChangedValuesArrTRLT = [`mdata ${document.getElementById('portChooseSLCT').value} 85 41`,
	`mdata ${document.getElementById('portChooseSLCT').value} 85 42`, `mdata ${document.getElementById('portChooseSLCT').value} 85 43`,
	`mdata ${document.getElementById('portChooseSLCT').value} 85 44`, `mdata ${document.getElementById('portChooseSLCT').value} 85 45`,
	`mdata ${document.getElementById('portChooseSLCT').value} 85 46`, `mdata ${document.getElementById('portChooseSLCT').value} 85 47`,
	`mdata ${document.getElementById('portChooseSLCT').value} 85 48`, `mdata ${document.getElementById('portChooseSLCT').value} 85 49`,
	`mdata ${document.getElementById('portChooseSLCT').value} 85 50`, `mdata ${document.getElementById('portChooseSLCT').value} 85 51`,
	`mdata ${document.getElementById('portChooseSLCT').value} 85 52`, `mdata ${document.getElementById('portChooseSLCT').value} 85 53`
	];*/

let DBIFormsVals = [
  "DBIparcedValuesSavedUnitAddrA",
  "DBIparcedValuesSavedUnitAddr",
  "DBIparcedValuesSaveddefPWR",
  "DBIparcedValuesSavedminPWR",
  "DBIparcedValuesSavedMINRPM",
  "DBIparcedValuesSavedMAXRPM",
  "DBIparcedValuesSavedRaizedDivider",
  "DBIparcedValuesSavedReduceDivider",
  "DBIparcedValuesSavedConfig",
  "DBIparcedValuesSavedWaitDelay",
  "DBIparcedValuesSavedSlowMovingDelay",
  "DBIparcedValuesSavedVoltThress",
  "DBIparcedValuesSavedNoRPMPWR",
  "DBIparcedValuesSavedunitID",
  "DBIparcedValuesSavedSoftInfo",
  "DBIparcedValuesSavedPinsInfo",
];

let megaTestTXTValues = [
  "scriptTXT_1",
  "scriptTXT_2",
  "scriptTXT_3",
  "scriptTXT_4",
  "scriptTXT_5",
  "scriptTXT_6",
  "scriptTXT_7",
  "scriptTXT_8",
  "scriptTXT_9",
  "scriptTXT_10",
  "scriptTXT_11",
  "scriptTXT_12",
  "scriptTXT_13",
  "scriptTXT_14",
  "scriptTXT_15",
  "scriptTXT_16",
  "scriptTXT_17",
  "scriptTXT_18",
  "scriptTXT_19",
  "scriptTXT_20",
  "scriptTXT_21",
  "scriptTXT_22",
  "scriptTXT_23",
  "scriptTXT_24",
];

let megaTestJSValues = [
  "createScriptBlockPart_1TXT",
  "createScriptBlockPart_2TXT",
  "createScriptBlockPart_3TXT",
  "createScriptBlockPart_4TXT",
  "createScriptBlockPart_5TXT",
  "createScriptBlockPart_6TXT",
  "createScriptBlockPart_7TXT",
  "createScriptBlockPart_8TXT",
  "createScriptBlockPart_9TXT",
  "createScriptBlockPart_10TXT",
  "createScriptBlockPart_11TXT",
  "createScriptBlockPart_12TXT",
];

let valuesCommSeqArr = [];

var pereParce = "";
let txtToSendTestValues = [];
let arrowUpFlag = 0;
let txtClickFlag = 0;
let arrowUpMainFlag = 0;
let txtMainClickFlag = 0;
let arrowUpSSetupFlag = 0;
let txtSSetupClickFlag = 0;
let fullArr = [];
let indexArr = [];
let errorCommArr = [];
let errorIndex;
let codeWrd;
let successFlag;
let catchFlag = 0;
let currentValuesFlag = 0;
let storedValuesFlag = 0;
let DBIStoredValuesFlag = 0;
let DBIArr = [];
let headers = [
  "DATE_Year",
  "DATE_Month",
  "DATE_day",
  "DATE_Hour",
  "DATE_Min",
  "DATE_Sec",
  "ID",
  "UNITaddress",
  "SOFT",
  "DEFAULTpower",
  "MINpower",
  "MINrpm",
  "MAXrpm",
  "DIVIDER",
  "REDUCEdivider",
  "CONFIG",
  "WAITdelay",
  "SLOWmovingDelay",
  "VOLTthress",
  "N0rpmPower",
  "PINS",
  "COMMENT",
];
let headerz = [
  "DATE_Year",
  "DATE_Month",
  "DATE_day",
  "DATE_Hour",
  "DATE_Min",
  "DATE_Sec",
  "ROUTE",
  "car_ID",
  "car_Plate",
];

let MyCOMPort;
let commSequenceValues = [];
let testFlag = 0;
let carParArr = [];

let combinationArr = [];
let dbCarsFlag = 0;
let dbRoutesFlag = 0;

var Datastore = require("nedb");

var dbCars = new Datastore({ filename: "carsData", autoload: true });
dbCars.loadDatabase();

var dbCarsParas = new Datastore({ filename: "carsParameters", autoload: true });
dbCarsParas.loadDatabase();

var DBCarsRoutes = new Datastore({ filename: "DBRoutes", autoload: true });
DBCarsRoutes.loadDatabase();

var DBScripts = new Datastore({ filename: "DBScripts", autoload: true });

document.getElementById("textToSend").addEventListener("onchange", (e) => {
  e.preventDefault();
  console.log("Here is string to send");
});

document.getElementById('MAINclearOutputBut').addEventListener('click', ()=>{
  document.getElementById('TextRecieved').value = '';
})
//открытие промиса. Ожидание параметров ком порта от Econnections.js через main.js
/*ipcRenderer.on("COMParametersTransfer", (event, arg) => {
  console.log("This is Index IPC running");
  SelectedCOMParam = arg;
  console.log(SelectedCOMParam); // prints "pong"2
  document.getElementById("textComPortStatus").value =
    SelectedCOMParam.ComName + " at " + SelectedCOMParam.ComBaud + " is set";

  MyCOMPort = new SerialPort(
    SelectedCOMParam.ComName,
    {
      baudRate: Number(SelectedCOMParam.ComBaud),
      parser: new SerialPort.parsers.Readline({ delimiter: "\r\n" }),
    },
    function (err) {
      if (err) {
        document.getElementById("SendButton").disabled = true;
        return console.log("Error: ", err.message);
      }
    }
  );

  console.log("current com port");
  console.log(MyCOMPort);
  document.getElementById("SendButton").disabled = false;
});*/

document.getElementById("ComNameSelect").addEventListener("click", () => {
  console.log("com port setup before");
  //console.log(document.getElementById("ComNameSelect").value);

  if (document.getElementById("ComNameSelect").value === "init") {

    console.log("com port setup");

    MySerial.SerialList().then((MyCOMList) => {

      //setTimeout(()=>{
        console.log(MyCOMList);
     // }, 5000)
      

      for (let i = 0; i < MyCOMList.length; i++) {
        document.getElementById("ComNameSelect").options[i] = new Option(
          MyCOMList[i].manufacturer + " at " + MyCOMList[i].path,
          MyCOMList[i].path
        );
      }
      document.getElementById("ComNameSelect").size = MyCOMList.length;
    });
  } else {
    console.log("com port list setup");
    document.getElementById("ComNameSelect").size = 1;
    document.getElementById("ButtonConnectionSetup").disabled = false;
    document.getElementById("SendMyStringButton").disabled = false;
  }
});

document.getElementById("ButtonConnectionSetup").addEventListener("click", () => {
  document.getElementById('closeSerialConnectionBut').hidden = false
    MyCOMPort = new SerialPort(document.getElementById("ComNameSelect").value, {
      baudRate: Number(document.getElementById("COMPortRate").value),
      objectMode: true,
      // highWaterMark:256000,      
      function(err) {'@serialport/stream'
        if (err) {
          return console.log("Error: ", err.message);
        }
      },
    });

    // setTimeout(()=>{
    //   console.log(MyCOMPort)
    // }, 5000)
    // console.log(MyCOMPort)
    //console.log(MyCOMPort.ReadableState.length)

    MyParser = MyCOMPort.pipe(new Readline({ delimiter: "\r\n"}));
    MyParser.on("data", (data) => {
      //Это фрагмент получения строки от порта.
      myMsgWord = data;
      /*let dataArr;
      dataArr.push(data);
      console.log(dataArr);*/
      if (document.getElementById("monitorScroll").checked == true) {
        document.getElementById("TextRecieved").scrollTop = document.getElementById("TextRecieved").scrollHeight;
      }

      if (document.getElementById("ScrollTxtToSendTestCheck").checked == true) {
        document.getElementById("TxtRecievedTest").scrollTop =
          document.getElementById("TxtRecievedTest").scrollHeight;
      }

      if (
        document.getElementById("ScrollTxtToSendSSetupCheck").checked == true
      ) {
        document.getElementById("TxtRecievedSSetup").scrollTop =
          document.getElementById("TxtRecievedSSetup").scrollHeight;
      }

      if (
        document.getElementById("ScrollTxtToSendSMegaTestCheck").checked == true
      ) {
        document.getElementById("TxtRecievedSMegaTest").scrollTop =
          document.getElementById("TxtRecievedSMegaTest").scrollHeight;
      }
      // console.log(activeTab)
      // if(activeTab == undefined){
      //   console.log('now you on tab_1 after start of app')
      //   document.getElementById("TextRecieved").value = document.getElementById("TextRecieved").value + data + "\r\n";
      //   document.getElementById("TxtRecievedTest").value = '';
      //   document.getElementById("TxtRecievedSSetup").value = '';
      //   document.getElementById("TxtRecievedSMegaTest").value = '';
      // }

      // if(activeTab == 'tab_1'){
      //   console.log('now you on tab_1!')
      //   document.getElementById("TextRecieved").value = document.getElementById("TextRecieved").value + data + "\r\n";
      //   document.getElementById("TxtRecievedTest").value = '';
      //   document.getElementById("TxtRecievedSSetup").value = '';
      //   document.getElementById("TxtRecievedSMegaTest").value = '';
      // }

      // if(activeTab == 'tab_2'){
      //   console.log('now you on tab_2!')
      //   document.getElementById("TextRecieved").value = '';
      //   document.getElementById("TxtRecievedTest").value = document.getElementById("TxtRecievedTest").value + data + "\r\n";
      //   document.getElementById("TxtRecievedSSetup").value = '';
      //   document.getElementById("TxtRecievedSMegaTest").value = '';
      // }

      // if(activeTab == 'tab_3'){
      //   console.log('now you on tab_3!')
      //   document.getElementById("TextRecieved").value = '';
      //   document.getElementById("TxtRecievedTest").value = document.getElementById("TxtRecievedTest").value + data + "\r\n";
      //   document.getElementById("TxtRecievedSSetup").value = '';
      //   document.getElementById("TxtRecievedSMegaTest").value = '';
      // }
      document.getElementById("TextRecieved").value = document.getElementById("TextRecieved").value + data + "\r\n";
      document.getElementById("TxtRecievedTest").value = document.getElementById("TextRecieved").value; // + data + '\r\n';
      document.getElementById("TxtRecievedSSetup").value = document.getElementById("TextRecieved").value;
      document.getElementById("TxtRecievedSMegaTest").value = document.getElementById("TextRecieved").value;
    });

    document.getElementById("ButtonConnectionSetup").disabled = true;
    document.getElementById("initializeBut").disabled = false;
  });

document.getElementById("textToSend").addEventListener("keyup", () => {
  if (event.keyCode === 13) {
    console.log(document.getElementById("textToSend").value);
    MyCOMPort.write(
      document.getElementById("textToSend").value + "\r\n",
      (err) => {
        if (err) {
          return console.log("Error on write: ", err.message);
        }
        console.log("message written");
        document.getElementById("textToSend").value = " ";
      }
    );
  }
});
var counter = 0;
document.getElementById("initializeBut").addEventListener("click", () => {
  counter++;
  var msgWRDInitialize;
  if (document.getElementById("modeChooseSLCT").value == "arduino") {
    console.log("arduino");
    msgWRDInitialize = "inton";
    MyCOMPort.write(msgWRDInitialize + "\r\n", () => {});
    document.getElementById("connectionTestBut").disabled = false;
  } else {
    console.log("TLBoard");
    msgWRDInitialize = "intpj";
    MyCOMPort.write(msgWRDInitialize + "\r\n", () => {});
    document.getElementById("connectionTestBut").disabled = false;
    document.getElementById("portChooseSLCT").hidden = false;
  }
});

document.getElementById('TESTclearOutputBut').addEventListener('click', ()=>{
  document.getElementById('TxtRecievedTest').value = '';
})

document.getElementById("testLedButON").addEventListener("click", () => {
  commandGenerator(71, 1);
});

document.getElementById("testBlinkerButON").addEventListener("click", () => {
  commandGenerator(73, 16);
});

document.getElementById("testStopsButON").addEventListener("click", () => {
  commandGenerator(74, 1);
});

document.getElementById("testMotorButON").addEventListener("click", () => {
  commandGenerator(10, document.getElementById("motorONParas").value);
});

document.getElementById("testDriveButON").addEventListener("click", () => {
  commandGenerator(12, 50);
});

document.getElementById("testLedButOFF").addEventListener("click", () => {
  commandGenerator(71, 0);
});

document.getElementById("testBlinkerButOFF").addEventListener("click", () => {
  commandGenerator(73, 0);
});

document.getElementById("testStopsButOFF").addEventListener("click", () => {
  commandGenerator(74, 0);
});

document.getElementById("testMotorButOFF").addEventListener("click", () => {
  commandGenerator(13, " ");
});

document.getElementById("testDriveButOFF").addEventListener("click", () => {
  commandGenerator(13, " ");
});

document.getElementById("calibrationBut").addEventListener("click", () => {
  const rez = dialog.showMessageBoxSync({
    type: "info",
    title: "Notification",
    message: "Enable calibration?",
    //detail: 'Additional Information',
    cancelId: 1, // Press ESC to click the index button by default
    defaultId: 0, // The button subscript is highlighted by default
    buttons: ["OK", "Cancel"],
  });
  if (rez === 0) {
    commandGenerator(11, 5);
  } else {
    dialog.showMessageBoxSync({
      type: "info",
      title: "alert",
      message: "operation cancelled",
    });
  }
});

document.getElementById("getMsgWrdBut").addEventListener("click", () => {
  getMyMSgWrdFunc();
});

function getMyMSgWrdFunc(){
  commandGenerator(103, " ");
  let byte_1 = portParser(myMsgWord);
  console.log(`byte_1: ${byte_1}`);
  setTimeout(()=>{
    //console.log(portParser(myMsgWord));
    let byte_2 = portParser(myMsgWord);
    console.log(`byte_2: ${byte_2}`);
    parseMsgWRD(byte_1, byte_2)
  }, 350);
  
}

document.getElementById("connectionTestBut").addEventListener("click", () => {
  //dbCarsParasFlag = 1;testFlag
  testFlag = 1;

  let findCarProm = new Promise((resolve, reject) => {
    commandGenerator(2, 100);
    setTimeout(() => {
      if (portParser(myMsgWord) == 100) {
        resolve("Car is ready!");
      } else {
        reject("Car lost!");
      }
    }, 350);
  });

  findCarProm.then((result) => {
    console.log(result);
    commandGenerator(102, " ");
    setTimeout(()=>{
      document.getElementById("voltageInfMainTxt").value =
      "Voltage:" +
      portParser(myMsgWord) +
      "~(" +
      ((4.5 / 100) * portParser(myMsgWord)).toFixed(2) +
      "V)";
    document.getElementById("voltageInfTextTxt").value =
      "Voltage:" +
      portParser(myMsgWord) +
      "~(" +
      ((4.5 / 100) * portParser(myMsgWord)).toFixed(2) +
      "V)";
    }, 380)
    setTimeout(() => {
      commandGenerator(13, " ");
    }, 1500);
   // setTimeout(() => {
     
    //}, 550);

    /*setTimeout(()=>{
						commandGenerator(32, 8);
						setTimeout(()=>{
							configParser(portParser(myMsgWord));
						},750)
					},850)*/

    setTimeout(() => {
      commandGenerator(32, 13);
      setTimeout(() => {
        read(portParser(myMsgWord));
        specialDataInfo = portParser(myMsgWord);
      }, 650);
    }, 750);
  });

  findCarProm.catch((result) => {
    let rez = dialog.showMessageBoxSync({
      type: "info",
      title: "alert",
      message: result,
      detail: "would you like to look for car?",
      cancelId: 1,
      defaultId: 0,
      buttons: ["OK", "Cancel"],
    });

    if (rez === 0) {
      searcMode();
    } else {
      dialog.showMessageBoxSync({
        type: "info",
        title: "alert",
        message: "operation cancelled",
      });
    }
  });
});

document.getElementById("getCurrentValuesBut").addEventListener("click", () => {
  currentValuesFlag = 1;
  storedValuesFlag = 0;
  valuesFromComPortArr.length = 0;
  if (document.getElementById("modeChooseSLCT").value == "TRLTBoard") {
    let valuesToGetArrTRLT = [
      `mdata ${document.getElementById("portChooseSLCT").value} 85 32 1`,
      `mdata ${document.getElementById("portChooseSLCT").value} 85 32 2`,
      `mdata ${document.getElementById("portChooseSLCT").value} 85 32 3`,
      `mdata ${document.getElementById("portChooseSLCT").value} 85 32 4`,
      `mdata ${document.getElementById("portChooseSLCT").value} 85 32 5`,
      `mdata ${document.getElementById("portChooseSLCT").value} 85 32 6`,
      `mdata ${document.getElementById("portChooseSLCT").value} 85 32 7`,
      `mdata ${document.getElementById("portChooseSLCT").value} 85 32 8`,
      `mdata ${document.getElementById("portChooseSLCT").value} 85 32 9`,
      `mdata ${document.getElementById("portChooseSLCT").value} 85 32 10`,
      `mdata ${document.getElementById("portChooseSLCT").value} 85 32 11`,
      `mdata ${document.getElementById("portChooseSLCT").value} 85 32 12`,
      `mdata ${document.getElementById("portChooseSLCT").value} 85 32 13`,
      `mdata ${document.getElementById("portChooseSLCT").value} 85 32 14`,
      `mdata ${document.getElementById("portChooseSLCT").value} 85 32 15`,
    ];
    clearValuesFromValuesGet();
    getDataFromCom(valuesToGetArrTRLT, valuesFromFormToGetArr, 380);
  }

  if (document.getElementById("modeChooseSLCT").value == "arduino") {
    clearValuesFromValuesGet();
    getDataFromCom(valuesToGetArr, valuesFromFormToGetArr, 380);
  }
});

document.getElementById("getStoredValuesBut").addEventListener("click", () => {
  storedValuesFlag = 1;
  currentValuesFlag = 0;
  DBIStoredValuesFlag = 0;
  let valuesToGetSavedArrTRLT = [
    `mdata ${document.getElementById("portChooseSLCT").value} 85 32 101`,
    `mdata ${document.getElementById("portChooseSLCT").value} 85 32 21`,
    `mdata ${document.getElementById("portChooseSLCT").value} 85 32 31`,
    `mdata ${document.getElementById("portChooseSLCT").value} 85 32 41`,
    `mdata ${document.getElementById("portChooseSLCT").value} 85 32 51`,
    `mdata ${document.getElementById("portChooseSLCT").value} 85 32 61`,
    `mdata ${document.getElementById("portChooseSLCT").value} 85 32 71`,
    `mdata ${document.getElementById("portChooseSLCT").value} 85 32 81`,
    `mdata ${document.getElementById("portChooseSLCT").value} 85 32 91`,
    `mdata ${document.getElementById("portChooseSLCT").value} 85 32 110`,
    `mdata ${document.getElementById("portChooseSLCT").value} 85 32 111`,
    `mdata ${document.getElementById("portChooseSLCT").value} 85 32 112`,
    `mdata ${document.getElementById("portChooseSLCT").value} 85 32 113`,
    `mdata ${document.getElementById("portChooseSLCT").value} 85 32 14`,
    `mdata ${document.getElementById("portChooseSLCT").value} 85 32 15`,
  ];

  if (document.getElementById("modeChooseSLCT").value == "arduino") {
    clearValuesFromValuesStored();

    getDataFromCom(valuesToGetSavedArr, valuesFromFormSavedArr, 380);
  }

  if (document.getElementById("modeChooseSLCT").value == "TRLTBoard") {
    clearValuesFromValuesStored();

    getDataFromCom(valuesToGetSavedArrTRLT, valuesFromFormSavedArr, 350);
  }
});

function searcMode() {
  console.log("searching");
  if (document.getElementById("modeChooseSLCT").value == "arduino") {
    MyCOMPort.write("trans 85 2 100" + "\r\n", () => {});
    document.getElementById("reqBut").hidden = false;
  }

  if (document.getElementById("modeChooseSLCT").value == "TRLTBoard") {
    /*MyCOMPort.write("mtrans 0 85 2 100" + "\r\n", () => {});
    setTimeout(() => {
      MyCOMPort.write("mreq" + "\r\n", () => {});
    }, 350);*/

    document.getElementById("reqBut").hidden = false;
  }
}

document.getElementById("reqBut").addEventListener("click", () => {
  if (document.getElementById("modeChooseSLCT").value == "TRLTBoard") {
    MyCOMPort.write("mreq" + "\r\n", {});

    commandGenerator(102, " ");
    setTimeout(() => {
      document.getElementById("voltageInfMainTxt").value =
        "Voltage:" +
        portParser(myMsgWord) +
        "~(" +
        ((4.5 / 100) * portParser(myMsgWord)).toFixed(2) +
        "V)";
      document.getElementById("voltageInfTextTxt").value =
        "Voltage:" +
        portParser(myMsgWord) +
        "~(" +
        ((4.5 / 100) * portParser(myMsgWord)).toFixed(2) +
        "V)";
    }, 380);
    setTimeout(() => {
      commandGenerator(13, " ");
    }, 480);
  }

  document.getElementById("reqBut").hidden = true;
});

function parseMsgWRD(parcedByteOne, parcedByteTwo) {
  if ((parcedByteOne & 1) != 0) {
    document.getElementById("ByteParced_0").value =
      "Ошибка по приводу, нет импульсов от тахометра";
  }
  if ((parcedByteOne & 2) != 0) {
    document.getElementById("ByteParced_1").value =
      "Получена команда об остановке";
  }
  if ((parcedByteOne & 4) != 0) {
    document.getElementById("ByteParced_2").value =
      "Работает powerKeeping (поддержание оборотов)";
  }
  if ((parcedByteOne & 8) != 0) {
    document.getElementById("ByteParced_3").value =
      "Включен двигатель, мощность не регулируется ";
  }
  if ((parcedByteOne & 16) != 0) {
    document.getElementById("ByteParced_4").value = "получен фронт по ИК";
  }
  if ((parcedByteOne & 32) != 0) {
    document.getElementById("ByteParced_5").value =
      "запрет счета оборотов при их измерениях";
  }
  if ((parcedByteOne & 64) != 0) {
    document.getElementById("ByteParced_6").value = "долгое ИК излучение";
  }
  if ((parcedByteOne & 128) != 0) {
    document.getElementById("ByteParced_7").value =
      "напряжение меньше 3 - х вольт";
  }

  if ((parcedByteTwo & 1) != 0) {
    document.getElementById("ByteParced_8").value =
      "инициализация при включении еще не прошла";
  }
  if ((parcedByteTwo & 2) != 0) {
    document.getElementById("ByteParced_9").value =
      "движение на пониженной скорости";
  }
  if ((parcedByteTwo & 4) != 0) {
    document.getElementById("ByteParced_10").value =
      "импульсы от старой системы";
  }
  if ((parcedByteTwo & 8) != 0) {
    document.getElementById("ByteParced_11").value = "другие причины";
  }
  if ((parcedByteTwo & 16) != 0) {
    document.getElementById("ByteParced_12").value =
      "другие причины или ошибки";
  }
  if ((parcedByteTwo & 32) != 0) {
    document.getElementById("ByteParced_13").value =
      "parcedByteTwo 16 byte !=0";
  }
  if ((parcedByteTwo & 64) != 0) {
    document.getElementById("ByteParced_14").value =
      "включен тестовый режим, мощность не регулируется";
  }
  if ((parcedByteTwo & 128) != 0) {
    document.getElementById("ByteParced_15").value =
      "напряжение меньше нижнего порога";
  }
}

function resetBytesParcedValues() {
  document.getElementById("ByteParced_0").value = "  ";
  document.getElementById("ByteParced_1").value = "  ";
  document.getElementById("ByteParced_2").value = "  ";
  document.getElementById("ByteParced_3").value = "  ";
  document.getElementById("ByteParced_4").value = "  ";
  document.getElementById("ByteParced_5").value = "  ";
  document.getElementById("ByteParced_6").value = "  ";
  document.getElementById("ByteParced_7").value = "  ";
  document.getElementById("ByteParced_8").value = "  ";
  document.getElementById("ByteParced_9").value = "  ";
  document.getElementById("ByteParced_10").value = "  ";
  document.getElementById("ByteParced_11").value = "  ";
  document.getElementById("ByteParced_12").value = "  ";
  document.getElementById("ByteParced_13").value = "  ";
  document.getElementById("ByteParced_14").value = "  ";
  document.getElementById("ByteParced_15").value = "  ";
}

document.getElementById("parceMsgWD").addEventListener("click", () => {
  resetBytesParcedValues();
  myStr = document.getElementById("TextRecieved").value;

  if (document.getElementById("textToSend").value == mesWrdGet) {
    var slicedVal = myStr.slice(-60);
    console.log(slicedVal);
    var newSlice = slicedVal.slice(
      slicedVal.indexOf(":") + 1,
      slicedVal.length
    );
    parcedByteOne = newSlice.slice(
      newSlice.indexOf(":") + 1,
      newSlice.indexOf(":") + 4
    );
    parcedByteTwo = newSlice.slice(-3);
  }
  console.log(parcedByteOne);
  console.log(parcedByteTwo);
  parseMsgWRD(parcedByteOne, parcedByteTwo);
});

/*function parseMsgWRD(parcedByteOne, parcedByteTwo){
			if((parcedByteOne & 1) !=0){document.getElementById('ByteParced_0').value = 'Ошибка по приводу, нет импульсов от тахометра'};
			if((parcedByteOne & 2) !=0){document.getElementById('ByteParced_1').value = 'Получена команда об остановке'};
			if((parcedByteOne & 4) !=0){document.getElementById('ByteParced_2').value = 'Работает powerKeeping (поддержание оборотов)'};
			if((parcedByteOne & 8) !=0){document.getElementById('ByteParced_3').value = 'Включен двигатель, мощность не регулируется '};
			if((parcedByteOne & 16) !=0){document.getElementById('ByteParced_4').value = 'получен фронт по ИК'};
			if((parcedByteOne & 32) !=0){document.getElementById('ByteParced_5').value = 'запрет счета оборотов при их измерениях'};
			if((parcedByteOne & 64) !=0){document.getElementById('ByteParced_6').value = 'долгое ИК излучение'};
			if((parcedByteOne & 128) !=0){document.getElementById('ByteParced_7').value = 'напряжение меньше 3 - х вольт'};

			if((parcedByteTwo & 1) !=0){document.getElementById('ByteParced_8').value = 'инициализация при включении еще не прошла'};
			if((parcedByteTwo & 2) !=0){document.getElementById('ByteParced_9').value = 'движение на пониженной скорости'};
			if((parcedByteTwo & 4) !=0){document.getElementById('ByteParced_10').value = 'импульсы от старой системы'};
			if((parcedByteTwo & 8) !=0){document.getElementById('ByteParced_11').value = 'другие причины'};
			if((parcedByteTwo & 16) !=0){document.getElementById('ByteParced_12').value = 'другие причины или ошибки'};
			if((parcedByteTwo & 32) !=0){document.getElementById('ByteParced_13').value = 'parcedByteTwo 16 byte !=0'};
			if((parcedByteTwo & 64) !=0){document.getElementById('ByteParced_14').value = 'включен тестовый режим, мощность не регулируется'};
			if((parcedByteTwo & 128) !=0){document.getElementById('ByteParced_15').value = 'напряжение меньше нижнего порога'};
		}*/

function clearValuesFromValuesGet() {
  document.getElementById("parcedValuesGetUnitAddr").value = "  ";
  document.getElementById("parcedValuesGetdefPWR").value = "  ";
  document.getElementById("parcedValuesGetminPWR").value = "  ";
  document.getElementById("parcedValuesGetMINRPM").value = "  ";
  document.getElementById("parcedValuesGetMAXRPM").value = "  ";
  document.getElementById("parcedValuesGetRaizedDivider").value = "  ";
  document.getElementById("parcedValuesGetReduceDivider").value = "  ";
  document.getElementById("parcedValuesGetConfig").value = "  ";
  document.getElementById("parcedValuesGetWaitDelay").value = "  ";
  document.getElementById("parcedValuesGetSlowMovingDelay").value = "  ";
  document.getElementById("parcedValuesGetVoltThress").value = "  ";
  document.getElementById("parcedValuesGetNoRPMPWR").value = "  ";
  document.getElementById("parcedValuesGetunitID").value = "  ";
  document.getElementById("parcedValuesGetSoftInfo").value = "  ";
  document.getElementById("parcedValuesGetPinsInfo").value = "  ";
  document.getElementById("parcedValuesGetInitInfo").value = "  ";
}

function clearValuesFromValuesStored() {
  document.getElementById("parcedValuesSavedUnitAddr").value = "  ";
  document.getElementById("parcedValuesSaveddefPWR").value = "  ";
  document.getElementById("parcedValuesSavedminPWR").value = "  ";
  document.getElementById("parcedValuesSavedMINRPM").value = "  ";
  document.getElementById("parcedValuesSavedMAXRPM").value = "  ";
  document.getElementById("parcedValuesSavedRaizedDivider").value = "  ";
  document.getElementById("parcedValuesSavedReduceDivider").value = "  ";
  document.getElementById("parcedValuesSavedConfig").value = "  ";
  document.getElementById("parcedValuesSavedWaitDelay").value = "  ";
  document.getElementById("parcedValuesSavedSlowMovingDelay").value = "  ";
  document.getElementById("parcedValuesSavedVoltThress").value = "  ";
  document.getElementById("parcedValuesSavedNoRPMPWR").value = "  ";
  document.getElementById("parcedValuesSavedunitID").value = "  ";
  document.getElementById("parcedValuesSavedSoftInfo").value = "  ";
  document.getElementById("parcedValuesSavedPinsInfo").value = "  ";
  document.getElementById("parcedValuesSavedInitInfo").value = "  ";
}

document.getElementById("savedParcedValues").addEventListener("click", () => {
  if (successFlag == indexArr.length) {
    console.log("!!!");
  }

  for (let i = 0; i < valuesFromFormToChangeArr.length; i++) {
    document.getElementById(
      valuesFromFormToChangeArr[i]
    ).style.backgroundColor = "white";
    document.getElementById(valuesFromFormToChangeArr[i]).style.color = "black";
  }
  commandGenerator(30, " ");
  setTimeout(() => {
    if (portParser(myMsgWord) == 170) {
      dialog.showMessageBoxSync({
        type: "info",
        title: "alert",
        message: "Data was successfully saved!",
        detail: "Operation code: 170",
      });
    }
  }, 350);
});

document.getElementById("statusAcceptBut").addEventListener("click", () => {
  let statusReParce = "";

  if (document.getElementById("moveVoltageUserCheck").checked == true) {
    statusReParce += "1";
  } else {
    statusReParce += "0";
  }
  if (document.getElementById("connectionSystemUserCheck").checked == true) {
    statusReParce += "1";
  } else {
    statusReParce += "0";
  }
  if (document.getElementById("backLEDAlwEnabledUserCheck").checked == true) {
    statusReParce += "1";
  } else {
    statusReParce += "0";
  }
  if (document.getElementById("powerSavingModeUserCheck").checked == true) {
    statusReParce += "1";
  } else {
    statusReParce += "0";
  }
  if (document.getElementById("backLEDBlinksUserCheck").checked == true) {
    statusReParce += "1";
  } else {
    statusReParce += "0";
  }
  if (document.getElementById("trafficLightsModeUserCheck").checked == true) {
    statusReParce += "1";
  } else {
    statusReParce += "0";
  }
  if (document.getElementById("crashAvoidUserCheck").checked == true) {
    statusReParce += "1";
  } else {
    statusReParce += "0";
  }
  if (document.getElementById("replyReactionUserCheck").checked == true) {
    statusReParce += "1";
  } else {
    statusReParce += "0";
  }

  var backWay = statusReParce.split("").reverse().join("");
  console.log("THEN " + backWay + "  NOW " + parseInt(backWay, 2));

  document.getElementById("moveVoltageUserCheck").checked = false;
  document.getElementById("connectionSystemUserCheck").checked = false;
  document.getElementById("backLEDAlwEnabledUserCheck").checked = false;
  document.getElementById("powerSavingModeUserCheck").checked = false;
  document.getElementById("backLEDBlinksUserCheck").checked = false;
  document.getElementById("trafficLightsModeUserCheck").checked = false;
  document.getElementById("crashAvoidUserCheck").checked = false;
  document.getElementById("replyReactionUserCheck").checked = false;

  document.getElementById("parcedValuesSendConfig").value = parseInt(
    backWay,
    2
  );
});

document.getElementById("sendParcedValues").addEventListener("click", () => {
  document.getElementById("savedParcedValues").hidden = false;
  //document.getElementById('TypeOfDataCH').value = 'current';
  const rez = dialog.showMessageBoxSync({
    type: "info",
    title: "alert",
    message: "You are trying to change the car data.",
    detail: " Continue?",
    cancelId: 1, // Press ESC to click the index button by default
    defaultId: 0, // The button subscript is highlighted by default
    buttons: ["OK", "Cancel"], // The buttons sort by index from right to left
  });
  let commandsToSaveChangedValuesArrTRLT = [
    `mdata ${document.getElementById("portChooseSLCT").value} 85 41`,
    `mdata ${document.getElementById("portChooseSLCT").value} 85 42`,
    `mdata ${document.getElementById("portChooseSLCT").value} 85 43`,
    `mdata ${document.getElementById("portChooseSLCT").value} 85 44`,
    `mdata ${document.getElementById("portChooseSLCT").value} 85 45`,
    `mdata ${document.getElementById("portChooseSLCT").value} 85 46`,
    `mdata ${document.getElementById("portChooseSLCT").value} 85 47`,
    `mdata ${document.getElementById("portChooseSLCT").value} 85 48`,
    `mdata ${document.getElementById("portChooseSLCT").value} 85 49`,
    `mdata ${document.getElementById("portChooseSLCT").value} 85 50`,
    `mdata ${document.getElementById("portChooseSLCT").value} 85 51`,
    `mdata ${document.getElementById("portChooseSLCT").value} 85 52`,
    `mdata ${document.getElementById("portChooseSLCT").value} 85 53`,
  ];
  if (rez === 0) {
    if (document.getElementById("modeChooseSLCT").value == "arduino") {
      sendDataToCom(commandsToSaveChangedValuesArr, valuesFromFormToChangeArr);
    }

    if (document.getElementById("modeChooseSLCT").value == "TRLTBoard") {
      sendDataToCom(
        commandsToSaveChangedValuesArrTRLT,
        valuesFromFormToChangeArr
      );
    }
  } else {
    dialog.showMessageBoxSync({
      type: "info",
      title: "notification",
      message: "Operation cancelled",
    });
  }
});

function scrollFunc(){
  document.getElementById('textToSend').scrollTop = document.getElementById('textToSend').scrollHeight;
}

document.getElementById("SendMyStringButton").addEventListener("click", () => {
  MyCOMPort.write(document.getElementById("textToSend").value + "\r\n", () => {});
  scrollFunc();
  arrowUpMainFlag = 0;
  txtMainClickFlag = 0;
  txtToSendTestValues.push(document.getElementById("textToSend").value);
  console.log(txtToSendTestValues);
  document.getElementById("textToSend").value = " ";
});

document.getElementById("textToSend").addEventListener("click", () => {
  txtMainClickFlag++;
});

document.addEventListener("keydown", (event) => {
  if (event.key == "ArrowUp" && txtMainClickFlag != 0) {
    console.log("arrowup pressed");
    arrowUpMainFlag++;
    console.log(arrowUpMainFlag);
    let red = txtToSendTestValues[txtToSendTestValues.length - arrowUpMainFlag];
    console.log(red);
    document.getElementById("textToSend").value = red;

    if (txtToSendTestValues.length == arrowUpMainFlag) {
      arrowUpMainFlag = 0;
    }
  }
});

document.addEventListener("keydown", (event) => {
  if (event.key == "Enter" && txtMainClickFlag != 0) {
    MyCOMPort.write(
      document.getElementById("textToSend").value + "\r\n",
      () => {}
    );
    arrowUpMainFlag = 0;
    txtToSendTestValues.push(document.getElementById("textToSend").value);
    console.log(txtToSendTestValues);
    document.getElementById("textToSend").value = " ";
  }
});

document.getElementById("TxtSendTestBut").addEventListener("click", () => {
  MyCOMPort.write(
    document.getElementById("TxtToSendTest").value + "\r\n",
    () => {}
  );

  arrowUpFlag = 0;
  txtClickFlag = 0;
  txtToSendTestValues.push(document.getElementById("TxtToSendTest").value);
  console.log(txtToSendTestValues);

  document.getElementById("TxtToSendTest").value = " ";
});

document.getElementById("TxtSendTestBut").addEventListener("click", () => {
  txtClickFlag++;
});

document.addEventListener("keydown", (event) => {
  if (
    event.key == "ArrowUp" &&
    txtClickFlag != 0 /*&&(txtToSendTestValues.length !=0)*/
  ) {
    console.log("arrowup pressed");
    arrowUpFlag++;
    console.log(arrowUpFlag);
    let zed = txtToSendTestValues[txtToSendTestValues.length - arrowUpFlag];
    console.log(zed);
    document.getElementById("TxtToSendTest").value = zed;
    if (txtToSendTestValues.length == arrowUpFlag) {
      arrowUpFlag = 0;
    }
  }
});

document.getElementById("TxtSendSMegaTestBut").addEventListener("click", () => {
  MyCOMPort.write(
    document.getElementById("TxtToSendSMegaTest").value + "\r\n",
    () => {}
  );
});

document.getElementById("TxtSendSSetupBut").addEventListener("click", () => {
  MyCOMPort.write(
    document.getElementById("TxtToSendSSetup").value + "\r\n",
    () => {}
  );

  arrowUpSSetupFlag = 0;
  txtSSetupClickFlag = 0;
  txtToSendTestValues.push(document.getElementById("TxtToSendSSetup").value);
  console.log(txtToSendTestValues);

  document.getElementById("TxtToSendSSetup").value = " ";
});

document.getElementById("TxtToSendSSetup").addEventListener("click", () => {
  txtSSetupClickFlag++;
});

document.addEventListener("keydown", (event) => {
  if (
    event.key == "ArrowUp" &&
    txtSSetupClickFlag != 0 /*&&(txtToSendTestValues.length !=0)*/
  ) {
    console.log("arrowup pressed");
    txtSSetupClickFlag++;
    console.log(arrowUpSSetupFlag);
    let mad =
      txtToSendTestValues[txtToSendTestValues.length - arrowUpSSetupFlag];
    console.log(mad);
    document.getElementById("TxtToSendSSetup").value = mad;
    if (txtToSendTestValues.length == arrowUpSSetupFlag) {
      arrowUpSSetupFlag = 0;
    }
  }
});

function portParser(str) {
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

function getDataFromCom(commandArr, formsArr, delay) {
  catchFlag = 0;
  valuesFromComPortArr.length = 0;
  indexArr.length = 0;
  errorCommArr.length = 0;
  let error;
  for (let i = 0; i < commandArr.length + 1; i++) {
    let myPromise = new Promise((resolve, reject) => {
      setTimeout(() => {
        MyCOMPort.write(commandArr[i] + "\r\n", () => {});
        console.log(commandArr[i]);
        if (portParser(myMsgWord) != 0) {
          resolve(portParser(myMsgWord));
        } else {
          if (myMsgWord == undefined) {
            myMsgWord = "";
          }

          error = i;
          index = i;

          errorCommArr.push(commandArr[error - 1]);
          indexArr.push(index);
          console.log(errorCommArr);
          reject(error);
        }
      }, delay * i);
    });

    myPromise.then((result) => {
      document.getElementById(formsArr[i]).value = result;

      if (i == 8) {
        configParser(portParser(myMsgWord));
      }

      if (i == 13) {
        if (portParser(myMsgWord) == 255) {
          console.log("!!!");
          let elem = document.getElementById("parcedValuesGetunitID");
          elem.style.backgroundColor = "red";
          elem.style.color = "white";
          let elt = document.getElementById("parcedValuesSendunitID");
          elt.style.backgroundColor = "green";
          elt.style.color = "white";
        } else {
          let elem = document.getElementById("parcedValuesGetunitID");
          elem.style.backgroundColor = "white";
          elem.style.color = "black";
          let elt = document.getElementById("parcedValuesSendunitID");
          elt.style.backgroundColor = "white";
          elt.style.color = "black";
        }
      }
    });

    myPromise.catch((result) => {
      catchFlag++;
      console.log(
        "unable to get data for parameter: ",
        result,
        " please, retry!"
      );
      console.log(errorCommArr);
      if (errorCommArr[i] == undefined) {
        errorIndex = i;
        console.log(errorIndex);
        document.getElementById(formsArr[errorIndex]).style.backgroundColor =
          "orange";
        // document.getElementById('reAskDataBut').style.backgroundColor = "orange";
      }
    });
  }

  setTimeout(() => {
    /*if(errorCommArr.length == 0 && currentValuesFlag == 1){
					let comment = document.getElementById('commentDiagDBTxt').value;
					let date = new Date();
					let d = date.getDate();
					let h = date.getHours();
					let m = date.getMinutes();

					for(let i=0; i<formsArr.length; i++){
						valuesFromComPortArr.push(`${document.getElementById(formsArr[i]).value.substr(1)}`);
					}
					valuesFromComPortArr.push(`${d}`);
					valuesFromComPortArr.push(`${h}`);
					valuesFromComPortArr.push(`${m}`);
					valuesFromComPortArr.push(comment);
					console.log(valuesFromComPortArr);  
					DBCarParametersAdd(dbCarsParas, valuesFromComPortArr);
				}*/
    if (errorCommArr.length != 0 && currentValuesFlag == 1) {
      for (let i = 0; i < errorCommArr.length + 1; i++) {
        setTimeout(() => {
          MyCOMPort.write(errorCommArr[i] + "\r\n", () => {});
          console.log(errorCommArr[i] + " " + portParser(myMsgWord));
          document.getElementById(
            valuesFromFormToGetArr[indexArr[i - 1]]
          ).value = portParser(myMsgWord);
          document.getElementById(
            valuesFromFormToGetArr[indexArr[i - 1]]
          ).style.backgroundColor = "white";
          document.getElementById("reAskDataBut").style.backgroundColor =
            "white";
        }, 380 * i);
      }

      /*setTimeout(()=>{
							let comment = document.getElementById('commentDiagDBTxt').value;
							let date = new Date();
							let d = date.getDate();
							let h = date.getHours();
							let m = date.getMinutes();
							for(let i=0; i<formsArr.length; i++){
								valuesFromComPortArr.push(`${document.getElementById(formsArr[i]).value.substr(1)}`);
							}
							
							valuesFromComPortArr.push(`${d}`);
							valuesFromComPortArr.push(`${h}`);
							valuesFromComPortArr.push(`${m}`);
							valuesFromComPortArr.push(comment);
							console.log(valuesFromComPortArr);  
							DBCarParametersAdd(dbCarsParas, valuesFromComPortArr);
						},6000)*/
    }

    if (
      errorCommArr.length != 0 &&
      storedValuesFlag ==
        1 /*|| (errorCommArr.length!=0 && DBIStoredValuesFlag == 1)*/
    ) {
      //DBIStoredValuesFlag
      //if(storedValuesFlag == 1){
      for (let i = 0; i < errorCommArr.length + 1; i++) {
        setTimeout(() => {
          MyCOMPort.write(errorCommArr[i] + "\r\n", () => {});
          console.log(errorCommArr[i] + " " + portParser(myMsgWord));
          document.getElementById(
            valuesFromFormSavedArr[indexArr[i - 1]]
          ).value = portParser(myMsgWord);
          //document.getElementById(valuesFromFormSavedArr[indexArr[i-1]]).style.backgroundColor = "light grey";
          //document.getElementById('parcedValuesGetSoftInfo').style.backgroundColor = 'grey';
        }, 380 * i);
      }
      //}
    }

    if (DBIStoredValuesFlag == 1 && errorCommArr.length != 0) {
      for (let i = 0; i < errorCommArr.length + 1; i++) {
        setTimeout(() => {
          MyCOMPort.write(errorCommArr[i] + "\r\n", () => {});
          console.log(errorCommArr[i] + " " + portParser(myMsgWord));
          document.getElementById(DBIFormsVals[indexArr[i - 1]]).value =
            portParser(myMsgWord);
          document.getElementById(
            DBIFormsVals[indexArr[i - 1]]
          ).style.backgroundColor = "white";
        }, 380 * i);
      }
    }

    //}
  }, 7000);
}

function sendDataToCom(commandArr, elementArr) {
  indexArr.length = 0;
  fullArr.length = 0;
  for (let i = 0; i < commandArr.length; i++) {
    fullArr.push(document.getElementById(elementArr[i]).value);
    console.log(fullArr);
    if (fullArr[i].length != 0) {
      let index = i;
      indexArr.push(index);
      console.log(indexArr);
      if (indexArr.indexOf(13) != -1) {
        console.log("1204!!!!");
      }
    }
  }

  for (let i = 0; i < indexArr.length; i++) {
    console.log(indexArr);
    setTimeout(() => {
      console.log(
        "COMMAND   " +
          commandArr[indexArr[i]] +
          " " +
          document.getElementById(elementArr[indexArr[i]]).value
      );
      MyCOMPort.write(
        commandArr[indexArr[i]] +
          " " +
          document.getElementById(elementArr[indexArr[i]]).value +
          "\r\n",
        () => {}
      );
    }, 500 * i);
    setTimeout(() => {
      if (portParser(myMsgWord) == 170) {
        console.log(`Parameter ${indexArr[i]} changed successfully!`);
        document.getElementById(elementArr[indexArr[i]]).style.backgroundColor =
          "green";
        document.getElementById(elementArr[indexArr[i]]).style.color = "white";
        successFlag++;
      } else {
        console.log(`Parameter ${indexArr[i]} wasnt changed!`);
        document.getElementById(elementArr[indexArr[i]]).style.backgroundColor =
          "orange";
        document.getElementById(elementArr[indexArr[i]]).style.color = "white";
      }
    }, 550);
  }
}

function configParser(configWRD) {
  if (currentValuesFlag == 1) {
    if ((configWRD & 1) != 0) {
      document.getElementById("moveVoltageProgGetCheck").checked = true;
      pereParce += "1";
    }
    if ((configWRD & 1) == 0) {
      document.getElementById("moveVoltageProgGetCheck").checked = false;
      pereParce += "0";
    }
    if ((configWRD & 2) != 0) {
      document.getElementById("connectionSystemProgGetCheck").checked = true;
      pereParce += "1";
    }
    if ((configWRD & 2) == 0) {
      document.getElementById("connectionSystemProgGetCheck").checked = false;
      pereParce += "0";
    }
    if ((configWRD & 4) != 0) {
      document.getElementById("backLEDAlwEnabledProgGetCheck").checked = true;
      pereParce += "1";
    }
    if ((configWRD & 4) == 0) {
      document.getElementById("backLEDAlwEnabledProgGetCheck").checked = false;
      pereParce += "0";
    }
    if ((configWRD & 8) != 0) {
      document.getElementById("powerSavingModeProgGetCheck").checked = true;
      pereParce += "1";
    }
    if ((configWRD & 8) == 0) {
      document.getElementById("powerSavingModeProgGetCheck").checked = false;
      pereParce += "0";
    }
    if ((configWRD & 16) != 0) {
      document.getElementById("backLEDBlinksProgGetCheck").checked = true;
      pereParce += "1";
    }
    if ((configWRD & 16) == 0) {
      document.getElementById("backLEDBlinksProgGetCheck").checked = false;
      pereParce += "0";
    }
    if ((configWRD & 32) != 0) {
      document.getElementById("trafficLightsModeProgGetCheck").checked = true;
      pereParce += "1";
    }
    if ((configWRD & 32) == 0) {
      document.getElementById("trafficLightsModeProgGetCheck").checked = false;
      pereParce += "0";
    }
    if ((configWRD & 64) != 0) {
      document.getElementById("crashAvoidProgGetCheck").checked = true;
      pereParce += "1";
    }
    if ((configWRD & 64) == 0) {
      document.getElementById("crashAvoidProgGetCheck").checked = false;
      pereParce += "0";
    }
    if ((configWRD & 128) != 0) {
      document.getElementById("replyReactionProgGetCheck").checked = true;
      pereParce += "1";
    }
    if ((configWRD & 128) == 0) {
      document.getElementById("replyReactionProgGetCheck").checked = false;
      pereParce += "0";
    }
  }

  if (storedValuesFlag == 1) {
    if ((configWRD & 1) != 0) {
      document.getElementById("moveVoltageProgStoredCheck").checked = true;
      pereParce += "1";
    }
    if ((configWRD & 1) == 0) {
      document.getElementById("moveVoltageProgStoredCheck").checked = false;
      pereParce += "0";
    }
    if ((configWRD & 2) != 0) {
      document.getElementById("connectionSystemProgStoredCheck").checked = true;
      pereParce += "1";
    }
    if ((configWRD & 2) == 0) {
      document.getElementById(
        "connectionSystemProgStoredCheck"
      ).checked = false;
      pereParce += "0";
    }
    if ((configWRD & 4) != 0) {
      document.getElementById(
        "backLEDAlwEnabledProgStoredCheck"
      ).checked = true;
      pereParce += "1";
    }
    if ((configWRD & 4) == 0) {
      document.getElementById(
        "backLEDAlwEnabledProgStoredCheck"
      ).checked = false;
      pereParce += "0";
    }
    if ((configWRD & 8) != 0) {
      document.getElementById("powerSavingModeProgStoredCheck").checked = true;
      pereParce += "1";
    }
    if ((configWRD & 8) == 0) {
      document.getElementById("powerSavingModeProgStoredCheck").checked = false;
      pereParce += "0";
    }
    if ((configWRD & 16) != 0) {
      document.getElementById("backLEDBlinksProgStoredCheck").checked = true;
      pereParce += "1";
    }
    if ((configWRD & 16) == 0) {
      document.getElementById("backLEDBlinksProgStoredCheck").checked = false;
      pereParce += "0";
    }
    if ((configWRD & 32) != 0) {
      document.getElementById(
        "trafficLightsModeProgStoredCheck"
      ).checked = true;
      pereParce += "1";
    }
    if ((configWRD & 32) == 0) {
      document.getElementById(
        "trafficLightsModeProgStoredCheck"
      ).checked = false;
      pereParce += "0";
    }
    if ((configWRD & 64) != 0) {
      document.getElementById("crashAvoidProgStoredCheck").checked = true;
      pereParce += "1";
    }
    if ((configWRD & 64) == 0) {
      document.getElementById("crashAvoidProgStoredCheck").checked = false;
      pereParce += "0";
    }
    if ((configWRD & 128) != 0) {
      document.getElementById("replyReactionProgStoredCheck").checked = true;
      pereParce += "1";
    }
    if ((configWRD & 128) == 0) {
      document.getElementById("replyReactionProgStoredCheck").checked = false;
      pereParce += "0";
    }

  }

  if (testFlag == 1) {
    if ((configWRD & 1) != 0) {
      document.getElementById("moveVoltageProgStoredCheck").checked = true;
      pereParce += "1";
    }
    if ((configWRD & 1) == 0) {
      document.getElementById("moveVoltageProgStoredCheck").checked = false;
      pereParce += "0";
    }
    if ((configWRD & 2) != 0) {
      document.getElementById("connectionSystemProgStoredCheck").checked = true;
      pereParce += "1";
    }
    if ((configWRD & 2) == 0) {
      document.getElementById(
        "connectionSystemProgStoredCheck"
      ).checked = false;
      pereParce += "0";
    }
    if ((configWRD & 4) != 0) {
      document.getElementById(
        "backLEDAlwEnabledProgStoredCheck"
      ).checked = true;
      pereParce += "1";
    }
    if ((configWRD & 4) == 0) {
      document.getElementById(
        "backLEDAlwEnabledProgStoredCheck"
      ).checked = false;
      pereParce += "0";
    }
    if ((configWRD & 8) != 0) {
      document.getElementById("powerSavingModeProgStoredCheck").checked = true;
      pereParce += "1";
    }
    if ((configWRD & 8) == 0) {
      document.getElementById("powerSavingModeProgStoredCheck").checked = false;
      pereParce += "0";
    }
    if ((configWRD & 16) != 0) {
      document.getElementById("backLEDBlinksProgStoredCheck").checked = true;
      pereParce += "1";
    }
    if ((configWRD & 16) == 0) {
      document.getElementById("backLEDBlinksProgStoredCheck").checked = false;
      pereParce += "0";
    }
    if ((configWRD & 32) != 0) {
      document.getElementById(
        "trafficLightsModeProgStoredCheck"
      ).checked = true;
      pereParce += "1";
    }
    if ((configWRD & 32) == 0) {
      document.getElementById(
        "trafficLightsModeProgStoredCheck"
      ).checked = false;
      pereParce += "0";
    }
    if ((configWRD & 64) != 0) {
      document.getElementById("crashAvoidProgStoredCheck").checked = true;
      pereParce += "1";
    }
    if ((configWRD & 64) == 0) {
      document.getElementById("crashAvoidProgStoredCheck").checked = false;
      pereParce += "0";
    }
    if ((configWRD & 128) != 0) {
      document.getElementById("replyReactionProgStoredCheck").checked = true;
      pereParce += "1";
    }
    if ((configWRD & 128) == 0) {
      document.getElementById("replyReactionProgStoredCheck").checked = false;
      pereParce += "0";
    }
  }
}

document.getElementById("carResetBut").addEventListener("click", () => {
  const rez = dialog.showMessageBoxSync({
    type: "info",
    title: "You trying to reset car",
    message: "Countinue?",
    //detail: 'Additional Information',
    cancelId: 1, // Press ESC to click the index button by default
    defaultId: 0, // The button subscript is highlighted by default
    buttons: ["OK", "Cancel"], // The buttons sort by index from right to left
  });

  if (rez === 0) {
    MyCOMPort.write(commandGenerator(200, " ") + "\r\n", () => {});
  } else {
    dialog.showMessageBoxSync({
      type: "info",
      title: "alert",
      message: "operation cancelled",
    });
  }
});

document.getElementById("carReset210But").addEventListener("click", () => {
  const rez = dialog.showMessageBoxSync({
    type: "info",
    title: "You trying to reset car",
    message: "Countinue?",
    //detail: 'Additional Information',
    cancelId: 1, // Press ESC to click the index button by default
    defaultId: 0, // The button subscript is highlighted by default
    buttons: ["OK", "Cancel"], // The buttons sort by index from right to left
  });

  if (rez === 0) {
    MyCOMPort.write(commandGenerator(210, " ") + "\r\n", () => {});
  } else {
    dialog.showMessageBoxSync({
      type: "info",
      title: "alert",
      message: "operation cancelled",
    });
  }
});

function commandGenerator(command, dataToSend) {
  if (document.getElementById("modeChooseSLCT").value == "arduino") {
    codeWrd = "data";
    address = "85";
    if (dataToSend != " ") {
      MyCOMPort.write(
        codeWrd + " " + address + " " + command + " " + dataToSend + "\r\n",
        () => {}
      );
    } else {
      MyCOMPort.write(
        codeWrd + " " + address + " " + command + "\r\n",
        () => {}
      );
    }
  }

  if (document.getElementById("modeChooseSLCT").value == "TRLTBoard") {
    codeWrd = "mdata";
    port = document.getElementById("portChooseSLCT").value;
    address = "85";
    if (dataToSend != " ") {
      MyCOMPort.write(
        codeWrd +
          " " +
          port +
          " " +
          address +
          " " +
          command +
          " " +
          dataToSend +
          "\r\n",
        () => {}
      );
      console.log(
        "COMMAND " +
          codeWrd +
          " " +
          port +
          " " +
          address +
          " " +
          command +
          " " +
          dataToSend
      );
    } else {
      MyCOMPort.write(
        codeWrd + " " + port + " " + address + " " + command + "\r\n",
        () => {}
      );
      console.log(
        "COMMAND " + codeWrd + " " + port + " " + address + " " + command
      );
    }
  }
}

let flag = 0;
document.getElementById("lockBut").addEventListener("click", () => {
  console.log(document.getElementById("portChooseSLCT").value);
  flag++;
  if (flag % 2 != 0) {
    document.getElementById("portChooseSLCT").hidden = false;
    document.getElementById("sqlGetDataBut").hidden = false;
    document.getElementById("lockBut").textContent = "LOCK";
  } else {
    document.getElementById("portChooseSLCT").hidden = true;
    document.getElementById("sqlGetDataBut").hidden = true;
    document.getElementById("lockBut").textContent = "UNLOCK";
  }
});

document.getElementById("getDefaultDataBut").addEventListener("click", () => {
  commandGenerator(39, " ");
  setTimeout(() => {
    console.log(portParser(myMsgWord));

    if (portParser(myMsgWord) == 170) {
      console.log("equal");
      dialog.showMessageBoxSync({
        type: "info",
        title: "alert",
        message: "default values were successfully accepted",
        detail: "Please get data from car by clicking button Get data",
      });
    }
  }, 350);
});

document.getElementById("dataClearBut").addEventListener("click", () => {
  clearValuesFromValuesGet();
  clearValuesFromValuesStored();
  clearDBI(valuesFromFormToChangeArr);
});

function read(status) {
  document.getElementById("carDBID").value = "ID: ";
  document.getElementById("carDBName").value = "Name: ";
  document.getElementById("carDBPlate").value = "Plate: ";
  document.getElementById("carDBIDMain").value = "ID: ";
  document.getElementById("carDBNameMain").value = "Name: ";
  document.getElementById("carDBPlateMain").value = "Plate: ";
  console.log("read works!");
  console.log(`status ${String(status)}`);
  DBFind(dbCars, Number(status));
  document.getElementById("enterAccessCarID").value = status;
}

document.getElementById("addDataToCarDBBut").addEventListener("click", () => {
  document.getElementById("DBInteractor").style.display = "block";
  document.getElementById("addDataToCarDBBut").hidden = true;
  //document.getElementById('DBScreenTxt').hidden = true;
  document.getElementById("tab_5").style.backgroundColor = "grey";
});

document
  .getElementById("enterCarDataCancelCloseBut")
  .addEventListener("click", () => {
    document.getElementById("DBInteractor").style.display = "none";
    document.getElementById("addDataToCarDBBut").hidden = false;
    //document.getElementById('DBScreenTxt').hidden = false;
    document.getElementById("tab_5").style.backgroundColor = "lightgrey";
  });

document
  .getElementById("enterCarDataApplyBut")
  .addEventListener("click", () => {
    dbCarsFlag = 1;
    dbRoutesFlag = 0;
    let carDBID = document.getElementById("enterCarDBID").value;
    let name = document.getElementById("enterCarDBName").value;
    let color = document.getElementById("enterCarDBColor").value;
    let plate = document.getElementById("enterCarDBPlate").value;
    DBCarsAdd(dbCars, carDBID, name, color, plate);
    document.getElementById("enterCarDBID").value = "";
    document.getElementById("enterCarDBName").value = "";
    document.getElementById("enterCarDBColor").value = "";
    document.getElementById("enterCarDBPlate").value = "";
  });

function DBFind(DB, parameter) {
  console.log(`DB works!`);
  let para = parameter.toString();
  DB.find({ ID: para }, function (err, docs) {
    //console.log(docs[13]);
    console.log(`dbCarsParasFlag == 1`);
    docs.map((data) => {
      document.getElementById("carDBIDMain").value = `ID: ${data.ID}`;
      document.getElementById("carDBIDMain").style.backgroundColor = "green";
      document.getElementById("carDBIDMain").style.color = "white";
      document.getElementById("carDBNameMain").value = `NAME: ${data.NAME}`;
      document.getElementById("carDBNameMain").style.backgroundColor = "green";
      document.getElementById("carDBNameMain").style.color = "white";
      document.getElementById("carDBPlateMain").value = `PLATE: ${data.PLATE}`;
      document.getElementById("carDBPlateMain").style.backgroundColor = "green";
      document.getElementById("carDBPlateMain").style.color = "white";

      document.getElementById("carDBID").value = `ID: ${data.ID}`;
      document.getElementById("carDBID").style.backgroundColor = "green";
      document.getElementById("carDBID").style.color = "white";
      document.getElementById("carDBName").value = `NAME: ${data.NAME}`;
      document.getElementById("carDBName").style.backgroundColor = "green";
      document.getElementById("carDBName").style.color = "white";
      document.getElementById("carDBPlate").value = `PLATE: ${data.PLATE}`;
      document.getElementById("carDBPlate").style.backgroundColor = "green";
      document.getElementById("carDBPlate").style.color = "white";

      document.getElementById("carDBIDDBI").value = `ID: ${data.ID}`;
      document.getElementById("carDBIDDBI").style.backgroundColor = "green";
      document.getElementById("carDBIDDBI").style.color = "white";
      document.getElementById("carDBNameDBI").value = `NAME: ${data.NAME}`;
      document.getElementById("carDBNameDBI").style.backgroundColor = "green";
      document.getElementById("carDBNameDBI").style.color = "white";
      document.getElementById("carDBPlateDBI").value = `PLATE: ${data.PLATE}`;
      document.getElementById("carDBPlateDBI").style.backgroundColor = "green";
      document.getElementById("carDBPlateDBI").style.color = "white";

      document.getElementById("carDBIDDBR").value = `ID: ${data.ID}`;
      document.getElementById("carDBIDDBR").style.backgroundColor = "green";
      document.getElementById("carDBIDDBR").style.color = "white";
      document.getElementById("carDBNameDBR").value = `${data.NAME}`;
      document.getElementById("carDBNameDBR").style.backgroundColor = "green";
      document.getElementById("carDBNameDBR").style.color = "white";
      document.getElementById("carDBPlateDBR").value = `${data.PLATE}`;
      document.getElementById("carDBPlateDBR").style.backgroundColor = "green";
      document.getElementById("carDBPlateDBR").style.color = "white";
    });
  });
}

function DBCarValuesFind(DB, parameter, year, month, day, hour) {
  let id = parameter.toString();
  let years = year.toString();
  let months = month.toString();
  let days = day.toString();
  let hours = hour.toString();
  if (
    document.getElementById("enterAccessCarID").value != "" &&
    document.getElementById("enterAccessDay").value != "" &&
    document.getElementById("enterAccessHour").value != ""
  ) {
    DB.find({ ID: id, DATE_day: days, DATE_Hour: hours })
      .sort({
        DATE_Year: 1,
        DATE_Month: 1,
        DATE_day: 1,
        DATE_Hour: 1,
        DATE_Min: 1,
        DATE_Sec: 1,
      })
      .exec(function (err, docs) {
        dbCars.find({ ID: id }, (err, docs) => {
          document.getElementById("carDBInfoEX").style.display = "block";

          console.log(docs);
          docs.map((data) => {
            document.getElementById("carDBRExName").value = data.NAME;
            document.getElementById("carDBRExPlate").value = data.PLATE;
            document.getElementById("carDBRExName").style.backgroundColor =
              "lightgreen";
            document.getElementById("carDBRExPlate").style.backgroundColor =
              "lightgreen";
          });
        });
        console.log(`${docs.length}`);
        //drawTable(docs);
        drawTable(docs, "display_json_data", headers);
      });
  }
  if (document.getElementById("enterAccessHour").value == "") {
    DB.find({ ID: id, DATE_day: days })
      .sort({
        DATE_Year: 1,
        DATE_Month: 1,
        DATE_day: 1,
        DATE_Hour: 1,
        DATE_Min: 1,
        DATE_Sec: 1,
      })
      .exec(function (err, docs) {
        dbCars.find({ ID: id }, (err, docs) => {
          document.getElementById("carDBInfoEX").style.display = "block";
          console.log(docs);
          docs.map((data) => {
            document.getElementById("carDBRExName").value = data.NAME;
            document.getElementById("carDBRExPlate").value = data.PLATE;
            document.getElementById("carDBRExName").style.backgroundColor =
              "lightgreen";
            document.getElementById("carDBRExPlate").style.backgroundColor =
              "lightgreen";
          });
        });
        console.log(`${docs.length}`);
        //drawTable(docs);
        drawTable(docs, "display_json_data", headers);
      });
  }
  if (
    document.getElementById("enterAccessDay").value == "" &&
    document.getElementById("enterAccessHour").value == ""
  ) {
    DB.find({ ID: id })
      .sort({
        DATE_Year: 1,
        DATE_Month: 1,
        DATE_day: 1,
        DATE_Hour: 1,
        DATE_Min: 1,
        DATE_Sec: 1,
      })
      .exec(function (err, docs) {
        document.getElementById("carDBInfoEX").style.display = "block";
        dbCars.find({ ID: id }, (err, docs) => {
          console.log(docs);
          docs.map((data) => {
            document.getElementById("carDBRExName").value = data.NAME;
            document.getElementById("carDBRExPlate").value = data.PLATE;
            document.getElementById("carDBRExName").style.backgroundColor =
              "lightgreen";
            document.getElementById("carDBRExPlate").style.backgroundColor =
              "lightgreen";
          });
        });
        //console.log(`${docs.length}`)
        //drawTable(docs);
        drawTable(docs, "display_json_data", headers);
      });
  }

  if (document.getElementById("enterAccessCarID").value == "") {
    DB.find({ DATE_day: day, DATE_Hour: hours })
      .sort({
        DATE_Year: 1,
        DATE_Month: 1,
        DATE_day: 1,
        DATE_Hour: 1,
        DATE_Min: 1,
        DATE_Sec: 1,
      })
      .exec(function (err, docs) {
        document.getElementById("carDBInfoEX").style.display = "none";
        console.log(`${docs.length}`);
        //drawTable(docs);
        drawTable(docs, "display_json_data", headers);
      });
  }

  if (
    document.getElementById("enterAccessCarID").value == "" &&
    document.getElementById("enterAccessHour").value == ""
  ) {
    DB.find({ DATE_day: days })
      .sort({
        DATE_Year: 1,
        DATE_Month: 1,
        DATE_day: 1,
        DATE_Hour: 1,
        DATE_Min: 1,
        DATE_Sec: 1,
      })
      .exec(function (err, docs) {
        document.getElementById("carDBInfoEX").style.display = "none";
        console.log(`${docs.length}`);
        //drawTable(docs);
        drawTable(docs, "display_json_data", headers);
      });
  }

  if (
    document.getElementById("enterAccessCarID").value == "" &&
    document.getElementById("enterAccessDay").value == "" &&
    document.getElementById("enterAccessHour").value == ""
  ) {
    DB.find({ DATE_Year: years, DATE_Month: months })
      .sort({
        DATE_Year: 1,
        DATE_Month: 1,
        DATE_day: 1,
        DATE_Hour: 1,
        DATE_Min: 1,
        DATE_Sec: 1,
      })
      .exec(function (err, docs) {
        document.getElementById("carDBInfoEX").style.display = "none";
        console.log(`${docs.length}`);
        //drawTable(docs);
        drawTable(docs, "display_json_data", headers);
      });
  }

  if (
    document.getElementById("enterAccessCarID").value != "" &&
    document.getElementById("enterAccessYear").value != "" &&
    document.getElementById("enterAccessMonth").value == ""
  ) {
    DB.find({ ID: id, DATE_Year: years, DATE_Month: months })
      .sort({
        DATE_Year: 1,
        DATE_Month: 1,
        DATE_day: 1,
        DATE_Hour: 1,
        DATE_Min: 1,
        DATE_Sec: 1,
      })
      .exec(function (err, docs) {
        document.getElementById("carDBInfoEX").style.display = "block";
        dbCars.find({ ID: id }, (err, docs) => {
          console.log(docs);
          docs.map((data) => {
            document.getElementById("carDBRExName").value = data.NAME;
            document.getElementById("carDBRExPlate").value = data.PLATE;
            document.getElementById("carDBRExName").style.backgroundColor =
              "lightgreen";
            document.getElementById("carDBRExPlate").style.backgroundColor =
              "lightgreen";
          });
        });
        console.log(`${docs.length}`);
        //drawTable(docs);
        drawTable(docs, "display_json_data", headers);
      });
  }

  if (document.getElementById("enterAccessYear").value != "") {
    DB.find({ DATE_Year: years })
      .sort({
        DATE_Year: 1,
        DATE_Month: 1,
        DATE_day: 1,
        DATE_Hour: 1,
        DATE_Min: 1,
        DATE_Sec: 1,
      })
      .exec(function (err, docs) {
        document.getElementById("carDBInfoEX").style.display = "none";
        console.log(`${docs.length}`);
        //drawTable(docs);
        drawTable(docs, "display_json_data", headers);
      });
  }

  if (document.getElementById("enterAccessMonth").value != "") {
    DB.find({ DATE_Month: months })
      .sort({
        DATE_Year: 1,
        DATE_Month: 1,
        DATE_day: 1,
        DATE_Hour: 1,
        DATE_Min: 1,
        DATE_Sec: 1,
      })
      .exec(function (err, docs) {
        document.getElementById("carDBInfoEX").style.display = "none";
        console.log(`${docs.length}`);
        //drawTable(docs);
        drawTable(docs, "display_json_data", headers);
      });
  }

  if (
    document.getElementById("enterAccessYear").value != "" &&
    document.getElementById("enterAccessCarID").value != ""
  ) {
    DB.find({ ID: id, DATE_Year: years })
      .sort({
        DATE_Year: 1,
        DATE_Month: 1,
        DATE_day: 1,
        DATE_Hour: 1,
        DATE_Min: 1,
        DATE_Sec: 1,
      })
      .exec(function (err, docs) {
        document.getElementById("carDBInfoEX").style.display = "block";
        dbCars.find({ ID: id }, (err, docs) => {
          console.log(docs);
          docs.map((data) => {
            document.getElementById("carDBRExName").value = data.NAME;
            document.getElementById("carDBRExPlate").value = data.PLATE;
            document.getElementById("carDBRExName").style.backgroundColor =
              "lightgreen";
            document.getElementById("carDBRExPlate").style.backgroundColor =
              "lightgreen";
          });
        });
        console.log(`${docs.length}`);
        //drawTable(docs);
        drawTable(docs, "display_json_data", headers);
      });
  }

  if (
    document.getElementById("enterAccessMonth").value != "" &&
    document.getElementById("enterAccessCarID").value != ""
  ) {
    DB.find({ ID: id, DATE_Month: months })
      .sort({
        DATE_Year: 1,
        DATE_Month: 1,
        DATE_day: 1,
        DATE_Hour: 1,
        DATE_Min: 1,
        DATE_Sec: 1,
      })
      .exec(function (err, docs) {
        document.getElementById("carDBInfoEX").style.display = "block";
        dbCars.find({ ID: id }, (err, docs) => {
          console.log(docs);
          docs.map((data) => {
            document.getElementById("carDBRExName").value = data.NAME;
            document.getElementById("carDBRExPlate").value = data.PLATE;
            document.getElementById("carDBRExName").style.backgroundColor =
              "lightgreen";
            document.getElementById("carDBRExPlate").style.backgroundColor =
              "lightgreen";
          });
        });
        console.log(`${docs.length}`);
        //drawTable(docs);
        drawTable(docs, "display_json_data", headers);
      });
  }

  console.log(document.getElementById("DBIParasFindSelect").value);
  if (document.getElementById("DBIParasFindSelect").value == "UNITaddress") {
    let value = document.getElementById("enterFindValue").value;
    DB.find({ UNITaddress: value })
      .sort({
        DATE_Year: 1,
        DATE_Month: 1,
        DATE_day: 1,
        DATE_Hour: 1,
        DATE_Min: 1,
        DATE_Sec: 1,
      })
      .exec(function (err, docs) {
        document.getElementById("carDBInfoEX").style.display = "none";
        console.log(`${docs.length}`);
        //drawTable(docs);
        drawTable(docs, "display_json_data", headers);
      });
  }

  if (document.getElementById("DBIParasFindSelect").value == "DEFAULTpower") {
    let value = document.getElementById("enterFindValue").value;
    DB.find({ DEFAULTpower: value })
      .sort({
        DATE_Year: 1,
        DATE_Month: 1,
        DATE_day: 1,
        DATE_Hour: 1,
        DATE_Min: 1,
        DATE_Sec: 1,
      })
      .exec(function (err, docs) {
        document.getElementById("carDBInfoEX").style.display = "none";
        console.log(`${docs.length}`);
        //drawTable(docs);
        drawTable(docs, "display_json_data", headers);
      });
  }

  if (document.getElementById("DBIParasFindSelect").value == "MINpower") {
    let value = document.getElementById("enterFindValue").value;
    DB.find({ MINpower: value })
      .sort({
        DATE_Year: 1,
        DATE_Month: 1,
        DATE_day: 1,
        DATE_Hour: 1,
        DATE_Min: 1,
        DATE_Sec: 1,
      })
      .exec(function (err, docs) {
        document.getElementById("carDBInfoEX").style.display = "none";
        console.log(`${docs.length}`);
        //drawTable(docs);
        drawTable(docs, "display_json_data", headers);
      });
  }

  if (document.getElementById("DBIParasFindSelect").value == "MINrpm") {
    let value = document.getElementById("enterFindValue").value;
    DB.find({ MINrpm: value })
      .sort({
        DATE_Year: 1,
        DATE_Month: 1,
        DATE_day: 1,
        DATE_Hour: 1,
        DATE_Min: 1,
        DATE_Sec: 1,
      })
      .exec(function (err, docs) {
        document.getElementById("carDBInfoEX").style.display = "none";
        console.log(`${docs.length}`);
        //drawTable(docs);
        drawTable(docs, "display_json_data", headers);
      });
  }

  if (document.getElementById("DBIParasFindSelect").value == "MAXrpm") {
    let value = document.getElementById("enterFindValue").value;
    DB.find({ MAXrpm: value })
      .sort({
        DATE_Year: 1,
        DATE_Month: 1,
        DATE_day: 1,
        DATE_Hour: 1,
        DATE_Min: 1,
        DATE_Sec: 1,
      })
      .exec(function (err, docs) {
        document.getElementById("carDBInfoEX").style.display = "none";
        console.log(`${docs.length}`);
        //drawTable(docs);
        drawTable(docs, "display_json_data", headers);
      });
  }

  if (document.getElementById("DBIParasFindSelect").value == "DIVIDER") {
    let value = document.getElementById("enterFindValue").value;
    DB.find({ DIVIDER: value })
      .sort({
        DATE_Year: 1,
        DATE_Month: 1,
        DATE_day: 1,
        DATE_Hour: 1,
        DATE_Min: 1,
        DATE_Sec: 1,
      })
      .exec(function (err, docs) {
        document.getElementById("carDBInfoEX").style.display = "none";
        console.log(`${docs.length}`);
        //drawTable(docs);
        drawTable(docs, "display_json_data", headers);
      });
  }

  if (document.getElementById("DBIParasFindSelect").value == "REDUCEdivider") {
    let value = document.getElementById("enterFindValue").value;
    DB.find({ REDUCEdivider: value })
      .sort({
        DATE_Year: 1,
        DATE_Month: 1,
        DATE_day: 1,
        DATE_Hour: 1,
        DATE_Min: 1,
        DATE_Sec: 1,
      })
      .exec(function (err, docs) {
        document.getElementById("carDBInfoEX").style.display = "none";
        console.log(`${docs.length}`);
        //drawTable(docs);
        drawTable(docs, "display_json_data", headers);
      });
  }

  if (document.getElementById("DBIParasFindSelect").value == "CONFIG") {
    let value = document.getElementById("enterFindValue").value;
    DB.find({ CONFIG: value })
      .sort({
        DATE_Year: 1,
        DATE_Month: 1,
        DATE_day: 1,
        DATE_Hour: 1,
        DATE_Min: 1,
        DATE_Sec: 1,
      })
      .exec(function (err, docs) {
        document.getElementById("carDBInfoEX").style.display = "none";
        console.log(`${docs.length}`);
        //drawTable(docs);
        drawTable(docs, "display_json_data", headers);
      });
  }

  if (document.getElementById("DBIParasFindSelect").value == "WAITdelay") {
    let value = document.getElementById("enterFindValue").value;
    DB.find({ WAITdelay: value })
      .sort({
        DATE_Year: 1,
        DATE_Month: 1,
        DATE_day: 1,
        DATE_Hour: 1,
        DATE_Min: 1,
        DATE_Sec: 1,
      })
      .exec(function (err, docs) {
        document.getElementById("carDBInfoEX").style.display = "none";
        console.log(`${docs.length}`);
        //drawTable(docs);
        drawTable(docs, "display_json_data", headers);
      });
  }

  if (
    document.getElementById("DBIParasFindSelect").value == "SLOWmovingDelay"
  ) {
    let value = document.getElementById("enterFindValue").value;
    DB.find({ SLOWmovingDelay: value })
      .sort({
        DATE_Year: 1,
        DATE_Month: 1,
        DATE_day: 1,
        DATE_Hour: 1,
        DATE_Min: 1,
        DATE_Sec: 1,
      })
      .exec(function (err, docs) {
        document.getElementById("carDBInfoEX").style.display = "none";
        console.log(`${docs.length}`);
        //drawTable(docs);
        drawTable(docs, "display_json_data", headers);
      });
  }

  if (document.getElementById("DBIParasFindSelect").value == "VOLTthress") {
    let value = document.getElementById("enterFindValue").value;
    DB.find({ VOLTthress: value })
      .sort({
        DATE_Year: 1,
        DATE_Month: 1,
        DATE_day: 1,
        DATE_Hour: 1,
        DATE_Min: 1,
        DATE_Sec: 1,
      })
      .exec(function (err, docs) {
        document.getElementById("carDBInfoEX").style.display = "none";
        console.log(`${docs.length}`);
        //drawTable(docs);
        drawTable(docs, "display_json_data", headers);
      });
  }

  if (document.getElementById("DBIParasFindSelect").value == "N0rpmPower") {
    let value = document.getElementById("enterFindValue").value;
    DB.find({ N0rpmPower: value })
      .sort({
        DATE_Year: 1,
        DATE_Month: 1,
        DATE_day: 1,
        DATE_Hour: 1,
        DATE_Min: 1,
        DATE_Sec: 1,
      })
      .exec(function (err, docs) {
        document.getElementById("carDBInfoEX").style.display = "none";
        console.log(`${docs.length}`);
        //drawTable(docs);
        drawTable(docs, "display_json_data", headers);
      });
  }

  if (document.getElementById("DBIParasFindSelect").value == "COMMENT") {
    let value = document.getElementById("enterFindValue").value;
    DB.find({ COMMENT: value })
      .sort({
        DATE_Year: 1,
        DATE_Month: 1,
        DATE_day: 1,
        DATE_Hour: 1,
        DATE_Min: 1,
        DATE_Sec: 1,
      })
      .exec(function (err, docs) {
        document.getElementById("carDBInfoEX").style.display = "none";
        console.log(`${docs.length}`);
        drawTable(docs, "display_json_data", headers);
      });
  }
}

function drawTable(data, tableName, tabHead) {
  var headerRowHTML = "<tr>";
  for (var i = 0; i < tabHead.length; i++) {
    headerRowHTML += "<th>" + tabHead[i] + "</th>";
  }
  headerRowHTML += "</tr>";

  //Prepare all the employee records as HTML
  var allRecordsHTML = "";
  for (var i = 0; i < data.length; i++) {
    //Prepare html row
    allRecordsHTML += "<tr>";
    for (var j = 0; j < tabHead.length; j++) {
      var header = tabHead[j];
      allRecordsHTML += "<td>" + data[i][header] + "</td>";
    }
    allRecordsHTML += "</tr>";
  }

  //Append the table header and all records
  //var table=document.getElementById("display_json_data");
  var table = document.getElementById(tableName);
  table.innerHTML = headerRowHTML + allRecordsHTML;
}

let clickFlag = 0;
document.getElementById("findAllDATEInDB").addEventListener("click", () => {
  clickFlag++;
  deleteFlag = 0;
  if (clickFlag == 1) {
    let date = new Date();
    let year = date.getFullYear();
    let month = date.getMonth() + 1;
    setTimeout(() => {
      document.getElementById("enterAccessYear").value = year;
      document.getElementById("enterDeleteYear").value = year;
      document.getElementById("enterUpdateYear").value = year;

      document.getElementById("enterAccessMonth").value = month;
      document.getElementById("enterDeleteMonth").value = month;
      document.getElementById("enterUpdateMonth").value = month;
    }, 500);
  }

  let id = document.getElementById("enterAccessCarID").value;
  let year = document.getElementById("enterAccessYear").value;
  let month = document.getElementById("enterAccessMonth").value;
  let day = document.getElementById("enterAccessDay").value;
  let hour = document.getElementById("enterAccessHour").value;
  DBCarValuesFind(
    dbCarsParas,
    Number(id),
    Number(year),
    Number(month),
    Number(day),
    Number(hour)
  );
  document.getElementById("DBIParasFindSelect").value = 0;
  document.getElementById("enterFindValue").value = "";
  document.getElementById("enterAccessCarID").value = "";
});

function clearDBI(formsArr) {
  for (let i = 0; i < formsArr.length; i++) {
    document.getElementById(formsArr[i]).value = "";
    document.getElementById(formsArr[i]).style.backgroundColor = "white";
  }
}

document.getElementById("DBIGetStoredData").addEventListener("click", () => {
  DBIStoredValuesFlag = 1;
  storedValuesFlag = 0;
  clearDBI(DBIFormsVals);
  let valuesToGetSavedArrTRLT = [
    `mdata ${document.getElementById("portChooseSLCT").value} 85 32 101`,
    `mdata ${document.getElementById("portChooseSLCT").value} 85 32 21`,
    `mdata ${document.getElementById("portChooseSLCT").value} 85 32 31`,
    `mdata ${document.getElementById("portChooseSLCT").value} 85 32 41`,
    `mdata ${document.getElementById("portChooseSLCT").value} 85 32 51`,
    `mdata ${document.getElementById("portChooseSLCT").value} 85 32 61`,
    `mdata ${document.getElementById("portChooseSLCT").value} 85 32 71`,
    `mdata ${document.getElementById("portChooseSLCT").value} 85 32 81`,
    `mdata ${document.getElementById("portChooseSLCT").value} 85 32 91`,
    `mdata ${document.getElementById("portChooseSLCT").value} 85 32 110`,
    `mdata ${document.getElementById("portChooseSLCT").value} 85 32 111`,
    `mdata ${document.getElementById("portChooseSLCT").value} 85 32 112`,
    `mdata ${document.getElementById("portChooseSLCT").value} 85 32 113`,
    `mdata ${document.getElementById("portChooseSLCT").value} 85 32 14`,
    `mdata ${document.getElementById("portChooseSLCT").value} 85 32 15`,
  ];
  getDataFromCom(valuesToGetSavedArrTRLT, DBIFormsVals, 380);
});

document.getElementById("DBISaveStoredData").addEventListener("click", () => {
  DBIArr.length = 0;
  if (document.getElementById("DBIcommentTxt").value == "") {
    console.log("null");
    dialog.showMessageBoxSync({
      type: "info",
      title: "alert",
      message: "Comment is empty. Please, leave a comment!",
      detail: "All meaningless comments will be deleted! ",
    });
    document.getElementById("DBIcommentTxt").style.backgroundColor = "orange";
  }

  if (document.getElementById("DBIcommentTxt").value != "") {
    //DBIArr.push(document.getElementById('DBIparcedValuesSavedUnitAddrA').value.substr(1));
    DBIArr.push(
      document.getElementById("DBIparcedValuesSavedUnitAddr").value//.substr(1)
    );
    DBIArr.push(
      document.getElementById("DBIparcedValuesSaveddefPWR").value//.substr(1)
    );
    DBIArr.push(
      document.getElementById("DBIparcedValuesSavedminPWR").value//.substr(1)
    );
    DBIArr.push(
      document.getElementById("DBIparcedValuesSavedMINRPM").value//.substr(1)
    );
    DBIArr.push(
      document.getElementById("DBIparcedValuesSavedMAXRPM").value//.substr(1)
    );
    DBIArr.push(document.getElementById("DBIparcedValuesSavedRaizedDivider").value//.substr(1)
    );
    DBIArr.push(document.getElementById("DBIparcedValuesSavedReduceDivider").value//.substr(1)
    );
    DBIArr.push(
      document.getElementById("DBIparcedValuesSavedConfig").value//.substr(1)
    );
    DBIArr.push(
      document.getElementById("DBIparcedValuesSavedWaitDelay").value//.substr(1)
    );
    DBIArr.push(
      document.getElementById("DBIparcedValuesSavedSlowMovingDelay").value//.substr(1)
    );
    DBIArr.push(
      document.getElementById("DBIparcedValuesSavedVoltThress").value//.substr(1)
    );
    DBIArr.push(
      document.getElementById("DBIparcedValuesSavedNoRPMPWR").value//.substr(1)
    );
    DBIArr.push(
      document.getElementById("DBIparcedValuesSavedunitID").value//.substr(1)
    );
    DBIArr.push(
      document.getElementById("DBIparcedValuesSavedSoftInfo").value//.substr(1)
    );
    DBIArr.push(
      document.getElementById("DBIparcedValuesSavedPinsInfo").value//.substr(1)
    );

    let date = new Date();
    let y = date.getFullYear();
    let mon = date.getMonth() + 1;
    let d = date.getDate();
    let h = date.getHours();
    let m = date.getMinutes();
    let s = date.getSeconds();

    let comment = document.getElementById("DBIcommentTxt").value;

    DBIArr.push(`${y}`);
    DBIArr.push(`${mon}`);
    DBIArr.push(`${d}`);
    DBIArr.push(`${h}`);
    DBIArr.push(`${m}`);
    DBIArr.push(`${s}`);
    DBIArr.push(comment);

    console.log(DBIArr);
    DBCarParametersAdd(dbCarsParas, DBIArr);
    addEntry(DBIArr);
    clearDBI(DBIFormsVals);
    document.getElementById("DBIcommentTxt").value = "";
    document.getElementById("DBIcommentTxt").style.backgroundColor = "white";
  }
});

function DBCarParametersAdd(DB, values) {
  let para1 = values[0];
  let para2 = values[1];
  let para3 = values[2];
  let para4 = values[3];
  let para5 = values[4];
  let para6 = values[5];
  let para7 = values[6];
  let para8 = values[7];
  let para9 = values[8];
  let para10 = values[9];
  let para11 = values[10];
  let para12 = values[11];
  let para13 = values[12];
  let para14 = values[13];
  let para15 = values[14];
  let para16 = values[15];
  let para17 = values[16];
  let para18 = values[17];
  let para19 = values[18];
  let para20 = values[19];
  let para21 = values[20];
  let para22 = values[21];
  DB.insert({
    DATE_Year: para16,
    DATE_Month: para17,
    DATE_day: para18,
    DATE_Hour: para19,
    DATE_Min: para20,
    DATE_Sec: para21,
    ID: para13,
    UNITaddress: para1,
    SOFT: para14,
    DEFAULTpower: para2,
    MINpower: para3,
    MINrpm: para4,
    MAXrpm: para5,
    DIVIDER: para6,
    REDUCEdivider: para7,
    CONFIG: para8,
    WAITdelay: para9,
    SLOWmovingDelay: para10,
    VOLTthress: para11,
    N0rpmPower: para12,
    PINS: para15,
    COMMENT: para22,
  });
}

document.getElementById("sqlGetDataBut").addEventListener("click", () => {
  JsonData.map((values) => {
    console.log(values.Unit_address);
    dbCarsParas.insert({
      DATE_Year: values.Year,
      DATE_Month: values.Month,
      DATE_day: values.Day,
      DATE_Hour: values.hour,
      DATE_Min: values.minute,
      DATE_Sec: values.seconds,
      ID: values.ID,
      UNITaddress: values.Unit_address,
      SOFT: values.soft,
      DEFAULTpower: values.default_power,
      MINpower: values.min_power,
      MINrpm: values.min_RPM,
      MAXrpm: values.max_RPM,
      DIVIDER: values.Divider,
      REDUCEdivider: values.reduce_divider,
      CONFIG: values.config,
      WAITdelay: values.wait_delay,
      SLOWmovingDelay: values.Slow_moving_delay,
      VOLTthress: values.Volt_thress,
      N0rpmPower: values.no_RPM_power,
      PINS: values.pins,
      COMMENT: values.Comment,
    });
  });
});

document.getElementById("deleteDBIData").addEventListener("click", () => {
  deleteFlag = 1;
  let deleteID = document.getElementById("enterDeleteCarID").value;
  let deleteYear = document.getElementById("enterDeleteYear").value;
  let deleteMonth = document.getElementById("enterDeleteMonth").value;
  let deleteDay = document.getElementById("enterDeleteDay").value;
  let deleteHour = document.getElementById("enterDeleteHour").value;
  let deleteMinute = document.getElementById("enterDeleteMinute").value;
  let deleteSecond = document.getElementById("enterDeleteSecond").value;
  deleteDataFromDB(
    dbCarsParas,
    deleteID,
    deleteYear,
    deleteMonth,
    deleteDay,
    deleteHour,
    deleteMinute,
    deleteSecond
  );
});

function deleteDataFromDB(DB, id, year, month, day, hour, minute, second) {
  const rez = dialog.showMessageBoxSync({
    type: "info",
    title: "You trying to delete data!",
    message: "Sure?",
    //detail: 'Additional Information',
    cancelId: 1, // Press ESC to click the index button by default
    defaultId: 0, // The button subscript is highlighted by default
    buttons: ["OK", "Cancel"],
  });
  if (rez == 0) {
    let ids = id.toString();
    let years = year.toString();
    let months = month.toString();
    let days = day.toString();
    let hours = hour.toString();
    let minutes = minute.toString();
    let seconds = second.toString();
    DB.remove(
      {
        ID: ids,
        DATE_Year: years,
        DATE_Month: months,
        DATE_day: days,
        DATE_Hour: hours,
        DATE_Min: minutes,
        DATE_Sec: seconds,
      },
      function (err, docs) {
        console.log(`deleted: ${docs}`);
      }
    );

    document.getElementById("enterDeleteCarID").value = "";
    document.getElementById("enterDeleteDay").value = "";
    document.getElementById("enterDeleteHour").value = "";
    document.getElementById("enterDeleteMinute").value = "";
    document.getElementById("enterDeleteSecond").value = "";

    setTimeout(() => {
      //DBCarValuesFind(dbCarsParas, ids, days);
      //let para = parameter.toString();
      //let days = day.toString();
      dbCarsParas
        .find({ ID: ids, DATE_Year: years, DATE_Month: months, DATE_day: days })
        .sort({ DATE_day: 1, DATE_Hour: 1, DATE_Min: 1, DATE_Sec: 1 })
        .exec(function (err, docs) {
          console.log(`${docs.length}`);
          //drawTable(docs);
          drawTable(docs, "display_json_data");
        });
    }, 500);
  } else {
    dialog.showMessageBoxSync({
      type: "info",
      title: "alert",
      message: "Operatin cancelled!",
      detail: "",
    });
    document.getElementById("enterDeleteCarID").value = "";
    document.getElementById("enterDeleteDay").value = "";
    document.getElementById("enterDeleteHour").value = "";
    document.getElementById("enterDeleteMinute").value = "";
    document.getElementById("enterDeleteSecond").value = "";
  }
}

document.getElementById("updateStringInDBBut").addEventListener("click", () => {
  carParArr.length = 0;
  let upID = document.getElementById("enterUpdateCarID").value;
  let upYear = document.getElementById("enterUpdateYear").value; //
  let upMonth = document.getElementById("enterUpdateMonth").value; //
  let upDay = document.getElementById("enterUpdateDay").value;
  let upHour = document.getElementById("enterUpdateHour").value;
  let upMinute = document.getElementById("enterUpdateMinute").value;
  let upSecond = document.getElementById("enterUpdateSecond").value;
  let upValue = document.getElementById("enterUpdateValue").value;
  DBUpdate(
    dbCarsParas,
    upID,
    upYear,
    upMonth,
    upDay,
    upHour,
    upMinute,
    upSecond,
    upValue
  );
});

function DBUpdate(DB, id, year, month, day, hour, minute, second) {
  //year, month,
  console.log(`updating!?.`);
  let ids = id.toString();
  let years = year.toString();
  let months = month.toString();
  let days = day.toString();
  let hours = hour.toString();
  let minutes = minute.toString();
  let seconds = second.toString();

  DB.find(
    {
      ID: ids,
      DATE_Year: years,
      DATE_Month: months,
      DATE_day: days,
      DATE_Hour: hours,
      DATE_Min: minutes,
      DATE_Sec: seconds,
    },
    (err, docs) => {
      /*let selectObjUpdate = document.getElementById('enterUpdateDay');
					for(let i=0; i<docs.length; i++){

					}*/
      docs.map((values) => {
        carParArr.push(values.DATE_Year);
        carParArr.push(values.DATE_Month);
        carParArr.push(values.DATE_day);
        carParArr.push(values.DATE_Hour);
        carParArr.push(values.DATE_Min);
        carParArr.push(values.DATE_Sec);
        carParArr.push(values.ID);
        if (
          document.getElementById("DBIParasChehange").value == "UNITaddress"
        ) {
          carParArr.push(document.getElementById("enterUpdateValue").value);
        } else if (
          document.getElementById("DBIParasChehange").value != "UNITaddress"
        ) {
          carParArr.push(values.UNITaddress);
        }

        carParArr.push(values.SOFT);

        if (
          document.getElementById("DBIParasChehange").value == "DEFAULTpower"
        ) {
          carParArr.push(document.getElementById("enterUpdateValue").value);
        } else if (
          document.getElementById("DBIParasChehange").value != "DEFAULTpower"
        ) {
          carParArr.push(values.DEFAULTpower);
        }

        if (document.getElementById("DBIParasChehange").value == "MINpower") {
          carParArr.push(document.getElementById("enterUpdateValue").value);
        } else if (
          document.getElementById("DBIParasChehange").value != "MINpower"
        ) {
          carParArr.push(values.MINpower);
        }

        if (document.getElementById("DBIParasChehange").value == "MINrpm") {
          carParArr.push(document.getElementById("enterUpdateValue").value);
        } else if (
          document.getElementById("DBIParasChehange").value != "MINrpm"
        ) {
          carParArr.push(values.MINrpm);
        }

        if (document.getElementById("DBIParasChehange").value == "MAXrpm") {
          carParArr.push(document.getElementById("enterUpdateValue").value);
        } else if (
          document.getElementById("DBIParasChehange").value != "MAXrpm"
        ) {
          carParArr.push(values.MAXrpm);
        }

        if (document.getElementById("DBIParasChehange").value == "DIVIDER") {
          carParArr.push(document.getElementById("enterUpdateValue").value);
        } else if (
          document.getElementById("DBIParasChehange").value != "DIVIDER"
        ) {
          carParArr.push(values.DIVIDER);
        }

        if (
          document.getElementById("DBIParasChehange").value == "REDUCEdivider"
        ) {
          carParArr.push(document.getElementById("enterUpdateValue").value);
        } else if (
          document.getElementById("DBIParasChehange").value != "REDUCEdivider"
        ) {
          carParArr.push(values.REDUCEdivider);
        }

        if (document.getElementById("DBIParasChehange").value == "CONFIG") {
          carParArr.push(document.getElementById("enterUpdateValue").value);
        } else if (
          document.getElementById("DBIParasChehange").value != "CONFIG"
        ) {
          carParArr.push(values.CONFIG);
        }

        if (document.getElementById("DBIParasChehange").value == "WAITdelay") {
          carParArr.push(document.getElementById("enterUpdateValue").value);
        } else if (
          document.getElementById("DBIParasChehange").value != "WAITdelay"
        ) {
          carParArr.push(values.WAITdelay);
        }

        if (
          document.getElementById("DBIParasChehange").value == "SLOWmovingDelay"
        ) {
          carParArr.push(document.getElementById("enterUpdateValue").value);
        } else if (
          document.getElementById("DBIParasChehange").value != "SLOWmovingDelay"
        ) {
          carParArr.push(values.SLOWmovingDelay);
        }

        if (document.getElementById("DBIParasChehange").value == "VOLTthress") {
          carParArr.push(document.getElementById("enterUpdateValue").value);
        } else if (
          document.getElementById("DBIParasChehange").value != "VOLTthress"
        ) {
          carParArr.push(values.VOLTthress);
        }

        if (document.getElementById("DBIParasChehange").value == "N0rpmPower") {
          carParArr.push(document.getElementById("enterUpdateValue").value);
        } else if (
          document.getElementById("DBIParasChehange").value != "N0rpmPower"
        ) {
          carParArr.push(values.N0rpmPower);
        }

        if (document.getElementById("DBIParasChehange").value == "PINS") {
          carParArr.push(document.getElementById("enterUpdateValue").value);
        } else if (
          document.getElementById("DBIParasChehange").value != "PINS"
        ) {
          carParArr.push(values.PINS);
        }

        if (document.getElementById("DBIParasChehange").value == "COMMENT") {
          carParArr.push(
            document.getElementById("enterUpdateValue").value.toString()
          );
        } else if (
          document.getElementById("DBIParasChehange").value != "COMMENT"
        ) {
          carParArr.push(values.COMMENT);
        }
      });

      let newArr = carParArr.slice(0, 23);
      console.log(newArr);
      console.log(newArr.length);
      DB.update(
        {
          ID: ids,
          DATE_Year: years,
          DATE_Month: months,
          DATE_day: days,
          DATE_Hour: hours,
          DATE_Min: minutes,
          DATE_Sec: seconds,
        },
        {
          DATE_Year: newArr[0],
          DATE_Month: newArr[1],
          DATE_day: newArr[2],
          DATE_Hour: newArr[3],
          DATE_Min: newArr[4],
          DATE_Sec: newArr[5],
          ID: newArr[6],
          UNITaddress: newArr[7],
          SOFT: newArr[8],
          DEFAULTpower: newArr[9],
          MINpower: newArr[10],
          MINrpm: newArr[11],
          MAXrpm: newArr[12],
          DIVIDER: newArr[13],
          REDUCEdivider: newArr[14],
          CONFIG: newArr[15],
          WAITdelay: newArr[16],
          SLOWmovingDelay: newArr[17],
          VOLTthress: newArr[18],
          N0rpmPower: newArr[19],
          PINS: newArr[20],
          COMMENT: newArr[21],
        }
      );
    }
  );
}

document.getElementById("openAppointBlockBut").addEventListener("click", () => {
  document.getElementById("appointCarToRoute").style.display = "block";
  document.getElementById("openAppointBlockBut").hidden = true;
  document.getElementById("openExtractorBlockBut").hidden = true;
  //	document.getElementById('openEditExtractorData').hidden = true;
});

document.getElementById("cancelCarToRouteBut").addEventListener("click", () => {
  document.getElementById("appointCarToRoute").style.display = "none";
  document.getElementById("openAppointBlockBut").hidden = false;
  document.getElementById("openExtractorBlockBut").hidden = false;
  //	document.getElementById('openEditExtractorData').hidden = false;
});

document.getElementById("cancelExtractBut").addEventListener("click", () => {
  document.getElementById("DBRExtractor").style.display = "none";
  document.getElementById("openExtractorBlockBut").hidden = false;
  //	document.getElementById('openEditExtractorData').hidden = false;
});

document
  .getElementById("appointCarToRouteBut")
  .addEventListener("click", () => {
    dbRoutesFlag = 1;
    dbCarsFlag = 0;
    let route = document.getElementById("selectCarRoute").value;
    let carID = document.getElementById("appointCarID").value;
    let carPlate = document.getElementById("appointCarPlate").value;
    DBCarsAdd(DBCarsRoutes, route, carID, carPlate);
    //document.getElementById('selectCarRoute').value = '';
    document.getElementById("appointCarID").value = "";
    document.getElementById("appointCarPlate").value = "";
  });

function DBCarsAdd(DB, para1, para2, para3, para4) {
  if (dbCarsFlag == 1) {
    DB.insert({ ID: para1, NAME: para2, COLOR: para3, PLATE: para4 });
  }
  if (dbRoutesFlag == 1) {
    let date = new Date();
    let year = date.getFullYear().toString();
    let month = (date.getMonth() + 1).toString();
    let day = date.getDay().toString();
    let hour = date.getHours().toString();
    let minute = date.getMinutes().toString();
    let second = date.getSeconds().toString();
    DB.insert({
      DATE_Year: year,
      DATE_Month: month,
      DATE_day: day,
      DATE_Hour: hour,
      DATE_Min: minute,
      DATE_Sec: second,
      ROUTE: para1,
      car_ID: para2,
      car_Plate: para3,
    });
    setTimeout(() => {
      DB.find(
        { ROUTE: para1, car_ID: para2, car_Plate: para3 },
        (err, docs) => {
          console.log(docs);
        }
      );
    });
  }
}

document.getElementById("appointCarPlate").addEventListener("keyup", (evt) => {
  if (evt.keyCode === 13) {
    document.getElementById("appointCarToRouteBut").click();
  }
});

document.getElementById("enterAccessCarID").addEventListener("keyup", (evt) => {
  if (evt.keyCode === 13) {
    document.getElementById("findAllDATEInDB").click();
  }
});
//получение МЕСЯЦА
document
  .getElementById("enterUpdateCarID")
  .addEventListener("change", (evt) => {
    console.log(`value: ${document.getElementById("enterUpdateCarID").value}`);
    let updateMonthSelectObj = document.getElementById("enterUpdateMonth");
    let id = document.getElementById("enterUpdateCarID").value;
    let ids = id.toString();
    let year = document.getElementById("enterUpdateYear").value;
    let years = year.toString();
    dbCarsParas.find({ ID: ids, DATE_Year: years }, (err, docs) => {
      let arrMonth = [];
      docs.map((value) => {
        arrMonth.push(value.DATE_Month);
      });
      for (let i = 0; i < docs.length; i++) {
        updateMonthSelectObj[i] = new Option(arrMonth[i], arrMonth[i]);
      }
    });
  });

//получение ДНЯ
document.getElementById("enterUpdateDay").addEventListener("click", (evt) => {
  console.log(`value: ${document.getElementById("enterUpdateCarID").value}`);
  let updateDaySelectObj = document.getElementById("enterUpdateDay");
  let id = document.getElementById("enterUpdateCarID").value;
  let ids = id.toString();
  let year = document.getElementById("enterUpdateYear").value;
  let years = year.toString();
  let month = document.getElementById("enterUpdateMonth").value;
  let months = month.toString();
  dbCarsParas.find(
    { ID: ids, DATE_Year: years, DATE_Month: months },
    (err, docs) => {
      let arrDay = [];
      docs.map((value) => {
        arrDay.push(value.DATE_day);
      });
      for (let i = 0; i < docs.length; i++) {
        updateDaySelectObj[i] = new Option(arrDay[i], arrDay[i]);
      }
    }
  );
});
//получение ЧАСА
document.getElementById("enterUpdateHour").addEventListener("click", () => {
  let id = document.getElementById("enterUpdateCarID").value;
  let ids = id.toString();
  let year = document.getElementById("enterUpdateYear").value;
  let years = year.toString();
  let month = document.getElementById("enterUpdateMonth").value;
  let months = month.toString();
  let day = document.getElementById("enterUpdateDay").value;
  let days = day.toString();
  let updateHourSelectObj = document.getElementById("enterUpdateHour");
  dbCarsParas.find(
    { ID: ids, DATE_Year: years, DATE_Month: months, DATE_day: days },
    (err, docs) => {
      let arrHour = [];

      docs.map((value) => {
        arrHour.push(value.DATE_Hour);
        console.log(arrHour);
      });
      for (let i = 0; i < docs.length; i++) {
        updateHourSelectObj[i] = new Option(arrHour[i], arrHour[i]);
      }
    }
  );
});
//получение МИНУТЫ
document.getElementById("enterUpdateMinute").addEventListener("click", () => {
  let id = document.getElementById("enterUpdateCarID").value;
  let ids = id.toString();
  let year = document.getElementById("enterUpdateYear").value;
  let years = year.toString();
  let month = document.getElementById("enterUpdateMonth").value;
  let months = month.toString();
  let day = document.getElementById("enterUpdateDay").value;
  let days = day.toString();
  let hour = document.getElementById("enterUpdateHour").value;
  let hours = hour.toString();
  let updateMinSelectObj = document.getElementById("enterUpdateMinute");
  dbCarsParas.find(
    {
      ID: ids,
      DATE_Year: years,
      DATE_Month: months,
      DATE_day: days,
      DATE_Hour: hours,
    },
    (err, docs) => {
      let arrMin = [];
      docs.map((value) => {
        arrMin.push(value.DATE_Min);
        console.log(arrMin);
      });
      for (let i = 0; i < docs.length; i++) {
        updateMinSelectObj[i] = new Option(arrMin[i], arrMin[i]);
      }
    }
  );
});
//получение СЕКУНДЫ
document.getElementById("enterUpdateSecond").addEventListener("click", () => {
  let id = document.getElementById("enterUpdateCarID").value;
  let ids = id.toString();
  let year = document.getElementById("enterUpdateYear").value;
  let years = year.toString();
  let month = document.getElementById("enterUpdateMonth").value;
  let months = month.toString();
  let day = document.getElementById("enterUpdateDay").value;
  let days = day.toString();
  let hour = document.getElementById("enterUpdateHour").value;
  let hours = hour.toString();
  let minute = document.getElementById("enterUpdateMinute").value;
  let minutes = minute.toString();
  let updateSecSelectObj = document.getElementById("enterUpdateSecond");
  dbCarsParas.find(
    {
      ID: ids,
      DATE_Year: years,
      DATE_Month: months,
      DATE_day: days,
      DATE_Hour: hours,
      DATE_Min: minutes,
    },
    (err, docs) => {
      let arrSec = [];
      docs.map((value) => {
        arrSec.push(value.DATE_Sec);
        console.log(arrSec);
      });
      for (let i = 0; i < docs.length; i++) {
        updateSecSelectObj[i] = new Option(arrSec[i], arrSec[i]);
      }
    }
  );
});

document.getElementById("DBIParasChehange").addEventListener("change", () => {
  let id = document.getElementById("enterUpdateCarID").value;
  let ids = id.toString();
  let year = document.getElementById("enterUpdateYear").value;
  let years = year.toString();
  let month = document.getElementById("enterUpdateMonth").value;
  let months = month.toString();
  let day = document.getElementById("enterUpdateDay").value;
  let days = day.toString();
  let hour = document.getElementById("enterUpdateHour").value;
  let hours = hour.toString();
  let minute = document.getElementById("enterUpdateMinute").value;
  let minutes = minute.toString();
  let second = document.getElementById("enterUpdateSecond").value;
  let seconds = second.toString();
  dbCarsParas.find(
    {
      ID: ids,
      DATE_Year: years,
      DATE_Month: months,
      DATE_day: days,
      DATE_Hour: hours,
      DATE_Min: minutes,
      DATE_Sec: seconds,
    },
    (err, docs) => {
      docs.map((values) => {
        if (
          document.getElementById("DBIParasChehange").value == "UNITaddress"
        ) {
          document.getElementById("enterUpdateValue").value =
            values.UNITaddress;
        }
        if (
          document.getElementById("DBIParasChehange").value == "DEFAULTpower"
        ) {
          document.getElementById("enterUpdateValue").value =
            values.DEFAULTpower;
        }
        if (document.getElementById("DBIParasChehange").value == "MINpower") {
          document.getElementById("enterUpdateValue").value = values.MINpower;
        }
        if (document.getElementById("DBIParasChehange").value == "MINrpm") {
          document.getElementById("enterUpdateValue").value = values.MINrpm;
        }
        if (document.getElementById("DBIParasChehange").value == "MAXrpm") {
          document.getElementById("enterUpdateValue").value = values.MAXrpm;
        }
        if (document.getElementById("DBIParasChehange").value == "DIVIDER") {
          document.getElementById("enterUpdateValue").value = values.DIVIDER;
        }
        if (
          document.getElementById("DBIParasChehange").value == "REDUCEdivider"
        ) {
          document.getElementById("enterUpdateValue").value =
            values.REDUCEdivider;
        }
        if (document.getElementById("DBIParasChehange").value == "CONFIG") {
          document.getElementById("enterUpdateValue").value = values.CONFIG;
        }
        if (document.getElementById("DBIParasChehange").value == "WAITdelay") {
          document.getElementById("enterUpdateValue").value = values.WAITdelay;
        }
        if (
          document.getElementById("DBIParasChehange").value == "SLOWmovingDelay"
        ) {
          document.getElementById("enterUpdateValue").value =
            values.SLOWmovingDelay;
        }
        if (document.getElementById("DBIParasChehange").value == "VOLTthress") {
          document.getElementById("enterUpdateValue").value = values.VOLTthress;
        }
        if (document.getElementById("DBIParasChehange").value == "N0rpmPower") {
          document.getElementById("enterUpdateValue").value = values.N0rpmPower;
        }
        if (document.getElementById("DBIParasChehange").value == "COMMENT") {
          document.getElementById("enterUpdateValue").value = values.COMMENT;
        }
      });
    }
  );
});

document
  .getElementById("accessCarByNameForRestore")
  .addEventListener("change", (evt) => {
    //console.log(document.getElementById('accessCarByNameForRestore').value);
    let accessCarIDObj = document.getElementById("accessCarByIDForRestore");
    let name = document.getElementById("accessCarByNameForRestore").value;
    dbCars.find({ NAME: name }, (err, docs) => {
      let arrID = [];
      docs.map((values) => {
        arrID.push(values.ID);
      });
      console.log(docs);
      console.log(arrID);
      for (let i = 0; i < docs.length; i++) {
        accessCarIDObj[i] = new Option(arrID[i], arrID[i]);
      }
    });
  });

document
  .getElementById("accessCarByIDForRestore")
  .addEventListener("click", () => {
    //console.log(document.getElementById('accessCarByIDForRestore').value);
    let accessCarYearObj = document.getElementById("accessCarByYearForRestore");
    let id = document.getElementById("accessCarByIDForRestore").value;
    let ids = id.toString();
    dbCarsParas.find({ ID: ids }, (err, docs) => {
      console.log(docs);
      let arrYear = [];
      docs.map((values) => {
        arrYear.push(values.DATE_Year);
      });
      for (let i = 0; i < docs.length; i++) {
        accessCarYearObj[i] = new Option(arrYear[i], arrYear[i]);
      }
    });
  });

document
  .getElementById("accessCarByYearForRestore")
  .addEventListener("click", () => {
    let acessCarMonthObj = document.getElementById(
      "accessCarByMonthForRestore"
    );
    let id = document.getElementById("accessCarByIDForRestore").value;
    let ids = id.toString();
    let year = document.getElementById("accessCarByYearForRestore").value;
    let years = year.toString();
    dbCarsParas.find({ ID: ids, DATE_Year: years }, (err, docs) => {
      console.log(docs);
      let arrMonth = [];
      docs.map((values) => {
        arrMonth.push(values.DATE_Month);
      });
      for (let i = 0; i < docs.length; i++) {
        acessCarMonthObj[i] = new Option(arrMonth[i], arrMonth[i]);
      }
    });
  });

document
  .getElementById("accessCarByMonthForRestore")
  .addEventListener("click", () => {
    let accessCarDayObj = document.getElementById("accessCarByDayForRestore");
    let id = document.getElementById("accessCarByIDForRestore").value;
    let ids = id.toString();
    let year = document.getElementById("accessCarByYearForRestore").value;
    let years = year.toString();
    let month = document.getElementById("accessCarByMonthForRestore").value;
    let months = month.toString();
    dbCarsParas.find(
      { ID: ids, DATE_Year: years, DATE_Month: months },
      (err, docs) => {
        console.log(docs);
        let arrDay = [];
        docs.map((values) => {
          arrDay.push(values.DATE_day);
        });
        for (let i = 0; i < docs.length; i++) {
          accessCarDayObj[i] = new Option(arrDay[i], arrDay[i]);
        }
      }
    );
  });

document
  .getElementById("accessCarByDayForRestore")
  .addEventListener("click", () => {
    let accessCarHourObj = document.getElementById("accessCarByHourForRestore");
    let id = document.getElementById("accessCarByIDForRestore").value;
    let ids = id.toString();
    let year = document.getElementById("accessCarByYearForRestore").value;
    let years = year.toString();
    let month = document.getElementById("accessCarByMonthForRestore").value;
    let months = month.toString();
    let day = document.getElementById("accessCarByDayForRestore").value;
    let days = day.toString();
    dbCarsParas.find(
      { ID: ids, DATE_Year: years, DATE_Month: months, DATE_day: days },
      (err, docs) => {
        console.log(docs);
        let arrHour = [];
        docs.map((values) => {
          arrHour.push(values.DATE_Hour);
        });
        for (let i = 0; i < docs.length; i++) {
          accessCarHourObj[i] = new Option(arrHour[i], arrHour[i]);
        }
      }
    );
  });

document
  .getElementById("accessCarByHourForRestore")
  .addEventListener("click", () => {
    let accessCarMinObj = document.getElementById("accessCarByMinForRestore");
    let id = document.getElementById("accessCarByIDForRestore").value;
    let ids = id.toString();
    let year = document.getElementById("accessCarByYearForRestore").value;
    let years = year.toString();
    let month = document.getElementById("accessCarByMonthForRestore").value;
    let months = month.toString();
    let day = document.getElementById("accessCarByDayForRestore").value;
    let days = day.toString();
    let hour = document.getElementById("accessCarByHourForRestore").value;
    let hours = hour.toString();
    dbCarsParas.find(
      {
        ID: ids,
        DATE_Year: years,
        DATE_Month: months,
        DATE_day: days,
        DATE_Hour: hours,
      },
      (err, docs) => {
        console.log(docs);
        let arrMin = [];
        docs.map((values) => {
          arrMin.push(values.DATE_Min);
          //console.log(arrMin)
        });
        for (let i = 0; i < docs.length; i++) {
          accessCarMinObj[i] = new Option(arrMin[i], arrMin[i]);
        }
      }
    );
  });

document
  .getElementById("accessCarByMinForRestore")
  .addEventListener("click", () => {
    let accessCarSecObj = document.getElementById("accessCarBySecForRestore");
    let id = document.getElementById("accessCarByIDForRestore").value;
    let ids = id.toString();
    let year = document.getElementById("accessCarByYearForRestore").value;
    let years = year.toString();
    let month = document.getElementById("accessCarByMonthForRestore").value;
    let months = month.toString();
    let day = document.getElementById("accessCarByDayForRestore").value;
    let days = day.toString();
    let hour = document.getElementById("accessCarByHourForRestore").value;
    let hours = hour.toString();
    let min = document.getElementById("accessCarByMinForRestore").value;
    let mins = min.toString();
    dbCarsParas.find(
      {
        ID: ids,
        DATE_Year: years,
        DATE_Month: months,
        DATE_day: days,
        DATE_Hour: hours,
        DATE_Min: mins,
      },
      (err, docs) => {
        console.log(docs);
        let arrSec = [];
        docs.map((values) => {
          arrSec.push(values.DATE_Sec);
          //console.log(arrMin)
        });
        for (let i = 0; i < docs.length; i++) {
          accessCarSecObj[i] = new Option(arrSec[i], arrSec[i]);
        }
      }
    );
  });

document.getElementById("restoreDataBut").addEventListener("click", () => {
  let id = document.getElementById("accessCarByIDForRestore").value;
  let ids = id.toString();
  let year = document.getElementById("accessCarByYearForRestore").value;
  let years = year.toString();
  let month = document.getElementById("accessCarByMonthForRestore").value;
  let months = month.toString();
  let day = document.getElementById("accessCarByDayForRestore").value;
  let days = day.toString();
  let hour = document.getElementById("accessCarByHourForRestore").value;
  let hours = hour.toString();
  let min = document.getElementById("accessCarByMinForRestore").value;
  let mins = min.toString();
  dbCarsParas.find(
    {
      ID: ids,
      DATE_Year: years,
      DATE_Month: months,
      DATE_day: days,
      DATE_Hour: hours,
      DATE_Min: mins,
    },
    (err, docs) => {
      docs.map((values) => {
        document.getElementById("parcedValuesSendUnitAddr").value =
          values.UNITaddress;
        document.getElementById("parcedValuesSenddefPWR").value =
          values.DEFAULTpower;
        document.getElementById("parcedValuesSendminPWR").value =
          values.MINpower;
        document.getElementById("parcedValuesSendMINRPM").value = values.MINrpm;
        document.getElementById("parcedValuesSendMAXRPM").value = values.MAXrpm;
        document.getElementById("parcedValuesSendRaizedDivider").value =
          values.DIVIDER;
        document.getElementById("parcedValuesSendReduceDivider").value =
          values.REDUCEdivider;
        document.getElementById("parcedValuesSendConfig").value = values.CONFIG;
        document.getElementById("parcedValuesSendWaitDelay").value =
          values.WAITdelay;
        document.getElementById("parcedValuesSendSlowMovingDelay").value =
          values.SLOWmovingDelay;
        document.getElementById("parcedValuesSendVoltThress").value =
          values.VOLTthress;
        document.getElementById("parcedValuesSendNoRPMPWR").value =
          values.N0rpmPower;
        document.getElementById("parcedValuesSendSoftInfo").value = values.SOFT;
        document.getElementById("parcedValuesSendPinsInfo").value = values.PINS;
        document.getElementById("parcedValuesSendunitID").value = values.ID;
      });
    }
  );
});

//TAB7 - DBRoute
/*document.getElementById('findDataDBRBut').addEventListener('click', ()=>{
				let route = document.getElementById('selectCarRouteExtractor').value;
				let id = document.getElementById('extractorCarID').value;
				let ids = id.toString();
				let routes = route.toString();  
				DBCarsRoutes.find({ car_ID:ids, ROUTE:routes}, (err, docs)=>{
					console.log(docs.length)
					console.log(docs);
					drawTable(docs, "display_DBR_data", headerz);
				})
			})*/

document
  .getElementById("openExtractorBlockBut")
  .addEventListener("click", () => {
    let routesList = document.getElementById("selectCarRouteExtractor");
    let IDList = document.getElementById("extractorCarID");
    document.getElementById("DBRExtractor").style.display = "block";
    document.getElementById("openExtractorBlockBut").hidden = true;
    DBCarsRoutes.find({}, (err, docs) => {
      //console.log(docs);
      let routesArr = [];
      let IdArr = [];
      docs.map((values) => {
        routesArr.push(values.ROUTE);
        IdArr.push(values.car_ID);
      });
      for (let i = 0; i < docs.length; i++) {
        routesList[i] = new Option(routesArr[i], routesArr[i]);
      }
      for (let i = 0; i < docs.length; i++) {
        IDList[i] = new Option(IdArr[i], IdArr[i]);
      }
    });
  });

document.getElementById("findDataDBRBut").addEventListener("click", () => {
  let route = document.getElementById("selectCarRouteExtractor").value;
  let id = document.getElementById("extractorCarID").value;
  let year = document.getElementById("extractorYear").value;
  let month = document.getElementById("extractorMonth").value;
  let day = document.getElementById("extractorDay").value;
  let hour = document.getElementById("extractorHour").value;
  DBRoutesWorks(id, year, month, day, hour, route);
});

function DBRoutesWorks(id, year, month, day, hour, route) {
  let ids = id.toString();
  let years = year.toString();
  let months = month.toString();
  let days = day.toString();
  let hours = hour.toString();
  if (document.getElementById("extractorCarID").value != "") {
    DBCarsRoutes.find({ car_ID: ids }, (err, docs) => {
      drawTable(docs, "display_DBR_data", headerz);
    });
  }

  if (
    document.getElementById("extractorCarID").value != "" ||
    document.getElementById("selectCarRouteExtractor").value != ""
  ) {
    DBCarsRoutes.find({ car_ID: ids, ROUTE: route }, (err, docs) => {
      drawTable(docs, "display_DBR_data", headerz);
    });
  }
}

//TAB 8
//RIGHT-BOTTOM-LIGHT LOGIC
document
  .getElementById("rigtBottomLightCrosserStraight")
  .addEventListener("click", () => {
    document.getElementById("rigtBottomLightCrosserTurn").hidden = false;
    document.getElementById("rigtBottomLightCrosserStraight").hidden = true;
    console.log(`right bottom cross turned right!`);
    //MyCOMPort.write('roset' + ' ' + 1 + '\r\n', () => {})
    routeSet(2, 1);
  });

document
  .getElementById("rigtBottomLightCrosserTurn")
  .addEventListener("click", () => {
    document.getElementById("rigtBottomLightCrosserTurn").hidden = true;
    document.getElementById("rigtBottomLightCrosserStraight").hidden = false;
    console.log(`right bottom cross became stright!`);
    //MyCOMPort.write('roset' + ' ' + 0 + '\r\n', () => {})
    routeSet(2, 0);
  });

document
  .getElementById("RightBottomLamp")
  .addEventListener("contextmenu", () => {
    document.getElementById("RightBottomLampContextMenu").style.display =
      "block";
  });

document
  .getElementById("RightBottomLampContextMenuRadioRED")
  .addEventListener("click", () => {
    document.getElementById("RightBottomLamp").style.backgroundColor =
      document.getElementById("RightBottomLampContextMenuRadioRED").value;
    //MyCOMPort.write('jligs' + ' ' + 4 + '\r\n', () => {})
    lampControl(2, 4);
  });

document
  .getElementById("RightBottomLampContextMenuRadioORANGE")
  .addEventListener("click", () => {
    document.getElementById("RightBottomLamp").style.backgroundColor =
      document.getElementById("RightBottomLampContextMenuRadioORANGE").value;
    //MyCOMPort.write('jligs' + ' ' + 2 + '\r\n', () => {})
    lampControl(2, 2);
  });

document
  .getElementById("RightBottomLampContextMenuRadioGREEN")
  .addEventListener("click", () => {
    document.getElementById("RightBottomLamp").style.backgroundColor =
      document.getElementById("RightBottomLampContextMenuRadioGREEN").value;
    //MyCOMPort.write('jligs' + ' ' + 1 + '\r\n', () => {})
    lampControl(2, 1);
  });

document
  .getElementById("RightBottomLampContextMenuRadioOFF")
  .addEventListener("click", () => {
    lampControl(2, 0);
    document.getElementById("RightBottomLamp").style.backgroundColor =
      document.getElementById("RightBottomLampContextMenuRadioOFF").value;
  });

document
  .getElementById("CLOSERightBottomLampContextMenuBut")
  .addEventListener("click", () => {
    document.getElementById("RightBottomLampContextMenu").style.display =
      "none";
  });

//LEFT-BOTTOM-LIGHT LOGIC
document
  .getElementById("leftBottomLightCrosserStraight")
  .addEventListener("click", () => {
    document.getElementById("leftBottomLightCrosserTurn").hidden = false;
    document.getElementById("leftBottomLightCrosserStraight").hidden = true;
    routeSet(3, 1);
    console.log(`left bottom cross turned right!`);
  });

document
  .getElementById("leftBottomLightCrosserTurn")
  .addEventListener("click", () => {
    document.getElementById("leftBottomLightCrosserTurn").hidden = true;
    document.getElementById("leftBottomLightCrosserStraight").hidden = false;
    routeSet(3, 0);
    console.log(`left bottom cross became stright!`);
  });

document
  .getElementById("LeftBottomLamp")
  .addEventListener("contextmenu", () => {
    document.getElementById("LeftBottomLampContextMenu").style.display =
      "block";
  });

document
  .getElementById("CLOSELeftBottomLampContextMenu")
  .addEventListener("click", () => {
    document.getElementById("LeftBottomLampContextMenu").style.display = "none";
  });

document
  .getElementById("LeftBottomLampContextMenuRadioRED")
  .addEventListener("click", () => {
    document.getElementById("LeftBottomLamp").style.backgroundColor =
      document.getElementById("LeftBottomLampContextMenuRadioRED").value;
    //MyCOMPort.write('jligs' + ' ' + 32 + '\r\n', () => {})
    lampControl(3, 4);
  });

document
  .getElementById("LeftBottomLampContextMenuRadioORANGE")
  .addEventListener("click", () => {
    document.getElementById("LeftBottomLamp").style.backgroundColor =
      document.getElementById("LeftBottomLampContextMenuRadioORANGE").value;
    //MyCOMPort.write('jligs' + ' ' + 16 + '\r\n', () => {})
    lampControl(3, 2);
  });

document
  .getElementById("LeftBottomLampContextMenuRadioGREEN")
  .addEventListener("click", () => {
    document.getElementById("LeftBottomLamp").style.backgroundColor =
      document.getElementById("LeftBottomLampContextMenuRadioGREEN").value;
    //MyCOMPort.write('jligs' + ' ' + 8 + '\r\n', () => {})
    lampControl(3, 1);
  });

document
  .getElementById("LeftBottomLampContextMenuRadioOFF")
  .addEventListener("click", () => {
    lampControl(3, 0);
    document.getElementById("LeftBottomLamp").style.backgroundColor =
      document.getElementById("LeftBottomLampContextMenuRadioOFF").value;
  });

//LEFT-TOP-LIGHT LOGIC
document
  .getElementById("leftTopLightCrosserStraight")
  .addEventListener("click", () => {
    document.getElementById("leftTopLightCrosserTurn").hidden = false;
    document.getElementById("leftTopLightCrosserStraight").hidden = true;
    routeSet(0, 1);
    console.log(`left top cross turned right!`);
  });

document
  .getElementById("leftTopLightCrosserTurn")
  .addEventListener("click", () => {
    document.getElementById("leftTopLightCrosserTurn").hidden = true;
    document.getElementById("leftTopLightCrosserStraight").hidden = false;
    routeSet(0, 0);
    console.log(`left top cross became stright!`);
  });

document.getElementById("LeftTopLamp").addEventListener("click", () => {});

document.getElementById("LeftTopLamp").addEventListener("contextmenu", () => {
  document.getElementById("LeftTopLampContextMenu").style.display = "block";
});

document
  .getElementById("CLOSELeftTopLampContextMenu")
  .addEventListener("click", () => {
    document.getElementById("LeftTopLampContextMenu").style.display = "none";
  });

document
  .getElementById("LeftTopLampContextMenuRadioRED")
  .addEventListener("click", () => {
    document.getElementById("LeftTopLamp").style.backgroundColor =
      document.getElementById("LeftTopLampContextMenuRadioRED").value;
    //MyCOMPort.write('jligs' + ' ' + 256 + '\r\n', () => {})
    lampControl(0, 4);
  });

document
  .getElementById("LeftTopLampContextMenuRadioORANGE")
  .addEventListener("click", () => {
    document.getElementById("LeftTopLamp").style.backgroundColor =
      document.getElementById("LeftTopLampContextMenuRadioORANGE").value;
    //MyCOMPort.write('jligs' + ' ' + 128 + '\r\n', () => {})
    lampControl(0, 2);
  });

document
  .getElementById("LeftTopLampContextMenuRadioGREEN")
  .addEventListener("click", () => {
    document.getElementById("LeftTopLamp").style.backgroundColor =
      document.getElementById("LeftTopLampContextMenuRadioGREEN").value;
    //MyCOMPort.write('jligs' + ' ' + 64 + '\r\n', () => {})
    lampControl(0, 1);
  });

document
  .getElementById("LeftTopLampContextMenuRadioOFF")
  .addEventListener("click", () => {
    lampControl(0, 0);
    document.getElementById("LeftTopLamp").style.backgroundColor =
      document.getElementById("LeftTopLampContextMenuRadioOFF").value;
  });

//RIGHT-TOP-LIGHT LOGIC
document
  .getElementById("rightTopLightCrosserStraight")
  .addEventListener("click", () => {
    document.getElementById("rightTopightCrosserTurn").hidden = false;
    document.getElementById("rightTopLightCrosserStraight").hidden = true;
    routeSet(1, 1);
    console.log(`right top cross turned right!`);
  });

document
  .getElementById("rightTopightCrosserTurn")
  .addEventListener("click", () => {
    document.getElementById("rightTopightCrosserTurn").hidden = true;
    document.getElementById("rightTopLightCrosserStraight").hidden = false;
    routeSet(1, 0);
    console.log(`right top cross became stright!`);
  });

document.getElementById("RightTopLamp").addEventListener("contextmenu", () => {
  document.getElementById("RightTopLampContextMenu").style.display = "block";
});

document
  .getElementById("CLOSERightTopLampContextMenu")
  .addEventListener("click", () => {
    document.getElementById("RightTopLampContextMenu").style.display = "none";
  });

document
  .getElementById("RightTopLampContextMenuRadioRED")
  .addEventListener("click", () => {
    document.getElementById("RightTopLamp").style.backgroundColor =
      document.getElementById("RightTopLampContextMenuRadioRED").value;
    //MyCOMPort.write('jligs' + ' ' + 2048 + '\r\n', () => {})
    lampControl(1, 4);
  });

document
  .getElementById("RightTopLampContextMenuRadioORANGE")
  .addEventListener("click", () => {
    document.getElementById("RightTopLamp").style.backgroundColor =
      document.getElementById("RightTopLampContextMenuRadioORANGE").value;
    //MyCOMPort.write('jligs' + ' ' + 1024 + '\r\n', () => {})
    lampControl(1, 2);
  });

document
  .getElementById("RightTopLampContextMenuRadioGREEN")
  .addEventListener("click", () => {
    document.getElementById("RightTopLamp").style.backgroundColor =
      document.getElementById("RightTopLampContextMenuRadioGREEN").value;
    //MyCOMPort.write('jligs' + ' ' + 512 + '\r\n', () => {})
    lampControl(1, 1);
  });

document
  .getElementById("RightTopLampContextMenuRadioOFF")
  .addEventListener("click", () => {
    lampControl(1, 0);
    document.getElementById("RightTopLamp").style.backgroundColor =
      document.getElementById("RightTopLampContextMenuRadioOFF").value;
  });

//CONTROL MENU RIGHT-BOTTOM

document.getElementById("RightBottomLamp").addEventListener("click", () => {
  //MyCOMPort.write('jligs' + ' ' + 0 + '\r\n', () => {});
  lampControls(0);
  document.getElementById("RightBottomLamp").style.backgroundColor = "grey";
});

document
  .getElementById("rigtBottomLightTransmitterBut")
  .addEventListener("click", () => {
    //открывает меню управления RIGHT-BOTTOM
    console.log(`click`);
    document.getElementById("RightBottomControlMenu").style.display = "block";
  });

document
  .getElementById("CLOSERightBottomControlMenuBut")
  .addEventListener("click", () => {
    //закрывает меню управления RIGHT-BOTTOM
    document.getElementById("RightBottomControlMenu").style.display = "none";
  });
//START BLOCK RIGHT-BOTTOM
document
  .getElementById("OPENstartCommMenuRightBottomControlMenu")
  .addEventListener("click", () => {
    //кнопка START
    document.getElementById(
      "startCommMenuRightBottomControlMenu"
    ).style.display = "block";
    document.getElementById(
      "ParametersCommMenuRightBottomControlMenu"
    ).style.display = "none";
    document.getElementById(
      "stopCommMenuRightBottomControlMenu"
    ).style.display = "none";
  });

document
  .getElementById("start12CommRightBottomControlMenu")
  .addEventListener("click", () => {
    //кнопка start12
    //document.getElementById('startCommMenuRightBottomControlMenu').style.display = 'none';
    commandGenerator(12, " ");
    startCommWorksRightBottom();
    //MyCOMPort.write('jligs' + ' ' + 1 + '\r\n', () => {});
    lampControls(1);
  });

document
  .getElementById("start14CommRightBottomControlMenu")
  .addEventListener("click", () => {
    //кнопка start14
    //document.getElementById('startCommMenuRightBottomControlMenu').style.display = 'none';
    commandGenerator(14, " ");
    startCommWorksRightBottom();
    //MyCOMPort.write('jligs' + ' ' + 1 + '\r\n', () => {});
    lampControls(1);
  });
//STOP BLOCK RIGHT-BOTTOM
document
  .getElementById("OPENstopCommMenuRightBottomControlMenu")
  .addEventListener("click", () => {
    //кнопка STOP
    document.getElementById(
      "stopCommMenuRightBottomControlMenu"
    ).style.display = "block";
    document.getElementById(
      "startCommMenuRightBottomControlMenu"
    ).style.display = "none";
    document.getElementById(
      "ParametersCommMenuRightBottomControlMenu"
    ).style.display = "none";
  });

document
  .getElementById("stop13CommRightBottomControlMenu")
  .addEventListener("click", () => {
    //кнопка stop13
    document.getElementById(
      "stopCommMenuRightBottomControlMenu"
    ).style.display = "none";
    commandGenerator(13, " ");
    stopCommWorksRightBottom();
    //MyCOMPort.write('jligs' + ' ' + 4 + '\r\n', () => {});
    lampControls(4);
  });

document
  .getElementById("stop15CommRightBottomControlMenu")
  .addEventListener("click", () => {
    //кнопка stop15
    document.getElementById(
      "stopCommMenuRightBottomControlMenu"
    ).style.display = "none";
    commandGenerator(15, " ");
    stopCommWorksRightBottom();
    //MyCOMPort.write('jligs' + ' ' + 4 + '\r\n', () => {});
    lampControls(4);
  });

document
  .getElementById("stop16CommRightBottomControlMenu")
  .addEventListener("click", () => {
    //кнопка stop16
    document.getElementById(
      "stopCommMenuRightBottomControlMenu"
    ).style.display = "none";
    commandGenerator(16, " ");
    stopCommWorksRightBottom();
    //MyCOMPort.write('jligs' + ' ' + 4 + '\r\n', () => {});
    lampControls(4);
  });

document
  .getElementById("fullStopCommRightBottomControlMenu")
  .addEventListener("click", () => {
    document.getElementById(
      "stopCommMenuRightBottomControlMenu"
    ).style.display = "none";
    MyCOMPort.write("mtrans" + 0 + 85 + 13 + "\r\n", () => {});
    setTimeout(() => {
      MyCOMPort.write("mreq" + "\r\n", () => {});
    }, 350);
    setTimeout(() => {
      MyCOMPort.write("mreq" + "\r\n", () => {});
    }, 2350);
  });
//PARAMETERS BLOCK RIGHT-BOTTOM
let openWinCounterparametersCommMenuRightBottomControlMenu = 0;
document
  .getElementById("OPENparametersCommMenuRightBottomControlMenu")
  .addEventListener("click", () => {
    //кнопка PARAMETER
    openWinCounterparametersCommMenuRightBottomControlMenu++;
    if (openWinCounterparametersCommMenuRightBottomControlMenu % 2 != 0) {
      document.getElementById(
        "ParametersCommMenuRightBottomControlMenu"
      ).style.display = "block";
    } else {
      document.getElementById(
        "ParametersCommMenuRightBottomControlMenu"
      ).style.display = "none";
    }
    document.getElementById(
      "stopCommMenuRightBottomControlMenu"
    ).style.display = "none";
    document.getElementById(
      "startCommMenuRightBottomControlMenu"
    ).style.display = "none";
  });

let parameter101CommMenuRightBottomControlMenuFLAG = 0;
document
  .getElementById("parameter101CommMenuRightBottomControlMenu")
  .addEventListener("click", () => {
    //кнопка parameter 101
    parameter101CommMenuRightBottomControlMenuFLAG = 1;
    commandGenerator("101", " ");
    paramsCommMenuRightBottomControlMenu();
    //MyCOMPort.write('jligs' + ' ' + 2 + '\r\n', () => {});
    lampControls(2);
  });

let parameter102CommMenuRightBottomControlMenuFLAG = 0;
document
  .getElementById("parameter102CommMenuRightBottomControlMenu")
  .addEventListener("click", () => {
    //кнопка parameter 102
    parameter102CommMenuRightBottomControlMenuFLAG = 1;
    commandGenerator("102", " ");
    paramsCommMenuRightBottomControlMenu();
    //MyCOMPort.write('jligs' + ' ' + 2 + '\r\n', () => {});
    lampControls(2);
  });

let parameter103CommMenuRightBottomControlMenuFLAG = 0;
document
  .getElementById("parameter103CommMenuRightBottomControlMenu")
  .addEventListener("click", () => {
    //кнопка parameter 103
    parameter103CommMenuRightBottomControlMenuFLAG = 1;
    commandGenerator("103", " ");
    paramsCommMenuRightBottomControlMenu();
    //MyCOMPort.write('jligs' + ' ' + 2 + '\r\n', () => {});
    lampControls(2);
  });

//CONTROL MENU LEFT-BOTTOM
document
  .getElementById("leftBottomTransmitterBut")
  .addEventListener("click", () => {
    //открывает меню управления LEFT-BOTTOM
    console.log(`click`);
    document.getElementById("LeftBottomControlMenu").style.display = "block";
  });

document
  .getElementById("CLOSELeftBottomControlMenuBut")
  .addEventListener("click", () => {
    //закрывает меню управления LEFT-BOTTOM
    document.getElementById("LeftBottomControlMenu").style.display = "none";
  });
//START BLOCK LEFT-BOTTOM

document.getElementById("LeftBottomLamp").addEventListener("click", () => {
  //MyCOMPort.write('jligs' + ' ' + 0 + '\r\n', () => {});
  lampControls(0);
  document.getElementById("LeftBottomLamp").style.backgroundColor = "grey";
});

document
  .getElementById("OPENstartCommLeftBottomControlMenu")
  .addEventListener("click", () => {
    //кнопка START LEFT-BOTTOM
    document.getElementById("startCommLeftBottomControlMenu").style.display =
      "block";
    openCloseMenus("startCommLeftBottomControlMenu", "block");
    openCloseMenus("ParametersCommMenuLeftBottomControlMenu", "none");
    openCloseMenus("stopCommMenuLeftBottomControlMenu", "none");
  });

document
  .getElementById("start12CommLeftBottomControlMenu")
  .addEventListener("click", () => {
    //кнопка start12 LEFT-BOTTOM
    commandGenerator(12, " ");
    startCommWorksLeftBottom();
    //MyCOMPort.write('jligs' + ' ' + 8 + '\r\n', () => {});
    lampControls(8);
  });

document
  .getElementById("start14CommLeftBottomControlMenu")
  .addEventListener("click", () => {
    //кнопка start12 LEFT-BOTTOM
    commandGenerator(14, " ");
    startCommWorksLeftBottom();
    //MyCOMPort.write('jligs' + ' ' + 8 + '\r\n', () => {});
    lampControls(8);
  });

//STOP BLOCK LEFT-BOTTOM
document
  .getElementById("OPENstopCommMenuLeftBottomControlMenu")
  .addEventListener("click", () => {
    //кнопка STOP LEFT-BOTTOM
    openCloseMenus("stopCommMenuLeftBottomControlMenu", "block");
    openCloseMenus("startCommLeftBottomControlMenu", "none");
    openCloseMenus("ParametersCommMenuLeftBottomControlMenu", "none");
    //openCloseMenus('stopCommMenuLeftBottomControlMenu', 'none');
  });

document
  .getElementById("stop13CommLeftBottomControlMenu")
  .addEventListener("click", () => {
    //кнопка stop13 LEFT-BOTTOM
    commandGenerator(13, " ");
    stopCommWorksLeftBottom();
    openCloseMenus("stopCommMenuLeftBottomControlMenu", "none");
    //MyCOMPort.write('jligs' + ' ' + 32 + '\r\n', () => {});
    lampControls(32);
  });

document
  .getElementById("stop15CommLeftBottomControlMenu")
  .addEventListener("click", () => {
    //кнопка stop15 LEFT-BOTTOM
    commandGenerator(15, " ");
    stopCommWorksLeftBottom();
    openCloseMenus("stopCommMenuLeftBottomControlMenu", "none");
    //MyCOMPort.write('jligs' + ' ' + 32 + '\r\n', () => {});
    lampControls(32);
  });

document
  .getElementById("stop16CommLeftBottomControlMenu")
  .addEventListener("click", () => {
    //кнопка stop16 LEFT-BOTTOM
    commandGenerator(16, " ");
    stopCommWorksLeftBottom();
    openCloseMenus("stopCommMenuLeftBottomControlMenu", "none");
    //MyCOMPort.write('jligs' + ' ' + 32 + '\r\n', () => {});
    lampControls(32);
  });
//PARAMETERS BLOCK LEFT-BOTTOM
let openCloseLiftBottomFLAG = 0;
document
  .getElementById("OPENparametersCommMenuLeftBottomControlMenu")
  .addEventListener("click", () => {
    openCloseLiftBottomFLAG++;
    if (openCloseLiftBottomFLAG % 2 != 0) {
      openCloseMenus("ParametersCommMenuLeftBottomControlMenu", "block");
    } else {
      openCloseMenus("ParametersCommMenuLeftBottomControlMenu", "none");
    }
    openCloseMenus("startCommLeftBottomControlMenu", "none");
    openCloseMenus("stopCommMenuLeftBottomControlMenu", "none");
  });

let parameter101CommMenuLeftBottomControlMenuFLAG = 0;
document
  .getElementById("parameter101CommMenuLeftBottomControlMenu")
  .addEventListener("click", () => {
    parameter101CommMenuLeftBottomControlMenuFLAG = 1;
    commandGenerator("101", " ");
    paramsCommMenuLeftBottomMenu();
    //MyCOMPort.write('jligs' + ' ' + 16 + '\r\n', () => {});
    lampControls(16);
  });

let parameter102CommMenuLeftBottomControlMenuFLAG = 0;
document
  .getElementById("parameter102CommMenuLeftBottomControlMenu")
  .addEventListener("click", () => {
    parameter102CommMenuLeftBottomControlMenuFLAG = 1;
    commandGenerator("102", " ");
    paramsCommMenuLeftBottomMenu();
    //MyCOMPort.write('jligs' + ' ' + 16 + '\r\n', () => {});
    lampControls(16);
  });

let parameter103CommMenuLeftBottomControlMenuFLAG = 0;
document
  .getElementById("parameter103CommMenuLeftBottomControlMenu")
  .addEventListener("click", () => {
    parameter103CommMenuLeftBottomControlMenuFLAG = 1;
    commandGenerator("103", " ");
    paramsCommMenuLeftBottomMenu();
    //MyCOMPort.write('jligs' + ' ' + 16 + '\r\n', () => {});
    lampControls(16);
  });
//CONTROL MENU LEFT-TOP

document.getElementById("LeftTopLamp").addEventListener("click", () => {
  MyCOMPort.write("jligs" + " " + 0 + "\r\n", () => {});
  document.getElementById("LeftTopLamp").style.backgroundColor = "grey";
});

document
  .getElementById("leftTopTransmitterBut")
  .addEventListener("click", () => {
    openCloseMenus("LeftTopControlMenu", "block");
  });

document
  .getElementById("CLOSELeftTopControlMenuBut")
  .addEventListener("click", () => {
    openCloseMenus("LeftTopControlMenu", "none");
  });
//START BLOCK LEFT-TOP
document
  .getElementById("OPENstartCommLeftTopControlMenu")
  .addEventListener("click", () => {
    openCloseMenus("startCommLeftTopControlMenu", "block");
    openCloseMenus("stopCommMenuLeftTopControlMenu", "none");
    openCloseMenus("ParametersCommMenuLeftTopControlMenu", "none");
  });

document
  .getElementById("start12CommLeftTopControlMenu")
  .addEventListener("click", () => {
    commandGenerator("12", " ");
    startCommWorksLeftTop();
    //MyCOMPort.write('jligs' + ' ' + 64 + '\r\n', () => {});
    lampControls(64);
  });

document
  .getElementById("start14CommLeftTopControlMenu")
  .addEventListener("click", () => {
    commandGenerator("14", " ");
    startCommWorksLeftTop();
    //MyCOMPort.write('jligs' + ' ' + 64 + '\r\n', () => {});
    lampControls(64);
  });
//STOP BLOCK LEFT-TOP
document
  .getElementById("OPENstopCommMenuLeftTopControlMenu")
  .addEventListener("click", () => {
    openCloseMenus("stopCommMenuLeftTopControlMenu", "block");
    openCloseMenus("startCommLeftTopControlMenu", "none");
    openCloseMenus("ParametersCommMenuLeftTopControlMenu", "none");
  });

document
  .getElementById("stop13CommLeftTopControlMenu")
  .addEventListener("click", () => {
    commandGenerator("13", " ");
    stopCommWorksLeftTop();
    //MyCOMPort.write('jligs' + ' ' +  256 + '\r\n', () => {});
    lampControls(256);
  });

document
  .getElementById("stop15CommLeftTopControlMenu")
  .addEventListener("click", () => {
    commandGenerator("15", " ");
    stopCommWorksLeftTop();
    //MyCOMPort.write('jligs' + ' ' +  256 + '\r\n', () => {});
    lampControls(256);
  });

document
  .getElementById("stop16CommLeftTopControlMenu")
  .addEventListener("click", () => {
    commandGenerator("16", " ");
    stopCommWorksLeftTop();
    //MyCOMPort.write('jligs' + ' ' +  256 + '\r\n', () => {});
    lampControls(256);
  });

//PARAMETERS BLOCK LEFT-TOP
let openCloseLeftTopFLAG = 0;
document
  .getElementById("OPENparametersCommMenuLeftTopControlMenu")
  .addEventListener("click", () => {
    openCloseLeftTopFLAG++;
    if (openCloseLeftTopFLAG % 2 != 0) {
      openCloseMenus("ParametersCommMenuLeftTopControlMenu", "block");
    } else {
      openCloseMenus("ParametersCommMenuLeftTopControlMenu", "none");
    }
    openCloseMenus("startCommLeftTopControlMenu", "none");
    openCloseMenus("stopCommMenuLeftTopControlMenu", "none");
  });

let parameter101CommMenuLeftTopControlMenuFLAG = 0;
document
  .getElementById("parameter101CommMenuLeftTopControlMenu")
  .addEventListener("click", () => {
    parameter101CommMenuLeftTopControlMenuFLAG = 1;
    commandGenerator("101", " ");
    paramsCommMenuLeftTopMenu();
    //MyCOMPort.write('jligs' + ' ' +  128 + '\r\n', () => {});
    lampControls(128);
  });

let parameter102CommMenuLeftTopControlMenuFLAG = 0;
document
  .getElementById("parameter102CommMenuLeftTopControlMenu")
  .addEventListener("click", () => {
    parameter102CommMenuLeftTopControlMenuFLAG = 1;
    commandGenerator("102", " ");
    paramsCommMenuLeftTopMenu();
    //MyCOMPort.write('jligs' + ' ' +  128 + '\r\n', () => {});
    lampControls(128);
  });

let parameter103CommMenuLeftTopControlMenuFLAG = 0;
document
  .getElementById("parameter103CommMenuLeftTopControlMenu")
  .addEventListener("click", () => {
    parameter103CommMenuLeftTopControlMenuFLAG = 1;
    commandGenerator("103", " ");
    paramsCommMenuLeftTopMenu();
    //MyCOMPort.write('jligs' + ' ' +  128 + '\r\n', () => {});
    lampControls(128);
  });

//CONTROL MENU RIGHT-TOP

document.getElementById("RightTopLamp").addEventListener("click", () => {
  MyCOMPort.write("jligs" + " " + 0 + "\r\n", () => {});
  document.getElementById("RightTopLamp").style.backgroundColor = "grey";
});

document
  .getElementById("rightTopTransmitterBut")
  .addEventListener("click", () => {
    openCloseMenus("RightTopControlMenu", "block");
  });

document
  .getElementById("CLOSERightTopControlMenuBut")
  .addEventListener("click", () => {
    openCloseMenus("RightTopControlMenu", "none");
  });
//START BLOCK RIGHT-TOP
document
  .getElementById("OPENstartCommRightTopControlMenu")
  .addEventListener("click", () => {
    //commandGenerator('12', " ");
    openCloseMenus("startCommRightTopControlMenu", "block");
    openCloseMenus("stopCommMenuRightTopControlMenu", "none");
    openCloseMenus("ParametersCommMenuRightTopControlMenu", "none");
  });

document
  .getElementById("start12CommRightTopControlMenu")
  .addEventListener("click", () => {
    commandGenerator("12", " ");
    startCommWorksRightTop();
    //MyCOMPort.write('jligs' + ' ' + 512 + '\r\n', () => {});
    lampControls(512);
  });

document
  .getElementById("start14CommRightTopControlMenu")
  .addEventListener("click", () => {
    commandGenerator("14", " ");
    startCommWorksRightTop();
    //MyCOMPort.write('jligs' + ' ' + 512 + '\r\n', () => {})
    lampControls(512);
  });
//STOP BLOCK RIGHT-TOP
document
  .getElementById("OPENstopCommMenuRightTopControlMenu")
  .addEventListener("click", () => {
    openCloseMenus("stopCommMenuRightTopControlMenu", "block");
    openCloseMenus("startCommRightTopControlMenu", "none");
    openCloseMenus("ParametersCommMenuRightTopControlMenu", "none");
  });

document
  .getElementById("stop13CommRightTopControlMenu")
  .addEventListener("click", () => {
    commandGenerator("13", " ");
    stopCommWorksRightTop();
    //MyCOMPort.write('jligs' + ' ' + 2048 + '\r\n', () => {})
    lampControls(2048);
  });

document
  .getElementById("stop15CommRightTopControlMenu")
  .addEventListener("click", () => {
    commandGenerator("15", " ");
    stopCommWorksRightTop();
    //MyCOMPort.write('jligs' + ' ' + 2048 + '\r\n', () => {})
    lampControls(2048);
  });

document
  .getElementById("stop16CommRightTopControlMenu")
  .addEventListener("click", () => {
    commandGenerator("16", " ");
    stopCommWorksRightTop();
    //MyCOMPort.write('jligs' + ' ' + 2048 + '\r\n', () => {})
    lampControls(2048);
  });
//PARAMETERS BLOCK RIGHT-TOP
let openCloseRightTopFLAG = 0;
document
  .getElementById("OPENparametersCommMenuRightTopControlMenu")
  .addEventListener("click", () => {
    openCloseRightTopFLAG++;
    if (openCloseRightTopFLAG % 2 != 0) {
      openCloseMenus("ParametersCommMenuRightTopControlMenu", "block");
    } else {
      openCloseMenus("ParametersCommMenuRightTopControlMenu", "none");
    }
    openCloseMenus("startCommRightTopControlMenu", "none");
    openCloseMenus("stopCommMenuRightTopControlMenu", "none");
  });

let parameter101CommMenuRightTopControlMenuFLAG = 0;
document
  .getElementById("parameter101CommMenuRightTopControlMenu")
  .addEventListener("click", () => {
    parameter101CommMenuRightTopControlMenuFLAG = 1;
    commandGenerator("101", " ");
    paramsCOmmMenuRightTop();
    //MyCOMPort.write('jligs' + ' ' + 1024 + '\r\n', () => {})
    lampControls(1024);
  });

let parameter102CommMenuRightTopControlMenuFLAG = 0;
document
  .getElementById("parameter102CommMenuRightTopControlMenu")
  .addEventListener("click", () => {
    parameter102CommMenuRightTopControlMenuFLAG = 1;
    commandGenerator("102", " ");
    paramsCOmmMenuRightTop();
    //MyCOMPort.write('jligs' + ' ' + 1024 + '\r\n', () => {})
    lampControls(1024);
  });

let parameter103CommMenuRightTopControlMenuFLAG = 0;
document
  .getElementById("parameter103CommMenuRightTopControlMenu")
  .addEventListener("click", () => {
    parameter103CommMenuRightTopControlMenuFLAG = 1;
    commandGenerator("103", " ");
    paramsCOmmMenuRightTop();
    //MyCOMPort.write('jligs' + ' ' + 1024 + '\r\n', () => {})
    lampControls(1024);
  });

function paramsCOmmMenuRightTop() {
  //параметры справа-верх
  document.getElementById("ParametersCommMenuRightTopControlMenuTXT").value =
    "";
  document.getElementById("RightTopLamp").style.backgroundColor = "orange";
  setTimeout(() => {
    console.log(portParser(myMsgWord));
    if (parameter101CommMenuRightTopControlMenuFLAG == 1) {
      document.getElementById(
        "ParametersCommMenuRightTopControlMenuTXT"
      ).value = "engine power: " + portParser(myMsgWord);
      parameter101CommMenuRightTopControlMenuFLAG = 0;
    }

    if (parameter102CommMenuRightTopControlMenuFLAG == 1) {
      document.getElementById(
        "ParametersCommMenuRightTopControlMenuTXT"
      ).value = "volt thr : " + portParser(myMsgWord);
      parameter102CommMenuRightTopControlMenuFLAG = 0;
    }

    if (parameter103CommMenuRightTopControlMenuFLAG == 1) {
      let parcedChainOne = myMsgWord.slice(
        myMsgWord.indexOf("data") + 4,
        myMsgWord.length
      );
      console.log(parcedChainOne);
      document.getElementById(
        "ParametersCommMenuRightTopControlMenuTXT"
      ).value = `byte 1 ${parcedChainOne}`;
      setTimeout(() => {
        let parcedChainTwo = myMsgWord.slice(
          myMsgWord.indexOf("data") + 4,
          myMsgWord.length
        );
        console.log(parcedChainTwo);
        document.getElementById(
          "ParametersCommMenuRightTopControlMenuTXT"
        ).value += `byte 2 ${parcedChainTwo}`;
      }, 500);
      parameter103CommMenuRightTopControlMenuFLAG = 0;
    }
  }, 380);
}

function paramsCommMenuLeftTopMenu() {
  //параметры слева-верх
  document.getElementById("ParametersCommMenuLeftTopControlMenuTXT").value = "";
  document.getElementById("LeftTopLamp").style.backgroundColor = "orange";
  setTimeout(() => {
    console.log(portParser(myMsgWord));
    if (parameter101CommMenuLeftTopControlMenuFLAG == 1) {
      document.getElementById("ParametersCommMenuLeftTopControlMenuTXT").value =
        "engine power: " + portParser(myMsgWord);
      parameter101CommMenuLeftTopControlMenuFLAG = 0;
    }

    if (parameter102CommMenuLeftTopControlMenuFLAG == 1) {
      document.getElementById("ParametersCommMenuLeftTopControlMenuTXT").value =
        "volt thr : " + portParser(myMsgWord);
      parameter102CommMenuLeftTopControlMenuFLAG = 0;
    }

    if (parameter103CommMenuLeftTopControlMenuFLAG == 1) {
      let parcedChainOne = myMsgWord.slice(
        myMsgWord.indexOf("data") + 4,
        myMsgWord.length
      );
      console.log(parcedChainOne);
      document.getElementById(
        "ParametersCommMenuLeftTopControlMenuTXT"
      ).value = `byte 1 ${parcedChainOne}     `;
      setTimeout(() => {
        let parcedChainTwo = myMsgWord.slice(
          myMsgWord.indexOf("data") + 4,
          myMsgWord.length
        );
        console.log(parcedChainTwo);
        document.getElementById(
          "ParametersCommMenuLeftTopControlMenuTXT"
        ).value += `byte 2 ${parcedChainTwo}`;
      }, 500);
      parameter103CommMenuLeftTopControlMenuFLAG = 0;
    }
  }, 380);
}

function stopCommWorksLeftTop() {
  //стоп справа-низ
  setTimeout(() => {
    console.log(portParser(myMsgWord));
    if (portParser(myMsgWord) == 170) {
      document.getElementById("LeftTopLamp").style.backgroundColor = "red";
      document.getElementById("stopCommMenuLeftTopControlMenu").style.display =
        "none";
    } else {
      console.log(`error`);
      document.getElementById("LeftTopLamp").style.backgroundColor = "grey";
      document.getElementById("stopCommMenuLeftTopControlMenu").style.display =
        "block";
    }
  }, 380);
}

function stopCommWorksRightTop() {
  setTimeout(() => {
    console.log(portParser(myMsgWord));
    if (portParser(myMsgWord) == 170) {
      document.getElementById("RightTopLamp").style.backgroundColor = "red";
      document.getElementById("stopCommMenuRightTopControlMenu").style.display =
        "none";
    } else {
      console.log(`error`);
      document.getElementById("RightTopLamp").style.backgroundColor = "grey";
      document.getElementById("stopCommMenuRightTopControlMenu").style.display =
        "block";
    }
  }, 380);
}

function startCommWorksLeftTop() {
  //старт слева-низ
  setTimeout(() => {
    console.log(portParser(myMsgWord));
    if (portParser(myMsgWord) == 170) {
      document.getElementById("LeftTopLamp").style.backgroundColor = "green";
      document.getElementById("startCommLeftTopControlMenu").style.display =
        "none";
    } else {
      console.log(`error`);
      document.getElementById("LeftTopLamp").style.backgroundColor = "grey";
      document.getElementById("startCommLeftTopControlMenu").style.display =
        "block";
    }
  }, 380);
}

function startCommWorksRightTop() {
  //старт справа-верх
  setTimeout(() => {
    console.log(portParser(myMsgWord));
    if (portParser(myMsgWord) == 170) {
      document.getElementById("RightTopLamp").style.backgroundColor = "green";
      //document.getElementById('startCommLeftTopControlMenu').style.display = 'none'
      openCloseMenus("startCommRightTopControlMenu", "none");
    } else {
      console.log(`error`);
      document.getElementById("LeftTopLamp").style.backgroundColor = "grey";
      //document.getElementById('startCommLeftTopControlMenu').style.display = 'block'
      openCloseMenus("startCommRightTopControlMenu", "block");
    }
  }, 380);
}

function paramsCommMenuLeftBottomMenu() {
  //параметры слева-низ
  document.getElementById("ParametersCommMenuLeftBottomControlMenuTXT").value =
    "";
  document.getElementById("LeftBottomLamp").style.backgroundColor = "orange";
  setTimeout(() => {
    console.log(portParser(myMsgWord));
    if (parameter101CommMenuLeftBottomControlMenuFLAG == 1) {
      document.getElementById(
        "ParametersCommMenuLeftBottomControlMenuTXT"
      ).value = "engine power: " + portParser(myMsgWord);
      parameter101CommMenuLeftBottomControlMenuFLAG = 0;
      //document.getElementById('LeftBottomLamp').style.backgroundColor = 'orange';
    }

    if (parameter102CommMenuLeftBottomControlMenuFLAG == 1) {
      document.getElementById(
        "ParametersCommMenuLeftBottomControlMenuTXT"
      ).value = "volt thr : " + portParser(myMsgWord);
      parameter102CommMenuLeftBottomControlMenuFLAG = 0;
      //document.getElementById('LeftBottomLamp').style.backgroundColor = 'orange';
    }

    if (parameter103CommMenuLeftBottomControlMenuFLAG == 1) {
      let parcedChainOne = myMsgWord.slice(
        myMsgWord.indexOf("data") + 4,
        myMsgWord.length
      );
      console.log(parcedChainOne);
      document.getElementById(
        "ParametersCommMenuLeftBottomControlMenuTXT"
      ).value = `byte 1 ${parcedChainOne}     `;
      setTimeout(() => {
        let parcedChainTwo = myMsgWord.slice(
          myMsgWord.indexOf("data") + 4,
          myMsgWord.length
        );
        console.log(parcedChainTwo);
        document.getElementById(
          "ParametersCommMenuLeftBottomControlMenuTXT"
        ).value += `byte 2 ${parcedChainTwo}`;
      }, 500);
      parameter103CommMenuLeftBottomControlMenuFLAG = 0;
      //document.getElementById('LeftBottomLamp').style.backgroundColor = 'orange';
    }
  }, 380);
}

function paramsCommMenuRightBottomControlMenu() {
  //параметры справа-низ
  document.getElementById("ParametersCommMenuRightBottomControlMenuTXT").value =
    "";
  document.getElementById("RightBottomLamp").style.backgroundColor = "orange";
  setTimeout(() => {
    console.log(portParser(myMsgWord));
    if (parameter101CommMenuRightBottomControlMenuFLAG == 1) {
      document.getElementById(
        "ParametersCommMenuRightBottomControlMenuTXT"
      ).value = "engine power: " + portParser(myMsgWord);
      parameter101CommMenuRightBottomControlMenuFLAG = 0;
      //document.getElementById('RightBottomLamp').style.backgroundColor = 'orange';
    }

    if (parameter102CommMenuRightBottomControlMenuFLAG == 1) {
      document.getElementById(
        "ParametersCommMenuRightBottomControlMenuTXT"
      ).value = "volt thr : " + portParser(myMsgWord);
      parameter102CommMenuRightBottomControlMenuFLAG = 0;
      //document.getElementById('RightBottomLamp').style.backgroundColor = 'orange';
    }

    if (parameter103CommMenuRightBottomControlMenuFLAG == 1) {
      let parcedChainOne = myMsgWord.slice(
        myMsgWord.indexOf("data") + 4,
        myMsgWord.length
      );
      console.log(parcedChainOne);
      document.getElementById(
        "ParametersCommMenuRightBottomControlMenuTXT"
      ).value = `byte 1 ${parcedChainOne}     `;
      setTimeout(() => {
        let parcedChainTwo = myMsgWord.slice(
          myMsgWord.indexOf("data") + 4,
          myMsgWord.length
        );
        console.log(parcedChainTwo);
        document.getElementById(
          "ParametersCommMenuRightBottomControlMenuTXT"
        ).value += `byte 2 ${parcedChainTwo}`;
      }, 500);
      parameter103CommMenuRightBottomControlMenuFLAG = 0;
    }
  }, 380);
}

function startCommWorksRightBottom() {
  //старт справа низ
  setTimeout(() => {
    console.log(portParser(myMsgWord));
    if (portParser(myMsgWord) == 170) {
      document.getElementById("RightBottomLamp").style.backgroundColor =
        "green";
      document.getElementById(
        "startCommMenuRightBottomControlMenu"
      ).style.display = "none";
    } else {
      console.log(`error`);
      document.getElementById("RightBottomLamp").style.backgroundColor = "grey";
      document.getElementById(
        "startCommMenuRightBottomControlMenu"
      ).style.display = "block";
    }
  }, 380);
}

function stopCommWorksRightBottom() {
  //стоп справа-низ
  setTimeout(() => {
    console.log(portParser(myMsgWord));
    if (portParser(myMsgWord) == 170) {
      document.getElementById("RightBottomLamp").style.backgroundColor = "red";
      document.getElementById(
        "stopCommMenuRightBottomControlMenu"
      ).style.display = "none";
    } else {
      console.log(`error`);
      document.getElementById("RightBottomLamp").style.backgroundColor = "grey";
      document.getElementById(
        "stopCommMenuRightBottomControlMenu"
      ).style.display = "block";
    }
  }, 380);
}

function startCommWorksLeftBottom() {
  //старт слева-низ
  setTimeout(() => {
    console.log(portParser(myMsgWord));
    if (portParser(myMsgWord) == 170) {
      document.getElementById("LeftBottomLamp").style.backgroundColor = "green";
      document.getElementById("startCommLeftBottomControlMenu").style.display =
        "none";
    } else {
      console.log(`error`);
      document.getElementById("LeftBottomLamp").style.backgroundColor = "grey";
      document.getElementById("startCommLeftBottomControlMenu").style.display =
        "block";
    }
  }, 380);
}

function stopCommWorksLeftBottom() {
  //стоп слева-низ
  setTimeout(() => {
    console.log(portParser(myMsgWord));
    if (portParser(myMsgWord) == 170) {
      document.getElementById("LeftBottomLamp").style.backgroundColor = "red";
      document.getElementById(
        "stopCommMenuLeftBottomControlMenu"
      ).style.display = "none";
    } else {
      console.log(`error`);
      document.getElementById("LeftBottomLamp").style.backgroundColor = "grey";
      document.getElementById(
        "stopCommMenuLeftBottomControlMenu"
      ).style.display = "block";
    }
  }, 380);
}

function commandGenerator(command, dataToSend) {
  if (document.getElementById("modeChooseSLCT").value == "arduino") {
    codeWrd = "data";
    address = "85";
    if (dataToSend != " ") {
      MyCOMPort.write(
        codeWrd + " " + address + " " + command + " " + dataToSend + "\r\n",
        () => {}
      );
    } else {
      MyCOMPort.write(
        codeWrd + " " + address + " " + command + "\r\n",
        () => {}
      );
    }
  }

  if (document.getElementById("modeChooseSLCT").value == "TRLTBoard") {
    codeWrd = "mdata";
    port = document.getElementById("portChooseSLCT").value;
    address = "85";
    if (dataToSend != " ") {
      MyCOMPort.write(
        codeWrd +
          " " +
          port +
          " " +
          address +
          " " +
          command +
          " " +
          dataToSend +
          "\r\n",
        () => {}
      );
      console.log(
        "COMMAND " +
          codeWrd +
          " " +
          port +
          " " +
          address +
          " " +
          command +
          " " +
          dataToSend
      );
    } else {
      MyCOMPort.write(
        codeWrd + " " + port + " " + address + " " + command + "\r\n",
        () => {}
      );
      console.log(
        "COMMAND " + codeWrd + " " + port + " " + address + " " + command
      );
    }
  }
}

function openCloseMenus(blockName, parameter) {
  document.getElementById(blockName).style.display = parameter;
}

document
  .getElementById("scenarioLineCrossingTestHBut")
  .addEventListener("click", () => {
    console.log(`left to right way active!`);
    document.getElementById("RightBottomLamp").style.backgroundColor = "orange";
    lampControl(2, 2);
    document.getElementById("LeftTopLamp").style.backgroundColor = "orange";
    lampControl(0, 2);
    setTimeout(() => {
      document.getElementById("RightBottomLamp").style.backgroundColor = "red";
      lampControl(2, 3);
      document.getElementById("LeftTopLamp").style.backgroundColor = "red";
      lampControl(0, 3);
    }, 1000);

    document.getElementById("RightTopLamp").style.backgroundColor = "orange";
    lampControl(1, 2);
    document.getElementById("LeftBottomLamp").style.backgroundColor = "orange";
    lampControl(3, 2);

    setTimeout(() => {
      document.getElementById("RightTopLamp").style.backgroundColor = "green";
      lampControl(1, 1);
      document.getElementById("LeftBottomLamp").style.backgroundColor = "green";
      lampControl(3, 1);
    }, 1000);
  });

document
  .getElementById("scenarioLineCrossingTestVBut")
  .addEventListener("click", () => {
    console.log(`down to up way active!`);
    document.getElementById("RightBottomLamp").style.backgroundColor = "orange";
    lampControl(2, 2);
    document.getElementById("LeftTopLamp").style.backgroundColor = "orange";
    lampControl(0, 2);

    setTimeout(() => {
      document.getElementById("RightBottomLamp").style.backgroundColor =
        "green";
      lampControl(2, 1);
      document.getElementById("LeftTopLamp").style.backgroundColor = "green";
      lampControl(0, 1);
    }, 1000);

    document.getElementById("RightTopLamp").style.backgroundColor = "orange";
    lampControl(1, 2);
    document.getElementById("LeftBottomLamp").style.backgroundColor = "orange";
    lampControl(3, 2);

    setTimeout(() => {
      document.getElementById("RightTopLamp").style.backgroundColor = "red";
      lampControl(1, 3);
      document.getElementById("LeftBottomLamp").style.backgroundColor = "red";
      lampControl(3, 3);
    }, 1000);
  });

document.getElementById("scenarioAllOFF").addEventListener("click", () => {
  lampControl(0, 0);
  document.getElementById("LeftTopLamp").style.backgroundColor = "grey";
  lampControl(1, 0);
  document.getElementById("RightTopLamp").style.backgroundColor = "grey";
  lampControl(2, 0);
  document.getElementById("RightBottomLamp").style.backgroundColor = "grey";
  lampControl(3, 0);
  document.getElementById("LeftBottomLamp").style.backgroundColor = "grey";
});

document
  .getElementById("scenarioAllYellowBut")
  .addEventListener("click", () => {
    document.getElementById("RightBottomLamp").style.backgroundColor = "orange";
    lampControl(2, 2);
    document.getElementById("LeftBottomLamp").style.backgroundColor = "orange";
    lampControl(3, 2);
    document.getElementById("LeftTopLamp").style.backgroundColor = "orange";
    lampControl(0, 2);
    document.getElementById("RightTopLamp").style.backgroundColor = "orange";
    lampControl(1, 2);
  });

document.getElementById("scenarioTestAllBut").addEventListener("click", () => {
  document.getElementById("LeftTopLamp").style.backgroundColor = "green";
  lampControl(0, 1);
  document.getElementById("RightTopLamp").style.backgroundColor = "green";
  lampControl(1, 1);
  document.getElementById("RightBottomLamp").style.backgroundColor = "green";
  lampControl(2, 1);
  document.getElementById("LeftBottomLamp").style.backgroundColor = "green";
  lampControl(3, 1);

  setTimeout(() => {
    document.getElementById("LeftTopLamp").style.backgroundColor = "orange";
    lampControl(0, 2);
    document.getElementById("RightTopLamp").style.backgroundColor = "orange";
    lampControl(1, 2);
    document.getElementById("RightBottomLamp").style.backgroundColor = "orange";
    lampControl(2, 2);
    document.getElementById("LeftBottomLamp").style.backgroundColor = "orange";
    lampControl(3, 2);
  }, 1000);

  setTimeout(() => {
    document.getElementById("LeftTopLamp").style.backgroundColor = "red";
    lampControl(0, 3);
    document.getElementById("RightTopLamp").style.backgroundColor = "red";
    lampControl(1, 3);
    document.getElementById("RightBottomLamp").style.backgroundColor = "red";
    lampControl(2, 3);
    document.getElementById("LeftBottomLamp").style.backgroundColor = "red";
    lampControl(3, 3);
  }, 2000);

  setTimeout(() => {
    document.getElementById("LeftTopLamp").style.backgroundColor = "grey";
    lampControl(0, 0);
    document.getElementById("RightTopLamp").style.backgroundColor = "grey";
    lampControl(1, 0);
    document.getElementById("RightBottomLamp").style.backgroundColor = "grey";
    lampControl(2, 0);
    document.getElementById("LeftBottomLamp").style.backgroundColor = "grey";
    lampControl(3, 0);
  }, 3000);
});

function lampControls(lampColor) {
  MyCOMPort.write("jligs " + lampColor + "\r\n", () => {});
}

function lampControl(lampNum, lampColor) {
  MyCOMPort.write("light" + " " + lampNum + " " + 0 + "\r\n", () => {});
  setTimeout(() => {
    MyCOMPort.write(
      "light" + " " + lampNum + " " + lampColor + "\r\n",
      () => {}
    );
  }, 250);
}

function routeSet(crossNum, crossPosition) {
  MyCOMPort.write( "roset" + " " + crossNum + " " + crossPosition + "\r\n",() => {});
  /*setTimeout(() => {
    MyCOMPort.write("shrt" + "\r\n", () => {});
  }, 1000);*/

  setTimeout(() => {
    console.log(myMsgWord);
  }, 500);
}

//TAB 9 MAKET OPERATOR

//стрелка светофора №1
document.getElementById("operatorNahodkaLeftTopCrossingRight").addEventListener("click", () => {
    document.getElementById("operatorNahodkaLeftTopCrossingRight").hidden = true;
    document.getElementById( "operatorNahodkaLeftTopCrossingStraight").hidden = false;
    //console.log(`left top crossing became straight!`);
    routeSet(0, 0);
    //document.getElementById("tCross1Rght").click();
  });

document.getElementById("operatorNahodkaLeftTopCrossingStraight").addEventListener("click", () => {
    document.getElementById("operatorNahodkaLeftTopCrossingRight" ).hidden = false;
    document.getElementById( "operatorNahodkaLeftTopCrossingStraight").hidden = true;
    //console.log(`left top crossing became straight!`);
    routeSet(0, 1);
    //document.getElementById("tCross1Str").click();
  });

//стрелка светофора №2
document.getElementById("operatorNahodkaRightTopCrossingRight").addEventListener("click", () => {
    document.getElementById("operatorNahodkaRightTopCrossingRight").hidden = true;
    document.getElementById( "operatorNahodkaRightTopCrossingStraight" ).hidden = false;
    //console.log(`right top crossing became straight!`);
    routeSet(1, 0);
    //document.getElementById("tCross2Rght").click();
  });

document.getElementById("operatorNahodkaRightTopCrossingStraight").addEventListener("click", () => {
    document.getElementById("operatorNahodkaRightTopCrossingRight" ).hidden = false;
    document.getElementById( "operatorNahodkaRightTopCrossingStraight").hidden = true;
    //console.log(`right top crossing turned right!`);
    routeSet(1, 1);
    //document.getElementById("tCross2Str").click();
  });
//стрелка светофора №3
document.getElementById("operatorNahodkaRightBottomCrossingRight").addEventListener("click", () => {
    document.getElementById( "operatorNahodkaRightBottomCrossingRight").hidden = true;
    document.getElementById( "operatorNahodkaRightBottomCrossingStraight").hidden = false;
    //console.log(`right bottom crossing became straight!`);
    routeSet(2, 0);
    //document.getElementById("tCross3Rght").click();
  });

document.getElementById("operatorNahodkaRightBottomCrossingStraight").addEventListener("click", () => {
    document.getElementById("operatorNahodkaRightBottomCrossingRight" ).hidden = false;
    document.getElementById( "operatorNahodkaRightBottomCrossingStraight" ).hidden = true;
    //console.log(`right bottom crossing turned right!`);
    routeSet(2, 1);
   // document.getElementById("tCross3Str").click();
  });

//стрелка светофора №4
document.getElementById("operatorNahodkaLeftBottomCrossingRight").addEventListener("click", () => {
    document.getElementById( "operatorNahodkaLeftBottomCrossingRight").hidden = true;
    document.getElementById( "operatorNahodkaLeftBottomCrossingStraight").hidden = false;
    //console.log(`left bottom crossing became straight!`);
    routeSet(3, 0);
    //document.getElementById("tCross4Rght").click();
  });

document.getElementById("operatorNahodkaLeftBottomCrossingStraight").addEventListener("click", () => {
    document.getElementById("operatorNahodkaLeftBottomCrossingRight" ).hidden = false;
    document.getElementById("operatorNahodkaLeftBottomCrossingStraight").hidden = true;
    //console.log(`left bottom crossing turned right!`);
    routeSet(3, 1);
   // document.getElementById("tCross4Str").click();
  });

//стрелка на верхнем левом комбинированном узле
document .getElementById("operatorNahodkaleftTopTransmitterRecieverCrossingBlockCrossingRight").addEventListener("click", () => {
    document.getElementById("operatorNahodkaleftTopTransmitterRecieverCrossingBlockCrossingStraight").hidden = false;
    console.log("cross became straight!");
    document.getElementById("tCross6Rght").click();
  });

document.getElementById( "operatorNahodkaleftTopTransmitterRecieverCrossingBlockCrossingStraight" ).addEventListener("click", () => {
    document.getElementById("operatorNahodkaleftTopTransmitterRecieverCrossingBlockCrossingStraight" ).hidden = true;
    document.getElementById( "operatorNahodkaleftTopTransmitterRecieverCrossingBlockCrossingRight" ).hidden = false;
    console.log("crossing turned right!");
    document.getElementById("tCross6Str").click();
  });

//стрелка на левом нижнем комбинированном узле
document.getElementById("operatorNahodkaleftBottomTransmitterRecieverCrossingBlockCrossingRight").addEventListener("click", () => {
    document.getElementById( "operatorNahodkaleftBottomTransmitterRecieverCrossingBlockCrossingRight" ).hidden = true;
    document.getElementById("operatorNahodkaleftBottomTransmitterRecieverCrossingBlockCrossingStraight"  ).hidden = false;
    console.log("cross became straight!");
    document.getElementById("tCross5Rght").click();
  });

document.getElementById("operatorNahodkaleftBottomTransmitterRecieverCrossingBlockCrossingStraight")
  .addEventListener("click", () => {
     document.getElementById("operatorNahodkaleftBottomTransmitterRecieverCrossingBlockCrossingStraight").hidden = true;
    document.getElementById( "operatorNahodkaleftBottomTransmitterRecieverCrossingBlockCrossingRight" ).hidden = false;
    console.log("crossing turned right!");
    document.getElementById("tCross5Str").click();
  });

/*document.getElementById('crossingControlOperator').addEventListener('click',()=>{
				console.log(`click`);
			})*/

document.getElementById("lookForCarNew").addEventListener("click", () => {
  yellowLightAutomatization();
});

document.getElementById("TestCarNew").addEventListener("click", () => {
  carSearchNew();
});

function yellowLightAutomatization() {
  MyCOMPort.write("mtrans 0 85 2 100" + "\r\n", () => {});
  MyCOMPort.write("mreq" + "\r\n", () => {});
  //console.log(`${document.getElementById('TextRecieved').value.length}`)
  setTimeout(() => {
    MyCOMPort.write("mreq" + "\r\n", () => {});
  }, 2000);
  setTimeout(() => {
    console.log(myMsgWord);
  }, 2350);
}

function carSearchNew() {
  MyCOMPort.write("mtrans 0 85 2 100" + "\r\n", () => {});
  MyCOMPort.write("mreq" + "\r\n", () => {});
  for (let i = 0; i < 100; i++) {
    setTimeout(() => {
      setTimeout(() => {
        console.log(
          `SLICE: ${document.getElementById("TextRecieved").value.slice(-4)}`
        );
        if (document.getElementById("TextRecieved").value.slice(-4) == 100) {
          MyCOMPort.write("mtrans" + "\r\n", () => {});
          i = 100;
        }
      }, 225 * i);
    }, 350);
  }
}

document
  .getElementById("operatorNahodkaOpenToolsBut")
  .addEventListener("click", () => {
    console.log(`click`);
    openCloseMenus("operatorNahodkaToolsBlock", "block");
  });

document
  .getElementById("CLOSEoperatorNahodkaToolsBlock")
  .addEventListener("click", () => {
    openCloseMenus("operatorNahodkaToolsBlock", "none");
  });

//кнопка для стрелки 1 из выпадающего меню
document.getElementById("tCross1Str").addEventListener("click", () => {
  document.getElementById("operatorNahodkaLeftTopCrossingStraight").click();
  document.getElementById("tCross1Str").hidden = true;
  document.getElementById("tCross1Rght").hidden = false;
});

document.getElementById("tCross1Rght").addEventListener("click", () => {
  document.getElementById("operatorNahodkaLeftTopCrossingRight").click();
  document.getElementById("tCross1Str").hidden = false;
  document.getElementById("tCross1Rght").hidden = true;
});

//кнопка для стрелки 2 из выпадающего меню
document.getElementById("tCross2Str").addEventListener("click", () => {
  document.getElementById("operatorNahodkaRightTopCrossingStraight").click();
  document.getElementById("tCross2Str").hidden = true;
  document.getElementById("tCross2Rght").hidden = false;
});

document.getElementById("tCross2Rght").addEventListener("click", () => {
  document.getElementById("operatorNahodkaRightTopCrossingRight").click();
  document.getElementById("tCross2Str").hidden = false;
  document.getElementById("tCross2Rght").hidden = true;
});

//кнопка для стрелки 3 из выпадающего меню
document.getElementById("tCross3Str").addEventListener("click", () => {
  document.getElementById("operatorNahodkaRightBottomCrossingStraight").click();
  document.getElementById("tCross3Str").hidden = true;
  document.getElementById("tCross3Rght").hidden = false;
});

document.getElementById("tCross3Rght").addEventListener("click", () => {
  document.getElementById("operatorNahodkaRightBottomCrossingRight").click();
  document.getElementById("tCross3Str").hidden = false;
  document.getElementById("tCross3Rght").hidden = true;
});

//кнопка для стрелки 4 из выпадающего меню
document.getElementById("tCross4Str").addEventListener("click", () => {
  document.getElementById("operatorNahodkaLeftBottomCrossingStraight").click();
  document.getElementById("tCross4Str").hidden = true;
  document.getElementById("tCross4Rght").hidden = false;
});

document.getElementById("tCross4Rght").addEventListener("click", () => {
  document.getElementById("operatorNahodkaLeftBottomCrossingRight").click();
  document.getElementById("tCross4Str").hidden = false;
  document.getElementById("tCross4Rght").hidden = true;
});

//кнопка для стрелки 5 из выпадающего меню
document.getElementById("tCross5Str").addEventListener("click", () => {
  document
    .getElementById(
      "operatorNahodkaleftBottomTransmitterRecieverCrossingBlockCrossingStraight"
    )
    .click();
  document.getElementById("tCross5Str").hidden = true;
  document.getElementById("tCross5Rght").hidden = false;
});

document.getElementById("tCross5Rght").addEventListener("click", () => {
  document
    .getElementById(
      "operatorNahodkaleftBottomTransmitterRecieverCrossingBlockCrossingRight"
    )
    .click();
  document.getElementById("tCross5Str").hidden = false;
  document.getElementById("tCross5Rght").hidden = true;
});

//кнопка для стрелки 6 из выпадающего меню
document.getElementById("tCross6Str").addEventListener("click", () => {
  document
    .getElementById(
      "operatorNahodkaleftTopTransmitterRecieverCrossingBlockCrossingStraight"
    )
    .click();
  document.getElementById("tCross6Str").hidden = true;
  document.getElementById("tCross6Rght").hidden = false;
});

document.getElementById("tCross6Rght").addEventListener("click", () => {
  document
    .getElementById(
      "operatorNahodkaleftTopTransmitterRecieverCrossingBlockCrossingRight"
    )
    .click();
  document.getElementById("tCross6Str").hidden = false;
  document.getElementById("tCross6Rght").hidden = true;
});

//логика перекрестка
document
  .getElementById("operatorNahodkaRightBottomSteamTransmitterBut")
  .addEventListener("click", () => {
    openCloseMenus("scenesBlock", "block");
  });

document.getElementById("CLOSEscenesBlockBut").addEventListener("click", () => {
  openCloseMenus("scenesBlock", "none");
});

document.getElementById("OPENLightsBlock").addEventListener("click", () => {
  openCloseMenus("LightsBlock", "block");
});

document.getElementById("OPENcrossesBlock").addEventListener("click", () => {
  openCloseMenus("crossesBlock", "block");
});
//сценарий 1
let scene1Flag = 0;
document.getElementById("scenario1").addEventListener("click", () => {
  scene1Flag = 1;
  scene2Flag = 0;
  scene3Flag = 0;
  scene4Flag = 0;
  scene5Flag = 0;
  let lamp1 = document.getElementById("operatorNahodkaLeftTopLamp");
  let lamp2 = document.getElementById("operatorNahodkaRightTopLamp");
  let lamp3 = document.getElementById("operatorNahodkaRightBottomLamp");
  let lamp4 = document.getElementById("operatorNahodkaLeftBottomLamp");
  lampWorks(lamp1, lamp2, lamp3, lamp4);
});
//сценарий 2
let scene2Flag = 0;
document.getElementById("scenario2").addEventListener("click", () => {
  scene1Flag = 0;
  scene2Flag = 1;
  scene3Flag = 0;
  scene4Flag = 0;
  scene5Flag = 0;
  let lamp1 = document.getElementById("operatorNahodkaLeftTopLamp");
  let lamp2 = document.getElementById("operatorNahodkaRightTopLamp");
  let lamp3 = document.getElementById("operatorNahodkaRightBottomLamp");
  let lamp4 = document.getElementById("operatorNahodkaLeftBottomLamp");
  lampWorks(lamp1, lamp2, lamp3, lamp4);
});
//сценарий 3
let scene3Flag = 0;
document.getElementById("scenario3").addEventListener("click", () => {
  scene1Flag = 0;
  scene2Flag = 0;
  scene3Flag = 1;
  scene4Flag = 0;
  scene5Flag = 0;
  let lamp1 = document.getElementById("operatorNahodkaLeftTopLamp");
  let lamp2 = document.getElementById("operatorNahodkaRightTopLamp");
  let lamp3 = document.getElementById("operatorNahodkaRightBottomLamp");
  let lamp4 = document.getElementById("operatorNahodkaLeftBottomLamp");
  lampWorks(lamp1, lamp2, lamp3, lamp4);
});
//сценарий 4
let scene4Flag = 0;
document.getElementById("scenario4").addEventListener("click", () => {
  scene1Flag = 0;
  scene2Flag = 0;
  scene3Flag = 0;
  scene4Flag = 1;
  scene5Flag = 0;
  let lamp1 = document.getElementById("operatorNahodkaLeftTopLamp");
  let lamp2 = document.getElementById("operatorNahodkaRightTopLamp");
  let lamp3 = document.getElementById("operatorNahodkaRightBottomLamp");
  let lamp4 = document.getElementById("operatorNahodkaLeftBottomLamp");
  lampWorks(lamp1, lamp2, lamp3, lamp4);
});
//сценарий 5
let scene5Flag = 0;
document.getElementById("scenario5").addEventListener("click", () => {
  scene1Flag = 0;
  scene2Flag = 0;
  scene3Flag = 0;
  scene4Flag = 0;
  scene5Flag = 1;
  let lamp1 = document.getElementById("operatorNahodkaLeftTopLamp");
  let lamp2 = document.getElementById("operatorNahodkaRightTopLamp");
  let lamp3 = document.getElementById("operatorNahodkaRightBottomLamp");
  let lamp4 = document.getElementById("operatorNahodkaLeftBottomLamp");
  lampWorks(lamp1, lamp2, lamp3, lamp4);
});

function lampWorks(lamp1, lamp2, lamp3, lamp4) {
  let color1 = window.getComputedStyle(lamp1).backgroundColor;
  let color2 = window.getComputedStyle(lamp2).backgroundColor;
  let color3 = window.getComputedStyle(lamp3).backgroundColor;
  let color4 = window.getComputedStyle(lamp4).backgroundColor;
  //сценарий 1
  if (scene1Flag == 1) {
    setTimeout(() => {
      lamp1.style.backgroundColor = "orange";
      //	lampControl(0, 0)
      lampControl(0, 2);
      lamp3.style.backgroundColor = "orange";
      //	lampControl(2, 0)
      lampControl(2, 2);
    }, 1000);
    setTimeout(() => {
      lamp1.style.backgroundColor = "green";
      //lampControl(0, 0)
      lampControl(0, 1);
      lamp3.style.backgroundColor = "green";
      //lampControl(2, 0)
      lampControl(2, 1);
    }, 2000);

    lamp2.style.backgroundColor = "green";
    //lampControl(1, 0)
    lampControl(1, 1);
    lamp4.style.backgroundColor = "green";
    //lampControl(3, 0)
    lampControl(3, 1);

    setTimeout(() => {
      lamp2.style.backgroundColor = "orange";
      //lampControl(1, 0)
      lampControl(1, 2);
      lamp4.style.backgroundColor = "orange";
      //lampControl(3, 0)
      lampControl(3, 2);
    }, 1500);
    setTimeout(() => {
      lamp2.style.backgroundColor = "red";
      //lampControl(1, 0)
      lampControl(1, 4);
      lamp4.style.backgroundColor = "red";
      //lampControl(3, 0)
      lampControl(3, 4);
    }, 2500);
  }
  //сценарий 2
  if (scene2Flag == 1) {
    setTimeout(() => {
      lamp2.style.backgroundColor = "orange";
      //lampControl(1, 0)
      lampControl(1, 2);
      lamp4.style.backgroundColor = "orange";
      //lampControl(3, 0)
      lampControl(3, 2);
    }, 1000);
    setTimeout(() => {
      lamp2.style.backgroundColor = "green";
      //lampControl(1, 0)
      lampControl(1, 1);
      lamp4.style.backgroundColor = "green";
      //lampControl(3, 0)
      lampControl(3, 1);
    }, 2000);

    lamp1.style.backgroundColor = "green";
    //lampControl(0, 0)
    lampControl(0, 1);
    lamp3.style.backgroundColor = "green";
    //lampControl(2, 0)
    lampControl(2, 1);

    setTimeout(() => {
      lamp1.style.backgroundColor = "orange";
      //lampControl(0, 0)
      lampControl(0, 2);
      lamp3.style.backgroundColor = "orange";
      //lampControl(2, 0)
      lampControl(2, 2);
    }, 1500);
    setTimeout(() => {
      lamp1.style.backgroundColor = "red";
      //lampControl(0, 0)
      lampControl(0, 4);
      lamp3.style.backgroundColor = "red";
      //lampControl(2, 0)
      lampControl(2, 4);
    }, 2500);
  }
  //сценарий 3
  if (scene3Flag == 1) {
    setTimeout(() => {
      lamp1.style.backgroundColor = "orange";
      //lampControl(0, 0)
      lampControl(0, 2);
      lamp3.style.backgroundColor = "orange";
      //lampControl(2, 0)
      lampControl(2, 2);
    }, 1000);

    setTimeout(() => {
      lamp2.style.backgroundColor = "orange";
      //lampControl(1, 0)
      lampControl(1, 2);
      lamp4.style.backgroundColor = "orange";
      ///lampControl(3, 0)
      lampControl(3, 2);
    }, 1500);

    setTimeout(() => {
      lamp1.style.backgroundColor = "green";
      //lampControl(1, 0)
      lampControl(0, 1);
      lamp3.style.backgroundColor = "green";
      //lampControl(2, 0)
      lampControl(2, 1);
    }, 2000);

    setTimeout(() => {
      lamp2.style.backgroundColor = "red";
      //lampControl(1, 0)
      lampControl(1, 4);
      lamp4.style.backgroundColor = "red";
      //lampControl(3, 0)
      lampControl(3, 4);
    }, 2500);

    setTimeout(() => {
      document.getElementById("operatorNahodkaLeftTopCrossingStraight").click();
      document
        .getElementById("operatorNahodkaRightBottomCrossingStraight")
        .click();
      document.getElementById("operatorNahodkaLeftBottomCrossingRight").click();
      document.getElementById("operatorNahodkaRightTopCrossingRight").click();
    }, 3000);
  }
  //сценарий 4
  if (scene4Flag == 1) {
    /*lamp1.style.backgroundColor = 'red';
					lamp2.style.backgroundColor = 'green';
					lamp3.style.backgroundColor = 'red';
					lamp4.style.backgroundColor = 'green';*/
    setTimeout(() => {
      lamp2.style.backgroundColor = "orange";
      //lampControl(1, 0)
      lampControl(1, 2);
      lamp4.style.backgroundColor = "orange";
      //lampControl(3, 0)
      lampControl(3, 2);
    }, 1000);

    setTimeout(() => {
      lamp1.style.backgroundColor = "orange";
      //lampControl(0, 0)
      lampControl(0, 2);
      lamp3.style.backgroundColor = "orange";
      //lampControl(2, 0)
      lampControl(2, 2);
    }, 1500);

    setTimeout(() => {
      lamp2.style.backgroundColor = "green";
      //lampControl(1, 0)
      lampControl(1, 1);
      lamp4.style.backgroundColor = "green";
      //lampControl(3, 0)
      lampControl(3, 1);
    }, 2000);

    setTimeout(() => {
      lamp1.style.backgroundColor = "red";
      //lampControl(0, 0)
      lampControl(0, 4);
      lamp3.style.backgroundColor = "red";
      //lampControl(2, 0)
      lampControl(2, 4);
    }, 2500);

    setTimeout(() => {
      document
        .getElementById("operatorNahodkaLeftBottomCrossingStraight")
        .click();
      document
        .getElementById("operatorNahodkaRightTopCrossingStraight")
        .click();
      document.getElementById("operatorNahodkaLeftTopCrossingRight").click();
      document
        .getElementById("operatorNahodkaRightBottomCrossingRight")
        .click();
    }, 3000);
  }
  //сценарий 5
  if (scene5Flag == 1) {
    setTimeout(() => {
      lamp1.style.backgroundColor = "orange";
      //lampControl(0, 0)
      lampControl(0, 2);
      lamp2.style.backgroundColor = "orange";
      //lampControl(1, 0)
      lampControl(1, 2);
      lamp3.style.backgroundColor = "orange";
      //lampControl(2, 0)
      lampControl(2, 2);
      lamp4.style.backgroundColor = "orange";
      //lampControl(3, 0)
      lampControl(3, 2);
    }, 1000);

    setTimeout(() => {
      lamp1.style.backgroundColor = "green";
      //lampControl(0, 0)
      lampControl(0, 1);
      lamp2.style.backgroundColor = "green";
      //lampControl(1, 0)
      lampControl(1, 1);
      lamp3.style.backgroundColor = "green";
      //lampControl(2, 0)
      lampControl(2, 1);
      lamp4.style.backgroundColor = "green";
      //lampControl(3, 0)
      lampControl(3, 1);
    }, 2000);

    setTimeout(() => {
      document
        .getElementById("operatorNahodkaLeftBottomCrossingStraight")
        .click();
      document
        .getElementById("operatorNahodkaRightTopCrossingStraight")
        .click();
      document.getElementById("operatorNahodkaLeftTopCrossingStraight").click();
      document
        .getElementById("operatorNahodkaRightBottomCrossingStraight")
        .click();
    }, 3000);

    setTimeout(() => {
      setTimeout(() => {
        lamp1.style.backgroundColor = "orange";
        //lampControl(0, 0)
        lampControl(0, 2);
        lamp2.style.backgroundColor = "orange";
        //lampControl(1, 0)
        lampControl(1, 2);
        lamp3.style.backgroundColor = "orange";
        //lampControl(2, 0)
        lampControl(2, 2);
        lamp4.style.backgroundColor = "orange";
        //lampControl(3, 0)
        lampControl(3, 2);
      }, 1000);

      setTimeout(() => {
        lamp1.style.backgroundColor = "red";
        //lampControl(0, 0)
        lampControl(0, 4);
        lamp2.style.backgroundColor = "red";
        //lampControl(1, 0)
        lampControl(1, 4);
        lamp3.style.backgroundColor = "red";
        //lampControl(1, 0)
        lampControl(2, 4);
        lamp4.style.backgroundColor = "red";
        //lampControl(3, 0)
        lampControl(3, 4);
      }, 2000);
      setTimeout(() => {
        lamp1.style.backgroundColor = "grey";
        lampControl(0, 0);
        lamp2.style.backgroundColor = "grey";
        lampControl(1, 0);
        lamp3.style.backgroundColor = "grey";
        lampControl(2, 0);
        lamp4.style.backgroundColor = "grey";
        lampControl(3, 0);
      }, 3000);
      setTimeout(() => {
        document
          .getElementById("operatorNahodkaLeftBottomCrossingRight")
          .click();
        document.getElementById("operatorNahodkaRightTopCrossingRight").click();
        document.getElementById("operatorNahodkaLeftTopCrossingRight").click();
        document
          .getElementById("operatorNahodkaRightBottomCrossingRight")
          .click();
      }, 3500);
    }, 10000);
  }
}

/*<!--треугольники контур 1-4-->*/
document.getElementById("TRIANG1-4_1").addEventListener("click", () => {
  console.log("TRIANG1-4_1 clicked");
  openCloseMenus("TRIANG1-4_1Info", "block");
});

document
  .getElementById("CLOSETRIANG1-4_1Info")
  .addEventListener("click", () => {
    openCloseMenus("TRIANG1-4_1Info", "none");
  });

document.getElementById("TRIANG1-4_2").addEventListener("click", () => {
  console.log("TRIANG1-4_2 clicked");
  openCloseMenus("TRIANG1-4_2Info", "block");
});

document
  .getElementById("CLOSETRIANG1-4_2Info")
  .addEventListener("click", () => {
    openCloseMenus("TRIANG1-4_2Info", "none");
  });

document.getElementById("TRIANG1-4_3").addEventListener("click", () => {
  console.log("TRIANG1-4_3 clicked");
  openCloseMenus("TRIANG1-4_3Info", "block");
});

document
  .getElementById("CLOSETRIANG1-4_3Info")
  .addEventListener("click", () => {
    openCloseMenus("TRIANG1-4_3Info", "none");
  });

document.getElementById("TRIANG1-4_4").addEventListener("click", () => {
  console.log("TRIANG1-4_4 clicked");
  openCloseMenus("TRIANG1-4_4Info", "block");
});

document
  .getElementById("CLOSETRIANG1-4_4Info")
  .addEventListener("click", () => {
    openCloseMenus("TRIANG1-4_4Info", "none");
  });

/*<!--треугольники контур 4-1-->*/
document.getElementById("TRIANG4-1_1").addEventListener("click", () => {
  console.log("TRIANG4-1_1 clicked");
  openCloseMenus("TRIANG4-1_1Info", "block");
});

document
  .getElementById("CLOSETRIANG4-1_1Info")
  .addEventListener("click", () => {
    openCloseMenus("TRIANG4-1_1Info", "none");
  });

document.getElementById("TRIANG4-1_2").addEventListener("click", () => {
  console.log("TRIANG4-1_2 clicked");
  openCloseMenus("TRIANG4-1_2Info", "block");
});

document
  .getElementById("CLOSETRIANG4-1_2Info")
  .addEventListener("click", () => {
    openCloseMenus("TRIANG4-1_2Info", "none");
  });

document.getElementById("TRIANG4-1_3").addEventListener("click", () => {
  console.log("TRIANG4-1_3 clicked");
  openCloseMenus("TRIANG4-1_3Info", "block");
});

document
  .getElementById("CLOSETRIANG4-1_3Info")
  .addEventListener("click", () => {
    openCloseMenus("TRIANG4-1_3Info", "none");
  });

document.getElementById("TRIANG4-1_4").addEventListener("click", () => {
  console.log("TRIANG4-1_4 clicked");
  openCloseMenus("TRIANG4-1_4Info", "block");
});

document
  .getElementById("CLOSETRIANG4-1_4Info")
  .addEventListener("click", () => {
    openCloseMenus("TRIANG4-1_4Info", "none");
  });

document.getElementById("TRIANG4-1_5").addEventListener("click", () => {
  console.log("TRIANG4-1_5 clicked");
  openCloseMenus("TRIANG4-1_5Info", "block");
});

document
  .getElementById("CLOSETRIANG4-1_5Info")
  .addEventListener("click", () => {
    openCloseMenus("TRIANG4-1_5Info", "none");
  });

/*<!--треугольники контур 2-2-->*/
document.getElementById("TRIANG2-2_1D").addEventListener("click", () => {
  console.log("TRIANG2-2_1D clicked");
  openCloseMenus("TRIANG2-2_1DInfo", "block");
});

document
  .getElementById("CLOSETRIANG2-2_1DInfo")
  .addEventListener("click", () => {
    openCloseMenus("TRIANG2-2_1DInfo", "none");
  });

document.getElementById("TRIANG2-2_2U").addEventListener("click", () => {
  console.log("TRIANG2-2_2U clicked");
  openCloseMenus("TRIANG2-2_2UInfo", "block");
});

document
  .getElementById("CLOSETRIANG2-2_2UInfo")
  .addEventListener("click", () => {
    openCloseMenus("TRIANG2-2_2UInfo", "none");
  });

/*<!--треугольники контур 3-3-->*/
document.getElementById("TRIANG3-3_1L").addEventListener("click", () => {
  console.log("TRIANG3-3_1L clicked");
  openCloseMenus("TRIANG3-3_1LInfo", "block");
});

document
  .getElementById("CLOSETRIANG3-3_1LInfo")
  .addEventListener("click", () => {
    openCloseMenus("TRIANG3-3_1LInfo", "none");
  });

document.getElementById("TRIANG3-3_2R").addEventListener("click", () => {
  console.log("TRIANG3-3_2R clicked");
  openCloseMenus("TRIANG3-3_2RInfo", "block");
});

document
  .getElementById("CLOSETRIANG3-3_2RInfo")
  .addEventListener("click", () => {
    openCloseMenus("TRIANG3-3_2RInfo", "none");
  });

//TAB 10
function megaTest(command) {
  MyCOMPort.write(command + "\r\n", () => {});
}

//commTXTBlock
document.getElementById("SENDscriptTXT_1").addEventListener("click", () => {
  megaTest(document.getElementById("scriptTXT_1").value);
});

document.getElementById("SENDscriptTXT_2").addEventListener("click", () => {
  megaTest(document.getElementById("scriptTXT_2").value);
});

document.getElementById("SENDscriptTXT_3").addEventListener("click", () => {
  megaTest(document.getElementById("scriptTXT_3").value);
});

document.getElementById("SENDscriptTXT_4").addEventListener("click", () => {
  megaTest(document.getElementById("scriptTXT_4").value);
});

document.getElementById("SENDscriptTXT_5").addEventListener("click", () => {
  megaTest(document.getElementById("scriptTXT_5").value);
});

document.getElementById("SENDscriptTXT_6").addEventListener("click", () => {
  megaTest(document.getElementById("scriptTXT_6").value);
});

document.getElementById("SENDscriptTXT_7").addEventListener("click", () => {
  megaTest(document.getElementById("scriptTXT_7").value);
});

document.getElementById("SENDscriptTXT_8").addEventListener("click", () => {
  megaTest(document.getElementById("scriptTXT_8").value);
});

document.getElementById("SENDscriptTXT_9").addEventListener("click", () => {
  megaTest(document.getElementById("scriptTXT_9").value);
});

document.getElementById("SENDscriptTXT_10").addEventListener("click", () => {
  megaTest(document.getElementById("scriptTXT_10").value);
});

document.getElementById("SENDscriptTXT_11").addEventListener("click", () => {
  megaTest(document.getElementById("scriptTXT_11").value);
});

document.getElementById("SENDscriptTXT_12").addEventListener("click", () => {
  megaTest(document.getElementById("scriptTXT_12").value);
});

document.getElementById("SENDscriptTXT_13").addEventListener("click", () => {
  megaTest(document.getElementById("scriptTXT_13").value);
});

document.getElementById("SENDscriptTXT_14").addEventListener("click", () => {
  megaTest(document.getElementById("scriptTXT_14").value);
});

document.getElementById("SENDscriptTXT_15").addEventListener("click", () => {
  megaTest(document.getElementById("scriptTXT_15").value);
});

document.getElementById("SENDscriptTXT_16").addEventListener("click", () => {
  megaTest(document.getElementById("scriptTXT_16").value);
});

document.getElementById("SENDscriptTXT_17").addEventListener("click", () => {
  megaTest(document.getElementById("scriptTXT_17").value);
});

document.getElementById("SENDscriptTXT_18").addEventListener("click", () => {
  megaTest(document.getElementById("scriptTXT_18").value);
});

document.getElementById("SENDscriptTXT_19").addEventListener("click", () => {
  megaTest(document.getElementById("scriptTXT_19").value);
});

document.getElementById("SENDscriptTXT_20").addEventListener("click", () => {
  megaTest(document.getElementById("scriptTXT_20").value);
});

document.getElementById("SENDscriptTXT_21").addEventListener("click", () => {
  megaTest(document.getElementById("scriptTXT_21").value);
});

document.getElementById("SENDscriptTXT_22").addEventListener("click", () => {
  megaTest(document.getElementById("scriptTXT_22").value);
});

document.getElementById("SENDscriptTXT_23").addEventListener("click", () => {
  megaTest(document.getElementById("scriptTXT_23").value);
});

document.getElementById("SENDscriptTXT_24").addEventListener("click", () => {
  megaTest(document.getElementById("scriptTXT_24").value);
});

//createScriptBlock
document.getElementById("OPENcreateScriptBlock").addEventListener("click", () => {
  ScriptNamesFLAG = 1;
  CSNmeFlag = 0;
  openCloseMenus("createScriptBlock", "block");
  openCloseMenus("scriptQueue", "block");
  scriptDBReadNames("ScriptNames");
  openCloseMenus("modalSetTimer", "block");
  });

document.getElementById("SAVEcreateScriptBlockPart_1").addEventListener("click", () => {
    openCloseMenus("notification", "block");
    document.getElementById("notificationScriptType").value = "JS";
    document.getElementById("notificationScriptName").value = "ScriptJS_";
    document.getElementById("notificationScriptOK").hidden = false;
  });

//логика notification
document.getElementById("notificationScriptNameCancel").addEventListener("click", () => {
    openCloseMenus("notification", "none");
  });

let ScriptNamesFLAG = 0;
document.getElementById("ScriptNames").addEventListener("contextmenu", () => {
 // ScriptNamesFLAG = 1;
  //notificationScriptCommSeqenceNameChoiceFLAG = 0;
 // scriptDBReadNames("ScriptNames");//ScriptNamesFLAG = 1; - следовательно, произойдет поиск скриптов с типом "JS". 
  
openCloseMenus('modalSetTimer', 'block');
});

document.getElementById('CLOSEmodalSetTimer').addEventListener('click', ()=>{
  openCloseMenus('modalSetTimer', 'none');
})

document.getElementById("CLOSEcreateScriptBlock").addEventListener("click", () => {
    openCloseMenus("createScriptBlock", "none");
    openCloseMenus("scriptQueue", "none"); //modalSetTimer
    openCloseMenus("modalSetTimer", "none");
  });

document.getElementById("RUNScriptBut").addEventListener("click", () => {
  let scriptName = document.getElementById("ScriptNames").value;
  openCloseMenus('modalSetTimer', 'none');
  runScripts(scriptName);
});

let Qcounter = 0;
let QueueCount;
let namesArr = [];
document.getElementById("addScriptToQBut").addEventListener("click", () => {
  Qcounter++;
  QueueCount = Qcounter;
  addQueue(Qcounter);
  console.log(QueueCount);
});

function addQueue(counter) {
  if (counter == 1) {
    document.getElementById("Qscript_1").value =
      document.getElementById("ScriptNames").value;
    namesArr.push(document.getElementById("Qscript_1").value);
  }

  if (counter == 2) {
    document.getElementById("Qscript_2").value =
      document.getElementById("ScriptNames").value;
    namesArr.push(document.getElementById("Qscript_2").value);
  }

  if (counter == 3) {
    document.getElementById("Qscript_3").value =
      document.getElementById("ScriptNames").value;
    namesArr.push(document.getElementById("Qscript_3").value);
  }

  if (counter == 4) {
    document.getElementById("Qscript_4").value =
      document.getElementById("ScriptNames").value;
    namesArr.push(document.getElementById("Qscript_4").value);
  }
  console.log(namesArr);
}

document.getElementById("RUNscriptQueueBut").addEventListener("click", () => {
  runQueue(namesArr);
});

/*document.getElementById("testBut").addEventListener("click", () => {
  //MyCOMPort.write('mtrans 0 85 2 100' + '\r\n',()=> {})
  mtrans();
});*/

function mtrans() {
  for (let i = 0; i < 20; i++) {
    setTimeout(() => {
      MyCOMPort.write("mdata 0 85 2 100" + "\r\n", () => {});
      console.log(myMsgWord);
      if (portParser(myMsgWord) == 100) {
        console.log(`got it!`);
        MyCOMPort.write("mtrans 0 0 0 0" + "\r\n", () => {});
      }
    }, 500 * i);
  }
}

function runQueue(names) {
  console.log(names);
  for (let i = 0; i < names.length; i++) {
    setTimeout(() => {
      runScripts(names[i]);
    }, 3500 * i);
  }
  setTimeout(() => {
    namesArr.length = 0;
  }, 5000);
}

function scriptDBAdd(
  name,
  type,
  script_P_1, script_P_2, script_P_3, script_P_4, script_P_5, script_P_6,
  script_P_7, script_P_8, script_P_9, script_P_10, script_P_11, script_P_12,
  script_P_13, script_P_14, script_P_15, script_P_16, script_P_17, script_P_18,
  script_P_19, script_P_20, script_P_21, script_P_22, script_P_23, script_P_24
) {
  DBScripts.insert({
    NAME: name,
    TYPE: type, 
    SCRIPTpart_1: script_P_1, SCRIPTpart_2: script_P_2, SCRIPTpart_3: script_P_3, SCRIPTpart_4: script_P_4,
    SCRIPTpart_5: script_P_5, SCRIPTpart_6: script_P_6, SCRIPTpart_7: script_P_7, SCRIPTpart_8: script_P_8,
    SCRIPTpart_9: script_P_9, SCRIPTpart_10: script_P_10, SCRIPTpart_11: script_P_11, SCRIPTpart_12: script_P_12,
    SCRIPTpart_13: script_P_13, SCRIPTpart_14: script_P_14, SCRIPTpart_15: script_P_15, SCRIPTpart_16: script_P_16,
    SCRIPTpart_17: script_P_17, SCRIPTpart_18: script_P_18, SCRIPTpart_19: script_P_19, SCRIPTpart_20: script_P_20,
    SCRIPTpart_21: script_P_21, SCRIPTpart_22: script_P_22, SCRIPTpart_23: script_P_23, SCRIPTpart_24: script_P_24,
  });
}

function scriptDBReadNames(elementName) {//добавление имен скриптов и последовательностей команд в выпадающие списки
 // notificationScriptCommSeqenceNameChoiceFLAG = 0;
  let scriptsNamesObj = document.getElementById(elementName); //
  if (ScriptNamesFLAG == 1) {
    CSNmeFlag = 0;
    DBScripts.find({ TYPE: "JS" }, (err, docs) => {
      console.log(docs);
      let arrScriptsName = [];
      docs.map((data) => {
        let scriptName = data.NAME;
        arrScriptsName.push(scriptName);
      });
      for (let i = 0; i < docs.length; i++) {
        scriptsNamesObj[i] = new Option(arrScriptsName[i], arrScriptsName[i]);
      }

    });
  }
  if (CSNmeFlag == 1) {
    ScriptNamesFLAG = 0;
    DBScripts.find({ TYPE: "TXT" }, (err, docs) => {
      console.log(docs);
      let arrScriptsName = [];
      docs.map((data) => {
        let scriptName = data.NAME;
        arrScriptsName.push(scriptName);
      });
      for (let i = 0; i < docs.length; i++) {
        scriptsNamesObj[i] = new Option(arrScriptsName[i], arrScriptsName[i]);
      }
    });
  }
}

function runScripts(name) {
  let nullElem;
  commSequenceValues.length = 0;
  DBScripts.find({ NAME: name }, (err, docs) => {
    docs.map((values) => {
      commSequenceValues.push(values.SCRIPTpart_1, values.SCRIPTpart_2, values.SCRIPTpart_3, values.SCRIPTpart_4, values.SCRIPTpart_5, values.SCRIPTpart_6,
                              values.SCRIPTpart_7, values.SCRIPTpart_8, values.SCRIPTpart_9, values.SCRIPTpart_10, values.SCRIPTpart_11, values.SCRIPTpart_12,
                              values.SCRIPTpart_13, values.SCRIPTpart_14, values.SCRIPTpart_15, values.SCRIPTpart_16, values.SCRIPTpart_17, values.SCRIPTpart_18,
                              values.SCRIPTpart_19, values.SCRIPTpart_20, values.SCRIPTpart_21, values.SCRIPTpart_22, values.SCRIPTpart_23, values.SCRIPTpart_24,
      )
      if (values.TYPE == "TXT") {
        let timerTime = document.getElementById('setTimerTXT').value;
        if(timerTime == ''){
          timerTime = 1500;
        }
        for(let i=0; i<commSequenceValues.length; i++){
          if(commSequenceValues[i].length == 0){
            console.log(`index: ${i}`);
            nullElem = i;
            break;
          }
        }

        let REcommSequenceValues = commSequenceValues.slice(0, nullElem);
       
        console.log(`timer: ${timerTime}`);
        console.log("txt!!");
        console.log(`runscripts: ${commSequenceValues}`);
        console.log(REcommSequenceValues);
        for(let i=0; i<REcommSequenceValues.length; i++){
          setTimeout(()=>{
            MyCOMPort.write(REcommSequenceValues[i] + "\r\n", () => {});
          }, timerTime * i);
        }
        commSequenceReflection(REcommSequenceValues)
      }

      if (values.TYPE == "JS") {
        console.log("JS!!");
        let timerTime = document.getElementById('timerValueTXT').value;
        if(timerTime == ''){
          console.log(`${timerTime == ''}`);
          timerTime = 2500;
        }
        let scriptJSArr = []; //массив значений частей скрипта;
        let resultOne; //значение, полученное из ком порта в результате выполнения команды-части скрипта;
        //let indexOfValFComp = scriptJSArr.indexOf('if') + 3;//индекс значения, с которым нужно сравнить значение из ком порта;
        let valueForcomparison; //значение для сравнения с ответом из порта;
        let comparisonChar; //символ для сравнения;
        let comparisonRESequal; //результат сравнения, если значения равны (true/false);
        let comparisonRESless; //результат сравнения, если resultOne меньше valueForcomparison (true/false);
        let comparisonRESmorethan; //результат сравнения, если resultOne больше valueForcomparison (true/false);
        let delay_1 = document.getElementById('createScriptBlockPart_1TXTTimer').value;
        let delay_2 = document.getElementById('createScriptBlockPart_2TXTTimer').value;
        let delay_3 = document.getElementById('createScriptBlockPart_3TXTTimer').value;
        let delay_4 = document.getElementById('createScriptBlockPart_4TXTTimer').value; 
        let delay_5 = document.getElementById('createScriptBlockPart_5TXTTimer').value;
        let delay_6 = document.getElementById('createScriptBlockPart_6TXTTimer').value;
        let delay_7 = document.getElementById('createScriptBlockPart_7TXTTimer').value;
        let delay_8 = document.getElementById('createScriptBlockPart_8TXTTimer').value;
        let delay_9 = document.getElementById('createScriptBlockPart_9TXTTimer').value;
        let delay_10 = document.getElementById('createScriptBlockPart_10TXTTimer').value;
        let delay_11 = document.getElementById('createScriptBlockPart_11TXTTimer').value;
        let delay_12 = document.getElementById('createScriptBlockPart_12TXTTimer').value; 
        let delayArr = [
          'createScriptBlockPart_1TXTTimer', 'createScriptBlockPart_2TXTTimer', 'createScriptBlockPart_3TXTTimer', 'createScriptBlockPart_4TXTTimer',
          'createScriptBlockPart_5TXTTimer', 'createScriptBlockPart_6TXTTimer', 'createScriptBlockPart_7TXTTimer', 'createScriptBlockPart_8TXTTimer',
          'createScriptBlockPart_9TXTTimer', 'createScriptBlockPart_10TXTTimer', 'createScriptBlockPart_11TXTTimer', 'createScriptBlockPart_12TXTTimer',
        ]

        scriptJSArr.push(
          values.SCRIPTpart_1, values.SCRIPTpart_2, values.SCRIPTpart_3, values.SCRIPTpart_4, values.SCRIPTpart_5, values.SCRIPTpart_6,
          values.SCRIPTpart_7, values.SCRIPTpart_8, values.SCRIPTpart_9, values.SCRIPTpart_10, values.SCRIPTpart_11, values.SCRIPTpart_12
        );
         let nullJS;
        for(let i=0; i<scriptJSArr.length; i++){
          if(commSequenceValues[i].length == 0){
            console.log(`index: ${i}`);
            nullJS = i;
            break;
          }
        }

        let REscriptJSArr = scriptJSArr.slice(0, nullJS)
        console.log(scriptJSArr);
        console.log(REscriptJSArr);
        for (let i = 0; i < scriptJSArr.length; i++) {
          document.getElementById(megaTestJSValues[i]).value = scriptJSArr[i];
        }

        console.log(scriptJSArr.indexOf("if"));
        if(scriptJSArr.indexOf("if") !=-1){
        for (let i = 0; i < scriptJSArr.indexOf("if"); i++) {
          setTimeout(() => {
            console.log(scriptJSArr[i]);
            MyCOMPort.write(scriptJSArr[i] + "\r\n", () => {});
          }, timerTime * i);
        }

        setTimeout(() => {
          //setTimeout(()=>{
           // console.log(`myMsgWord: ${myMsgWord}`);
        //  },5000)
          console.log(`myMsgWord: ${myMsgWord}`);
          if (myMsgWord.indexOf("Ch") != -1) {
            resultOne = myMsgWord.slice(myMsgWord.indexOf("Ch") + 6, myMsgWord.length);
            console.log(`resultFromCom: ${resultOne}`);
          }
          
        }, scriptJSArr.indexOf("if") * timerTime);

        setTimeout(() => {
          if (
            scriptJSArr[scriptJSArr.indexOf("if") + 3].indexOf("mdata") == -1
          ) {
            valueForcomparison = scriptJSArr[scriptJSArr.indexOf("res") + 2];
            console.log(`valueForcomparison: ${valueForcomparison}`);
          }
        }, (scriptJSArr.indexOf("if") + 1) * timerTime);

        setTimeout(() => {
          comparisonChar = scriptJSArr[scriptJSArr.indexOf("if") + 2];
          console.log(`comparisonChar: ${comparisonChar}`);
          switch (comparisonChar) {
            case "=":
              comparisonRESequal = resultOne == valueForcomparison;
              console.log(`comparisonRESequal: ${comparisonRESequal}`);
              break;

            case "<":
              comparisonRESless = resultOne < valueForcomparison;
              console.log(`comparisonRESless: ${comparisonRESless}`);
              break;

            case ">":
              comparisonRESmorethan = resultOne > valueForcomparison;
              console.log(`comparisonRESmorethan: ${comparisonRESmorethan}`);
              break;
          }
        }, (scriptJSArr.indexOf("if") + 2) * timerTime);

        setTimeout(() => {
          if (comparisonRESequal == true) {
            console.log(scriptJSArr[scriptJSArr.indexOf("if") + 4]);
            MyCOMPort.write(
              scriptJSArr[scriptJSArr.indexOf("if") + 4] + "\r\n",
              () => {}
            );
          }

          if (comparisonRESless == true) {
            console.log(scriptJSArr[scriptJSArr.indexOf("if") + 4]);
            MyCOMPort.write(
              scriptJSArr[scriptJSArr.indexOf("if") + 4] + "\r\n",
              () => {}
            );
          }

          if (comparisonRESmorethan == true) {
            console.log(scriptJSArr[scriptJSArr.indexOf("if") + 4]);
            MyCOMPort.write(
              scriptJSArr[scriptJSArr.indexOf("if") + 4] + "\r\n",
              () => {}
            );
          }
        }, (scriptJSArr.indexOf("if") + 3) * timerTime);
        } else {
          for(let i=0; i<REscriptJSArr.length; i++){
            setTimeout(()=>{
              MyCOMPort.write(REscriptJSArr[i] + "\r\n",() => {} );
              console.log(REscriptJSArr[i])
            }, timerTime * i)
          }
        } 
      }
    });
  });
}

document.getElementById("notificationScriptOK").addEventListener("click", () => {
    if (
      document.getElementById("notificationScriptType").value != 0 &&
      document.getElementById("notificationScriptName").value != null
    ) {
      let scriptName = document.getElementById("notificationScriptName").value;
      //let scriptType = document.getElementById("notificationScriptType").value;
      let scriptType = 'JS';
      let scriptPart_1 = document.getElementById( "createScriptBlockPart_1TXT").value;
      let scriptPart_2 = document.getElementById("createScriptBlockPart_2TXT").value;
      let scriptPart_3 = document.getElementById( "createScriptBlockPart_3TXT").value;
      let scriptPart_4 = document.getElementById( "createScriptBlockPart_4TXT").value;
      let scriptPart_5 = document.getElementById( "createScriptBlockPart_5TXT").value;
      let scriptPart_6 = document.getElementById("createScriptBlockPart_6TXT").value;
      let scriptPart_7 = document.getElementById("createScriptBlockPart_7TXT").value;
      let scriptPart_8 = document.getElementById("createScriptBlockPart_8TXT").value;
      let scriptPart_9 = document.getElementById("createScriptBlockPart_9TXT").value;
      let scriptPart_10 = document.getElementById("createScriptBlockPart_10TXT").value;
      let scriptPart_11 = document.getElementById("createScriptBlockPart_11TXT").value;
      let scriptPart_12 = document.getElementById("createScriptBlockPart_12TXT").value;

      scriptDBAdd(
        scriptName,
        scriptType,
        scriptPart_1, scriptPart_2, scriptPart_3, scriptPart_4,
        scriptPart_5, scriptPart_6, scriptPart_7, scriptPart_8,
        scriptPart_9, scriptPart_10, scriptPart_11, scriptPart_12
      );
      openCloseMenus("notification", "none");
    }
  });


function commSequenceReflection(values) {//отображение частей скрипта или последовательности команд в предназначенных для них полях.
    for (let i = 0; i < values.length; i++) {
      document.getElementById(megaTestTXTValues[i]).value = values[i];
    }
}

function nonRunReflection(name){//отображение частей скрипта или последовательности команд в предназначенных для них полях.
  clearDBI(megaTestTXTValues)
  commSequenceValues.length = 0;
  DBScripts.find({ NAME: name }, (err, docs) => {
    docs.map((values) => {
      commSequenceValues.push(values.SCRIPTpart_1, values.SCRIPTpart_2, values.SCRIPTpart_3, values.SCRIPTpart_4, values.SCRIPTpart_5, values.SCRIPTpart_6,
                              values.SCRIPTpart_7, values.SCRIPTpart_8, values.SCRIPTpart_9, values.SCRIPTpart_10, values.SCRIPTpart_11, values.SCRIPTpart_12,
                              values.SCRIPTpart_13, values.SCRIPTpart_14, values.SCRIPTpart_15, values.SCRIPTpart_16, values.SCRIPTpart_17, values.SCRIPTpart_18,
                              values.SCRIPTpart_19, values.SCRIPTpart_20, values.SCRIPTpart_21, values.SCRIPTpart_22, values.SCRIPTpart_23, values.SCRIPTpart_24,
      )
      commSequenceReflection(commSequenceValues);
    })
  })
}



function writeCommSequenceToDB(//запись последовательности команд в базу данных.
  name, type, 
  script_P_1, script_P_2, script_P_3, script_P_4, script_P_5, script_P_6,
  script_P_7, script_P_8, script_P_9, script_P_10, script_P_11, script_P_12,
  script_P_13, script_P_14, script_P_15, script_P_16, script_P_17, script_P_18,
  script_P_19, script_P_20, script_P_21, script_P_22, script_P_23, script_P_24
) {
  DBScripts.insert({
    NAME: name, TYPE: type, 
    SCRIPTpart_1: script_P_1, SCRIPTpart_2: script_P_2, SCRIPTpart_3: script_P_3, SCRIPTpart_4: script_P_4, SCRIPTpart_5: script_P_5, SCRIPTpart_6: script_P_6,
    SCRIPTpart_7: script_P_7, SCRIPTpart_8: script_P_8, SCRIPTpart_9: script_P_9, SCRIPTpart_10: script_P_10, SCRIPTpart_11: script_P_11, SCRIPTpart_12: script_P_12,
    SCRIPTpart_13: script_P_13, SCRIPTpart_14: script_P_14, SCRIPTpart_15: script_P_15, SCRIPTpart_16: script_P_16, SCRIPTpart_17: script_P_17, SCRIPTpart_18: script_P_18,
    SCRIPTpart_19: script_P_19, SCRIPTpart_20: script_P_20, SCRIPTpart_21: script_P_21, SCRIPTpart_22: script_P_22, SCRIPTpart_23: script_P_23, SCRIPTpart_24: script_P_24,
  });
}

/*document.getElementById('commandSelectMegaTest').addEventListener('contextmenu', ()=>{
  console.log(document.getElementById('commandSelectMegaTest').value);
  let value = document.getElementById('commandSelectMegaTest').value;
  MyCOMPort.write(value + "\r\n",() => {});
})*/

document.getElementById('CLEARScriptPartsBut').addEventListener('click', ()=>{
  clearDBI(megaTestTXTValues);
})

document.getElementById('CLEARTxtcreateScriptBlock').addEventListener('click', ()=>{
  clearDBI(megaTestJSValues);
})

document.getElementById('megaTestCommsSequenceSave').addEventListener('click', ()=>{
  openCloseMenus('notificationSaveCS', 'block');//CommandSequence_
  document.getElementById('notificationScriptNameSaveCS').value = 'CommandSequence_';
});

document.getElementById('CANCELnotificationSaveCS').addEventListener('click', ()=>{
  openCloseMenus('notificationSaveCS', 'none');
});

document.getElementById('SAVEnotificationSaveCS').addEventListener('click', ()=>{
  let scriptName = document.getElementById("notificationScriptNameSaveCS").value;
  let scriptType = 'TXT';
  let script_1 = document.getElementById("scriptTXT_1").value;
  let script_2 = document.getElementById("scriptTXT_2").value;
  let script_3 = document.getElementById("scriptTXT_3").value;
  let script_4 = document.getElementById("scriptTXT_4").value;
  let script_5 = document.getElementById("scriptTXT_5").value;
  let script_6 = document.getElementById("scriptTXT_6").value;
  let script_7 = document.getElementById("scriptTXT_7").value;
  let script_8 = document.getElementById("scriptTXT_8").value;
  let script_9 = document.getElementById("scriptTXT_9").value;
  let script_10 = document.getElementById("scriptTXT_10").value;
  let script_11 = document.getElementById("scriptTXT_11").value;
  let script_12 = document.getElementById("scriptTXT_12").value;
  let script_13 = document.getElementById("scriptTXT_13").value;
  let script_14 = document.getElementById("scriptTXT_14").value;
  let script_15 = document.getElementById("scriptTXT_15").value;
  let script_16 = document.getElementById("scriptTXT_16").value;
  let script_17 = document.getElementById("scriptTXT_17").value;
  let script_18 = document.getElementById("scriptTXT_18").value;
  let script_19 = document.getElementById("scriptTXT_19").value;
  let script_20 = document.getElementById("scriptTXT_20").value;
  let script_21 = document.getElementById("scriptTXT_21").value;
  let script_22 = document.getElementById("scriptTXT_22").value;
  let script_23 = document.getElementById("scriptTXT_23").value;
  let script_24 = document.getElementById("scriptTXT_24").value;
  openCloseMenus('notificationSaveCS', 'none');
    writeCommSequenceToDB(
      scriptName, scriptType,
      script_1, script_2, script_3, script_4, script_5, script_6,
      script_7, script_8, script_9, script_10, script_11, script_12,
      script_13, script_14, script_15, script_16, script_17, script_18,
      script_19, script_20, script_21, script_22, script_23, script_24
    );
})
let CSNmeFlag = 0
document.getElementById('megaTestCommSequenceRunGet').addEventListener('click', ()=>{
  CSNmeFlag = 1;
  ScriptNamesFLAG = 0;
  openCloseMenus('notificationScriptNameRunPrintCS', 'block');
  scriptDBReadNames("SelectnotificationScriptNameRunPrintCSSelect");
  console.log(CSNmeFlag);
});

document.getElementById('CANCELnotificationScriptNameRunPrintCS').addEventListener('click', ()=>{
  openCloseMenus('notificationScriptNameRunPrintCS', 'none');
});

document.getElementById('PRINTnotificationScriptNameRunPrintCS').addEventListener('click', ()=>{
  let name = document.getElementById('SelectnotificationScriptNameRunPrintCSSelect').value;
  nonRunReflection(name);
  openCloseMenus('notificationScriptNameRunPrintCS', 'none');
});

/*document.getElementById('RUNnotificationScriptNameRunPrintCS').addEventListener('click', ()=>{
  let scriptName = document.getElementById('SelectnotificationScriptNameRunPrintCSSelect').value;
  runScripts(scriptName);
  nonRunReflection(scriptName);
  openCloseMenus('notificationScriptNameRunPrintCS', 'none');
})*/

// document.getElementById('getPromiseBut').addEventListener('click', ()=>{
//   console.log(portParser(myMsgWord));
//   commandGenerator(32, 1);
//   console.log(portParser(myMsgWord));
// })

document.getElementById('SETUPclearOutput').addEventListener('click', ()=>{
  document.getElementById('TxtRecievedSSetup').value = '';
})

document.getElementById('MEGATESTclearBut').addEventListener('click', ()=>{
  document.getElementById('TxtRecievedSMegaTest').value = '';
})

{/* <script type="text/javascript"> */}

// function to get each tab details
const tabs = document.querySelectorAll('[data-tab-value]') // вкладки
const tabInfo = document.querySelectorAll('[data-tab-info]') //непосредственно блоки с html
let activeTab;
tabs.forEach(tab => {
  tab.addEventListener('click', () => {
    const target = document.querySelector(tab.dataset.tabValue);
    tabInfo.forEach(tabInfo => {
      activeTab = target.id /*+'  '+ tabInfo.classList[1]*/;
      // console.log(target.id +'  '+ tabInfo.classList[1]);
      console.log(activeTab);
      changeCOMMonitorsFunc(activeTab);
      tabInfo.classList.remove('active');
    })
    target.classList.add('active');
  })
})

function changeCOMMonitorsFunc(id){
  if(id == undefined){
    console.log('now you on tab_1 after start of app')
    document.getElementById("TextRecieved").value = document.getElementById("TextRecieved").value + myMsgWord + "\r\n";
    document.getElementById("TxtRecievedTest").value = '';
    document.getElementById("TxtRecievedSSetup").value = '';
    document.getElementById("TxtRecievedSMegaTest").value = '';
  }

  if(id == 'tab_1'){
    console.log('now you on tab_1!')
    document.getElementById("TextRecieved").value = document.getElementById("TextRecieved").value + myMsgWord + "\r\n";
    document.getElementById("TxtRecievedTest").value = '';
    document.getElementById("TxtRecievedSSetup").value = '';
    document.getElementById("TxtRecievedSMegaTest").value = '';
  }

  if(id == 'tab_2'){
    console.log('now you on tab_2!')
    document.getElementById("TextRecieved").value = '';
    document.getElementById("TxtRecievedTest").value = document.getElementById("TxtRecievedTest").value + myMsgWord + "\r\n";
    document.getElementById("TxtRecievedSSetup").value = '';
    document.getElementById("TxtRecievedSMegaTest").value = '';
  }

  if(id == 'tab_4'){
    console.log('now you on tab_4!')
    document.getElementById("TextRecieved").value = '';
    document.getElementById("TxtRecievedTest").value = '';
    document.getElementById("TxtRecievedSSetup").value = document.getElementById("TxtRecievedSSetup").value + myMsgWord + "\r\n";
    document.getElementById("TxtRecievedSMegaTest").value = '';
  }

  if(id == 'tab_10'){
    console.log('now you on tab_4!')
    document.getElementById("TextRecieved").value = '';
    document.getElementById("TxtRecievedTest").value = '';
    document.getElementById("TxtRecievedSSetup").value = '';
    document.getElementById("TxtRecievedSMegaTest").value = document.getElementById("TxtRecievedSMegaTest").value + myMsgWord + "\r\n";
  }
}

document.getElementById('closeSerialConnectionBut').addEventListener('click', ()=>{
  MyCOMPort.close()
})