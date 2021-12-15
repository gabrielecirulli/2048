// declare the styleSheet as a global so that a new one
// is not created every time addColor is called
let styleSheet;

function changeBackground(className, backgroundURL) {
    if (!stylesheet) {
        const styleElement = document.createElement('style');
        document.head.appendChild(styleElement);
        styleSheet = styleElement.sheet;
    }

    // override existing background rules
    styleSheet.insertRule("."+className+' { background: blue }', styleSheet.cssRules.length);
}
changeBackground("tile2");