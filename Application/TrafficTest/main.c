#include "main.h"

char ** bandwidth;
int bandwidth_length = 0;
int _size = 0;
int _time = 0;

int sock,s_client;
int SERVER_PORT = 20301;
char *SERVER_IP = "127.0.0.1";
int is_server = 1;
struct sockaddr_in server,client;

//Signal handler
struct sigaction act;


int main(int argc, char ** argv) {
    /* IT WORKS

	qtokenbucket_t bucket;
	qtokenbucket_init(&bucket, 500, 1000, 1000);
	while (1) {
		if (qtokenbucket_consume(&bucket, 1) == false) {
			// Bucket is empty. Let's wait
			usleep(qtokenbucket_waittime(&bucket, 1) * 1000);
			continue;
		}
		// Got a token. Let's do something here.
		//do_something();
		fprintf(stderr,"Token used\n");
	}
 	*/
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
	act.sa_handler = catchExit; /* registrazione dell'handler */
	sigfillset(&(act.sa_mask)); /* eventuali altri segnali saranno ignorati
	durante l'esecuzione dell'handler */
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
	//Start the sending
	close(sock);
	return 0;
}

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
	while(true){
		s = recv(s_client, &buffer, _size, 0);
		fprintf(stderr,"Recv data %d!\n", s);
		if(buffer[0]==-1) {
			fprintf(stderr,"Close Signal\nGoodby :)\n");
			exit(0);
		}
	}
}

void send_data(){
	char buffer[_size];
	buffer[0] = 0;
	qtokenbucket_t bucket;
	qtokenbucket_init(&bucket, 500, 2*_size, 2*_size);
	while (1) {
		if (qtokenbucket_consume(&bucket, _size) == false) {
			// Bucket is empty. Let's wait
			usleep(qtokenbucket_waittime(&bucket, _size) * 1000);
			continue;
		}
		// Got a token. Let's do something here.
		//do_something();
		send(sock, &buffer, _size , 0);
	}
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
		shutdown(s_client,SHUT_RD);
		shutdown(sock,SHUT_RDWR);
		fprintf(stderr,"\n[DONE] Closing the connection\n");
	}
}