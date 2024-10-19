function main() {
  var spreadsheet = SpreadsheetApp.getActiveSpreadsheet();
  var sheet = spreadsheet.getSheetByName("Chores");
  if (!sheet) {
    Logger.log("Chores sheet not found");
    return;
  }
  var range = sheet.getDataRange();
  var array = range.getValues();
  var choreArray = array[0]; // ['Trash', 'Bathroom', 'Floor', 'Dishes']
  var nameArray = array[1]; // ['Adit', 'Abe', 'Josh', 'Enoch']

  // Create a new form
  var form = FormApp.create(
    "Apt 306 Chores Rating - Week of " + new Date().toDateString()
  );
  form
    .addPageBreakItem()
    .setHelpText(
      "Please rate performance (including your own), on the chores done last week."
    );

  // Add questions to the form for each chore
  for (var i = 0; i < choreArray.length; i++) {
    form
      .addPageBreakItem()
      .setTitle(choreArray[i] + " Section")
      .setHelpText(
        "Please rate " + nameArray[i] + "'s performance on " + choreArray[i]
      );
    form
      .addMultipleChoiceItem()
      .setTitle("Rate cleanliness (" + nameArray[i] + ")")
      .setChoiceValues([
        "1 - Poor",
        "2 - Below Average",
        "3 - Average",
        "4 - Good",
        "5 - Excellent",
      ]);
    form
      .addMultipleChoiceItem()
      .setTitle("Rate timeliness (" + nameArray[i] + ")")
      .setChoiceValues([
        "1 - Poor",
        "2 - Below Average",
        "3 - Average",
        "4 - Good",
        "5 - Excellent",
      ]);
  }

  // Rotate the chore assignments after creating form
  var backEl = nameArray.pop();
  var backElArray = [backEl];
  var updateArray = backElArray.concat(nameArray);
  range.setValues([choreArray, updateArray]);

  //update the variables
  var range = sheet.getDataRange();
  var array = range.getValues();
  var choreArray = array[0]; // ['Trash', 'Bathroom', 'Floor', 'Dishes']
  var nameArray = array[1]; // ['Enoch','Adit', 'Abe', 'Josh'] ENOCH MOVED TO BACK OF QUEUE

  // Get the form's URL to include in the email
  var formUrl = form.getPublishedUrl();

  var returnString = "<p><strong>Chores for this week:</strong><br><br>";
  for (var i = 0; i < choreArray.length; i++) {
    returnString +=
      "<strong>" + choreArray[i] + ":</strong> " + nameArray[i] + "<br>";
  }
  returnString += "</p>";

  returnString +=
    "<p><strong>Please rate everyone's performance for the week:</strong></p>";
  returnString +=
    "<p>Fill out the form here: <a href='" +
    formUrl +
    "'>Chore Rating Form</a></p>";

  // Add random dog image to email
  var dogApiUrl = "https://dog.ceo/api/breed/shiba/images/random";
  var dogResponse = UrlFetchApp.fetch(dogApiUrl);
  var dogJson = JSON.parse(dogResponse.getContentText());
  var imageUrl = dogJson.message;

  returnString +=
    "<p><strong>Here's a random Shiba image to brighten your day:</strong></p>";
  returnString +=
    "<img src='" +
    imageUrl +
    "' alt='Random Shiba' style='width:300px;height:auto;'><br>";

  // Add quote of the day
  var category = "happiness";
  var quoteApiUrl = "https://api.api-ninjas.com/v1/quotes?category=" + category;
  try {
    var quoteResponse = UrlFetchApp.fetch(quoteApiUrl, {
      method: "get",
      headers: { "X-Api-Key": "O1hqdkyVYugsIM6dwJ5F4Q==oYxj2wrSMkVpv72A" },
      muteHttpExceptions: true,
    });
    var quoteJson = JSON.parse(quoteResponse.getContentText());
    var quote = quoteJson[0].quote;
    var author = quoteJson[0].author;

    returnString += "<p><strong>Quote of the day:</strong></p>";
    returnString +=
      "<blockquote>" + quote + "<br>- " + author + "</blockquote>";
  } catch (error) {
    returnString += "<p>Could not fetch quote of the day.</p>";
  }

  // Send the email, estseng@berkeley.edu, abrahamkwok628@gmail.com, aditgupta.agupta@gmail.com
  var emailString =
    "joshschang@berkeley.edu, estseng@berkeley.edu, abrahamkwok628@gmail.com, aditgupta.agupta@gmail.com";
  var weekString = "[IMPORTANT] Apt 306 Chores: " + new Date().toDateString();

  MailApp.sendEmail({
    to: emailString,
    subject: weekString,
    htmlBody: returnString,
  });
}

function calculateAverages() {
  var spreadsheet = SpreadsheetApp.getActiveSpreadsheet();
  var responseSheet = spreadsheet.getSheetByName("Form Responses 8"); // This should be the name of the responses sheet
  if (!responseSheet) {
    Logger.log("Response sheet not found");
    return;
  }

  var dataRange = responseSheet.getDataRange(); // Get all the responses data
  var data = dataRange.getValues(); // Array of responses data

  if (data.length < 2) {
    Logger.log("No responses found");
    return;
  }

  // Get the headers from the first row (question titles)
  var headers = data[0];

  // Create a new sheet for averages or clear an existing one
  var averageSheet = spreadsheet.getSheetByName("Averages");
  if (!averageSheet) {
    averageSheet = spreadsheet.insertSheet("Averages");
  } else {
    averageSheet.clear(); // Clear existing data in case the sheet already exists
  }

  // Write headers for the Averages sheet
  averageSheet.appendRow(["Name", "Average Rating"]);

  // Loop through each question (each person to rate) starting from the 2nd column
  for (var col = 1; col < headers.length; col++) {
    var personName = headers[col]; // The name of the person or chore being rated
    var totalRatings = 0;
    var numberOfRatings = 0;

    // Loop through each response row to collect the ratings for this person
    for (var row = 1; row < data.length; row++) {
      var rating = data[row][col];

      if (rating !== "") {
        // Ensure the rating is not blank
        totalRatings += parseInt(rating);
        numberOfRatings++;
      }
    }

    // Calculate the average rating for this person
    var averageRating =
      numberOfRatings > 0 ? (totalRatings / numberOfRatings).toFixed(2) : 0;

    // Write the person's name and average rating to the Averages sheet
    averageSheet.appendRow([personName, averageRating]);
  }

  Logger.log("Averages calculated and updated in the Averages sheet.");
}
