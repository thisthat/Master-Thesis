#!/usr/bin/python

"""
This file create the network topology and play around it
"""

from mininet.net import Mininet
from mininet.node import Controller, OVSSwitch, RemoteController
from mininet.cli import CLI
from mininet.log import setLogLevel
from mininet.topo import Topo

def ControllerNet():
	"Create a network from semi-scratch with multiple controllers."

	net = Mininet(controller=RemoteController, switch=OVSSwitch )
	print "*** External Controller 127.0.0.1:6653 :: FloodLight"
	c1 = net.addController( 'c1', controller=RemoteController, ip='127.0.0.1', port=6653 )
	print "*** Creating switches"
	node_0 = net.addSwitch( 's0' )
	node_1 = net.addSwitch( 's1' )
	node_2 = net.addSwitch( 's2' )
	node_3 = net.addSwitch( 's3' )
	node_4 = net.addSwitch( 's4' )
	node_5 = net.addSwitch( 's5' )
	node_6 = net.addSwitch( 's6' )
	node_7 = net.addSwitch( 's7' )
	node_8 = net.addSwitch( 's8' )
	node_9 = net.addSwitch( 's9' )
	node_10 = net.addSwitch( 's10' )
	node_11 = net.addSwitch( 's11' )
	node_12 = net.addSwitch( 's12' )
	node_13 = net.addSwitch( 's13' )
	node_14 = net.addSwitch( 's14' )
	node_15 = net.addSwitch( 's15' )
	node_16 = net.addSwitch( 's16' )
	node_17 = net.addSwitch( 's17' )
	node_18 = net.addSwitch( 's18' )
	node_19 = net.addSwitch( 's19' )

	print "*** Creating hosts"
	host_0 = net.addHost( 'h0' )
	host_1 = net.addHost( 'h1' )
	host_2 = net.addHost( 'h2' )
	host_3 = net.addHost( 'h3' )
	host_4 = net.addHost( 'h4' )
	host_5 = net.addHost( 'h5' )
	host_6 = net.addHost( 'h6' )
	host_7 = net.addHost( 'h7' )
	host_8 = net.addHost( 'h8' )
	host_9 = net.addHost( 'h9' )
	host_10 = net.addHost( 'h10' )
	host_11 = net.addHost( 'h11' )
	host_12 = net.addHost( 'h12' )
	host_13 = net.addHost( 'h13' )
	host_14 = net.addHost( 'h14' )
	host_15 = net.addHost( 'h15' )
	host_16 = net.addHost( 'h16' )
	host_17 = net.addHost( 'h17' )
	host_18 = net.addHost( 'h18' )
	host_19 = net.addHost( 'h19' )

	print "*** Creating Links"
	net.addLink( node_2 , node_1 )
	net.addLink( node_2 , node_0 )
	net.addLink( node_3 , node_2 )
	net.addLink( node_3 , node_0 )
	net.addLink( node_4 , node_2 )
	net.addLink( node_4 , node_1 )
	net.addLink( node_5 , node_3 )
	net.addLink( node_5 , node_2 )
	net.addLink( node_6 , node_2 )
	net.addLink( node_6 , node_3 )
	net.addLink( node_7 , node_6 )
	net.addLink( node_7 , node_1 )
	net.addLink( node_8 , node_4 )
	net.addLink( node_8 , node_5 )
	net.addLink( node_9 , node_1 )
	net.addLink( node_9 , node_5 )
	net.addLink( node_10 , node_2 )
	net.addLink( node_10 , node_0 )
	net.addLink( node_11 , node_9 )
	net.addLink( node_11 , node_2 )
	net.addLink( node_12 , node_0 )
	net.addLink( node_12 , node_11 )
	net.addLink( node_13 , node_11 )
	net.addLink( node_13 , node_2 )
	net.addLink( node_14 , node_2 )
	net.addLink( node_14 , node_3 )
	net.addLink( node_15 , node_3 )
	net.addLink( node_15 , node_13 )
	net.addLink( node_17 , node_7 )
	net.addLink( node_17 , node_15 )
	net.addLink( node_16 , node_1 )
	net.addLink( node_16 , node_5 )
	net.addLink( node_19 , node_3 )
	net.addLink( node_19 , node_11 )
	net.addLink( node_18 , node_9 )
	net.addLink( node_18 , node_12 )
	net.addLink( node_0 , node_14 )
	net.addLink( node_0 , node_6 )
	net.addLink( node_1 , node_12 )
	net.addLink( node_1 , node_18 )

	print "*** Creating Hosts Links"
	net.addLink( host_0 , node_0 )
	net.addLink( host_1 , node_1 )
	net.addLink( host_2 , node_2 )
	net.addLink( host_3 , node_3 )
	net.addLink( host_4 , node_4 )
	net.addLink( host_5 , node_5 )
	net.addLink( host_6 , node_6 )
	net.addLink( host_7 , node_7 )
	net.addLink( host_8 , node_8 )
	net.addLink( host_9 , node_9 )
	net.addLink( host_10 , node_10 )
	net.addLink( host_11 , node_11 )
	net.addLink( host_12 , node_12 )
	net.addLink( host_13 , node_13 )
	net.addLink( host_14 , node_14 )
	net.addLink( host_15 , node_15 )
	net.addLink( host_16 , node_16 )
	net.addLink( host_17 , node_17 )
	net.addLink( host_18 , node_18 )
	net.addLink( host_19 , node_19 )

	print "*** Building network"
	net.build()
	print "*** Starting network"
	node_0.start( [ c1 ] )
	node_1.start( [ c1 ] )
	node_2.start( [ c1 ] )
	node_3.start( [ c1 ] )
	node_4.start( [ c1 ] )
	node_5.start( [ c1 ] )
	node_6.start( [ c1 ] )
	node_7.start( [ c1 ] )
	node_8.start( [ c1 ] )
	node_9.start( [ c1 ] )
	node_10.start( [ c1 ] )
	node_11.start( [ c1 ] )
	node_12.start( [ c1 ] )
	node_13.start( [ c1 ] )
	node_14.start( [ c1 ] )
	node_15.start( [ c1 ] )
	node_16.start( [ c1 ] )
	node_17.start( [ c1 ] )
	node_18.start( [ c1 ] )
	node_19.start( [ c1 ] )
	print "*** Testing network"
	net.pingAll()

	print "*** Running CLI"
	CLI( net )

	print "*** Stopping network"
	net.stop()

if __name__ == '__main__':
	setLogLevel( 'info' )  # for CLI output
	ControllerNet()