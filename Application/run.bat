start cmd /k mongod --dbpath=C:\Users\this\Documents\Thesis\Application\db --logpath=C:\Users\this\Documents\Thesis\Application\db\log.txt --rest --httpinterface
start cmd /k mongo
start cmd /k "daemon\API_Data_Collector.exe"
start cmd /k "cd nodeTestGraphs && npm start"
start cmd /k "cd dbAdmin && node app"