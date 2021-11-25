/* HEADER.JS
* to adjust absolutely positioned elements to their parent elements
* this can not be done with normal css so a js solution had to be found
*/
checkWidth();

window.addEventListener('resize', () =>{
    checkWidth();
});

function checkWidth() {
    if (window.innerWidth < 850) {
        var parentWidth = document.querySelector(".dropdown").scrollWidth;
        document.querySelector(".dropdown-content").style.width = parentWidth + "px";
    } else {
        console.log("def");
        document.querySelector(".dropdown-content").style.width = "120px";
    }
}
