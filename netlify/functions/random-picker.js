const seedrandom = require('seedrandom');

class RandomPicker {

	constructor(baseseed) {
		this.baseseed = baseseed;
		this.userseed = '';
		this.reseed();
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
}


module.exports = RandomPicker;