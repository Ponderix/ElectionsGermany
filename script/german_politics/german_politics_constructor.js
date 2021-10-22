const container = d3.select("#party_infoboxes");

//appending logos
for (var i = 0; i < container._groups[0][0].children.length; i++) {
    let party = container._groups[0][0].children[i].classList[0];
    let logo_div = container.select(`.${party} > .infobox-main > .main-text > .main-img`);

    if (party != "CDU" || party != "CSU") { // if not CDU then:
        logo_div.append("img")
            .attr("src", `../assets/logos/${party}.svg`)
    }

}

/* party slideshow functions
    * Copyright 1999-2021 by Refsnes Data. All Rights Reserved.
    * https://www.w3schools.com/howto/howto_js_slideshow.asp
*/
var slideIndex = 1; // starts at slide 1
showSlides(slideIndex);

function plusSlides(n) {
    showSlides(slideIndex += n);
}

function showSlides(n) {
    var i;
    var slides = document.getElementsByClassName("infobox");

    //if select slide doesnt exist:
    if (n > slides.length) {
        slideIndex = 1
    }
    if (n < 1) {
        slideIndex = slides.length
    }

    for (i = 0; i < slides.length; i++) { // hide current slide
        slides[i].style.display = "none";
    }

    slides[slideIndex-1].style.display = "block"; // show next slide
}
