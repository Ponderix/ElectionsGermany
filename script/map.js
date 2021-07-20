var margin = {
    top: 0,
    left: 0,
    bottom: 20,
    right: 20
};

var map = {
    height: 850 - margin.top - margin.bottom,
    width: 750 - margin.left - margin.right,

    //district style class
    class: function(data, array, vote, index) {
        var wahlkreis = array[index].properties.WKR_NAME;
        var result = electionData.getDistrict(data, wahlkreis);
        var partyArray = electionData.getData(data, wahlkreis, vote);

        functions.removeZero(partyArray, 1);

        return partyArray[0][0];
    }
}
