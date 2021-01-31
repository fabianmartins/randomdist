const RandomD = require('../source/RandomD.js');

let values = [1,2,3,4,5];
let frequencies = [20,30,50,30,20];
let randFromSpec = new RandomD({
    fromSpecification : {
        "values" : values,
        "frequencies" : frequencies
    }
});

console.log("### FROM SPECIFICATION ###");
let countFreq = Array.from(randFromSpec.values).fill(0);
for (let i=0;i<5000000;i++) { 
    let r = randFromSpec.get(true); 
    let index = randFromSpec.values.indexOf(r);
    countFreq[index]=countFreq[index]+1;
}
console.log(`Values: ${values}`);
console.log(`Count : ${countFreq}`);
console.log(`Expect: ${frequencies.map((f)=>{return f/randFromSpec.maxFrequency*RandomD.FREQ_SCALING_FACTOR*100})}`);
console.log(`We got: ${countFreq.map( (v) => { return v/countFreq.reduce( (t,s)=> { return Math.round(t+s)})*100 } )}`);