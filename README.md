# My Vinyl Collection

A beautiful, modern web application to track and manage your vinyl record collection. Deploy it to GitHub Pages to access your collection from anywhere!

## Features

- 🎵 Add records with artist, album, year, genre, condition, and notes
- 🔍 Search your collection by artist or album name
- ✏️ Edit existing records
- 🗑️ Delete records
- 📄 Load data from JSON file (`data.json`)
- 💾 Export your collection as JSON
- 📱 Fully responsive design
- 🎨 Modern, beautiful UI

## Getting Started

### Local Development

1. Clone this repository:

   ```bash
   git clone <your-repo-url>
   cd record-collection
   ```

2. Open `index.html` in your web browser, or use a local server:

   ```bash
   # Using Python 3
   python3 -m http.server 8000

   # Using Node.js (with http-server)
   npx http-server
   ```

3. Navigate to `http://localhost:8000` in your browser

### Deploy to GitHub Pages

1. **Create a GitHub repository** (if you haven't already):

   - Go to GitHub and create a new repository
   - Name it `record-collection` (or any name you prefer)

2. **Push your code to GitHub**:

   ```bash
   git init
   git add .
   git commit -m "Initial commit: Vinyl collection tracker"
   git branch -M main
   git remote add origin https://github.com/YOUR_USERNAME/record-collection.git
   git push -u origin main
   ```

3. **Enable GitHub Pages**:

   - Go to your repository on GitHub
   - Click on **Settings**
   - Scroll down to **Pages** in the left sidebar
   - Under **Source**, select **Deploy from a branch**
   - Choose **main** branch and **/ (root)** folder
   - Click **Save**

4. **Access your site**:
   - Your site will be available at: `https://YOUR_USERNAME.github.io/record-collection/`
   - It may take a few minutes for the site to be available after enabling Pages

## Usage

1. **Add a Record**: Fill out the form on the left side with the record details and click "Add Record"
2. **Search**: Use the search bar to filter records by artist or album name
3. **Edit**: Click the "Edit" button on any record card to modify its details
4. **Delete**: Click the "Delete" button to remove a record from your collection
5. **Export JSON**: Click the "Export JSON" button to download your collection as a JSON file

## Data Storage

The application loads records from a `data.json` file in the repository. This means:

- **Initial Data**: Records are loaded from `data.json` when the page loads
- **User Changes**: When you add, edit, or delete records, changes are saved to your browser's localStorage as a cache/override
- **Export**: Use the "Export JSON" button to download your updated collection as a JSON file
- **Updating the Repo**: After exporting, you can commit the updated `data.json` file to your repository to persist changes across devices

### To update the JSON file in your repository:

1. Make changes to your collection in the app
2. Click "Export JSON" to download the updated `data.json`
3. Replace the `data.json` file in your repository with the downloaded file
4. Commit and push the changes to GitHub

This way, your collection is version-controlled and can be shared or accessed from any device!

## Browser Support

This application works in all modern browsers that support:

- ES6 JavaScript
- localStorage
- CSS Grid and Flexbox

## License

This project is open source and available for personal use.

## Contributing

Feel free to fork this project and customize it for your own needs!
