// Wait till the browser is ready to render the game (avoids glitches)
window.requestAnimationFrame(function () {
  new GameManager(4, KeyboardInputManager, HTMLActuator, LocalScoreManager);
});
var imageList = [
       "tzvika/212/tzvika2.png",
       "tzvika/212/tzvika4.png",
       "tzvika/212/tzvika8.png",
       "tzvika/212/tzvika16.png",
       "tzvika/212/tzvika32.png",
       "tzvika/212/tzvika64.png",
       "tzvika/212/tzvika128.png",
       "tzvika/212/tzvika256.png",
       "tzvika/212/tzvika512.png",
       "tzvika/212/tzvika1024.png",
       "tzvika/212/tzvika2048.png",
       "tzvika/114/tzvika2small.png",
       "tzvika/114/tzvika4small.png",
       "tzvika/114/tzvika8small.png",
       "tzvika/114/tzvika16small.png",
       "tzvika/114/tzvika32small.png",
       "tzvika/114/tzvika64small.png",
       "tzvika/114/tzvika128small.png",
       "tzvika/114/tzvika256small.png",
       "tzvika/114/tzvika512small.png",
       "tzvika/114/tzvika1024small.png",
       "tzvika/114/tzvika2048small.png",
];
for (var i = 0; i < imageList.length; i++) {
    var imageObject = new Image();
    imageObject.src = imageList[i];
}