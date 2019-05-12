void newnum(int *p) {
	srand(time(0));
	int i;
	do {
		i=rand()%16;
	} while(*(p+i)!=0);
	if(rand()%2==0)
		*(p+i)=2;
	else
		*(p+i)=4;
}
