# Automated Chore Scheduler Script

This project automates the assignment of household chores using Google Sheets and sends a weekly email with the assignments. The email also includes a random dog image and an uplifting quote to make chore schedules more enjoyable.

## Features

- Fetches chore and name data from a Google Sheets spreadsheet.
- Constructs a personalized HTML email with:
  - Chore assignments.
  - A random dog image to brighten your day.
  - An uplifting quote to inspire positivity.
- Sends the email to the specified recipients.
- Rotates the list of names for the next round of assignments.

## Setup

1. **Google Sheets**: Create a Google Sheet with the following data structure:
   - The first row should contain chore names (e.g., `['Trash', 'Bathroom', 'Floor', 'Dishes']`).
   - The second row should contain the names of people responsible for the chores (e.g., `['Adit', 'Abe', 'Josh', 'Enoch']`).

2. **Google Apps Script**: Open the Google Apps Script editor and replace the default code with the provided script.

3. **API Keys**: Make sure you have the necessary API keys for fetching the dog image and quote, and replace the placeholders in the script with your actual keys.
