const Chooser = require("random-seed-weighted-chooser").default;

const RandomCsvPicker = require('./random-csv');
class RandomChallengePicker extends RandomCsvPicker {
    constructor(seed) {
        super(seed,'./assets/challenges.csv');
        for (var i = this.records.length - 1; i >= 0; i--) {
            this.records[i].weight = Number(this.records[i].weight);
        }
        this.calculateFrequency();
    }


    // Return a random word OVERLOAD to return weighted value
    getRandomElement() {
        if (this.records.length === 0) {
            throw new Error('No words available to pick from.');
        }

        return Chooser.chooseWeightedObject(this.records, "weight", 0, this.getFullSeed());
    }

    calculateFrequency() {
        const totalWeight = this.records.reduce((a, c) => {return a+c.weight;},0);

        for (var i = this.records.length - 1; i >= 0; i--) {
            const chance = (this.records[i].weight / totalWeight * 100);
            this.records[i].chance = chance.toPrecision(3)+"%";
            this.records[i].frequencytext = this.getFrequencyText(chance);
        }
    }

    getFrequencyText(chance){
        const arr = [
            {text: "year",  days: 365},
            {text: "month", days: 31},
            {text: "week",  days: 7}];
        let days=0;
        let text="";
        for (var i = arr.length - 1; i >= 0; i--) {
            days = chance * arr[i].days / 100;
            if(days > 1 || i == 0) {
                return `Approximately ${days.toFixed(1)} days per ${arr[i].text}.`;
            }
        }
        return `Very rare!`;
    }

}
module.exports = RandomChallengePicker;