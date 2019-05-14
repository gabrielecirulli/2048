#include <stdio.h>
#include <time.h>
#include <stdlib.h>

void move(int *p,char input);
void printout(int *p);
void add(int *p,char input);
void newnum(int *p);

int main() {
	int num[4][4]= {0},*p=num[0],i,j,num_[4][4],*q=num_[0];
	char input;
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
	} else if(input=='Q'||input=='q')
		return 0;
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

void move(int *p,char input) {
	int i,j,*k;
	switch(input) {
		case 'W':
		case 'w':
		case 72:
W:
			for(i=0; i<4; i++)
				for(j=0; j<3; j++) {
					k=p+i+4*j;
					if(*k==0&&*(k+4)!=0) {
						*k=*(k+4);
						*(k+4)=0;
						goto W;
					}
				}
			break;
		case 'S':
		case 's':
		case 80:
S:
			for(i=0; i<4; i++)
				for(j=2; j>-1; j--) {
					k=p+i+4*j;
					if(*k!=0&&*(k+4)==0) {
						*(k+4)=*k;
						*k=0;
						goto S;
					}
				}
			break;
		case 'a':
		case 'A':
		case 75:
A:
			for(i=0; i<4; i++)
				for(j=0; j<3; j++) {
					k=p+i*4+j;
					if(*k==0&&*(k+1)!=0) {
						*k=*(k+1);
						*(k+1)=0;
						goto A;
					}
				}
			break;
		case 'D':
		case 'd':
		case 77:
D:
			for(i=0; i<4; i++)
				for(j=2; j>-1; j--) {
					k=p+i*4+j;
					if(*k!=0&&*(k+1)==0) {
						*(k+1)=*k;
						*k=0;
						goto D;
					}
				}
			break;
	}
}

void printout(int *p) {
	int i,j=0;
	printf("\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\nuse R to reset\n");
	printf("use Q to exit\n\n");
	printf("----------------------------\n\n");
	for(i=0; i<16; i++) {
		if(*(p+i)!=0)
			printf(" %5d",*(p+i));
		else
			printf("      ");
		if(++j==4) {
			printf("\n\n\n");
			j=0;
		}
	}
	printf("----------------------------\n\n");
}

void add(int *p,char input) {
	int i,j,*k;
	switch(input) {
		case 'W':
		case 'w':
		case 72:
			for(i=0; i<4; i++)
				for(j=0; j<3; j++) {
					k=p+i+4*j;
					if(*k==*(k+4)) {
						*k*=2;
						*(k+4)=0;
					}
				}
			break;
		case 'S':
		case 's':
		case 80:
			for(i=0; i<4; i++)
				for(j=2; j>-1; j--) {
					k=p+i+4*j;
					if(*k==*(k+4)) {
						*(k+4)*=2;
						*k=0;
					}
				}
			break;
		case 'A':
		case 'a':
		case 75:
			for(i=0; i<4; i++)
				for(j=0; j<3; j++) {
					k=p+i*4+j;
					if(*k==*(k+1)) {
						*k*=2;
						*(k+1)=0;
					}
				}
			break;
		case 'D':
		case 'd':
		case 77:
			for(i=0; i<4; i++)
				for(j=2; j>-1; j--) {
					k=p+i*4+j;
					if(*k==*(k+1)) {
						*(k+1)*=2;
						*k=0;
					}
				}
			break;
defult:
			printf("Invaild type\n");
			break;
	}
}

void newnum(int *p) {
	srand(time(0));
	int i;
	do {
		i=rand()%16;
	} while(*(p+i)!=0);
	if(rand()%3==0)
		*(p+i)=4;
	else
		*(p+i)=2;
}

