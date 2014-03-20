// Wait till the browser is ready to render the game (avoids glitches)
window.requestAnimationFrame(function () {
	var startTileNum = 2; // default grid size

	startTileNum = prompt("Please enter the number of tiles at the start of the game","2");
	startTileNum = parseInt(startTileNum);

	while(!validStartTileInput(startTileNum)){
		startTileNum = prompt("Please enter the number of tiles at the start of the game (an integer between 1 and 15)","2");
		startTileNum = parseInt(startTileNum);  	
	}
	

	new GameManager(4, KeyboardInputManager, HTMLActuator, LocalScoreManager, startTileNum);
	
	function validStartTileInput(startTileNum){
		if (startTileNum != NaN && startTileNum < 16 && startTileNum > 0)  {		
			return true;
		}
		return false;
	}
});
