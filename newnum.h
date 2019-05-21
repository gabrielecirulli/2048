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
