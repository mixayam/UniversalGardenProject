/*var MyArchChartStructure = [
    {"Position":1,"Name":"Sinse restart","Display":true,"fill":false,"axis":"y","units":"ms","r":128,"g":0,"b":0},              //0
    {"Position":2,"Name":"In temperature","Display":true,"fill":false,"axis":"y1","units":"celc","r":255,"g":0,"b":0},           //1
    {"Position":3,"Name":"Ground temperature","Display":true,"fill":false,"axis":"y2","units":"celc","r":0,"g":128,"b":0},       //2
    {"Position":4,"Name":"Zond temperature","Display":true,"fill":false,"axis":"y4","units":"celc","r":128,"g":128,"b":0},       //3                    //5
    {"Position":5,"Name":"Humidity","Display":true,"fill":false,"axis":"y5","units":"hum","r":0,"g":0,"b":255},                    //6
    {"Position":6,"Name":"Light","Display":true,"fill":true,"axis":"y6","units":"light","r":230,"g":230,"b":230},                 //7
    {"Position":7,"Name":"Gear1","Display":true,"fill":true,"axis":"y7","units":"units","r":200,"g":250,"b":250},                 //8
    {"Position":8,"Name":"Gear2","Display":true,"fill":true,"axis":"y8","units":"units","r":200,"g":200,"b":250},                 //9
    {"Position":9,"Name":"door_1","Display":true,"fill":false,"axis":"y9","r":0,"g":0,"b":0},     
    {"Position":10,"Name":"door_2","Display":true,"fill":false,"axis":"y10","r":0,"g":0,"b":0},              //10
    {"Position":11,"Name":"main_door_1","Display":true,"fill":false,"axis":"y11","r":0,"g":0,"b":0},              //11
    {"Position":12,"Name":"main_door_2","Display":true,"fill":false,"axis":"y12","r":0,"g":0,"b":0},   
    {"Position":13,"Name":"valve","Display":true,"fill":false,"axis":"y13","r":0,"g":0,"b":0},            //13
    {"Position":14,"Name":"doors","Display":true,"fill":false,"axis":"y14","r":0,"g":0,"b":0},            //14
    {"Position":15,"Name":"watering","Display":true,"fill":false,"axis":"y15","r":0,"g":0,"b":0},            //15
]*/

var MyArchChartStructure = [
    {"Position":1,"Name":"Sinse restart","Display":true,"fill":false,"axis":"y","units":"ms","r":128,"g":0,"b":0},              //0
    {"Position":2,"Name":"In temperature","Display":true,"fill":false,"axis":"y1","units":"celc","r":255,"g":0,"b":0},           //1
    {"Position":3,"Name":"Ground temperature","Display":true,"fill":false,"axis":"y2","units":"celc","r":0,"g":128,"b":0},       //2
    {"Position":4,"Name":"Zond temperature","Display":true,"fill":false,"axis":"y4","units":"celc","r":128,"g":128,"b":0},       //3    
    {"Position":5,"Name":"Water temperature","Display":true,"fill":false,"axis":"y4","units":"celc","r":0,"g":100,"b":255},       //3
    {"Position":6,"Name":"Out temperature","Display":true,"fill":false,"axis":"y5","units":"celc","r":255,"g":100,"b":0},       //3 "r":255,"g":0,"b":0
    {"Position":7,"Name":"Grnd zero temperature","Display":true,"fill":false,"axis":"y6","units":"celc","r":100,"g":255,"b":100},                //5
    {"Position":8,"Name":"Humidity","Display":true,"fill":false,"axis":"y5","units":"hum","r":0,"g":0,"b":255},                    //6
    {"Position":9,"Name":"Light","Display":true,"fill":true,"axis":"y6","units":"light","r":230,"g":230,"b":230},                 //7
    {"Position":10,"Name":"Gear1","Display":true,"fill":true,"axis":"y7","units":"units","r":200,"g":250,"b":250},                 //8
    {"Position":11,"Name":"Gear2","Display":true,"fill":true,"axis":"y8","units":"units","r":200,"g":200,"b":250},                 //9
    {"Position":12,"Name":"door_1","Display":true,"fill":false,"axis":"y9","r":0,"g":0,"b":0},     
    {"Position":13,"Name":"door_2","Display":true,"fill":false,"axis":"y10","r":0,"g":0,"b":0},              //10
    {"Position":14,"Name":"main_door_1","Display":true,"fill":false,"axis":"y11","r":0,"g":0,"b":0},              //11
    {"Position":15,"Name":"main_door_2","Display":true,"fill":false,"axis":"y12","r":0,"g":0,"b":0},   
    {"Position":16,"Name":"valve","Display":true,"fill":false,"axis":"y13","r":0,"g":0,"b":0},            //13
    {"Position":17,"Name":"doors","Display":true,"fill":false,"axis":"y14","r":0,"g":0,"b":0},            //14
    {"Position":18,"Name":"watering","Display":true,"fill":false,"axis":"y15","r":0,"g":0,"b":0},            //15
]

//                                     box,In_main,In_btm,Out,Water,Ground,Zond
//             0       , 1 ,   2 ,  3  ,4 , 5     ,6     , 7 ,8    ,9     ,  10,  11, 12, 13, 14, 15, 16
//  2022/05/25 16:46:42,rst,Test_,85598,10,11     ,15    ,13 ,12   ,14    ,  16, 405,370,n/a,750,700,262
var MyChartStructure = [
    {"Position":3,"Name":"Sinse restart","AchMode":"ArcAsInt","type":"int","Display":true,"fill":false,"axis":"y","units":"ms","r":128,"g":0,"b":0},              //0
    {"Position":5,"Name":"In temperature","AchMode":"ArcAsFloat","Display":true,"fill":false,"axis":"y1","units":"celc","r":255,"g":0,"b":0},           //1
    {"Position":6,"Name":"Grnd temperature","AchMode":"ArcAsFloat","Display":true,"fill":false,"axis":"y2","units":"celc","r":0,"g":128,"b":0},       //2
    {"Position":10,"Name":"Zond temperature","AchMode":"ArcAsFloat","Display":true,"fill":false,"axis":"y3","units":"celc","r":128,"g":128,"b":0}, 
    {"Position":9,"Name":"Water temperature","AchMode":"ArcAsFloat","Display":true,"fill":false,"axis":"y4","units":"celc","r":0,"g":100,"b":255},       //3
    {"Position":7,"Name":"Out temperature","AchMode":"ArcAsFloat","Display":true,"fill":false,"axis":"y5","units":"celc","r":255,"g":100,"b":0},       //3 "r":255,"g":0,"b":0
    {"Position":8,"Name":"Grnd zero temperature","AchMode":"ArcAsFloat","Display":true,"fill":false,"axis":"y6","units":"celc","r":100,"g":255,"b":100},    //  "r":100,"g":128,"b":0 //3
    {"Position":30,"Name":"FU0","Display":false,"fill":false,"axis":"y4","units":"celc","r":0,"g":64,"b":0},                      //4
    {"Position":31,"Name":"FU1","Display":false,"fill":false,"axis":"y5","units":"celc","r":0,"g":64,"b":0},                      //5
    {"Position":11,"Name":"Humidity","Display":true,"AchMode":"ArcAsInt","fill":false,"axis":"y7","units":"hum","r":0,"g":0,"b":255},                    //6
    {"Position":12,"Name":"Light","Display":true,"AchMode":"ArcAsInt","fill":true,"axis":"y8","units":"light","r":230,"g":230,"b":230},                 //7
    {"Position":14,"Name":"Gear1","Display":true,"AchMode":"ArcAsInt","fill":true,"axis":"y9","units":"units","r":200,"g":250,"b":250},                 //8
    {"Position":15,"Name":"Gear2","Display":true,"AchMode":"ArcAsInt","fill":true,"axis":"y10","units":"units","r":200,"g":200,"b":250},                 //9
    {"Position":16,"Name":"StatusWord","Display":true,"AchMode":"ParseAsByte","fill":false,"axis":"y11","parsing":true,"r":0,"g":0,"b":0},                  //10
]


var StatusWord = [null,null,null,"door 1","door_2",null,null,null,null,"main door 1","main door 2","valve",null,"doors","Watering",null]

var lineChartData = {
    labels: [],
    datasets: []
}


module.exports = {MyArchChartStructure,MyChartStructure,StatusWord,lineChartData} 
