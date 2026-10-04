<!DOCTYPE html>
<html>
<head>
  <title>Preferences</title>
  <link rel="stylesheet" href="style.css">
</head>
<body>

<h2>Select Travel Type</h2>

<select id="type">
  <option>Solo</option>
  <option>Friends</option>
  <option>Family</option>
  <option>Budget</option>
</select>

<button onclick="next()">Next</button>

<script>
function next() {
  let type = document.getElementById("type").value;
  localStorage.setItem("type", type);
  window.location.href = "plan.html";
}
</script>

</body>
</html>