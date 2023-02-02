//const { del } = require("request-promise");

exports.MCStringParser = function  (MCString) {
    //теперь надо обнаружить сообщение delay XX (для начала 10) и вернуть 
    //MCreqArray[del,XX]
    //MCString = MCString + '\n\r'
    console.log(MCString);
    var MCreqArray = [];
    //ожидаемый формат команды [p,X] или [c,X] Этот парсер преобразует
    //строку в массив  MCreqArray[1]
    var myStartPattern = "cmd = [";
    var myStartPosition = MCString.indexOf(myStartPattern,0);
    var myStopPosition = MCString.indexOf(',',myStartPosition+8)

    if (myStartPosition == -1){
        myStartPattern = "delay";
        myStartPosition = MCString.indexOf(myStartPattern,0);
        if (myStartPosition == -1){
            myStartPattern = "disconnect";
            myStartPosition = MCString.indexOf(myStartPattern,0);
            if (myStartPosition == -1){return;}
            MCreqArray[0] = 'disconnect';
            return MCreqArray;
        }
        myStopPosition = MCString.indexOf(' ',myStartPosition+5)
        MCreqArray[0] = MCString.substring(myStartPosition, myStopPosition);
        myStartPosition = myStopPosition +1;
        myStopPosition = MCString.length;
        MCreqArray[1] = MCString.substring(myStartPosition, myStopPosition);
        return MCreqArray;
    }

    MCreqArray[0] = MCString.substring(myStartPosition+7, myStopPosition);
    myStartPosition=myStopPosition;
    myStopPosition = MCString.indexOf(']',myStartPosition)
    MCreqArray[1] = MCString.substring(myStartPosition+1, myStopPosition);

    return MCreqArray;
}

exports.MCPortSetup = function  (MyExchange) {
    console.log('com setup running');
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
        //MCArray = MyMCEngine.MCStringParser(MCdata);
        MyMCEngine.MCExchange(MCdata);
    })
    //return MCMPort;
}

exports.MCExchange = function  (MCdata) {

    var CurrentDate = new Date();
    //console.log(CurrentDate)
    document.getElementById("RecieveMonitorScreen").value = document.getElementById("RecieveMonitorScreen").value + '<<-' +
    CurrentDate.getHours() + ":" + ("0" + (CurrentDate.getMinutes()).toString()).slice(-2) + ":" + ("0" + (CurrentDate.getSeconds()).toString()).slice(-2) + " " + 
    MCdata +'\r\n';

    if (document.getElementById("monitorScroll").checked == true){
        document.getElementById("RecieveMonitorScreen").scrollTop = document.getElementById("RecieveMonitorScreen").scrollHeight;
    }

    MCArray = MyMCEngine.MCStringParser(MCdata);
    //console.log(MCArray);
    if (MCArray){
    console.log(MCArray);
    switch (MCArray[0]){
        case "p": 
            //fromMCString = MyMCEngine.fromMCReq([MCArray[1],MyCSVFile]);
            statusReplay([MCArray[1],MyCSVFile]).then(myReply=> {

                console.log(myReply);
                MCMPort.write('var 4 >p' + MCArray[1] + '\r\n', function(err) {
                    if (err) {return console.log('Error on write: ', err.message)}
                    console.log('message written')
                })
                MCMPort.write('var 3 >'  + myReply + '\r\n', function(err) {
                        if (err) {return console.log('Error on write: ', err.message)}
                console.log('message written')
                })
            })
            //console.log(fromMCString);
            //document.getElementById("RecieveMonitorScreen").value = document.getElementById("RecieveMonitorScreen").value + '<<-' +
            //CurrentDate.getHours() + ":" + ("0" + (CurrentDate.getMinutes()).toString()).slice(-2) + ":" + ("0" + (CurrentDate.getSeconds()).toString()).slice(-2) + " " + 
            //fromMCString +'\r\n';
        break;
        case "c": 
            console.log(" to box com port: " + MCArray[1])
            MyCOMPort.write(MCArray[1] + '\r\n', function(err) {
                if (err) {return console.log('Error on write: ', err.message)}
                console.log('message written')
            })
            MCMPort.write('var 4 OK \r\n', function(err) {
                if (err) {return console.log('Error on write: ', err.message)}
                console.log('message written')
            })
            let MVReply = MCArray[1].replace(' ', '').trim()
            MCMPort.write("var 3 >" + MVReply + '\r\n', function(err) {
                    if (err) {return console.log('Error on write: ', err.message)}
            console.log('message written')
            })
        break;
        case "delay": {
                if (MCArray[1]=='10'){
                    //if (MCArray[1]=='10'){
                    console.log(MCMPort);
                    MCMPort.write("rst\r\n", function(err) {
                        if (err) {return console.log('Error on write: ', err.message)}
                        console.log('thing restart in progress')
                        setTimeout(() => {  MyMCEngine.MCPortSetup(MyExchange);console.log('thing renstart in done'); }, 40000);
                        
                    }) 
                    }
            } 
        break;
        case "disconnect":{
            console.log(MCMPort);
            MCMPort.write("rst\r\n", function(err) {
                if (err) {return console.log('Error on write: ', err.message)}
                console.log('thing restart in progress')
                setTimeout(() => {MyMCEngine.MCPortSetup(MyExchange);console.log('thing renstart in done'); }, 40000);
                
            }) 
        }
    }
    }

}