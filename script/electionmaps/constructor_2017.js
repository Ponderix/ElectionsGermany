var searchBtn = document.querySelector("#search_icon");
var searchBar = document.querySelector("#searchBar");
var predictButton = document.querySelector("#predict-button");
var expandBtn = document.querySelector("#expand_btn");
var results_container = d3.select("#results_container");
var vote = 1;
var defaultPartyOrder = ["CDU", "SPD", "Linke", "Grünen", "CSU", "FDP", "AfD", "Others"];

var mapSVG = d3.select("#map")
    .attr("height", map.height)
    .attr("width", map.width)
    .attr("preserveAspectRatio", "xMinYMin meet")
    .attr("viewBox", "500 -3825 " + map.width + " " + map.height);
var mapGroup = mapSVG.append("g")
    .attr("id", "wahlkreise");

var zoom = d3.zoom()
    .scaleExtent([0.7, 15])
    .on("zoom", functions.zoomed);

    mapSVG.call(zoom).on("dblclick.zoom", null);
    d3.select("#reset").on("click", () =>{
        if (map.activeNode.node != null) {
            d3.select("#" + (map.activeNode.node).id).transition()
                .style("opacity", map.activeNode.opacity);
        }
        map.activeNode.node = null;
        map.activeNode.opacity = null;

        mapSVG.transition()
            .duration(1000)
            .call(zoom.transform, d3.zoomIdentity);
        });

var projection = d3.geoMercator()
    .scale(3500);
var path = d3.geoPath()
    .projection(projection);

var graphSVG = d3.select("#graph")
    .attr("height", dimensions.container.height)
    .attr("width", dimensions.container.width)
    .style("cursor", "default");
var graphGroup = graphSVG.append("g")
    .attr("height", graph.height)
    .attr("width", graph.width)
    .attr("transform", `translate(${dimensions.margins.left}, ${dimensions.margins.top})`);

expandBtn.addEventListener("click", () =>{
    table.expand(expandBtn, document.querySelector("#table_body"));
});


// PROCESSING RESULTS AND MAP DATA //
d3.csv("../data/2017/wk_17_processed.csv", function(d) {

    return {
        "Name": d["Name"],
        "ID": +d["ID"],
        "Bundesland": d["Bundesland"],
        "VAP": +d["VAP"],
        "Total votes": +d["Total votes"],
        "Number of valid erst stimmen": +d["Number of valid erst stimmen"],
        "Number of valid zweit stimmen": +d["Number of valid zweit stimmen"],
        "Turnout": +d["Turnout"],
        "CDU Erst stimmen": ++d["CDU Erst stimmen"],
        "CDU Zweit stimmen": ++d["CDU Zweit stimmen"],
        "CDU % Erst stimmen": +d["CDU % Erst stimmen"],
        "CDU % Zweit stimmen": +d["CDU % Zweit stimmen"],
        "SPD Erst stimmen": +d["SPD Erst stimmen"],
        "SPD Zweit stimmen": +d["SPD Zweit stimmen"],
        "SPD % Erst stimmen": +d["SPD % Erst stimmen"],
        "SPD % Zweit stimmen": +d["SPD % Zweit stimmen"],
        "Linke Erst stimmen": +d["Linke Erst stimmen"],
        "Linke Zweit stimmen": +d["Linke Zweit stimmen"],
        "Linke % Erst stimmen": +d["Linke % Erst stimmen"],
        "Linke % Zweit stimmen": +d["Linke % Zweit stimmen"],
        "Grüne Erst stimmen": +d["Grüne Erst stimmen"],
        "Grüne Zweit stimmen": +d["Grüne Zweit stimmen"],
        "Grüne % Erst stimmen": +d["Grüne % Erst stimmen"],
        "Grüne % Zweit stimmen": +d["Grüne % Zweit stimmen"],
        "CSU Erst stimmen": +d["CSU Erst stimmen"],
        "CSU Zweit stimmen": +d["CSU Zweit stimmen"],
        "CSU % Erst stimmen": +d["CSU % Erst stimmen"],
        "CSU % Zweit stimmen": +d["CSU % Zweit stimmen"],
        "FDP Erst stimmen": +d["FDP Erst stimmen"],
        "FDP Zweit stimmen": +d["FDP Zweit stimmen"],
        "FDP % Erst stimmen": +d["FDP % Erst stimmen"],
        "FDP % Zweit stimmen": +d["FDP % Zweit stimmen"],
        "AfD Erst stimmen": +d["AfD Erst stimmen"],
        "AfD Zweit stimmen": +d["AfD Zweit stimmen"],
        "AfD % Erst stimmen": +d["AfD % Erst stimmen"],
        "AfD % Zweit stimmen": +d["AfD % Zweit stimmen"],
        "Other Erst stimmen": +d["Other Erst stimmen"],
        "Other Zweit stimmen": +d["Other Zweit stimmen"],
        "Other % Erst stimmen": +d["Other % Erst stimmen"],
        "Other % Zweit stimmen": +d["Other % Zweit stimmen"]
    }

}).then(function mainExecute(resultsData) {

    var rawDataArray = resultsData.map(Object.values); //RAW ARRAY WITH 2017 RESULTS
    var dataArray = resultsData.map(Object.values); //ARRAY WITH PREDICTED RESULTS


    d3.json("../data/2017/wahlkreise2017.topo.json").then(function(mapData) {

        var jsonArray = mapData.objects.wahlkreise.geometries;

        var lastInputArray = [];
        var thisInputArray = [];

        //drawing colored boxes over input to indicate party
        userinput.drawParties(rawDataArray, "Country-Wide", 2, d3.select("#input_national"), "nat_");
        userinput.drawParties(rawDataArray, "Bayern (BY)", 2, d3.select("#input_BY"), "BY_");


        //applying swing to the election map, executing the prediction.
        predictButton.addEventListener("click", () => {

            var nat_InputArray = userinput.getInputArray(d3.select("#input_national"), "nat_");
            var by_InputArray = userinput.getInputArray(d3.select("#input_BY"), "BY_");

            var nat_swingArray = userinput.swing(dataArray, "Country-Wide", 2, d3.select("#input_national"), "nat_", "CSU", nat_InputArray);
            var by_swingArray = userinput.swing(dataArray, "Bayern (BY)", 2, d3.select("#input_BY"), "BY_", "CDU", by_InputArray);

            thisInputArray.push(nat_InputArray);
            thisInputArray.push(by_InputArray);

            applyPrediction(1, -2);
            applyPrediction(2, -1);

            function applyPrediction(vote, constant) {
                var percentDataIndex = electionData.getIndex(functions.whichVote(vote)); // important so that it is known where to replace the results
                var votesDataIndex = electionData.getIndex(constant) // same as above except for voting tallys instead of the percent results

                for (var i = 0; i < dataArray.length; i++) {
                    var result = dataArray[i][0];
                    var partyArray = electionData.getData(dataArray, result, vote);

                    //the following if statement applies national swing to all districts outside of bavaria and bavarian swing to all districts inside of bavaria
                    if (dataArray[i][2] !== "BY" && result !== "Bayern (BY)" /*very important to include second if parameter because states do not have state IDs*/) { // changes data in non BY states with non BY swing array
                        if (userinput.checkValues(nat_InputArray, d3.select("#input-warning"), 0) == false && userinput.isSame(thisInputArray, lastInputArray) == false) {
                            userinput.applySwing(partyArray, nat_swingArray);
                        }
                    } else {
                        if (userinput.checkValues(by_InputArray, d3.select("#input-warning"), 1) == false && userinput.isSame(thisInputArray, lastInputArray) == false) {
                            userinput.applySwing(partyArray, by_swingArray);
                        }
                    }

                    var checkedPartyArray = userinput.checkSum(partyArray);

                    for (var ind = 0; ind < percentDataIndex.length; ind++) { //replacing the original PERCENT values prediction in the master array
                        dataArray[i].splice(percentDataIndex[ind][1], 1, checkedPartyArray[ind][1] / 100);
                    }

                    for (var ind = 0; ind < votesDataIndex.length; ind++) { // replacing  the original VOTE TALLIES with thee predicted vote tallies
                        var partyVotes = Math.round((checkedPartyArray[ind][1] / 100) * dataArray[i][4]);

                        if (partyVotes > 0) {
                            dataArray[i].splice(votesDataIndex[ind][1], 1, partyVotes);
                        } else {
                            dataArray[i].splice(votesDataIndex[ind][1], 1, 0);
                        }
                    }
                }

                //calculating the national results by adding up all the regional results
                userinput.calculateNational(dataArray, percentDataIndex, votesDataIndex, vote);
            }

            lastInputArray = [];
            thisInputArray = [];

            lastInputArray.push(nat_InputArray);
            lastInputArray.push(by_InputArray)

            //draw new map/table with changed data depending on vote and maptype selected
            function drawSettingPrediction(element) {
                if (element == "map") {
                    var selected_opacity = document.querySelector("#opacity-select").checked;
                    var selected_vote = document.querySelector("#map-select").value;

                    map.drawSetting(selected_opacity, selected_vote, mapGroup, drawMap);
                } else {
                    var selected_vote = document.querySelector("#table-select").value;

                    if (element == "table") {
                        if (selected_vote == "SECOND VOTE") {
                            drawTable(2)
                        } else {
                            if (selected_vote == "FIRST VOTE") {
                                drawTable(1)
                            }
                        }
                    }

                }
            }
            drawSettingPrediction("map");
            drawSettingPrediction("table");
        });


        //on map opacity change, draw new map according to which opacity is selected
        document.querySelector("#opacity-select").addEventListener("change", () =>{
            var selected_opacity = event.target.checked;
            var selected_vote = document.querySelector("#map-select").value;

            map.drawSetting(selected_opacity, selected_vote, mapGroup, drawMap);
        });
        //on map vote change, draw new map according to which vote is selected
        document.querySelector("#map-select").addEventListener("change", () =>{
            var selected_opacity = document.querySelector("#opacity-select").checked;
            var selected_vote = event.target.value;

            map.drawSetting(selected_opacity, selected_vote, mapGroup, drawMap);
        });


        function drawMap(function_vote, opacity) {//opacity can be SOLID or DYNAMIC
            map.activeNode.node = null;
            map.activeNode.opacity = null;

            mapGroup.selectAll("path")
                .data(topojson.feature(mapData, mapData.objects.wahlkreise).features) //retrieve wahlkreise boundary data
                .enter().append("path")
                .attr("d", path)
                .style("stroke-width", "0.4px")
                .style("stroke", (d, i) => {
                    return map.stroke(dataArray, jsonArray, function_vote, i);
                })
                .style("opacity", (d, i) => {
                    if (opacity == "SOLID") {
                        return 1;
                    } else {
                        if (opacity == "DYNAMIC") {
                            return map.opacity(dataArray, jsonArray, function_vote, i);
                        }
                    }
                })
                .attr("class", (d, i) => {
                    return map.class(dataArray, jsonArray, function_vote, i);
                })
                .attr("id", (d, i) =>{
                    return "wk_" + jsonArray[i].properties.WKR_NR;
                })
                .html((d, i) => { //wahlkreis name on hover
                    return "<title>" + jsonArray[i].properties.WKR_NR + ". " + jsonArray[i].properties.WKR_NAME + "</title>" //retrieve nth name from wahlkreise data
                })
                .on("click", (event, d) => {
                    if (map.activeNode.node != null) {
                        d3.select("#" + (map.activeNode.node).id).transition()
                            .style("opacity", map.activeNode.opacity);
                    }
                    if (map.activeNode.node != event.target) {
                        map.activeNode.node = event.target;
                        map.activeNode.opacity = event.target.style.opacity;
                    }

                    map.zoomTo(path, d, zoom);
                    map.flashSeat();

                    d3.select("#name") //wahlkreis name on click
                        .html(() => {
                            return "<span>" + d.properties.WKR_NR + ". </span>" + d.properties.WKR_NAME;
                        });

                    var result = electionData.getDistrict(dataArray, d.properties.WKR_NAME);
                    var partyArray = electionData.getData(dataArray, d.properties.WKR_NAME, function_vote);
                    var lastElectionArray = electionData.getData(rawDataArray, d.properties.WKR_NAME, function_vote);

                    graph.draw(result, partyArray, graphSVG, graphGroup, results_container, function_vote, lastElectionArray);
                });
        }
        (function() {//on page load draw map with selected vote and map type
            var selected_opacity = document.querySelector("#opacity-select").checked;
            var selected_vote = document.querySelector("#map-select").value;

            map.drawSetting(selected_opacity, selected_vote, mapGroup, drawMap);
        })();


        function drawTable(function_vote) {
            d3.select("#national-results").selectAll("div").remove(); //redrawing the table according to new result

            var wahlkreiseArray = table.getWahlkreise(dataArray, "ALL");
            var minimumSeatsArray = table.minimumSeats(dataArray, wahlkreiseArray);

            table.drawResults(dataArray, rawDataArray, "#national-results", "Country-Wide", wahlkreiseArray, minimumSeatsArray, function_vote);
        }
        drawTable(2);
        //on table vote change, draw new map according to which vote selected
        document.querySelector("#table-select").addEventListener("change", () =>{
            var selected_vote_map = event.target.value;

            if (selected_vote_map == "SECOND VOTE") {
                drawTable(2)
            } else {
                if (selected_vote_map == "FIRST VOTE") {
                    drawTable(1)
                }
            }
        });


        function drawDefault() {
            var yScale = d3.scaleLinear()
                .range([graph.height, 0])
                .domain([0, 50]);

            var xScale = d3.scaleBand()
                .range([0, graph.width])
                .domain(defaultPartyOrder)
                .padding(0.2);

            //drawing initial blank chart
            graphGroup.append("g")
                .attr("id", "yAxis")
                .attr("class", "axis")
                .attr("transform", `translate(20, 0)`)
                .call(d3.axisLeft(yScale));

            graphGroup.append("g")
                .attr("id", "xAxis")
                .attr("class", "axis")
                .attr("transform", `translate(20, ${graph.height})`)
                .call(d3.axisBottom(xScale));
        }
        drawDefault();//drawing default graph axis


        //on click graph
        searchBtn.addEventListener("click", () => {
            if (searchBar.value === "") {
                return null;
            } else {
                var selected_vote = document.querySelector("#map-select").value;
                var result = electionData.getDistrict(dataArray, searchBar.value);

                d3.select("#name") //wahlkreis name on click
                    .html(() => {
                        return "<span>" + result[0][1] + ". </span>" + result[0][0]
                    });

                if (selected_vote == "SECOND VOTE") {
                    var partyArray = electionData.getData(dataArray, searchBar.value, 2);
                    var lastElectionArray = electionData.getData(rawDataArray, searchBar.value, 2);

                    graph.draw(result, partyArray, graphSVG, graphGroup, results_container, 2, lastElectionArray);
                } else {
                    if (selected_vote == "FIRST VOTE") {
                        var partyArray = electionData.getData(dataArray, searchBar.value, 1);
                        var lastElectionArray = electionData.getData(rawDataArray, searchBar.value, 1);

                        graph.draw(result, partyArray, graphSVG, graphGroup, results_container, 1, lastElectionArray);
                    }
                }
            }
        });

        searchBar.addEventListener("keyup", function(event) {
            if (event.keyCode === 13) {
                if (searchBar.value === "") {
                    return null;
                } else {
                    var selected_vote = document.querySelector("#map-select").value;
                    var result = electionData.getDistrict(dataArray, searchBar.value);

                    d3.select("#name") //wahlkreis name on click
                        .html(() => {
                            return "<span>" + result[0][1] + ". </span>" + result[0][0]
                        });

                    if (selected_vote == "SECOND VOTE") {
                        var partyArray = electionData.getData(dataArray, searchBar.value, 2);
                        var lastElectionArray = electionData.getData(rawDataArray, searchBar.value, 2);

                        graph.draw(result, partyArray, graphSVG, graphGroup, results_container, 2, lastElectionArray);
                    } else {
                        if (selected_vote == "FIRST VOTE") {
                            var partyArray = electionData.getData(dataArray, searchBar.value, 1);
                            var lastElectionArray = electionData.getData(rawDataArray, searchBar.value, 1);

                            graph.draw(result, partyArray, graphSVG, graphGroup, results_container, 1, lastElectionArray);
                        }
                    }
                }
            }
        });

    });
});
