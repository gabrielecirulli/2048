void printout(int *p){
	int i,j=0;
	for(i=0;i<16;i++){
		if(*(p+i)!=0)
			printf("%6d",*(p+i));
		else
			printf("      ");
		if(++j==4){
			printf("\n\n\n");
			j=0;
		}
	}
} 
