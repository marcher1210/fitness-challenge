const seedrandom = require('seedrandom');
const fs = require('fs');
const path = require('path');
const sync = require('csv-parse/sync');

class ListPicker {

	constructor(baseseed, filePath) {
		this.baseseed = baseseed;
		this.userseed = '';
		this.reseed();
		this.filePath = filePath;
        this.records = [];
        this.loadRecords();
	}

	reseed() {
		this.random = seedrandom(this.getFullSeed());
	}

	setUserseed(userseed){
		this.userseed = userseed;
		this.reseed();
	}

	getFullSeed(){
		return this.baseseed + this.userseed;
	}

	getRandom() {
		return this.random();
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

    // Return full list
    getFullList(){
        return this.records;
    }
}


module.exports = ListPicker;