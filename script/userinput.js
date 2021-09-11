var userinput = {
    //drawing boxes above each inoput indicating party and party 1st votes in 2017 election
    drawParties : function(data, search, vote, container, region) {
        //this will automatically be ordered according to the order of the inputs on the html file
        var partyArray = electionData.getData(data, search, vote);

        for (var i = 0; i < partyArray.length; i++) {
            container.select(`#${region}input_` + partyArray[i][0])
                .append("div")
                .attr("class", `input-flair ${partyArray[i][0]}`)
                .append("span")
                .html(() => {
                    if (partyArray[i][1] !== 0) {
                        return functions.round(partyArray[i][1], 0) + "%";
                    } else {
                        return "N/A";
                    }
                });
        }
    },

    //get prediction arrays
    getInputArray : function(container, region) {
        var array = [];
        var parties = ["CDU", "SPD", "Linke", "Grünen", "CSU", "FDP", "AfD", "Others"];

        for (var i = 0; i < parties.length; i++) {
            var partyInput = container.select(`#${region}input_` + parties[i]).node().children[0].value;
            array.push(partyInput);
        }

        return array;
    },

    //function which gets the swing according to the userinput
    swing : function(data, search, vote, container, region, ignore, inputArray) {
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
            if (results[i][0] !== ignore && results[i][0] !== "Others") {
                var input = container.select(`#${region}input_` + results[i][0]).node().children[0];
                var difference = input.value - results[i][1];
                output[i].push(difference);
                output[i].push(input.value);
            } else {
                if (results[i][0] === "Others") {
                    var sum = 0;

                    for (var i = 0; i < inputArray.length; i++) {
                        inputArray.splice([i], 1, Number(inputArray[i]));
                    }
                    for (var i = 0; i < inputArray.length - 1; i++) {
                        if (isNaN(inputArray[i]) === false) {
                            sum+=inputArray[i]
                        }
                    }

                    output[i].push(100 - sum - results[i][1]);
                    output[i].push(`${100 - sum}`)
                } else {
                    output[i].push(0);
                    output[i].push("0");
                }
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
    },

    inputOnChange : function(region) {
        var container = event.target.parentElement.parentElement.parentElement;
        var inputArray = userinput.getInputArray(d3.select("#" + container.id), region);
        var sum = 0;

        for (var i = 0; i < inputArray.length; i++) {
            inputArray.splice([i], 1, Number(inputArray[i]));
        }
        for (var i = 0; i < inputArray.length - 1; i++) {
            if (isNaN(inputArray[i]) === false) {
                sum+=inputArray[i]
            }
        }

        if (sum < 100 || sum == 100) {
            if (sum < 0) {
                d3.select(`#${region}input_Others`).node().children[0].value = ">100";
            } else {
                d3.select(`#${region}input_Others`).node().children[0].value = 100 - sum;
            }
        } else {
            d3.select(`#${region}input_Others`).node().children[0].value = "<0";
        }
    },

    //check if all array values are 0 or if there is one string and invalidate the applyswing accordingly
    checkValues : function(array, warningContainer) {
        var isZero = 0;
        var isString = 0;
        var isLessZero = 0
        var sum = 0;

        for (var i = 0; i < array.length - 1; i++) {
            if (isNaN(Number(array[i])) === true) {
                isString++;
            } else {
                sum+=Number(array[i]);

                if (array[i] == 0) {
                    isZero++;
                } else {
                    if (array[i] < 0) {
                        isLessZero++;
                    }
                }
            }
        }

        //check if there is a value larger than zero or if array includes a string.
        if (isZero === array.length - 2 || isString > 1 || sum > 100 || isLessZero > 0) {
            /* warningContainer.html("")

            if (isString > 1) {
                warningContainer.html("ERROR: one of the predictions contains a letter or other symbol which is not a number!")
            }
            if (sum > 100) {
                warningContainer.html("ERROR: the prediction adds up to more than 100%!")
            }
            if (sum < 0) {
                warningContainer.html("ERROR: one of the prediction is less than 0%!")
            } */

            return true;
        } else {
            /* warningContainer.html("") */
            return false;
        }
    },

    //check if values add up to 100, change values accordingly whilst retaining overall shape, returning the fixed array
    checkSum : function(array) {
        //VERY IMPORTANT TO LEAVE OUT THE MINUS VALUES SO AS TO NOT CONFUSE THE SUM OF THE PREDICTION
        var output = [[], [], [], [], [], [], [], []];
        var sum = 0;
        var outsum = 0;

        for (var i = 0; i < array.length; i++) {
            if (array[i][1] < 0) {
                sum+=0;
            } else {
                sum+=array[i][1];
            }
        }

        if (sum != 100) {
            for (var i = 0; i < array.length; i++) {
                var realValue = array[i][1] / sum;//calculate real percentage which when added equals 100

                output[i].push(array[i][0]);//insert the parties
                output[i].push(realValue * 100);//insert real value
            }
            for (var i = 0; i < output.length; i++) {
                outsum+=output[i][1]
            }

            return output;
        } else {
            return array;
        }
    },

    //checks if this prediction is the same as last prediction
    isSame : function(prediction1, prediction2) {
        var samevalue = 0;

        if (prediction1.length !== 0 && prediction2.length !== 0) {
            for (var i = 0; i < prediction1[0].length; i++) {
                if (prediction1[0][i] === prediction2[0][i]) {
                    samevalue++;
                }
            }

            for (var i = 0; i < prediction1[1].length; i++) {
                if (prediction1[1][i] === prediction2[1][i]) {
                    samevalue++;
                }
            }
        } else {
            return false;
        }


        if (samevalue === prediction1[0].length + prediction1[1].length - 2) {
            return true;
        } else {
            return false;
        }
    },
}
