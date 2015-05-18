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

hosts = []

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
	print "*** Creating switches"
	node_0 = topology.addSwitch( 's0' )
	node_1 = topology.addSwitch( 's1' )
	node_2 = topology.addSwitch( 's2' )
	node_3 = topology.addSwitch( 's3' )
	node_4 = topology.addSwitch( 's4' )
	node_5 = topology.addSwitch( 's5' )
	node_6 = topology.addSwitch( 's6' )
	node_7 = topology.addSwitch( 's7' )
	node_8 = topology.addSwitch( 's8' )
	node_9 = topology.addSwitch( 's9' )

	print "*** Creating hosts"
	host_0 = topology.addHost( 'h0' )
	hosts.append('h0')
	host_1 = topology.addHost( 'h1' )
	hosts.append('h1')
	host_2 = topology.addHost( 'h2' )
	hosts.append('h2')
	host_3 = topology.addHost( 'h3' )
	hosts.append('h3')
	host_4 = topology.addHost( 'h4' )
	hosts.append('h4')
	host_5 = topology.addHost( 'h5' )
	hosts.append('h5')
	host_6 = topology.addHost( 'h6' )
	hosts.append('h6')
	host_7 = topology.addHost( 'h7' )
	hosts.append('h7')
	host_8 = topology.addHost( 'h8' )
	hosts.append('h8')
	host_9 = topology.addHost( 'h9' )
	hosts.append('h9')

	print "*** Creating Switch Links"
	topology.addLink( node_2 , node_0, **linkopts )
	topology.addLink( node_2 , node_1, **linkopts )
	topology.addLink( node_3 , node_0, **linkopts )
	topology.addLink( node_3 , node_1, **linkopts )
	topology.addLink( node_4 , node_0, **linkopts )
	topology.addLink( node_4 , node_2, **linkopts )
	topology.addLink( node_5 , node_4, **linkopts )
	topology.addLink( node_5 , node_3, **linkopts )
	topology.addLink( node_6 , node_2, **linkopts )
	topology.addLink( node_6 , node_0, **linkopts )
	topology.addLink( node_7 , node_6, **linkopts )
	topology.addLink( node_7 , node_4, **linkopts )
	topology.addLink( node_8 , node_1, **linkopts )
	topology.addLink( node_8 , node_5, **linkopts )
	topology.addLink( node_9 , node_2, **linkopts )
	topology.addLink( node_9 , node_0, **linkopts )
	topology.addLink( node_0 , node_8, **linkopts )
	topology.addLink( node_0 , node_7, **linkopts )
	topology.addLink( node_1 , node_4, **linkopts )
	topology.addLink( node_1 , node_6, **linkopts )

	print "*** Creating Hosts Links"
	topology.addLink( host_0 , node_0, **linkopts )
	topology.addLink( host_1 , node_1, **linkopts )
	topology.addLink( host_2 , node_2, **linkopts )
	topology.addLink( host_3 , node_3, **linkopts )
	topology.addLink( host_4 , node_4, **linkopts )
	topology.addLink( host_5 , node_5, **linkopts )
	topology.addLink( host_6 , node_6, **linkopts )
	topology.addLink( host_7 , node_7, **linkopts )
	topology.addLink( host_8 , node_8, **linkopts )
	topology.addLink( host_9 , node_9, **linkopts )

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
    #   t.join()
    print 'All Done :)'
