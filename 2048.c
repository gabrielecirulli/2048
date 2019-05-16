#include <stdio.h>
#include <time.h>
#include <stdlib.h>

void move(int *p,char input);
void printout(int *p);
void add(int *p,char input);
void newnum(int *p);

int main() {
	register int i,j,k,*p=(int *)malloc(sizeof(int)*16),*q=(int *)malloc(sizeof(int)*16);
	FILE *fp;
	if(p==0||q==0)
		return 1;
	for(i=0; i<16; i++)
		*(p+i)=0;
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
	srand(time(0));
	k=rand();
	for(i=0; i<16; i++)
		*(q+i)=*(p+i)+k;
	input=getch();
	switch(input) {
		case -32:
			input=getch();
			break;
		case 'r':
		case 'R':
			for(i=0; i<16; i++)
				*(p+i)=0;
			goto a;
		case 'q':
		case 'Q':
			return 0;
		case 'l':
		case 'L':
			fp=fopen("save.onk","rb");
			if(fp==0){
				fprintf(stderr,"load failed!\nhave you already saved?\n");
				goto b;
			}
			fread(p,sizeof(int),16,fp);
			fclose(fp);
			printout(p);
			goto b;
		case 'S':
		case 's':
			fp=fopen("save.onk","wb+");
			if(fp==0){
				fprintf(stderr,"save failed!\n");
				goto b;
			}
			fwrite(p,sizeof(int),16,fp);
			fclose(fp);
			fprintf(stderr,"have saved.\n");
			goto b;
		default:
			fprintf(stderr,"Invalid Type!\n");
			break; 
	}
	for(i=0; i<16; i++) {
		if(*(q+i)!=*(p+i)+k) {
			fprintf(stderr,"DO NOT CHEAT! (PRESS A KEY TO EXIT)\n");
			getch();
			return 1;
		}
	}
	move(p,input);
	add(p,input);
	move(p,input);
	for(j=0,i=0; i<16; i++)
		if(*(q+i)==*(p+i)+k)
			j++;
	if(j!=16) {
		newnum(p);
		printout(p);
	}
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
	system("cls"); //or clear for linux
	fprintf(stderr,"use R to reset\nuse Q to exit\nuse L to load savedata\nuse S to save savedata\n----------------------------\n\n");
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
	fprintf(stderr,"----------------------------\n");
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
	}
}

void newnum(int *p) {
	srand(time(0));
	int i;
	do {
		i=rand()%16;
	} while(*(p+i)!=0);
	if(rand()%10==0)
		*(p+i)=4;
	else
		*(p+i)=2;
}

