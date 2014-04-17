// Setup Leap loop with frame callback function
var controllerOptions = {enableGestures: true};
var cachedId;
var sensitivity = 0.85;

Leap.loop(controllerOptions, function (frame) {
  var gestures = frame.gestures;
  if (gestures && gestures.length > 0) {
    for (var i = 0, l = gestures.length; i < l; i++) {
      var gesture = frame.gestures[i];
      if (gesture.type === "swipe" && gesture.id !== cachedId) {
        cachedId = gesture.id;
        var eventDetail = { 'detail': gesture.direction };
        var event = new CustomEvent('leap-gesture', eventDetail);
        document.dispatchEvent(event);
        break;
      }
    }
  }
});
