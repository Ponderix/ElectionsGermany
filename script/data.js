var electionData = {
    getDistrict: function(data, search) {
        return data.filter((e) => {
            return e.includes(search);
        });
    },

    getData: function(data, search, vote) {
        var result = data.filter((e) => {
            return e.includes(search);
        });

        var cdu = result[0][10 + functions.whichVote(vote)] * 100
            spd = result[0][14 + functions.whichVote(vote)] * 100
            linke = result[0][18 + functions.whichVote(vote)] * 100
            gruene = result[0][22 + functions.whichVote(vote)] * 100
            csu = result[0][26 + functions.whichVote(vote)] * 100
            fdp = result[0][30 + functions.whichVote(vote)] * 100
            afd = result[0][34 + functions.whichVote(vote)] * 100
            other = result[0][38 + functions.whichVote(vote)] * 100;

        var array = [
            ["CDU", cdu],
            ["SPD", spd],
            ["Linke", linke],
            ["Grünen", gruene],
            ["CSU", csu],
            ["FDP", fdp],
            ["AfD", afd],
            ["Others", other]
        ];

        return array;
    },

    //getting the index of the value ON THE MAIN DATA ARRAY
    getIndex: function(vote) {
        var array = [
            ["CDU", 10 + functions.whichVote(vote)],
            ["SPD", 14 + functions.whichVote(vote)],
            ["Linke", 18 + functions.whichVote(vote)],
            ["Grünen", 22 + functions.whichVote(vote)],
            ["CSU", 26 + functions.whichVote(vote)],
            ["FDP", 30 + functions.whichVote(vote)],
            ["AfD", 34 + functions.whichVote(vote)],
            ["Others", 38 + functions.whichVote(vote)]
        ];

        return array;
    }
}
