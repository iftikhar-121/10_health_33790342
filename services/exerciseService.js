// Exercise Service - Native HTTPS version (No node-fetch required)
const https = require('https');

// Fetch exercise suggestions from API-Ninjas
function fetchExerciseSuggestions(workoutType) {
  return new Promise((resolve) => {
    const apiKey = process.env.API_NINJAS_KEY;
    
    if (!apiKey) {
      return resolve(getFallbackExercises(workoutType));
    }

    const typeMapping = {
      cardio: 'cardio',
      strength: 'strength',
      flexibility: 'stretching',
      balance: 'stability',
      sport: 'cardio',
      other: 'cardio'
    };

    const searchType = typeMapping[workoutType] || 'cardio';
    const url = `https://api.api-ninjas.com/v1/exercises?type=${searchType}&offset=0`;

    const options = {
      headers: {
        'X-Api-Key': apiKey,
        'Accept': 'application/json'
      },
      timeout: 5000
    };

    const req = https.get(url, options, (res) => {
      if (res.statusCode !== 200) {
        console.error(`API Status: ${res.statusCode}`);
        return resolve(getFallbackExercises(workoutType));
      }

      let data = '';
      res.on('data', (chunk) => data += chunk);
      res.on('end', () => {
        try {
          const json = JSON.parse(data);
          if (!json || json.length === 0) return resolve(getFallbackExercises(workoutType));

          const exercises = json.slice(0, 3).map(ex => ({
            name: ex.name || 'Exercise',
            description: ex.instructions ? stripHtml(ex.instructions) : 'A great exercise.',
            equipment: ex.equipment || 'None',
            difficulty: ex.difficulty || 'intermediate',
            muscle: ex.muscle || 'various'
          }));
          resolve(exercises);
        } catch (e) {
          resolve(getFallbackExercises(workoutType));
        }
      });
    });

    req.on('error', (e) => {
      console.error('API Error:', e.message);
      resolve(getFallbackExercises(workoutType));
    });
    
    req.on('timeout', () => {
      req.destroy();
      resolve(getFallbackExercises(workoutType));
    });
  });
}

function stripHtml(html) {
  if (!html) return '';
  let stripped = html.replace(/<[^>]*>/g, '').trim();
  return stripped.length > 100 ? stripped.slice(0, 100) + '...' : stripped;
}

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