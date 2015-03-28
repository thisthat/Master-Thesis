#include "main.h"

//Ini File
char ** bandwidth;
int bandwidth_length = 0;
int _size = 0;
int _time = 0;

//Network
int sock,s_client;
int SERVER_PORT = 20301;
char *SERVER_IP = "127.0.0.1";
int is_server = 1;
struct sockaddr_in server,client;

//Signal handler
struct sigaction act;

int main(int argc, char ** argv) {

	//Check Parameters
	int i = 1;
	while(i < argc){
		if(strcmp(argv[i],"-s") == 0){
			//Get server IP
			i++;
			SERVER_IP = argv[i];
		}
		else if(strcmp(argv[i],"-p") == 0){
			//Get server PORT
			i++;
			SERVER_PORT = atoi(argv[i]);
		}
		else if(strcmp(argv[i],"-S") == 0){
			is_server = 1;
		}
		else if(strcmp(argv[i],"-C") == 0){
			is_server = 0;
		}
		else if(strcmp(argv[i],"-h") == 0){
			print_help();
			exit(0);
		}
		i++;
	}

	//Handle ctrl+c / ctrl+d
	act.sa_handler = catchExit; 
	sigfillset(&(act.sa_mask)); 
	sigaction(SIGINT, &act, NULL);

	
	//Read Config File
	fprintf(stderr, "Reading Config file..\n");
	qlisttbl_t *tbl = qconfig_parse_file(NULL, "config.conf", '=');
	char *s = tbl->getstr(tbl, "CONFIG.bandwidth", false);
	parseBandwidth(s);
	s = tbl->getstr(tbl, "CONFIG.size", false);
	_size = atoi(s);
	s = tbl->getstr(tbl, "CONFIG.time", false);
	_time = atoi(s);
	fprintf(stderr, "[DONE] Reading Config file\n");

	//Creating the socket
	fprintf(stderr, "Set up the connection..\n");
	if((sock = socket(AF_INET, SOCK_STREAM, 0)) == -1) {
		perror("Error creating the socket");
		exit(1);
	}

	if(is_server){
		//Server
		server.sin_family = AF_INET;
		server.sin_addr.s_addr = htonl(INADDR_ANY);
		server.sin_port = htons(SERVER_PORT);
		int yes = 1;
		if (setsockopt(sock, SOL_SOCKET, SO_REUSEADDR, &yes, sizeof(int)) == -1) {
	        perror("Error set socket options");
	        exit(2);
	    }
		if (bind(sock, (struct sockaddr *)&server, sizeof server) == -1) {
			perror("Error to listening for client");
			exit(2);
		}
		listen(sock, 1);
	}
	else {
		//Client
		server.sin_family = AF_INET;
		server.sin_addr.s_addr = inet_addr(SERVER_IP);
		server.sin_port = htons(SERVER_PORT);
		if(connect(sock, (struct sockaddr *)&server, sizeof(server)) == -1){
			fprintf(stderr,"Connecting to %s:%d\n", SERVER_IP, SERVER_PORT);
			perror("Error connecting to the server");
			exit(2);
		}
	}
	
	fprintf(stderr, "[DONE] Set up the connection\n");

	if(is_server){
		fprintf(stderr,"Waiting for connection...\n");
		wait_client();
	}
	else {
		fprintf(stderr,"Sending data...\n");
		send_data();
	}
	//Stop the sending/receiving
	close(sock);
	return 0;
}

//From CSV to Array
void parseBandwidth(char* str){
	int pos = 0;
	char* c = ",";
	int d = countChar(str,',') + 1;
	bandwidth = malloc(sizeof(char*) * d);
	int i = 0;
	char* sub;
	//Divide by comma
	while( (pos = strpos(str,c)) != -1 ){
		sub = malloc(sizeof(char) * pos);
		strncpy(sub,str,pos);
		sub[pos] = '\0';
		//fprintf(stderr, "%s _ ", sub);
		bandwidth[i] = malloc(sizeof(char*) * pos);
		strcpy(bandwidth[i], sub);
		i++;
		for(int i = 0; i <= pos; i++){
			str++;
		}
	}
	//Last remaining string
	int t = strlen(str);
	bandwidth[i] = malloc(sizeof(char*) * t);
	strcpy(bandwidth[i], str);
	i++;
	bandwidth_length = i;
}

//Count how many repetiotion of c in str
int countChar(char* str, char c){
	char* tmp = str;
	int count = 0;
	while(*tmp != '\0'){
		if(*tmp == c){
			count++;
		}
		tmp++;
	}
	return count;
}
//First position of the substring in string
int strpos(char* haystack, char* needle){
	char *c = strstr(haystack, needle);
	if(c)
		return c-haystack;
	return -1;
}


void print_help(){
	fprintf(stderr, "TrafficTester [-s :ip_address_server] [-p :port_address_server] [-S|-C]\n");
	fprintf(stderr, "\t-s :ip_address_server => set the ip of the server\n");
	fprintf(stderr, "\t-p :port_address_server => set the port of the server\n");
	fprintf(stderr, "\t-S => Server Mode, the program starts as Server\n");
	fprintf(stderr, "\t-C => Client Mode, the program starts as Client\n");
}


void wait_client(){
	char buffer[_size];
	int client_len = sizeof(client);
	int s;
	if ((s_client = accept(sock, (struct sockaddr *)&client, &client_len)) < 0) {
		perror("Error accepting connection");
		exit(3);
	}
	fprintf(stderr,"Client connected!\n");
	//Client Connected, exit when first byte = -1
	while(true){
		s = recv(s_client, &buffer, _size, 0);
		if(buffer[0]==-1) {
			fprintf(stderr,"Close Signal\nGoodby :)\n");
			exit(0);
		}
	}
}

void send_data(){
	char buffer[_size];
	buffer[0] = 0;
	int current = 0;
	int init = 0;
	int bucketSize;
	for(int i = 0; i < bandwidth_length; i++){
		//Set up the current step
		bucketSize = atoi(bandwidth[i]) * 131072; //1024*1024/8
		qtokenbucket_t bucket;
		qtokenbucket_init(&bucket, _size, bucketSize, bucketSize);
		current = init = (int)time(NULL);
		fprintf(stderr,"[%d] Bandwidth: %sMb\n", i, bandwidth[i]);
		while ( (current-init) < _time) {
			if (qtokenbucket_consume(&bucket, _size) == false) {
				// Bucket is empty. Let's wait
				usleep(qtokenbucket_waittime(&bucket, _size) * 1000);
				continue;
			}
			// Got the tokens 
			send(sock, &buffer, _size , 0);
			current = (int)time(NULL);
		}
	}
	buffer[0] = -1;
	send(sock, &buffer, _size , 0);
}

void catchExit(int nSign){
	if(nSign == SIGINT){
		fprintf(stderr,"\nClosing the connection..\n");
		if(!is_server){
			//Send Close Message
			char buffer[1];
			buffer[0] = -1;
			send(sock, &buffer, sizeof(buffer) , 0);
		}
		shutdown(s_client,SHUT_RDWR);
		shutdown(sock,SHUT_RDWR);
		fprintf(stderr,"\n[DONE] Closing the connection\n");
	}
}