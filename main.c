#include <stdio.h>
#include <time.h>
#include <stdio.h>
#include "move.c"
#include "printout.c"
#include "add.c"

int main() {
	int num[4][4]= {0},*p=num;
	char input;
	*(p+rand()%16)=2;
	*(p+rand()%16)=2;
	printout(p);
a:
	getch(); 
	input=getch();
	move(p,input);
	add(p,input);
	move(p,input);
	printout(p);
	goto a;
}
