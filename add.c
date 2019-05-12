void add(int *p,char input) {
	int i,j,*k;
	switch(input) {
		case 'w':
		case 'W':
			for(i=0;i<4;i++)
				for(j=0;j<3;j++){
					k=p+i+4*j;
					if(*k==*(k+4)){
						*k*=2;
						*(k+4)=0;
					}
				}
			break;
		case 's':
		case 'S':
			for(i=0;i<4;i++)
				for(j=2;j>-1;j--){
					k=p+i+4*j;
					if(*k==*(k+4)){
						*(k+4)*=2;
						*k=0;
					}
				}
			break;
		case 'a':
		case 'A':
			for(i=0;i<4;i++)
				for(j=0;j<3;j++){
					k=p+i*4+j;
					if(*k==*(k+1)){
						*k*=2;
						*(k+1)=0;
					}
				}
			break;
		case 'd':
		case 'D':
			for(i=0;i<4;i++)
				for(j=2;j>-1;j--){
					k=p+i*4+j;
					if(*k==*(k+1)){
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
