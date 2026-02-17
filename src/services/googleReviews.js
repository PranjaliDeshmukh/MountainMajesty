// Google Places API integration for fetching reviews
// You'll need to get a Google Places API key from: https://console.cloud.google.com/

const GOOGLE_PLACES_API_KEY = import.meta.env.VITE_GOOGLE_PLACES_API_KEY || ''

/**
 * Fetch reviews from Google Places API
 * @param {string} placeId - The Google Place ID for the property
 * @returns {Promise<Array>} Array of reviews
 */
export async function fetchGoogleReviews(placeId) {
  if (!GOOGLE_PLACES_API_KEY) {
    console.warn('Google Places API key not found. Using mock data.')
    return getMockGoogleReviews()
  }

  try {
    // Note: In production, you should make this request from your backend
    // to keep the API key secure. This is a client-side example.
    const response = await fetch(
      `https://maps.googleapis.com/maps/api/place/details/json?place_id=${placeId}&fields=reviews,rating,user_ratings_total&key=${GOOGLE_PLACES_API_KEY}`
    )

    if (!response.ok) {
      throw new Error('Failed to fetch Google reviews')
    }

    const data = await response.json()
    
    if (data.status === 'OK' && data.result.reviews) {
      return data.result.reviews.map(review => ({
        id: `google_${review.time}`,
        author: review.author_name,
        date: formatGoogleDate(review.time),
        rating: review.rating,
        comment: review.text,
        avatar: review.author_name.charAt(0).toUpperCase(),
        platform: 'google',
        profilePhotoUrl: review.profile_photo_url,
        relativeTimeDescription: review.relative_time_description
      }))
    }

    return getMockGoogleReviews()
  } catch (error) {
    console.error('Error fetching Google reviews:', error)
    return getMockGoogleReviews()
  }
}

/**
 * Format Google's Unix timestamp to readable date
 * @param {number} timestamp - Unix timestamp
 * @returns {string} Formatted date
 */
function formatGoogleDate(timestamp) {
  const date = new Date(timestamp * 1000)
  return date.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })
}

/**
 * Mock Google reviews for development/fallback
 */
function getMockGoogleReviews() {
  return [
    {
      id: 'google_1',
      author: 'Rahul M.',
      date: 'November 2025',
      rating: 5,
      comment: 'Great location for a peaceful retreat. Very clean and well-maintained property. The kitchen had everything we needed. Would definitely recommend!',
      avatar: 'R',
      platform: 'google'
    },
    {
      id: 'google_2',
      author: 'Meera D.',
      date: 'August 2025',
      rating: 5,
      comment: 'Outstanding hospitality! The property exceeded our expectations. Very peaceful location, great amenities, and the host went above and beyond to make our stay comfortable.',
      avatar: 'M',
      platform: 'google'
    }
  ]
}

/**
 * Search for a place and get its Place ID
 * @param {string} query - Search query (e.g., "Mountain Majesty Resort, Karjat")
 * @returns {Promise<string>} Place ID
 */
export async function searchPlaceId(query) {
  if (!GOOGLE_PLACES_API_KEY) {
    console.warn('Google Places API key not found.')
    return null
  }

  try {
    const response = await fetch(
      `https://maps.googleapis.com/maps/api/place/findplacefromtext/json?input=${encodeURIComponent(query)}&inputtype=textquery&fields=place_id&key=${GOOGLE_PLACES_API_KEY}`
    )

    const data = await response.json()
    
    if (data.status === 'OK' && data.candidates.length > 0) {
      return data.candidates[0].place_id
    }

    return null
  } catch (error) {
    console.error('Error searching for place:', error)
    return null
  }
}
