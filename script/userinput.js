var userinput = {
    //drawing boxes above each inoput indicating party and party 1st votes in 2017 election
    drawParties: function(data, search, vote, container, region) {
        //this will automatically be ordered according to the order of the inputs on the html file
        var results = electionData.getData(data, search, vote);

        for (var i = 0; i < results.length; i++) {
            container.select(`#${region}input_` + results[i][0])
                .append("div")
                .attr("class", `input-flair ${results[i][0]}`)
                .append("span")
                .html(() => {
                    if (results[i][1] !== 0) {
                        return functions.round(results[i][1], 0) + "%";
                    } else {
                        return "N/A";
                    }
                });
        }
    },

    //function which gets the swing according to the userinput
    swing: function(data, search, vote, container, region, ignore) {
        var output = [
            ["CDU"],
            ["SPD"],
            ["Linke"],
            ["Grünen"],
            ["CSU"],
            ["FDP"],
            ["AfD"],
            ["Others"]
        ];

        var results = electionData.getData(data, search, vote);

        for (var i = 0; i < results.length; i++) {
            //check if result is party not running in region, e.g CDU in bavaria should NOT be possible
            if (results[i][0] !== ignore) {
                var input = container.select(`#${region}input_` + results[i][0]).node().children[0];
                var difference = input.value - results[i][1];
                output[i].push(difference);
                output[i].push(input.value);
            } else {
                output[i].push(0);
                output[i].push("0");
            }
        }

        return output;
    },

    //apply swing to an array of party
    applySwing : function(array, swing) {
        for (var index = 0; index < array.length; index++) {
            let prediction = array[index][1] + swing[index][1]; //add national swing of party to result in district
            array[index].splice(1, 1, prediction); //replace the predicted numbers with the originial numbers
        }
    }
}
