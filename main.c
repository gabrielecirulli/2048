#include <stdio.h>
#include <time.h>
#include <stdlib.h>
#include "move.c"
#include "printout.c"
#include "add.c"
#include "newnum.c"

int main() {
	int num[4][4]= {0},*p=num[0],i,j,num_[4][4],*q=num_[0];
	char input;
	srand(time(0));
	*(p+rand()%16)=2;
	*(p+rand()%16)=2;
	printout(p);
a:
	for(i=0; i<16; i++)
		*(q+i)=*(p+i);
	do {
		input=getchar();
	} while(input=='\n');
	move(p,input);
	add(p,input);
	move(p,input);
	for(j=0,i=0; i<16; i++)
		if(*(q+i)==*(p+i))
			j++;
	if(j!=16) {
		newnum(p);
		printout(p);
	} else
		printf("Invaild type\n");
	goto a;
}
