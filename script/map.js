var margin = {top: 0, left: 0, bottom: 20, right: 20};
var map = {
  height : 850 - margin.top - margin.bottom,
  width : 750 - margin.left - margin.right,

  class : function(data, array, vote, index) {
      var wahlkreis = array[index].properties.WKR_NAME;
      var result = data.filter(element =>{
        return element.includes(wahlkreis);
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

      return partyArray[0][0];
  }
}
