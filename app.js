var QUERIES = [
    "will be served",
    "free+dinner",
    "pizza",
    "refreshments",
    "snacks",
    "cookies",
    "reception",
    "lunch will be",
];

function addItem(item) {
    var itemDiv = $("<div class='block-group'>");
    var dateDiv = $("<div class='block date'>");
    var descDiv = $("<div class='block desc'>");

    var itemDate = new Date(item.datetime.start);

    var month = itemDate.toLocaleString("en-us", {"month":"short"});
    var num = itemDate.getDate();
    dateDiv.append($("<div class='date-month'>").text(month));
    dateDiv.append($("<div class='date-num'>").text(num));


    // Title and Description
    descDiv.append($("<h2>").text(item.title));


    var tempDesc;
    for (var i = 0; i < item.description.length; i++) {
        tempDesc = item.description[i];
        descDiv.append($("<p>").text(tempDesc));
    }

    itemDiv.append(dateDiv);
    itemDiv.append(descDiv);

    $("#main").append(itemDiv);

}

window.onload = function() {
    var url = "http://api.nuevents.seanyeh.com/search?q=" + QUERIES.join("&q=");
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
