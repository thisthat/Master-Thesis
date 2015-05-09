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
import sys
import httplib,json, time
import random
import math

hosts = []

#build topology
def buildTopo():
	print '*** Init Topology'
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

	print "*** Creating Links"
	topology.addLink( node_2 , node_0 )
	topology.addLink( node_2 , node_1 )
	topology.addLink( node_3 , node_0 )
	topology.addLink( node_3 , node_1 )
	topology.addLink( node_4 , node_0 )
	topology.addLink( node_4 , node_2 )
	topology.addLink( node_5 , node_4 )
	topology.addLink( node_5 , node_3 )
	topology.addLink( node_6 , node_2 )
	topology.addLink( node_6 , node_0 )
	topology.addLink( node_7 , node_6 )
	topology.addLink( node_7 , node_4 )
	topology.addLink( node_8 , node_1 )
	topology.addLink( node_8 , node_5 )
	topology.addLink( node_9 , node_2 )
	topology.addLink( node_9 , node_0 )
	topology.addLink( node_0 , node_8 )
	topology.addLink( node_0 , node_7 )
	topology.addLink( node_1 , node_4 )
	topology.addLink( node_1 , node_6 )

	print "*** Creating Hosts Links"
	topology.addLink( host_0 , node_0 )
	topology.addLink( host_1 , node_1 )
	topology.addLink( host_2 , node_2 )
	topology.addLink( host_3 , node_3 )
	topology.addLink( host_4 , node_4 )
	topology.addLink( host_5 , node_5 )
	topology.addLink( host_6 , node_6 )
	topology.addLink( host_7 , node_7 )
	topology.addLink( host_8 , node_8 )
	topology.addLink( host_9 , node_9 )

	
	return topology

call("mn -c", shell=True)
net = Mininet(controller=partial( RemoteController, ip='127.0.0.1', port=6653 ), topo=buildTopo(), link=TCLink, switch=OVSKernelSwitch)
print "*** Build complete"

def start_proxy():
    h1 = net.get('h1')
    h1.cmd('java -jar proxy.jar &')

def start_server():
    h4 = net.get('h4')
    #h4.cmd('java -jar server.jar &')


if __name__ == '__main__':
    
    print hosts
    dim = math.ceil(len(hosts) / 2)
    print random.sample(hosts, int(dim) )

    net.start()
    #test ping
    net.pingAll()

    #start_proxy()
    #start server
    #call("sh ./install-tools.sh", shell=True)

    CLI(net)
    #call(["killall", "Wrapper"])
    #call("fuser -k 6633/tcp", shell=True)
        
    net.stop()    
    
