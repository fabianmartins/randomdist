const RandomD = require('../source/RandomD.js');

console.log("\n### FROM SAMPLE ###");
let randFromSample = new RandomD({
    fromSample : {
        "sample" : [
            "A","A",
            "B","B","B",
            "C","C","C","C","C",
            "D","D","D",
            "E","E"
        ]
    }
});

countFreq = Array.from(randFromSample.values).fill(0);
for (let i=0;i<500000;i++) { 
    let r = randFromSample.get(); 
    let index = randFromSample.values.indexOf(r);
    countFreq[index]=countFreq[index]+1;
}
console.log(`Values: ${randFromSample.values}`);
console.log(`Count : ${countFreq}`);
console.log(`Expect: ${randFromSample.frequencies.map((f)=>{return f/randFromSample.maxFrequency*100})}`);
console.log(`We got: ${countFreq.map( (v) => { return v/countFreq.reduce( (t,s)=> { return Math.round(t+s)})*100 } )}`)