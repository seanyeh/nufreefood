/*
 * These are the manual overrides.
 * Remove false positives and add new events
 *   Currently, can only add new events that were previously removed
 */
var OVERRIDES = [
    // 1/20/17
    {remove: true, id: 498333},

    // Duplicate of 511667
    {remove: true, id: 512460},

    // For all of winter quarter?
    {remove: true, text: "data as art exhibition"},
    {add: true, id: 509629}, // 1/20/17
];


var QUERIES = [
    "will be served",
    "pizza",
    "refreshments",
    "snacks",
    "cookies",
    "reception",
    "lunch will be",
    "dinner will be",
    "food will be",
    "drinks will be",
    "food until",
    "free food",
    "food provided",
    "malnati",
    "giordano",
    "ice cream",
    "popcorn",
    "cotton candy",
    "take care of food",
    "dessert",
];

var MONTHS = [
    "Jan", "Feb", "Mar", "Apr",
    "May", "Jun", "Jul", "Aug",
    "Sep", "Oct", "Nov", "Dec"
];

var DAYS = [
    "Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"
];


/*
 * Create DOM elements from an array of strings, and add them to a parent
 * element
 */
function _mapDOM(arr, parentElement, newElement) {
    var text;
    for (var i = 0; i < arr.length; i++) {
        text = arr[i];
        parentElement.append($(newElement).text(text));
    }
}

function toHumanTime(date) {
    var ampm = "AM";

    var m = (date.getMinutes() < 10? "0":"") + date.getMinutes();

    // Convert hours to human readable
    var h = date.getHours();
    if (h > 12){
        h -= 12;
        ampm = "PM";
    }
    else if (h === 12){
        ampm = "PM";
    }
    else if (h === 0){
        h = "12";
    }

    return "" + h + ":" + m + " " + ampm;
}


function addItem(item) {
    var itemDiv = $("<div id='" + item.id + "' class='block-group item'>");
    var dateDiv = $("<div class='block date'>");
    var descDiv = $("<div class='block desc'>");

    // -- Date and Time --
    var itemDate = new Date(item.datetime.start);

    // If event is in past, do not add
    if (new Date() > new Date(item.datetime.end)) {
        return;
    }

    var month = MONTHS[itemDate.getMonth()];
    var day = DAYS[itemDate.getDay()];
    var num = itemDate.getDate();

    dateDiv.append($("<div class='date-month'>").text(month));
    dateDiv.append($("<div class='date-num'>").text(num));
    dateDiv.append($("<div class='date-time'>").text(day));
    dateDiv.append($("<div class='date-time'>").text(toHumanTime(itemDate)));


    // -- Title and Description --
    var link = $("<a>").attr("href", item.url).text(item.title);
    descDiv.append($("<h2>").append(link));

    // Info for location
    var locationDiv = $("<div class='location'>");

    if (item.location) {
        _mapDOM(item.location.address, locationDiv, "<div>");
    }
    descDiv.append(locationDiv);

    // Show/hide description toggle
    var toggleLink = $("<a class='desc-toggle'>").text("Show description").attr("href", "#").click(function(e){
        var state = $(this).text();
        var div = $("#" + item.id).find(" .desc-text");
        if (state === "Show description") {
            div.show();
            $(this).text("Hide description");
        }
        else {
            div.hide();
            $(this).text("Show description");
        }

        return false;
    });
    descDiv.append($("<div class='div-toggle'>").append(toggleLink));

    var descTextDiv = $("<div class='desc-text'>");
    _mapDOM(item.description, descTextDiv, "<p>");
    descDiv.append(descTextDiv);

    itemDiv.append(dateDiv);
    itemDiv.append(descDiv);

    $("#main").append(itemDiv);
}

function createFilterFunc(overrideObj) {
    return function(obj) {
        // If checking on id
        if (overrideObj.id) {
            return obj.id !== overrideObj.id;
        }

        // If checking title + description
        if (overrideObj.text) {
            console.log("checking text");
            var desc = obj.description.join(" ");
            return !(new RegExp(overrideObj.text, "i")).test(obj.title + " " + desc);
        }
    };
}

function createFindByID(id) {
    return function(obj) {
        return obj.id === id;
    };
}

function displayData(data) {
    // Sort data
    data.sort(function(item1, item2) {
        var d1 = new Date(item1.datetime.start);
        var d2 = new Date(item2.datetime.start);

        return d1 - d2;
    });

    for (var i = 0; i < data.length; i++) {
        addItem(data[i]);
    }
}

window.onload = function() {
    var url = "https://api.nuevents.seanyeh.com/search?q='" + QUERIES.join("'&q='") + "'";
    $.getJSON(url, function(data){
        console.log("Received data!");
        console.log(data);

        // Apply manual overrides
        var cur, newItem;
        var newData = data;
        for (var i = 0; i < OVERRIDES.length; i++) {
            cur = OVERRIDES[i];

            // Remove false positives
            if (cur.remove) {
                newData = newData.filter(createFilterFunc(cur));
            }
            // Add extra events
            if (cur.add) {
                newItem = data.find(createFindByID(cur.id));
                newData.push(newItem);
            }
        }

        displayData(newData);
    });
};
