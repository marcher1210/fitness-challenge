const seedrandom = require('seedrandom');

class RandomPicker {

	constructor(baseseed) {
		this.baseseed = baseseed;
		this.userseed = '';
		this.reseed();
	}

	reseed() {
		const seed = this.baseseed + this.userseed;
		this.random = seedrandom(seed);
	}

	setUserseed(userseed){
		this.userseed = userseed;
		this.reseed();
	}

	getRandom() {
		return this.random();
	}
}


module.exports = RandomPicker;