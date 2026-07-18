window.addEventListener("scroll", () => {
    if (window.scrollY > 50) document.body.classList.add("scrolled");
    else document.body.classList.remove("scrolled");
});

const cardMapa = document.getElementById("card-mapa");
let preguntas = [], indice = 0, puntaje = 0;
            

function mostrarCostaRica() {
    cardMapa.innerHTML = `
        <div class="card-img-container">
        <img src="img/Mapa2.png" alt="Costa Rica" class="card-img">
        <button class="btn-bribri" onclick="mostrarBribri()"></button>
        <button class="btn-regresar" onclick="volverMapa()">Regresar</button>
        </div>
    `;
}

function mostrarBribri() {
    cardMapa.innerHTML = `
        <div class="bribri-view">
        <button class="btn-regresar" onclick="mostrarCostaRica()">Regresar</button>
        <h3>Cultura Bribri</h3>
        <button onclick="mostrarDiccionario()">Diccionario</button>
        <button onclick="iniciarJuego()">Juego Cultural</button>
        </div>
    `;
}

async function mostrarDiccionario() {
    const resp = await fetch("diccionario.json");
    const data = await resp.json();
    cardMapa.innerHTML = `
        <div class="diccionario-container">
        <h2>Diccionario Cultural</h2>
        <div class="diccionario-grid"></div>
        <button class="btn-regresar" onclick="mostrarBribri()">Regresar</button>
        </div>
    `;
    const grid = cardMapa.querySelector(".diccionario-grid");
    Object.entries(data).forEach(([palabra, definicion]) => {
        const card = document.createElement("div");
        card.className = "diccionario-item";
        card.innerHTML = `<h3>${palabra}</h3><p>${definicion}</p>`;
        grid.appendChild(card);
    });
}

async function iniciarJuego() {
    const resp = await fetch("preguntas.json"); 
    preguntas = Object.entries(await resp.json());
    indice = 0;
    puntaje = 0;
    mostrarPregunta();
}

function mostrarPregunta() {
    const [pregunta, opciones] = preguntas[indice];
    cardMapa.innerHTML = `<h2>${pregunta}</h2>`;
    let lista = [opciones.Correcta, opciones.Incorrecta1, opciones.Incorrecta2, opciones.Incorrecta3]
        .sort(() => Math.random() - 0.5);
    lista.forEach(opcion => {
        const btn = document.createElement("button");
        btn.textContent = opcion;
        btn.onclick = () => verificar(opcion, opciones.Correcta, opciones.Mensaje);
        cardMapa.appendChild(btn);
    });
}

function verificar(opcion, correcta, mensaje) {
    if (opcion === correcta) {
        puntaje++;
        cardMapa.innerHTML += `<p style="color:green">✅ Correcto: ${opcion}</p>`;
    } else {
        cardMapa.innerHTML += `<p style="color:red">❌ Incorrecto. La respuesta correcta es: ${correcta}</p>`;
    }
    if (mensaje) cardMapa.innerHTML += `<p>💡 ${mensaje}</p>`;
    indice++;
    if (indice < preguntas.length) {
        const next = document.createElement("button");
        next.textContent = "Siguiente";
        next.onclick = mostrarPregunta;
        cardMapa.appendChild(next);
    } else {
        cardMapa.innerHTML += `<h3>🎉 Juego terminado. Puntaje: ${puntaje}/${preguntas.length}</h3>`;
        const btn = document.createElement("button");
        btn.textContent = "Regresar";
        btn.onclick = mostrarBribri;
        cardMapa.appendChild(btn);
    }
}

function volverMapa() {
    cardMapa.innerHTML = `
        <img src="img/Mapa5.png" alt="Mapa global" class="card-img">
        <button class="btn-costa-rica" onclick="mostrarCostaRica()"></button>
    `;
}