#include <arpa/inet.h>
#include <netinet/in.h>
#include <signal.h>
#include <stdio.h>
#include <stdlib.h>
#include <string.h>
#include <sys/socket.h>
#include <sys/types.h>
#include <unistd.h>
#include "qlibc/qlibc.h"
#include "qlibc/qlibcext.h"

int strpos(char* haystack, char* needle);
void parseBandwidth(char* str);
int countChar(char* str, char c);
void print_help();
void wait_client();
void send_data();
void catchExit(int nSign);
