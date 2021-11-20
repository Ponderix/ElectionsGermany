var data = [
    {party : "Linke", percent : 4.9, seats : 39},
    {party : "SPD", percent : 25.7, seats : 206},
    {party : "Grünen", percent : 14.8, seats : 118},
    {party : "FDP", percent : 11.5, seats : 92},
    {party : "SSW", percent : 0.1, seats : 1},
    {party : "CDU", percent : 18.9, seats : 151},
    {party : "CSU", percent : 5.2, seats : 45},
    {party : "AfD", percent : 10.3, seats : 83},
];

const width = 400;
const height = 275;
const radius = width / 2;

var arc = d3.arc().innerRadius(50).outerRadius(radius);
var pie = d3.pie().startAngle(-95 * (Math.PI/180))
    .endAngle(95 * (Math.PI/180))
    .padAngle(0) // some space between slices
    .sort(null)
    .value((d) =>{
        return d.seats;
    });


const svg = d3.select("#arc_container").append("svg")
    .attr("width", width)
    .attr("height", height)
    .append("g")
        .attr('transform', `translate(${width / 2}, ${height - 50})`); // move chart from (0,0) to radius

const slices = svg.selectAll("g.slice")
    .data(pie(data))
    .enter()
    .append("g")
    .attr("class", "slice");

slices.append("path")
    .attr("class", (d) => {
        return d.data.party;
    })
    .attr("d", arc)
    /*.transition()
        .duration(1000)
        .attrTween("d", (d) =>{
            let originalEnd = d.endAngle;

            return (t) => {
                let currentAngle = d3.interpolate(t);
                if (currentAngle < d.startAngle) {
                    return "";
                }

                d.endAngle = Math.min(currentAngle, originalEnd);

                return arc(d);
            }

        });*/

slices.append("text")
    .attr("transform", (d) =>{
        if (d.data.party != "AfD" && d.data.party != "CSU") { // CSU and AfD dont align correctly, this fixes it
            return `translate(${arc.centroid(d)})`;
        } else {
            var c = arc.centroid(d);
            c.splice(1, 1, arc.centroid(d)[1] + 6);

            return `translate(${c})`;
        }
    })
    .attr("text-anchor", "middle")
    .text((d) =>{
        return d.data.seats;
    });
