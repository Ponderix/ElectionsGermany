var functions = {
    //zooming functions
    zoomed: function(event) {
        var transform = event.transform;
        mapGroup.attr("transform", transform.toString());
    },

    //on click zoom to path
    zoomTo: function(path, zoom) {
        path.transition()
            .delay(100)
            .duration(1000)
            .call(zoom.scaleTo, 2);
    },

    //removing all values of 0 IF ordered from large -> small
    removeZero: function(array, secondIndex) {
        array.sort((a, b) => {
            return b[secondIndex] - a[secondIndex];
        });
        for (i = array.length - 1; i >= 0; --i) {
            if (array[i][secondIndex] <= 0) {
                array.splice(i, array.length);
            }
        }
    },

    //creating array from certain data which selects if it should choose the percent results or the party corrsponding with the result
    //0 = party, 1 = percent
    whichValue: function(array, value) {
        let result = [];
        for (var i = 0; i < array.length; i++) {
            result.push(array[i][value]);
        }
        return result;
    },

    //returns if it should choose Erst or Zweit stimme, default is Erst stimme. Subtracts from the array index if zweit stimme.
    whichVote: function(num) {
        if (num != 1 && num != 2) {
            return 0;
        } else {
            return num - 1;
        }
    },

    //rounds to nearest nth term
    round: function(num, decimals) {
        return Math.round(num * Math.pow(10, decimals)) / Math.pow(10, decimals);
    },

    //get diff between largest and second largest value in array
    getMargin: function(array) {
        var max = Math.max(...array);
        array.splice(array.indexOf(max), 1);
        var secondMax = Math.max(...array);

        return max - secondMax;
    },

    //find the most under/overrepresented party and give/take a the seat
    assignSeat : function(seatArray, representation) {
        var sorted = seatArray.slice().sort((a, b) => {
            return a[2] - b[2]//sort array so that most underepresented party is first
        });
        var difference = Math.abs(seatArray[7][1] - seatArray[7][2]) //seats too many

        if (representation === "OVER") {
            var index = seatArray.indexOf(sorted[6])//find index of party which under/overrepresnted
            if (seatArray[index][3] != 0) {
                seatArray[index].splice(1, 1, seatArray[index][1] - difference);//add/subtrat 1 seat to the party
            }
        } else {
            if (representation === "UNDER") {
                var index = seatArray.indexOf(sorted[0])//find index of party which under/overrepresnted
                if (seatArray[index][3] != 0) {
                    seatArray[index].splice(1, 1, seatArray[index][1] + difference);//add/subtrat 1 seat to the party
                }
            }
        }

        var sum = 0; // append sum of all seats just in case
        for (var i = 0; i < seatArray.length - 2; i++) {
            sum+=seatArray[i][1];
        }
        seatArray[7].splice(1, 1, sum);
    },
}
