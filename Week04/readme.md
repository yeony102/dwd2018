# Week04: AJAX with JQuery
* http://yhl438.itp.io:8080/
* 22/02/2018: Failed to get the information from the API. The console complains that there is an unexpected token ':' though I don't understand what it means because I can't see any syntax error realated to ':'
* 28/02/2018: changed 'jsonp' to 'json' in ajax.js file and the problem has solved. The access was originally denied with 'json'. That was the reason that I used jsonp instead of json , though for some reason, it showed the unexpected token error with 'jsonp' and started to work when I changed it back to 'json'