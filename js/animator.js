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
    var prefix = this.getSupportedProp(['transform', 'MozTransform', 'webkitTransform']);
    this.actuator.gameContainer.style[prefix]="scale(" + ratio + ")";
    this.actuator.gameContainer.style['webkitTransition']="all .5s ease-in-out";
}

Animator.prototype.fade = function(ratio) {
    this.actuator.gameContainer.style['opacity']=ratio;
}
