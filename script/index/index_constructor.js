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

if (window.innerWidth > 544) {
    drawPie(400, 275);
} else {
    drawPie(250, 171.875);
}

window.addEventListener('resize', () =>{
    if (window.innerWidth > 544) {
        drawPie(400, 275);
    } else {
        drawPie(200, 137.5);
    }
});


function drawPie(width, height) {
    d3.select("#arc_container").selectAll("svg").remove();

    const radius = width / 2;
    const tooltip = d3.select("#tooltip");


    var arc = d3.arc().innerRadius(radius / 4).outerRadius(radius);
    var pie = d3.pie().startAngle(-95 * (Math.PI/180))
        .endAngle(95 * (Math.PI/180))
        .padAngle(0) // some space between slices
        .sort(null)
        .value((d) =>{
            return d.seats;
        });


    const svg = d3.select("#arc_container").append("svg")
        .attr("width", width)
        .attr("height", height + 25)
        .append("g")
            .attr('transform', `translate(${width / 2}, ${height + 25 - radius / 4})`); // move chart from (0,0) to radius

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
        .on("mouseover", (event, d) =>{
            tooltip.select(".ttp-logo").selectAll("img").remove();
            tooltip.select(".ttp-logo").append("img").attr("src", `assets/logos/${d.data.party}.svg`);

            tooltip.select(".ttp-main").html(`${d.data.seats} seats<br>${d.data.percent}%`);

            tooltip.transition()
                .duration(750)
                .style("opacity", 1)
        })
        .on("mouseout", () =>{
            tooltip.transition().delay(200).duration(300).style("opacity", 0);
        })
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

    /*slices.append("text")
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
        });*/
}
