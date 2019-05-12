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
	printf("game started!\nuse R to reset\n");
a:
	srand(time(0));
	i=rand()%16;
	*(p+i)=2;
	do
		j=rand()%16;
	while(j==i);
	*(p+j)=2;
	printout(p);
b:
	for(i=0; i<16; i++)
		*(q+i)=*(p+i);
	input=getch();
	if(input==-32)
		input=getch();
	else if(input=='r'||input=='R') {
		for(i=0; i<16; i++)
			*(p+i)=0;
		goto a;
	}
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
	goto b;
}
