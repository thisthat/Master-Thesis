%{
#define YYSTYPE char*
#define YYSTYPE_IS_DECLARED 1

#include <stdio.h>
#include <string.h>
#include <stdlib.h>
#include "struct.h"

//void yyerror (YYLTYPE *locp, char const *s);
void yyerror(char const *s);

struct YYPOS{
	int line;
	int first_column;
	int last_column;
};
struct YYPOS yylloc;

int indexNode = 0;
int indexEdge = 0;

%}

%start BriteConfFile

%token TOPOLOGY
%token NODES 
%token EDGES
%token MODEL
%token OPEN_ROUND
%token CLOSE_ROUND
%token VALUE
%token COLON
%token COMMA
%token MINUS


%%

BriteConfFile:	topology  nodes edges { };

topology : TOPOLOGY COLON OPEN_ROUND VALUE NODES COMMA VALUE EDGES CLOSE_ROUND models {
	__sizeNodes = atoi($4);
	__sizeEdges = atoi($7);
	nodes = malloc(sizeof(struct node) * __sizeNodes);
	edges = malloc(sizeof(struct edge) * __sizeEdges);
};

models : model {}
	   | model models {}

model : MODEL OPEN_ROUND VALUE MINUS VALUE CLOSE_ROUND COLON valueList {}

valueList : VALUE {}
		  | valueList VALUE  {}


nodes : NODES COLON OPEN_ROUND VALUE CLOSE_ROUND nodeList {}

nodeList: node {}
		| nodeList node  {}

//      ID     X    Y    [IN/OUT]_DEG    AS id    TYPE
node : VALUE VALUE VALUE VALUE VALUE     VALUE   VALUE { 
	int id = atoi($1); 
	int x  = atoi($2);
	int y  = atoi($3);
	int indegree = atoi($4);
	int outdegree = atoi($5);
	int ASid = atoi($6);
	char* type = $7;
	struct node n;
	n.id = id;
	n.x = x;
	n.y = y;
	n.indegree = indegree;
	n.outdegree = outdegree;
	n.ASid = ASid;
	n.type = type;
	nodes[indexNode] = n;
	indexNode++;
}



edges : EDGES COLON OPEN_ROUND VALUE CLOSE_ROUND edgeList {}
edgeList: edge {}
		| edgeList edge  {}


//     id   from   to   length(m)    delay bandwidth    ASFrom    ASTo  TYPE   ???
edge: VALUE VALUE VALUE VALUE        VALUE VALUE        VALUE     VALUE VALUE VALUE {
	int id = atoi($1);
	int from = atoi($2);
	int to = atoi($3);
	float length = atof($4);
	float delay = atof($5);
	float bandwidth = atof($6);
	int ASFrom = atoi($7);
	int ASTo = atoi($8);
	char* type = $9;
	struct edge e;
	e.id = id;
	e.from = from;
	e.to = to;
	e.length = length;
	e.delay = delay;
	e.bandwidth = bandwidth;
	e.ASFrom = ASFrom;
	e.ASTo = ASTo;
	e.type = type;
	edges[indexEdge] = e;
	indexEdge++;
}


%%




void yyerror (char const *s){
	fprintf(stderr,"Errore in linea %d dal carattere %d al %d\n%s-%s\n", yylloc.line,yylloc.first_column, yylloc.last_column,yylval,s);
}
