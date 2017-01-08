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

window.onload = function() {
    var url = "http://api.nuevents.seanyeh.com/search?q='" + QUERIES.join("'&q='") + "'";
    $.getJSON(url, function(data){
        console.log("Received data!");
        console.log(data);

        // Sort data
        data.sort(function(item1, item2) {
            var d1 = new Date(item1.datetime.start);
            var d2 = new Date(item2.datetime.start);

            return d1 - d2;
        });

        for (var i = 0; i < data.length; i++){
            addItem(data[i]);
        }
    });
};
