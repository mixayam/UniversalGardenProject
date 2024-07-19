const SerialPort = require ('serialport')
// var MyAnswer = "here is answer";
//05.11.2020 Работает, умеет запрашивать список портов

exports.SerialList  =  async function() {
   
   console.log ('here is Serial list running');  
   
   return SerialPort.list().then(
   ports => {

	   return ports
	   
   },
   err => console.error(err)
   )}
  
exports.SerialClosed = async function() {
	console.log ('here is Serial CLOSE running');
	//self.serialPort.close();
}