# Automated Chore Scheduler and Rating Script

This project automates the assignment and rating of household chores using Google Sheets, Google Forms, and Google Apps Script. It sends a weekly email with the chore assignments and allows household members to rate each other's performance. The email also includes a random dog image and an uplifting quote to make the chore routine more enjoyable.

## Features

- **Automated Chore Assignment**:
  - Fetches chore and name data from a Google Sheets spreadsheet.
  - Rotates the list of names for the next round of assignments.
  - Sends an email with:
    - Chore assignments for the week.
    - A random dog image
    - An uplifting quote
  
- **Google Form for Chore Rating**:
  - Automatically creates a Google Form each week to collect ratings for each person's performance.
  - The form is dynamically generated based on the chore and name data from the spreadsheet.
  - Includes multiple-choice questions to rate cleanliness and timeliness for each assigned chore.

- **Averages Calculation**:
  - After receiving responses, the script calculates the average rating for each person and chore.
  - The calculated averages are stored in a dedicated sheet within the spreadsheet.

- **Automated Weekly Report**:
  - Every Wednesday, the script sends a summary email of the previous week's chore performance, including average ratings for each person.
  - If no one submits ratings, the email will notify the recipients that no feedback was provided.

## Setup

1. **Google Sheets**: Create a Google Sheet with the following data structure:
   - The first row should contain chore names (e.g., `['Trash', 'Bathroom', 'Floor', 'Dishes']`).
   - The second row should contain the names of people responsible for the chores (e.g., `['Adit', 'Abe', 'Josh', 'Enoch']`).

2. **Google Apps Script**:
   - Open the Google Apps Script editor connected to the Google Sheet.
   - Copy and paste the provided script into the editor.
   - Customize the form and email settings as needed.

3. **API Keys**:
   - Ensure you have the necessary API keys for fetching the random dog image and quote:
     - **Dog Image API**: Use the `https://dog.ceo/api/breed/shiba/images/random` endpoint for fetching a random dog image.
     - **Quotes API**: Fetch an uplifting quote from the [API Ninjas](https://api-ninjas.com/api/quotes) by replacing the placeholder API key with your own.

4. **Trigger Setup**:
   - Set up time-driven triggers in Google Apps Script to automate the following tasks:
     - **Weekly Chore Form Creation**: Schedule the script to create the form and send out the chore assignments every Sunday.
     - **Averages Report**: Schedule the report of average ratings every Wednesday, summarizing the previous week's feedback.

5. **Form Configuration**:
   - Manually adjust the form settings (if needed) in Google Forms to:
     - Make the form accessible to anyone with the link.
     - Optionally limit each person to one submission by enabling "Limit to 1 response" in the form settings.

## API Configuration

- **Dog API**: `https://dog.ceo/api/breed/shiba/images/random`
- **Quotes API**: `https://api.api-ninjas.com/v1/quotes`
