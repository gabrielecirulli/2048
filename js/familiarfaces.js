// declare the styleSheet as a global so that a new one
// is not created every time addColor is called
let styleSheet;
document.getElementsByClassName("game-container")[0].style.display = "none";
const imageData = 
{
    "9284":
        [
        
            "1IAqNwrCzD_L-7S_BAplpNj_7YSveIYGY",
            "1B7MiTrB8dDG_3GWxzjVGaQDRRk7UcWjm",
            "1GoRqw3gQqP4Q6wV-7oAvhXZC7PeNt0mx",
            "1_k3huovwuTovyGKeu_Ey_vsDT4yXkWS_",
            "1UCxFEP2K9KVdOoanQnIkQ9SXJ2wQXY_a",
            "1TqxAk21M0YVAqpivx3S8BpVKRpvUKwNO",
            "1Y2gD0ov53HX04Qf1xq8F-XLssF06dEWH",
            "1L2pWQptVbtfYHClca2Z2wTprQq3oFfDX",
            "1VyNXfC2h5uS9Psv4gMu65pWtYUALJXKW",
            "14MIPdrFU-FQJCvu4hrNb4ce7vJIZrqzl",
            "1nZo3NT5gs7duX-KtEWKIR5VWnKlfpi_r"
        ]
}
function getCookie(cname) {
    let name = cname + "=";
    let decodedCookie = decodeURIComponent(document.cookie);
    let ca = decodedCookie.split(';');
    for(let i = 0; i <ca.length; i++) {
      let c = ca[i];
      while (c.charAt(0) == ' ') {
        c = c.substring(1);
      }
      if (c.indexOf(name) == 0) {
        return c.substring(name.length, c.length);
      }
    }
    return "";
  }
function setCookie(cname, cvalue, exdays) {
    const d = new Date();
    d.setTime(d.getTime() + (exdays*24*60*60*1000));
    let expires = "expires="+ d.toUTCString();
    document.cookie = cname + "=" + cvalue + ";" + expires + ";path=/";
}
function loadGame(gameCode) {
    imageData[gameCode].forEach((imageID, index) => {
        num = Math.pow(2, index+1);
        className = `.tile.tile-${num} .tile-inner`;
        changeBackground(className, getGoogleDriveURL(imageID, 400, 400));
    })
    document.getElementsByClassName("game-container")[0].style.display = "block";
}
function getGoogleDriveURL(id, width, height) {
    return `https://drive.google.com/thumbnail?id=${id}&sz=w${width || 200}-h${height || 200}`;
}
function changeBackground(selector, url) {
    if (!styleSheet) {
        const styleElement = document.createElement('style');
        document.head.appendChild(styleElement);
        styleSheet = styleElement.sheet;
    }

    index = document.styleSheets.length - 1;
    document.styleSheets[index].insertRule(
        `${selector}{ background: url(${url})
    }`);
    document.styleSheets[index].insertRule(
        `${selector}{ background-size: cover !important}`
    );

}

var gameButton = document.getElementById("game-code-button");
gameButton.onclick = () => {
    var gameCode = document.getElementById("game-code-text").value;
    if(gameCode in imageData) {
        setCookie("gameCode",gameCode,7);
        loadGame(gameCode);
    }
    else alert("That's not a valid game code! Sorry!")
}

let gameCode = getCookie("gameCode");
if (gameCode != "" && (gameCode in imageData)) {
    loadGame(gameCode)
}
else alert("Looks like you don't have the right cookie on you.")