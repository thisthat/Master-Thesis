python createDataset.py -class_size:200 -file:dataset_1_200 -skip:7 -skip_end:35 -test:_1 
python createDataset.py -class_size:200 -file:dataset_2_200 -skip:2 -skip_end:2 -test:_2
python createDataset.py -class_size:200 -file:dataset_3_200 -skip:9 -skip_end:2 -test:_3

python createDataset.py -class_size:500 -file:dataset_1_500 -skip:7 -skip_end:35 -test:_1
python createDataset.py -class_size:500 -file:dataset_2_500 -skip:2 -skip_end:2 -test:_2
python createDataset.py -class_size:500 -file:dataset_3_500 -skip:9 -skip_end:2 -test:_3

python createDataset.py -class_size:500 -file:dataset_1_500der -skip:7 -skip_end:35 -test:_1 -derivate
python createDataset.py -class_size:500 -file:dataset_2_500der -skip:2 -skip_end:2 -test:_2 -derivate
python createDataset.py -class_size:500 -file:dataset_3_500der -skip:9 -skip_end:2 -test:_3 -derivate

python createDataset.py -class_size:500 -file:dataset_1_500der_win8 -skip:7 -skip_end:35 -test:_1 -derivate -win_size:8
python createDataset.py -class_size:500 -file:dataset_2_500der_win8 -skip:2 -skip_end:2 -test:_2 -derivate -win_size:8
python createDataset.py -class_size:500 -file:dataset_3_500der_win8 -skip:9 -skip_end:2 -test:_3 -derivate -win_size:8

python createDataset.py -class_size:500 -file:dataset_1_500der_win10 -skip:7 -skip_end:35 -test:_1 -derivate -win_size:10
python createDataset.py -class_size:500 -file:dataset_2_500der_win10 -skip:2 -skip_end:2 -test:_2 -derivate -win_size:10
python createDataset.py -class_size:500 -file:dataset_3_500der_win10 -skip:9 -skip_end:2 -test:_3 -derivate -win_size:10

pause