var userinput = {
  //drawing boxes above each inoput indicating party and party 1st votes in 2017 election
  drawParties : function(data, search, vote, container) {
    //this will automatically be ordered according to the order of the inputs on the html file
    var nationalResults = electionData.getData(data, search, vote);

    for (var i = 0; i < nationalResults.length; i++) {
      container.select("#input_" + nationalResults[i][0])
        .append("div")
          .attr("class", `input-flair ${nationalResults[i][0]}`)
          .append("span")
            .html(functions.round(nationalResults[i][1], 0) + "%");
    }
  },

  //function which gets the swing according to the userinput
  swing : function(data, search, vote, container) {
    var output = [
      ["CDU"],
      ["SPD"],
      ["Linke"],
      ["Grünen"],
      ["CSU"],
      ["FDP"],
      ["AfD"],
      ["Others"]
    ];

    var nationalResults = electionData.getData(data, search, vote);

    for (var i = 0; i < nationalResults.length; i++) {
      var input = container.select("#input_" + nationalResults[i][0]).node().children[0];
      var difference = input.value - nationalResults[i][1];
      output[i].push(difference);
      output[i].push(input.value);
    }

    return output;
  },
}
