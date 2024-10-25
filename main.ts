function main(): void {
  const spreadsheet = SpreadsheetApp.openById(
    "1nvoB2QxuOM_3_9LFGrRh8ICTtvYr3jdDkzNuIbEOUFM"
  );
  const sheet = spreadsheet.getSheetByName("Chores");
  if (!sheet) {
    console.log("Chores sheet not found");
    return;
  }
  const range = sheet.getDataRange();
  const array = range.getValues();
  const choreArray: string[] = array[0]; // ['Trash', 'Bathroom', 'Floor', 'Dishes']
  const nameArray: string[] = array[1]; // ['Adit', 'Abe', 'Josh', 'Enoch']

  const lastSunday = getLastSunday();
  const lastSundayString = lastSunday.toDateString();
  const secondToLastSunday = getSecondToLastSunday();
  const secondToLastSundayString = secondToLastSunday.toDateString();
  const formName = `Apt 306 Chores Rating - Week of ${secondToLastSundayString}`;
  const responsesName = `Apt 306 Chores Rating - Week of ${secondToLastSundayString} (Responses)`;
  const emailName = `[IMPORTANT] Apt 306 Chores: ${lastSundayString}`;

  // Create a new form
  const form = FormApp.create(formName);
  form.setProgressBar(true);
  form.setConfirmationMessage("Thanks for doing the form this week!");
  form
    .addPageBreakItem()
    .setHelpText(
      "Please rate performance (including your own), on the chores done last week."
    );

  // Add questions to the form for each chore
  for (let i = 0; i < choreArray.length; i++) {
    form
      .addPageBreakItem()
      .setTitle(`${choreArray[i]} Section`)
      .setHelpText(
        `Please rate ${nameArray[i]}'s performance on ${choreArray[i]}`
      );
    form
      .addMultipleChoiceItem()
      .setTitle(`Rate cleanliness (${nameArray[i]})`)
      .setChoiceValues([
        "1 - Poor",
        "2 - Below Average",
        "3 - Average",
        "4 - Good",
        "5 - Excellent",
      ]);
    form
      .addMultipleChoiceItem()
      .setTitle(`Rate timeliness (${nameArray[i]})`)
      .setChoiceValues([
        "1 - Poor",
        "2 - Below Average",
        "3 - Average",
        "4 - Good",
        "5 - Excellent",
      ]);
  }
  console.log("NEW FORM CREATED");
  // Create a new spreadsheet for this week's form responses
  const folderId = "1mWIrf-ZQWC9DdacABMY-FV5bBKn-B_lI";
  const folder = DriveApp.getFolderById(folderId);
  const newSpreadsheet = SpreadsheetApp.create(responsesName);
  console.log("NEW SPREADSHEET CREATED");
  // Move the new spreadsheet to the folder
  const file = DriveApp.getFileById(newSpreadsheet.getId());
  file.moveTo(folder);

  // Link the form responses to the new spreadsheet
  const destination = FormApp.DestinationType.SPREADSHEET;
  form.setDestination(destination, newSpreadsheet.getId());
  console.log("SPREADSHEET LINKED TO FORM");
  // Rotate the chore assignments after creating the form
  const backEl = nameArray.pop() as string;
  const updateArray = [backEl].concat(nameArray);
  range.setValues([choreArray, updateArray]);

  // Update the variables again
  const updatedRange = sheet.getDataRange();
  const updatedArray = updatedRange.getValues();
  const updatedChoreArray: string[] = updatedArray[0];
  const updatedNameArray: string[] = updatedArray[1];

  // Get the form's URL to include in the email
  const formUrl = form.getPublishedUrl();

  let returnString = "<p><strong>Chores for this week:</strong><br><br>";
  for (let i = 0; i < updatedChoreArray.length; i++) {
    returnString += `<strong>${updatedChoreArray[i]}:</strong> ${updatedNameArray[i]}<br>`;
  }
  returnString += "</p>";

  returnString +=
    "<p><strong>Please rate everyone's performance for the week (it's anonymous):</strong></p>";
  returnString += `<p>Fill out the form here: <a href='${formUrl}'>Chore Rating Form</a></p>`;

  // Add random dog image to email
  const dogApiUrl = "https://dog.ceo/api/breed/shiba/images/random";
  const dogResponse = UrlFetchApp.fetch(dogApiUrl);
  const dogJson = JSON.parse(dogResponse.getContentText());
  const imageUrl = dogJson.message;

  returnString +=
    "<p><strong>Here's a random Shiba image to brighten your day:</strong></p>";
  returnString += `<img src='${imageUrl}' alt='Random Shiba' style='width:300px;height:auto;'><br>`;

  // Add quote of the day
  const category = "happiness";
  const quoteApiUrl = `https://api.api-ninjas.com/v1/quotes?category=${category}`;
  try {
    const quoteResponse = UrlFetchApp.fetch(quoteApiUrl, {
      method: "get",
      headers: { "X-Api-Key": "O1hqdkyVYugsIM6dwJ5F4Q==oYxj2wrSMkVpv72A" },
      muteHttpExceptions: true,
    });
    const quoteJson = JSON.parse(quoteResponse.getContentText());
    const quote = quoteJson[0].quote;
    const author = quoteJson[0].author;

    returnString += "<p><strong>Quote of the day:</strong></p>";
    returnString += `<blockquote>${quote}<br>- ${author}</blockquote>`;
  } catch (error) {
    returnString += "<p>Could not fetch quote of the day.</p>";
  }

  // Send the email
  const emailString =
    "joshschang@berkeley.edu, estseng@berkeley.edu, abrahamkwok628@gmail.com, aditgupta.agupta@gmail.com";
  MailApp.sendEmail({
    to: emailString,
    subject: emailName,
    htmlBody: returnString,
  });
  console.log("EMAIL SENT");
}

function getLastSunday(): Date {
  const today = new Date();
  const dayOfWeek = today.getDay(); // 0 = Sunday, 1 = Monday, ..., 6 = Saturday
  const lastSunday = new Date(today);
  lastSunday.setDate(today.getDate() - dayOfWeek); // Subtract the current day of the week to get the last Sunday
  return lastSunday;
}

function getSecondToLastSunday(): Date {
  const lastSunday = getLastSunday();
  const secondToLastSunday = new Date(lastSunday);
  secondToLastSunday.setDate(lastSunday.getDate() - 7);
  return secondToLastSunday;
}

function reportAverages(): void {
  calculateAverages();
  const choreFolder = DriveApp.getFolderById(
    "1mWIrf-ZQWC9DdacABMY-FV5bBKn-B_lI"
  );
  const secondToLastSunday = getSecondToLastSunday();
  const secondToLastSundayString = secondToLastSunday.toDateString();

  const expectedName = `Apt 306 Chores Rating - Week of ${secondToLastSundayString} (Responses)`;
  const files = choreFolder.getFilesByName(expectedName);
  let file: GoogleAppsScript.Drive.File | null = null;

  if (files.hasNext()) {
    file = files.next();
    console.log(`Found file: ${file.getName()}`);
  } else {
    sendNoResponseEmail(secondToLastSundayString);
    return;
  }

  const spreadsheet = SpreadsheetApp.openById(file.getId());
  const averageSheet = spreadsheet.getSheetByName("Averages");

  if (!averageSheet || averageSheet.getLastRow() < 2) {
    sendNoResponseEmail(secondToLastSundayString);
  } else {
    const averagesData = averageSheet
      .getRange(2, 1, averageSheet.getLastRow() - 1, 2)
      .getValues();
    sendAveragesEmail(averagesData, secondToLastSundayString);
  }
}
function calculateAverages(): void {
  const choreFolder = DriveApp.getFolderById(
    "1mWIrf-ZQWC9DdacABMY-FV5bBKn-B_lI"
  );

  const secondToLastSunday = getSecondToLastSunday();
  const secondToLastSundayString = secondToLastSunday.toDateString();

  const expectedName = `Apt 306 Chores Rating - Week of ${secondToLastSundayString} (Responses)`;
  const files = choreFolder.getFilesByName(expectedName);
  let file: GoogleAppsScript.Drive.File | null = null;

  if (files.hasNext()) {
    file = files.next();
    console.log(`Found file: ${file.getName()}`);
  } else {
    throw new Error("Did not find file, no responses yet for this week");
  }

  const spreadsheet = SpreadsheetApp.openById(file.getId());
  const sheet = spreadsheet.getSheets()[0];
  const dataRange = sheet.getDataRange();
  const data = dataRange.getValues();

  if (data.length < 2) {
    console.log("No responses found");
    return;
  }

  const headers = data[0];

  let averageSheet = spreadsheet.getSheetByName("Averages");
  if (!averageSheet) {
    averageSheet = spreadsheet.insertSheet("Averages");
  } else {
    averageSheet.clear();
  }

  averageSheet.appendRow(["Name", "Average Rating"]);

  for (let col = 1; col < headers.length; col++) {
    const personName = headers[col];
    let totalRatings = 0;
    let numberOfRatings = 0;

    for (let row = 1; row < data.length; row++) {
      const rating = data[row][col];
      if (rating !== "") {
        totalRatings += parseInt(rating);
        numberOfRatings++;
      }
    }

    const averageRating =
      numberOfRatings > 0 ? (totalRatings / numberOfRatings).toFixed(2) : 0;

    averageSheet.appendRow([personName, averageRating]);
  }

  console.log("Averages calculated and updated in the Averages sheet.");
}

function sendAveragesEmail(
  averagesData: string[][],
  secondToLastSundayString: string
): void {
  const emailSubject = `Apt 306 Chore Averages - Week of ${secondToLastSundayString}`;
  const recipients =
    "joshschang@berkeley.edu, estseng@berkeley.edu, abrahamkwok628@gmail.com, aditgupta.agupta@gmail.com";

  let emailBody = `<p><strong>Chore Averages for Week of ${secondToLastSundayString}:</strong></p>`;
  emailBody += `<table border='1' style='border-collapse: collapse;'><tr><th>Name</th><th>Average Rating</th></tr>`;

  for (let i = 0; i < averagesData.length; i++) {
    emailBody += `<tr><td>${averagesData[i][0]}</td><td>${averagesData[i][1]}</td></tr>`;
  }

  emailBody += `</table>`;
  emailBody += `<p>These averages are based on the ratings provided for the chores performed last week. Keep up the great work!</p>`;

  MailApp.sendEmail({
    to: recipients,
    subject: emailSubject,
    htmlBody: emailBody,
  });

  console.log("Averages email sent to the apartment members.");
}

function sendNoResponseEmail(secondToLastSunday: string): void {
  const emailSubject = `No Chore Ratings for Week of ${secondToLastSunday}`;
  const recipients =
    "joshschang@berkeley.edu, estseng@berkeley.edu, abrahamkwok628@gmail.com, aditgupta.agupta@gmail.com";

  const emailBody = `<p>No one filled out the sheet last week! I guess everyone was happy with the cleanliness.</p>`;

  MailApp.sendEmail({
    to: recipients,
    subject: emailSubject,
    htmlBody: emailBody,
  });

  console.log("No response email sent to the apartment members.");
}
