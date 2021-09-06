var setPeriodLength = 50;
var setBreakLength = 10;
var homeroomLength = 20;
var lunchLength = 45;
var postLunchLength = 5;
var cleaningLength = 15;
var optionLunch;
var optionCleaning;

var weekdayItems = ["Homeroom - 朝礼","Period 1 - １時限","Break - 休み","Period 2 - ２時限","Break - 休み","Period 3 - ３時限","Break - 休み","Period 4 - ４時限","Lunch - 昼休み","Break - 予鈴","Period 5 - ５時限","Break - 休み","Period 6 - ６時限","Afternoon Homeroom - 終礼","Cleaning - 掃除","End of School - 終鈴"]
var weekendItems = ["Homeroom - 朝礼","Period 1 - １時限","Break - 休み","Period 2 - ２時限","Break - 休み","Period 3 - ３時限","Break - 休み","Period 4 - ４時限","Afternoon Homeroom - 終礼","Cleaning - 掃除","End of School - 終鈴"]

var schedule = [];
var morningHomeroom;

var currentItem;
var weekdayOrEnd;

moment.relativeTimeThreshold('m', 60*24*30*12);

document.addEventListener('DOMContentLoaded', function () {
	importFromCookies();
	createDefaultSchedule();
	printCurrentTime();
	printDefaultSchedule();
	console.log("ready!");
});

setInterval(function() {
	printCurrentTime();

	// Time debugger
	// var temp = moment().subtract(30, 'minutes');

	// Update timetable only during school timing
	if (moment().isBetween(schedule[0]["startTime"], schedule[schedule.length-1]["endTime"])) {
		// Trigger on day start. Current period/break has ended, roll into next slot. 
		if (currentItem == null || moment().isSameOrAfter(currentItem["endTime"])) {
			printDefaultSchedule();
		}
		printCurrentProgress();
	}
	// Reset schedule for new day
	if (moment().isAfter(schedule[0]["startTime"], 'day')) {
		createDefaultSchedule();
		printDefaultSchedule();
	}
}, 1000); 

function setCookies() {
	var expiryDate = new Date();
	expiryDate.setMonth(expiryDate.getMonth() + 1);

	document.cookie = "setPeriodLength=" + setPeriodLength + "; expires=" + expiryDate;
	document.cookie = "setBreakLength=" + setBreakLength + "; expires=" + expiryDate;
	document.cookie = "optionLunch=" + optionLunch + "; expires=" + expiryDate;
	document.cookie = "optionCleaning=" + optionCleaning + "; expires=" + expiryDate;
}

function getCookie(cname) {
	var name = cname + "=";
	var decodedCookie = decodeURIComponent(document.cookie);
	var ca = decodedCookie.split(';');
	for(var i = 0; i <ca.length; i++) {
		var c = ca[i];
		while (c.charAt(0) == ' ') {
			c = c.substring(1);
		}
		if (c.indexOf(name) == 0) {
			return c.substring(name.length, c.length);
		}
	}
	return "";
}

function importFromCookies() {
	if (moment().days() > 0 && moment().days() < 6) {
		weekdayOrEnd = 'weekday';
	} else {
		weekdayOrEnd = 'weekend';
	}

	if (document.cookie) {
		setPeriodLength = getCookie("setPeriodLength");
		setBreakLength = getCookie("setBreakLength");
		optionLunch = getCookie("optionLunch");
		optionCleaning = getCookie("optionCleaning");

	    document.getElementById("periodLength").value = setPeriodLength;
	    document.getElementById("breakLength").value = setBreakLength;
		document.getElementById("optionLunch").checked = optionLunch;
		document.getElementById("optionCleaning").checked = optionCleaning;
	} else {
		var initialSetupModal = new bootstrap.Modal(document.getElementById("initialSetupModal"));
		initialSetupModal.show();
	}
}

function setPeriodBreakLengths() {
	var selectPeriodLength = document.getElementById("periodLength");
	setPeriodLength = selectPeriodLength.options[selectPeriodLength.selectedIndex].value;

	var selectBreakLength = document.getElementById("breakLength");
	setBreakLength = selectBreakLength.options[selectBreakLength.selectedIndex].value;
	setCookies();
	createDefaultSchedule();
	printDefaultSchedule();
}

function setOptions() {
	optionLunch = document.getElementById("optionLunch").checked;
	optionCleaning = document.getElementById("optionCleaning").checked;

	setCookies();
	createDefaultSchedule();
	printDefaultSchedule();
}

function setModalPeriodBreakLengths() {
	var selectModalPeriodLength = document.getElementById("modalPeriodLength");
	setPeriodLength = selectModalPeriodLength.options[selectModalPeriodLength.selectedIndex].value;

	var selectModalBreakLength = document.getElementById("modalbreakLength");
	setBreakLength = selectModalBreakLength.options[selectModalBreakLength.selectedIndex].value;

    document.getElementById("periodLength").value = setPeriodLength;
    document.getElementById("breakLength").value = setBreakLength;

	setCookies();
	createDefaultSchedule();
	printDefaultSchedule();
}

function printCurrentTime() {
	var currentDay = document.getElementById("currentDay");
	currentDay.innerHTML = moment().format('dddd');

	var currentDayJp = document.getElementById("currentDayJp");
	currentDayJp.innerHTML = getJpDay();

	var currentTime = document.getElementById("currentTime");
	currentTime.innerHTML = moment().format('HH:mm:ss');
}

function createDefaultSchedule() {
	if (weekdayOrEnd === "weekday") {
		var dayItems = weekdayItems;
	} else {
		var dayItems = weekendItems;
	}

	schedule.length = 0;
	morningHomeroom = moment({hour: 8, minute: 25});

	schedule.push({
		"name": dayItems[0],
		"startTime": morningHomeroom,
		"endTime": morningHomeroom.clone().add(homeroomLength, 'm'),
	})

	var j = 1;
	for (var i = 1; i < dayItems.length; i++) {
		previousItem = schedule[j-1];

		if (dayItems[i].includes("Period")) {
			schedule[j] = {
				"name": dayItems[i],
				"startTime": previousItem["endTime"],
				"endTime": previousItem["endTime"].clone().add(setPeriodLength, 'm')
			}
		} else if (dayItems[i].includes("Break")) {
			schedule[j] = {
				"name": dayItems[i],
				"startTime": previousItem["endTime"],
				"endTime": previousItem["endTime"].clone().add(setBreakLength, 'm')
			}
		} else if (dayItems[i].includes("Homeroom")) {
			schedule[j] = {
				"name": dayItems[i],
				"startTime": previousItem["endTime"],
				"endTime": previousItem["endTime"].clone().add(homeroomLength, 'm')
			}
		} else if(dayItems[i].includes("Lunch") && optionLunch) {
			schedule[j] = {
				"name": dayItems[i],
				"startTime": previousItem["endTime"],
				"endTime": previousItem["endTime"].clone().add(lunchLength, 'm')
			}

			schedule[i+1] = {
				"name": dayItems[i+1],
				"startTime": schedule[i]["endTime"],
				"endTime": schedule[i]["endTime"].clone().add(postLunchLength, 'm')
			}
			i++;
		} else if (dayItems[i].includes("Cleaning") && optionCleaning) {
			schedule[j] = {
				"name": dayItems[i],
				"startTime": previousItem["endTime"],
				"endTime": previousItem["endTime"].clone().add(cleaningLength, 'm')
			}
		} else if (dayItems[i].includes("End")) {
			schedule[j] = {
				"name": dayItems[i],
				"startTime": previousItem["endTime"],
				"endTime": previousItem["endTime"].clone().add(10, 'm')
			}
		} else {
			j--;
		}
		j++;
	}
}

function printDefaultSchedule() {
	var output = document.getElementById("output");
	output.innerHTML = "";

	var totalResult = "";
	var currentSlot = false;
	var pastSlot = true;
	var now = moment();

	//time debugger
	// var now = moment().subtract(30, 'minutes');
	// var now = moment({hour: 9, minute: 30});

	if (now.isBefore(morningHomeroom)) {
		pastSlot = false;
	}

	for (var i = 0; i < schedule.length-1; i++) {

		var item = schedule[i];
		var result = '';

		currentSlot = (now.isBetween(item["startTime"], item["endTime"], undefined, '[)'));

		if (!item["name"].includes("Break")) { //period
			if (currentSlot) {
				result += '<div class="card mb-1 bg-success bg-gradient text-white current-slot">';
				pastSlot = false;
			} else if (pastSlot) {
				result += '<div class="card mb-1 bg-secondary text-white-50 past-slot">';
			} else {
				result += '<div class="card mb-1 bg-light future-slot">';
			}

			result += '<div class="row g-0"><div class="col-6"><div class="card-body">';
			result += '<h2 class="m-0 fs-6 d-inline">'+ item["name"] + '</h2>';
			result += '</div></div><div class="col-6"><div class="card-body"><p class="card-text">';
			result += item["startTime"].format('HH:mm') + " ~ " + item["endTime"].format('HH:mm') + '</p>';
			result += '</div></div></div>';
		} else { //break
			if (currentSlot) {
				result += '<div class="card mb-1 bg-primary bg-gradient text-white">';
				result += '<div class="row g-0">';
				result += '<div class="col"><div class="card-body">';
				result += '<p class="m-0 fs-6">'+ item["name"] + '</p>';
				result += '</div></div></div>';
				pastSlot = false;
			}
		}

		//current slot countdown details
		if (currentSlot) {
			currentItem = schedule[i];
			if (!item["name"].includes("Break")) {
				result += '<div class="row g-0 bg-white text-success">';
			} else {
				result += '<div class="row g-0 bg-white text-primary">';
			}
			result += '<div class="col-6"><div class="card-footer">';
			result += '<p class="m-0">Since start 開始から<br><b><span id="elapsedTime">00:00:00</span> 分</b></p>'
			result += '</div></div><div class="col-6"><div class="card-footer">'
			result += '<p class="m-0">Till end 終了まで<br><b><span id="remainingTime">00:00:00</span> 分</b></p>'
			result += '</div></div></div>';
			result += '<div class="row g-0">';
			result += '<div class="progress" style="height: 5px;">';
			if (!item["name"].includes("Break")) {
				result += '<div id="progressBar" class="progress-bar bg-success" style="width: 0%" role="progressbar"></div>';
			} else {
				result += '<div id="progressBar" class="progress-bar bg-primary" style="width: 0%" role="progressbar"></div>';
			}
			result += '</div></div>';
		}

		result += '</div>';
		totalResult += result;
		currentSlot = false;
	}

	//end of school
	var lastItem = schedule[schedule.length-1];
	if (pastSlot) {
		result = '<div class="card mb-1 bg-warning">';
		currentItem = null;
	} else {
		result = '<div class="card mb-1 bg-light">';
	}
	result += '<div class="row g-0"><div class="col"><div class="card-body">';
	result += '<h2 class="m-0 fs-6">'+ lastItem["name"] + '</h2>';
	result += '</div></div></div>';
	totalResult += result;

	output.innerHTML = totalResult;
}

function printCurrentProgress() {
	var elapsedTime = document.getElementById("elapsedTime");
	elapsedTime.innerHTML = currentItem["startTime"].fromNow(true);

	var remainingTime = document.getElementById("remainingTime");
	remainingTime.innerHTML = currentItem["endTime"].fromNow(true);

	var milliCurrent = moment().unix();
	var milliStart = currentItem["startTime"].unix();
	var milliEnd = currentItem["endTime"].unix();
	var percent = ((milliCurrent - milliStart) / (milliEnd - milliStart)) * 100;

	var progressBar = document.getElementById("progressBar");
	progressBar.style.width = percent+"%";
}

function testing() {
	var now = moment();
	var result = now.isBetween(moment({hour: 8, minute: 0}), moment({hour: 9, minute: 0}));
	console.log(result);
}
