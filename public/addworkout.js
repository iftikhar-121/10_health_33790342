// Dynamic workout suggestions - reloads page with selected workout type
function updateSuggestions() {
  const workoutType = document.getElementById('workoutType').value;
  // Use relative update of the query string to respect VM subpaths
  window.location.search = '?type=' + workoutType;
}

document.addEventListener('DOMContentLoaded', function() {
  const selectElement = document.getElementById('workoutType');
  if (selectElement) {
    selectElement.addEventListener('change', updateSuggestions);
  }
});