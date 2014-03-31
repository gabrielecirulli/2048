function Animator(actuator) {
    this.actuator = actuator;
}

Animator.prototype.getSupportedProp = function(propArray) {
    var root = document.documentElement;
    for (var i = 0; i < propArray.length; i++) {
        if (propArray[i] in root.style){
            return propArray[i];
        }
    }
}

Animator.prototype.shrink = function(ratio) {
    var scale = this.getSupportedProp(['MozTransform', 'webkitTransform', 'transform']);
    var transition = this.getSupportedProp(['MozTransition', 'webkitTransition', 'transition']);
    this.actuator.gameContainer.style[scale]="scale(" + ratio + ")";
    this.actuator.gameContainer.style[transition]="all .5s ease-in-out";
}

Animator.prototype.fade = function(ratio) {
    this.actuator.gameContainer.style['opacity']=ratio;
}

Animator.prototype.reset = function() {
    this.shrink(1);
    this.fade(1);
}
