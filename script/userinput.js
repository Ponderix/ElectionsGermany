var userinput = {
  //drawing boxes above each inoput indicating party and party 1st votes in 2017 election
  drawParties : function(container, data) {
    //this will automatically be ordered by the order of the inputs
    var nationalResults = [
      ["CDU", data[0][10]],
      ["SPD", data[0][14]],
      ["Linke", data[0][18]],
      ["Grünen", data[0][22]],
      ["CSU", data[0][26]],
      ["FDP", data[0][30]],
      ["AfD", data[0][34]],
      ["Others", data[0][38]]
    ]

    for (var i = 0; i < nationalResults.length; i++) {
      container.select("#input_" + nationalResults[i][0])
        .append("div")
          .attr("class", `input-flair ${nationalResults[i][0]}`)
          .append("span")
            .html(functions.round(nationalResults[i][1] * 100, 0) + "%");
    }
  }
}
