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

