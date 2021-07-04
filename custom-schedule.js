var customSchedule = [];
var periodCounter = 1;
var homeroomLengthValue = 20;
var homeroomLengthName = '20 minutes 分';
var periodLengthValues = [40, 45, 50];
var periodLengthNames = ['40 minutes 分', '45 minutes 分', '50 minutes 分'];
var breakLengthValues = [10, 15];
var breakLengthNames = ['10 minutes 分', '15 minutes 分'];
var lunchLengthValues = [35, 40, 45];
var lunchLengthNames = ['35 minutes 分', '40 minutes 分', '45 minutes 分'];
var postLunchLength = 5;
var cleaningLengthValue = 15;
var cleaningLengthName = '15 minutes 分';

document.addEventListener('DOMContentLoaded', function () {
    customTimeDropdown();
});

function initiateCustomSchedule() {
    customTimeDropdown();
    document.getElementById("default-schedule").classList.add("d-none");
    document.getElementById("custom-schedule").classList.remove("d-none");
}

function customTimeDropdown() {    
    var rawItemType = document.getElementById("customItemType");
    var rawItemTime = document.getElementById("customItemTime");
    var itemType = rawItemType.options[rawItemType.selectedIndex].value;

    var length = rawItemTime.options.length;
    for (i = length-1; i >= 0; i--) {
        rawItemTime.options[i] = null;
    }

    if (itemType.includes("Homeroom")) {
        var option = document.createElement('option');
        option.value = homeroomLengthValue;
        option.innerHTML = homeroomLengthName;
        rawItemTime.appendChild(option);
    } else if (itemType.includes("Period")) {
        for (var i = 0; i < periodLengthValues.length; i++){
            var option = document.createElement('option');
            option.value = periodLengthValues[i];
            option.innerHTML = periodLengthNames[i];
            rawItemTime.appendChild(option);
        }
        rawItemTime.value=50;
    } else if (itemType.includes("Break")) {
        for (var i = 0; i < breakLengthValues.length; i++){
            var option = document.createElement('option');
            option.value = breakLengthValues[i];
            option.innerHTML = breakLengthNames[i];
            rawItemTime.appendChild(option);
        }
        rawItemTime.value=10;
    } else if (itemType.includes("Lunch")) {
        for (var i = 0; i < lunchLengthValues.length; i++){
            var option = document.createElement('option');
            option.value = lunchLengthValues[i];
            option.innerHTML = lunchLengthNames[i];
            rawItemTime.appendChild(option);
        }
        rawItemTime.value=45;
    } else if (itemType.includes("Cleaning")) {
        var option = document.createElement('option');
        option.value = cleaningLengthValue;
        option.innerHTML = cleaningLengthName;
        rawItemTime.appendChild(option);
    }
}

function addItemToSchedule() {
    var rawItemType = document.getElementById("customItemType");
    var rawItemTime = document.getElementById("customItemTime");
    var itemType = rawItemType.options[rawItemType.selectedIndex].value;
    var itemTime = rawItemTime.options[rawItemTime.selectedIndex].value;

    compileSchedule(itemType, itemTime);
}

function compileSchedule(itemType, itemTime) {
    previousItem = customSchedule[customSchedule.length-1];
    //inital item initiator
    if (previousItem == undefined) {
        customSchedule.push({
            "name": itemType,
            "startTime": moment({hour: 8, minute: 25}),
            "endTime": moment({hour: 8, minute: 25}).add(itemTime, 'm'),
            "duration": itemTime
        })
    } else {
        if (itemType.includes("Period")) {
            customSchedule.push({
                "name": 'Period ' + periodCounter + ' - ' + getJpNum(periodCounter) + ' 時限',
                "startTime": previousItem["endTime"],
                "endTime": previousItem["endTime"].clone().add(itemTime, 'm'),
                "duration": itemTime
            })
            periodCounter++;
        } else {
            customSchedule.push({
                "name": itemType,
                "startTime": previousItem["endTime"],
                "endTime": previousItem["endTime"].clone().add(itemTime, 'm'),
                "duration": itemTime
            })
        }
        previousItem = customSchedule[customSchedule.length-1];
        if (itemType.includes("Lunch")) {
            customSchedule.push({
                "name": "Break - 予鈴",
                "startTime": previousItem["endTime"],
                "endTime": previousItem["endTime"].clone().add(postLunchLength, 'm'),
                "duration": '5'
            })
        }
    }
    printCustomSchedule();
}

function showRemoveButton(item) {
    element = document.getElementById("custom-schedule-item-remove-" + item);
    element.classList.remove("d-none");
    element.focus();
}

function hideRemoveButton(item) {
    element = document.getElementById("custom-schedule-item-remove-" + item);
    element.classList.add("d-none");
}

function removeItemFromSchedule(item) {
    customSchedule.splice(item, 1);
    adjustedCustomSchedule = []
    periodCounter = 1;
    for (var i = 0; i < customSchedule.length; i++) {
        if (customSchedule[i]["name"].includes("Period")) {
            previousItem = customSchedule[i-1];
            adjustedCustomSchedule.push({
                "name": itemType + ' ' + periodCounter,
                "startTime": previousItem["endTime"],
                "endTime": previousItem["endTime"].clone().add(itemTime, 'm'),
                "duration": itemTime
            })
        } else {
            adjustedCustomSchedule[i] = item;
        }
    }
    printCustomSchedule();
}

function cancelCustomSchedule() {
    customSchedule = [];
    customOutput.innerHTML = "";
    document.getElementById("default-schedule").classList.remove("d-none");
    document.getElementById("custom-schedule").classList.add("d-none");
}

function completeCustomSchedule() {
    customSchedule.push({
        "name": 'End of School - 終鈴'
    })
    document.getElementById("default-schedule").classList.remove("d-none");
    document.getElementById("custom-schedule").classList.add("d-none");
    importSchedule(customSchedule);
}

function printCustomSchedule() {
    var customOutput = document.getElementById("output-custom");
    var periodCounter = 1;
    var totalResult = "";

    for (var i = 0; i < customSchedule.length; i++) {
		var item = customSchedule[i];
        var result = '<div class="button-wrapper position-relative">';
        if (item["name"].includes("Homeroom")) {
            result += '<button class="btn btn-warning w-100 p-0 mb-1"';
        } else if (item["name"].includes("Period")) {
            result += '<button class="btn btn-success w-100 p-0 mb-1"';
        } else {
            result += '<button class="btn btn-primary w-100 p-0 mb-1"'
        }
        result += 'onclick="showRemoveButton(' + i + ');">';
        result += '<div class="row g-0"><div class="col-6"><div class="card-body">';
        result += '<h2 class="m-0 fs-6 d-inline">'+ item["name"] + '</h2>';
        result += '</div></div>'
        result += '<div class="col-6"><div class="card-body"><p class="card-text">';
        result += item["startTime"].format('HH:mm') + " ~ " + item["endTime"].format('HH:mm') + ' (' + item["duration"] + ' minutes 分)</p>';
        result += '</div></div></div></button>';

        result += '<button id="custom-schedule-item-remove-' + i + '" class="btn w-100 p-0 mb-1 text-white d-none custom-item-remove"';
        result += 'onclick="removeItemFromSchedule(' + i + ');"  onfocusout="hideRemoveButton(' + i + ')">';
        result += '<div class="card bg-danger"><div class="row g-0"><div class="col"><div class="card-body">';
        result += '<i class="bi bi-x"></i></div></div></div></div></button>';

        result += '</div>';
        totalResult += result;
    }
    customOutput.innerHTML = totalResult;
}
