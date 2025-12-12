// Exercise Service - API-Ninjas integration for workout suggestions
const fetch = require('node-fetch'); 
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
      timeout: 5000 // Simplified timeout for node-fetch v2
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
        description: ex.instructions ? stripHtml(ex.instructions) : 'A great exercise.',
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

// Strip HTML tags and fix UTF-8 encoding issues
function stripHtml(html) {
  if (!html) return '';
  let stripped = html.replace(/<[^>]*>/g, '').trim();
  // ... (keep your existing replacement logic here, it was fine)
  return stripped.length > 100 ? stripped.slice(0, 100) + '...' : stripped;
}

// ... (Keep getFallbackExercises exactly as it was)
function getFallbackExercises(workoutType) {
  const fallbacks = {
    cardio: [
      { name: 'Running', description: 'Excellent cardiovascular exercise', equipment: 'Running shoes' },
      { name: 'Jump Rope', description: 'High-intensity cardio workout', equipment: 'Jump rope' },
      { name: 'Cycling', description: 'Low-impact cardio exercise', equipment: 'Bicycle' }
    ],
    strength: [
      { name: 'Push-ups', description: 'Classic bodyweight exercise', equipment: 'None' },
      { name: 'Squats', description: 'Fundamental lower body exercise', equipment: 'None' },
      { name: 'Deadlifts', description: 'Compound exercise for strength', equipment: 'Barbell' }
    ],
    flexibility: [
      { name: 'Hamstring Stretch', description: 'Stretches back of thighs', equipment: 'Mat' },
      { name: 'Cat-Cow', description: 'Spine flexibility', equipment: 'Mat' },
      { name: 'Shoulder Rolls', description: 'Upper body mobility', equipment: 'None' }
    ],
    balance: [
      { name: 'Single Leg Stand', description: 'Improves stability', equipment: 'None' },
      { name: 'Tree Pose', description: 'Yoga balance pose', equipment: 'Mat' },
      { name: 'Bosu Ball', description: 'Core stability', equipment: 'Bosu ball' }
    ],
    sport: [
      { name: 'Basketball', description: 'Agility and coordination', equipment: 'Ball' },
      { name: 'Tennis', description: 'Hand-eye coordination', equipment: 'Racket' },
      { name: 'Swimming', description: 'Full body endurance', equipment: 'Pool' }
    ],
    other: [
      { name: 'Walking', description: 'Low impact movement', equipment: 'Shoes' },
      { name: 'Yoga', description: 'Strength and mind', equipment: 'Mat' },
      { name: 'Dancing', description: 'Cardio and coordination', equipment: 'Music' }
    ]
  };
  return fallbacks[workoutType] || fallbacks.cardio;
}

module.exports = {
  fetchExerciseSuggestions,
  getFallbackExercises
};