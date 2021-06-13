
//margins and dimensions for map
let margin = {
  top: 0,
  left: 0,
  bottom: 20,
  right: 20
};
var map = {
  height: 850 - margin.top - margin.bottom,
  width: 750 - margin.left - margin.right,
}

var svg = d3.select("#map")
  .attr("height", map.height)
  .attr("width", map.width)
  .attr("preserveAspectRatio", "xMinYMin meet")
  .attr("viewBox", "760 -3850 " + map.width + " " + map.height);

var g = svg.append("g")
  .attr("id", "wahlkreise");

var projection = d3.geoMercator()
  .scale(3500);

var path = d3.geoPath()
  .projection(projection);

var btn = document.querySelector(".search_icon");
var input = document.querySelector("#searchBar");





// PROCESSING RESULTS AND MAP DATA //
d3.csv("../data/wk_17_processed.csv", function(d) {

  //string values to numerical values if applicable
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

}).then(function(data) {


  // objects to arrays for easier manipulation and referencing
  var dataArray = data.map(Object.values);

  //map
  d3.json("../data/Wahlkreise_map.topo.json").then(function(mapData) {
    //selecting first or second vote
    function whichVote(n) {
      if (n != 1 && n != 2 ) {
        return 0;
      } else {
        return n - 1;
      }
    }
    var vote = 1;

    var jsonArray = mapData.objects.wahlkreise.geometries;

    var defaultPartyOrder = ["CDU", "SPD", "Linke", "Grünen", "CSU", "FDP", "AfD", "Others"];



    let dimensions = {
      margins: {"top": 15, "right": 15, "bottom": 20, "left": 15},
      container: {"height": 375, "width": 450},
    }
    var graph = {
      height: dimensions.container.height - dimensions.margins.top - dimensions.margins.bottom,
      width: dimensions.container.width - dimensions.margins.left - dimensions.margins.right,

      write: function() {

        let searchResult = jsonArray.filter((e, i) =>{
            return jsonArray[i].properties.WKR_NAME === input.value; //filter for array wkrname same as search bar input
        });

        if (searchResult.length > 0) {
          d3.select("#name") //wahlkreis name if array includes anything
            .html(() =>{
              return "<span>" + searchResult[0].properties.WKR_NR + ". </span>" + searchResult[0].properties.WKR_NAME;
            });
        } else {
          return null;
        }

      },

      draw: function(wahlkreis) {
              var result = dataArray.filter(element =>{
                return element.includes(wahlkreis);
              });

              //getting erst stimmen results for each party and multiplying by 100
              var cdu = result[0][10 + whichVote(vote)] * 100
                  spd = result[0][14 + whichVote(vote)] * 100
                  linke = result[0][18 + whichVote(vote)] * 100
                  gruene = result[0][22 + whichVote(vote)] * 100
                  csu = result[0][26 + whichVote(vote)] * 100
                  fdp = result[0][30 + whichVote(vote)] * 100
                  afd = result[0][34 + whichVote(vote)] * 100
                  other = result[0][38 + whichVote(vote)] * 100;

              //creating array with the vote share, party name and party color
              var unsortedPartyArray = [
                ["CDU", cdu, "#000000"],
                ["SPD", spd, "#EB001F"],
                ["Linke", linke, "#BE3075"],
                ["Grünen", gruene, "#64A12D"],
                ["CSU", csu, "#202257"],
                ["FDP", fdp, "#FFED00"],
                ["AfD", afd, "#009EE0"],
                ["Others", other, "#5e5e5e"]
              ];

              //sorting array from largest to smallest
              var sortedPartyArray = unsortedPartyArray.sort(function(a, b) { //sorting from largest to smallest, takes first string
                return b[1] - a[1];
              });

                //differentiating between the results and the party
                var percentOnlySortedArray = [sortedPartyArray[0][1], sortedPartyArray[1][1], sortedPartyArray[2][1], sortedPartyArray[3][1], sortedPartyArray[4][1], sortedPartyArray[5][1], sortedPartyArray[6][1], sortedPartyArray[7][1]]
                var partiesOnlySortedArray = [sortedPartyArray[0][0], sortedPartyArray[1][0], sortedPartyArray[2][0], sortedPartyArray[3][0], sortedPartyArray[4][0], sortedPartyArray[5][0], sortedPartyArray[6][0], sortedPartyArray[7][0]];

                //removing parties with "0"
                var index = percentOnlySortedArray.indexOf(0);
                if (index > -1) {
                  percentOnlySortedArray.splice(index, 7);
                  partiesOnlySortedArray.splice(index, 7);
                }

              //max value +10 rounded to the nearest 10 to get height of the chart
              var maxResult = Math.max(...percentOnlySortedArray);
              var yMaxRaw = (maxResult + 10); //highest value of dataset + 10
              var yMaxRounded = (Math.round(yMaxRaw/10)) * 10; //rounded to nearest 10

              //redefining chart axis on click according to data
              yScale = d3.scaleLinear()
                .range([graph.height, 0])
                .domain([0, yMaxRounded]);
              xScale = d3.scaleBand()
                .range([0, graph.width])
                .domain(partiesOnlySortedArray)
                .padding(0.025);

              //removing and redrawing axis
              graphSVG.select("#yAxis").remove();
              graphSVG.select("#xAxis").remove();

              chart.append("g")
                .attr("id", "yAxis")
                .attr("class", "axis")
                .attr("transform", `translate(20, 0)`)
                .call(d3.axisLeft(yScale));

              chart.append("g")
                .attr("id", "xAxis")
                .attr("class", "axis")
                .attr("transform", `translate(20, ${graph.height})`)
                .call(d3.axisBottom(xScale));


              //drawing the bars
              graphSVG.selectAll("rect").remove();

              graphSVG.selectAll("rect")
                .data(sortedPartyArray) //important that all data needed for the chart is included in this array
                .enter()
                .append("rect")
                  .attr("fill", (r) =>{return r[2]})
                  .attr("x", (r) => xScale(r[0]) + 35)
                  .attr("width", xScale.bandwidth())
                  .attr("y", (r) => yScale(-1.7))
                  .attr("height", (r) => graph.height - yScale(0)); //has to equal 0 at start for animation to load from bottom up

              //loading animation
              graphSVG.selectAll("rect")
                .attr("height", 0)
                .transition()
                  .delay((d, i) =>{return i*50})
                  .duration(400)
                  .attr("y", (r) =>{
                    return yScale(r[1]) + 14.5;
                  })
                  .attr("height", (r) => graph.height - yScale(r[1]));
                }
    }

    //appending path form topo data
    g.selectAll("path")
         .data(topojson.feature(mapData, mapData.objects.wahlkreise).features) //retrieve wahlkreise boundary data
         .enter().append("path")
          .attr("d", path)
          .style("stroke-width", "0.4px")
          .style("stroke", "#bfbfbf")
          .attr("fill", (e, i) =>{
            let wahlkreis = jsonArray[i].properties.WKR_NAME;
            var result = dataArray.filter(element =>{
              return element.includes(wahlkreis);
            });

            var cdu = result[0][10 + whichVote(vote)] * 100
                spd = result[0][14 + whichVote(vote)] * 100
                linke = result[0][18 + whichVote(vote)] * 100
                gruene = result[0][22 + whichVote(vote)] * 100
                csu = result[0][26 + whichVote(vote)] * 100
                fdp = result[0][30 + whichVote(vote)] * 100
                afd = result[0][34 + whichVote(vote)] * 100
                other = result[0][38 + whichVote(vote)] * 100;

            var unsortedPartyArray = [
              ["CDU", cdu, "#000000"],
              ["SPD", spd, "#EB001F"],
              ["Linke", linke, "#BE3075"],
              ["Grünen", gruene, "#64A12D"],
              ["CSU", csu, "#202257"],
              ["FDP", fdp, "#FFED00"],
              ["AfD", afd, "#009EE0"],
              ["Others", other, "#5e5e5e"]
            ];

            var sortedPartyArray = unsortedPartyArray.sort(function(a, b) { //sorting from largest to smallest, takes first string
              return b[1] - a[1];
            });

            return sortedPartyArray[0][2];
          })
          .html((d, i) =>{ //wahlkreis name popup on hover
            return "<title>" + jsonArray[i].properties.WKR_NR + ". " + jsonArray[i].properties.WKR_NAME + "</title>" //retrieve nth name from wahlkreise data
          })
          .on("click", (d, i) =>{
            d3.select("#name") //wahlkreis name on click
              .html(() =>{
                return "<span>" + i.properties.WKR_NR + ". </span>" + i.properties.WKR_NAME;
              });
            graph.draw(i.properties.WKR_NAME);
          });





    //GRAPH//

    //selecting svg
    var graphSVG = d3.select("#graph")
      .attr("height", dimensions.container.height)
      .attr("width", dimensions.container.width)
      .style("cursor", "default");

    //appending chart group
    var chart = graphSVG.append("g")
      .attr("height", graph.height)
      .attr("width", graph.width)
      .attr("transform", `translate(${dimensions.margins.left}, ${dimensions.margins.top})`);

    //default x and y scales
    var yScale = d3.scaleLinear()
      .range([graph.height, 0])
      .domain([0, 50]);

    var xScale = d3.scaleBand()
      .range([0, graph.width])
      .domain(defaultPartyOrder)
      .padding(0.2);

    //drawing initial blank chart
    chart.append("g")
      .attr("id", "yAxis")
      .attr("class", "axis")
      .attr("transform", `translate(20, 0)`)
      .call(d3.axisLeft(yScale));

    chart.append("g")
      .attr("id", "xAxis")
      .attr("class", "axis")
      .attr("transform", `translate(20, ${graph.height})`)
      .call(d3.axisBottom(xScale));




    btn.addEventListener("click", () =>{
      if (input.value === "") {
        return null;
      } else {
        graph.draw(input.value);
        graph.write();
      }
    });

    input.addEventListener("keyup", function (event) {
      if (event.keyCode === 13) {
        if (input.value === "") {
          return null;
        } else {
          graph.draw(input.value);
          graph.write();
        }
      }
    });
  });
});


//svg zooming effects
var zoom = d3.zoom()
  .scaleExtent([0.7, 15])
  .on("zoom", zoomed);

svg.call(zoom)
  .on("dblclick.zoom", null);

function zoomed(event) {
  var transform = event.transform;
  g.attr("transform", transform.toString());
}

//onclick => zoom
