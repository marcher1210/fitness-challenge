const config = {
    seed: 'goodseed',
};

function isToday(date){
	let date1 = new Date(date.getTime());
	let today = new Date();
	date1.setUTCHours(0,0,0,0);
	today.setUTCHours(0,0,0,0);
	return date1.getTime() == today.getTime();
}

function isTomorrow(date){
	let date1 = new Date(date.getTime());
	let today = new Date();
	date1.setDate(date1.getDate()-1);
	date1.setUTCHours(0,0,0,0);
	
	today.setUTCHours(0,0,0,0);
	return date1.getTime() == today.getTime();
}

function isFuture(date){
	return date > new Date();
}

function chooseFromDate(date) {
	const seed = config.seed + date.toISOString().split('T')[0];
	return allowedDate(date) ? Chooser.chooseWeightedObject(config.items, "weight", 0, seed) : config.unknown;
}
function realWeekdayNum(date){
	return (date.getDay()+6)%7;
}

function buildDateObject(date) {
  return {
	  date: date,
	  mediumString: date.toISOString().split('T')[0],
	  shortString: date.toLocaleDateString('en-uk', { month:"short", day: "numeric"}),
	  weekdayNum: realWeekdayNum(date),
	  isToday: isToday(date),
	  isTomorrow: isTomorrow(date),
	  isFuture: isFuture(date)
  };
}

exports.handler = async (event) => {
    const path = event.path.split('/').pop(); // Get the last segment of the path
    const params = {
        date: event.queryStringParameters?.date,
        userseed: event.queryStringParameters?.userseed ?? '',
    };

    const date = (params.date) ? new Date(params.date) : new Date();

	date.setUTCHours(0,0,0,0);

    let data = {
        path: path,
        userseed: params.userseed,
        date: buildDateObject(date)
    };
    if(path!='date'){
        const RandomsPicker  = require('./'+path);
        const picker = new RandomsPicker(config.seed);
        picker.setUserseed(params.userseed + date.toISOString());
        const randomOne = await picker.getRandomElement(); 
        data['data'] = randomOne;
    }
    return {
        statusCode: 200,
        body: JSON.stringify(data)
    };
};
