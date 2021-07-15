var dimensions = {
  margins : {top: 15, right: 15, bottom: 20, left: 15},
  container : {height: 375, width: 450},
}
var graph = {
  height : dimensions.container.height - dimensions.margins.top - dimensions.margins.bottom,
  width : dimensions.container.width - dimensions.margins.left - dimensions.margins.right,

  //writing name graph container
  write : function(data, search, container) {
    var result = data.filter((e, i) =>{
        return data[i].properties.WKR_NAME === search; //filter for array wkrname same as search bar input
    });

    if (result.length > 0) {
      d3.select(container) //wahlkreis name if array includes anything
        .html(() =>{
          return "<span>" + result[0].properties.WKR_NR + ". </span>" + result[0].properties.WKR_NAME;
        });
    } else {
      return null;
    }
  },

  //drawing graph
  draw : function(result, partyArray, svg, container, results_container) {

    var rawVotes = result[0].filter((e, index) =>{
      for (var i = 1; i < result[0].length; i++) {
        if (index == i * 4 + 4) {
          return e;
        }
      }
    });

    var eligibleVoters = result[0][3]
        votesCast = result[0][4];
    var margin = functions.getMargin(rawVotes);

    functions.removeZero(partyArray, 1); //ordering to remove parties which dont run

    //functions.removeZero(partyArray, 1); // second ordering to re-adjust the changed array

    var yMaxRounded = functions.round((Math.max(...functions.whichValue(partyArray, 1)) + 10), -1);


    //redefining chart axis on click according to data
    yScale = d3.scaleLinear()
      .range([graph.height, 0])
      .domain([0, yMaxRounded]);
    xScale = d3.scaleBand()
      .range([0, graph.width])
      .domain(functions.whichValue(partyArray, 0))
      .padding(0.025);

    //removing and redrawing axis
    svg.select("#yAxis").remove();
    svg.select("#xAxis").remove();

    container.append("g")
      .attr("id", "yAxis")
      .attr("class", "axis")
      .attr("transform", `translate(20, 0)`)
      .call(d3.axisLeft(yScale));

    container.append("g")
      .attr("id", "xAxis")
      .attr("class", "axis")
      .attr("transform", `translate(20, ${graph.height})`)
      .call(d3.axisBottom(xScale));


    //drawing the bars
    svg.selectAll("rect").remove();

    svg.selectAll("rect")
      .data(partyArray) //important that all data needed for the chart is included in this array
      .enter()
      .append("rect")
        .attr("class", (r) =>{return r[0]})
        .attr("x", (r) => xScale(r[0]) + 35)
        .attr("width", xScale.bandwidth())
        .attr("y", (r) => yScale(-1.7))
        .attr("height", (r) => graph.height - yScale(0)) //has to equal 0 at start for animation to load from bottom up
        .transition() //loading animation
          .delay((d, i) =>{return i * 50})
          .duration(400)
          .attr("y", (r) =>{
            return yScale(r[1]) + 14.5;
          })
          .attr("height", (r) => graph.height - yScale(r[1]));

    //RESULTS & TURNOUT
    results_container.selectAll("div").remove();

    var states = [
      ["SH" , "Schleswig-Holstein"],
      ["MV" , "Mecklenburg-Vorpommern"],
      ["HH" , "Hamburg"],
      ["NI" , "Niedersachsen"],
      ["HB" , "Bremen"],
      ["BB" , "Brandenburg"],
      ["ST" , "Sachsen-Anhalt"],
      ["BE" , "Berlin"],
      ["NW" , "Nordrhein-Westpfalen"],
      ["SN" , "Sachsen"],
      ["HE" , "Hessen"],
      ["TH" , "Thüringen"],
      ["RP" , "Rhineland-Pfalz"],
      ["BY" , "Bayern"],
      ["BW" , "Baden-Württemberg"],
      ["SL" , "Saarland"]
    ]

    var party_info = results_container.append("div")
      .attr("class", "party-info");

    for (var i = 0; i < partyArray.length; i++) {
      var shortenedResult = functions.round(partyArray[i][1], 2);
      var party = party_info.append("div");

      party.attr("id", partyArray[i][0])
        .attr("class", "party-result");

      party.append("div")
        .attr("class", `party-flair ${partyArray[i][0]}`);

      party.append("div")
        .attr("class", "party-name")
        .html(partyArray[i][0]);

      party.append("div")
        .attr("class", "percent-result")
        .html(shortenedResult + " %");
    }

    party_info.append("div")
      .attr("id", "turnout-info")
      .html("Turnout: " + functions.round((votesCast / eligibleVoters) * 100, 2) + "%");

    var seat_info = results_container.append("div")
      .attr("class", "seat-info");

    seat_info.append("div")
      .attr("id", "margin-info")
      .html(`Margin of victory: <span>${margin} (${functions.round(margin / result[0][4] * 100, 2)}%)</span>`);

    seat_info.append("div")
      .attr("id", "state-info")
      .html(() =>{
        for (var i = 0; i < states.length; i++) {
          if (result[0][2] == states[i][0]) {
            return states[i][1];
          }
        }
      });
  }
}
