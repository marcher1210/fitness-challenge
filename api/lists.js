const config = {
    seed: 'goodseed'
};


/* * * * * * * * * * * * * * 
 * [...]/lists/
 * * * * * * * * * * * * * */
function getAllLists(){
	return ['challenges', 'run', 'strength'];
}


/* * * * * * * * * * * * * * 
 * [...]/lists/{listtitle}/	
 * * * * * * * * * * * * * */
function getList(listtitle) {
	const List  = require('./list-picker');
    const list = new List(config.seed, "./assets/lists/"+listtitle+".csv");
    
	return {list: listtitle, elements: list.getFullList()};
}

/* * * * * * * * * * * * * * 
 * [...]/lists/{listtitle}/element?userseed={userseed}&date={datestring}
 * * * * * * * * * * * * * */
function getListElement(listtitle, userseed, date) {
	const List  = require('./list-picker');
    const list = new List(config.seed, "./assets/lists/"+listtitle+".csv");

    const dateobj = (date) ? new Date(date) : new Date();
	dateobj.setUTCHours(0,0,0,0);

	list.setUserseed(userseed + dateobj.toISOString());

	return {date: dateobj, element: list.getRandomElement()};
}


/* * * * * * * * * * * * * * 
 * [...]/lists/{listtitle}/history?userseed={userseed}&fromdate={datestring}&todate={datestring}
 * * * * * * * * * * * * * */
function getListHistory(listtitle, userseed, fromdate, todate) {
	const List  = require('./list-picker');
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

    var selections = datesToProcess.map(mapdate => {
    	list.setUserseed(userseed + mapdate.toISOString());
        const selectedValue = list.getRandomElement();
        return {
            date: buildDateObject(mapdate),
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
	    if(!getAllLists().includes(listtitle)) {

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
