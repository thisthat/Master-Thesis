%{

#include <stdlib.h>
enum yytokentype
  {
    TOPOLOGY    = 258,
    NODES       = 259,
    EDGE        = 260,
    MODEL       = 261,
    OPEN_ROUND  = 262,
    CLOSE_ROUND = 263,
    VALUE       = 264,
    COLON       = 265,
    COMMA       = 266,
    MINUS       = 267
  };
struct YYPOS{
	int line;
	int first_column;
	int last_column;
};

//Better error reporting
#define YY_USER_ACTION yylloc.line =  yylineno; \
    yylloc.first_column = yycolumn; yylloc.last_column = yycolumn + yyleng - 1; \
    yycolumn += yyleng; 

int yycolumn = 1;
extern char* yylval;
extern struct YYPOS yylloc;
%}
%option yylineno
%option noyywrap

%%

"Topology"			{return TOPOLOGY;}
"Nodes"			    {return NODES;}
"Edges"				{return EDGE;}
"Model"				{return MODEL;}
"("				    {return OPEN_ROUND;}
")"			        {return CLOSE_ROUND;}
":"                 {return COLON;}
","                 {return COMMA;}
"-"                 {return MINUS;}

[;0-9aA-zZ.-]+		{yylval = strdup(yytext); return VALUE; }

[ \t]*			{}
[\n]*			{yycolumn = 1; /* RESET della colonna ad ogni nuova riga */ }

%%	


