const height = 350;
const width = 500;

const container = d3.select("#btw21");
const voteSVG = container.append("div")
    .attr("id", "vote-svg-container")
    .append("svg")
        .attr("id", "vote-svg")
        .attr("width", 700)
        .attr("height", 350);
const seatsSVG = container.append("div")
    .attr("id", "seats-svg-container")
    .append("svg")
        .attr("id", "seats-svg")
        .attr("width", 700)
        .attr("height", 350);

var data = [
    ["SPD", 25.7, 206],
    ["CDU", 18.9, 151],
    ["Grüne", 14.8, 118],
    ["FDP", 11.5, 92],
    ["AfD", 10.3, 83],
    ["CSU", 5.2, 45],
    ["Linke", 4.9, 39],
    ["SSW", 0.1, 1],
    ["Others.", 8.9, 0],
];

//drawing votes svg chart

/*
var yScale = d3.scaleLinear()
    .range([height, 30])
    .domain([0, 30]);
var xScale = d3.scaleBand()
    .range([0, width])
    .domain(["SPD", "CDU", "Grüne", "FDP", "AfD", "CSU", "Linke", "SSW", "Others."]);

voteSVG.append("g")
    .attr("transform", `translate(40, -20)`)
    .call(d3.axisLeft(yScale));

voteSVG.append("g")
    .attr("transform", `translate(40, ${height-20})`)
    .call(d3.axisBottom(xScale));
*/
