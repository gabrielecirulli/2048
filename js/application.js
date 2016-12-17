// Wait till the browser is ready to render the game (avoids glitches)


window.onload = function() {
    // Initialization job performed
	window.requestAnimationFrame(function () {
		  new GameManager(4, KeyboardInputManager, HTMLActuator, LocalStorageManager);
		});
    // add eventListener for tizenhwkey
    document.addEventListener('tizenhwkey', function(e) {
        if (e.keyName === "back") {
            try {
                tizen.application.getCurrentApplication().exit();
            } catch (ignore) {}
        }
    });
};