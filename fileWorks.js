//exports.fileArchivator = function (incFileName,currentFileLength){
function fileArchivator (incFileName,currentFileLength){
    /*
    на входе массив на выходе архивированный файл.
    */
    console.log ("adv arc running")
    console.log (incFileName)

    //
    var MyArchChartStructure = setupData.MyArchChartStructure;
    var MyChartStructure = setupData.MyChartStructure
    var StatusWord = setupData.StatusWord 

    console.log (MyArchChartStructure)
    console.log (MyChartStructure)

    //console.log(setupData.MyArchChartStructure);
    //console.log (setupData.MyChartStructure)

    //Создаем слово конвертации
    let myArrayToSave = []
    let i=0

    console.log (incFileName);

    /*
    MyReadFile(incFileName).then(myRowData=> {
        //console.log ("in myread file");
        console.log (myRowData);
        return
    })
    */

    //var fileName = (incFileName[0].substr(0,incFileName[0].indexOf('.csv'))+'_ach.csv')

    var fileName = (incFileName.substr(0,incFileName.indexOf('.csv'))+'_ach.csv')
    var incFileName = (incFileName.substr(0,incFileName.indexOf('.csv'))+'_tmp.csv')

    console.log (fileName);
    console.log (incFileName);



    fs.open(fileName, 'wx', (err) => {
        if (err) {if (err.code === "EEXIST") {return;}
            else {
                throw err;
            }
        }
    //})
        //ChartArray[0][0] = "2022/04/07 17:55:30"
        //ChartArray[0] = "2022/04/07 17:55:30;rst;Init;63983;-150;24.75;-150;8.43;-150;-150;24;261;251;n/a;0;0;390"
        console.log (ChartArray[0][0])
        let myStartMoment =  new Date(ChartArray[0][0]);
        let myStartMomentForFile =  ChartArray[0][0]

        let countNumber = 0

        //let ArcStructure = MyAchFile.AchStructGener(MyChartStructure,StatusWord)
        let ArcStructure = AchStructGener(MyChartStructure,StatusWord)

        console.log(ArcStructure)
        console.log(ChartArray)

        var CollectedString = []

        for (let i=0; i<ArcStructure.length; i++){
            CollectedString.push(0)
        }
    
        console.log(CollectedString)

        // incoming array per string ELEMENT iterating
        ChartArray.forEach(element => {

        let myStopMoment =  new Date(element[0]);
        let myStopMomentForFile =  element[0];
        let timeInterval = daysHoursETC(myStopMoment-myStartMoment)

        if (timeInterval[2]<=10){
            countNumber ++

            let i = 0

            // arc rule iterating
            //console.log(ArcStructure)
            ArcStructure.forEach(AchWay => {
                    
            if (AchWay.Mode == "ArcAsInt") {
                CollectedString[i] = CollectedString[i] + parseInt(element[AchWay.Position],10);
                i++
            }
            else if(AchWay.Mode == "ArcAsFloat"){
                CollectedString[i] = CollectedString[i] + parseFloat(element[AchWay.Position]);
                i++
            }
            else if(AchWay.Mode == "Parsed"){
                myParsedByte = byteParsing(element[AchWay.ParseSource+1],StatusWord)
                //console.log(myParsedByte)
                //for (let j = 0; myParsedByte.length; j++){
                CollectedString[i] = CollectedString[i] + parseInt(myParsedByte[AchWay.ParsedBit],10);
                //console.log(CollectedString[i])
                i++
                //}
            }
            else {i++}
            })
            //if(15<timeInterval[2]){console.log ('too long')}
            }
            else {
                // integration procedure
                //console.log(myStartMoment)

                //console.log(countNumber)
                //console.log(CollectedString)

                // integration
                if (countNumber != 0){
                    //console.log("wrong count")

                    for (let i = 0; i < CollectedString.length; i++) {
                        CollectedString[i]=((CollectedString[i]/countNumber).toFixed(2))
                    }

                    //date forming

                    let myDateToSave = new  Date(myStopMoment)
                    let MyAchStringToSave = myDateToSave.getFullYear()+"/"+(myDateToSave.getMonth()+1)+"/"+ myDateToSave.getDate()+ 
                    " " + myDateToSave.getHours()+ ":" + myDateToSave.getMinutes()+";"

                    //output string generation
                    for (let i =0; i<CollectedString.length; i++)
                    {
                        MyAchStringToSave = MyAchStringToSave + CollectedString[i] + ';'
                    }
                    MyAchStringToSave = MyAchStringToSave + '\r\n';

                    //output array forming
                    myArrayToSave.push(MyAchStringToSave.toString())
                }

                //variable Reset

                myStartMoment = myStopMoment;
                myStartMomentForFile=myStopMomentForFile

                for (let i=0; i<ArcStructure.length; i++){
                    CollectedString[i]=0
                }

                countNumber = 0

            }
                
        
            })

            console.log(myArrayToSave)
            const outStream = fs.createWriteStream(fileName)
            const outPath = outStream.path
            myArrayToSave.forEach(val => outStream.write(val))

            outStream.end()

    })

}

// Генерит Сктруктуру архивированного окна
//exports.AchStructGener = function (MyChartStructure,StatusWord){
function AchStructGener(MyChartStructure,StatusWord){

    let ArcStructure = []
    let ElShift = 0

    console.log(MyChartStructure)
    console.log(StatusWord)

    MyChartStructure.forEach((Stract,StractIndex) => {    
        if (Stract.Display){
            //    {"Position":1,"Name":"Sinse restart","Display":true,"fill":false,"axis":"y","units":"ms","r":128,"g":0,"b":0}, 
            if (Stract.AchMode != "ParseAsByte"){
                var ArcWord = new Object() 
                ArcWord.Position = Stract.Position
                ArcWord.Name = Stract.Name
                ArcWord.Display = true
                ArcWord.Mode = Stract.AchMode
                ArcWord.fill = Stract.fill
                if (StractIndex == 0){ ArcWord.axis = "y"} else {ArcWord.axis = "y" + StractIndex.toString(10)}
                ArcWord.units = Stract.units
                ArcWord.r = Stract.r
                ArcWord.g = Stract.g
                ArcWord.b = Stract.b
                //ArcWord.Pos = StractIndex + ElShift
                ArcStructure.push(ArcWord)
            }
            else{
                let i = 0
                StatusWord.forEach((MyBite) => {
                    if (MyBite != null) {
                        var ArcWord = new Object() 
                        ArcWord.Position = Stract.Position + i
                        ArcWord.Name =  MyBite
                        ArcWord.Display = true
                        ArcWord.Mode = "Parsed"
                        ArcWord.fill = Stract.fill
                        ArcWord.axis = Stract.axis
                        ArcWord.axis = "y" + (StractIndex + i).toString(10)
                        ArcWord.units = Stract.units
                        ArcWord.r = Stract.r + (10*i)
                        ArcWord.g = Stract.g
                        ArcWord.b = Stract.b
                        ArcWord.ParsedBit = i
                        ArcWord.ParseSource = StractIndex + ElShift
                        ArcStructure.push(ArcWord)
                        //i ++
                    }
                    i ++  
                })
            }
        }
        else{
            ElShift++
        }
    })
    console.log(ArcStructure)
    return(ArcStructure)
}

function MyStringOperator(MyIncStream){
    /*19.08.2021: selects string from stream (MyIncStream); calls MyString () and load result into ChartArray; 

    */
    //let ChartArray = [];
    console.log("MyStringOperator started")
    let MyDelim = ";";
    let remaining = MyIncStream;

    let index = remaining.indexOf('\n');

    while (index > -1) {

        let line = remaining.substring(0, index);
    
        if (line.length > 1  ){
            //console.log(line)
            let newString = MyString(line);
            //console.log(newString)
            if (newString.length !=0){ChartArray.push(newString)}
        }
        remaining = remaining.substring(index + 1);
        //index = remaining.indexOf('\n');
        index = remaining.indexOf("\n");
    }
    console.log(ChartArray)
    console.log("MyStringOperator over")
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

    //if (LogFileName[0].indexOf("ach") == -1) { return myStringCorrection(MyStringArrow)} 
    //else{ return MyStringArrow}
    return MyStringArrow;
}

function fileArchivatorforStatus (incFileName,incArray){
    var MyArchChartStructure = setupData.MyArchChartStructure;
    var MyChartStructure = setupData.MyChartStructure
    var StatusWord = setupData.StatusWord 
    let myArrayToSave = []

    console.log (MyArchChartStructure)
    console.log (MyChartStructure)
    console.log (incArray)
    console.log (incFileName);

    var arcFileName = (incFileName.substr(0,incFileName.indexOf('.csv'))+'_ach.csv')

    console.log (arcFileName)
    MyStringOperator(incArray);

    console.log (ChartArray[0][0])
    let myStartMoment =  new Date(ChartArray[0][0]);
    let myStartMomentForFile =  ChartArray[0][0]
    let countNumber = 0
    let ArcStructure = AchStructGener(MyChartStructure,StatusWord)

    console.log(ArcStructure)
    console.log(ChartArray)

    var CollectedString = []

    for (let i=0; i<ArcStructure.length; i++){
        CollectedString.push(0)
    }

    console.log(CollectedString)

    let i =0
    ChartArray.forEach(element => {

    console.log(element)
    console.log(i)
    i++

    let myStopMoment =  new Date(element[0]);
    let myStopMomentForFile =  element[0];
    let timeInterval = daysHoursETC(myStopMoment-myStartMoment)

    if (timeInterval[2]<=10){
        countNumber ++

        let i = 0

        ArcStructure.forEach(AchWay => {
                
        if (AchWay.Mode == "ArcAsInt") {
            CollectedString[i] = CollectedString[i] + parseInt(element[AchWay.Position],10);
            i++
        }
        else if(AchWay.Mode == "ArcAsFloat"){
            CollectedString[i] = CollectedString[i] + parseFloat(element[AchWay.Position]);
            i++
        }
        else if(AchWay.Mode == "Parsed"){
            myParsedByte = byteParsing(element[AchWay.ParseSource+1],StatusWord)
            CollectedString[i] = CollectedString[i] + parseInt(myParsedByte[AchWay.ParsedBit],10);
            i++
        }
        else {i++}
        })
        }
        else {

            if (countNumber != 0){
                //console.log("wrong count")

                for (let i = 0; i < CollectedString.length; i++) {
                    CollectedString[i]=((CollectedString[i]/countNumber).toFixed(2))
                }

                let myDateToSave = new  Date(myStopMoment)
                let MyAchStringToSave = myDateToSave.getFullYear()+"/"+(myDateToSave.getMonth()+1)+"/"+ myDateToSave.getDate()+ 
                " " + myDateToSave.getHours()+ ":" + myDateToSave.getMinutes()+";"

                for (let i =0; i<CollectedString.length; i++)
                {
                    MyAchStringToSave = MyAchStringToSave + CollectedString[i] + ';'
                }
                MyAchStringToSave = MyAchStringToSave + '\r\n';

                myArrayToSave.push(MyAchStringToSave.toString())
            }

            //variable Reset

            myStartMoment = myStopMoment;
            myStartMomentForFile=myStopMomentForFile

            for (let i=0; i<ArcStructure.length; i++){
                CollectedString[i]=0
            }

            countNumber = 0

        }
            
    
        })

        console.log(myArrayToSave)
        const outStream = fs.createWriteStream(arcFileName)
        const outPath = outStream.path
        myArrayToSave.forEach(val => outStream.write(val))

        outStream.end()

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

module.exports = {fileArchivator,AchStructGener,MyStringOperator,MyReadFile,fileArchivatorforStatus} 