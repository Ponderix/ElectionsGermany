var functions = {
  //zooming functions
  zoomed : function(event) {
    var transform = event.transform;
    g.attr("transform", transform.toString());
  },

  //on click zoom to path
  zoomTo : function(path, zoom) {
    path.transition()
      .delay(100)
      .duration(1000)
      .call(zoom.scaleTo, 2);
  },

  //removing all values of 0 IF ordered from large -> small
  removeZero : function(array) {
    for (i = array.length - 1; i >= 0; --i) {
      if (array[i].includes(0)) {
        array.splice(i, 7);
      }
    }
  },

  //creating array from certain data which selects if it should choose the percent results or the party corrsponding with the result
  //0 = party, 1 = percent
  whichValue : function(array, value) {
    let result = [];
    for (var i = 0; i < array.length; i++) {
      result.push(array[i][value]);
    }
    return result;
  },

  //returns if it should choose Erst or Zweit stimme, default is Erst stimme. Subtracts from the array index if zweit stimme.
  whichVote : function(num) {
    if (num != 1 && num != 2 ) {
      return 0;
    } else {
      return num - 1;
    }
  }
}
