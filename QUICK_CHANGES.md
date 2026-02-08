# Quick Changes Cheat Sheet

## 🎨 Change Colors

**File**: `frontend/src/index.css`

Find this section (lines 7-24) and change the hex codes:

```css
:root {
  --primary-color: #9e9e9e;        ← Main color (buttons, links)
  --primary-dark: #757575;         ← Darker version
  --text-dark: #2c2c2c;           ← Main text color
  --text-light: #5a5a5a;          ← Lighter text
  --bg-light: #fafafa;            ← Page background
}
```

**Then**: Save file → Refresh browser (Ctrl+Shift+R)

---

## 📝 Change Text Content

**Easy Way**: Use Admin Panel
1. Go to: http://localhost:3000/admin-login
2. Password: `admin123`
3. Click tab for the page you want to edit
4. Change text
5. Click "Save" button

**What You Can Edit**:
- Company name & tagline
- Logo URL
- Page descriptions
- Contact information
- Care tips
- Affiliations

---

## 🔐 Change Admin Password

**File**: `frontend/src/pages/AdminLogin.jsx`

Find line 11:
```javascript
const ADMIN_PASSWORD = 'admin123'  ← Change this!
```

Change to your new password:
```javascript
const ADMIN_PASSWORD = 'MySecurePass2024'
```

**Then**: Save file

---

## 🖼️ Add Your Logo

**Method 1** (Easiest):
1. Find an image URL online
2. Admin Panel → Home Page tab
3. Paste URL in "Logo URL" field
4. Save

**Method 2** (Use your own file):
1. Copy your image to: `frontend/public/my-logo.png`
2. Admin Panel → Home Page
3. Logo URL: `/my-logo.png`
4. Save

---

## 🐱 Add a Kitten

**Admin Panel** → Kittens tab

Fill in form:
- **Name**: Luna
- **Birth Date**: Pick from calendar
- **Color**: Ruddy
- **Gender**: Female
- **Price**: 1200
- **Image URL**: (paste cat photo URL)
- **Description**: (write about the cat)
- **Available**: ✓ Check the box

Click "Add Kitten"

---

## 🎭 Change Footer Text

**File**: `frontend/src/App.jsx`

Find line 27:
```jsx
<p>&copy; 2024 Regal Abyssinians. All rights reserved.</p>
```

Change to:
```jsx
<p>&copy; 2024 Your Cattery Name. All rights reserved.</p>
```

**Then**: Save file → Refresh browser

---

## 📞 Update Contact Info

**Admin Panel** → About Page tab

Edit:
- Email
- Phone
- Address

Click "Save About Content"

---

## 🎨 Change Card Background Color

**File**: `frontend/src/pages/Home.css` (or Kittens.css, Care.css, About.css)

Find `.quick-link-card` or `.kitten-card` or `.info-card`:

```css
.quick-link-card {
  background: rgba(245, 245, 245, 0.85);  ← Change these numbers
  /* First 3 numbers = RGB color */
  /* Last number = opacity (0.0 to 1.0) */
}
```

Examples:
- White: `rgba(255, 255, 255, 0.85)`
- Light grey: `rgba(240, 240, 240, 0.85)`
- Light blue: `rgba(230, 240, 255, 0.85)`
- Light cream: `rgba(255, 250, 245, 0.85)`

---

## 📏 Change Card Spacing

**File**: Any page's `.css` file

Find the card style:
```css
.quick-link-card {
  padding: 3.5rem 2.5rem;  ← Space inside card (top/bottom left/right)
  gap: 2rem;               ← Space between cards
  border-radius: 0.35em;   ← Rounded corners
}
```

Make cards:
- **Bigger**: Increase padding (e.g., `4rem 3rem`)
- **Smaller**: Decrease padding (e.g., `2rem 1.5rem`)
- **More rounded**: Increase border-radius (e.g., `1em`)
- **Square**: Set border-radius to `0`

---

## 🔤 Change Fonts

**File**: `frontend/index.html`

Find line 9 and change font names:
```html
<link href="https://fonts.googleapis.com/css2?family=Roboto:wght@300;400;500;600;700&family=Raleway:wght@400;500;600;700;800&display=swap" rel="stylesheet">
```

Replace `Roboto` or `Raleway` with:
- Inter
- Poppins
- Montserrat
- Open Sans
- Lato

**Then**: Update `frontend/src/index.css`:
```css
body {
  font-family: 'YourNewFont', system-ui, sans-serif;
}

h1, h2, h3, h4, h5, h6 {
  font-family: 'YourHeadingFont', sans-serif;
}
```

---

## 🔧 Change Hero Section Colors

**File**: `frontend/src/pages/Home.css`

Find `.hero-section` (around line 5):
```css
.hero-section {
  background: linear-gradient(135deg,
    var(--primary-color) 0%,
    var(--primary-darker) 100%);
}
```

Or use solid color:
```css
.hero-section {
  background: #333333;  ← Your solid color
}
```

Or use image:
```css
.hero-section {
  background-image: url('/hero-bg.jpg');
  background-size: cover;
  background-position: center;
}
```

---

## 📱 Hide Admin Link from Navigation

**File**: `frontend/src/components/Navigation.jsx`

Find lines 39-43 and delete them:
```jsx
<li className="nav-item">
  <Link to="/admin" className={`nav-link ${isActive('/admin')}`}>
    Admin
  </Link>
</li>
```

Now admin is hidden! Access at: http://localhost:3000/admin-login

---

## 🗑️ Reset Everything

**Delete the database**:
```bash
cd backend
rm cattery.db
```

**Restart backend**:
```bash
python main.py
```

Everything resets to default! (Sample kittens, default content)

---

## 🐛 Something Broke?

### Quick Fixes:

1. **Undo your last change**: Ctrl+Z
2. **Hard refresh browser**: Ctrl+Shift+F5
3. **Restart backend**:
   ```bash
   # In backend terminal
   Ctrl+C
   python main.py
   ```
4. **Restart frontend**:
   ```bash
   # In frontend terminal
   Ctrl+C
   npm run dev
   ```
5. **Clear browser cache**: Ctrl+Shift+Delete → Clear cached images
6. **Check for errors**: F12 → Console tab

---

## ⚡ Pro Tips

1. **Test immediately**: After every change, refresh browser to see results
2. **Change one thing at a time**: Easier to undo if something breaks
3. **Use Admin Panel first**: Easier than editing code
4. **Backup database**: Copy `cattery.db` before major changes
5. **Keep terminals open**: Don't close backend/frontend while working
6. **Use Ctrl+S**: Save files frequently
7. **Read error messages**: They tell you what's wrong

---

## 📋 Common File Locations

| What You Want to Change | File Path |
|------------------------|-----------|
| Colors | `frontend/src/index.css` |
| Company name/logo | Admin Panel or `backend/main.py` |
| Navigation links | `frontend/src/components/Navigation.jsx` |
| Home page layout | `frontend/src/pages/Home.jsx` |
| Home page styling | `frontend/src/pages/Home.css` |
| Admin password | `frontend/src/pages/AdminLogin.jsx` |
| Footer text | `frontend/src/App.jsx` |
| Button styles | `frontend/src/index.css` |
| Card styles | Each page's `.css` file |

---

## 🆘 Emergency Reset

If everything is broken:

```bash
# Stop both servers (Ctrl+C in each terminal)

# Reset database
cd backend
rm cattery.db

# Clear frontend cache
cd ../frontend
rm -rf node_modules/.vite

# Restart everything
cd ../backend
python main.py

# New terminal
cd ../frontend
npm run dev
```

---

Remember: **You can't permanently break anything!**

The database can be reset, code can be restored with Ctrl+Z, and worst case, you have the original files.

**Experiment and have fun!** 🎨
