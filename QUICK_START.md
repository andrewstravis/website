# Quick Start Guide

Get your Abyssinian Cat Breeder website running in 5 minutes!

## Step 1: Start the Backend

Open a terminal and run:

```bash
cd backend
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
pip install -r requirements.txt
python main.py
```

You should see:
```
INFO:     Uvicorn running on http://0.0.0.0:8000
```

## Step 2: Start the Frontend

Open a NEW terminal and run:

```bash
cd frontend
npm install
npm run dev
```

You should see:
```
  VITE v5.x.x  ready in xxx ms
  ➜  Local:   http://localhost:3000/
```

## Step 3: View Your Website

Open your browser and go to:
- **Website**: http://localhost:3000
- **Admin Panel**: http://localhost:3000/admin

## Step 4: Customize Your Content

1. Go to http://localhost:3000/admin
2. Click on the "Home Page" tab
3. Update:
   - Company Name (e.g., "Your Cattery Name")
   - Tagline
   - Description
4. Click "Save Home Content"
5. Visit http://localhost:3000 to see your changes!

## What to Do Next

### Update All Pages
1. **Home Page**: Add your company info and affiliations
2. **Care Page**: Customize care tips and breed information
3. **About Page**: Add your contact information
4. **Kittens**: Add your available kittens

### Add Your First Kitten
1. Go to Admin Panel → Kittens tab
2. Fill in the form with kitten details
3. Click "Add Kitten"
4. Visit the Kittens page to see it live!

### Add Images
1. Place images in `frontend/public/` folder
2. Reference them as `/image-name.png`
3. Or use external image URLs

## Common Commands

### Backend
```bash
# Start backend
cd backend
python main.py

# Reset database (deletes all data!)
rm cattery.db
```

### Frontend
```bash
# Start development server
cd frontend
npm run dev

# Build for production
npm run build
```

## Troubleshooting

**Backend won't start?**
- Make sure you activated the virtual environment
- Check that Python 3.8+ is installed: `python --version`
- Install dependencies again: `pip install -r requirements.txt`

**Frontend won't start?**
- Delete `node_modules` folder
- Run `npm install` again
- Make sure Node.js 16+ is installed: `node --version`

**Can't see changes?**
- Click the Save button in admin panel
- Refresh your browser (Ctrl+F5 or Cmd+Shift+R)
- Check that both servers are running

## Getting Help

- Read the full README.md for detailed information
- Check CONTENT_MANAGEMENT.md for content editing help
- API documentation: http://localhost:8000/docs

## Tips for Success

1. Start both servers in separate terminal windows
2. Keep both servers running while you work
3. Save frequently in the admin panel
4. Test changes immediately by refreshing the page
5. Use high-quality images for professional appearance

---

That's it! You now have a fully functional cat breeder website with easy content management. Happy breeding! 🐱
