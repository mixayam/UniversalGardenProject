exports.GHSendToBoxCommand = function  (ParamNumber,ParamValue) {
	switch (ParamNumber){
		case 10: var Byte8Value = 0;
				//console.log("Field value = " + document.getElementById("GroundTemperatureCheck").value)
				if (document.getElementById("IgnoreDoor1SensCheck").checked == true){Byte8Value = Byte8Value + 1;}
				if (document.getElementById("IgnoreDoor2SensCheck").checked == true){Byte8Value = Byte8Value + 2;}
				if (document.getElementById("PeriodicalRepRemFormat").checked == true){Byte8Value = Byte8Value + 4;}
				if (document.getElementById("PeriodicalRepHumFormat").checked == true){Byte8Value = Byte8Value + 8;}
				if (document.getElementById("PeriodicalRepJSONFormat").checked == true){Byte8Value = Byte8Value + 16;}
				if (document.getElementById("GroundTemperatureCheck").checked == true){Byte8Value = Byte8Value + 32;}
				if (document.getElementById("ExternalTemperatureCheck").checked == true){Byte8Value = Byte8Value + 64;}
				if (document.getElementById("DayLightCheck").checked == true){Byte8Value = Byte8Value + 128;}
				if (document.getElementById("ValveHasPosSensCheck").checked == true){Byte8Value = Byte8Value + 512;}
				if (document.getElementById("AllEventsRepRemFormat").checked == true){Byte8Value = Byte8Value + 1024;}
				if (document.getElementById("AllEventsRepHumFormat").checked == true){Byte8Value = Byte8Value + 2048;}
				if (document.getElementById("GroundZeroTemperatureCheck").checked == true){Byte8Value = Byte8Value + 4096;}
				if (document.getElementById("WaterTempCheck").checked == true){Byte8Value = Byte8Value + 8192;}
				if (document.getElementById("HumidityCheck").checked == true){Byte8Value = Byte8Value + 16384;}
				if (document.getElementById("ZondTempCheck").checked == true){Byte8Value = Byte8Value + 16;}
				

				if (document.getElementById("transmitJSONFormat").checked == false){
					return "ch " + 10 + " " + Byte8Value + '\r\n'; break;
				} 
				else {
					return '{\"MyControls\":' + Byte8Value +'}\n'; break;
				}
				
		case 5: var Byte5Value = 0;
				//console.log(' byte 5 will be parsed here'); 
				if (document.getElementById("WateringJustTimedRadio").checked == true){Byte5Value = Byte5Value + 1;}
				if (document.getElementById("WateringTempDependentRadio").checked == true){Byte5Value = Byte5Value + 2;}
				if (document.getElementById("WateringMostSensDepRadio").checked == true){Byte5Value = Byte5Value + 4;}
				if (document.getElementById("SimpleScenarioCheck").checked == true){Byte5Value = Byte5Value + 8;}
				if (document.getElementById("VariationCutOffCheck").checked == true){Byte5Value = Byte5Value + 16;}
				if (document.getElementById("NightFogCtrlRadio").checked == true){Byte5Value = Byte5Value + 32;}

				if (document.getElementById("transmitJSONFormat").checked == false){
					return "ch " + 6 + " " + Byte5Value + '\r\n'; break;
				} 
				else {
					return '{\"AutomaticWorkScenario\":' + Byte5Value +'}\n'; break;
				}
				//return "ch " + 5 + " " + Byte5Value + '\r\n'; break;
				//return "ch " + 6 + " " + Byte5Value + '\r\n'; break;
	default: return "ch " + ParamNumber + " " + ParamValue + '\r\n'; break;
	}
	}
