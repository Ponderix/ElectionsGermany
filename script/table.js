var table = {
    //function which expands or despands the "ELECTION RESULTS" tab on click
    expand : function(arrow, element) {
        if (element.classList[0] == "bodyactive") {
            arrow.children[0].classList = "arrow left";
            element.classList = "bodyinactive body";
        } else {
            console.log(element.classList);
            arrow.children[0].classList = "arrow down";
            element.classList = "bodyactive body";
        }
    },

    //draw table for national election results
    drawResults : function(data, container, region, vote) {
        var result = electionData.getDistrict(data, region);
        var partyArray = electionData.getData(data, region, vote);
        var div = d3.select(container);

        partyArray.sort((a, b) => {
            return b[1] - a[1];
        });

        for (var i = 0; i < partyArray.length; i++) {
            let party = div.append("div")
                .attr("id", `${partyArray[i][0]}-table`)
                .attr("class", `table-party border-${partyArray[i][0]}`)
                .style("border-color", null);

            if (partyArray[i][0] != "Others") {
                party.append("img")
                    .attr("src", `../assets/logos/${partyArray[i][0]}.svg`)
                    .attr("class", "party-logo")
                    .attr("title", partyArray[i][0]);
            } else {
                party.append("span")
                    .attr("id", "other-parties-visual")
                    .html("Oth.")
                    .attr("title", partyArray[i][0]);
            }
        }
    },
}
