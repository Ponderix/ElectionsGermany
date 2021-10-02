var table = {
    //function which expands or despands the "ELECTION RESULTS" tab on click
    expand : function(arrow, element) {
        if (element.classList[0] == "bodyactive") {
            arrow.children[0].classList = "arrow left";
            element.classList = "bodyinactive body";
        } else {
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

    minimumSeats : function(data) {
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
        var output = [
            ["CDU", 0],
            ["SPD", 0],
            ["Linke", 0],
            ["Grünen", 0],
            ["CSU", 0],
            ["FDP", 0],
            ["AfD", 0],
            ["Others", 0],
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
                ["TOTAL", ],
                ["Party", "Seats", "Representation number", "Percent", "Wahlkreise"],
            ];

            var votesCast = data[indSTATES][6] - data[indSTATES][37]// votes in x[ind] state minus votes the other parties
            var seatsInState = seatsPerStateArray.filter((e) => {
                if (data[indSTATES][0].includes(e[0])) {//if name includes state ID then return theri entitled seat amount
                    return e;
                }
            });

            //create array of seats in state according to party vote share
            for (var i = 0; i < output.length; i++) { // for each party
                var wahlkreiseArray = table.getWahlkreise(data, seatsPerStateArray[ind][0]);//wahlkreise in each state
                var partyVote = data[indSTATES][i*4+9]; // vote of x[i] party in x[ind] state
                var seats = Math.round(partyVote/votesCast * seatsInState[0][1]); //amount of seats party would have got in state if following pop vote in state
                var representationNumber = Math.round(partyVote/votesCast * seatsInState[0][1]) - partyVote/votesCast * seatsInState[0][1]; //difference between seats they should get if seats could be divded into decimals and seats they have

                checkArray[i].push(
                    output[i][0], // party name
                    seats, // party seats in state
                    representationNumber, // how much seats they should have if seats could be divided into decimals
                    partyVote/votesCast * 100,  // votei in state
                    wahlkreiseArray[i][1] // wahlkreise in state
                );

                seatSum+=checkArray[i][1]; // find total amount of seats assigned
            }
            checkArray[7].push(seatSum);

            //check if state has too many or too little seats through largest remainder methdo
            if (seatSum > seatsPerStateArray[ind][1]) {//if one seat needs to be taken away
                checkArray[7].push(seatsPerStateArray[ind][1]);

                functions.assignSeat(checkArray, "OVER");
            } else {
                if (seatSum < seatsPerStateArray[ind][1]) {//if one seat needs to be assigned:
                    checkArray[7].push(seatsPerStateArray[ind][1]);

                    functions.assignSeat(checkArray, "UNDER");
                }
            }
            sum = 0;

            //adding the seats together along with wahlkreise seats if party got more wahlkreise in state
            for (var i = 0; i < checkArray.length - 2; i++) {
                if (checkArray[i][4] > checkArray[i][1]) {//if party had more wahlkreise in state than they should have,
                    output[i].splice(1, 1, output[i][1] + checkArray[i][4]);//add this number to the minimum seats for x party
                } else { //if not
                    output[i].splice(1, 1, output[i][1] + checkArray[i][1]); //add the seats they should have recieved
                }
            }
        }
        var wahlkreiseNational = table.getWahlkreise(data, "ALL");//wahlkreise country wide
        output[7].splice(1, 1, wahlkreiseNational[7][1]);
        return output;
    },

    totalSeats : function(data, minimumSeats) {
        var output = [
            ["CDU", ],
            ["SPD", ],
            ["Linke", ],
            ["Grünen", ],
            ["CSU", ],
            ["FDP", ],
            ["AfD", ],
            ["Others", ],
            ["Total", ]
        ];
        var array = electionData.getData(data, "Country-Wide", 2);
        var raw_seatnumber;//seat number (without independents/other)

        array[7].splice(1, 1, 0); // "Other" parties are removed
        var majorPartyArray = userinput.checkSum(array);

        for (var i = 0; i < majorPartyArray.length; i++) {
            majorPartyArray[i].push(minimumSeats[i][1]); // combining arrays so its easier to process
        }

        for (var i = 0; i < Infinity; i++) {
            var yes = 0;

            for (var ind = 0; ind < majorPartyArray.length - 1; ind++) { //for each party
                if (majorPartyArray[ind][2]/i < majorPartyArray[ind][1]/100) { //if minimum seats / seat amount = party vote
                    yes++; //add 1 to the correct counter
                } else {
                    if (majorPartyArray[ind][1] <= 0) {//if party recieved 0 popular vote ignore
                        yes++;
                    }
                }
            }

            if (yes == 7) { //if all parties get their pop vote sharre
                if (i > 598) {// needed due to there being a minimum of 598 seats
                    raw_seatnumber = i;
                } else {
                    raw_seatnumber = 598
                }

                break; //break loop
            }
        }

        for (var i = 0; i < output.length - 1; i++) {
            if (output[i][0] != "Others") {
                output[i].push(Math.round(majorPartyArray[i][1]/100*raw_seatnumber));
            } else {
                output[i].push(majorPartyArray[i][2]);//if "others", push minimum seats. This is because others is not a party but just a set of minor parties
            }
        }

        //this step is nescessary since sometime the seat totals dont add up as a consequence of classical rounding
        var total = 0
        for (var i = 0; i < output.length - 1; i++) {
            total+=output[i][1];
        }
        output[8].push(total + majorPartyArray[7][2]);

        return output;
    },

    //draw table for national election results
    drawResults : function(data, realData, container, region, wahlkreiseArray, minimumSeats, vote) {
        var result = electionData.getDistrict(data, region);

        var partyArray = electionData.getData(data, region, vote); //predict results
        var realPartyArray = electionData.getData(realData, region, vote); //2017 results

        var div = d3.select(container);
        var seats = this.totalSeats(data, minimumSeats);

        for (var i = 0; i < partyArray.length; i++) {
            // add=> whalkreise won, seats, last electio result
            partyArray[i].push(wahlkreiseArray[i][1], seats[i][1], realPartyArray[i][1]);
        }

        partyArray.sort((a, b)=> {
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
                    var swing = partyArray[i][1] - partyArray[i][4];

                    return `${functions.round(partyArray[i][1], 2)}% <span>(${functions.round(swing, 2)}%)</span>`;
                });

            //counting how many wahlkreise per party
            party.append("div")
                .attr("class", "table-wahlkreise-result party-info-value")
                .html(() =>{
                    return partyArray[i][2] + "<span> (±XX)</span>";
                });

            //counting how many seats per party
            party.append("div")
                .attr("class", "table-seat-result party-info-value")
                .html(() =>{
                    return partyArray[i][3] + "<span> (±XX)</span>";
                });
        }

        var totals = d3.select("#totals-seats");
        totals.html(seats[8][1] + " <br><span>EXPERIMENTAL! Does not fully work yet.</span>")
            .style("left", 20)
    },
}
