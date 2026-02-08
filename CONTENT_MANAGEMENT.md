# Content Management Guide

This guide explains how to easily update and manage your website content.

## Quick Start

1. Start both the backend and frontend servers
2. Navigate to http://localhost:3000/admin
3. Use the tabs to switch between different sections
4. Make your changes and click the Save button

## Managing Each Page

### Home Page Content

The home page displays your company information and serves as the landing page.

#### Editable Fields:
- **Company Name**: Your cattery name (e.g., "Regal Abyssinians")
- **Logo URL**: Path to your logo image (e.g., "/logo.png" or a full URL)
- **Tagline**: A short catchphrase (e.g., "Premium Abyssinian Cat Breeder")
- **Description**: Welcome message explaining your cattery

#### Managing Affiliations:
1. View current affiliations in the list
2. Remove any affiliation by clicking the × button
3. Add new affiliations:
   - Type the affiliation name in the input field
   - Click "Add" button
   - Example: "CFA - Cat Fanciers' Association"

#### How to Save:
Click "Save Home Content" button at the bottom

---

### Care Page Content

The care page educates visitors about Abyssinian cats and how to care for them.

#### Editable Fields:
- **Title**: Page heading (e.g., "Caring for Your Abyssinian")
- **About the Breed**: Detailed description of Abyssinian characteristics
- **Care Tips**: List of care instructions

#### Managing Care Tips:
1. View current tips in the list
2. Remove tips by clicking the × button
3. Add new tips:
   - Type the tip in the input field
   - Click "Add" button
   - Example: "Provide interactive toys and climbing structures"

#### Best Practices:
- Keep tips concise and actionable
- Cover different aspects: diet, grooming, health, activity
- Use clear, easy-to-understand language

#### How to Save:
Click "Save Care Content" button at the bottom

---

### About Page Content

The about page tells your story and provides contact information.

#### Editable Fields:
- **Title**: Page heading (e.g., "About Us")
- **Description**: Your story, experience, and breeding philosophy
- **Email**: Contact email address
- **Phone**: Contact phone number
- **Address**: Physical address or location

#### Tips:
- Make your description personal and genuine
- Highlight your experience and credentials
- Ensure contact information is accurate and up-to-date

#### How to Save:
Click "Save About Content" button at the bottom

---

## Managing Kittens

### Adding a New Kitten

1. Go to the "Kittens" tab in the admin panel
2. Fill in all required fields:
   - **Name**: Kitten's name
   - **Birth Date**: Use the date picker
   - **Color**: Coat color (e.g., "Ruddy", "Blue", "Fawn")
   - **Gender**: Select Male or Female
   - **Price**: Enter price in dollars
   - **Image URL**: Path or URL to kitten photo
   - **Description**: Details about the kitten's personality, lineage, etc.
   - **Available**: Check if the kitten is available for purchase

3. Click "Add Kitten" button

### Editing an Existing Kitten

1. Find the kitten in the "Current Kittens" list
2. Click the "Edit" button
3. Make your changes in the form
4. Click "Update Kitten" button
5. Or click "Cancel" to discard changes

### Deleting a Kitten

1. Find the kitten in the "Current Kittens" list
2. Click the "Delete" button
3. Confirm the deletion in the popup

### Tips for Kitten Listings:
- Use high-quality, clear photos
- Write engaging descriptions highlighting personality
- Update availability status promptly when kittens are reserved
- Include information about parents if relevant

---

## Managing the Waiting List

### Viewing Entries

1. Go to the "Waiting List" tab
2. View all customer submissions with:
   - Name
   - Email
   - Phone
   - Preferences
   - Date submitted

### Removing Entries

1. When you've contacted a customer or they're no longer interested
2. Click the "Remove" button next to their entry
3. Confirm the removal

### Best Practices:
- Check the waiting list regularly
- Contact people in the order they signed up
- Keep records of who you've contacted
- Remove entries promptly after follow-up

---

## Adding Images

### Option 1: Local Images
1. Place image files in the `frontend/public/` folder
2. Reference them as `/filename.png` in the admin panel
3. Example: If you have `frontend/public/logo.png`, use `/logo.png`

### Option 2: External URLs
1. Upload images to an image hosting service
2. Copy the full URL
3. Paste the URL in the Image URL field
4. Example: `https://example.com/images/kitten.jpg`

### Image Recommendations:
- **Logo**: Square format, 200x200px minimum
- **Kitten photos**: High quality, well-lit, 800x600px or larger
- **File formats**: PNG, JPG, or WEBP
- **File size**: Keep under 1MB for faster loading

---

## Common Tasks

### Updating Your Company Name
1. Admin Panel → Home Page tab
2. Change "Company Name" field
3. Click "Save Home Content"

### Changing Contact Information
1. Admin Panel → About Page tab
2. Update Email, Phone, or Address fields
3. Click "Save About Content"

### Marking a Kitten as Reserved
1. Admin Panel → Kittens tab
2. Click "Edit" on the kitten
3. Uncheck the "Available" checkbox
4. Click "Update Kitten"

### Adding a New Care Tip
1. Admin Panel → Care Page tab
2. Scroll to "Care Tips" section
3. Type tip in the input field
4. Click "Add" button
5. Click "Save Care Content"

---

## Content Writing Tips

### Home Page
- Keep it welcoming and professional
- Clearly explain what visitors will find on your site
- Highlight your credentials and affiliations
- Use an inviting tone

### Care Page
- Write for new cat owners and experienced ones
- Be specific with instructions
- Include both daily care and long-term considerations
- Add any breed-specific advice

### About Page
- Tell your story authentically
- Mention years of experience
- Explain your breeding philosophy
- Make it easy to contact you

### Kitten Descriptions
- Start with personality traits
- Mention physical characteristics
- Include any special qualities
- Keep it concise but informative

---

## Troubleshooting

### Changes Not Appearing
1. Make sure you clicked the Save button
2. Refresh the website page (not the admin panel)
3. Check browser console for errors

### Can't Upload Images
- The admin panel accepts URLs, not file uploads
- You need to host images separately or place them in the public folder
- Use the full URL or path as described in "Adding Images"

### Accidentally Deleted Content
- If you haven't restarted the backend, the database still exists
- Default content is only loaded on first run
- Consider backing up `cattery.db` regularly

---

## Best Practices

1. **Regular Updates**: Keep kitten listings current
2. **Respond Promptly**: Check waiting list regularly
3. **Quality Content**: Use good grammar and clear descriptions
4. **Professional Photos**: Use high-quality images
5. **Accurate Info**: Double-check all contact information
6. **Backup**: Periodically save a copy of your database
7. **Test Changes**: Preview pages after making updates

---

## Need Help?

If you need to make changes beyond what the admin panel offers:
- Styling changes: Edit CSS files in `frontend/src/`
- Layout changes: Edit React components in `frontend/src/pages/`
- New features: Modify both backend (`main.py`) and frontend files

Refer to the main README.md for technical details and setup instructions.
