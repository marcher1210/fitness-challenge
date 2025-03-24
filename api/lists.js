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
	return {list: title, elements: [{title: "Number 1", weight: 1, imageurl: "/...", description: "Element 1"},{title: "Number 2", weight: 2, imageurl: "/...", description: "Element 2"}]};
}

/* * * * * * * * * * * * * * 
 * [...]/lists/{listtitle}/element?userseed={userseed}&date={datestring}
 * * * * * * * * * * * * * */
function getListElement(listtitle, userseed, date) {
	return {date: date, element: {title: "Number 1", weight: 1, imageurl: "/...", description: "Element 1"}};
}


/* * * * * * * * * * * * * * 
 * [...]/lists/{listtitle}/history?userseed={userseed}&fromdate={datestring}&todate={datestring}
 * * * * * * * * * * * * * */
function getListHistory(listtitle, userseed, fromdate, todate) {
	return [{date: fromdate, element: {title: "Number 1", weight: 1, imageurl: "/...", description: "Element 1"}},{date: todate, element: {title: "Number 2", weight: 2, imageurl: "/...", description: "Element 2"}}];
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
	    if(functionname == "") {data = getList(listtitle);}
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
