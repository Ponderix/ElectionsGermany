const container = d3.select("#party_infoboxes");
console.log(container);

//appending logos
for (var i = 0; i < container._groups[0][0].children.length; i++) {
    let party = container._groups[0][0].children[i].classList[0];
    let logo_div = container.select(`.${party} > .infobox-main > .main-logo`);

    if (party != "CDU") { // if not CDU then:
        /*logo_div.append("img")
            .attr("src", `../assets/logos/${party}.svg`)*/
    }

}
