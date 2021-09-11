var margin = {
    top: 0,
    left: 0,
    bottom: 20,
    right: 20
};

var map = {
    height: 850 - margin.top - margin.bottom,
    width: 950 - margin.left - margin.right,

    //district style class
    class: function(data, array, vote, index) {
        var wahlkreis = array[index].properties.WKR_NAME;
        var partyArray = electionData.getData(data, wahlkreis, vote);

        functions.removeZero(partyArray, 1);

        return partyArray[0][0];
    },

    opacity: function(data, array, vote, index) {
        var wahlkreis = array[index].properties.WKR_NAME;
        var partyArray = electionData.getData(data, wahlkreis, vote);

        functions.removeZero(partyArray, 1);

        if (partyArray.length >= 2) { //if there is only one party running the function would fail since there owuld be no second largest party
            return (partyArray[0][1] - partyArray[1][1] + 10) * 3 / 100;
        } else {
            return (partyArray[0][1] + 10) / 100;
        }
    }
}
