# YouTube-Subscription-Calendar

A web-based calendar application that authenticates with your YouTube account and displays recent uploads from your subscribed channels in an interactive, filterable monthly calendar.

![App Screenshot](path/to/your/screenshot.png) <!-- Replace with a path to your screenshot -->

## Features
- **Google Authentication:** Securely log in with your YouTube account using OAuth 2.0.
- **Dynamic Calendar:** View all recent content from your subscriptions on a monthly calendar.
- **Content Categorization:** Automatically identifies and color-codes Standard Videos, Livestreams, YouTube Shorts, and Community Posts.
- **Detailed Day View:** Click on any day to see a detailed, chronologically sorted list of all content with thumbnails and upload times.
- **Watched State:** Click on any video to mark it as "watched," with the state saved locally.
- **Dark Mode:** A sleek dark mode for comfortable viewing.
- **Filtering & Searching:**
    - Toggle content types on or off via the legend.
    - Instantly search for content by title or channel name.
- **Smart Caching:** API results are cached for 15 minutes to provide near-instant load times on refresh and conserve API quota.
- **Force Refresh:** A dedicated button to bypass the cache and fetch the latest data on demand.

## Technologies Used
- HTML5
- CSS3 (with Flexbox and Grid)
- Vanilla JavaScript (ES6+)
- Google Identity Services
- YouTube Data API v3

## How to Run
1.  **Set up Credentials**: Create a `config.js` file in the root of the project with your Google API `CLIENT_ID` and `API_KEY`.
2.  **Run a Local Server**: Because Google authentication requires a valid `http` origin, you cannot open the `index.html` file directly. You must serve it from a local server.
    - If you have Python installed, navigate to the project directory in your terminal and run:
      ```bash
      python -m http.server
      ```
3.  **Configure Google Cloud**: In your Google Cloud Console, under your OAuth 2.0 Client ID settings, make sure to add `http://localhost:8000` to the "Authorized JavaScript origins".
4.  **View in Browser**: Open your web browser and navigate to `http://localhost:8000`.