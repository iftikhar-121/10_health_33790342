// Dynamic workout suggestions - reloads page with selected workout type
function updateSuggestions() {
  const workoutType = document.getElementById('workoutType').value;
  window.location.href = '/workouts/add-workout?type=' + workoutType;
}

document.addEventListener('DOMContentLoaded', function() {
  const selectElement = document.getElementById('workoutType');
  if (selectElement) {
    selectElement.addEventListener('change', updateSuggestions);
  }
});
