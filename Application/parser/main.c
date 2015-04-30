#include <stdio.h>
#include <string.h>
#include <stdlib.h>
#include "parser.h"
#include "struct.h"



void createTopology();
void createGraph();

int main () {

	yyparse(); //Parsing the file

	createGraph();
	createTopology();
	return 0;
}

void createTopology(){
	FILE *f;
	f = fopen("./out/topology.py","w+");
	fprintf(f, "from mininet.topo import Topo\n\n");
	fprintf(f, "class MyTopo( Topo ):\n");
	fprintf(f, "\tdef __init__( self ):\n\n");
	fprintf(f, "\t\tTopo.__init__( self )\n\n");
	//Nodes creationing
	for(int i = 0; i < __sizeNodes; i++){
		struct node n = nodes[i];
		fprintf(f, "\t\tnode_%d = self.addSwitch( 's%d' )\n", n.id , i);
	}
	fprintf(f,"\n");
	//Edges
	for(int i = 0; i < __sizeEdges; i++){
		struct edge e = edges[i];
		struct node n1 = nodes[e.from];
		struct node n2 = nodes[e.to];
		fprintf(f, "\t\tself.addLink( node_%d , node_%d, bw=%f, delay='%fms', loss=%d, max_queue_size=%d, use_htb=True )\n" , n1.id, n2.id, e.bandwidth, e.delay, 1, 1000);
	}
	fprintf(f,"\n");
	fprintf(f, "topos = { 'mytopo' : ( lambda: MyTopo() ) }\n");
	fclose(f);
}

void createGraph(){
	FILE *f;
	f = fopen("./out/topology.dot","w+");
	fprintf(f, "digraph world {\n");
	fprintf(f,"\n\tgraph [ranksep=3, root=\"0\"];\n");
	for(int i = 0; i < __sizeEdges; i++){
		struct edge e = edges[i];
		struct node n1 = nodes[e.from];
		struct node n2 = nodes[e.to];
		fprintf(f, "\t%d -> %d [label=\"\", arrowhead=none];\n", n1.id, n2.id);
	}
	fprintf(f, "}\n");
	fclose(f);
}


