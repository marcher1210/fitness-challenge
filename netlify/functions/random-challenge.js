const RandomCsvPicker = require('./random-csv');
class RandomChallengePicker extends RandomCsvPicker {
	    constructor(seed) {
        super(seed,'./assets/challenges.csv');
    }
}
module.exports = RandomChallengePicker;