CC = gcc
CCFLAGS = -g -O3 -std=c99
FLEX = flex
BISON = bison
NAME = parse_topology

all: compile clean

lexer.c: lexer.l
	${FLEX} -f -o$@ $<

parser.c: parser.y
	${BISON} -v -t --defines=parser.h -rall $< -o $@

parser.o: parser.c struct.h
	$(CC) $(CCFLAGS) -c $<

lexer.o: lexer.c 
	$(CC) $(CCFLAGS) -c $< 

main.o: main.c parser.h parser.o struct.h
	$(CC) $(CCFLAGS) -c $<

compile: lexer.o parser.o main.o
	${CC} $(CCFLAGS) lexer.o parser.o main.o -o $(NAME)
clean:
	rm -f *.o
	rm -f *.output
	rm -f *.js
	rm -f *.json
	rm -f *.js
	rm -f *.html
	rm -f *.svg

demo: compile
	./$(NAME) < test.brite
	 sfdp -Gsize=1 ./out/*.dot -Tsvg -o ./out/topology_graph.svg