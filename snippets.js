

//парсер. строка 113
                /*if(MyData.indexOf('Status')!== -1){
				document.getElementById('StatusRecieved').value = MyData.slice(0, 30);
				var SymBord = document.getElementById('StatusRecieved').value.indexOf('(');
				var Code = document.getElementById('StatusRecieved').value.slice(7, SymBord);
				console.log(Code);
				if ((Code & 1)!=0){document.getElementById('ByteParced_0').value = " gearAlarmFlag 1 Ошибка по приводу, нет импульсов от тахометра"};
				if ((Code & 2)!=0){document.getElementById('ByteParced_1').value = "gearStopFlag 1 Получена команда об остановке"};
				if ((Code & 4)!=0){document.getElementById('ByteParced_2').value = " 1 Работает powerKeeping (поддержание оборотов)"};
				if ((Code & 8)!=0){document.getElementById('ByteParced_3').value = "1 Включен двигатель, мощность не регулируется "};
				if ((Code & 16)!=0){document.getElementById('ByteParced_4').value = " получен фронт по ИК"};
				if ((Code & 32)!=0){document.getElementById('ByteParced_5').value = "запрет счета оборотов при их измерениях"};
				if ((Code & 64)!=0){document.getElementById('ByteParced_6').value = "долгое ИК излучение"};
				if ((Code & 128)!=0){document.getElementById('ByteParced_7').value = "напряжение меньше 3 - х вольт"};
				if ((Code & 256)!=0){document.getElementById('ByteParced_8').value = "инициализация при включении еще не прошла"};
				if ((Code & 512)!=0){document.getElementById('ByteParced_9').value = "движение на пониженной скорости"};
				if ((Code & 1024)!=0){document.getElementById('ByteParced_10').value = "импульсы от старой системы"};
				if ((Code & 2048)!=0){document.getElementById('ByteParced_11').value = "другие причины"};
				if ((Code & 4096)!=0){document.getElementById('ByteParced_12').value = "другие причины или ошибки"};
				if ((Code & 8182)!=0){document.getElementById('ByteParced_13').value = "включен тестовый режим, мощность не регулируется"};
				if ((Code & 16364)!=0){document.getElementById('ByteParced_14').value = "VALUE XX"};
				if ((Code & 32728)!=0){document.getElementById('ByteParced_15').value = "VALUE XXX"};*/
				/*console.log(Code & 1);
				console.log(Code & 2);
				console.log(Code & 4);
				console.log(Code & 8);
				console.log(Code & 16);
				console.log(Code & 32);
				console.log(Code & 64);
				console.log(Code & 128);
				console.log(Code & 256);
				console.log(Code & 512);
				console.log(Code & 1024);
				console.log(Code & 2048);
				console.log(Code & 4096);
				console.log(Code & 8182);
				console.log(Code & 16364);
				console.log(Code & 32728);
			}*/
			/*if(MyData.indexOf('Voltage')!== -1){
				document.getElementById('VoltageRecieved').value = MyData.slice(0, 30);
				//console.log(MyData.slice(0, 30));
			}
			if(MyData.indexOf('Allow r')!== -1){
				document.getElementById('AllowrRecieved').value = MyData.slice(0, 30);
				//console.log(MyData.slice(0, 30));
			}
			if(MyData.indexOf('Allow R')!== -1){
				document.getElementById('AllowRRecieved').value = MyData.slice(0, 30);
				//console.log(MyData.slice(0, 30));
			}
			if(MyData.indexOf('Config 1')!== -1){
				document.getElementById('ConfigRecieved').value = MyData.slice(0, 30);
				//console.log(MyData.slice(0, 30));
			}
			if(MyData.indexOf('Gear 2')!== -1){
				document.getElementById('GearRecieved').value = MyData.slice(0, 30);
				//console.log(MyData.slice(0, 30));
			}
			if(MyData.indexOf('IR')!== -1){
				document.getElementById('IRRecieved').value = MyData.slice(0, 30);
				//console.log(MyData.slice(0, 30));
			}
			if(MyData.indexOf('Gear a')!== -1){
				document.getElementById('GearARecieved').value = MyData.slice(0, 30);
				//console.log(MyData.slice(0, 30));
			}
			if(MyData.indexOf('Stop')!== -1){
				document.getElementById('StopRecieved').value = MyData.slice(0, 30);
				//console.log(MyData.slice(0, 30));
			}
			if(MyData.indexOf('Old')!== -1){
				document.getElementById('OldRecieved').value = MyData.slice(0, 30);
				//console.log(MyData.slice(0, 30));
			}
			if(document.getElementById('StatusRecieved').value !=0){
				document.getElementById('StaRecieved').value = document.getElementById('StatusRecieved').value.slice(7, 23);
			}*/



//побитное сравнение. строка 121
            //let A = 32767;
		
		/*console.log((A & 1));
		console.log((A & 2));
		console.log((A & 4));
		console.log((A & 8));*/
		/*if ((A & 1)!=0){document.getElementById('ByteParced_0').value = "VALUE 0"}
		if ((A & 2)!=0){document.getElementById('ByteParced_1').value = "VALUE 1"}
		if ((A & 4)!=0){document.getElementById('ByteParced_2').value = "VALUE XX"}
		if ((A & 8)!=0){document.getElementById('ByteParced_3').value = "VALUE XXX"}*/


//команда статус. строка 134
            /*document.getElementById('GetStatusButton').addEventListener("click", function (e){
		document.getElementById('ByteParced_0').value = ' ';
		document.getElementById('ByteParced_1').value = ' ';
		document.getElementById('ByteParced_2').value = ' ';
		document.getElementById('ByteParced_3').value = ' ';
		document.getElementById('ByteParced_4').value = ' ';
		document.getElementById('ByteParced_5').value = ' ';
		document.getElementById('ByteParced_6').value = ' ';
		document.getElementById('ByteParced_7').value = ' ';
		document.getElementById('ByteParced_8').value = ' ';
		document.getElementById('ByteParced_9').value = ' ';
		document.getElementById('ByteParced_10').value = ' ';
		document.getElementById('ByteParced_11').value = ' ';
		document.getElementById('ByteParced_12').value = ' ';
		document.getElementById('ByteParced_13').value = ' ';
		document.getElementById('ByteParced_14').value = ' ';
		document.getElementById('ByteParced_15').value = ' ';
		MyCOMPort.write('st' + '\r\n', function(err) {
			if (err) {return console.log('Error on write: ', err.message)}
			console.log('message written')
		 document.getElementById("textToSend").value =' ';
		})})*/

//EEshow. строка 143
        /*document.getElementById('GetMyConfigButton').addEventListener("click", function (e){
			MyCOMPort.write('EEShow' + '\r\n', function(err) {
				if (err) {return console.log('Error on write: ', err.message)}
				console.log('message written')
			 document.getElementById("textToSend").value =' ';
			})
			//alert('Structure saved!')
		})*/

		/*document.getElementById('SetMyConfigButton').addEventListener("click", function (e){
			MyCOMPort.write('EESet' + ' ' + document.getElementById('ParaNum').value + ' ' + document.getElementById('ParaCode').value + '\r\n', function(err) {
				//console.log('EESet' + ' ' + document.getElementById('ParaNum').value + ' ' + document.getElementById('ParaCode').value)
				if (err) {return console.log('Error on write: ', err.message)}
				console.log('message written')
			 document.getElementById("textToSend").value =' ';
			})
			//alert('Structure saved!')
		})*/
	
		/*document.getElementById('GetEEConfigButton').addEventListener("click", function (e){
			MyCOMPort.write(document.getElementById('ParameterGet').value, function(err) {
				//console.log('EESet' + ' ' + document.getElementById('ParaNum').value + ' ' + document.getElementById('ParaCode').value)
				if (err) {return console.log('Error on write: ', err.message)}
				console.log('message written')
			 //document.getElementById("textToSend").value =' ';
			})
			console.log(document.getElementById('ParameterGet').value)
		})*/

		/*document.getElementById('SetEEConfigButton').addEventListener("click", function (e){
			MyCOMPort.write(document.getElementById('ParameterSet').value + ' ' + document.getElementById('EESetParam').value + '\r\n', function(err) {
				//console.log('EESet' + ' ' + document.getElementById('ParaNum').value + ' ' + document.getElementById('ParaCode').value)
				if (err) {return console.log('Error on write: ', err.message)}
				console.log('message written')
			 //document.getElementById("textToSend").value =' ';
			})
			console.log(document.getElementById('ParameterSet').value + ' ' + document.getElementById('EESetParam').value + '\r\n')
			document.getElementById("EESetParam").value =' ';
		})*/

//поиск машинки(топрный)
		/*document.getElementById('findCarBut').addEventListener('click', function(e){
	//lookForCar();
	var result = confirm('CAR FOUND!');
	connectionChecker = myMsgWord.slice(myMsgWord.indexOf(':')+1, myMsgWord.length);
	console.log(connectionChecker);
	if(connectionChecker != 100){
		console.log('CAR IS NOT OK!');
		var findCarWD = 'trans 85 2 100';
		MyCOMPort.write(findCarWD + '\r\n', function(err){
		if (err) {return console.log('Error on write: ', err.message)}
		console.log(connectionChecker)})
	} else if((connectionChecker == 100)&&(result == true)){
		//alert('car found!!')
		//var result = prompt('CAR FOUND!', 'req');
		console.log('CAR IS OK');
		var stopWD = 'req';
		MyCOMPort.write(stopWD + '\r\n', function(err){
		if (err) {return console.log('Error on write: ', err.message)}
		console.log(connectionChecker)})}
		

})*/

//асинхронная функция для поиска машинки (прототип)
	/*async function lookForCar(){
					let myPromise = new Promise((resolve, reject)=>{
						connectionChecker = myMsgWord.slice(myMsgWord.indexOf(':')+1, myMsgWord.length);
						console.log(connectionChecker);
						if(connectionChecker != 100){
							console.log('CAR IS NOT OK!');
							var findCarWD = 'trans 85 2 100';
							MyCOMPort.write(findCarWD + '\r\n', function(err){
							if (err) {return console.log('Error on write: ', err.message)}
							console.log(connectionChecker)})}
						 else if(connectionChecker == 100){
							alert('car found!!')
							console.log('CAR IS OK');
							var stopWD = 'req';
							MyCOMPort.write(stopWD + '\r\n', function(err){
							if (err) {return console.log('Error on write: ', err.message)}
							console.log(connectionChecker)})}
							
					});
					let result = await myPromise;
					alert(result);
				}*/


//парсер строки состояния после нажатия кнопки connectionTestBut
				//connectionChecker = myMsgWord.slice(myMsgWord.indexOf(':')+1, myMsgWord.length);

//блок statusParced. строка 340
/*<!--<div class="statusParced">
<table>
	<tr>
		<td><textarea rows="1" cols="28" id="VoltageRecieved" readonly></textarea></td>
	</tr>
	<tr>
		<td><textarea rows="1" cols="28" id="AllowrRecieved" readonly></textarea></td>
	</tr>
	<tr>
		<td><textarea rows="1" cols="28" id="AllowRRecieved" readonly></textarea></td>
	</tr>
	<tr>
		<td><textarea rows="1" cols="28" id="StatusRecieved" readonly></textarea></td>
	</tr>
	<tr>
		<td><textarea rows="1" cols="28" id="ConfigRecieved" readonly></textarea></td>
	</tr>
	<tr>
		<td><textarea rows="1" cols="28" id="GearRecieved" readonly></textarea></td>
	</tr>
	<tr>
		<td><textarea rows="1" cols="28" id="IRRecieved" readonly></textarea></td>
	</tr>
	<tr>
		<td><textarea rows="1" cols="28" id="GearARecieved" readonly></textarea></td>
	</tr>
	<tr>
		<td><textarea rows="1" cols="28" id="StopRecieved" readonly></textarea></td>
	</tr>
	<tr>
		<td><textarea rows="1" cols="28" id="OldRecieved" readonly></textarea></td>
	</tr>
	<tr>
		<td><textarea rows="1" cols="28" id="StaRecieved" readonly></textarea></td>
	</tr>
	<tr>
		<td><button type="submit" id="GetStatusButton">Get status</button></td>
	</tr>
	<tr>
		
		<td><button type="submit" id="SaveMyConfigButton">Save config</button></td>
	</tr>
</table>
</div>*/
//форма для работы по радиоканалу
/*<div class="radioControl">
	
	<div class="EEShow">
		<h3>EESHow radio commands</h3>
		<select id="ParameterGet">
				<option value="0">--Choose a parameter--</option>
				<option value="data 85 32 10 ">Unit address</option>
				<option value="data 85 32 20 ">Default power</option>
				<option value="data 85 32 30 ">Min power</option>
				<option value="data 85 32 40 ">Min RPM</option>
				<option value="data 85 32 50 ">Max RPM</option>
				<option value="data 85 32 60 ">Divider</option>
				<option value="data 85 32 70 ">Reduce divider</option>
				<option value="data 85 32 80 ">Config</option>
				<option value="data 85 32 90 ">Wait delay</option>
				<option value="data 85 32 100 ">Slow moving delay</option>
				<option value="data 85 32 110 ">Volt thress</option>
			</select>
			<button type="submit" id="GetEEConfigButton">Get config</button>
	</div>
	<div class="EESet">
		<h3>EESet radio commands</h3>
		<select id="ParameterSet">
				<option value="0">--Choose a parameter--</option>
				<option value="data 85 42">Unit address (data 85 42)</option>
				<option value="data 85 43">Default power (data 85 43)</option>
				<option value="data 85 44">Min power (data 85 44)</option>
				<option value="data 85 45">Min RPM (data 85 45)</option>
				<option value="data 85 46">Max RPM (data 85 46)</option>
				<option value="data 85 47">Divider (data 85 47)</option>
				<option value="data 85 48">Reduce divider (data 85 48)</option>
				<option value="data 85 49">Config (data 85 49)</option>
				<option value="data 85 50">Wait delay (data 85 50)</option>
				<option value="data 85 51">Slow moving delay (data 85 51)</option>
				<option value="data 85 52">Volt thress (data 85 52)</option>
			</select>
			<textarea id="EESetParam" rows="1" cols="20"></textarea>
			<button type="submit" id="SetEEConfigButton">Set config</button>
	</div>
</div>-->

<!--<div class="IREngine">
	<h3>Car address</h3>
	<select id="IRComm">
		<option value="0">--Choose an option--</option>
		<option value="85">GLOBAL</option>
	</select>
	<textarea cols="25" rows="1" id="IRDataEnter"></textarea>
	<button type="submit" id="buttonNameCh">Choose</button>
</div>*/


/*<!--<div class="EEPara">
<h3>EE parameters for COM</h3>
<texarea>number of parameter:</texarea>
<textarea id="ParaNum" cols="15" rows="1"></textarea>
<texarea>value of parameter:</texarea>
<textarea id="ParaCode" cols="15" rows="1"></textarea>
<button type="submit" id="SetMyConfigButton">Set config</button>
<button type="submit" id="GetMyConfigButton">Get config</button>
</div>-->*/

//код блока меню
/* <!--<div class="upperMenu">
			<div class="dropdown">
				<button class="dropbtn">СAR</button>
				<div class="dropdown-content">
					<a href="carSetup.html">Show setup</a>
					<a href="carStatus.html">Status</a>
					<a href="carTest.html">Test</a>
				  <a href="#">Ссылка 3</a>
				</div>
			  </div>-->*/

//остановка транса в динамике
				/*if(myMsgWord.indexOf('100') != -1){
					MyCOMPort.write('req' + '\r\n', function(err) {
				
						if (err) {return console.log('Error on write: ', err.message)}
						console.log('message written')
					 
					})
				}*/


				/*<div class="formsInfo">
					<textarea rows="1" cols="20">unit Address(1):</textarea>
					<textarea rows="1" cols="20">default power(2)</textarea>
					<textarea rows="1" cols="20">min power(3)</textarea>
					<textarea rows="1" cols="20">min RPM(4)</textarea>
					<textarea rows="1" cols="20">max RPM(5)</textarea>
					<textarea rows="1" cols="20">Divider(6)</textarea>
					<textarea rows="1" cols="20">Reduce divider(7):</textarea>
					<textarea rows="1" cols="20">Config(8):</textarea>
					<textarea rows="1" cols="20">Wait delay(9):</textarea>
					<textarea rows="1" cols="20">Slow moving delay(10):</textarea>
					<textarea rows="1" cols="20">Volt thress(11):</textarea>
					<textarea rows="1" cols="20">no RPm power (12):</textarea>
					<textarea rows="1" cols="20">unit ID (13):</textarea>
					<textarea rows="1" cols="20">soft(X):</textarea>
					<textarea rows="1" cols="20">pins(X):</textarea>
					<textarea rows="1" cols="20">Init (X):</textarea>*/

					/*<div class="parcedValuesSaved">
					<h3>Values SAVED</h3>
					<textarea rows="1" cols="20" class="0" id="parcedValuesSavedUnitAddrA" readonly hidden></textarea>
					<textarea rows="1" cols="20" class="0" id="parcedValuesSavedUnitAddr" readonly ></textarea>
					<textarea rows="1" cols="20" class="1" id="parcedValuesSaveddefPWR" readonly></textarea>
					<textarea rows="1" cols="20" class="2" id="parcedValuesSavedminPWR" readonly></textarea>
					<textarea rows="1" cols="20" class="3" id="parcedValuesSavedMINRPM" readonly></textarea>
					<textarea rows="1" cols="20" class="4" id="parcedValuesSavedMAXRPM" readonly></textarea>
					<textarea rows="1" cols="20" class="5" id="parcedValuesSavedRaizedDivider" readonly></textarea>
					<textarea rows="1" cols="20" class="6" id="parcedValuesSavedReduceDivider" readonly></textarea>
					<textarea rows="1" cols="20" class="7" id="parcedValuesSavedConfig" readonly></textarea>
					<textarea rows="1" cols="20" class="8" id="parcedValuesSavedWaitDelay" readonly></textarea>
					<textarea rows="1" cols="20" class="9" id="parcedValuesSavedSlowMovingDelay" readonly></textarea>
					<textarea rows="1" cols="20" class="10" id="parcedValuesSavedVoltThress" readonly></textarea>
					<textarea rows="1" cols="20" class="11" id="parcedValuesSavedNoRPMPWR" readonly></textarea>
					<textarea rows="1" cols="20" class="12" id="parcedValuesSavedunitID" readonly></textarea>
					<textarea rows="1" cols="20" class="13" id="parcedValuesSavedSoftInfo" readonly></textarea>
					<textarea rows="1" cols="20" class="14" id="parcedValuesSavedPinsInfo" readonly></textarea>
					<textarea rows="1" cols="20" class="15" id="parcedValuesSavedInitInfo" readonly></textarea>
				  </div> */

				  /*<div class="parcedValuesSend">
					<h3>Values SEND</h3>
					<textarea rows="1" cols="20" class="0" id="parcedValuesSendUnitAddrA" hidden></textarea>
					<textarea rows="1" cols="20" class="0" id="parcedValuesSendUnitAddr"></textarea>
					<textarea rows="1" cols="20" class="1" id="parcedValuesSenddefPWR"></textarea>
					<textarea rows="1" cols="20" class="2" id="parcedValuesSendminPWR"></textarea>
					<textarea rows="1" cols="20" class="3" id="parcedValuesSendMINRPM"></textarea>
					<textarea rows="1" cols="20" class="4" id="parcedValuesSendMAXRPM"></textarea>
					<textarea rows="1" cols="20" class="5" id="parcedValuesSendRaizedDivider"></textarea>
					<textarea rows="1" cols="20" class="6" id="parcedValuesSendReduceDivider"></textarea>
					<textarea rows="1" cols="20" class="7" id="parcedValuesSendConfig" background-color="red"></textarea>
					<textarea rows="1" cols="20" class="8" id="parcedValuesSendWaitDelay"></textarea>
					<textarea rows="1" cols="20" class="9" id="parcedValuesSendSlowMovingDelay"></textarea>
					<textarea rows="1" cols="20" class="10" id="parcedValuesSendVoltThress"></textarea>
					<textarea rows="1" cols="20" class="11" id="parcedValuesSendNoRPMPWR"></textarea>
					<textarea rows="1" cols="20" class="12" id="parcedValuesSendunitID"></textarea>
					<textarea rows="1" cols="20" class="13" id="parcedValuesSendSoftInfo"></textarea>
					<textarea rows="1" cols="20" class="14" id="parcedValuesSendPinsInfo"></textarea>
					<textarea rows="1" cols="20" class="15" id="parcedValuesSendInitInfo"></textarea>
				  </div> */


//функция для отпраки данных в машинку.
/*function sendValuesToCOM(i){

	valuesFromFormToSend.length = 0;
	setTimeout(function(){
				//valuesFromFormToSend.push(document.getElementById(valuesFromFormToChangeArr[i]).value);
				//MyCOMPort.write(valuesFromFormToChangeArr[i] + '\r\n', function() {});
		valuesFromFormToSend.push(document.getElementById(valuesFromFormToChangeArr[i]).value);
				
		console.log(valuesFromFormToSend);
				//alert(valuesFromFormToSend[i] != undefined);
				//let value = valuesFromFormToSend.indexOf("  ") == -1;
		console.log('LENGTH^  ' + valuesFromFormToSend[i].length);

		if(valuesFromFormToSend[i].length !=0){
					var num = i;
					console.log(num)
		}

				

				//console.log('value  '+value)
		MyCOMPort.write(commandsToSaveChangedValuesArr[num] + ' ' + valuesFromFormToSend[num] + '\r\n', function() {});
			 console.log(commandsToSaveChangedValuesArr[num] + ' ' + valuesFromFormToSend[num]);
		}, 500 * i)}*/

//функция отправки/получения данных с ком порта
		/*function getDataFromComNew(commandArr, formsArr){
			indexArr.length = 0;
			errorCommArr.length = 0;
			let error;

			let getDataProm = new Promise((resolve, reject) => {
				for(let i=0; i<commandArr.length+1;i++){
					setTimeout(() => {
						
						MyCOMPort.write(commandArr[i] + '\r\n', () => {});
							console.log(portParser(myMsgWord));       
							if((portParser(myMsgWord) != 0)){

								resolve(portParser(myMsgWord), i);
			
							} else {
								if(myMsgWord == undefined){
									myMsgWord = '';
								}

								error = i;
								index = i;
								
								errorCommArr.push(commandArr[error]);
								indexArr.push(index);
								reject(error);
							}
					}, 380 * i);
				}
			})

			getDataProm.then((result, i) => {
				
					document.getElementById(formsArr[i]).value = result;
						if(i == 8){
							document.getElementById('statusParsedTxt').value = portParser(myMsgWord);
							configParser(portParser(myMsgWord));
						}
			
			});

			getDataProm.catch((result) => {
				console.log('unable to get data for parameter: ', result,' please, retry!');
				console.log(errorCommArr);
				console.log(indexArr);
			});
		//}
		}*/

//
const res = dialog.showMessageBoxSync({
	type: 'info',
	title: 'Heres the title.',
	message: 'Prompt content',
	detail: 'Additional Information',
	cancelId: 1,// Press ESC to click the index button by default
	defaultId: 0,// The button subscript is highlighted by default
	buttons: ['Confirm button','Cancel button']// The buttons sort by index from right to left
  })
  console.log('Operation result', res, res === 0 ? 'Click ok' : 'Click the Cancel button')


//ответ на квитанцию для отправки
  /*setTimeout(() => {
	console.log('COMMAND   ' + commandArr[indexArr[i]]  + ' ' + document.getElementById(elementArr[indexArr[i]]).value);
	MyCOMPort.write(commandArr[indexArr[i]]  + ' ' + document.getElementById(elementArr[indexArr[i]]).value + '\r\n', () => {});
}, 450 * i)
let sendValProm = new Promise((resolve, reject) => {
	setTimeout(() => {
		console.log('COMMAND   ' + commandArr[indexArr[i]]  + ' ' + document.getElementById(elementArr[indexArr[i]]).value);
		MyCOMPort.write(commandArr[indexArr[i]]  + ' ' + document.getElementById(elementArr[indexArr[i]]).value + '\r\n', () => {});
		//console.log(portParser(myMsgWord));
	}, 450 * i)
	setTimeout(() => {
		console.log(portParser(myMsgWord));
		if((portParser(myMsgWord) == 150)){
			//i++;
			resolve('operation suceed!')
		} else {
			//i--;
			reject('operation failed!')
		}
	}, 460 * i)
		
	//}, 450 * i)
});

sendValProm.then((result) => {
	console.log(result);
});

sendValProm.catch((result) => {
	console.log(result)
});*/


//функция для генерирования команд
/*function commandGenerator(command, dataToSend){
	if(document.getElementById('modeChooseSLCT').value == 'arduino'){
		codeWrd = 'data';
		address = '85';
		MyCOMPort.write(codeWrd + ' ' + address + ' ' + command + ' ' + dataToSend +  '\r\n', () => {});
	};

	if(document.getElementById('modeChooseSLCT').value == 'TRLTBoard'){
		codeWrd = 'mdata';
		port = document.getElementById('portChooseSLCT').value;
		address = '85';
		MyCOMPort.write(codeWrd + ' ' + port + ' ' + address + ' ' + command + ' ' + dataToSend  +  '\r\n', () => {});
	}
}*/


//изменение цвета элемента 
	/*let elem = document.getElementById('parcedValuesGetunitID');
	elem.style.backgroundColor = "red";
	elem.style.color = "white";
	let elt = document.getElementById('parcedValuesSendunitID');
	elt.style.backgroundColor = "green";
	elt.style.color = "white";*/

//работа с БД
/*document.getElementById('sqlGameBut').addEventListener('click',()=>{
	let db = new sqlite3.Database('./tutorial.db', (err) => {
		if (err) {
		  return console.error(err.message);
		}
		console.log('Connected successfully.');
	  });

	  db.run(`CREATE TABLE IF NOT EXISTS users(
		name text,
		email text, 
		age integer
	)`);

	insert_query = "INSERT INTO users(name, email, age) VALUES(?, ?, ?)"
	values = ["John", "john@gmail.com", 18]
	db.run(insert_query, values)
	db.all("SELECT * FROM users", [], (err, rows) => {
		console.log(rows)
	})
})*/

//промисы для получения данных из машинки 
	//<button type="submit" id="getPromiseBut">GET</button>
	/*document.getElementById('getPromiseBut').addEventListener('click', ()=>{
		//console.log(`click`);
		let getUnitAddrProm = new Promise((resolve, reject)=>{
			setTimeout(()=>{
				commandGenerator(32, 1);
			setTimeout(()=>{
				resolve(portParser(myMsgWord));
				
				if(myMsgWord == undefined){
					myMsgWord = '';
				}

				error = i;
				index = i;
					
				errorCommArr.push(commandArr[error-1]);
				indexArr.push(index);
				console.log(errorCommArr);
				reject(error);
				
			}, 380)
			console.log(`passed getUnitAddrProm`)
			},400)
			
		});
		
		getUnitAddrProm.then((result)=>{
			document.getElementById(valuesFromFormToGetArr[1]).value = result;
		})

		let getDefPowerProm = new Promise((resolve, reject)=>{
			setTimeout(()=>{
			commandGenerator(32, 2);
			setTimeout(()=>{
				resolve(portParser(myMsgWord));
			}, 380)
			console.log(`passed getUnitAddrProm`)
			},800)
		})

		getDefPowerProm.then((result)=>{
			document.getElementById(valuesFromFormToGetArr[2]).value = result;
		})

		let getminPowerProm = new Promise((resolve, reject)=>{
			setTimeout(()=>{
			commandGenerator(32, 3);
			setTimeout(()=>{
				resolve(portParser(myMsgWord));
			}, 380)
			console.log(`passed getUnitAddrProm`)
			},1200)
		})

		getminPowerProm.then((result)=>{
			document.getElementById(valuesFromFormToGetArr[3]).value = result;
		})

		let getMinRPMProm = new Promise((resolve, reject)=>{
			setTimeout(()=>{
			commandGenerator(32, 4);
			setTimeout(()=>{
				resolve(portParser(myMsgWord));
			}, 380)
			console.log(`passed getUnitAddrProm`)
			},1600)
		})

		getMinRPMProm.then((result)=>{
			document.getElementById(valuesFromFormToGetArr[4]).value = result;
		})

		let getMaxRPMProm = new Promise((resolve, reject)=>{
			setTimeout(()=>{
			commandGenerator(32, 5);
			setTimeout(()=>{
				resolve(portParser(myMsgWord));
			}, 380)
			console.log(`passed getUnitAddrProm`)
			},2000)
		})

		getMaxRPMProm.then((result)=>{
			document.getElementById(valuesFromFormToGetArr[5]).value = result;
		})

		let getDividerProm = new Promise((resolve, reject)=>{
			setTimeout(()=>{
			commandGenerator(32, 6);
			setTimeout(()=>{
				resolve(portParser(myMsgWord));
			}, 380)
			console.log(`passed getUnitAddrProm`)
			},2400)
		})

		getDividerProm.then((result)=>{
			document.getElementById(valuesFromFormToGetArr[6]).value = result;
		});

		let getReduceDividerProm = new Promise((resolve, reject)=>{
			setTimeout(()=>{
			commandGenerator(32, 7);
			setTimeout(()=>{
				resolve(portParser(myMsgWord));
			}, 380)
			console.log(`passed getUnitAddrProm`)
			},2800)
		})

		getReduceDividerProm.then((result)=>{
			document.getElementById(valuesFromFormToGetArr[7]).value = result;
		});
		
		let getConfigProm = new Promise((resolve, reject)=>{
			setTimeout(()=>{
			commandGenerator(32, 8);
			setTimeout(()=>{
				resolve(portParser(myMsgWord));
			}, 380)
			console.log(`passed getUnitAddrProm`)
			},3200)
		})

		getConfigProm.then((result)=>{
			document.getElementById(valuesFromFormToGetArr[8]).value = result;
		});

		let getWaitDelayProm = new Promise((resolve, reject)=>{
			setTimeout(()=>{
			commandGenerator(32, 9);
			setTimeout(()=>{
				resolve(portParser(myMsgWord));
			}, 380)
			console.log(`passed getUnitAddrProm`)
			},3600)
		})

		getWaitDelayProm.then((result)=>{
			document.getElementById(valuesFromFormToGetArr[9]).value = result;
		});

		let getSlowMovDelayProm = new Promise((resolve, reject)=>{
			setTimeout(()=>{
			commandGenerator(32, 10);
			setTimeout(()=>{
				resolve(portParser(myMsgWord));
			}, 380)
			console.log(`passed getUnitAddrProm`)
			},4000)
		})

		getSlowMovDelayProm.then((result)=>{
			document.getElementById(valuesFromFormToGetArr[10]).value = result;
		});

		let getVoltThressProm = new Promise((resolve, reject)=>{
			setTimeout(()=>{
			commandGenerator(32, 11);
			setTimeout(()=>{
				resolve(portParser(myMsgWord));
			}, 380)
			console.log(`passed getUnitAddrProm`)
			},4400)
		})

		getVoltThressProm.then((result)=>{
			document.getElementById(valuesFromFormToGetArr[11]).value = result;
		});

		let getNoRPMPowerProm = new Promise((resolve, reject)=>{
			setTimeout(()=>{
			commandGenerator(32, 12);
			setTimeout(()=>{
				resolve(portParser(myMsgWord));
			}, 380)
			console.log(`passed getUnitAddrProm`)
			},4800)
		})

		getNoRPMPowerProm.then((result)=>{
			document.getElementById(valuesFromFormToGetArr[12]).value = result;
		});
		
		let getUnitIDProm = new Promise((resolve, reject)=>{
			setTimeout(()=>{
			commandGenerator(32, 13);
			setTimeout(()=>{
				resolve(portParser(myMsgWord));
			}, 380)
			console.log(`passed getUnitAddrProm`)
			},5200)
		})

		getUnitIDProm.then((result)=>{
			document.getElementById(valuesFromFormToGetArr[13]).value = result;
		});

		let getSoftProm = new Promise((resolve, reject)=>{
			setTimeout(()=>{
			commandGenerator(32, 14);
			setTimeout(()=>{
				resolve(portParser(myMsgWord));
			}, 380)
			console.log(`passed getUnitAddrProm`)
			},5600)
		})

		getSoftProm.then((result)=>{
			document.getElementById(valuesFromFormToGetArr[14]).value = result;
			if(portParser(myMsgWord) == 255){
				console.log('!!!');
				let elem = document.getElementById('parcedValuesGetunitID');
				elem.style.backgroundColor = "red";
				elem.style.color = "white";
				let elt = document.getElementById('parcedValuesSendunitID');
				elt.style.backgroundColor = "green";
				elt.style.color = "white";
			} else {
				let elem = document.getElementById('parcedValuesGetunitID');
				elem.style.backgroundColor = "white";
				elem.style.color = "black";
				let elt = document.getElementById('parcedValuesSendun  itID');
				elt.style.backgroundColor = "white";
				elt.style.color = "black";
			}
		});

		let getPinsProm = new Promise((resolve, reject)=>{
			setTimeout(()=>{
			commandGenerator(32, 15);
			setTimeout(()=>{
				resolve(portParser(myMsgWord));
			}, 380)
			console.log(`passed getUnitAddrProm`)
			},6000)
		})

		getPinsProm.then((result)=>{
			document.getElementById(valuesFromFormToGetArr[15]).value = result;
		});
	})*/

	//кнопка для получения значений из порта
	/*<!--<select id="TypeOfDataCH">
			<option value="current">Current</option>
			<option value="stored">Stored</option>
			<option value="default">Default</option>
		  </select>-->
	<!--<button type="submit" id="getParcedValues">Get data</button>-->*/
	/*document.getElementById('getParcedValues').addEventListener('click', function(){
		 	
			console.log(document.getElementById('TypeOfDataCH').value);
			if(document.getElementById('modeChooseSLCT').value == 'arduino'){
				if((document.getElementById('TypeOfDataCH').value == 'current')){

					clearValuesFromValuesGet();
	
					getDataFromCom(valuesToGetArr, valuesFromFormToGetArr, 380);
				}
	
				if((document.getElementById('TypeOfDataCH').value == 'stored')){
	
					clearValuesFromValuesStored();
	
					getDataFromCom(valuesToGetSavedArr, valuesFromFormSavedArr, 380);
				}
			}

			if(document.getElementById('modeChooseSLCT').value == 'TRLTBoard'){
				if(document.getElementById('TypeOfDataCH').value == 'current'){

					clearValuesFromValuesGet();
	
					getDataFromCom(valuesToGetArrTRLT, valuesFromFormToGetArr, 380);
					
				}

				if((document.getElementById('TypeOfDataCH').value == 'stored')){
	
					clearValuesFromValuesStored();
	
					getDataFromCom(valuesToGetSavedArrTRLT, valuesFromFormSavedArr, 380);
				}
			}
		})*/

		//ручной перезапрос параметров 
		//<button type="submit" id="reAskDataBut">Reask</button>
		/*document.getElementById('reAskDataBut').addEventListener('click', () => {
				console.log(errorCommArr);

			if(document.getElementById('TypeOfDataCH').value == 'current' |currentValuesFlag == 1){
					for(let i=0; i<errorCommArr.length+1; i++){
						setTimeout(()=> {  
							MyCOMPort.write(errorCommArr[i] + '\r\n', () => {});
							console.log(errorCommArr[i] + " " + portParser(myMsgWord));
							document.getElementById(valuesFromFormToGetArr[indexArr[i-1]]).value = portParser(myMsgWord);
							document.getElementById(valuesFromFormToGetArr[indexArr[i-1]]).style.backgroundColor = "white";	
							document.getElementById('reAskDataBut').style.backgroundColor = "white";
						},350*i)
					}
				}

			if(document.getElementById('TypeOfDataCH').value == 'stored'| storedValuesFlag == 1){
					for(let i=0; i<errorCommArr.length+1; i++){
						setTimeout(()=> {
							MyCOMPort.write(errorCommArr[i] + '\r\n', () => {});
							console.log(errorCommArr[i] + " " + portParser(myMsgWord));
							document.getElementById(valuesFromFormSavedArr[indexArr[i-1]]).value = portParser(myMsgWord);
							document.getElementById(valuesFromFormSavedArr[indexArr[i-1]]).style.backgroundColor = "white";	
							document.getElementById('reAskDataBut').style.backgroundColor = "white";
						},350*i)
					}
				}
			})*/
//функция поиска по БД
/*function DBCarValuesFind(DB, parameter){
	let para = parameter.toString();
	let outputData;
	DB.find({ID: para}, function (err, docs) {
		docs.map((data)=>{
			//let outputData = JSON.stringify(data);
			//console.log(outputData);
			//console.log(typeof outputData);
			/*let out = outputData.replace(/"/g, '').replace(/,/g, '|').replace(/{/g, '').replace(/}/g, '');
			console.log(out);
			console.log(typeof out);*/
			/*let dates = out.slice(out.indexOf('DATE'), out.indexOf('COMMENT'));
			document.getElementById('DBScreenTxt').value+= out.slice(0, out.indexOf('DATE')) + '\r\n';
			document.getElementById('DBScreenTxt').value+= dates + '\r\n';
			document.getElementById('DBScreenTxt').value+= out.slice(out.indexOf('COMMENT'), out.indexOf('_id'))  + '\r\n';*/
		//})
	//})
	//console.log(outputData);
//}

//функция поиска и вывода по ID/дате/часу/минуте.
/*function DBSort(DB, parameter, day, hour, minute){
				console.log(`click`);
				let para = parameter.toString();
				let d = day.toString();
				let h = hour.toString();
				//let m = minute.toString();
				DB.find({ID:para, DATE_day:d, DATE_Hour:h/*, DATE_Min:m}, function(err, docs){
					console.log(docs);
					docs.map((data)=>{
						let outputData = JSON.stringify(data);
						let out = outputData.replace(/"/g, '').replace(/,/g, '|').replace(/{/g, '').replace(/}/g, '');
						console.log(out);
						let dates = out.slice(out.indexOf('DATE'), out.indexOf('COMMENT'));
						document.getElementById('DBScreenTxt').value+= out.slice(0, out.indexOf('DATE')) + '\r\n';
						document.getElementById('DBScreenTxt').value+= dates + '\r\n';
						document.getElementById('DBScreenTxt').value+= out.slice(out.indexOf('COMMENT'), out.indexOf('_id'))  + '\r\n';
					})
				})
			} */

				/*DATE_day:para17, 
					DATE_Hour:para18, 
					DATE_Min:para19, 
					DATE_Sec:para20,
					ID:para14, 
					UNITaddress:para2, 
					SOFT:para15, 
					DEFAULTpower:para3, 
					MINpower:para4, 
					MINrpm:para5, 
					MAXrpm:para6, 
					DIVIDER:para7, 
					REDUCEdivider:para8, 
					CONFIG:para9, 
					WAITdelay:para10, 
					SLOWmovingDelay:para11, 
					VOLTthress:para12, 
					N0rpmPower:para13, 
					PINS:para16, 
				COMMENT:para21*/


//TAB 8 полуавтоматическое управление светофорами и, как следствие, перекрестком 
	//RIGHT-BOTTOM-LIGHT LOGIC
	/*document.getElementById('rigtBottomLightCrosserStraight').addEventListener('click', ()=>{
		document.getElementById('rigtBottomLightCrosserTurn').hidden = false;
		document.getElementById('rigtBottomLightCrosserStraight').hidden = true;
		console.log(`right bottom cross turned right!`)
	 })

	 document.getElementById('rigtBottomLightCrosserTurn').addEventListener('click',()=>{
		document.getElementById('rigtBottomLightCrosserTurn').hidden = true;
		document.getElementById('rigtBottomLightCrosserStraight').hidden = false;
		console.log(`right bottom cross became stright!`);
	 })

	  let counterRightBottomLight = 0;
	document.getElementById('RightBottomLamp').addEventListener('click', ()=>{
		counterRightBottomLight++;
		crossLights(counterRightBottomLight, 'RightBottomLamp', 'LeftTopLamp', 'LeftBottomLamp', 'RightTopLamp');
	})
	
//LEFT-TOP-LIGHT LOGIC
	document.getElementById('leftTopLightCrosserStraight').addEventListener('click', ()=>{
		document.getElementById('leftTopLightCrosserTurn').hidden = false;
		document.getElementById('leftTopLightCrosserStraight').hidden = true;
		console.log(`left top cross turned right!`)
	})

	document.getElementById('leftTopLightCrosserTurn').addEventListener('click',()=>{
		document.getElementById('leftTopLightCrosserTurn').hidden = true;
		document.getElementById('leftTopLightCrosserStraight').hidden = false;
		console.log(`left top cross became stright!`)
	})

	document.getElementById('LeftTopLamp').addEventListener('click', ()=>{
		counterRightBottomLight++;
		crossLights(counterRightBottomLight, 'RightBottomLamp', 'LeftTopLamp', 'LeftBottomLamp', 'RightTopLamp');
	})

//LEFT-BOTTOM-LIGHT LOGIC
	document.getElementById('leftBottomLightCrosserStraight').addEventListener('click', ()=>{
		document.getElementById('leftBottomLightCrosserTurn').hidden = false;
		document.getElementById('leftBottomLightCrosserStraight').hidden = true;
		console.log(`left bottom cross turned right!`)
	})

	document.getElementById('leftBottomLightCrosserTurn').addEventListener('click',()=>{
		document.getElementById('leftBottomLightCrosserTurn').hidden = true;
		document.getElementById('leftBottomLightCrosserStraight').hidden = false;
		console.log(`left bottom cross became stright!`)
	})

	//let counterLeftBottomLight = 0;
	document.getElementById('LeftBottomLamp').addEventListener('click', ()=>{
		counterRightBottomLight++;
		crossLights(counterRightBottomLight, 'LeftBottomLamp', 'RightTopLamp', 'RightBottomLamp', 'LeftTopLamp' );
		//counterLeftBottomLight++;
		//crossLights(counterRightBottomLight, 'LeftBottomLamp', 'RightTopLamp');
	})

//RIGHT-TOP-LIGHT LOGIC
	document.getElementById('rightTopLightCrosserStraight').addEventListener('click', ()=>{
		document.getElementById('rightTopightCrosserTurn').hidden = false;
		document.getElementById('rightTopLightCrosserStraight').hidden = true;
		console.log(`right top cross turned right!`)
	})

	document.getElementById('rightTopightCrosserTurn').addEventListener('click',()=>{
		document.getElementById('rightTopightCrosserTurn').hidden = true;
		document.getElementById('rightTopLightCrosserStraight').hidden = false;
		console.log(`right top cross became stright!`)
	})

	document.getElementById('RightTopLamp').addEventListener('click', ()=>{
		counterRightBottomLight++;
		crossLights(counterRightBottomLight, 'LeftBottomLamp', 'RightTopLamp', 'RightBottomLamp', 'LeftTopLamp' );
		//counterLeftBottomLight++;
		//crossLights(counterRightBottomLight, 'LeftBottomLamp', 'RightTopLamp');
	})

	function crossLights(counter, lamp1, lamp2, lamp3, lamp4){
		if(counter%2!=0){
			document.getElementById(lamp1).style.backgroundColor = 'green';
			document.getElementById(lamp2).style.backgroundColor = 'green';
			document.getElementById(lamp3).style.backgroundColor = 'red';
			document.getElementById(lamp4).style.backgroundColor = 'red';
			console.log(`${lamp1} and ${lamp2} are green!`);
		}
		if(counter%2==0){
			document.getElementById(lamp1).style.backgroundColor = 'red';
			document.getElementById(lamp2).style.backgroundColor = 'red';
			document.getElementById(lamp3).style.backgroundColor = 'green';
			document.getElementById(lamp4).style.backgroundColor = 'green';
			console.log(`${lamp1} and ${lamp2} are red!`);
		}
	}*/



	/*setTimeout(()=>{
		if(LeftBottomControlMenuGetParamsCommsSelFLAG == 1){
			document.getElementById('LeftBottomLamp').style.backgroundColor = 'orange';
			console.log(`LeftBottomControlMenuGetParamsCommsSelFLAG == 1`);
			if(document.getElementById('LeftBottomControlMenuGetParamsCommsSel').value == '103'){
				console.log(`103`);
				let parcedChainOne = myMsgWord.slice(myMsgWord.indexOf('data')+4, myMsgWord.length);
				console.log(parcedChainOne);
				document.getElementById('LeftBottomControlMenuTXT').value = parcedChainOne + '/r/n';
				setTimeout(()=>{
					let parcedChainTwo = myMsgWord.slice(myMsgWord.indexOf('data')+4, myMsgWord.length);
					console.log(parcedChainTwo)
					document.getElementById('LeftBottomControlMenuTXT').value += parcedChainTwo + '/r/n';
				}, 500)
			}
			if(document.getElementById('LeftBottomControlMenuGetParamsCommsSel').value == '101'){
				document.getElementById('LeftBottomLamp').style.backgroundColor = 'orange';
				document.getElementById('LeftBottomControlMenuTXT').value = '';
				document.getElementById('LeftBottomControlMenuTXT').value = `Engine power: ${myMsgWord.slice(myMsgWord.indexOf('data')+4, myMsgWord.length)}`;
				console.log(myMsgWord);
			}

			if(document.getElementById('LeftBottomControlMenuGetParamsCommsSel').value == '102'){
				document.getElementById('LeftBottomLamp').style.backgroundColor = 'orange';
				document.getElementById('LeftBottomControlMenuTXT').value = '';
				document.getElementById('LeftBottomControlMenuTXT').value = `Volt thress: ${myMsgWord.slice(myMsgWord.indexOf('data')+4, myMsgWord.length)}`;
				console.log(myMsgWord);
			}
		}
	},400)*/

	/*	setTimeout(()=>{
					if(LeftBottomControlMenuStopCommsSelFLAG == 1){
						console.log(`WORD: ${portParser(myMsgWord)}`)
						if(portParser(myMsgWord)==170){
							console.log(`170`);
							document.getElementById('LeftBottomLamp').style.backgroundColor = 'red';
							document.getElementById('LeftBottomControlMenuStopCommsSel').style.backgroundColor = 'grey';
						}
						if(portParser(myMsgWord)!=170){
							console.log(`!=170`);
							document.getElementById('LeftBottomLamp').style.backgroundColor = 'grey';
						}
					}
				},400)*/

	/*setTimeout(()=>{
					if(LeftBottomControlMenuStartCommsSelFLAG == 1){
						if(portParser(myMsgWord)==170){
							console.log(`170`);
							document.getElementById('LeftBottomLamp').style.backgroundColor = 'green';
							document.getElementById('LeftBottomControlMenuStartCommsSel').style.backgroundColor = 'grey';
							
						}
						if(portParser(myMsgWord)!=170){
							console.log(`!=170`);
							document.getElementById('LeftBottomLamp').style.backgroundColor = 'grey';  
						}
					}
				},400)*/

				//let LeftBottomControlMenuStartCommsSelFLAG = 0;
				//let LeftBottomControlMenuStopCommsSelFLAG = 0;
				//let LeftBottomControlMenuGetParamsCommsSelFLAG = 0;

	//реализация событий на изменение выпадающего списка
		/*let RightBottomControlMenuStartCommsSelFLAG = 0;//флаг для функции portParser;
			document.getElementById('RightBottomControlMenuStartCommsSel').addEventListener('change', ()=>{
				RightBottomControlMenuGetParamsCommsSelFLAG = 0;
				RightBottomControlMenuStopCommsSelFLAG = 0;
				RightBottomControlMenuStartCommsSelFLAG = 1;
				LeftBottomControlMenuStopCommsSelFLAG = 0;
				LeftBottomControlMenuStartCommsSelFLAG = 0;
				document.getElementById('RightBottomControlMenuStartCommsSel').style.backgroundColor = 'green';
				document.getElementById('RightBottomControlMenuStopCommsSel').style.backgroundColor = 'grey';
				document.getElementById('RightBottomControlMenuGetParamsCommsSel').style.backgroundColor = 'grey';
				console.log(document.getElementById('RightBottomControlMenuStartCommsSel').value);
				commandGenerator(document.getElementById('RightBottomControlMenuStartCommsSel').value, " ");
				document.getElementById('RightBottomLamp').style.backgroundColor = 'green';
			})

			let RightBottomControlMenuStopCommsSelFLAG = 0;
			document.getElementById('RightBottomControlMenuStopCommsSel').addEventListener('change', ()=>{
				RightBottomControlMenuGetParamsCommsSelFLAG = 0;
				RightBottomControlMenuStopCommsSelFLAG = 1;
				RightBottomControlMenuStartCommsSelFLAG = 0;
				LeftBottomControlMenuStopCommsSelFLAG = 0;
				LeftBottomControlMenuStartCommsSelFLAG = 0;
				document.getElementById('RightBottomControlMenuStopCommsSel').style.backgroundColor = 'red';
				document.getElementById('RightBottomControlMenuStartCommsSel').style.backgroundColor = 'grey';
				document.getElementById('RightBottomControlMenuGetParamsCommsSel').style.backgroundColor = 'grey';
				console.log(document.getElementById('RightBottomControlMenuStopCommsSel').value);
				//document.getElementById('RightBottomLamp').style.backgroundColor = 'red';
				commandGenerator(document.getElementById('RightBottomControlMenuStopCommsSel').value, " ");
			})

			let RightBottomControlMenuGetParamsCommsSelFLAG = 0;
			document.getElementById('RightBottomControlMenuGetParamsCommsSel').addEventListener('change', ()=>{
				RightBottomControlMenuGetParamsCommsSelFLAG = 1;
				RightBottomControlMenuStopCommsSelFLAG = 0;
				RightBottomControlMenuStartCommsSelFLAG = 0;
				LeftBottomControlMenuStopCommsSelFLAG = 0;
				LeftBottomControlMenuStartCommsSelFLAG = 0;
				document.getElementById('RightBottomControlMenuGetParamsCommsSel').style.backgroundColor = 'orange';
				document.getElementById('RightBottomControlMenuStartCommsSel').style.backgroundColor = 'grey';
				document.getElementById('RightBottomControlMenuStopCommsSel').style.backgroundColor = 'grey';
				console.log(document.getElementById('RightBottomControlMenuGetParamsCommsSel').value);
				//document.getElementById('RightBottomLamp').style.backgroundColor = 'orange';
				commandGenerator(document.getElementById('RightBottomControlMenuGetParamsCommsSel').value, " ");
			})

	//CONTROL MENU LEFT-BOTTOM 
			document.getElementById('leftBottomTransmitterBut').addEventListener('click',()=>{
				document.getElementById('LeftBottomControlMenu').style.display = 'block';
			})

			document.getElementById('CLOSELeftBottomControlMenuBut').addEventListener('click',()=>{
				document.getElementById('LeftBottomControlMenu').style.display = 'none';
			})

			let LeftBottomControlMenuStartCommsSelFLAG = 0;
			document.getElementById('LeftBottomControlMenuStartCommsSel').addEventListener('change', ()=>{
				LeftBottomControlMenuStartCommsSelFLAG = 1;
				RightBottomControlMenuGetParamsCommsSelFLAG = 0;
				RightBottomControlMenuStopCommsSelFLAG = 0;
				RightBottomControlMenuStartCommsSelFLAG = 0;
				LeftBottomControlMenuStopCommsSelFLAG = 0;
				document.getElementById('LeftBottomControlMenuStartCommsSel').style.backgroundColor = 'green';
				document.getElementById('LeftBottomControlMenuGetParamsCommsSel').style.backgroundColor = 'grey';
				document.getElementById('LeftBottomControlMenuStopCommsSel').style.backgroundColor = 'grey';
				commandGenerator(document.getElementById('LeftBottomControlMenuStartCommsSel').value, " ");
			})

			let LeftBottomControlMenuStopCommsSelFLAG = 0;
			document.getElementById('LeftBottomControlMenuStopCommsSel').addEventListener('change',()=>{
				LeftBottomControlMenuStopCommsSelFLAG = 1;
				LeftBottomControlMenuStartCommsSelFLAG = 0;
				RightBottomControlMenuGetParamsCommsSelFLAG = 0;
				RightBottomControlMenuStopCommsSelFLAG = 0;
				RightBottomControlMenuStartCommsSelFLAG = 0;
				document.getElementById('LeftBottomControlMenuStopCommsSel').style.backgroundColor = 'red';
				document.getElementById('LeftBottomControlMenuGetParamsCommsSel').style.backgroundColor = 'grey';
				document.getElementById('LeftBottomControlMenuStartCommsSel').style.backgroundColor = 'grey';
			})*/


	//реализация общения с машинкой с подтверждением ответа
		/*setTimeout(()=>{
					if(RightBottomControlMenuStartCommsSelFLAG == 1){
						console.log(`RightBottomControlMenuStartCommsSelFLAG == 1`);
						console.log(`WORD: ${portParser(myMsgWord)}`)
						if(portParser(myMsgWord)==170){
							console.log(`170`);
							document.getElementById('RightBottomLamp').style.backgroundColor = 'green';
							document.getElementById('RightBottomControlMenuStartCommsSel').style.backgroundColor = 'grey';
							
						}
						if(portParser(myMsgWord)!=170){
							console.log(`!=170`);
							document.getElementById('RightBottomLamp').style.backgroundColor = 'grey';
						}
					}
				},400)

				setTimeout(()=>{
					if(LeftBottomControlMenuStartCommsSelFLAG == 1){
						if(portParser(myMsgWord)==170){
							console.log(`170`);
							document.getElementById('LeftBottomLamp').style.backgroundColor = 'green';
							document.getElementById('LeftBottomControlMenuStartCommsSel').style.backgroundColor = 'grey';
						}
						if(portParser(myMsgWord)!=170){
							console.log(`!=170`);
							document.getElementById('LeftBottomLamp').style.backgroundColor = 'grey';
						}
					}
				},400)

				setTimeout(()=>{
					if(RightBottomControlMenuStopCommsSelFLAG == 1){
						//console.log(`RightBottomControlMenuStopCommsSelFLAG == 1`);
						console.log(`WORD: ${portParser(myMsgWord)}`)
						if(portParser(myMsgWord)==170){
							console.log(`170`);
							document.getElementById('RightBottomLamp').style.backgroundColor = 'red';
							document.getElementById('RightBottomControlMenuStopCommsSel').style.backgroundColor = 'grey';
						}
						if(portParser(myMsgWord)!=170){
							console.log(`!=170`);
							document.getElementById('RightBottomLamp').style.backgroundColor = 'grey';
						}
					}
				},400)

				setTimeout(()=>{
					if(LeftBottomControlMenuStopCommsSelFLAG == 1){
						if(portParser(myMsgWord)==170){
							console.log(`170`);
							//document.getElementById('LeftBottomLamp').style.backgroundColor = 'red';
							//document.getElementById('LeftBottomControlMenuStopCommsSel').style.backgroundColor = 'grey';
						}

						if(portParser(myMsgWord)!=170){
							console.log(`!=170`);
						}
					}
				},400)

				setTimeout(()=>{
					if(RightBottomControlMenuGetParamsCommsSelFLAG == 1){
						console.log(`RightBottomControlMenuGetParamsCommsSelFLAG == 1`);
						if(document.getElementById('RightBottomControlMenuGetParamsCommsSel').value == '103'){
							document.getElementById('RightBottomLamp').style.backgroundColor = 'orange';
							document.getElementById('RightBottomControlMenuTXT').value = '';
							console.log(`103`);
							let parcedChainOne = myMsgWord.slice(myMsgWord.indexOf('data')+4, myMsgWord.length);
							console.log(parcedChainOne);
							document.getElementById('RightBottomControlMenuTXT').value = parcedChainOne + '/r/n';
							setTimeout(()=>{
								let parcedChainTwo = myMsgWord.slice(myMsgWord.indexOf('data')+4, myMsgWord.length);
								console.log(parcedChainTwo)
								document.getElementById('RightBottomControlMenuTXT').value += parcedChainTwo + '/r/n';
							}, 500)
						}

						if(document.getElementById('RightBottomControlMenuGetParamsCommsSel').value == '101'){
							document.getElementById('RightBottomLamp').style.backgroundColor = 'orange';
							document.getElementById('RightBottomControlMenuTXT').value = '';
							document.getElementById('RightBottomControlMenuTXT').value = `Engine power: ${myMsgWord.slice(myMsgWord.indexOf('data')+4, myMsgWord.length)}`;
							console.log(myMsgWord);
						}

						if(document.getElementById('RightBottomControlMenuGetParamsCommsSel').value == '102'){
							document.getElementById('RightBottomLamp').style.backgroundColor = 'orange';
							document.getElementById('RightBottomControlMenuTXT').value = '';
							document.getElementById('RightBottomControlMenuTXT').value = `Volt thress: ${myMsgWord.slice(myMsgWord.indexOf('data')+4, myMsgWord.length)}`;
							console.log(myMsgWord);
						}
					}
				},400)*/

				//промис для нового поиска машинки
			/*	let myPromReq = new Promise((resolve, reject)=>{
					let FFlag = 0;
					for(let i=0; i<20; i++){
						setTimeout(()=>{
							console.log(portParser(myMsgWord));
							if(portParser(myMsgWord) == 100){
								FFlag = 1;
							}
						})
					}
				if(FFlag == 1){
					resolve(portParser(myMsgWord));
				}
				if((i=20)&&(FFlag !=1)){
					reject(portParser(myMsgWord));
				}
				})

				myPromReq.then(()=>{
					console.log(`result: ${result}`)
				})*/

				/*document.getElementById('lookForCarNew').addEventListener('click', ()=>{
					MyCOMPort.write('mtrans 0 85 2 100' + '\r\n', () => {});
					MyCOMPort.write('mreq' + '\r\n', () => {
					console.log(`${document.getElementById('TextRecieved').value.length}`)
					});
					let fCounter = 0;
					for(let i=0; i<100; i++){
						setTimeout(()=>{
							console.log(`portWrd: ${portParser(myMsgWord)}`);
								/*if(portParser(myMsgWord) == 17){
									console.log(`get!`);
									fCounter = 1;
									MyCOMPort.write('mreq' + '\r\n', () => {});
									return;
								}*/
					//	},150*i)
			//		}
			//	})*/
				/*document.getElementById('TextRecieved').addEventListener('input', ()=>{
					console.log(`changed`);
					console.time(`console time`)
				})*/

			//определение цвета элемента
			/*let block = document.getElementById('operatorNahodkaLeftTopLamp');
			let color = window.getComputedStyle(block).backgroundColor;
			//console.log(document.getElementById('operatorNahodkaLeftTopLamp').backgroundColor)
			console.log(color);*/

		//поочередное переключение светофоров
			/*document.getElementById('tLight1').addEventListener('click', ()=>{
				colorSwitcher('operatorNahodkaLeftTopLamp', 'operatorNahodkaRightBottomLamp', 'operatorNahodkaLeftBottomLamp', 'operatorNahodkaRightTopLamp')//светофоры 1 и 3 - зеленые
			})

			document.getElementById('tLight2').addEventListener('click', ()=>{
				colorSwitcher('operatorNahodkaLeftBottomLamp', 'operatorNahodkaRightTopLamp','operatorNahodkaLeftTopLamp', 'operatorNahodkaRightBottomLamp')//светофоры 2 и 4 - зеленые
			})

			document.getElementById('tLight3').addEventListener('click', ()=>{
				document.getElementById('tLight1').click();//светофоры 1 и 3 - зеленые
			})

			document.getElementById('tLight4').addEventListener('click', ()=>{
				document.getElementById('tLight2').click();//светофоры 2 и 4 - зеленые  
			})*/

			/*	function colorSwitcher(lampName1, lampName2, lampName3, lampName4){
				document.getElementById(lampName1).style.backgroundColor = 'red';
				document.getElementById('tLight1').style.backgroundColor = 'red';
				setTimeout(()=>{
					document.getElementById(lampName1).style.backgroundColor = 'orange';
					document.getElementById('tLight1').style.backgroundColor = 'orange';
				},500)
				setTimeout(()=>{
					document.getElementById(lampName1).style.backgroundColor = 'green';
					document.getElementById('tLight1').style.backgroundColor = 'green';
				},1500);

				document.getElementById(lampName2).style.backgroundColor = 'red';
				document.getElementById('tLight3').style.backgroundColor = 'red';
				setTimeout(()=>{
					document.getElementById(lampName2).style.backgroundColor = 'orange';
					document.getElementById('tLight3').style.backgroundColor = 'orange';
				},500)
				setTimeout(()=>{
					document.getElementById(lampName2).style.backgroundColor = 'green';
					document.getElementById('tLight3').style.backgroundColor = 'green';
				},1500)

				document.getElementById(lampName3).style.backgroundColor = 'green';
				document.getElementById('tLight2').style.backgroundColor = 'green';
				setTimeout(()=>{
					document.getElementById(lampName3).style.backgroundColor = 'orange';
					document.getElementById('tLight2').style.backgroundColor = 'orange';
				},500)
				setTimeout(()=>{
					document.getElementById(lampName3).style.backgroundColor = 'red';
					document.getElementById('tLight2').style.backgroundColor = 'red';
				},1500)

				document.getElementById(lampName4).style.backgroundColor = 'green';
				document.getElementById('tLight4').style.backgroundColor = 'green';
				setTimeout(()=>{
					document.getElementById(lampName4).style.backgroundColor = 'orange';
					document.getElementById('tLight4').style.backgroundColor = 'orange';
				},500)
				setTimeout(()=>{
					document.getElementById(lampName4).style.backgroundColor = 'red';
					document.getElementById('tLight4').style.backgroundColor = 'red';
				},1500)
			}*/
//функция для выполнения скриптов (вкладка 10 "Mega test")
			/*if(values.TYPE == 'JS'){
							console.log('JS!!');
							let valArr = [];
							valArr.push(values.SCRIPTpart_1, values.SCRIPTpart_2, values.SCRIPTpart_3, values.SCRIPTpart_4, values.SCRIPTpart_5, values.SCRIPTpart_6,
										values.SCRIPTpart_7, values.SCRIPTpart_8, values.SCRIPTpart_9, values.SCRIPTpart_10, values.SCRIPTpart_11, values.SCRIPTpart_12)
							console.log(valArr);      
							let myMsg;
							//let value;
							console.log(`indexOf if :${valArr.indexOf('if')}`)
							if(valArr.indexOf('if')==1){
								console.log(`valArr[0]  :${valArr[0] }`)
								MyCOMPort.write(valArr[0] + '\r\n',()=> {});
								setTimeout(()=>{
									myMsg = portParser(myMsgWord).slice(-3);
									//value = valArr[4];
								}, 350)
								console.log(typeof(valArr[4]));
								console.log(valArr[4].length)
								setTimeout(()=>{
									console.log(myMsg.length)
									if(myMsg == valArr[4]){
										console.log(`equal!`)
										console.log(`valArr[5]  :${valArr[5] }`)
										MyCOMPort.write(valArr[5] + '\r\n',()=> {});
										valArr.length = 0;
									} else{ 
										console.log(`not equal`);
									}
								}, 1500)
								
							}
						}*/
//передача команд для отработки последовательности команд в порт   
/* if (values.SCRIPTpart_2 == null) {
          console.log(`SCRIPTpart_2 == null`);
          MyCOMPort.write(values.SCRIPTpart_1 + "\r\n", () => {});
        }

        if (values.SCRIPTpart_2 != null) {
          document.getElementById("createScriptBlockPart_1TXT").value =
            values.SCRIPTpart_1;
          document.getElementById("createScriptBlockPart_2TXT").value =
            values.SCRIPTpart_2;
        }

        if (values.SCRIPTpart_3 == null) {
          console.log(`SCRIPTpart_3 == null`);
          MyCOMPort.write(values.SCRIPTpart_1 + "\r\n", () => {});
          setTimeout(() => {
            MyCOMPort.write(values.SCRIPTpart_2 + "\r\n", () => {});
          }, 500);
        }

        if (values.SCRIPTpart_3 != null) {
          document.getElementById("createScriptBlockPart_3TXT").value =
            values.SCRIPTpart_3;
        }

        if (values.SCRIPTpart_4 == null) {
          console.log(`SCRIPTpart_4 == null`);
          MyCOMPort.write(values.SCRIPTpart_1 + "\r\n", () => {});
          setTimeout(() => {
            MyCOMPort.write(values.SCRIPTpart_2 + "\r\n", () => {});
          }, 500);
          setTimeout(() => {
            MyCOMPort.write(values.SCRIPTpart_3 + "\r\n", () => {});
          }, 1000);
        }

        if (values.SCRIPTpart_4 != null) {
          document.getElementById("createScriptBlockPart_4TXT").value =
            values.SCRIPTpart_4;
        }

        if (values.SCRIPTpart_5 == null) {
          console.log(`SCRIPTpart_5 == null`);
          MyCOMPort.write(values.SCRIPTpart_1 + "\r\n", () => {});
          setTimeout(() => {
            MyCOMPort.write(values.SCRIPTpart_2 + "\r\n", () => {});
          }, 500);
          setTimeout(() => {
            MyCOMPort.write(values.SCRIPTpart_3 + "\r\n", () => {});
          }, 1000);
          setTimeout(() => {
            MyCOMPort.write(values.SCRIPTpart_4 + "\r\n", () => {});
          }, 1500);
        }

        if (values.SCRIPTpart_5 != null) {
          document.getElementById("createScriptBlockPart_5TXT").value =
            values.SCRIPTpart_5;
        }

        if (values.SCRIPTpart_6 == null) {
          console.log(`SCRIPTpart_6 == null`);
          MyCOMPort.write(values.SCRIPTpart_1 + "\r\n", () => {});
          setTimeout(() => {
            MyCOMPort.write(values.SCRIPTpart_2 + "\r\n", () => {});
          }, 500);
          setTimeout(() => {
            MyCOMPort.write(values.SCRIPTpart_3 + "\r\n", () => {});
          }, 1000);
          setTimeout(() => {
            MyCOMPort.write(values.SCRIPTpart_4 + "\r\n", () => {});
          }, 1500);
          setTimeout(() => {
            MyCOMPort.write(values.SCRIPTpart_5 + "\r\n", () => {});
          }, 2000);
        }

        if (values.SCRIPTpart_6 != null) {
          document.getElementById("createScriptBlockPart_6TXT").value =
            values.SCRIPTpart_6;
        }

        if (values.SCRIPTpart_7 == null) {
          console.log(`SCRIPTpart_7 == null`);
          MyCOMPort.write(values.SCRIPTpart_1 + "\r\n", () => {});
          setTimeout(() => {
            MyCOMPort.write(values.SCRIPTpart_2 + "\r\n", () => {});
          }, 500);
          setTimeout(() => {
            MyCOMPort.write(values.SCRIPTpart_3 + "\r\n", () => {});
          }, 1000);
          setTimeout(() => {
            MyCOMPort.write(values.SCRIPTpart_4 + "\r\n", () => {});
          }, 1500);
          setTimeout(() => {
            MyCOMPort.write(values.SCRIPTpart_5 + "\r\n", () => {});
          }, 2000);
          setTimeout(() => {
            MyCOMPort.write(values.SCRIPTpart_6 + "\r\n", () => {});
          }, 2500);
        }

        if (values.SCRIPTpart_7 != null) {
          document.getElementById("createScriptBlockPart_7TXT").value =
            values.SCRIPTpart_7;
        }

        if (values.SCRIPTpart_8 == null) {
          console.log(`SCRIPTpart_8 == null`);
          MyCOMPort.write(values.SCRIPTpart_1 + "\r\n", () => {});
          setTimeout(() => {
            MyCOMPort.write(values.SCRIPTpart_2 + "\r\n", () => {});
          }, 500);
          setTimeout(() => {
            MyCOMPort.write(values.SCRIPTpart_3 + "\r\n", () => {});
          }, 1000);
          setTimeout(() => {
            MyCOMPort.write(values.SCRIPTpart_4 + "\r\n", () => {});
          }, 1500);
          setTimeout(() => {
            MyCOMPort.write(values.SCRIPTpart_5 + "\r\n", () => {});
          }, 2000);
          setTimeout(() => {
            MyCOMPort.write(values.SCRIPTpart_6 + "\r\n", () => {});
          }, 2500);
          setTimeout(() => {
            MyCOMPort.write(values.SCRIPTpart_7 + "\r\n", () => {});
          }, 3000);
        }

        if (values.SCRIPTpart_8 != null) {
          document.getElementById("createScriptBlockPart_7TXT").value =
            values.SCRIPTpart_7;
        }

        if (values.SCRIPTpart_9 == null) {
          console.log(`SCRIPTpart_9 == null`);
          MyCOMPort.write(values.SCRIPTpart_1 + "\r\n", () => {});
          setTimeout(() => {
            MyCOMPort.write(values.SCRIPTpart_2 + "\r\n", () => {});
          }, 500);
          setTimeout(() => {
            MyCOMPort.write(values.SCRIPTpart_3 + "\r\n", () => {});
          }, 1000);
          setTimeout(() => {
            MyCOMPort.write(values.SCRIPTpart_4 + "\r\n", () => {});
          }, 1500);
          setTimeout(() => {
            MyCOMPort.write(values.SCRIPTpart_5 + "\r\n", () => {});
          }, 2000);
          setTimeout(() => {
            MyCOMPort.write(values.SCRIPTpart_6 + "\r\n", () => {});
          }, 2500);
          setTimeout(() => {
            MyCOMPort.write(values.SCRIPTpart_7 + "\r\n", () => {});
          }, 3000);
          setTimeout(() => {
            MyCOMPort.write(values.SCRIPTpart_8 + "\r\n", () => {});
          }, 3500);
        }

        if (values.SCRIPTpart_9 != null) {
          document.getElementById("createScriptBlockPart_8TXT").value =
            values.SCRIPTpart_8;
        }

        if (values.SCRIPTpart_10 == null) {
          console.log(`SCRIPTpart_10 == null`);
          MyCOMPort.write(values.SCRIPTpart_1 + "\r\n", () => {});
          setTimeout(() => {
            MyCOMPort.write(values.SCRIPTpart_2 + "\r\n", () => {});
          }, 500);
          setTimeout(() => {
            MyCOMPort.write(values.SCRIPTpart_3 + "\r\n", () => {});
          }, 1000);
          setTimeout(() => {
            MyCOMPort.write(values.SCRIPTpart_4 + "\r\n", () => {});
          }, 1500);
          setTimeout(() => {
            MyCOMPort.write(values.SCRIPTpart_5 + "\r\n", () => {});
          }, 2000);
          setTimeout(() => {
            MyCOMPort.write(values.SCRIPTpart_6 + "\r\n", () => {});
          }, 2500);
          setTimeout(() => {
            MyCOMPort.write(values.SCRIPTpart_7 + "\r\n", () => {});
          }, 3000);
          setTimeout(() => {
            MyCOMPort.write(values.SCRIPTpart_8 + "\r\n", () => {});
          }, 3500);
          setTimeout(() => {
            MyCOMPort.write(values.SCRIPTpart_9 + "\r\n", () => {});
          }, 4000);
        }

        if (values.SCRIPTpart_10 != null) {
          document.getElementById("createScriptBlockPart_10TXT").value =
            values.SCRIPTpart_10;
        }

        if (values.SCRIPTpart_11 == null) {
          console.log(`SCRIPTpart_11 == null`);
          MyCOMPort.write(values.SCRIPTpart_1 + "\r\n", () => {});
          setTimeout(() => {
            MyCOMPort.write(values.SCRIPTpart_2 + "\r\n", () => {});
          }, 500);
          setTimeout(() => {
            MyCOMPort.write(values.SCRIPTpart_3 + "\r\n", () => {});
          }, 1000);
          setTimeout(() => {
            MyCOMPort.write(values.SCRIPTpart_4 + "\r\n", () => {});
          }, 1500);
          setTimeout(() => {
            MyCOMPort.write(values.SCRIPTpart_5 + "\r\n", () => {});
          }, 2000);
          setTimeout(() => {
            MyCOMPort.write(values.SCRIPTpart_6 + "\r\n", () => {});
          }, 2500);
          setTimeout(() => {
            MyCOMPort.write(values.SCRIPTpart_7 + "\r\n", () => {});
          }, 3000);
          setTimeout(() => {
            MyCOMPort.write(values.SCRIPTpart_8 + "\r\n", () => {});
          }, 3500);
          setTimeout(() => {
            MyCOMPort.write(values.SCRIPTpart_9 + "\r\n", () => {});
          }, 4000);
          setTimeout(() => {
            MyCOMPort.write(values.SCRIPTpart_10 + "\r\n", () => {});
          }, 4500);
        }

        if (values.SCRIPTpart_11 != null) {
          document.getElementById("createScriptBlockPart_11TXT").value =
            values.SCRIPTpart_11;
        }

        if (values.SCRIPTpart_12 == null) {
          console.log(`SCRIPTpart_12 == null`);
          MyCOMPort.write(values.SCRIPTpart_1 + "\r\n", () => {});
          setTimeout(() => {
            MyCOMPort.write(values.SCRIPTpart_2 + "\r\n", () => {});
          }, 500);
          setTimeout(() => {
            MyCOMPort.write(values.SCRIPTpart_3 + "\r\n", () => {});
          }, 1000);
          setTimeout(() => {
            MyCOMPort.write(values.SCRIPTpart_4 + "\r\n", () => {});
          }, 1500);
          setTimeout(() => {
            MyCOMPort.write(values.SCRIPTpart_5 + "\r\n", () => {});
          }, 2000);
          setTimeout(() => {
            MyCOMPort.write(values.SCRIPTpart_6 + "\r\n", () => {});
          }, 2500);
          setTimeout(() => {
            MyCOMPort.write(values.SCRIPTpart_7 + "\r\n", () => {});
          }, 3000);
          setTimeout(() => {
            MyCOMPort.write(values.SCRIPTpart_8 + "\r\n", () => {});
          }, 3500);
          setTimeout(() => {
            MyCOMPort.write(values.SCRIPTpart_9 + "\r\n", () => {});
          }, 4000);
          setTimeout(() => {
            MyCOMPort.write(values.SCRIPTpart_10 + "\r\n", () => {});
          }, 4500);
          setTimeout(() => {
            MyCOMPort.write(values.SCRIPTpart_11 + "\r\n", () => {});
          }, 5000);
        }

        if (values.SCRIPTpart_12 != null) {
          console.log(`SCRIPTpart_12 != null`);
          document.getElementById("createScriptBlockPart_12TXT").value =
            values.SCRIPTpart_12;
        }

        if (values.SCRIPTpart_13 == null) {
          console.log(`SCRIPTpart_12 == null`);
          MyCOMPort.write(values.SCRIPTpart_1 + "\r\n", () => {});
          setTimeout(() => {
            MyCOMPort.write(values.SCRIPTpart_2 + "\r\n", () => {});
          }, 500);
          setTimeout(() => {
            MyCOMPort.write(values.SCRIPTpart_3 + "\r\n", () => {});
          }, 1000);
          setTimeout(() => {
            MyCOMPort.write(values.SCRIPTpart_4 + "\r\n", () => {});
          }, 1500);
          setTimeout(() => {
            MyCOMPort.write(values.SCRIPTpart_5 + "\r\n", () => {});
          }, 2000);
          setTimeout(() => {
            MyCOMPort.write(values.SCRIPTpart_6 + "\r\n", () => {});
          }, 2500);
          setTimeout(() => {
            MyCOMPort.write(values.SCRIPTpart_7 + "\r\n", () => {});
          }, 3000);
          setTimeout(() => {
            MyCOMPort.write(values.SCRIPTpart_8 + "\r\n", () => {});
          }, 3500);
          setTimeout(() => {
            MyCOMPort.write(values.SCRIPTpart_9 + "\r\n", () => {});
          }, 4000);
          setTimeout(() => {
            MyCOMPort.write(values.SCRIPTpart_10 + "\r\n", () => {});
          }, 4500);
          setTimeout(() => {
            MyCOMPort.write(values.SCRIPTpart_11 + "\r\n", () => {});
          }, 5000);
          setTimeout(() => {
            MyCOMPort.write(values.SCRIPTpart_12 + "\r\n", () => {});
          }, 5500);
        }

        if (values.SCRIPTpart_13 != null) {
          console.log(`SCRIPTpart_13 != null`);
          document.getElementById("createScriptBlockPart_13TXT").value =
            values.SCRIPTpart_13;
        }

        if (values.SCRIPTpart_14 == null) {
          console.log(`SCRIPTpart_14 == null`);
          MyCOMPort.write(values.SCRIPTpart_1 + "\r\n", () => {});
          setTimeout(() => {
            MyCOMPort.write(values.SCRIPTpart_2 + "\r\n", () => {});
          }, 500);
          setTimeout(() => {
            MyCOMPort.write(values.SCRIPTpart_3 + "\r\n", () => {});
          }, 1000);
          setTimeout(() => {
            MyCOMPort.write(values.SCRIPTpart_4 + "\r\n", () => {});
          }, 1500);
          setTimeout(() => {
            MyCOMPort.write(values.SCRIPTpart_5 + "\r\n", () => {});
          }, 2000);
          setTimeout(() => {
            MyCOMPort.write(values.SCRIPTpart_6 + "\r\n", () => {});
          }, 2500);
          setTimeout(() => {
            MyCOMPort.write(values.SCRIPTpart_7 + "\r\n", () => {});
          }, 3000);
          setTimeout(() => {
            MyCOMPort.write(values.SCRIPTpart_8 + "\r\n", () => {});
          }, 3500);
          setTimeout(() => {
            MyCOMPort.write(values.SCRIPTpart_9 + "\r\n", () => {});
          }, 4000);
          setTimeout(() => {
            MyCOMPort.write(values.SCRIPTpart_10 + "\r\n", () => {});
          }, 4500);
          setTimeout(() => {
            MyCOMPort.write(values.SCRIPTpart_11 + "\r\n", () => {});
          }, 5000);
          setTimeout(() => {
            MyCOMPort.write(values.SCRIPTpart_12 + "\r\n", () => {});
          }, 5500);
          setTimeout(() => {
            MyCOMPort.write(values.SCRIPTpart_13 + "\r\n", () => {});
          }, 6000);
        }

        if (values.SCRIPTpart_14 != null) {
          console.log(`SCRIPTpart_14 != null`);
          document.getElementById("createScriptBlockPart_14TXT").value =
            values.SCRIPTpart_14;
        }

        if (values.SCRIPTpart_15 == null) {
          console.log(`SCRIPTpart_15 == null`);
          MyCOMPort.write(values.SCRIPTpart_1 + "\r\n", () => {});
          setTimeout(() => {
            MyCOMPort.write(values.SCRIPTpart_2 + "\r\n", () => {});
          }, 500);
          setTimeout(() => {
            MyCOMPort.write(values.SCRIPTpart_3 + "\r\n", () => {});
          }, 1000);
          setTimeout(() => {
            MyCOMPort.write(values.SCRIPTpart_4 + "\r\n", () => {});
          }, 1500);
          setTimeout(() => {
            MyCOMPort.write(values.SCRIPTpart_5 + "\r\n", () => {});
          }, 2000);
          setTimeout(() => {
            MyCOMPort.write(values.SCRIPTpart_6 + "\r\n", () => {});
          }, 2500);
          setTimeout(() => {
            MyCOMPort.write(values.SCRIPTpart_7 + "\r\n", () => {});
          }, 3000);
          setTimeout(() => {
            MyCOMPort.write(values.SCRIPTpart_8 + "\r\n", () => {});
          }, 3500);
          setTimeout(() => {
            MyCOMPort.write(values.SCRIPTpart_9 + "\r\n", () => {});
          }, 4000);
          setTimeout(() => {
            MyCOMPort.write(values.SCRIPTpart_10 + "\r\n", () => {});
          }, 4500);
          setTimeout(() => {
            MyCOMPort.write(values.SCRIPTpart_11 + "\r\n", () => {});
          }, 5000);
          setTimeout(() => {
            MyCOMPort.write(values.SCRIPTpart_12 + "\r\n", () => {});
          }, 5500);
          setTimeout(() => {
            MyCOMPort.write(values.SCRIPTpart_13 + "\r\n", () => {});
          }, 6000);
          setTimeout(() => {
            MyCOMPort.write(values.SCRIPTpart_14 + "\r\n", () => {});
          }, 6500);
        }

        if (values.SCRIPTpart_15 != null) {
          console.log(`SCRIPTpart_15 != null`);
          document.getElementById("createScriptBlockPart_14TXT").value =
            values.SCRIPTpart_14;
        }*/

	//из модуля ком порта
		
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
   
        