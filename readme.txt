admin
RTrs12345
cd /d E:\arduino\IoT\MyProject_1
cd /d E:\DIY\UniversalGardenBoxProject_v1
21.10.2020 Need to run ".\node_modules\.bin\electron-rebuild.cmd" when move to another folder
22.10.2020 Попытка понять как работает меню.
Умеет открывать КОМ порты, отправлять на них и читать с них. Как бы не заболеть, глаз!!! 
28.10.2020 устранил проблему с packager: --x64
cd /d E:\DIY\UniversalGardenBoxProject_v4_r
cd /d D:\DIY\UniversalGardenBoxProject_v4_r

Package            Current  Wanted  Latest  Location
electron             8.5.5   8.5.5  11.3.0  UniversalGardenBoxProject_v4_r
electron-packager   14.2.1  14.2.1  15.2.0  UniversalGardenBoxProject_v4_r
electron-rebuild    1.11.0  1.11.0   2.3.5  UniversalGardenBoxProject_v4_r
serialport           8.0.8   8.0.8   9.0.7  UniversalGardenBoxProject_v4_r

cd /d D:\DIY\UniversalGardenBoxProject_v5

D:\DIY\UniversalGardenBoxProject_v5>npm outdated
Package   Current  Wanted  Latest  Location
electron   11.3.0  11.3.0  12.0.1  UniversalGardenBoxProject_v5

12.07.2021 Надо дорабатывать chartPaint
19.08.2021 ChartWindow.js делаю контроль целостности данных - пока умею убирать строки с пустыми эл-тами, 
надо проверять значения.
20.08.2021 Умеет фильтровать значения. В качестве образца - строка stringPattern в function myStringCorrection()
если значение не ноль, то начинает сравнивать по модулю элемент, загружаемый из файла с элементом stringPattern
Похоже отработана работа с сохраннными сырыми файлами, хорошо бы начать с процедурой архивации текущих графиков.
01.09.2021 Работает в старом формате, хочу формировать lineChartData циклами.
03.09.2021 Оптимизированно с точки зрения циклов. Функция myChartPaint должна воспринимать 3 переменные:
timeInterval,startDate,stopDate. Пока понимает и работает только с первой. Когда заработает, то можно будет убрать 
mySelectedChartPaint.
09.09.2021 Все уже почти работает , за исключением парсинга. При попытке включить выдается ошибка в строке 432, т.е. 
не правильно формируется MyChart при парсинге. Надо думать.
17.09.2021 Похоже надо генерить/модифицировать MyChartStructure в зависимости от того, парсится что-нибудь или нет.
Вообще список переменных, участвующих в процессе и подлежащих синхронизации:
MyChartStructure: перечень параметров - получается что это основное связующее звено;
MyDataSet: привязывает значения (ось У) к временной шкале (ось Х)
myYAxes: параметры оси значений (У)
myChart: параметры поля диаграммы, привязка MyDataSet к myYAxes
ChartArray = распарсенные строки из сохраненного файла

Обобщение процессов
Перебор элементов ChartArray для  загрузки в myChart
Перебор myChart.data.datasets для загрузки в каждый элемент датасета элемента ChartArray в соответствии с позицией,
определяемой MyChartStructure.

Сделал. Что-то сильно тормозит на длинных файлах. Надо попробовать чистить массивы. 

28.09.2021 Проблема с тормозами решена. Теперь надо приводить сырые и архивные файлы в один формат ChartArray. Надо
думать как это сделать. Хранить конфигурацию в файле?

18.11.2021 попытка отладить myArcFile, рабочий вариант.

22.11.2021 разрешено много проблем, сейчас что-то не так с парсингом, надо делать останов ChartWindow.js на 509 и внимательно смотреть.
25.11.2021 Файл можно архивировать в ручном режиме. Надо делать авто архивацию.
Сейчас: Генерация ChartArray: ipcRender -> MyReadFile -> MyStringOperator -> ChartArray Можно рисовать графики.
                                                                            / да: фориирование диаграммы
крупно: ipcRender -> MyReadFile -> MyStringOperator  -> isStarting == true?
                                                                            \нет: myChartPaint (рисование диаграммы)

Рисование диаграммы (myChartPaint) это формирование   myChart.data.labels[] и  myChart.data.datasets.data[] исходя из перебора и
селекции элементов ChartArray.

Надо:
ipcRender -> MyReadFile -> MyStringOperator -> ChartArray -> 
                                                                                        / просто рисуем диаграмму       
смотрим на конечную и начальную дату ChartArray -> разница меньше заданного интервала?
                                                                                        \ архивирование + формирование нового ChartArray ->
Рисуем диаграмму                                                                                        

26.11.2021 Надо вводить архивирование в процедуру опроса и загркзкм статуса
01.12.2021 Переезд в v5_2. V5_1 уничтожена - неудачная попытка обновить пакет.
E:\DIY\UniversalGardenBoxProject_v5_2>npm outdated
Package           Current  Wanted  Latest  Location
axios              0.21.4  0.21.4  0.24.0  UniversalGardenBoxProject_v5_2
chart.js            2.9.4   2.9.4   3.6.1  UniversalGardenBoxProject_v5_2
csv                 5.5.3   5.5.3   6.0.4  UniversalGardenBoxProject_v5_2
electron           12.2.3  12.2.3  16.0.3  UniversalGardenBoxProject_v5_2
electron-rebuild    2.3.5   2.3.5   3.2.5  UniversalGardenBoxProject_v5_2

надо вставить архивирование в цепочку:

GHstatus.js: Только при запуске -> ipcRenderer.on('ipcRenderer.on('ToStatusTransfer'...-> ,'/ MyParser.on('data', function (data) -> case 2: // fs.appendFile(MyCSVFile,MyStringToSave... ->
ipcRenderer.send("LogUpdateEvent",MyCSVFile) -> ...

10.12.2021 г. Когда то ранее был добавлен fileWorks.js, но он содержит уже готовый ChartArray в качестве глобальной переменной а это не правильно!!
Надо делать полный цикл архивирования:
 1.Получить в качестве входных переменных:
        - incFileName -> имя файла +;
        - currentFileLength -> пороговая длина входного файла, размер файла, при которой нужна архивация
         (в чем? в часах? Есть, не используется);
        - arhPeriod -> какой период убрать в архив (тоже в часах)
        - образцы для архивирования:
            ArcStructure; 
            byteParsing и AchStructGener перенести в fileWorks !!!!

 2.Загрузить входной файл, сформировать ChartArray или аналог
 3.Принять решение - архивировать или нет (если длина исходного файла больше пороговой, то архивировать, сократив длину входного файла
 на arhPeriod). Если не архивировать, то выход;
 4. Если архивировать:
  открыть выходной поток в архтвный файл, есди его не существует, то создать
  сформировать myArrayToSave, 
  загрузить его в выходной поток
 5. Все закрыть, выйти.
17.12.2021 Перевожу компоненты в fileWorks.js
08.02.2022 Неожиданно поехал в другую сторону - готовлюсь читать данные из локальных wifi устройств
уже умею через WiFiExchange.js - работающая заготовка.
02.03.2022 Отработка JSON взаимодействия setup и status. Начал с измкнеиния gendelay, надо дорабатывать.
09.03.2022 Отработка взаимодействия setup -> show. Работают задержки и пороги
25.05.2022 Setup Status видят все температурные датчики

26.05.2022 Chart JS видит и показывает 6 температурных датчиков
29.05.2022 Всплыли баги: не правильно читается слово состояния при репорте в JSON, не правильно отображается состояние приводов при 
15.07.2022 После промежуточных вариантов. В rst добавлено контрольное поле
JSON.
03.02.2023 

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




