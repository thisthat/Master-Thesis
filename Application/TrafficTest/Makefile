CCFLAGS = -g -O3 -std=gnu99
NAME = TrafficTester
CC = gcc
QLIBC_INCDIR = qlibc
CPPFLAGS =  -I/usr/include -I/usr/local/include -D_GNU_SOURCE -D_LARGEFILE_SOURCE -D_FILE_OFFSET_BITS=64 -I${QLIBC_INCDIR}
QLIBC = $(QLIBC_INCDIR)/lib/libqlibc.a -lpthread
QLIBC_EXT = $(QLIBC_INCDIR)/lib/libqlibcext.a -lpthread

all: compile run



compile: main.o
	$(CC) $(CCFLAGS) $(CPPFLAGS) $< -o $(NAME) $(QLIBC_EXT) $(QLIBC) 

main.o: main.c 
	$(CC) $(CCFLAGS) $(CPPFLAGS) -c $< 


clean:
	rm *.o

run: 
	#clear
	./$(NAME)
