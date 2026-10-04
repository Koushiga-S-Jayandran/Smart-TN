function generatePlan() {
  let city = localStorage.getItem("city");
  let type = localStorage.getItem("type");

  let output = document.getElementById("output");

  let places = placesData[city];

  let html = "";

  places.forEach(place => {
    html += `
      <div class="card" onclick='openDetails(${JSON.stringify(place)})'>
        <img src="${place.img}" class="img">
        <h3>${place.name}</h3>
        <p>${place.crowd} crowd</p>
      </div>
    `;
  });

  output.innerHTML = html;
}

function openDetails(place) {
  localStorage.setItem("place", JSON.stringify(place));
  window.location.href = "details.html";
}

generatePlan();