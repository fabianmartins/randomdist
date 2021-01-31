const RandomD = require('../source/RandomD.js');

let values = [1,2,3,4,5];
let frequencies = [20,30,50,30,20];
let randFromSpec = new RandomD({
    fromSpecification : {
        "values" : values,
        "frequencies" : frequencies
    }
});

var ranges = []
// RANGE DEFINITION
let min=700;
let max=2800;
var dist = Math.abs(max-min)/randFromSpec.accumFreq.length;
var iniRange = min;
for (let i=0;i<randFromSpec.accumFreq.length;i++) {
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

console.log("### FROM SPECIFICATION ###");
let countFreq = Array.from(randFromSpec.values).fill(0);
for (let i=0;i<5000000;i++) { 
    let r = randFromSpec.getInRange(700,2800);
    let index = rangeIndex(r);
    countFreq[index]=countFreq[index]+1;
}
console.log(`Values: ${values}`);
console.log(`Count : ${countFreq}`);
console.log(`Expect: ${randFromSpec.frequencies.map((f)=>{return f/randFromSpec.maxFrequency*100})}`);
console.log(`Frequ : ${countFreq.map( (v) => { return v/countFreq.reduce( (t,s)=> { return Math.round(t+s)})*100 } )}`);