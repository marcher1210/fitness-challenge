# API

## Url format

| Url | Description |
|--------|--------|
| `[...]/lists/` | Returns an array of [List](#list) with all the available lists. |
| `[...]/lists/{listtitle}/` | Returns a [List](#list). <br/> `{listtitle}` is the title of a [List](#list).  |
| `[...]/lists/{listtitle}/element?userseed={userseed}&date={datestring}` | Returns a [PickedElement](#pickedelement). <br/> `{listtitle}` is the title of a [List](#list). <br/> `{userseed}` is a freetext string to seed the random element. <br/> `{datestring}` is is the date for the element in the format `YYY-MM-DD`. |
| `[...]/lists/{listtitle}/history?userseed={userseed}&fromdate={datestring}&todate={datestring}` | Returns a an array of [PickedElement](#pickedelement), one for each date between (and including) from date and to date. <br/> `{listtitle}` is the title of a [List](#list). <br/> `{userseed}` is a freetext string to seed the random element. <br/> `{datestring}` is is the date for the element in the format `YYY-MM-DD`. |


# Datamodel
## List

| Field | Type |
|--------|--------|
| title | string |
| elements | [ListElement](#listelement)[] |

## ListElement

| Field | Type |
|--------|--------|
| title | string |
| weight |  integer (optional) |
| imageurl | string |
| description | string |

## PickedElement

| Field | Type |
|--------|--------|
| date | Date |
| element | [ListElement](#listelement) |
