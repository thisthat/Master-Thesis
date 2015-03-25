#include "main.h"

char ** bandwidth;
int bandwidth_length = 0;
int _size = 0;
int _time = 0;

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

	//Start the sending
	
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
