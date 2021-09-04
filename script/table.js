var table = {
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

    drawTable : function(data, container, region, vote) {
        var result = electionData.getDistrict(data, region);
        var partyArray = electionData.getData(data, region, vote);
    },
}
