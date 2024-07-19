

                                    EEShow                          EESet
unit Address(1):125         data 85 32 10   data 85 32 11       data 85 42 ___
default power(2):40         data 85 32 20   data 85 32 21       data 85 43 ___
min power(3):50             data 85 32 30   data 85 32 31       data 85 44 ___
min RPM(4):5300
max RPM(5):1270
Divider(6):300
Reduce divider(7):500
Config(8):1
Wait delay(9):10            
Slow moving delay(10):30    data 85 32 100   data 85 32 101     data 85 50 ___
Volt thress(11):75          data 85 32 110   data 85 32 111     data 85 51 ___

EEDef                       data 85 39
EESave                      data 85 30

Commands

//Data 85 2 Byte  Loop
//Data 85 10 Byte Запуск двигателя

Data 85 101 Мощность двигателя
Data 85 102 Напряжение
Data 85 103 Статус
Data 85 104 Обороты




