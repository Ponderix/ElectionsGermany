//sticky navbar (credit: https://www.w3schools.com/howto/howto_js_navbar_sticky.asp)
window.onscroll = function() {navFunction()};

var navbar = document.getElementById("NavBar");
var sticky = navbar.offsetTop;

function navFunction() {
  if (window.pageYOffset >= sticky) {
    navbar.classList.add("sticky")
  } else {
    navbar.classList.remove("sticky");
  }
}
