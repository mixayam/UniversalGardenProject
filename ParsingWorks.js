//25.11.2020 заготовка парсера, отработка технологии
//27.11.2020 различает команду, умеет выделять и МОДЕРНИЗИРОВАТЬ ЭЛЕМЕНТЫ ОКНА
//1.12.2020 в процессе наполнения, Status.
//var CommGear1FullOpen = 10;

exports.GHSetupParser = function  (MyDataString) {

	var CurrentDelimPosition = 0;
	var MyOutput;
	
	console.log(MyDataString);

	if (MyDataString.indexOf('Unknown command')!== -1) {return JSON.stringify({"Command":"Unknown"});}

	console.log(IsJsonString(MyDataString));
	if (IsJsonString(MyDataString) == true){ 
		return setupFormCompliting(JSON.parse(MyDataString));
	}

	//выделяем первый элемент, это команда, грузим в MyCommand, уходим на переключатель
	CurrentDelimPosition = MyDataString.indexOf(',',CurrentDelimPosition);
	//var MyCommand = MyDataString.substr(0,MyDataString.indexOf(',',CurrentDelimPosition));
	var MyCommand = MyDataString.substr(0,CurrentDelimPosition);
	var StartPos = CurrentDelimPosition;
	var WaterTemperature;
	switch(MyCommand){
		case 'rsh': //console.log("rsh command detected"); // Это rsh ***********************************
			//позиция выделяемого элемента уже есть, находим где новый разделитель?
			CurrentDelimPosition = MyDataString.indexOf(',',CurrentDelimPosition+1);
			var MyBoardID = MyDataString.substr(StartPos+1,CurrentDelimPosition-StartPos-1); //Идентификатор борда
			//document.getElementById("CommonInfo").value = "Board ID = " + MyBoardID + " at " + document.getElementById("CommonInfo").value; 
		
			StartPos = CurrentDelimPosition; //определяем стартовую позицию выделяемого элемента 
			CurrentDelimPosition = MyDataString.indexOf(',',CurrentDelimPosition+1);// где новый разделитель?
			var TempThresHigh = MyDataString.substr(StartPos+1,CurrentDelimPosition-StartPos-1); //Верхний порог температуры  (0)
			document.getElementById("TopTempThresTxt").value = TempThresHigh;
		
			StartPos = CurrentDelimPosition; //определяем стартовую позицию выделяемого элемента 
			CurrentDelimPosition = MyDataString.indexOf(',',CurrentDelimPosition+1);// где новый разделитель?
			var TempThresLow = MyDataString.substr(StartPos+1,CurrentDelimPosition-StartPos-1); //Нижний порог температуры  (1)
			document.getElementById("BottomTempThresTxt").value = TempThresLow;
		
			StartPos = CurrentDelimPosition; //определяем стартовую позицию выделяемого элемента 
			CurrentDelimPosition = MyDataString.indexOf(',',CurrentDelimPosition+1);// где новый разделитель?
			var HumThres = MyDataString.substr(StartPos+1,CurrentDelimPosition-StartPos-1); //Верхний порог влажности (2)
			document.getElementById("HumidityTHresField").value = HumThres;
		
			StartPos = CurrentDelimPosition; //определяем стартовую позицию выделяемого элемента 
			CurrentDelimPosition = MyDataString.indexOf(',',CurrentDelimPosition+1);// где новый разделитель?
			var GenMeasurementsDelay = MyDataString.substr(StartPos+1,CurrentDelimPosition-StartPos-1); //Основная Задержка  (3)
			//document.getElementById("GenDelayField").value = GenMeasurementsDelay/10;
			document.getElementById("GenDelayField").value = GenMeasurementsDelay;
		
			StartPos = CurrentDelimPosition; //определяем стартовую позицию выделяемого элемента 
			CurrentDelimPosition = MyDataString.indexOf(',',CurrentDelimPosition+1);// где новый разделитель?
			var TempMeasurementsDelay = MyDataString.substr(StartPos+1,CurrentDelimPosition-StartPos-1); //Задержка измерения температуры (4)
			//document.getElementById("TempMeasurementsDelayField").value = TempMeasurementsDelay/10;
			document.getElementById("TempMeasurementsDelayField").value = TempMeasurementsDelay;

			StartPos = CurrentDelimPosition; //определяем стартовую позицию выделяемого элемента 
			CurrentDelimPosition = MyDataString.indexOf(',',CurrentDelimPosition+1);// где новый разделитель?
			var HumMeasurementsDelay = MyDataString.substr(StartPos+1,CurrentDelimPosition-StartPos-1); //Задержка измерения температуры (4)
			document.getElementById("HumidityMeasurementsDelayField").value = HumMeasurementsDelay;
			console.log(HumMeasurementsDelay);

			//StartPos = CurrentDelimPosition; //определяем стартовую позицию выделяемого элемента 
			//CurrentDelimPosition = MyDataString.indexOf(',',CurrentDelimPosition+1);// где новый разделитель?
			//var ValveOpenTime = MyDataString.substr(StartPos+1,CurrentDelimPosition-StartPos-1); //Время открытия клапана(26)
			//document.getElementById("ValveOpeningTimeField").value = ValveOpenTime;
			
		
			StartPos = CurrentDelimPosition; //определяем стартовую позицию выделяемого элемента 
			CurrentDelimPosition = MyDataString.indexOf(',',CurrentDelimPosition+1);// где новый разделитель?
			var AutomaticWorkScenario = MyDataString.substr(StartPos+1,CurrentDelimPosition-StartPos-1); //Сценарии , надо обрабатывать (5)
			//console.log(AutomaticWorkScenario)
			if ((AutomaticWorkScenario & 0b1) != 0) {
				console.log((AutomaticWorkScenario & 0b1))
				document.getElementById("WateringJustTimedRadio").checked = true; //простой сценарий
				console.log(document.getElementById("WateringJustTimedRadio").value)
				document.getElementById("WateringTempDependentRadio").checked  = false;
				document.getElementById("WateringMostSensDepRadio").checked  = false;
				var WateringJustTimed = true;
				var WateringTempDependent = false;
				var WateringMostSensDep = false;
			}						
			else if ((AutomaticWorkScenario & 0b10) != 0) {
				document.getElementById("WateringJustTimedRadio").checked  = false;
				document.getElementById("WateringTempDependentRadio").checked  = true;//по производной
				document.getElementById("WateringMostSensDepRadio").checked  = false;
				var WateringJustTimed = false;
				var WateringTempDependent = true;
				var WateringMostSensDep = false;
			}
			else if ((AutomaticWorkScenario & 0b100) != 0) {
				document.getElementById("WateringJustTimedRadio").checked  = false;
				document.getElementById("WateringTempDependentRadio").checked  = false;
				document.getElementById("WateringMostSensDepRadio").checked  = true; //ночное проветривание
				var WateringJustTimed = false;
				var WateringTempDependent = false;
				var WateringMostSensDep = true;
			}
			if ((AutomaticWorkScenario & 0b1000) != 0) {
				document.getElementById("SimpleScenarioCheck").checked = true; //простой сценарий
				document.getElementById("VariationCutOffCheck").checked = false;
				document.getElementById("NightFogCtrlRadio").checked = false;
				var SimpleScenario = true;
				var VariationCutOff = false;
				var NightFog = false;
			}			
			else if ((AutomaticWorkScenario & 0b10000) != 0) {
				document.getElementById("SimpleScenarioCheck").checked = false;
				document.getElementById("VariationCutOffCheck").checked = true;//по производной
				document.getElementById("NightFogCtrlRadio").checked = false;
				var SimpleScenario = false;
				var VariationCutOff = true;
				var NightFog = false;
			}
			else if ((AutomaticWorkScenario & 0b100000) != 0) {
				document.getElementById("SimpleScenarioCheck").checked = false;
				document.getElementById("VariationCutOffCheck").checked = false;
				document.getElementById("NightFogCtrlRadio").checked = true; //ночное проветривание
				var SimpleScenario = false;
				var VariationCutOff = false;
				var NightFog = true;
			} 
		
			StartPos = CurrentDelimPosition; //определяем стартовую позицию выделяемого элемента 
			CurrentDelimPosition = MyDataString.indexOf(',',CurrentDelimPosition+1);// где новый разделитель?
			var ValveOpenTime = MyDataString.substr(StartPos+1,CurrentDelimPosition-StartPos-1); //Время открытия клапана(26)
			document.getElementById("ValveOpeningTimeField").value = ValveOpenTime;

			StartPos = CurrentDelimPosition; //определяем стартовую позицию выделяемого элемента 
			CurrentDelimPosition = MyDataString.indexOf(',',CurrentDelimPosition+1);// где новый разделитель?
			var Gear1FullOpen = MyDataString.substr(StartPos+1,CurrentDelimPosition-StartPos-1); //Привод 1, полное открытие (6)
			CommGear1FullOpen = Gear1FullOpen;
			document.getElementById("Gear1FullOpen").value = Gear1FullOpen;
		
			StartPos = CurrentDelimPosition; //определяем стартовую позицию выделяемого элемента 
			CurrentDelimPosition = MyDataString.indexOf(',',CurrentDelimPosition+1);// где новый разделитель?
			var Gear2FullOpen = MyDataString.substr(StartPos+1,CurrentDelimPosition-StartPos-1); ///Привод 2, полное открытие (7)
			document.getElementById("Gear2FullOpen").value = Gear2FullOpen;
		
			StartPos = CurrentDelimPosition; //определяем стартовую позицию выделяемого элемента 
			CurrentDelimPosition = MyDataString.indexOf(',',CurrentDelimPosition+1);// где новый разделитель?
			var MyControls = MyDataString.substr(StartPos+1,CurrentDelimPosition-StartPos-1); //Controls (8), надо обрабатывать
			//console.log ("MyControls & 0b10000000000");
			console.log (MyControls);
			if ((MyControls & 0b1) != 0) { //Ignore open door 1
				document.getElementById("IgnoreDoor1SensCheck").checked = true;
				var IgnoreDoor1Sensor = true;
			}
			else {
				document.getElementById("IgnoreDoor1SensCheck").checked = false;
			 var IgnoreDoor1Sensor = false;
			}

			if ((MyControls & 0b10) != 0) { //Ignore open door 2
				document.getElementById("IgnoreDoor2SensCheck").checked = true;
				var IgnoreDoor2Sensor = true;
			} 
			else {
				document.getElementById("IgnoreDoor2SensCheck").checked = false;
				var IgnoreDoor2Sensor = false;
			}

			if ((MyControls & 0b1000000000) != 0) {
				var ValvePosition = true;
				document.getElementById("ValvePositionSensor").checked = true;
			} //Valve has position sensor
			else {
				var ValvePosition = false;
				document.getElementById("ValvePositionSensor").checked = false;
			}

			if ((MyControls & 0b100) != 0) {//Periodical report fo remote
				document.getElementById("PeriodicalRepRemFormat").checked = true;
				var PeriodicalRepRemFormat = true;
			} 
			else {
				document.getElementById("PeriodicalRepRemFormat").checked = false;
				var PeriodicalRepRemFormat = false;
			}

		 	if ((MyControls & 0b1000) != 0) { //Periodical report fo human 
			 document.getElementById("PeriodicalRepHumFormat").checked = true
			 var PeriodicalRepHumFormat = true;
			}
		  	else {
			  document.getElementById("PeriodicalRepHumFormat").checked = false;
			  var PeriodicalRepHumFormat = false;
			}

			if ((MyControls & 8) != 0) { //Periodical report fo human 
			document.getElementById("PeriodicalRepJSONFormat").checked = true
			var PeriodicalRepHumFormat = true;
			}
			else {
			document.getElementById("PeriodicalRepJSONFormat").checked = false;
			var PeriodicalRepHumFormat = false;
			}

			if ((MyControls & 0b100000) != 0) { //Ground sensor presents
			 document.getElementById("GroundTemperatureCheck").checked = true;
			 var GroundTemperature = true; 
			} 
			else {
			  document.getElementById("GroundTemperatureCheck").checked = false;
			  var GroundTemperature = false; 
			}

			if ((MyControls & 0b1000000000000) != 0) { //Ground sensor presents
			document.getElementById("GroundZeroTemperatureCheck").checked = true;
			var GroundZeroTemperature = true; 
			}
			else {
			document.getElementById("GroundZeroTemperatureCheck").checked = false;
			var GroundZeroTemperature = false; 
			}

			if ((MyControls & 0b1000000) != 0) {//External temperature sensor presents
			 document.getElementById("ExternalTemperatureCheck").checked = true;
			 var ExternalTemperature = true;
			}
			else {
			  document.getElementById("ExternalTemperatureCheck").checked = false;
			  var ExternalTemperature = false;
			}

			if ((MyControls & 8192) != 0) {//External temperature sensor presents
			document.getElementById("WaterTempCheck").checked = true;
			var WaterTemperature = true;
			} 
			else {
			document.getElementById("WaterTempCheck").checked = false;
			var WaterTemperature = false;
			}

			if ((MyControls & 16) != 0) {//All message in hum
				document.getElementById("ZondTempCheck").checked = true;
				var ZondTemperature = true;
			} 
			else {
				 document.getElementById("ZondTempCheck").checked = false;
				 var ZondTemperature = false;
			}

			if ((MyControls & 0b10000000) != 0) {//Day light sensor presents
			 document.getElementById("DayLightCheck").checked = true;
			 var DayLightSensor = true;
			} 
			else {
			  document.getElementById("DayLightCheck").checked = false;
			  var DayLightSensor = false;
			}

			if ((MyControls & 0b1000000000) != 0) {//Valve position sensor
			 document.getElementById("ValveHasPosSensCheck").checked = true;
			 var ValveSensorPresents = true;
			} 
			else {
			  document.getElementById("ValveHasPosSensCheck").checked = false;
			  var ValveSensorPresents = false;
			}

			if ((MyControls & 0b10000000000) != 0) {//All message in wnd
			 document.getElementById("AllEventsRepRemFormat").checked = true;
			 var EventsInWnd = true;
			} 
			else {
			  document.getElementById("AllEventsRepRemFormat").checked = false;
			  var EventsInWnd = false;
			}

			if ((MyControls & 0b100000000000) != 0) {//All message in hum
			 document.getElementById("AllEventsRepHumFormat").checked = true;
			 var EventsInHum = true;
			} 
		  	else {
			  document.getElementById("AllEventsRepHumFormat").checked = false;
			  var EventsInHum = false;
			}
		
			if ((MyControls & 16384) != 0) {//All message in hum
				document.getElementById("HumidityCheck").checked = true;
				var HumiditySensor = true;
			} 
			else {
				 document.getElementById("HumidityCheck").checked = false;
				 var HumiditySensor = false;
			}
		 
			//StartPos = CurrentDelimPosition; //определяем стартовую позицию выделяемого элемента 
			//CurrentDelimPosition = MyDataString.indexOf(',',CurrentDelimPosition+1);// где новый разделитель?
			//var BoardID = MyDataString.substr(StartPos+1,CurrentDelimPosition-StartPos-1); //BoardID (9)
			//document.getElementById("Gear2FullOpen").value = BoardID;
		
			StartPos = CurrentDelimPosition; //определяем стартовую позицию выделяемого элемента 
			CurrentDelimPosition = MyDataString.indexOf(',',CurrentDelimPosition+1);// где новый разделитель?
			var TempCutOff = MyDataString.substr(StartPos+1,CurrentDelimPosition-StartPos-1); //Порог температуры при работе по производной (10)
			document.getElementById("TempCutOffVariationMode").value = TempCutOff;
		
			StartPos = CurrentDelimPosition; //определяем стартовую позицию выделяемого элемента 
			CurrentDelimPosition = MyDataString.indexOf(',',CurrentDelimPosition+1);// где новый разделитель?
			var TempAugment = MyDataString.substr(StartPos+1,CurrentDelimPosition-StartPos-1); //Приращение температуры(11)
			document.getElementById("TempVarDegField").value = TempAugment;
		
			StartPos = CurrentDelimPosition; //определяем стартовую позицию выделяемого элемента 
			CurrentDelimPosition = MyDataString.indexOf(',',CurrentDelimPosition+1);// где новый разделитель?100000000
			var TimeAugment = MyDataString.substr(StartPos+1,CurrentDelimPosition-StartPos-1); //Приращение времени (12)
			document.getElementById("TimeVarDegField").value = TimeAugment;
		
			StartPos = CurrentDelimPosition; //определяем стартовую позицию выделяемого элемента 
			CurrentDelimPosition = MyDataString.indexOf(',',CurrentDelimPosition+1);// где новый разделитель?100000000
			var WaterTempThres = MyDataString.substr(StartPos+1,CurrentDelimPosition-StartPos-1); //Приращение времени (12)
			document.getElementById("WaterTempThreshold").value = WaterTempThres;

			//StartPos = CurrentDelimPosition; //определяем стартовую позицию выделяемого элемента 
			//CurrentDelimPosition = MyDataString.indexOf(',',CurrentDelimPosition+1);// где новый разделитель?
			//var NightFogTemp = MyDataString.substr(StartPos+1,CurrentDelimPosition-StartPos-1); //Порог температуры при ночном проветривании (13)
			//document.getElementById("TempNightFogField").value = NightFogTemp;                  //Нажо вводить в отчет
		
			//StartPos = CurrentDelimPosition; //определяем стартовую позицию выделяемого элемента 
			//CurrentDelimPosition = MyDataString.indexOf(',',CurrentDelimPosition+1);// где новый разделитель?
			//var HumMeasurementsDelay = MyDataString.substr(StartPos+1,CurrentDelimPosition-StartPos-1); //Задержка измерения влажности(25)
			//document.getElementById("HumidityMeasurementsDelayField").value = HumMeasurementsDelay;
		
			//StartPos = CurrentDelimPosition; //определяем стартовую позицию выделяемого элемента 
			//CurrentDelimPosition = MyDataString.indexOf(',',CurrentDelimPosition+1);// где новый разделитель?
			//var ValveOpenTime = MyDataString.substr(StartPos+1,CurrentDelimPosition-StartPos-1); //Время открытия клапана(26)
			//document.getElementById("ValveOpeningTimeField").value = ValveOpenTime;
		 
		 	//var GroundZeroTemperature = false; //ввести в Ардуино, привязать к полю
			//var WaterTemperature = false; //ввести в Ардуино, привязать к полю
				 
		
			return JSON.stringify({
			"Command":MyCommand,
			"BoardID": MyBoardID,
			"Thresholds":{
				"TempHigh": TempThresHigh,
				"TempLow":TempThresLow,
				"Humidity":HumThres
			},
			"Timing":{
				"GeneralDelay":GenMeasurementsDelay,
				"TempMeasurementDelay":TempMeasurementsDelay,
				"HumidtyMearurementDelay":HumMeasurementsDelay,
				"ValveOpenTime":ValveOpenTime
			},
			"Scenarios":{ 
				"Watering":[
					WateringJustTimed,
					WateringTempDependent,
					WateringMostSensDep
				],
			"Doors":[
					SimpleScenario,
					VariationCutOff,
					NightFog
				]
			},
			"Hardware":{
				"Gear1FullOpen":Gear1FullOpen,
				"Gear2FullOpen":Gear2FullOpen
			},
			"Reports":[
				PeriodicalRepRemFormat,
				PeriodicalRepHumFormat,
				EventsInWnd,
				EventsInHum 
			],
			"Sensors":[
				GroundTemperature,
				ExternalTemperature,
				GroundZeroTemperature,
				WaterTemperature,
				HumiditySensor,
				ValvePosition,
				DayLightSensor
			],
			"Options":[ 
				IgnoreDoor1Sensor,
				IgnoreDoor2Sensor
			]
			})	
		 		 
		break;
		case 'rst': console.log("rst command detected"); break;
		default: console.log("any command detected"); break;
	}
    }

	function setupFormCompliting(myData){
		console.log(myData);
		//if (myData.command == "rst"){return;}
		if (myData.command != "rsh"){return;}
		//console.log(myData.humMearurementDelay);
		//document.getElementById("GenDelayField").value = GenMeasurementsDelay/10;
		
		document.getElementById("TopTempThresTxt").value = myData.TempThresHigh;
		document.getElementById("BottomTempThresTxt").value = myData.TempThresLow;
		document.getElementById("HumidityTHresField").value = myData.HumThres;
		//document.getElementById("GenDelayField").value = myData.myGeneralDelay/10;
		document.getElementById("GenDelayField").value = myData.myGeneralDelay;
		//document.getElementById("TempMeasurementsDelayField").value = myData.tempMearurementDelay/10;
		document.getElementById("TempMeasurementsDelayField").value = myData.tempMearurementDelay;
		//document.getElementById("HumidityMeasurementsDelayField").value =  myData.humMearurementDelay/10;
		document.getElementById("HumidityMeasurementsDelayField").value =  myData.humMearurementDelay;
		document.getElementById("WaterTempThreshold").value =  myData.WaterTempThres;
		
		
		if ((myData.AutomaticWorkScenario & 0b1) != 0) {
			console.log((myData.AutomaticWorkScenario & 0b1))
			document.getElementById("WateringJustTimedRadio").checked = true; //простой сценарий
			console.log(document.getElementById("WateringJustTimedRadio").value)
			document.getElementById("WateringTempDependentRadio").checked  = false;
			document.getElementById("WateringMostSensDepRadio").checked  = false;
			var WateringJustTimed = true;
			var WateringTempDependent = false;
			var WateringMostSensDep = false;
		}	
				
		else if ((myData.AutomaticWorkScenario & 0b10) != 0) {
			document.getElementById("WateringJustTimedRadio").checked  = false;
			document.getElementById("WateringTempDependentRadio").checked  = true;//по производной
			document.getElementById("WateringMostSensDepRadio").checked  = false;
			var WateringJustTimed = false;
			var WateringTempDependent = true;
			var WateringMostSensDep = false;
		}
		else if ((myData.AutomaticWorkScenario & 0b100) != 0) {
			document.getElementById("WateringJustTimedRadio").checked  = false;
			document.getElementById("WateringTempDependentRadio").checked  = false;
			document.getElementById("WateringMostSensDepRadio").checked  = true; //ночное проветривание
			var WateringJustTimed = false;
			var WateringTempDependent = false;
			var WateringMostSensDep = true;
		}
		if ((myData.AutomaticWorkScenario & 0b1000) != 0) {
			document.getElementById("SimpleScenarioCheck").checked = true; //простой сценарий
			document.getElementById("VariationCutOffCheck").checked = false;
			document.getElementById("NightFogCtrlRadio").checked = false;
			var SimpleScenario = true;
			var VariationCutOff = false;
			var NightFog = false;
		}			
		else if ((myData.AutomaticWorkScenario & 0b10000) != 0) {
			document.getElementById("SimpleScenarioCheck").checked = false;
			document.getElementById("VariationCutOffCheck").checked = true;//по производной
			document.getElementById("NightFogCtrlRadio").checked = false;
			var SimpleScenario = false;
			var VariationCutOff = true;
			var NightFog = false;
		}
		else if ((myData.AutomaticWorkScenario & 0b100000) != 0) {
			document.getElementById("SimpleScenarioCheck").checked = false;
			document.getElementById("VariationCutOffCheck").checked = false;
			document.getElementById("NightFogCtrlRadio").checked = true; //ночное проветривание
			var SimpleScenario = false;
			var VariationCutOff = false;
			var NightFog = true;
		} 
	
		CommGear1FullOpen = myData.Gear1FullOpen;
		document.getElementById("Gear1FullOpen").value = myData.FullOpenGearPosition1;
		document.getElementById("Gear2FullOpen").value = myData.FullOpenGearPosition2;
		
		if ((myData.MyControls & 0b1) != 0) { //Ignore open door 1
			document.getElementById("IgnoreDoor1SensCheck").checked = true;
			var IgnoreDoor1Sensor = true;
		 }
		else {
			document.getElementById("IgnoreDoor1SensCheck").checked = false;
		 var IgnoreDoor1Sensor = false;
		}
		if ((myData.MyControls & 0b10) != 0) { //Ignore open door 2
			document.getElementById("IgnoreDoor2SensCheck").checked = true;
			var IgnoreDoor2Sensor = true;
		 } 
		else {
			document.getElementById("IgnoreDoor2SensCheck").checked = false;
			var IgnoreDoor2Sensor = false;
		 }
		if ((myData.MyControls & 0b1000000000) != 0) {//Valve has position sensor
			var ValvePosition = true;
			document.getElementById("ValvePositionSensor").checked = true;
		 } 
		else {
			var ValvePosition = false;
			document.getElementById("ValvePositionSensor").checked = false;
		 }
		if ((myData.MyControls & 0b100) != 0) {//Periodical report fo remote
			document.getElementById("PeriodicalRepRemFormat").checked = true;
			var PeriodicalRepRemFormat = true;
		 } 
		else {
			document.getElementById("PeriodicalRepRemFormat").checked = false;
			var PeriodicalRepRemFormat = false;
		}

	 	console.log(myData.MyControls);
	 	if ((myData.MyControls & 0b1000) != 0) { //Periodical report fo human 
		 document.getElementById("PeriodicalRepHumFormat").checked = true
		 var PeriodicalRepHumFormat = true;
		}
	  	else {
		  document.getElementById("PeriodicalRepHumFormat").checked = false;
		  var PeriodicalRepHumFormat = false;
		}
		
		if ((myData.MyControls & 8) != 0) { //Periodical report fo human 
			document.getElementById("PeriodicalRepJSONFormat").checked = true
			var PeriodicalRepHumFormat = true;
		}
		else {
			document.getElementById("PeriodicalRepJSONFormat").checked = false;
			var PeriodicalRepHumFormat = false;
		}

	 	if ((myData.MyControls & 0b1000000000000) != 0) { //Ground Zero sensor presents
		 document.getElementById("GroundZeroTemperatureCheck").checked = true;
		 var GroundZeroTemperature = true; 
		} 
	  	else {
		  document.getElementById("GroundZeroTemperatureCheck").checked = false;
		  var GroundZeroTemperature = false; 
		}

		if ((myData.MyControls & 0b100000) != 0) { //Ground temp sensor presents
		document.getElementById("GroundTemperatureCheck").checked = true;
		var GroundTemperature = true; 
		} 
		else {
		document.getElementById("GroundTemperatureCheck").checked = false;
		var GroundTemperature = false; 
		}

	 	if ((myData.MyControls & 0b1000000) != 0) {//External temperature sensor presents
		 document.getElementById("ExternalTemperatureCheck").checked = true;
		 var ExternalTemperature = true;
		} 
		else {
		  document.getElementById("ExternalTemperatureCheck").checked = false;
		  var ExternalTemperature = false;
		}

		//WaterTemperature WaterTempCheck

		if ((myData.MyControls & 8192) != 0) {//Water temperature sensor presents
			document.getElementById("WaterTempCheck").checked = true;
			var WaterTemperature = true;
		   } 
		   else {
			 document.getElementById("WaterTempCheck").checked = false;
			 var WaterTemperature = false;
		}

		if ((myData.MyControls & 16) != 0) {//Zond temperature
			document.getElementById("ZondTempCheck").checked = true;
			var ZondTemperature = true;
		} 
		else {
			 document.getElementById("ZondTempCheck").checked = false;
			 var ZondTemperature = false;
		}

	 	if ((myData.MyControls & 0b10000000) != 0) {//Day light sensor presents
		 document.getElementById("DayLightCheck").checked = true;
		 var DayLightSensor = true;
		} 
	  	else {
		  document.getElementById("DayLightCheck").checked = false;
		  var DayLightSensor = false;
		}

	 	if ((myData.MyControls & 0b1000000000) != 0) {//Valve position sensor
		 document.getElementById("ValveHasPosSensCheck").checked = true;
		 var ValveSensorPresents = true;
		} 
	  	else {
		  document.getElementById("ValveHasPosSensCheck").checked = false;
		  var ValveSensorPresents = false;
		}

	 	if ((myData.MyControls & 0b10000000000) != 0) {//All message in wnd
		 document.getElementById("AllEventsRepRemFormat").checked = true;
		 var EventsInWnd = true;
		} 
	  	else {
		  document.getElementById("AllEventsRepRemFormat").checked = false;
		  var EventsInWnd = false;
		}

	 	if ((myData.MyControls & 0b100000000000) != 0) {//All message in hum
		 document.getElementById("AllEventsRepHumFormat").checked = true;
		 var EventsInHum = true;
		} 
	  	else {
		  document.getElementById("AllEventsRepHumFormat").checked = false;
		  var EventsInHum = false;
		}
		/*
		if ((myData.MyControls & 0b10000000000000) != 0) {//Water temp sensor
		document.getElementById("WaterTempCheck").checked = true;
		var WaterTemperature = true;
		} 
		else {
			document.getElementById("WaterTempCheck").checked = false;
			var WaterTemperature = false;
		}
		*/
		if ((myData.MyControls & 0b100000000000000) != 0) {//Hum sensor
			document.getElementById("HumidityCheck").checked = true;
			var HumiditySensor = true;
		} 
		else {
			 document.getElementById("HumidityCheck").checked = false;
			 var HumiditySensor = false;
		}
	 
		document.getElementById("TempCutOffVariationMode").value = myData.TempCutOff;
		document.getElementById("TempVarDegField").value = myData.TempAugment;
		document.getElementById("TimeVarDegField").value = myData.TimeAugment;
		document.getElementById("TempNightFogField").value = myData.TempCutOff;                  //Нажо вводить в отчет
		//document.getElementById("HumidityMeasurementsDelayField").value = myData.HumMeasurementsDelay;
		document.getElementById("ValveOpeningTimeField").value = myData.wateringSwiitchOnTime;
		
		//document.getElementById("ValveOpeningTimeField").value = myData.wateringSwiitchOnTime/10;
		
		//var GroundZeroTemperature = false; //ввести в Ардуино, привязать к полю
		//var WaterTemperature = false; //ввести в Ардуино, привязать к полю
			 
		return JSON.stringify({
		"Command":myData.command,
		"BoardID": myData.ID,
		"Thresholds":{
			"TempHigh": myData.TempThresHigh,
			"TempLow": myData.TempThresLow,
			"Humidity":myData.HumThres
		},
		"Timing":{
			"GeneralDelay": myData.myGeneralDelay,
			"TempMeasurementDelay": myData.tempMearurementDelay,
			"HumidtyMearurementDelay": myData.humMearurementDelay,
			"ValveOpenTime": myData.ValveOpenTime
		},
		"Scenarios":{ 
			"Watering":[
				WateringJustTimed,
				WateringTempDependent,
				WateringMostSensDep
			],
		"Doors":[
				SimpleScenario,
				VariationCutOff,
				NightFog
			]
		},
		"Hardware":{
			"Gear1FullOpen":myData.Gear1FullOpen,
			"Gear2FullOpen":myData.Gear2FullOpen
		},
		"Reports":[
			PeriodicalRepRemFormat,
			PeriodicalRepHumFormat,
			EventsInWnd,
			EventsInHum 
		],
		"Sensors":[
			GroundTemperature,
			ExternalTemperature,
			GroundZeroTemperature,
			WaterTemperature,
			HumiditySensor,
			ValvePosition,
			DayLightSensor
		],
		"Options":[ 
			IgnoreDoor1Sensor,
			IgnoreDoor2Sensor
		]
		})		
	}

	//}

exports.GHStatusParser = function  (MyDataString) {

    var CurrentDelimPosition = 0;
	//выделяем первый элемент, это команда, грузим в MyCommand, уходим на переключатель
	CurrentDelimPosition = MyDataString.indexOf(',',CurrentDelimPosition);
	//var MyCommand = MyDataString.substr(0,MyDataString.indexOf(',',CurrentDelimPosition));
	var MyCommand = MyDataString.substr(0,CurrentDelimPosition);
	var StartPos = CurrentDelimPosition;

	console.log(IsJsonString(MyDataString));
	if (IsJsonString(MyDataString) == true){ 
		return statusFormCompliting(JSON.parse(MyDataString));
		//MyCommand = 'rstjs';
	}

	switch(MyCommand){
	case 'rst': 
	    console.log("RST detected");

		document.getElementById("BoxTempTxt").value = "";
		document.getElementById("InternalTempTxt").value = "";
		document.getElementById("GroundZeroTempTxt").value = "";
		document.getElementById("ExternalTempTxtSec").value = "";
		document.getElementById("WaterTempTxt").value = "";
		document.getElementById("GroundTempTxt").value = "";
		document.getElementById("ZondTempTxt").value = "";
		document.getElementById("HumidityTxt").value = "";
		document.getElementById("DayLightTxt").value = "";
		document.getElementById("Actuator1Position").value = "";
		document.getElementById("Actuator2Position").value = "";

	 	//позиция выделяемого элемента уже есть, находим где новый разделитель?
		CurrentDelimPosition = MyDataString.indexOf(',',CurrentDelimPosition+1);
		var MyBoardID = MyDataString.substr(StartPos+1,CurrentDelimPosition-StartPos-1); //Идентификатор борда
		//document.getElementById("BoxInfo").value = document.getElementById("BoxInfo").value + " Board ID = " + MyBoardID;
		document.getElementById("BoxStatus").value = " Board ID = " + MyBoardID;
		
		StartPos = CurrentDelimPosition; //определяем стартовую позицию выделяемого элемента 
		CurrentDelimPosition = MyDataString.indexOf(',',CurrentDelimPosition+1);// где новый разделитель?
		var SinceLastRestart = MyDataString.substr(StartPos+1,CurrentDelimPosition-StartPos-1); //Время с последнего рестарта
		document.getElementById("BoxStatus").value = document.getElementById("BoxStatus").value + " " + SinceLastRestart/1000 + " sec (" + SinceLastRestart + ") since last restart";
		
		
		//1{"box","_","_","_","_","_","_"}; 
		StartPos = CurrentDelimPosition; //определяем стартовую позицию выделяемого элемента 
		CurrentDelimPosition = MyDataString.indexOf(',',CurrentDelimPosition+1);// где новый разделитель?
		var BoxTemperature = MyDataString.substr(StartPos+1,CurrentDelimPosition-StartPos-1); //Температура коробки
		if(BoxTemperature != -150) {document.getElementById("BoxTempTxt").value = BoxTemperature;}
		
		//2{"_","In_main","_","_","_","_","_"};
		StartPos = CurrentDelimPosition; //определяем стартовую позицию выделяемого элемента 
		CurrentDelimPosition = MyDataString.indexOf(',',CurrentDelimPosition+1);// где новый разделитель?
		var InternalTemperature = MyDataString.substr(StartPos+1,CurrentDelimPosition-StartPos-1); //Температура внутри
		if(InternalTemperature != -150) {document.getElementById("InternalTempTxt").value = InternalTemperature;}
		
		//3{"_","_","In_btm","_","_","_","_"}; ZOND
		StartPos = CurrentDelimPosition; //определяем стартовую позицию выделяемого элемента 
		CurrentDelimPosition = MyDataString.indexOf(',',CurrentDelimPosition+1);// где новый разделитель?
		var GroundZeroTemperature = MyDataString.substr(StartPos+1,CurrentDelimPosition-StartPos-1); //Температура снаружи
		if(GroundZeroTemperature != -150) {document.getElementById("GroundZeroTempTxt").value = GroundZeroTemperature;}

		//4{"_","_","_","Out","_","_","_"};
		StartPos = CurrentDelimPosition; //определяем стартовую позицию выделяемого элемента 
		CurrentDelimPosition = MyDataString.indexOf(',',CurrentDelimPosition+1);// где новый разделитель?
		var ExternalTemperature = MyDataString.substr(StartPos+1,CurrentDelimPosition-StartPos-1); //Температура снаружи
		if(ExternalTemperature != -150) {document.getElementById("ExternalTempTxtSec").value = ExternalTemperature;}


		//5{"_","_","_","_","Water","_","_"}; 
		StartPos = CurrentDelimPosition; //определяем стартовую позицию выделяемого элемента 
		CurrentDelimPosition = MyDataString.indexOf(',',CurrentDelimPosition+1);// где новый разделитель?
		var WaterTemperature = MyDataString.substr(StartPos+1,CurrentDelimPosition-StartPos-1); //Температура внутри
		if(WaterTemperature != -150) {document.getElementById("WaterTempTxt").value = WaterTemperature;}

		//6{"_","_","_","_","_","Ground","_"};
		StartPos = CurrentDelimPosition; //определяем стартовую позицию выделяемого элемента 
		CurrentDelimPosition = MyDataString.indexOf(',',CurrentDelimPosition+1);// где новый разделитель?
		var GroundTemperature = MyDataString.substr(StartPos+1,CurrentDelimPosition-StartPos-1); //Температура внутри
		if(GroundTemperature != -150) {document.getElementById("GroundTempTxt").value = GroundTemperature;}

		//7{"_","_","_","_","_","_","Zond"};
		StartPos = CurrentDelimPosition; //определяем стартовую позицию выделяемого элемента 
		CurrentDelimPosition = MyDataString.indexOf(',',CurrentDelimPosition+1);// где новый разделитель?
		var ZondTemperature = MyDataString.substr(StartPos+1,CurrentDelimPosition-StartPos-1); //Zond
		if(ZondTemperature != -150) {document.getElementById("ZondTempTxt").value = ZondTemperature;}


		StartPos = CurrentDelimPosition; //определяем стартовую позицию выделяемого элемента 
		CurrentDelimPosition = MyDataString.indexOf(',',CurrentDelimPosition+1);// где новый разделитель?
		var CurrentHumidity = MyDataString.substr(StartPos+1,CurrentDelimPosition-StartPos-1); //Влажность
		document.getElementById("HumidityTxt").value = CurrentHumidity;
		
		
		StartPos = CurrentDelimPosition; //определяем стартовую позицию выделяемого элемента 
		CurrentDelimPosition = MyDataString.indexOf(',',CurrentDelimPosition+1);// где новый разделитель?
		var DayLight = MyDataString.substr(StartPos+1,CurrentDelimPosition-StartPos-1); //Влажность
		document.getElementById("DayLightTxt").value = DayLight;
		
		StartPos = CurrentDelimPosition; //определяем стартовую позицию выделяемого элемента 
		CurrentDelimPosition = MyDataString.indexOf(',',CurrentDelimPosition+1);// где новый разделитель?
		var RainSensor = MyDataString.substr(StartPos+1,CurrentDelimPosition-StartPos-1); //Дождь, не будем
		//document.getElementById("DayLightTxt").value = RainSensor;
		
		//console.log ("MyExchange.ExchangeParam =" ); console.log (MyExchange.ExchangeParam.Gear1FullOpen);
		StartPos = CurrentDelimPosition; //определяем стартовую позицию выделяемого элемента 
		CurrentDelimPosition = MyDataString.indexOf(',',CurrentDelimPosition+1);// где новый разделитель?
		var Actuator1 = MyDataString.substr(StartPos+1,CurrentDelimPosition-StartPos-1); //Позиция актуатора 1 с расчетом
		document.getElementById("Actuator1Position").value = Actuator1 + " (" + Math.floor((MyExchange.Hardware.Gear1FullOpen-Actuator1)/MyExchange.Hardware.Gear1FullOpen*100) + "% opened)";
		//console.log("CommGear1FullOpen " + MyExchange.ExchangeParam.Gear1FullOpenPos);
		
		StartPos = CurrentDelimPosition; //определяем стартовую позицию выделяемого элемента 
		CurrentDelimPosition = MyDataString.indexOf(',',CurrentDelimPosition+1);// где новый разделитель?
		var Actuator2 = MyDataString.substr(StartPos+1,CurrentDelimPosition-StartPos-1); //Позиция актуатора 2 с расчетом
		document.getElementById("Actuator2Position").value = Actuator2 + " (" + Math.floor((MyExchange.Hardware.Gear2FullOpen-Actuator2)/MyExchange.Hardware.Gear2FullOpen*100) + "% opened)";
		
		StartPos = CurrentDelimPosition; //определяем стартовую позицию выделяемого элемента 
		CurrentDelimPosition = MyDataString.indexOf(',',CurrentDelimPosition+1);// где новый разделитель?
		var MyMode = MyDataString.substr(StartPos+1,CurrentDelimPosition-StartPos-1); //MyMode парсинг
		
		
			if ((MyMode & 8) !=0){
				document.getElementById("SmallDoor1ClosedRadio").checked = false;
			
			} 
			else {
				document.getElementById("SmallDoor1ClosedRadio").checked = true; 
			
			}
		 	if ((MyMode & 16) !=0){
				document.getElementById("SmallDoor2ClosedRadio").checked = false 
			} 
			else {
				document.getElementById("SmallDoor2ClosedRadio").checked = true
			}
			if ((MyMode & 512) !=0){
			 	document.getElementById("MainDoor1ClosedRadio").checked = false 
			 	document.getElementById("mainDoor1Status").value = "Main 1 OPENED"
			} 
			else {
				document.getElementById("MainDoor1ClosedRadio").checked = true
				document.getElementById("mainDoor1Status").value = "Main 1 CLOSED"
		 	}
			if ((MyMode & 1024) !=0){
				document.getElementById("MainDoor2ClosedRadio").checked = false 
				document.getElementById("mainDoor2Status").value = "Main 2 OPENED"
			} 
			else {
				document.getElementById("MainDoor2ClosedRadio").checked = true
				document.getElementById("mainDoor2Status").value = "Main 2 CLOSED"
			}
			if ((MyMode & 2048) !=0){
				document.getElementById("valveStatusField").value = "Valve is OPENED";	
			}
			else
			{
				document.getElementById("valveStatusField").value = "Valve is CLOSED";		
			}
			if ((MyMode & 4096) ==0){	
				document.getElementById("Actuator1Position").value = Actuator1 + " (leaf 1 INIT)"
			}
			if ((MyMode & 1) ==0){	
				document.getElementById("Actuator2Position").value = Actuator2 + " (leaf 2 INIT)"
			}
		 	if ((MyMode & 8192) !=0){
			 document.getElementById("DoorsInAutoCheck").checked = true 
			if ((MyMode & 32) !=0){
			 	document.getElementById("DoorsInAutoCheck").disabled = true 
			}
			else {
				document.getElementById("DoorsInAutoCheck").disabled = false 
			}
			 document.getElementById("OpenButton1").disabled = true
			 document.getElementById("CloseButton1").disabled = true 
			 document.getElementById("OpenButton2").disabled = true
			 document.getElementById("CloseButton2").disabled = true 
			} 
		  	else {
			document.getElementById("DoorsInAutoCheck").checked = false 
			document.getElementById("DoorsInAutoCheck").disabled = false 
			document.getElementById("OpenButton1").disabled = false
			document.getElementById("CloseButton1").disabled = false 
			document.getElementById("OpenButton2").disabled = false
			document.getElementById("CloseButton2").disabled = false 
			}
			if ((MyMode & 16384) !=0){
			 document.getElementById("WateringInAuto").checked = true
			  
			 if ((MyMode & 64) !=0){
				document.getElementById("WateringInAuto").disabled = true 
			 }
				else {
				document.getElementById("WateringInAuto").disabled = false }
			} 
		 	else {
			 document.getElementById("WateringInAuto").checked = false
			 document.getElementById("WateringInAuto").disabled = false
    		}
		 		
		StartPos = CurrentDelimPosition; //определяем стартовую позицию выделяемого элемента 
		CurrentDelimPosition = MyDataString.indexOf(',',CurrentDelimPosition+1);// где новый разделитель?
		var controlNumber = MyDataString.substr(StartPos+1,CurrentDelimPosition-StartPos-1); //Позиция актуатора 2 с расчетом

	return JSON.stringify({
			"Command":MyCommand,
			"BoardID": MyBoardID,
			"TimerValue": SinceLastRestart,
			"Temperature": {
				"box" : BoxTemperature, 
			    "internal": InternalTemperature,
			    "ground": GroundTemperature, 
			    "external" : ExternalTemperature,
				"bottom" : GroundZeroTemperature,
				"water" : WaterTemperature,
				"zond" : ZondTemperature
			}, 
			"humidity" : CurrentHumidity,
			"light" : DayLight, 
			"rain": RainSensor, 
			"Actuator1": Actuator1,
			"Actuator2" : Actuator2,
			"pins": MyMode,
			"controlNumber": controlNumber
	})	

   	break;
	case 'rstc': 
	    //console.log("RST COMPACT detected");
		//позиция выделяемого элемента уже есть, находим где новый разделитель?
		CurrentDelimPosition = MyDataString.indexOf(',',CurrentDelimPosition+1);
		var MyBoardID = MyDataString.substr(StartPos+1,CurrentDelimPosition-StartPos-1); //Идентификатор борда
		//document.getElementById("BoxInfo").value = document.getElementById("BoxInfo").value + " Board ID = " + MyBoardID;
		document.getElementById("BoxStatus").value = " Board ID = " + MyBoardID;
		
		StartPos = CurrentDelimPosition; //определяем стартовую позицию выделяемого элемента 
		CurrentDelimPosition = MyDataString.indexOf(',',CurrentDelimPosition+1);// где новый разделитель?
		var SinceLastRestart = MyDataString.substr(StartPos+1,CurrentDelimPosition-StartPos-1); //Время с последнего рестарта
		document.getElementById("BoxStatus").value = document.getElementById("BoxStatus").value + " " + SinceLastRestart/1000 + " sec (" + SinceLastRestart + ") since last restart";
		
		StartPos = CurrentDelimPosition; //определяем стартовую позицию выделяемого элемента 
		CurrentDelimPosition = MyDataString.indexOf(',',CurrentDelimPosition+1);// где новый разделитель?
		var Actuator1 = MyDataString.substr(StartPos+1,CurrentDelimPosition-StartPos-1); //Позиция актуатора 1 с расчетом
		//document.getElementById("Actuator1Position").value = Actuator1 + " (" + Math.floor(Actuator1/MyExchange.ExchangeParam.Gear1FullOpenPos*100) + "% opened)";
		//document.getElementById("Actuator1Position").value = Actuator1 + " (" + Math.floor(Actuator1/MyExchange.Hardware.Gear1FullOpen*100) + "% opened)";
		document.getElementById("Actuator1Position").value = Actuator1 + " (" + Math.floor((MyExchange.Hardware.Gear1FullOpen-Actuator1)/MyExchange.Hardware.Gear1FullOpen*100) + "% opened)";
		//console.log("CommGear1FullOpen " + MyExchange.ExchangeParam.Gear1FullOpenPos);
		//Hardware.Gear1FullOpen
		
		StartPos = CurrentDelimPosition; //определяем стартовую позицию выделяемого элемента 
		CurrentDelimPosition = MyDataString.indexOf(',',CurrentDelimPosition+1);// где новый разделитель?
		var Actuator2 = MyDataString.substr(StartPos+1,CurrentDelimPosition-StartPos-1); //Позиция актуатора 2 с расчетом
		document.getElementById("Actuator2Position").value = Actuator2 + " (" + Math.floor((MyExchange.Hardware.Gear2FullOpen-Actuator2)/MyExchange.Hardware.Gear2FullOpen*100) + "% opened)";
		
		StartPos = CurrentDelimPosition; //определяем стартовую позицию выделяемого элемента 
		CurrentDelimPosition = MyDataString.indexOf(',',CurrentDelimPosition+1);// где новый разделитель?
		var MyMode = MyDataString.substr(StartPos+1,CurrentDelimPosition-StartPos-1); //MyMode парсинг

		if ((MyMode & 8) !=0){
			document.getElementById("SmallDoor1ClosedRadio").checked = false;
		
		} 
		else {
			document.getElementById("SmallDoor1ClosedRadio").checked = true; 
		
		}
		 if ((MyMode & 16) !=0){
			document.getElementById("SmallDoor2ClosedRadio").checked = false 
		} 
		else {
			document.getElementById("SmallDoor2ClosedRadio").checked = true
		}
		if ((MyMode & 512) !=0){
			 document.getElementById("MainDoor1ClosedRadio").checked = false 
			 document.getElementById("mainDoor1Status").value = "Main 1 OPENED"
		} 
		else {
			document.getElementById("MainDoor1ClosedRadio").checked = true
			document.getElementById("mainDoor1Status").value = "Main 1 CLOSED"
		 }
		if ((MyMode & 1024) !=0){
			document.getElementById("MainDoor2ClosedRadio").checked = false 
			document.getElementById("mainDoor2Status").value = "Main 2 OPENED"
		} 
		else {
			document.getElementById("MainDoor2ClosedRadio").checked = true
			document.getElementById("mainDoor2Status").value = "Main 2 CLOSED"
		}
		if ((MyMode & 2048) !=0){
			document.getElementById("valveStatusField").value = "Valve is OPENED";	
		}
		else
		{
			document.getElementById("valveStatusField").value = "Valve is CLOSED";		
		}
		if ((MyMode & 4096) ==0){	
			document.getElementById("Actuator1Position").value = Actuator1 + " (leaf 1 INIT)"
		}
		if ((MyMode & 1) ==0){	
			document.getElementById("Actuator2Position").value = Actuator2 + " (leaf 2 INIT)"
		}

		 if ((MyMode & 8192) !=0){
			 document.getElementById("DoorsInAutoCheck").checked = true 
			 document.getElementById("DoorsInAutoCheck").disabled = true 
			 document.getElementById("OpenButton1").disabled = true
			 document.getElementById("CloseButton1").disabled = true 
			 document.getElementById("OpenButton2").disabled = true
			 document.getElementById("CloseButton2").disabled = true 
			 } 
		  else {
			document.getElementById("DoorsInAutoCheck").checked = false 
			document.getElementById("DoorsInAutoCheck").disabled = false 
			document.getElementById("OpenButton1").disabled = false
			document.getElementById("CloseButton1").disabled = false 
			document.getElementById("OpenButton2").disabled = false
			document.getElementById("CloseButton2").disabled = false 
			 }
		 if ((MyMode & 16384) !=0){
			 document.getElementById("WateringInAuto").checked = true 
			 document.getElementById("WateringInAuto").disabled = true 
			 } 
		   else {
			 document.getElementById("WateringInAuto").checked = false
			 document.getElementById("WateringInAuto").disabled = false
    		 }
		//StartPos = CurrentDelimPosition; //определяем стартовую позицию выделяемого элемента 
		//CurrentDelimPosition = MyDataString.indexOf(',',CurrentDelimPosition+1);// где новый разделитель?
		//var BoxTemperature = MyDataString.substr(StartPos+1,CurrentDelimPosition-StartPos-1); //Температура коробки
		//document.getElementById("BoxTempTxt").value = BoxTemperature;
	
	break;
	case 'rev': 

		console.log("remote event detected");
		//позиция выделяемого элемента уже есть, находим где новый разделитель?
		CurrentDelimPosition = MyDataString.indexOf(',',CurrentDelimPosition+1);
		var MyBoardID = MyDataString.substr(StartPos+1,CurrentDelimPosition-StartPos-1); //Идентификатор борда
		//document.getElementById("BoxInfo").value = document.getElementById("BoxInfo").value + " Board ID = " + MyBoardID;
		document.getElementById("BoxStatus").value = " Board ID = " + MyBoardID;
	 
		StartPos = CurrentDelimPosition; //определяем стартовую позицию выделяемого элемента 
		CurrentDelimPosition = MyDataString.indexOf(',',CurrentDelimPosition+1);// где новый разделитель?
		var SinceLastRestart = MyDataString.substr(StartPos+1,CurrentDelimPosition-StartPos-1); //Время с последнего рестарта
		document.getElementById("BoxStatus").value = document.getElementById("BoxStatus").value + " " + SinceLastRestart/1000 + " sec (" + SinceLastRestart + ") since last restart";

		StartPos = CurrentDelimPosition; //определяем стартовую позицию выделяемого элемента 
		CurrentDelimPosition = MyDataString.indexOf(',',CurrentDelimPosition+1);// где новый разделитель?
		var eventGearMoving = MyDataString.substr(StartPos+1,CurrentDelimPosition-StartPos-1); 

		StartPos = CurrentDelimPosition; //определяем стартовую позицию выделяемого элемента 
		CurrentDelimPosition = MyDataString.indexOf(',',CurrentDelimPosition+1);// где новый разделитель?
		var eventGearMovingDetails = MyDataString.substr(StartPos+1,CurrentDelimPosition-StartPos-1); 
		
		if ((eventGearMoving & 1) !=0){ 
			if ((eventGearMovingDetails & 2) !=0){
				document.getElementById("Actuator1Position").value = "Gear 1 OPENING";
			}
		if ((eventGearMovingDetails & 1) !=0){
				document.getElementById("Actuator1Position").value = "Gear 1 CLOSING";
			}
		}

		if ((eventGearMoving & 2) !=0){ 
			if ((eventGearMovingDetails & 2) !=0){
				document.getElementById("Actuator2Position").value = "Gear 2 OPENING";
			}
		if ((eventGearMovingDetails & 1) !=0){
				document.getElementById("Actuator2Position").value = "Gear 2 CLOSING";
			}
		}

		//console.log("byte " + eventGear1Moving);
		//document.getElementById("Actuator1Position") = 


	break;
	case 'rstjs': 
		//console.log("RSTjs detected");
		//console.log(MyDataString);
		//var MyBoardID = MyDataString.BoardID; //Идентификатор борда
		//document.getElementById("BoxStatus").value = " Board ID = " + MyBoardID;
	break;
	default: console.log("any command detected");break;
	}
	}

	function statusFormCompliting(MyString){
		console.log(MyString);	
		var MyJSONString = JSON.stringify({
			"Command": MyString.command,
			"BoardID": MyString.ID,
			"TimerValue": MyString.SinseRestart,
			"Format": MyString.format,
			"Temperature": {
				"box" : MyString.Temp_box,
			    "internal": MyString.Temp_In_main,
			    "ground": MyString.Temp_Ground,
			    "external" : MyString.Temp_Out,
				"bottom" : MyString.Temp_In_btm,
				"water" : MyString.Temp_Water,
				"zond" : MyString.Temp_Zond,
			}, 
			"humidity" : MyString.Humidity,
			"light" : MyString.Light,
			"rain": "n/a", 
			"Actuator1": MyString.Gear1,
			"Actuator2": MyString.Gear2,
			"pins": MyString.Status
			})

		if (MyString.command != "rst"){return};

	    console.log("RSTjs detected");
		
		document.getElementById("BoxTempTxt").value = "";
		document.getElementById("InternalTempTxt").value = "";
		document.getElementById("GroundZeroTempTxt").value = "";
		document.getElementById("ExternalTempTxtSec").value = "";
		document.getElementById("WaterTempTxt").value = "";
		document.getElementById("GroundTempTxt").value = "";
		document.getElementById("ZondTempTxt").value = "";
		document.getElementById("HumidityTxt").value = "";
		document.getElementById("DayLightTxt").value = "";
		document.getElementById("Actuator1Position").value = "";
		document.getElementById("Actuator2Position").value = "";

		var MyBoardID = MyString.ID //Идентификатор борда
		document.getElementById("BoxStatus").value = " Board ID = " + MyBoardID;
		
		var SinceLastRestart = MyString.SinseRestart; //Время с последнего рестарта
		document.getElementById("BoxStatus").value = document.getElementById("BoxStatus").value + " " + SinceLastRestart/1000 + " sec (" + SinceLastRestart + ") since last restart";
		
		var BoxTemperature = MyString.Temp_box; //Температура коробки
		document.getElementById("BoxTempTxt").value = BoxTemperature;
		
		var InternalTemperature = MyString.Temp_In_main; //Температура внутри
		document.getElementById("InternalTempTxt").value = InternalTemperature;
		
		console.log(MyExchange.Sensors);
		console.log(MyString);
		if(MyExchange.Sensors[1] == true){
			var ExternalTemperature = MyString.Temp_Out; //Температура снаружи 64
			if(ExternalTemperature != -150){document.getElementById("ExternalTempTxtSec").value = ExternalTemperature;} 
		}	else {document.getElementById("ExternalTempTxtSec").value ="n/a"}

		if(MyExchange.Sensors[0] == true){
			var GroundTemperature = MyString.Temp_Ground; //Температура внутри 32
			if(GroundTemperature != -150){document.getElementById("GroundTempTxt").value = GroundTemperature;}
		}	else{document.getElementById("GroundTempTxt").value = "n/a"}

		if(MyExchange.Sensors[2] == true){
			var GroundZeroTemperature = MyString.Temp_In_btm; // 4096
			if(GroundZeroTemperature != -150){document.getElementById("GroundZeroTempTxt").value = GroundZeroTemperature;}
		}	else{document.getElementById("GroundZeroTempTxt").value ="n/a"}

		if(MyExchange.Sensors[3] == true){
			var WaterTemperature = MyString.Temp_Water; //Температура внутри 8192
			if(WaterTemperature != -150){document.getElementById("WaterTempTxt").value = WaterTemperature;}
		}	else{document.getElementById("WaterTempTxt").value = "n/a"}

		if(MyExchange.Sensors[4] == true){
			var ZondTemperature = MyString.Temp_Zond; //Температура внутри 8192
			if(WaterTemperature != -150){document.getElementById("ZondTempTxt").value = ZondTemperature;}
		}	else{document.getElementById("ZondTempTxt").value = "n/a"}


		if(MyExchange.Sensors[4] == true){
		//if((MyString.MyMode & 16384) == 1){
			var CurrentHumidity = MyString.Humidity; //Влажность 16384
			document.getElementById("HumidityTxt").value = CurrentHumidity;
		}	else{document.getElementById("HumidityTxt").value = "n/a"}
		
		if(MyExchange.Sensors[6] == true){
		//if((MyString.MyMode & 128) == 1){
			var DayLight = MyString.Light; //Свет 128
			document.getElementById("DayLightTxt").value = DayLight;
		}	else{document.getElementById("DayLightTxt").value = "n/a"}

		var Actuator1 = MyString.Gear1; //Позиция актуатора 1 с расчетом
		document.getElementById("Actuator1Position").value = Actuator1 + " (" + Math.floor((MyExchange.Hardware.Gear1FullOpen-Actuator1)/MyExchange.Hardware.Gear1FullOpen*100) + "% opened)";
		
		var Actuator2 = MyString.Gear2; //Позиция актуатора 2 с расчетом
		document.getElementById("Actuator2Position").value = Actuator2 + " (" + Math.floor((MyExchange.Hardware.Gear2FullOpen-Actuator2)/MyExchange.Hardware.Gear2FullOpen*100) + "% opened)";
		
		var MyMode = MyString.Status; //MyMode парсинг
			if ((MyMode & 8) !=0){
				document.getElementById("SmallDoor1ClosedRadio").checked = false;
			} 
			else {
				document.getElementById("SmallDoor1ClosedRadio").checked = true; 
			}
		 	if ((MyMode & 16) !=0){
				document.getElementById("SmallDoor2ClosedRadio").checked = false 
			} 
			else {
				document.getElementById("SmallDoor2ClosedRadio").checked = true
			}
			if ((MyMode & 512) !=0){
			 	document.getElementById("MainDoor1ClosedRadio").checked = false 
			 	document.getElementById("mainDoor1Status").value = "Main 1 OPENED"
			} 
			else {
				document.getElementById("MainDoor1ClosedRadio").checked = true
				document.getElementById("mainDoor1Status").value = "Main 1 CLOSED"
		 	}
			if ((MyMode & 1024) !=0){
				document.getElementById("MainDoor2ClosedRadio").checked = false 
				document.getElementById("mainDoor2Status").value = "Main 2 OPENED"
			} 
			else {
				document.getElementById("MainDoor2ClosedRadio").checked = true
				document.getElementById("mainDoor2Status").value = "Main 2 CLOSED"
			}
			if ((MyMode & 2048) !=0){
				document.getElementById("valveStatusField").value = "Valve is OPENED";	
			}
			else
			{
				document.getElementById("valveStatusField").value = "Valve is CLOSED";		
			}
			if ((MyMode & 4096) ==0){	
				document.getElementById("Actuator1Position").value = Actuator1 + " (leaf 1 INIT)"
			}
			if ((MyMode & 1) ==0){	
				document.getElementById("Actuator2Position").value = Actuator2 + " (leaf 2 INIT)"
			}

		 if ((MyMode & 8192) !=0){
			 document.getElementById("DoorsInAutoCheck").checked = true 
			if ((MyMode & 32) !=0){
			 	document.getElementById("DoorsInAutoCheck").disabled = true 
			}
			else {
				document.getElementById("DoorsInAutoCheck").disabled = false 
			}
			 document.getElementById("OpenButton1").disabled = true
			 document.getElementById("CloseButton1").disabled = true 
			 document.getElementById("OpenButton2").disabled = true
			 document.getElementById("CloseButton2").disabled = true 
			 } 
		  else {
			document.getElementById("DoorsInAutoCheck").checked = false 
			document.getElementById("DoorsInAutoCheck").disabled = false 
			document.getElementById("OpenButton1").disabled = false
			document.getElementById("CloseButton1").disabled = false 
			document.getElementById("OpenButton2").disabled = false
			document.getElementById("CloseButton2").disabled = false 
			 }
		 if ((MyMode & 16384) !=0){
			 document.getElementById("WateringInAuto").checked = true
			  
			 if ((MyMode & 64) !=0){
				document.getElementById("WateringInAuto").disabled = true 
			 }
				else {
				document.getElementById("WateringInAuto").disabled = false }
			 } 
		   else {
			 document.getElementById("WateringInAuto").checked = false
			 document.getElementById("WateringInAuto").disabled = false
    		 }
			return MyJSONString;
		
	}

	function IsJsonString(MyDataString){
		try {
			JSON.parse(MyDataString);
			//var myData = JSON.parse(MyDataString);
			//console.log(myData.command);
			return true;
		}
		catch (e){
			//console.log("not json");
			return false;
		}
	}
	