const config = {
    seed: 'goodseed',
  	numberOfPreviousDays: 3*7,
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

	const RandomsPicker  = require('./random-challenge');
    const picker = new RandomsPicker(config.seed);
    picker.setUserseed(params.userseed + date.toISOString());

    switch (path) {
    	case 'challengelist':
    		data['data'] = picker.getFullList();
    		break;
    	case 'random-challenge':
	        data['data'] = await picker.getRandomElement();
	        break;
	    case 'history':
	    	let datesToProcess = [];
			const numberOfPreviousDays = event.queryStringParameters["days"] ?? config.numberOfPreviousDays;
			const start = -(7*Math.ceil(numberOfPreviousDays/7.))-realWeekdayNum(date);
			const end = (7*Math.floor((realWeekdayNum(date)+1)/7.))+(7-realWeekdayNum(date));
            for (let i = start; i < end; i++) {
                const nextDate = new Date(date);
                nextDate.setDate(date.getDate() + i);
                datesToProcess.push(nextDate);
            }

            var selections = datesToProcess.map(mapdate => {
            	picker.setUserseed(params.userseed + mapdate.toISOString());
		        const selectedValue = picker.getRandomElement();
		        return {
		            date: buildDateObject(mapdate),
		            data: selectedValue
		        };
		    });
		    data['data'] = selections;
            break;
    }

    return {
        statusCode: 200,
        body: JSON.stringify(data)
    };
};
