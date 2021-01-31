const RandomD = require('../source/RandomD.js');

console.log("\n### FROM SAMPLE ###");
let randFromSample = new RandomD({
    fromSample : {
        "sample" : [
            1,
            2,2,2,2,
            3,3,3,3,3,3,3,3,3,3,
            4,4,4,4,
            5
        ]
    }
});

var ranges = []
// RANGE DEFINITION
let min=700;
let max=2800;
var dist = Math.abs(max-min)/randFromSample.accumFreq.length;
var iniRange = min;
for (let i=0;i<randFromSample.accumFreq.length;i++) {
    ranges.push([iniRange,iniRange+dist]);
    iniRange=iniRange+dist;
}

const rangeIndex = (value) => {
    let indexClosest = null;
    for (let i=0; i<ranges.length && indexClosest == null; i++) {
        if (value>=ranges[i][0] && value < ranges[i][1]) indexClosest = i;
    };
    return indexClosest;
}

countFreq = Array.from(randFromSample.values).fill(0);
for (let i=0;i<500000;i++) { 
    let r = randFromSample.getInRange(-45,73,true);
    let index = rangeIndex(r);
    countFreq[index]=countFreq[index]+1;
}
console.log(`Values: ${randFromSample.values}`);
console.log(`Count : ${countFreq}`);
console.log(`Expect: ${randFromSample.frequencies.map((f)=>{return f/randFromSample.maxFrequency*100})}`);
console.log(`Frequ : ${countFreq.map( (v) => { return v/countFreq.reduce( (t,s)=> { return Math.round(t+s)})*100 } )}`)