var storage = chrome.storage.local;
var timeout = 0;
// var timeout = 2500;

function debug(message) {
	// console.log("LazyRMC: " + message);
}

var pathname = jQuery(location).attr('pathname'); 
debug("pathname: " + pathname);
if(pathname == "/sdas.php") {
	// already logged in, check for seamless re-login
	debug("Already logged in");
	storage.get(null, function(values){
		values.error = "";
		var timeElapsed = new Date().getTime() - values.lastlogin;
		var timeRemaining = (4*60+50)*60*1000 - timeElapsed;
		debug("Time Elapsed: "+timeElapsed);
		debug("Time Remaining(plugin): "+timeRemaining);
		if (timeRemaining <= 0) {
			// 4 hours 50 minutes already, auto logout the user
			window.location = "https://10.0.0.1/sdalogoff.php";
		}
		storage.set(values,
	        function(){}
	    );
	});
	// sometimes due to some reasons the page doesn't refresh, refresh manually
	setTimeout(function(){window.location.reload();}, 5*60*1000);
} else if(pathname == "/sdalogon.php") {
	// perform automatically login
	debug("Automatically fill form and login");
	storage.get(null, function(values){
		if (values.username != "" && values.password != "") {
			jQuery("input[name=username]").val(values.username);
			jQuery("input[name=password]").val(values.password);
			// submit form only when user check enable auto login
			if (values.autologin == "enable") {
				debug("values.error: "+values.error);
				if (values.error == "alreadyloggedin") {
					// user already logged in, retry every minute
					debug("Retry every minute");
					setTimeout(function(){
						jQuery("form[name=frmSDALogon]").submit();
					}, 1000*60);
				} else if (values.error == "network") {
					// network error, retry every 5 minutes
					debug("Retry every 5 minutes");
					setTimeout(function(){
						jQuery("form[name=frmSDALogon]").submit();
					}, 1000*60*5);
				} else if (values.error != "username" && values.error != "passwordorquota") {
					jQuery("form[name=frmSDALogon]").submit();
				} else {
					debug("Auto login disabled because username or password is incorrect");
				}
			}
		}
	});
} else if(pathname == "/sdalogon_ok.php"){
	// login success, do nothing
	debug("Login success");
	storage.get(null, function(values){
		values.error = "";
		values.lastlogin = new Date().getTime();
		storage.set(values,
	        function(){}
	    );
	});
} else if(pathname == "/sdalogon_fail.php"){
	var search = jQuery(location).attr("search");
	debug("search = " + search);
	// incorrect username or password, stop auto login
	storage.get(null, function(values){
		debug(pathname);
		if (search == "?reason=-1") {
			// incorrect username
			values.error = "username";
		} else if (search == "?reason=-2") {
			// network error
			values.error = "network";
		} else if (search == "?reason=-3") {
			// incorrect password or run out of quota
			values.error = "passwordorquota";
		} else if (search == "?reason=-4") {
			// already logged in somewhere else
			debug("already logged in");
			values.error = "alreadyloggedin";
		}
		storage.set(values,
	        function(){}
	    );
		setTimeout(function(){
			window.location = "https://10.0.0.1/sdalogon.php";
		}, 2500);
	});
} else if(pathname == "/sdalogoff_ok.php"){
	debug("Logoff success");
	storage.get(null, function(values){
		values.error = "";
		values.lastlogin = 0;
		storage.set(values,
	        function(){}
	    );
	});
	setTimeout(function(){
		window.location = "https://10.0.0.1/sdalogon.php";
	}, timeout);
}