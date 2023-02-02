//1/12/2021 operational. Can archivate file and display it. Arc function is inside.
// Arc function is in external file
console.log("chart is going to be opened")
const  ipcRenderer = require ('electron').ipcRenderer;
const fs = require('fs');
var Chart = require('chart.js');
const MyAchFile = require('./fileWorks');
const fileWorks = require('./fileWorks');
const setupData = require('./setupData');

var myWayToDisplay = "1";
var LogFileName;


var visibleStartData = document.getElementById("startDate").value
var visibleStopData = document.getElementById("stopDate").value

var isStarting = true

var lineChartData = setupData.lineChartData
var MyChartStructure = setupData.MyChartStructure
var MyArchChartStructure = setupData.MyArchChartStructure

var StatusWord   = setupData.StatusWord

var NewChartStructure = []

var ChartArray = [];   

var ctx = document.getElementById('canvas'); //

var myChart = new Chart(ctx, {
    type: 'line',
    data: lineChartData,
    options: {
        responsive: true,
        interaction: {
            mode: 'index'
        },
        stacked: false,
        plugins: {
            title: {
                display: true,
            }
        },
        scales: {
            //yAxes: [] = myYAxes
            yAxes: [] 
        }
    }
});

ipcRenderer.on('ChartsUpdateRequest',(event,arg) => {
    console.log ("ipcRenderer ChartsUpdateRequest start ")
    LogFileName = arg;

    MyReadFile(LogFileName).then(myRowData=> {
        //MyStringOperator(myRowData);
        fileWorks.MyStringOperator(myRowData);

        console.log ("ipcRenderer file reading is over")
        console.log (isStarting) 
        console.log (ChartArray)

        if (isStarting == true){

            if (LogFileName[0].indexOf("ach") == -1) {
                NewChartStructure = initChartPaint (MyChartStructure,StatusWord) //настройка на сырой файл
            } 
            else{
                //настройка на архивный файл
                //NewChartStructure = initChartPaint (MyAchFile.AchStructGener(MyArchChartStructure,StatusWord),StatusWord)
                NewChartStructure = initChartPaint (MyArchChartStructure,StatusWord)
            }
            
            console.log(NewChartStructure);

            lineChartData.datasets = NewChartStructure[0]

            myChart.data = lineChartData
            myChart.options.scales.yAxes = NewChartStructure[1]

            console.log(lineChartData);
        }
        else{
            myChartPaint(myWayToDisplay);
        }
    console.log ("ipcRenderer ChartsUpdateRequest is over ")
    })

})

//console.log(MyChartStructure);   

ipcRenderer.send('ChartIsReady', true);  

window.onbeforeunload = (e) => {
    ipcRenderer.send('ChartIsReady', false);
}

document.getElementById("RefreshButton").addEventListener("click", function (e) {
    ipcRenderer.send("LogUpdateEvent",LogFileName)
})

document.getElementById("intervalToDisplay").addEventListener("click", function (e) {
    myWayToDisplay = document.getElementById("intervalToDisplay").value;
    //console.log(document.getElementById("intervalToDisplay").value);
    myChartPaint(myWayToDisplay);
    //readLinesFromLog('chartsTest.csv',myIntToDisplay);    

})

document.getElementById('canvas').addEventListener("click", function (e) {

    console.log("CANVAS CLICK started");
    //console.log(myChart)
    //console.log(myChart.options.scales)
    //console.log (isStarting)
    if (isStarting){

        lineChartData.datasets.forEach(el => {
         el._meta[0].hidden = true;
        })

        //isStarting=false
    }
    else {
        lineChartData.datasets.forEach((el,i)=>{
            let myNumber 
            //if (i<=11) {myNumber=i} else {myNumber = 11}
            myNumber=i
            if(el._meta[0].hidden == true) {myChart.options.scales.yAxes[myNumber].display=false} else {myChart.options.scales.yAxes[myNumber].display=true}
        })
        myChart.update();
    }
    console.log("CANVAS CLICK is over");
})

document.getElementById("FileWorks").addEventListener("click", function (e) {
    console.log("My file work")
    
    MyAchFile.fileArchivator(LogFileName+'tst',48)

})

document.getElementById("stopDate").addEventListener("input", function (e) {
    if (visibleStopData != document.getElementById("startDate").value){
        //mySelectedChartPaint(document.getElementById("startDate").value,document.getElementById("stopDate").value)
        myChartPaint(undefined,document.getElementById("startDate").value,document.getElementById("stopDate").value)
    }
    
})

document.getElementById("startDate").addEventListener("input", function (e) {
    if (visibleStartData != document.getElementById("stopDate").value){
        //mySelectedChartPaint(document.getElementById("startDate").value,document.getElementById("stopDate").value)
        myChartPaint(undefined,document.getElementById("startDate").value,document.getElementById("stopDate").value)
    }
    
})

document.getElementById("AchRunning").addEventListener("click", function (e) {
    console.log("Arc button")

    if (LogFileName[0].indexOf("ach") != -1) {
        alert("File " + LogFileName + " is archivated already! WTF!!!")
        return
    } 
    
    var fileName = (LogFileName[0].substr(0,LogFileName[0].indexOf('.csv'))+'_ach.csv')
    console.log (fileName);

    fs.stat(fileName, (err) => {
        console.log(err)
        if (err==null){console.log("file exists")
        alert("File " + fileName + " already exists! Delete it first!")
    }
        else if(err.code === 'ENOENT'){console.log("no such file")
        MyAchFile.fileArchivator(LogFileName)
    }
    })
    //myArcFile(LogFileName)
})



//разборка строки
function MyString (Myline) {
    //console.log("line from line = " + Myline + " Len = " + Myline.length)
    //console.log("Myline started")
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

    MyStringArrow[i] = Myline.toString();
    //console.log(MyStringArrow)
    //console.log("Myline OVER")

    if (LogFileName[0].indexOf("ach") == -1) { return myStringCorrection(MyStringArrow)} 
    else{ return MyStringArrow}

}

//дни минуты сек
function daysHoursETC(msInterval){
    //console.log("msInterval" + msInterval)
    const dayInMs = 86400000;
    const hourInMs = 3600000;
    const minInMs = 60000;
    let myDays = Math.floor(msInterval/dayInMs);
    let myHours = Math.floor((msInterval - myDays*dayInMs)/hourInMs);
    let myMinutes = Math.floor((msInterval-myDays*dayInMs-myHours*hourInMs)/minInMs)
    return [myDays,myHours,myMinutes];
}

//чтение файла
function MyReadFile(MyChartFileName){
    //console.log("MyReadFile started");
    return new Promise (function (resolve,reject) {
        //console.log("MyReadFile Promise started");
        ChartArray = [];
        
        fs.readFile(MyChartFileName.toString(),(err,myStream) => { 
            var myStream;
            if(err) throw err;
            //console.log("ChartArray in operator = " + ChartArray);
            resolve(myStream.toString());
        })
        //console.log("MyReadFile Promise is over");
    })       
}

function myChartPaint(timeInterval,startDate,stopDate){
    /*для работы с осью Х:
    1. Находим последнюю дату в массиве ChartArray (myCurrentMoment)
    2. Находим стартовую дату myStart как разницу между myCurrentMoment и требуемым сдвигом (myTimeShift)
    3. Формируем myChart.data.labels и dataSetArray как то, что больше myStart
    Переменная timeInterval принимает значения:

    1. as is
    2. last hour
    3. last 24 hours
    4. last 48 hours

    */
    
    //console.log("myChartPaint start")
    console.log(lineChartData)

    if (isStarting == true){ //если это запуск, то погасить все оси

        lineChartData.datasets.forEach(el => {
        el._meta[0].hidden = true;
        })

        isStarting=false
    }

    //console.log(startDate)
    //console.log(stopDate)

    myChart.data.labels = [];
    //console.log(ChartArray)
    //console.log(ChartArray.length)

    if (ChartArray.length == 0){ //если основной массив не сформирован, выходим, рисовать еще нечего
        isStarting = true
        return
    }

    let myCurrentMoment =  new Date(ChartArray[ChartArray.length-1][0]);
    let myFistTimeValue = new Date(ChartArray[0][0])
    let myStart = myFistTimeValue;
    let myStop = myCurrentMoment;
    let myUnitID = ChartArray[0][2]

    let myDateDetails = daysHoursETC(myCurrentMoment.getTime()- myFistTimeValue.getTime());
    document.getElementById("AxilX").value = "log file for Unit # " + myUnitID + " started at " + ChartArray[0][0] + " , length = " +  myDateDetails[0]
    + " days " + myDateDetails[1] + " hours " + myDateDetails[2] + " minutes " ;

    document.getElementById("startDate").value = myFistTimeValue.getFullYear() + "-" + (myFistTimeValue.getMonth()+1).toString().padStart(2,"0") + "-" + myFistTimeValue.getDate().toString().padStart(2,"0")
    document.getElementById("stopDate").value = myCurrentMoment.getFullYear() + "-" + (myCurrentMoment.getMonth()+1).toString().padStart(2,"0") + "-" + myCurrentMoment.getDate().toString().padStart(2,"0")

    myChart.data.datasets.forEach((el)=> {el.pointRadius= 0})

    //console.log(timeInterval)
    switch (timeInterval) {
        case "1":
            console.log("case Init value")
            myStart = myFistTimeValue; 
            break;
        case "2":
            myStart = myCurrentMoment - 3600000; console.log("Last hour");
            myChart.data.datasets.forEach((el)=> {el.pointRadius= 5})
            break;
        case "3": myStart = myCurrentMoment - 86400000; console.log("Last 24 hours"); break;
        case "4": myStart = myCurrentMoment - 172800000; console.log("Last 48 hours"); break;
        default:  
            //startDate = startDate + " 00:00:00"
            //stopDate = stopDate + " 00:00:00"
            //console.log(startDate)
            //console.log(stopDate) 
            
            let mySelectedStart = new Date(startDate);
            let mySelectedStop= new Date(stopDate);

            myStart = mySelectedStart
            myStop = mySelectedStop

            myDateDetails = daysHoursETC(myStop.getTime()- myStart.getTime());
            //myDateDetails = daysHoursETC(stopDate.getTime()- startDate.getTime());

            document.getElementById("AxilX").value = "Selection for " +  myDateDetails[0]
            + " days " + myDateDetails[1] + " hours " + myDateDetails[2] + " minutes " ;
        
            document.getElementById("startDate").value = mySelectedStart.getFullYear() + "-" + (mySelectedStart.getMonth()+1).toString().padStart(2,"0") + "-" + mySelectedStart.getDate().toString().padStart(2,"0")
            document.getElementById("stopDate").value = mySelectedStop.getFullYear() + "-" + (mySelectedStop.getMonth()+1).toString().padStart(2,"0") + "-" + mySelectedStop.getDate().toString().padStart(2,"0")
        
            //myStart = new Date(startDate);
            //myStop= new Date(stopDate);
            //console.log(myStart)
            //console.log(myStop) 
            break;
    }

    visibleStartData = document.getElementById("startDate").value
    visibleStopData = document.getElementById("stopDate").value

    myChart.data.datasets.forEach((el,i) => {
        el.data = []
        //console.log(el.data.length) очистка графика
    })

    ChartArray.forEach((item, index, array) => {
            let myItem = new Date(item[0])
            //console.log(myItem)
            if ((myItem.getTime() >= myStart) && (myItem.getTime() <= myStop)) {
                myChart.data.labels.push(item[0]);
                
                let myParsedByte = []
                let bitCounter = 0

                myChart.data.datasets.forEach((el,i) => {

                    if (el.BitParsed == false){

                        myParsedByte = []
                        el.data.push(item[el.Position])
                    }
                    else{
                        //console.log("Parsing will be here")

                        if (myParsedByte.length == 0) {
                            
                            let MyRowBite = []
                            MyRowBite = byteParsing(item[el.Position])
                            let MyFinalBitConter = 0
                            StatusWord.forEach((StatEl,BitIndex)=>{
                            if (StatEl != null){
                                myParsedByte[MyFinalBitConter] = MyRowBite[BitIndex]
                                MyFinalBitConter ++
                            }  
                            })
                            //console.log(myParsedByte)
                            bitCounter = 0
                        }

                        el.data.push(myParsedByte[bitCounter])
                        bitCounter ++

                    }
                })
            }
    });

    console.log(myChart)
    myChart.update();
    console.log("myChartPaint is over")
}


function byteParsing(myByte,whatToshow){
    //console.log (whatToshow)
    let myMover = 1;
    let myOutByte = [];
    //let i = 0;
    for (let i = 0; i<=15; i++)
    {

        //if (whatToshow[i] != null){
            //if ((parseInt(myByte,10) & myMover)!= 0){myOutByte.push(1)} else {myOutByte.push(0)}
            if ((parseInt(myByte,10) & myMover)!= 0){myOutByte[i]=1} else {myOutByte[i]=0}
        //}

        myMover = myMover << 1;
        //console.log (myMover)
    }
    return myOutByte;
}

function myStringCorrection(MyStringArrow){
    //let stringPattern = [0,0,0,4294967296,100,100,100,100,1000,2000,0,2000,2000,0]
    let stringPattern = [0,0,0,0,100,100,100,100,1000,2000,0,2000,2000,32768]
    //let stringPattern = [0,0,100,100,100,100,1000,2000,0,2000,2000,32768]
    let errFlag=false;

    for(let i=0; i < MyStringArrow.length; i++){
        if (MyStringArrow[i].toString().length == 0){
            errFlag=true;
        }
        if (stringPattern[i] !=0){
            if (Math.abs(Number(MyStringArrow[i])) > Math.abs(Number(stringPattern[i])) ){
                errFlag=true;
            }
        }
    }

    //if  (errFlag) {MyStringArrow =[]}
    return MyStringArrow;
}

// Возвращает MyDataSet и myYAxes, необходимые для диаграммы
function initChartPaint(MyChartStructure,StatusWord){
    console.log("initChartPaint started")
    console.log(MyChartStructure)
    console.log(StatusWord)

    let MyDataSet = []
    let myYAxes = []
    
    MyChartStructure.forEach((el,index)=>{
        let elShift = 0
        let elPosition = 0
    
        var MyData = new Object()
        var MyY = new Object()
    
        MyY.id = el.axis
        
    
        if (el.Display == true) {
    
            MyY.display = false
            if (el.units == "celc") {MyY.position = 'left'} else {MyY.position = 'right'}
    
            if (!el.parsing) {
                MyData.label = el.Name
                MyData.borderColor = 'rgba(' + el.r + ', ' + el.g + ', ' + el.b + ', 1)'
                MyData.backgroundColor = MyData.borderColor
                MyData.fill = el.fill
                MyData.data = []
                MyData.showLine = el.Display
                MyData.BitParsed = false
                MyData.Shift = elShift
                //MyData.Position = elPosition
                MyData.Position = el.Position
    
                if (index !=0) {MyData.yAxisID = "y" + index} else {MyData.yAxisID = "y"}
    
                //console.log(MyData.yAxisID)
                MyDataSet.push(MyData)
    
                MyY.id = MyData.yAxisID
                myYAxes.push(MyY)
    
                //elPosition ++
            }
            else {
                let MyBitCounter = 0
    
                StatusWord.forEach((StatEl)=>{
    
                    var MyData = new Object()
                    var MyY = new Object()
    
                    MyY.display = false
                    //for (let i=0; i<16; i++){
                    //console.log(i)
                    //console.log(StatEl)
                    //if (StatusWord[i] != null){
                    if (StatEl != null){
                        MyData.label = StatEl
                        MyData.borderColor = 'rgba(' + el.r + ', ' + el.g + ', ' + el.b + ', 1)'
                        MyData.backgroundColor = MyData.borderColor
                        MyData.fill = el.fill
                        MyData.data = []
                        MyData.showLine = el.Display
                        MyData.BitParsed = true
                        MyData.Shift = elShift
                        MyData.Position = el.Position + MyBitCounter
    
                        //console.log(index)
                        //console.log(MyBitCounter)
    
                        MyData.yAxisID = "y" + (index + MyBitCounter)
                    
    
                        MyY.id = MyData.yAxisID
    
                        //console.log(MyData)
                        //console.log(MyY)
    
                        MyDataSet.push(MyData)
                        myYAxes.push(MyY)
                    
                        MyBitCounter ++
                        elPosition ++
                    }
            })
            }
    
        }
        else {elShift ++}
        elPosition ++
    })
    console.log(MyDataSet)
    console.log(myYAxes)
    console.log("initChartPaint is over")
    return [MyDataSet,myYAxes]

}

