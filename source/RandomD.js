'use strict';

/**
 * Random number generator respecting a certain distribution.
 * 
 * It can be used having as a source two arrays of the same size:
 * - values without repetitions
 * - frequencies has the ocurrency frequency of the provided values; repetitions may occur
 *
 * Alternatively, you can also provide an array with samnpled values. The class is going
 * to derive the frequencies from the sample.
 */

class RandomD {

    /**
     * The scaling factor is used to 'boost' the frequencies, so you
     * can get better results.
     * 
     * TO-DO: Have not tested yet what are the implications when I am working
     * with having very large frequencies as input.
     */
    static FREQ_SCALING_FACTOR = 100000000;
    /**
     * Creates an instance in accordance to the configuration
     * 
     * @param {*} config   
     *          { fromSpecification: { values = [], frequencies = [] } } or
     *          { fromSample : { sample : [] }
     */
    constructor(config) {
        // Config is required
        if (!config) throw new Error("config is needed. Please read the documentation.");
        let keys = Object.keys(config);
        // config must have one of "fromSpecification" or "fromSample", but not both
        if (keys.length==0 || keys.length > 1) 
            throw new Error("config improperly defined. Please read the documentation.");
        // this.values contains the values from the configuration (or the derived ones)
        this.values = null;
        // this.frequencies contains the frequencies from the configuration (or the derived ones)
        this.frequencies = null;
        // this.accumFreq contains the accumulated frequencies values
        this.accumFreq = [];
        // this.maxFrequency holds the max value from this.accumFreq
        this.maxFrequency = null;
        // We need to know if all values are numbers or not
        // If the set of values is not of numbers, then we cannot
        // generate ranges.
        this.valuesAreAllNumbers = null;
        //
        switch (keys[0].toUpperCase()) {
            case "FROMSPECIFICATION":
                this.prepareFromSpecification(config.fromSpecification);
                break;
            case "FROMSAMPLE":
                this.prepareFromSample(config.fromSample);
                break;
            default: 
                throw new Error("config improperly defined. Please read the documentation.");
        };
    }

    /**
     * 
     * @param {Object} specConfig { values : [] , frequencies : [] }
     */
    prepareFromSpecification(specConfig) {
        if (
            !specConfig ||
            !(specConfig.values) ||
            !(specConfig.frequencies) ||
            !(specConfig.values instanceof Array) || 
            !(specConfig.frequencies instanceof Array) ||
            (specConfig.frequencies.length != specConfig.values.length)
        ) throw new Error("Value and Distribution must be arrays of the same size.");
        this.values = specConfig.values;
        this.frequencies = specConfig.frequencies;
        //boost frequency => Improves the generation efficiency
        this.frequencies = this.frequencies.map((v) => { return v*RandomD.FREQ_SCALING_FACTOR });
        this.accumFreq = [];
        let total = 0;
        this.frequencies.forEach( (frequency)=> {
            total = total + frequency;
            this.accumFreq.push(total);
        });
        this.maxFrequency = this.accumFreq[this.accumFreq.length-1];
        this.valuesAreAllNumbers = true;
        for (let i=0 ; i<this.values.length && this.valuesAreAllNumbers == true; i++) {
            if (typeof this.values[i] != 'number') this.valuesAreAllNumbers=false;
        };
    }


    /**
     * Given a sample of numbers, derives its distribution
     * @param {Array} sampleConfig sample : []
     */
    prepareFromSample(sampleConfig) {
        if ( !sampleConfig ||
            !(sampleConfig.sample)
        ) throw new Error("sample must be informed.");
        let specConfig = {
            values : [],
            frequencies : []
        };
        for( let i = 0; i < sampleConfig.sample.length; i++ ) {
            if ( specConfig.values.indexOf( sampleConfig.sample[i] )  == -1 ) {
                let count = 1;
                for ( let j = i+1; j < sampleConfig.sample.length;j++) {
                    if (sampleConfig.sample[i] == sampleConfig.sample[j]) count++;
                };
                specConfig.values.push(sampleConfig.sample[i]);
                specConfig.frequencies.push(count);
            }
        };
        this.prepareFromSpecification(specConfig);
    }


    /**
     * Returns a random number within the provided
     * range, respecting the specified distribution
     * 
     */
    getInRange(min,max,wantsARealNumber) {
        if (!this.valuesAreAllNumbers) return NaN;
        let ranges = []
        let dist = Math.abs(max-min)/this.accumFreq.length;
        let iniRange = min;
        for (let i=0;i<this.accumFreq.length;i++) {
            ranges.push([iniRange,iniRange+dist]);
            iniRange=iniRange+dist;
        }
        let value = this.getRandomBetween(1,this.maxFrequency,wantsARealNumber);
        // indicate the closest element
        let indexClosest = null;
        for (let i=0; i<this.accumFreq.length && indexClosest == null; i++) {
            if (this.accumFreq[i]>=value) indexClosest=i;
        };
        let minR = null;
        let maxR = null;
        [minR,maxR]=ranges[indexClosest];
        return this.getRandomBetween(minR,maxR,wantsARealNumber);
    }

    /**
     * Returns a random number within the provided
     * range, respecting the specified distribution
     * 
     */
    get() {
        // Get a random value between 1 and this.maxFrequency 
        // (that's why having a high this.maxFrequency is important)
        let value = this.getRandomBetween(1,this.maxFrequency);
        // indicate the closest element
        let indexClosest = null;
        for (let i=0; i<this.accumFreq.length && indexClosest == null; i++) {
            if (this.accumFreq[i]>=value) indexClosest=i;
        };
        let result = this.values[indexClosest];
        return result;
    }

    /**
     * 
     * @param {*} min 
     * @param {*} max 
     * @param {*} wantsAnInteger 
     */
    getRandomBetween(min,max,wantsARealNumber) {
        let value = Math.random()*(max-min)+min;
        if (!wantsARealNumber) return Math.round(value);
        else return value;
    }
}

module.exports = RandomD;