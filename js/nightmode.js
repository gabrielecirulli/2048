window.onload = function() {
  var a = document.getElementById("nightbtn");
  a.onclick = function() {
   	if (document.getElementsByTagName("html")[0].style.backgroundColor === "rgb(0, 0, 0)") {
   		document.getElementsByTagName("html")[0].style.backgroundColor = "#faf8ef";
   		document.getElementsByTagName("body")[0].style.backgroundColor = "#faf8ef";
     	return false;
    }
    else {
   		document.getElementsByTagName("html")[0].style.backgroundColor = "#000000";
   		document.getElementsByTagName("body")[0].style.backgroundColor = "#000000";
  		return false;
    }
  }
}