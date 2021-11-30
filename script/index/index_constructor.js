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
    drawPie(420, 295);
} else {
    drawPie(270, 191.875);
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

    const radius = width / 2 - 20; // the -20 is needed to fit the slices with the on hover animation
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
            .attr('transform', `translate(${width / 2}, ${height - radius / 4})`); // move chart from (0,0) to radius

    const slices = svg.selectAll("g.slice")
        .data(pie(data))
        .enter()
        .append("g")
        .attr("class", "slice");

    slices.append("path")
        .attr("class", (d) => {
            return d.data.party;
        })
        .on("mouseover", (event, d) =>{
            d3.select(event.currentTarget)
                      	.transition()
                  	  	.duration(500)
                        .style('stroke', "white")
                  		.attr('transform', calcTranslate(d, 6));

            tooltip.select(".ttp-logo").selectAll("img").remove();
            tooltip.select(".ttp-logo").append("img").attr("src", `assets/logos/${d.data.party}.svg`);

            tooltip.select(".ttp-main").html(`${d.data.seats} seats<br>${d.data.percent}%`);

            tooltip.transition()
                .duration(750)
                .style("opacity", 1)
        })
        .on("mouseout", () =>{
            d3.select(event.currentTarget).transition().duration(400).attr('transform', 'translate(0, 0)').style('stroke', 'none');

            tooltip.transition().delay(200).duration(300).style("opacity", 0);
        })
        .attr("d", arc)
        /*.transition()
            .ease("bounce")
            .duration(2000)
                .ease("bounce")
                .attrTween("d", d => {
                    var originalEnd = d.endAngle;
                    return t => {
                        var currentAngle = angleInterpolation(t);
                        if (currentAngle < d.startAngle) {
                            return "";
                        }

                        d.endAngle = Math.min(currentAngle, originalEnd);

                        return arc(d);
                    }
                });*/

        function calcTranslate(data, move = 4) {
            const moveAngle = data.startAngle + ((data.endAngle - data.startAngle) / 2);
            return `translate(${- move * Math.cos(moveAngle + Math.PI / 2)}, ${- move * Math.sin(moveAngle + Math.PI / 2)})`;
        }
}
