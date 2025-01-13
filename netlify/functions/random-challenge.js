const Chooser = require("random-seed-weighted-chooser").default;

const RandomCsvPicker = require('./random-csv');
class RandomChallengePicker extends RandomCsvPicker {
    constructor(seed) {
        super(seed,'./assets/challenges.csv');
        const totalWeight = this.records.reduce((a, c) => {return a+Number(c.weight);},0);

        for (var i = this.records.length - 1; i >= 0; i--) {
            this.records[i].weight = Number(this.records[i].weight);
            this.records[i].chance = (this.records[i].weight / totalWeight * 100).toPrecision(3)+"%";
        }
    }


    // Return a random word
    getRandomElement() {
        if (this.records.length === 0) {
            throw new Error('No words available to pick from.');
        }

        return Chooser.chooseWeightedObject(this.records, "weight", 0, this.getFullSeed());
    }

}
module.exports = RandomChallengePicker;