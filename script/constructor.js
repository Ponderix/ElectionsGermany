
var btn = document.querySelector(".search_icon");
var input = document.querySelector("#searchBar");
var results_container = d3.select("#results_container");
var defaultPartyOrder = ["CDU", "SPD", "Linke", "Grünen", "CSU", "FDP", "AfD", "Others"];

var zoom = d3.zoom()
  .scaleExtent([0.7, 15])
  .on("zoom", functions.zoomed);

var mapSVG = d3.select("#map")
  .attr("height", map.height)
  .attr("width", map.width)
  .attr("preserveAspectRatio", "xMinYMin meet")
  .attr("viewBox", "760 -3850 " + map.width + " " + map.height);
var mapGroup = mapSVG.append("g")
  .attr("id", "wahlkreise");

mapSVG.call(zoom).on("dblclick.zoom", null);

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



// PROCESSING RESULTS AND MAP DATA //
d3.csv("../data/wk_17_processed.csv", function(d) {

  return {
    "Name" : d["Name"],
    "ID" : +d["ID"],
    "Bundesland" : d["Bundesland"],
    "VAP" : +d["VAP"],
    "Total votes" : +d["Total votes"],
    "Number of valid erst stimmen" : +d["Number of valid erst stimmen"],
    "Number of valid zweit stimmen" : +d["Number of valid zweit stimmen"],
    "Turnout" : +d["Turnout"],
    "CDU Erst stimmen" : ++d["CDU Erst stimmen"],
    "CDU Zweit stimmen" : ++d["CDU Zweit stimmen"],
    "CDU % Erst stimmen" : +d["CDU % Erst stimmen"],
    "CDU % Zweit stimmen" : +d["CDU % Zweit stimmen"],
    "SPD Erst stimmen" : +d["SPD Erst stimmen"],
    "SPD Zweit stimmen" : +d["SPD Zweit stimmen"],
    "SPD % Erst stimmen" : +d["SPD % Erst stimmen"],
    "SPD % Zweit stimmen" : +d["SPD % Zweit stimmen"],
    "Linke Erst stimmen" : +d["Linke Erst stimmen"],
    "Linke Zweit stimmen" : +d["Linke Zweit stimmen"],
    "Linke % Erst stimmen" : +d["Linke % Erst stimmen"],
    "Linke % Zweit stimmen" : +d["Linke % Zweit stimmen"],
    "Grüne Erst stimmen" : +d["Grüne Erst stimmen"],
    "Grüne Zweit stimmen" : +d["Grüne Zweit stimmen"],
    "Grüne % Erst stimmen" : +d["Grüne % Erst stimmen"],
    "Grüne % Zweit stimmen" : +d["Grüne % Zweit stimmen"],
    "CSU Erst stimmen" : +d["CSU Erst stimmen"],
    "CSU Zweit stimmen" : +d["CSU Zweit stimmen"],
    "CSU % Erst stimmen" : +d["CSU % Erst stimmen"],
    "CSU % Zweit stimmen" : +d["CSU % Zweit stimmen"],
    "FDP Erst stimmen" : +d["FDP Erst stimmen"],
    "FDP Zweit stimmen" : +d["FDP Zweit stimmen"],
    "FDP % Erst stimmen" : +d["FDP % Erst stimmen"],
    "FDP % Zweit stimmen" : +d["FDP % Zweit stimmen"],
    "AfD Erst stimmen" : +d["AfD Erst stimmen"],
    "AfD Zweit stimmen" : +d["AfD Zweit stimmen"],
    "AfD % Erst stimmen" : +d["AfD % Erst stimmen"],
    "AfD % Zweit stimmen" : +d["AfD % Zweit stimmen"],
    "Other Erst stimmen" : +d["Other Erst stimmen"],
    "Other Zweit stimmen" : +d["Other Zweit stimmen"],
    "Other % Erst stimmen" : +d["Other % Erst stimmen"],
    "Other % Zweit stimmen" : +d["Other % Zweit stimmen"]
  }

}).then(function(resultsData) {

  var dataArray = resultsData.map(Object.values);

  d3.json("../data/Wahlkreise_map.topo.json").then(function(mapData) {

    var vote = 1;
    var jsonArray = mapData.objects.wahlkreise.geometries;

    mapGroup.selectAll("path")
         .data(topojson.feature(mapData, mapData.objects.wahlkreise).features) //retrieve wahlkreise boundary data
         .enter().append("path")
          .attr("d", path)
          .style("stroke-width", "0.4px")
          .style("stroke", "#bfbfbf")
          .attr("class", (d, i) =>{
            return map.class(dataArray, jsonArray, vote, i);
          })
          .html((d, i) =>{ //wahlkreis name on hover
            return "<title>" + jsonArray[i].properties.WKR_NR + ". " + jsonArray[i].properties.WKR_NAME + "</title>" //retrieve nth name from wahlkreise data
          })
          .on("click", (d, i) =>{
            d3.select("#name") //wahlkreis name on click
              .html(() =>{
                return "<span>" + i.properties.WKR_NR + ". </span>" + i.properties.WKR_NAME;
              });
            graph.draw(dataArray, i.properties.WKR_NAME, vote, graphSVG, graphGroup, results_container);
          });


    //GRAPH//

    //default x and y scales
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

    //on click graph
    btn.addEventListener("click", () =>{
      if (input.value === "") {
        return null;
      } else {
        graph.draw(dataArray, input.value, vote, graphSVG, graphGroup, results_container);
        graph.write(jsonArray, input.value, "#name");
      }
    });

    input.addEventListener("keyup", function (event) {
      if (event.keyCode === 13) {
        if (input.value === "") {
          return null;
        } else {
          graph.draw(dataArray, input.value, vote, graphSVG, graphGroup, results_container);
          graph.write(jsonArray, input.value, "#name");
        }
      }
    });

  });
});
