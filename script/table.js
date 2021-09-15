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

    getWahlkreise : function(data, stateID) {
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

        var tempwahlkreise = [];

        //pushing all parties which came first place into one temparray
        for (var i = 17; i < data.length; i++) {
            if (stateID == "ALL") { //if countrywide then take all wahlkreise
                let partyArray = electionData.getData(data, data[i][0], 1);
                partyArray.sort((a, b) =>{
                    return b[1] - a[1]
                });

                tempwahlkreise.push(partyArray[0][0]);
            } else {
                if (stateID == data[i][2]) { // if not then check if wahlkreis has state ID and don/do select wahlkreis
                    let partyArray = electionData.getData(data, data[i][0], 1);

                    partyArray.sort((a, b) =>{
                        return b[1] - a[1]
                    });

                    tempwahlkreise.push(partyArray[0][0]);
                }
            }
        }

        //scanning temp array for all items (wahlkreise) where certain party won and counting them
        for (var i = 0; i < output.length; i++) {
            var counter = 0;

            for (var ind = 0; ind < tempwahlkreise.length; ind++) {
                if (tempwahlkreise[ind] == output[i]) {
                    counter++;
                }
            }

            output[i].push(counter);

            counter = 0;
        }

        return output;

    },

    getSeats : function(data) {
        console.log(data);
        var seatsPerStateArray = [
            ["SH", 22],
            ["MV", 13],
            ["HH", 12],
            ["NI", 59],
            ["HB", 5],
            ["BB", 20],
            ["ST", 17],
            ["BE", 24],
            ["NW", 128],
            ["SN", 32],
            ["HE", 43],
            ["TH", 17],
            ["RP", 30],
            ["BY", 93],
            ["BW", 76],
            ["SL", 7],
        ];
        var seatsEntitledArray = [// output array
            ["CDU", ],
            ["SPD", ],
            ["Linke", ],
            ["Grünen", ],
            ["CSU", ],
            ["FDP", ],
            ["AfD", ],
            ["Others", ]
        ]

        //calculating how many seats each party is entitled to
        for (var ind = 0; ind < 16; ind++) {// in each state

            //calculating how many seats each party would have gotten in each state according to PV
            var indSTATES = ind + 1;
            var seatSum = 0;
            var checkArray = [
                [],
                [],
                [],
                [],
                [],
                [],
                [],
                [],
                ["TOTAL", ],
                ["Party", "Seats", "Representation number", "Percent", "Wahlkreise"],
            ];

            var wahlkreiseArray = table.getWahlkreise(data, seatsPerStateArray[ind][0]);

            var votesCast = data[indSTATES][6] // total turnout in x[ind] state
            var seatsInState = seatsPerStateArray.filter((e) => {
                if (data[indSTATES][0].includes(e[0])) {//if name includes state ID then return theri entitled seat amount
                    return e;
                }
            });

            for (var i = 0; i < seatsEntitledArray.length; i++) { // for each party
                var partyVote = data[indSTATES][i*4+9]; // vote of x[i] party in x[ind] state
                var seats = Math.round(partyVote/votesCast * seatsInState[0][1]); //amount of seats party would have got in state if following pop vote in state
                var representationNumber = Math.round(partyVote/votesCast * seatsInState[0][1]) - partyVote/votesCast * seatsInState[0][1]; //difference between seats they should get if seats could be divded into decimals and seats they have

                checkArray[i].push(seatsEntitledArray[i][0]);// party name
                checkArray[i].push(seats);// seats in state
                checkArray[i].push(representationNumber);// under/over represented
                checkArray[i].push(partyVote/votesCast * 100);// votes in state
                checkArray[i].push(wahlkreiseArray[i][1]);// wahlkreise in state

                seatSum+=checkArray[i][1];
            }
            checkArray[8].push(seatSum);


            if (seatSum > seatsPerStateArray[ind][1]) {//if one seat needs to be taken away
                checkArray[8].push("Should have: " + seatsPerStateArray[ind][1]);

                functions.assignSeat(checkArray, "OVER");
            } else {
                if (seatSum < seatsPerStateArray[ind][1]) {//if one seat needs to be assigned:
                    checkArray[8].push(seatsPerStateArray[ind][1]);

                    functions.assignSeat(checkArray, "UNDER");
                }
            }
            console.log(checkArray);
            sum = 0;



            //adding the seats together along with wahlkreise seats if party got more wahlkreise in state
            for (var i = 0; i < checkArray.length - 2; i++) {
                if (checkArray[i][4] > checkArray[i][1]) {//if party had more wahlkreise in state than they should have,
                    console.log("MORE");//add this number to the minimum seats for x party
                } else { //if not
                    console.log("LESS");//add the seats they should have recieved
                }
            }
        }

        return null;
    },

    //draw table for national election results
    drawResults : function(data, container, region, wahlkreiseArray, vote) {
        var result = electionData.getDistrict(data, region);
        var partyArray = electionData.getData(data, region, vote);
        var div = d3.select(container);

        for (var i = 0; i < partyArray.length; i++) {
            partyArray[i].push(wahlkreiseArray[i][1]);
        }

        partyArray.sort((a, b) => {
            return b[1] - a[1];
        });

        for (var i = 0; i < partyArray.length; i++) {

            let party = div.append("div")
                .attr("id", `${partyArray[i][0]}-table`)
                .attr("class", `table-party border-${partyArray[i][0]}`)
                .style("border-color", null);

            //party logo
            if (partyArray[i][0] != "Others") {
                party.append("img")
                    .attr("src", `../assets/logos/${partyArray[i][0]}.svg`)
                    .attr("class", "party-logo party-info-value")
                    .attr("title", partyArray[i][0]);
            } else {
                party.append("span")
                    .attr("id", "other-parties-visual")
                    .html("Oth.")
                    .attr("title", partyArray[i][0]);
            }

            //drawing the % results
            party.append("div")
                .attr("class", "table-percent-result party-info-value")
                .html(() =>{
                    return `<span>${functions.round(partyArray[i][1], 2)}%</span> (+X)`;
                });

            //counting how many wahlkreise per party
            party.append("div")
                .attr("class", "table-wahlkreise-result party-info-value")
                .html(() =>{
                    return partyArray[i][2] + " (+X)";
                });
        }
    },
}
