void move(int *p,char input) {
	int i,j,*k;
	switch(input) {
		case 'w':
		case 'W':
		W:
			for(i=0;i<4;i++)
				for(j=0;j<3;j++){
					k=p+i+4*j;
					if(*k==0&&*(k+4)!=0){
						*k=*(k+4);
						*(k+4)=0;
						goto W;
					}
				}
			break;
		case 's':
		case 'S':
		S:
			for(i=0;i<4;i++)
				for(j=2;j>-1;j--){
					k=p+i+4*j;
					if(*k!=0&&*(k+4)==0){
						*(k+4)=*k;
						*k=0;
						goto S;
					}
				}
			break;
		case 'a':
		case 'A':
		A:
			for(i=0;i<4;i++)
				for(j=0;j<3;j++){
					k=p+i*4+j;
					if(*k==0&&*(k+1)!=0){
						*k=*(k+1);
						*(k+1)=0;
						goto A;
					}
				}
			break;
		case 'd':
		case 'D':
		D:
			for(i=0;i<4;i++)
				for(j=2;j>-1;j--){
					k=p+i*4+j;
					if(*k!=0&&*(k+1)==0){
						*(k+1)=*k;
						*k=0;
						goto D;
					}
				}
			break;
	}
}
