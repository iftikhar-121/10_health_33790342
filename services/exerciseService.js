// Exercise Service - API-Ninjas integration for workout suggestions
const API_NINJAS_BASE = 'https://api.api-ninjas.com/v1';

// Fetch exercise suggestions from API-Ninjas based on workout type
async function fetchExerciseSuggestions(workoutType) {
  try {
    const apiKey = process.env.API_NINJAS_KEY;
    
    if (!apiKey) {
      return getFallbackExercises(workoutType);
    }

    // Map our workout types to API-Ninjas exercise types
    const typeMapping = {
      cardio: 'cardio',
      strength: 'strength',
      flexibility: 'stretching',
      balance: 'stability',
      sport: 'cardio',
      other: 'cardio'
    };

    const searchType = typeMapping[workoutType] || 'cardio';
    const url = `${API_NINJAS_BASE}/exercises?type=${searchType}&offset=0`;
    
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'X-Api-Key': apiKey,
        'Accept': 'application/json'
      },
      signal: AbortSignal.timeout(5000)
    });

    if (!response.ok) {
      throw new Error(`API responded with status ${response.status}`);
    }

    const data = await response.json();
    
    if (!data || data.length === 0) {
      return getFallbackExercises(workoutType);
    }
    
    const exercises = data
      .slice(0, 3)
      .map(ex => ({
        name: ex.name || 'Exercise',
        description: ex.instructions || 'A great exercise to include in your workout routine',
        equipment: ex.equipment || 'None',
        difficulty: ex.difficulty || 'intermediate',
        muscle: ex.muscle || 'various'
      }));

    return exercises;

  } catch (error) {
    console.error('Error fetching exercise suggestions:', error.message);
    return getFallbackExercises(workoutType);
  }
}

// Strip HTML tags and fix UTF-8 encoding issues from API responses
function stripHtml(html) {
  if (!html) return '';
  
  let stripped = html.replace(/<[^>]*>/g, '').trim();
  
  stripped = stripped
    .replace(/â€™/g, "'")
    .replace(/â€œ/g, '"')
    .replace(/â€/g, '"')
    .replace(/â€"/g, '–')
    .replace(/â€"/g, '—')
    .replace(/â€¦/g, '...')
    .replace(/Â /g, ' ')
    .replace(/Ã©/g, 'é')
    .replace(/Ã¨/g, 'è')
    .replace(/Ã /g, 'à')
    .replace(/Ã´/g, 'ô');
  
  const entities = {
    '&amp;': '&',
    '&lt;': '<',
    '&gt;': '>',
    '&quot;': '"',
    '&#39;': "'",
    '&apos;': "'",
    '&#x27;': "'",
    '&rsquo;': "'",
    '&lsquo;': "'",
    '&rdquo;': '"',
    '&ldquo;': '"',
    '&ndash;': '–',
    '&mdash;': '—',
    '&hellip;': '...',
    '&nbsp;': ' '
  };
  
  for (const [entity, char] of Object.entries(entities)) {
    stripped = stripped.replace(new RegExp(entity, 'g'), char);
  }
  
  if (!stripped || stripped.length < 5) return '';
  return stripped.length > 100 ? stripped.slice(0, 100) + '...' : stripped;
}

// Fallback exercises when API is unavailable or rate-limited
function getFallbackExercises(workoutType) {
  const fallbacks = {
    cardio: [
      { name: 'Running', description: 'Excellent cardiovascular exercise that builds endurance and burns calories', equipment: 'Running shoes' },
      { name: 'Jump Rope', description: 'High-intensity cardio workout that improves coordination and burns fat quickly', equipment: 'Jump rope' },
      { name: 'Cycling', description: 'Low-impact cardio exercise suitable for all fitness levels, great for leg strength', equipment: 'Bicycle or stationary bike' }
    ],
    strength: [
      { name: 'Push-ups', description: 'Classic bodyweight exercise targeting chest, shoulders, and triceps. Great for upper body strength', equipment: 'None (bodyweight)' },
      { name: 'Squats', description: 'Fundamental lower body exercise that builds leg strength, targets quads, glutes, and hamstrings', equipment: 'None (can add weights)' },
      { name: 'Deadlifts', description: 'Compound exercise that works entire posterior chain, excellent for building overall strength', equipment: 'Barbell or dumbbells' }
    ],
    flexibility: [
      { name: 'Hamstring Stretch', description: 'Stretches the back of your thighs, important for lower back health and mobility', equipment: 'Yoga mat (optional)' },
      { name: 'Cat-Cow Stretch', description: 'Dynamic spine stretch that improves flexibility and relieves back tension', equipment: 'Yoga mat' },
      { name: 'Shoulder Rolls', description: 'Loosens tight shoulders and improves upper body mobility and posture', equipment: 'None' }
    ],
    balance: [
      { name: 'Single Leg Stand', description: 'Improves balance and ankle stability, great for injury prevention', equipment: 'None' },
      { name: 'Tree Pose', description: 'Yoga balance pose that strengthens legs and improves focus and stability', equipment: 'Yoga mat (optional)' },
      { name: 'Bosu Ball Exercises', description: 'Various balance exercises that challenge core stability and coordination', equipment: 'Bosu ball' }
    ],
    sport: [
      { name: 'Basketball Drills', description: 'Improves agility, coordination, and cardiovascular fitness through sport-specific movements', equipment: 'Basketball and court' },
      { name: 'Tennis Practice', description: 'Develops hand-eye coordination, speed, and endurance through racket sports', equipment: 'Tennis racket and court' },
      { name: 'Swimming Laps', description: 'Full-body workout that builds endurance while being easy on joints', equipment: 'Swimming pool and goggles' }
    ],
    other: [
      { name: 'Walking', description: 'Simple low-impact exercise perfect for beginners or active recovery days', equipment: 'Comfortable shoes' },
      { name: 'Yoga Flow', description: 'Combines strength, flexibility, and mindfulness in one complete practice', equipment: 'Yoga mat' },
      { name: 'Dancing', description: 'Fun way to improve cardiovascular fitness, coordination, and mood', equipment: 'Music and open space' }
    ]
  };

  return fallbacks[workoutType] || fallbacks.cardio;
}

module.exports = {
  fetchExerciseSuggestions,
  getFallbackExercises
};
