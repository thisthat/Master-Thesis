struct node{
	int id;
	int x;
	int y;
	int indegree;
	int outdegree;
	int ASid;
	char* type;
};
struct node* nodes;
int __sizeNodes;

struct edge{
	int id;
	int from;
	int to;
	float length;
	float delay;
	float bandwidth;
	int ASFrom;
	int ASTo;
	char* type;

};
struct edge* edges;
int __sizeEdges;