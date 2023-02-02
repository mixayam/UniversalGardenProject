const SerialPort = require ('serialport')
var MyAnswer = "here is answer";
//05.11.2020 Работает, умеет запрашивать список портов

exports.SerialList  =  async function() {
   
   console.log ('here is Serial list running');  
   
   return SerialPort.list().then(
   ports => {

	   return ports
	   
   },
   err => console.error(err)
   )}

exports.ComPortSetup  =  async function(MyComName, MyComBaud, MyComDelim) {
   //подготовка,передаются переменные для порта
   console.log ('here is Serial SETUP running');
   console.log (MyComName);
   console.log (MyComBaud);
   console.log (MyComDelim);
   return MyAnswer;
   	//MyCOMPort = new SerialPort(document.getElementById("ComNameSelect").value, {
    // baudRate: Number(document.getElementById("COMPortRate").value),
	 //parser: new SerialPort.parsers.Readline({ delimiter: '\r\n' })
     //}, function (err) {	
     // if (err) {
	 //  document.getElementById("ComPortOpenButton").value = document.getElementById("ComNameSelect").value + ' is not available! Reason is:' + err.message;
	 //  document.getElementById("SendButton").disabled = true;
	 //  return console.log('Error: ', err.message)
     // }
     //}	
	//)
   
  }
  
exports.SerialClosed = async function() {

	console.log ('here is Serial CLOSE running');
	//self.serialPort.close();
}