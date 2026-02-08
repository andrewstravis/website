# Abyssinian Cat Breeder Website

A modern, full-stack website for an Abyssinian cat breeder with content management capabilities.

## Features

- **Home Page**: Company information, logo, CFA affiliations, and site overview
- **Kittens Page**: Browse available kittens and join the waiting list
- **Care Page**: Information about Abyssinian cats and care guidelines
- **About Page**: Contact information and breeder details
- **Admin Panel**: Easy content management for all pages
- **Database Integration**: SQLite database for kittens and waiting list
- **Modern UI**: Responsive design with elegant styling

## Tech Stack

- **Backend**: FastAPI (Python)
- **Frontend**: React with Vite
- **Database**: SQLite with SQLAlchemy
- **Styling**: Custom CSS

## Project Structure

```
website/
├── backend/
│   ├── main.py              # FastAPI application
│   ├── requirements.txt      # Python dependencies
│   └── cattery.db           # SQLite database (created on first run)
├── frontend/
│   ├── src/
│   │   ├── components/      # React components
│   │   ├── pages/           # Page components
│   │   ├── App.jsx          # Main app component
│   │   └── main.jsx         # Entry point
│   ├── package.json         # Node dependencies
│   └── index.html           # HTML template
└── README.md
```

## Setup Instructions

### Prerequisites

- Python 3.8 or higher
- Node.js 16 or higher
- npm or yarn

### Backend Setup

1. Navigate to the backend directory:
   ```bash
   cd backend
   ```

2. Create a virtual environment (recommended):
   ```bash
   python -m venv venv
   source venv/bin/activate  # On Windows: venv\Scripts\activate
   ```

3. Install Python dependencies:
   ```bash
   pip install -r requirements.txt
   ```

4. Start the FastAPI server:
   ```bash
   python main.py
   ```

   The backend will run on `http://localhost:8000`

### Frontend Setup

1. Navigate to the frontend directory:
   ```bash
   cd frontend
   ```

2. Install Node dependencies:
   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   npm run dev
   ```

   The frontend will run on `http://localhost:3000`

### Access the Application

- **Website**: http://localhost:3000
- **API Documentation**: http://localhost:8000/docs
- **Admin Panel**: http://localhost:3000/admin

## Content Management Guide

### Accessing the Admin Panel

1. Navigate to http://localhost:3000/admin
2. Use the tabs to switch between different sections

### Managing Content

#### Home Page
- Edit company name, logo URL, tagline, and description
- Add or remove CFA affiliations
- Click "Save Home Content" to save changes

#### Care Page
- Edit the title and breed information
- Add or remove care tips
- Click "Save Care Content" to save changes

#### About Page
- Edit the title and description
- Update contact information (email, phone, address)
- Click "Save About Content" to save changes

#### Managing Kittens
1. Fill in the kitten form with:
   - Name, birth date, color, gender
   - Price and description
   - Optional image URL
   - Availability status
2. Click "Add Kitten" to create a new listing
3. Use "Edit" to modify existing kittens
4. Use "Delete" to remove kittens

#### Viewing the Waiting List
- See all waiting list submissions
- View customer preferences
- Remove entries when contacted

## API Endpoints

### Kittens
- `GET /api/kittens` - Get all kittens
- `GET /api/kittens/{id}` - Get specific kitten
- `POST /api/kittens` - Create new kitten
- `PUT /api/kittens/{id}` - Update kitten
- `DELETE /api/kittens/{id}` - Delete kitten

### Waiting List
- `GET /api/waiting-list` - Get all entries
- `POST /api/waiting-list` - Add new entry
- `DELETE /api/waiting-list/{id}` - Remove entry

### Content Management
- `GET /api/content/{page_name}` - Get page content
- `PUT /api/content` - Update page content

## Customization

### Changing Colors
Edit `/frontend/src/index.css` and modify the CSS variables:
```css
:root {
  --primary-color: #8B4513;      /* Main brand color */
  --primary-dark: #654321;       /* Darker shade */
  --secondary-color: #D4A574;    /* Secondary color */
  --accent-color: #FFD700;       /* Accent color */
}
```

### Adding Images
1. Place images in `/frontend/public/` directory
2. Reference them in the admin panel as `/image-name.png`
3. Or use external URLs

### Modifying Page Layout
- Edit React components in `/frontend/src/pages/`
- Modify CSS files with the same name as the component

## Deployment

### Backend Deployment
1. Set up a production database (PostgreSQL recommended)
2. Update database connection in `main.py`
3. Use a production ASGI server like Gunicorn with Uvicorn workers
4. Set up environment variables for sensitive data

### Frontend Deployment
1. Build the production bundle:
   ```bash
   cd frontend
   npm run build
   ```
2. Deploy the `dist` folder to a static hosting service
3. Update API URLs in `vite.config.js` for production

## Troubleshooting

### Backend won't start
- Ensure all Python dependencies are installed
- Check that port 8000 is not in use
- Verify Python version is 3.8+

### Frontend won't start
- Delete `node_modules` and run `npm install` again
- Check that port 3000 is not in use
- Clear npm cache: `npm cache clean --force`

### Database issues
- Delete `cattery.db` to reset the database
- The database will be recreated on next backend startup
- Default content will be automatically populated

### CORS errors
- Ensure both backend and frontend are running
- Check CORS settings in `backend/main.py`
- Verify proxy settings in `frontend/vite.config.js`

## Support

For issues or questions, refer to:
- FastAPI documentation: https://fastapi.tiangolo.com
- React documentation: https://react.dev
- Vite documentation: https://vitejs.dev

## License

This project is created for personal use.
