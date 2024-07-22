// Compiled using undefined undefined (TypeScript 4.9.5)
function main() {
    var sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
    var range = sheet.getDataRange();
    var array = range.getValues();
    var choreArray = array[0]; // ['Trash', 'Bathroom', 'Floor', 'Dishes']
    var nameArray = array[1]; // ['Adit', 'Abe', 'Josh', 'Enoch']
    var returnString = "";
    returnString += "<p><strong>Chores:</strong><br><br>"; 
    for (var i = 0; i < choreArray.length; i++) {
        returnString += "<strong>" + choreArray[i] + ":</strong> " + nameArray[i] + "<br>";
    }
    returnString += "</p>";

    // Fetch a random dog image URL using the Dog CEO API
    var dogApiUrl = "https://dog.ceo/api/breed/shiba/images/random";
    var dogResponse = UrlFetchApp.fetch(dogApiUrl); // Make the HTTP GET request
    var dogJson = JSON.parse(dogResponse.getContentText()); // Parse the JSON response
    var imageUrl = dogJson.message; // Extract the image URL from the JSON

    returnString += "<p><strong>Here's a random Shiba image to brighten your day:</strong></p>";
    returnString += "<img src='" + imageUrl + "' alt='Random Shiba' style='width:300px;height:auto;'><br>";

    // Fetch a quote using the Quote API
    var category = 'happiness';
    var quoteApiUrl = 'https://api.api-ninjas.com/v1/quotes?category=' + category;
    try {
        var quoteResponse = UrlFetchApp.fetch(quoteApiUrl, {
            method: 'GET',
            headers: { 'X-Api-Key': 'O1hqdkyVYugsIM6dwJ5F4Q==oYxj2wrSMkVpv72A' },
            muteHttpExceptions: true
        }); // Make the HTTP GET request
        var quoteJson = JSON.parse(quoteResponse.getContentText()); // Parse the JSON response
        if (quoteJson.error) {
            throw new Error(quoteJson.error);
        }
        var quote = quoteJson[0].quote; // Extract the quote from the JSON
        var author = quoteJson[0].author; // Extract the author from the JSON

        returnString += "<p><strong>Quote of the day:</strong></p>";
        returnString += "<blockquote>" + quote + "<br>- " + author + "</blockquote>";
    } catch (error) {
        console.error('Error fetching quote:', error.message);
        returnString += "<p>Could not fetch quote of the day.</p>";
    }

    var emailString = "joshschang@berkeley.edu, estseng@berkeley.edu, abrahamkwok628@gmail.com, aditgupta.agupta@gmail.com";
    var weekString = "[IMPORTANT] Apt 306 Chores: " + new Date().toDateString();
    console.log(weekString);
    console.log(returnString);

    MailApp.sendEmail({to: emailString, subject: weekString, htmlBody: returnString});

    var backEl = nameArray.pop();
    var backElArray = [backEl];
    var updateArray = backElArray.concat(nameArray);
    range.setValues([choreArray, updateArray]);
}
