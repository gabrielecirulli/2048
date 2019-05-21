void add(int *p,char input) {
	int i,j,*k;
	switch(input) {
		case 'W':
		case 'w':
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

