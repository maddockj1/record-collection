# My Vinyl Collection

A beautiful, modern web application to display your vinyl record collection. Deploy it to GitHub Pages to showcase your collection!

## Features

- 🎵 Display records with artist, album, year, genre, and album cover
- 🔍 Search your collection by artist or album name
- 📄 Load data from JSON file (`data.json`)
- 📱 Fully responsive design
- 🎨 Modern, beautiful UI with album cover images

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

1. **Search**: Use the search bar to filter records by artist or album name
2. **View Collection**: Browse your records displayed in a beautiful grid layout with album covers

## Data Structure

The application loads records from a `data.json` file. Each record should have the following structure:

```json
[
  {
    "id": "unique-id",
    "artist": "Artist Name",
    "album": "Album Name",
    "year": "2020",
    "genre": "Rock",
    "albumCover": "https://example.com/cover.jpg"
  }
]
```

### Fields:

- **id** (required): Unique identifier for the record
- **artist** (required): Artist name
- **album** (required): Album name
- **year** (optional): Release year
- **genre** (optional): Music genre
- **albumCover** (optional): URL or path to album cover image. Can also be named `cover`. If the image fails to load, it will be hidden.

## Updating Your Collection

To update your collection:

1. Edit the `data.json` file directly
2. Add your records following the structure above
3. For album covers, you can:
   - Use URLs to images hosted online
   - Store images in a folder (e.g., `covers/`) and reference them as `covers/album-name.jpg`
   - Commit the images along with your JSON file
4. Commit and push the changes to GitHub

## Browser Support

This application works in all modern browsers that support:

- ES6 JavaScript
- Fetch API
- CSS Grid and Flexbox

## License

This project is open source and available for personal use.

## Contributing

Feel free to fork this project and customize it for your own needs!
