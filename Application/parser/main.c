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
	fprintf(stderr, "Files topology.[dot|py] created\n");
	return 0;
}

void createTopology(){
	FILE *f;
	FILE *header;
	FILE *footer;
	f = fopen("./out/topology.py","w+");
	header = fopen("./template/header.template", "r");
	footer = fopen("./template/footer.template", "r");

	//Copy the header
	char line[80];
	while(fgets(line, 80, header) != NULL)
	{
		fprintf(f, "%s", line);
	}
	fprintf(f,"\n");
	fclose(header);

	//Nodes creationing
	fprintf(f, "\tprint \"*** Creating switches\"\n");
	for(int i = 0; i < __sizeNodes; i++){
		struct node n = nodes[i];
		fprintf(f, "\tnode_%d = topology.addSwitch( 's%d' )\n", n.id , i);
	}
	fprintf(f,"\n");

	//Host creationing
	fprintf(f, "\tprint \"*** Creating hosts\"\n");
	for(int i = 0; i < __sizeNodes; i++){
		struct node n = nodes[i];
		fprintf(f, "\thost_%d = topology.addHost( 'h%d' )\n", n.id , i);
		fprintf(f, "\thosts.append('h%d')\n", i);
	}
	fprintf(f,"\n");
	
	//Edges
	fprintf(f, "\tprint \"*** Creating Switch Links\"\n");
	for(int i = 0; i < __sizeEdges; i++){
		struct edge e = edges[i];
		struct node n1 = nodes[e.from];
		struct node n2 = nodes[e.to];
		fprintf(f, "\ttopology.addLink( node_%d , node_%d, **linkopts )\n" , n1.id, n2.id);
	}
	fprintf(f,"\n");
	fprintf(f, "\tprint \"*** Creating Hosts Links\"\n");
	//Host link
	for(int i = 0; i < __sizeNodes; i++){
		struct node n = nodes[i];
		fprintf(f, "\ttopology.addLink( host_%d , node_%d, **linkopts )\n" , n.id, n.id);
	}
	fprintf(f,"\n");
	
	//Build the network
    /*
    fprintf(f,"\tprint \"*** Building network\"\n");
    fprintf(f,"\tnet.build()\n");
    fprintf(f,"\tprint \"*** Starting network\"\n");
	for(int i = 0; i < __sizeNodes; i++){
		struct node n = nodes[i];
		fprintf(f, "\tnode_%d.start( [ c1 ] )\n", n.id );
	}
	*/

	while(fgets(line, 80, footer) != NULL)
	{
		fprintf(f, "%s", line);
	}
	fclose(footer);

	//fprintf(f, "topos = { 'mytopo' : ( lambda: MyTopo() ) }\n");
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


