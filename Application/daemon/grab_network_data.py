#MongoDB Driver include
import pymongo
import time
import urllib.request
import json
import pprint
from pymongo import MongoClient


#Params
ip_vm = "192.168.56.1"
port_vm = "8080"
time = int(time.time())
test = "test_30gg"

#Vars
switches = []

pp = pprint.PrettyPrinter(indent=4)

#Function to get data from the controller
def getApiResponse(api):
	url = "http://{0}:{1}{2}" . format(ip_vm, port_vm, api)
	res = urllib.request.urlopen(url).read().decode('utf-8')
	return json.loads(res)

def getData(api):
	j = getApiResponse(api)
	if(len(j) > 0):
		for ndx, member in enumerate(j):
			j[ndx]['_time'] = time
			if test != "":
				j[ndx]['test'] = test
	return j

def getNetowrkInfo(api):
	j = getApiResponse(api)
	if(len(j) > 0):
		for ndx, member in enumerate(j):
			j[member]["_time"] = time
			if test != "":
				j[member]["test"] = test
	j['_time'] = time
	if test != "":
		j['test'] = test
	return j

def getDataPort(api, DPID):
	j = getApiResponse(api)
	if(len(j) > 0):
		for ndx, member in enumerate(j['port']):
			j['port'][ndx]['_time'] = time
			j['port'][ndx]['DPID'] = DPID
			if test != "":
				j['port'][ndx]['test'] = test
	return j['port']

def getDataFlow(api, DPID):
	j = getApiResponse(api)
	j = j['flows']
	if(len(j) > 0):
		for ndx, member in enumerate(j):
			j[ndx]['_time'] = time
			j[ndx]['DPID'] = DPID
			if test != "":
				j[ndx]['test'] = test
				
	return j


#Connection
client = MongoClient('mongodb://localhost:27017/')
db = client.FloodLight
print("Connection to DB Enstablished")

#Host Data 
#print("Fetch Host Information")
#data = getData('/wm/device/')
#if(len(data) > 0):
#	db.HostDevices.insert(data)
#print("Done")

#print("Fetch Link Information")
#data = getData('/wm/topology/links/json')
#if(len(data) > 0):
#	pp.pprint(data)
	#db.HostDevices.insert(data)
#print("Done")

#Network Data
print("Fetch Switch Information")
data = getNetowrkInfo('/wm/core/switch/all/aggregate/json')
if(len(data) > 0):
	db.NetInfo.insert(data)
print("Done")

#Switch Data
print("Fetch Switch Information")
data = getData('/wm/core/controller/switches/json')
if(len(data) > 0):
	db.SwitchDevices.insert(data)
	#Collect DPID for later API calls
	for ndx, member in enumerate(data):
		DPID = data[ndx]['switchDPID']
		switches.append(DPID)
print("Done")

#Switch Port Data
print("Fetch Switch Port Information")
for ndx, member in enumerate(switches):
	print("\tSwitch {0} of {1} :: {2}" . format(ndx, len(switches), member) )
	data = getDataPort('/wm/core/switch/{0}/port/json' . format(member), member)
	db.SwitchPortData.insert(data)
print("Done")

print("Fetch Switch Flows Information")
for ndx, member in enumerate(switches):
	print("\tSwitch {0} of {1} :: {2}" . format(ndx, len(switches), member) )
	data = getDataFlow('/wm/core/switch/{0}/flow/json' . format(member), member)
	if(len(data) > 0):
		db.SwitchFlowData.insert(data)
print("Done")

print("Save Internal Information")
if test != "":
	data = { "_time" : time, "test" : test}
else:
	data = { "_time" : time, "test" : test}
db.DataTime.insert(data)
print("All Done")