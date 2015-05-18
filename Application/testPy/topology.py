#!/usr/bin/python

"""
This file create the network topology and play around it
"""
from mininet.net import Mininet
from mininet.topo import *
from mininet.node import Controller, OVSKernelSwitch, RemoteController
from mininet.link import TCLink
from mininet.cli import CLI
from subprocess import call
from functools import partial
import math
import random
import time
import threading
import urllib2

hosts = ['h1','h2','h3','h4','h5','h6','h7','h8','h9','h0']

requests = [1100,800,650,300,200,100,50,120,300,400,500,600,900,950,1000,900,950,1000,600,500,600,700,800,950]
timeSpan = 30
filename = 'testingfile'

class TokenBucket(object):
    """An implementation of the token bucket algorithm.
    
    >>> bucket = TokenBucket(80, 0.5)
    >>> print bucket.consume(10)
    True
    >>> print bucket.consume(90)
    False
    """
    def __init__(self, initToks, tokens, fill_rate):
        """tokens is the total tokens in the bucket. fill_rate is the
        rate in tokens/second that the bucket will be refilled."""
        self.capacity = float(tokens)
        self._tokens = float(initToks)
        self.fill_rate = float(fill_rate)
        self.timestamp = time.time()

    def consume(self, tokens):
        """Consume tokens from the bucket. Returns True if there were
        sufficient tokens otherwise False."""
        if tokens <= self.tokens:
            self._tokens -= tokens
        else:
            return False
        return True

    def get_tokens(self):
        if self._tokens < self.capacity:
            now = time.time()
            delta = self.fill_rate * (now - self.timestamp)
            self._tokens = min(self.capacity, self._tokens + delta)
            self.timestamp = now
        return self._tokens
    tokens = property(get_tokens)

def buildTopo():
	# Add links Mbps, ms delay, 10% loss
    linkopts = dict(bw=100, delay='5ms', loss=2, max_queue_size=1000, use_htb=True)

    print 'init topology'
    topology=Topo()
    h1 = topology.addHost( 'h1', mac='00:00:00:00:00:01' )
    h2 = topology.addHost( 'h2', mac='00:00:00:00:00:02' )
    h3 = topology.addHost( 'h3', mac='00:00:00:00:00:03' )
    h4 = topology.addHost( 'h4', mac='00:00:00:00:00:04' )
    h5 = topology.addHost( 'h5', mac='00:00:00:00:00:05' )
    h6 = topology.addHost( 'h6', mac='00:00:00:00:00:06' )
    h7 = topology.addHost( 'h7', mac='00:00:00:00:00:07' )
    h8 = topology.addHost( 'h8', mac='00:00:00:00:00:08' )
    h9 = topology.addHost( 'h9', mac='00:00:00:00:00:09' )
    h0 = topology.addHost( 'h0', mac='00:00:00:00:00:10' )
    s1 = topology.addSwitch( 's1' )
    s2 = topology.addSwitch( 's2' )
   
    #linkopts = dict()
    # alternately: linkopts = {'bw':10, 'delay':'5ms', 'loss':10,
    # max_queue_size=1000, 'use_htb':True}
    print 'init link'
    topology.addLink( h1, s1, **linkopts)
    topology.addLink( h2, s1, **linkopts)
    topology.addLink( h3, s1, **linkopts)
    topology.addLink( h4, s1, **linkopts)
    topology.addLink( h5, s1, **linkopts)
    topology.addLink( s1, s2, **linkopts)
    topology.addLink( h6, s2, **linkopts)
    topology.addLink( h7, s2, **linkopts)
    topology.addLink( h8, s2, **linkopts)
    topology.addLink( h9, s2, **linkopts)
    topology.addLink( h0, s2, **linkopts)
    print 'finish link'
    return topology

def doRequest():
	#client_name = random.choice(hostToUse)
	#server_name = random.choice(hostNotUsed)
	#print client_name
	client = random.choice(clients)
	server = random.choice(servers)
	_cmd = "curl -G http://{0}:9004/media/{1} &" .  format( server.IP(), filename )
	#The following line is the one that slow down everything! cmd -> popen seems like to resolve the problem
	client.cmd( _cmd )
	#print client
	#Get video from server
	#curl -G http://127.0.0.1:9004/media/{Name}
	#Test n Requests
	urllib2.urlopen('http://127.0.0.1/server.php')

class myThread (threading.Thread):
	def __init__(self, threadID):
		threading.Thread.__init__(self)
		self.threadID = threadID
	def run(self):
		doRequest()

threads = []
clients = []
servers = []

if __name__ == '__main__':
	#Mininet Start
	call("mn -c", shell=True)
	net = Mininet(controller=partial( RemoteController, ip='127.0.0.1', port=6653 ), topo=buildTopo(), link=TCLink, switch=OVSKernelSwitch)
	print hosts
	dim = math.ceil(len(hosts) / 2)
	hostToUse =  random.sample(hosts, int(dim) )
	hostNotUsed = [item for item in hosts if item not in hostToUse]
	#Get the server from one of the not used hosts
	for server_name in hostNotUsed:
		server = net.get(server_name)
		servers.append(server)
		server.cmd("java -jar server-0.0.1-SNAPSHOT.jar --ip={0} --server.port=9004 &" . format(server.IP()))
	for client_name in hostToUse:
		client = net.get(client_name)
		clients.append(client)
	#print hostToUse
	counter = 0
	for i in requests:
		print "request {0}-th" . format(counter)
		counter = counter + 1
		tInit = int(time.time())
		t = tInit
		toks = i / timeSpan
		bucket = TokenBucket(int(toks / 2), i, toks)
		while t - tInit < timeSpan :
			t = int(time.time())
			if bucket.consume(1) :
				doRequest()
				#chose the client randomly
				#th = myThread(i)
				#threads.append(th)
				#th.start()
	#wait close of all thread
	#for t in threads:
	#	t.join()
	print 'All Done :)'
