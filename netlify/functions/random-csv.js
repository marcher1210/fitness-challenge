const fs = require('fs');
const path = require('path');
const sync = require('csv-parse/sync');


const RandomPicker = require('./random-picker');
class RandomCsvPicker extends RandomPicker {

    constructor(seed, filePath) {
        super(seed);
        this.filePath = filePath;
        this.records = [];
        this.loadRecords();
    }

    // Load words from the file
    loadRecords() {
        try {
            const fileContent = fs.readFileSync(this.filePath, 'utf-8');

            this.records = sync.parse(fileContent, {
              columns: true,
              delimiter: ';',
              skip_empty_lines: true
            });
        } catch (error) {
            console.error('Error reading the file:', error.message);
            throw new Error('Could not load words from the file.');
        }
    }

    // Return a random word
    getRandomElement() {
        if (this.records.length === 0) {
            throw new Error('No words available to pick from.');
        }
        const randomIndex = Math.floor(this.getRandom() * this.records.length);
        return this.records[randomIndex];
    }
}

module.exports = RandomCsvPicker;
