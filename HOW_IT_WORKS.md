# How Your Abyssinian Cat Website Works

## Table of Contents
1. [Big Picture Overview](#big-picture-overview)
2. [File Structure Explained](#file-structure-explained)
3. [How Data Flows](#how-data-flows)
4. [Making Changes Guide](#making-changes-guide)
5. [Understanding Each Part](#understanding-each-part)

---

## Big Picture Overview

Think of your website like a restaurant:

### The Kitchen (Backend)
- **Location**: `backend/` folder
- **Language**: Python (using FastAPI)
- **Database**: SQLite (file: `cattery.db`)
- **What it does**:
  - Stores all your data (kittens, content, waiting list)
  - Serves data when the frontend asks for it
  - Like a kitchen that prepares food when ordered

### The Dining Room (Frontend)
- **Location**: `frontend/` folder
- **Language**: JavaScript (using React)
- **What it does**:
  - Shows the pretty website to visitors
  - Sends requests to backend for data
  - Like the dining room where customers see and order food

### How They Talk
```
Browser (Customer)
    ↓
Frontend (Waiter - takes orders, shows menu)
    ↓
Backend (Kitchen - prepares and stores food)
    ↓
Database (Pantry - stores ingredients)
```

---

## File Structure Explained

```
website/
├── backend/                    ← The Kitchen (Python)
│   ├── main.py                ← Main chef (handles all requests)
│   ├── requirements.txt       ← List of ingredients needed
│   ├── cattery.db            ← The storage pantry (created automatically)
│   └── venv/                 ← Chef's tools (Python packages)
│
├── frontend/                  ← The Dining Room (React)
│   ├── src/
│   │   ├── App.jsx           ← Main blueprint of restaurant layout
│   │   ├── main.jsx          ← Restaurant entrance
│   │   ├── index.css         ← Overall restaurant decoration rules
│   │   │
│   │   ├── components/       ← Reusable furniture
│   │   │   ├── Navigation.jsx        ← Menu bar at top
│   │   │   └── Navigation.css        ← Menu bar styling
│   │   │
│   │   └── pages/            ← Different dining areas
│   │       ├── Home.jsx              ← Welcome area
│   │       ├── Home.css              ← Welcome area decoration
│   │       ├── Kittens.jsx           ← Kitten display area
│   │       ├── Kittens.css           ← Kitten area styling
│   │       ├── Care.jsx              ← Care information area
│   │       ├── Care.css              ← Care area styling
│   │       ├── About.jsx             ← About us area
│   │       ├── About.css             ← About area styling
│   │       ├── Admin.jsx             ← Back office (protected)
│   │       ├── Admin.css             ← Back office styling
│   │       ├── AdminLogin.jsx        ← Security door
│   │       └── AdminLogin.css        ← Security door styling
│   │
│   ├── index.html            ← The building foundation
│   ├── package.json          ← List of dining room supplies
│   └── vite.config.js        ← Restaurant opening rules
│
└── README.md                 ← User manual
```

---

## How Data Flows

### Example: Viewing Kittens on the Website

**Step-by-step what happens:**

1. **You type in browser**: `http://localhost:3000/kittens`

2. **Frontend receives request**:
   - `App.jsx` says "Show the Kittens page"
   - Opens `Kittens.jsx`

3. **Kittens.jsx loads**:
   ```
   When page opens → Kittens.jsx wakes up
   ↓
   Runs fetchKittens() function
   ↓
   Sends request: "Hey backend, give me all kittens!"
   ```

4. **Backend receives request**:
   ```
   main.py receives: GET /api/kittens
   ↓
   Opens cattery.db database
   ↓
   Looks in "kittens" table
   ↓
   Gets all kitten records
   ↓
   Sends back JSON data (like a receipt)
   ```

5. **Frontend receives data**:
   ```
   Kittens.jsx gets the data
   ↓
   Stores in "kittens" variable
   ↓
   Displays each kitten as a card
   ↓
   You see beautiful kitten cards on screen!
   ```

### Example: Adding Content in Admin Panel

1. **You log into admin**: Enter password → Access granted

2. **You edit home page**:
   ```
   Type new company name: "Royal Abyssinians"
   ↓
   Click "Save Home Content"
   ↓
   Admin.jsx sends data to backend
   ↓
   Backend saves to database
   ↓
   Success message appears
   ```

3. **Visitor sees changes**:
   ```
   Visitor opens homepage
   ↓
   Home.jsx asks backend for content
   ↓
   Backend sends updated content from database
   ↓
   Visitor sees "Royal Abyssinians"
   ```

---

## Making Changes Guide

### 🎨 Change Colors

**File**: `frontend/src/index.css` (lines 7-24)

```css
:root {
  --primary-color: #9e9e9e;        ← Main grey color
  --primary-dark: #757575;         ← Darker grey for buttons
  --text-dark: #2c2c2c;           ← Text color (almost black)
  --bg-light: #fafafa;            ← Background color (light grey)
}
```

**How to change**:
1. Find a color you like (Google "color picker")
2. Copy the hex code (like `#9e9e9e`)
3. Replace the value
4. Save file
5. Refresh browser (Ctrl+Shift+R)

---

### 📝 Change Text Content (Easy Way)

**Use the Admin Panel**:
1. Go to `http://localhost:3000/admin-login`
2. Enter password: `admin123`
3. Click tabs to edit different pages
4. Type new content
5. Click "Save" button
6. Changes appear immediately!

**What you can edit in admin**:
- Company name
- Tagline
- Description
- Logo URL
- Contact information
- Care tips
- Affiliations
- Add/edit/delete kittens

---

### 🔐 Change Admin Password

**File**: `frontend/src/pages/AdminLogin.jsx` (line 11)

```javascript
const ADMIN_PASSWORD = 'admin123'  ← Change this!
```

**Steps**:
1. Open the file
2. Change `'admin123'` to your new password
3. Save
4. Next time you need to use the new password

---

### 🖼️ Change Logo or Photos

**Two ways**:

**Option 1 - Use Admin Panel** (Easiest):
1. Find an image URL online (right-click image → Copy image address)
2. Go to Admin Panel → Home Page tab
3. Paste URL in "Logo URL" field
4. Click "Save Home Content"

**Option 2 - Add Your Own Image**:
1. Put your image in `frontend/public/` folder
2. Name it something like `my-logo.png`
3. In Admin Panel, set Logo URL to: `/my-logo.png`
4. Save

---

### ➕ Add a New Page

This is more advanced, but here's the process:

1. **Create the page file**: `frontend/src/pages/NewPage.jsx`
2. **Create the styling**: `frontend/src/pages/NewPage.css`
3. **Add route in App.jsx**:
   ```javascript
   <Route path="/newpage" element={<NewPage />} />
   ```
4. **Add link in Navigation.jsx**:
   ```javascript
   <Link to="/newpage">New Page</Link>
   ```

---

## Understanding Each Part

### Backend (main.py) - The Chef

**What it contains**:

#### 1. Database Models (Line 28-59)
```python
class Kitten(Base):
    __tablename__ = "kittens"
    id = Column(Integer, primary_key=True)
    name = Column(String)
    # ... more fields
```

**What this means**:
- Defines what a "kitten" is in the database
- Like creating a form: Every kitten needs name, birth date, color, etc.

#### 2. API Endpoints (Line 160+)
```python
@app.get("/api/kittens")
def get_kittens():
    # Get all kittens from database
    return kittens
```

**What this means**:
- When frontend asks for kittens at `/api/kittens`
- This function runs and returns the data
- Like having a menu item: Order "kittens" → Get list of kittens

#### 3. Default Content (Line 115-199)
```python
def init_default_content(db: Session):
    default_pages = {
        "home": json.dumps({
            "company_name": "Regal Abyssinians",
            # ... more content
        })
    }
```

**What this means**:
- First time you start the backend, it creates default content
- Like stocking a new restaurant with initial menu items

---

### Frontend Components

#### Navigation.jsx - The Menu Bar

**Purpose**: Top bar that appears on every page

**What it does**:
- Shows logo
- Shows links to all pages
- Highlights current page
- Always visible at top

**To modify navigation links**:
Find this section (line 22-44) and add/remove links:
```javascript
<Link to="/kittens">Kittens</Link>
```

---

#### Home.jsx - The Welcome Page

**Line-by-line breakdown**:

```javascript
// Line 5-11: Define what content we need
const [content, setContent] = useState({
    company_name: 'Regal Abyssinians',  // Default values
    logo_url: '/logo.png',
    // ...
})

// Line 13-15: When page loads, get content
useEffect(() => {
    fetchContent()  // Ask backend for latest content
}, [])

// Line 17-26: Function to get content
const fetchContent = async () => {
    const response = await axios.get('/api/content/home')
    // Store the content so we can display it
    setContent(parsedContent)
}

// Line 36-90: Display the content
return (
    <div>
        <h1>{content.company_name}</h1>  {/* Shows company name */}
        <p>{content.tagline}</p>  {/* Shows tagline */}
    </div>
)
```

**In simple terms**:
1. Page loads
2. Asks backend: "What's the home page content?"
3. Backend responds with content
4. Page displays the content

---

#### Admin.jsx - The Control Panel

**What it does**:

1. **Checks if you're logged in** (Line 17-21):
   ```javascript
   if (!isAuthenticated) {
       navigate('/admin-login')  // Send to login page
   }
   ```

2. **Gets all content from backend** (Line 45-60):
   - Home page content
   - Care page content
   - About page content
   - List of kittens
   - Waiting list entries

3. **Shows forms to edit everything** (Line 223+):
   - Text inputs for names, descriptions
   - Buttons to add/remove items
   - Save buttons

4. **Sends updates back to backend** (Line 67-86):
   ```javascript
   const saveHomeContent = async () => {
       await axios.put('/api/content', {
           page_name: 'home',
           content: JSON.stringify(homeContent)
       })
   }
   ```

---

### CSS Files - The Decoration

**Each page has its own CSS file that controls**:

- **Colors**: Background, text, buttons
- **Spacing**: Padding, margins, gaps
- **Layout**: Where things appear
- **Effects**: Hover animations, shadows

**Example from Home.css**:

```css
.quick-link-card {
    background: rgba(245, 245, 245, 0.85);  ← Background color
    padding: 3.5rem 2.5rem;                  ← Space inside card
    border-radius: 0.35em;                   ← Rounded corners
    box-shadow: 0 0 0 0.0625em ...;        ← Drop shadow effect
}

.quick-link-card:hover {
    transform: translateY(-8px);            ← Lift up on hover
    box-shadow: 0 0 0 0.0625em ...;        ← Bigger shadow on hover
}
```

---

## Common Tasks Explained

### Task: Change the Company Name

**Method 1 - Admin Panel (Easy)**:
1. Open http://localhost:3000/admin-login
2. Login with password
3. Click "Home Page" tab
4. Change "Company Name" field
5. Click "Save Home Content"
6. Done! Refresh homepage to see change

**Method 2 - Edit Backend File**:
1. Open `backend/main.py`
2. Find line 118: `"company_name": "Regal Abyssinians"`
3. Change the text
4. Delete `cattery.db` file
5. Restart backend (Ctrl+C, then `python main.py`)
6. Database recreates with new default

---

### Task: Add a New Kitten

**Using Admin Panel**:
1. Go to Admin → Kittens tab
2. Fill in the form:
   - Name: "Fluffy"
   - Birth Date: Pick from calendar
   - Color: "Ruddy"
   - Gender: Male/Female
   - Price: 1200
   - Image URL: (paste image link)
   - Description: (write about the kitten)
   - Available: Check the box
3. Click "Add Kitten"
4. New kitten appears on Kittens page immediately!

**Behind the scenes**:
```
Admin form → Sends data to backend
↓
Backend creates new row in "kittens" table
↓
Returns success message
↓
Admin page refreshes to show new kitten
```

---

### Task: Change Colors of the Whole Site

**File**: `frontend/src/index.css`

**Change main grey color**:
```css
--primary-color: #9e9e9e;  ← Change this hex code
```

**What uses this color**:
- Buttons
- Navigation active tab
- Hero section gradient
- Footer background

**Pro tip**: Change this one color and many things update automatically!

---

## Troubleshooting Guide

### Problem: Changes Don't Appear

**Solution**:
1. Did you save the file? (Ctrl+S)
2. Did you restart the server?
   - Frontend changes: Usually auto-reload
   - Backend changes: Stop (Ctrl+C) and restart (`python main.py`)
3. Hard refresh browser: Ctrl+Shift+R (or Cmd+Shift+R on Mac)
4. Check browser console (F12) for errors

---

### Problem: Admin Panel Won't Let Me In

**Solutions**:
1. Check password is correct (default: `admin123`)
2. Clear browser cache
3. Check `AdminLogin.jsx` to see what password is set

---

### Problem: Backend Won't Start

**Common issues**:
1. **Port 8000 already in use**:
   - Another program is using that port
   - Stop other Python programs
   - Or change port in `main.py` line 250

2. **Missing packages**:
   ```bash
   cd backend
   source venv/bin/activate
   pip install -r requirements.txt
   ```

3. **Database error**:
   - Delete `cattery.db`
   - Restart backend (creates fresh database)

---

### Problem: Frontend Won't Start

**Common issues**:
1. **Port 3000 in use**:
   - Stop other Node programs
   - Or say "Y" to use different port

2. **Missing packages**:
   ```bash
   cd frontend
   npm install
   ```

3. **Old cache**:
   ```bash
   rm -rf node_modules/.vite
   npm run dev
   ```

---

## Database Explained (cattery.db)

**What is it?**
- A file that stores all your data
- Like a filing cabinet with folders (tables)

**Tables inside**:

### 1. kittens table
Stores all kitten information:
- id, name, birth_date, color, gender, price, description, image_url, available, created_at

### 2. waiting_list table
Stores customer requests:
- id, name, email, phone, preferences, created_at

### 3. page_content table
Stores editable page content:
- id, page_name, content, updated_at

**Where is it?**
- Location: `backend/cattery.db`
- Created automatically when backend first starts
- To reset everything: Delete this file and restart backend

**Can I look inside?**
Yes! Download "DB Browser for SQLite" to view the data visually.

---

## Data Format Examples

### Kitten in Database (JSON format):
```json
{
    "id": 1,
    "name": "Luna",
    "birth_date": "2024-09-15",
    "color": "Ruddy",
    "gender": "Female",
    "price": 1200.00,
    "description": "Beautiful playful kitten",
    "image_url": "https://...",
    "available": true,
    "created_at": "2024-12-07T10:30:00"
}
```

### Page Content in Database:
```json
{
    "page_name": "home",
    "content": "{\"company_name\":\"Regal Abyssinians\",\"tagline\":\"Premium Breeder\"}"
}
```

---

## Quick Reference: Where to Edit What

| What You Want to Change | File to Edit | Line/Section |
|------------------------|--------------|--------------|
| Colors (whole site) | `frontend/src/index.css` | Lines 7-24 (`:root` section) |
| Company name | Admin Panel → Home Page | Or `backend/main.py` line 118 |
| Navigation links | `frontend/src/components/Navigation.jsx` | Lines 22-44 |
| Admin password | `frontend/src/pages/AdminLogin.jsx` | Line 11 |
| Hero section gradient | `frontend/src/pages/Home.css` | Line 6 |
| Card styling | Each page's `.css` file | Search for `.card` |
| Add new kitten | Admin Panel → Kittens tab | Fill form and save |
| Contact info | Admin Panel → About Page | Edit contact fields |
| Care tips | Admin Panel → Care Page | Add/remove tips |

---

## Tips for Success

1. **Always save files**: Ctrl+S after every edit
2. **Keep both terminals running**: Backend + Frontend
3. **Use Admin Panel**: Easier than editing code for content
4. **Test changes immediately**: Refresh browser after saving
5. **Backup database**: Copy `cattery.db` before major changes
6. **Use browser DevTools**: F12 to see errors
7. **Read error messages**: They tell you what's wrong
8. **Change one thing at a time**: Easy to undo mistakes

---

## Next Steps

1. **Customize content**: Use Admin Panel to add your info
2. **Change colors**: Edit `index.css` to match your brand
3. **Add real photos**: Upload to `public/` or use URLs
4. **Set secure password**: Change from `admin123`
5. **Add more kittens**: Build your catalog
6. **Test on phone**: Make sure it looks good on mobile

---

## Getting Help

If you get stuck:

1. **Check error message**: Read what it says
2. **Check browser console**: F12 → Console tab
3. **Check terminal output**: Look for errors in red
4. **Restart servers**: Often fixes mysterious issues
5. **Clear cache**: Ctrl+Shift+Delete in browser
6. **Check this guide**: Search for your problem

---

**Remember**: You can't break anything permanently! The database can be reset, code can be restored. Experiment and learn!

---

**Created**: December 2024
**Last Updated**: December 2024
**Website**: Abyssinian Cat Breeder Platform
