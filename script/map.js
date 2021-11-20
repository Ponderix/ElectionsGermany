var margin = {
    top: 0,
    left: 0,
    bottom: 20,
    right: 20
};

var map = {
    height: 850 - margin.top - margin.bottom,
    width: 950 - margin.left - margin.right,
    activeNode: {node: null, opacity: null}, // keep track of previous seat clicked so that it can be reset when next seat is clicked

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

    //on click zoom to path
    zoomTo: function(path, d, zoom) {
        var bounds = path.bounds(d),
            dx = bounds[1][0] - bounds[0][0], // width of path bound
            dy = bounds[1][1] - bounds[0][1], // height of path bound
            x = (bounds[0][0] + bounds[1][0]) / 2, // x coordinate of path centre
            y = (bounds[0][1] + bounds[1][1]) / 2, //y coordinate of path centre

            scale = Math.min(15, 0.7 / Math.max(dx / 562, dy / map.height)), // zoom only as far as scale factor 15, if more than that default back to 15
            translate = [map.width - scale * x, map.height - scale * y];

        mapSVG.transition()
            .delay(100)
            .duration(1000)
            .call(zoom.transform, d3.zoomIdentity.translate(translate[0] + 210, translate[1] - 4300).scale(scale));
    },

    //on click flash seat credit (c) 2021 principalfish
    flashSeat: function(event) {
        repeat();
        function repeat() {
            d3.select(event.target).transition()
                .duration(1000)
                .style("opacity", 0.2)
            .transition()
                .duration(1000)
                .style("opacity", event.target.style.opacity)
                .on("end", repeat);
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
