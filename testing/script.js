//margins and height
const margin = {"top": 20, "right": 20, "bottom": 20, "left": 20};
const svgHeight = 500;
const svgWidth = 600;
const height = svgHeight - margin.top - margin.bottom;
const width = svgWidth - margin.left - margin.right;


//selecting svg
const svg = d3.select("svg");


//declaring scales
var yScale;
var xScale;


//default party order for initial chart
var defaultPartyOrder = ["CDU", "SPD", "Die Linke", "Die Grünen", "CSU", "FDP", "AfD", "Others"];


//appending chart group
var chart = svg.append("g")
  .attr("height", height)
  .attr("width", width)
  .attr("transform", `translate(${margin.left}, ${margin.top})`);

svg.style("cursor", "default");


//default x and y scales
yScale = d3.scaleLinear()
  .range([height, 0])
  .domain([0, 50]);

xScale = d3.scaleBand()
  .range([0, width])
  .domain(defaultPartyOrder)
  .padding(0.2);




//drawing initial blank chart
chart.append("g")
  .attr("id", "yAxis")
  .attr("transform", `translate(20, 0)`)
  .call(d3.axisLeft(yScale));

chart.append("g")
  .attr("id", "xAxis")
  .attr("transform", `translate(20, ${height})`)
  .call(d3.axisBottom(xScale));




//processing data and creating chart
d3.csv("/data/wk_17_processed", function(d) {

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
    "Gruene Erst stimmen" : +d["Gruene Erst stimmen"],
    "Gruene Zweit stimmen" : +d["Gruene Zweit stimmen"],
    "Gruene % Erst stimmen" : +d["Gruene % Erst stimmen"],
    "Gruene % Zweit stimmen" : +d["Gruene % Zweit stimmen"],
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
  };
}).then(function(data) {

  // objects to arrays for easier manipulation and referencing
  var dataArray = data.map(Object.values);




  //event listener on button click, will be different in finished version
  btn.addEventListener("click", () =>{

    //fetching result according to text input
    var result = dataArray.filter(element =>{
      return element.includes(input.value);
    });


    //getting erst stimmen results for each party and multiplying by 100
    var cdu = result[0][10] * 100
        spd = result[0][14] * 100
        linke = result[0][18] * 100
        gruene = result[0][22] * 100
        csu = result[0][26] * 100
        fdp = result[0][30] * 100
        afd = result[0][34] * 100
        other = result[0][38] * 100;

    //creating array with the vote share, party name and party color
    var unsortedPartyArray = [
      ["CDU", cdu, "#000000"],
      ["SPD", spd, "#EB001F"],
      ["Die Linke", linke, "#BE3075"],
      ["Die Grünen", gruene, "#64A12D"],
      ["CSU", csu, "#008AC5"],
      ["FDP", fdp, "#FFED00"],
      ["AfD", afd, "#009EE0"],
      ["Others", other, "#bfbfbf"]
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
      .range([height, 0])
      .domain([0, yMaxRounded]);
    xScale = d3.scaleBand()
      .range([0, width])
      .domain(partiesOnlySortedArray)
      .padding(0.2);


    //removing and redrawing axis
    svg.select("#yAxis").remove();
    svg.select("#xAxis").remove();

    chart.append("g")
      .attr("id", "yAxis")
      .attr("transform", `translate(20, 0)`)
      .call(d3.axisLeft(yScale));

    chart.append("g")
      .attr("id", "xAxis")
      .attr("transform", `translate(20, ${height})`)
      .call(d3.axisBottom(xScale));



    //drawing the bars
    svg.selectAll("rect").remove();

    svg.selectAll("rect")
      .data(sortedPartyArray) //important that all data needed for the chart is included in this array
      .enter()
      .append("rect")
        .attr("fill", (r) =>{return r[2]})
        .attr("x", (r) => xScale(r[0]) + 40)
        .attr("width", xScale.bandwidth())
        .attr("y", (r) => yScale(-1.7))
        .attr("height", (r) => height - yScale(0)) //has to equal 0 at start for animation to load from bottom up
        .on("mouseover", (event, r) =>{
        })
        .on("mouseout", (r) =>{
        });



    //loading animation
    svg.selectAll("rect")
      .attr("height", 0)
      .transition()
        .delay((d, i) => {return i*50})
        .duration(800)
        .attr("y", (r) => yScale(r[1]) + 19.5)
        .attr("height", (r) => height - yScale(r[1]));


  });

});
