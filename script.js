function generatePlan() {
  const city = document.getElementById("city").value;
  const type = document.getElementById("type").value;
  const output = document.getElementById("output");

  if (!placesData[city]) {
    output.innerHTML = "City not found";
    return;
  }

  let html = "<h2>Your Plan (6AM - 9PM)</h2>";

  placesData[city].forEach(place => {
    let cost = place.distance * (12 + Math.random() * 6);

    html += `
      <div class="card">
        <h3>${place.name}</h3>
        <p>👥 Crowd: ${place.crowd}</p>
        <p>📏 Distance: ${place.distance} km</p>
        <p>💰 Estimated Cost: ₹${Math.round(cost)}</p>

        <button onclick="openRapido('${place.name}')">
          🚕 Go via Rapido
        </button>
      </div>
    `;
  });

  output.innerHTML = html;
}

function openRapido(place) {
  window.open("https://rapido.bike/", "_blank");
}