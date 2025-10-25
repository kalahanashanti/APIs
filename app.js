const $ = (sel)=>document.querySelector(sel);
const results = $("#results");
const statusBox = $("#status");
const q = $("#q");
const btn = $("#btnBuscar");

function setStatus(msg, kind=""){ 
  statusBox.textContent = msg; 
  statusBox.className = ""; 
  statusBox.classList.add(kind ? kind : "", "mt-2"); 
  if (msg) statusBox.classList.remove("d-none"); else statusBox.classList.add("d-none");
}

function countryCard(c){
  const name = c.name?.common ?? "—";
  const flag = c.flags?.png || c.flags?.svg || "";
  const capital = (c.capital && c.capital[0]) ? c.capital[0] : "—";
  const region = c.region ?? "—";
  const population = c.population?.toLocaleString() ?? "—";
  const languages = c.languages ? Object.values(c.languages).slice(0,3).join(", ") : "—";
  return `<div class="col-12 col-md-6 col-lg-4">
    <div class="card shadow-sm h-100">
      ${flag ? `<img src="${flag}" class="card-img-top" alt="Bandera de ${name}">` : ""}
      <div class="card-body">
        <h5 class="card-title mb-1">${name}</h5>
        <p class="text-muted small mb-2">${region}</p>
        <ul class="list-unstyled mb-0 small">
          <li><strong>Capital:</strong> ${capital}</li>
          <li><strong>Población:</strong> ${population}</li>
          <li><strong>Idioma(s):</strong> ${languages}</li>
        </ul>
      </div>
    </div>
  </div>`;
}

async function buscar(){
  const term = q.value.trim();
  if(!term){ setStatus("Escribí el nombre de un país.", "error"); return; }
  setStatus("Buscando países…", "loading");
  results.innerHTML = "";
  try{
    const resp = await fetch(`https://restcountries.com/v3.1/name/${encodeURIComponent(term)}`);
    if(!resp.ok) throw new Error("País no encontrado.");
    const data = await resp.json();
    if(!Array.isArray(data) || data.length === 0) throw new Error("Sin resultados.");
    setStatus(`Resultados: ${data.length}`, "ok");
    results.innerHTML = data.map(countryCard).join("");
  }catch(err){
    setStatus("Error: " + err.message, "error");
  }
}

btn.addEventListener("click", buscar);
q.addEventListener("keydown", (e)=>{ if(e.key === "Enter"){ e.preventDefault(); buscar(); }});

// Búsqueda inicial de cortesía
q.value = "Uruguay";
buscar();