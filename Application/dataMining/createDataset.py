#MongoDB Driver include
import pymongo
import time
import urllib.request
import json
import math
from pymongo import MongoClient


#Params
ip_vm = "192.168.56.1"
port_vm = "8080"
size_class = 200
max_bandwidthClass = 10000
win_size = 6
filename = "dataset_test_1"


#Vars
switch = "00:00:00:00:00:00:00:02"
test = "_1"
timing = 12 # How many seconds for each bandwidth class in the TrafficTester

#Connection
client = MongoClient('mongodb://localhost:27017/')
db = client.FloodLight
print("Connection to DB Enstablished")


def classification(bandwidth):
	n = 0
	size_class = 200
	while (n*size_class < bandwidth) :
		n += 1
	ret = n*size_class
	if ret > max_bandwidthClass :
		ret = max_bandwidthClass
	return ret

# this is usefull in real envirorment
def timeClass(seconds,start):
	#print("{0} - {1} = {2}" . format(seconds,start, seconds - start))
	start += 1
	return math.floor((seconds-start) / timing)


countTime = 0
countIstance = 0

prevTime = 0
prevByte = 0

bandwidth = []
tmp = []
#collect data from DB
for post in db.DataTime.find({},{'_id':0}).sort("_time"):
	time = post['_time']
	byte = 0;

	if test == "" :
		obj = {"DPID" : switch, "_time" : time}
	else :
		obj = {"DPID" : switch, "_time" : time, "test" : test}

	for data in db.SwitchFlowData.find( obj , {'_id' : 0}):
		b = int(data["byteCount"])
		byte = byte + b

	currentTime = (time-prevTime) / 8
	currentByte = (byte-prevByte) / currentTime
	tmp.append({"bandwidth": currentByte/1024, "sec": time})

	prevByte = byte
	prevTime = time
	countTime = countTime + 1

for i in range(1, len(tmp) - 1):
	bandwidth.append(tmp[i])

#The data is collected, now we have to print in a corect manner

#
#  OUTPUT Format
#
#  time_class, bandwidth_time, _ , bandwidth_{time+win_size-1}, prediction_class
#	

print("Data collected! Creating the file...")

f = open("{0}.arff" . format(filename), 'w')

# Header definition
out = "@relation {0}\n" . format(filename)
f.write(out)

out = "@attribute time_class {"
for i in range(24):
	if i == 23:
		out += "'time_{0}'" . format(i)
	else :
		out += "'time_{0}'," . format(i)
out += "}\n"
f.write(out)

for i in range(win_size-1):
	out = "@attribute bandwidth_{0} numeric\n" . format(i)
	f.write(out)

out = "@attribute prediction_class {"
last = math.ceil(max_bandwidthClass / size_class) + 1
for i in range(last):
	if i == last - 1:
		out += "'byte_{0}'" . format(i*size_class)
	else :
		out += "'byte_{0}'," . format(i*size_class)
out += "}\n"
f.write(out)

# Data creation
f.write("@data\n")
start = tmp[0]['sec']
for i in range(len(bandwidth)):
	out = "'time_{0}'" . format( timeClass(bandwidth[i]['sec'],start) )
	for j in range(win_size):
		index = (i+j) % len(bandwidth)
		value = 0
		if j == win_size-1:
			value = "'byte_{0}'" . format(classification(bandwidth[index]['bandwidth']))
		else:
			value = round(bandwidth[index]['bandwidth'])
		out += ",{0}" . format(value)
	#print(out)
	f.write(out)
	f.write("\n")




print("Found {0} elements" . format(countTime))
print("Create {0} istances" . format(len(bandwidth)))