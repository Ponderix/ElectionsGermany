var margin = {
    top: 0,
    left: 0,
    bottom: 20,
    right: 20
};

var map = {
    height: 850 - margin.top - margin.bottom,
    width: 950 - margin.left - margin.right,

    //district style class
    class: function(data, array, vote, index) {
        var wahlkreis = array[index].properties.WKR_NAME;
        var partyArray = electionData.getData(data, wahlkreis, vote);

        functions.removeZero(partyArray, 1);

        return partyArray[0][0];
    },

    opacity: function(data, array, vote, index) {
        var wahlkreis = array[index].properties.WKR_NAME;
        var partyArray = electionData.getData(data, wahlkreis, vote);

        functions.removeZero(partyArray, 1);

        if (partyArray[0][0] == "Others") {
            return 1;
        } else {
            if (partyArray.length >= 2) { //if there is only one party running the function would fail since there owuld be no second largest party
                return (partyArray[0][1] - partyArray[1][1] + 10) * 3 / 100;
            } else {
                return (partyArray[0][1] + 10) / 100;
            }
        }

    },

    stroke : function(data, array, vote, index) { //different stroke for others since they can be confised with cdu
        var wahlkreis = array[index].properties.WKR_NAME;
        var partyArray = electionData.getData(data, wahlkreis, vote);

        functions.removeZero(partyArray, 1);

        if (partyArray[0][0] == "Others") {
            return "orange";
        } else {
            return "#bfbfbf";
        }
    },

    //draw map according to settings
    drawSetting : function(opacity_setting, vote_setting, map, draw_function) {
        if (opacity_setting == false) {
            if (vote_setting == "SECOND VOTE") {
                map.selectAll("path").remove();
                draw_function(2, "SOLID");
            } else {
                if (vote_setting == "FIRST VOTE") {
                    map.selectAll("path").remove();
                    draw_function(1, "SOLID");
                }
            }
        } else {
            if (vote_setting == "SECOND VOTE") {
                map.selectAll("path").remove();
                draw_function(2, "DYNAMIC");
            } else {
                if (vote_setting == "FIRST VOTE") {
                    map.selectAll("path").remove();
                    draw_function(1, "DYNAMIC");
                }
            }
        }
    },
}
