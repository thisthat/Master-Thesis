start cmd /k mongod --dbpath=C:\Users\this\Documents\Thesis\Application\db --logpath=C:\Users\this\Documents\Thesis\Application\db\log.txt --rest --httpinterface
python createDataset.py -class_size:500 -skip:1 -skip_end:1 -day:day_1 -switch:00:00:00:00:00:00:04:01
python createDataset.py -class_size:500 -skip:1 -skip_end:1 -day:day_2 -switch:00:00:00:00:00:00:04:01
python createDataset.py -class_size:500 -skip:1 -skip_end:1 -day:day_3 -switch:00:00:00:00:00:00:04:01


pause