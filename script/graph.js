let dimensions = {
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
  draw : function(data, search, vote, svg, container, results_container) {
    var result = data.filter(element =>{
      return element.includes(search);
    });

    var cdu = result[0][10 + functions.whichVote(vote)] * 100
        spd = result[0][14 + functions.whichVote(vote)] * 100
        linke = result[0][18 + functions.whichVote(vote)] * 100
        gruene = result[0][22 + functions.whichVote(vote)] * 100
        csu = result[0][26 + functions.whichVote(vote)] * 100
        fdp = result[0][30 + functions.whichVote(vote)] * 100
        afd = result[0][34 + functions.whichVote(vote)] * 100
        other = result[0][38 + functions.whichVote(vote)] * 100;

    var partyArray = [
      ["CDU", cdu],
      ["SPD", spd],
      ["Linke", linke],
      ["Grünen", gruene],
      ["CSU", csu],
      ["FDP", fdp],
      ["AfD", afd],
      ["Others", other]
    ];

    partyArray.sort(function(a, b) { //sorting from largest to smallest, takes first string
      return b[1] - a[1];
    });

    functions.removeZero(partyArray);

    //from inner to outer bracket: 1. largest value, 2. largest value + 10, 3. rounded to nearest 10
    var yMaxRounded = (Math.round( (Math.max(...functions.whichValue(partyArray, 1)) + 10)/10 )) * 10;

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

    //RESULTS
    results_container.selectAll("div").remove();

    for (var i = 0; i < partyArray.length; i++) {
      var party = results_container.append("div")
        .attr("id", partyArray[i][0])
        .attr("class", "party-result");

      party.append("div")
        .attr("class", `party-flair ${partyArray[i][0]}`);

      party.append("div")
        .attr("class", "party-name")
        .html(partyArray[i][0]);

      party.append("div")
        .attr("class", "percent-result")
    }
  }
}
