const config = {
    seed: 'goodseed',
    apiUrl: '/api/lists/',
    futureHours: 12, //How many hours before a future date can you get an element
    futureElement: { name: "Coming", imgUrl: "/assets/unknown.webp"},
    lists: [
    	{
    		id: 'challenges', 
    		title: "All challenges"
    	},
    	{
    		id: 'run', 
    		title: "Run Challenges"
    	},
    	{
    		id: 'strength',
    		title: "Strength challenges"
    	}
    ]
};


/* * * * * * * * * * * * * * 
 * [...]/lists/
 * * * * * * * * * * * * * */
function getAllLists(){

	return config.lists.map(obj => ({ ...obj, url: config.apiUrl+obj.id+'/'}));
}


/* * * * * * * * * * * * * * 
 * [...]/lists/{listtitle}/	
 * * * * * * * * * * * * * */
function getList(listtitle) {
	const List  = require('./weighted-list-picker');
    const listpicker = new List(config.seed, "./assets/lists/"+listtitle+".csv");

    const list = getAllLists().find(obj => obj.id == listtitle);
    
	return {...list, elements: listpicker.getFullList()};
}

/* * * * * * * * * * * * * * 
 * [...]/lists/{listtitle}/element?userseed={userseed}&date={datestring}
 * * * * * * * * * * * * * */
function getListElement(listtitle, userseed, date) {
	const List  = require('./weighted-list-picker');
    const list = new List(config.seed, "./assets/lists/"+listtitle+".csv");

    const dateobj = (date) ? new Date(date) : new Date();
	dateobj.setUTCHours(0,0,0,0);

	list.setUserseed(userseed + dateobj.toISOString());
	const dateobj2 = buildDateObject(dateobj);

	const today = new Date();
    const selectedValue = (((dateobj - today) / 60 / 60 / 1000) < config.futureHours) ? list.getRandomElement(): config.futureElement;
    return {
        date: dateobj2, 
        url: config.apiUrl+listtitle+'/element?userseed='+userseed+'&date='+dateobj2.mediumString,
        element: selectedValue
    };
}


/* * * * * * * * * * * * * * 
 * [...]/lists/{listtitle}/history?userseed={userseed}&fromdate={datestring}&todate={datestring}
 * * * * * * * * * * * * * */
function getListHistory(listtitle, userseed, fromdate, todate) {
	const List  = require('./weighted-list-picker');
    const list = new List(config.seed, "./assets/lists/"+listtitle+".csv");

	let datesToProcess = [];

	let currentdate = new Date(fromdate);
	currentdate.setUTCHours(0,0,0,0);

	const todateobj = new Date(todate);
	todateobj.setUTCHours(0,0,0,0);

	while(currentdate <= todateobj) {
		datesToProcess.push(new Date(currentdate));
        currentdate.setDate(currentdate.getDate() + 1);
	}

	const today = new Date();

    var selections = datesToProcess.map(mapdate => {
    	list.setUserseed(userseed + mapdate.toISOString());
    	const dateobj = buildDateObject(mapdate);
        const selectedValue = (((mapdate - today) / 60 / 60 / 1000) < config.futureHours) ? list.getRandomElement(): config.futureElement;
        return {
            date: dateobj, 
            diff: (mapdate - today) / 60 / 60 / 1000,
            url: config.apiUrl+listtitle+'/element?userseed='+userseed+'&date='+dateobj.mediumString,
            element: selectedValue
        };
    });


	return selections;
}

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
    const path = event.path.split('/lists').pop(); //Get the part of the url AFTER "[...]/lists[...]"
    const pathparts = path.split('/'); //URL "/.netlify/functions/lists/run/element" will become ["","run","element"]

    let data = {};

    if (pathparts.length <= 1 || pathparts[1] == "") {
    	data = getAllLists();
    }
    else {
	    const listtitle = pathparts[1];
	    if(!config.lists.map(obj => obj.id).includes(listtitle)) {

		    return {
		        statusCode: 404,
		        body: "List '"+listtitle+"' does not exist."
		    };
	    }

	    const functionname = pathparts[2];
	    if(!functionname || functionname == "") {
	    	data = getList(listtitle);
	    }
	    else if(functionname == "element"){
	    	const date = event.queryStringParameters?.date;
        	const userseed = event.queryStringParameters?.userseed ?? '';
	    	data = getListElement(listtitle, userseed, date);
	    }
	    else if(functionname == "history"){
	    	const fromdate = event.queryStringParameters?.fromdate;
	    	const todate = event.queryStringParameters?.todate;
        	const userseed = event.queryStringParameters?.userseed ?? '';
	    	data = getListHistory(listtitle, userseed, fromdate, todate);
	    }
	}


    return {
        statusCode: 200,
        body: JSON.stringify(data)
    };
};
