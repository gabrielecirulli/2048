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
