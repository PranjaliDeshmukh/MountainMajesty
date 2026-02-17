# Google Places API Setup Guide

## Step 1: Get Your Google Places API Key

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select an existing one
3. Enable the **Places API**:
   - Navigate to "APIs & Services" > "Library"
   - Search for "Places API"
   - Click "Enable"
4. Create credentials:
   - Go to "APIs & Services" > "Credentials"
   - Click "Create Credentials" > "API Key"
   - Copy your API key

## Step 2: Configure Your API Key

### For Development (Not Recommended for Production)
Create a `.env` file in the `weekend-home` folder:

```bash
VITE_GOOGLE_PLACES_API_KEY=your_api_key_here
```

### For Production (Recommended)
**Important:** Never expose your API key in frontend code for production. Instead:

1. Create a backend proxy server
2. Store the API key on the backend
3. Make requests to your backend, which then calls Google Places API

## Step 3: Get Google Place IDs for Your Properties

You need to find the Google Place ID for each property:

### Method 1: Using Place ID Finder Tool
Visit: https://developers.google.com/maps/documentation/places/web-service/place-id

### Method 2: Using the search function in the app
The service includes a `searchPlaceId()` function:

```javascript
import { searchPlaceId } from './services/googleReviews'

const placeId = await searchPlaceId('Mountain Majesty Resort, Karjat')
console.log('Place ID:', placeId)
```

## Step 4: Update Property Data

Add the `googlePlaceId` field to each property in `src/data/rooms.js`:

```javascript
{
  id: 'property-912219730451170142',
  name: 'The Mountain Majesty - Cozy 1 BHK Apartment',
  googlePlaceId: 'ChIJ1234567890abcdef', // Replace with actual Place ID
  // ... rest of property data
}
```

## Step 5: Test the Integration

1. Start your development server:
   ```bash
   npm run dev
   ```

2. Click on any property's reviews
3. Google reviews should load automatically (or show mock data if no API key)

## Important Notes

### API Quotas
- Google Places API has usage limits
- Free tier: $200 credit per month
- After that, charges apply
- Monitor usage in Google Cloud Console

### Security Best Practices
1. **Never commit `.env` file to Git** (already in `.gitignore`)
2. **Restrict your API key** in Google Cloud Console:
   - Set HTTP referrer restrictions (e.g., `localhost:*` for dev)
   - Set API restrictions (only allow Places API)
3. **For production**: Use backend proxy to hide API key

### CORS Issues
If you encounter CORS errors:
- Google Places API requires backend proxy for web apps
- Consider using the Places JavaScript Library instead
- Or implement a backend endpoint to fetch reviews

## Alternative: Backend Proxy Setup

Create a simple Node.js backend:

```javascript
// backend/server.js
const express = require('express')
const cors = require('cors')
const axios = require('axios')

const app = express()
app.use(cors())

const GOOGLE_API_KEY = process.env.GOOGLE_PLACES_API_KEY

app.get('/api/reviews/:placeId', async (req, res) => {
  try {
    const { placeId } = req.params
    const response = await axios.get(
      `https://maps.googleapis.com/maps/api/place/details/json`,
      {
        params: {
          place_id: placeId,
          fields: 'reviews,rating,user_ratings_total',
          key: GOOGLE_API_KEY
        }
      }
    )
    res.json(response.data)
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch reviews' })
  }
})

app.listen(3001, () => console.log('Server running on port 3001'))
```

Then update the frontend to call your backend instead of Google directly.

## Troubleshooting

### No reviews showing?
- Check if `googlePlaceId` is set correctly in room data
- Verify API key is in `.env` file
- Check browser console for errors
- Ensure the property actually has reviews on Google Maps

### "API key not valid" error?
- Verify API key is correct
- Make sure Places API is enabled
- Check API key restrictions aren't blocking requests

### Mock data showing instead?
- This is normal if no API key is configured
- Or if the Place ID doesn't exist
- Check console for warnings
