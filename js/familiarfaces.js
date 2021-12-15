// declare the styleSheet as a global so that a new one
// is not created every time addColor is called
let styleSheet;

function changeBackground(selector, backgroundID, width, height) {
    if (!styleSheet) {
        console.log("Created stylesheet.")
        const styleElement = document.createElement('style');
        document.head.appendChild(styleElement);
        styleSheet = styleElement.sheet;
    }

    index = document.styleSheets.length - 1;
    urlString = `https://drive.google.com/thumbnail?id=${backgroundID}&sz=w${width || 200}-h${height || 200}`
    document.styleSheets[index].insertRule(
        `${selector}{ background: url(${urlString})
    }`);
    document.styleSheets[index].insertRule(
        `${selector}{ background-size: cover !important}`
    );

}
changeBackground(".tile.tile-2 .tile-inner", "1IAqNwrCzD_L-7S_BAplpNj_7YSveIYGY", 400, 400);