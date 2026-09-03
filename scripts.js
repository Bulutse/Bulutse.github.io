window.addEventListener("scroll", () => {
    if (window.scrollY > 50) document.body.classList.add("scrolled");
    else document.body.classList.remove("scrolled");
});


const backsound = new Audio("Backsound.mp3");
backsound.loop = true;
backsound.volume = 1; 

const gamesound = new Audio("Gamesound.mp3");
gamesound.loop = true;
gamesound.volume = 1; 

document.addEventListener("click", () => {
    if (backsound.paused) {
        backsound.play();
    }
}, { once: true });





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
    backsound.pause();
    gamesound.currentTime = 0;
    gamesound.play();
    const resp = await fetch("preguntas.json"); 
    preguntas = Object.entries(await resp.json());
    indice = 0;
    puntaje = 0;

    cardMapa.innerHTML = `
        <div id="pregunta-container"></div>
        <div class="loro-mensaje-container">
            <img id="loro" src="img/Loro_Silent.png" alt="Loro Bribri" class="info-img">
            <div id="speech-container" class="speech-bubble" style="display:none;"></div>
        </div>
        <div id="controls-container" class="controls"></div>
    `;


    mostrarPregunta();
}


function mostrarPregunta() {
    const [pregunta, opciones] = preguntas[indice];
    const preguntaContainer = document.getElementById("pregunta-container");
    preguntaContainer.innerHTML = `<h2>${pregunta}</h2><div class="opciones-grid"></div>`;
    const grid = preguntaContainer.querySelector(".opciones-grid");

    let lista = [opciones.Correcta, opciones.Incorrecta1, opciones.Incorrecta2, opciones.Incorrecta3]
        .sort(() => Math.random() - 0.5);

    lista.forEach(opcion => {
        const btn = document.createElement("button");
        btn.textContent = opcion;
        btn.onclick = () => verificar(opcion, opciones.Correcta, opciones.Mensaje);
        grid.appendChild(btn);
    });

    const speech = document.getElementById("speech-container");
    if (speech) speech.style.display = "none";

    const loro = document.getElementById("loro");
    if (loro) loro.src = "img/Loro_Silent.png";
}

function verificar(opcion, correcta, mensaje) {
    const preguntaContainer = document.getElementById("pregunta-container");

    if (opcion === correcta) {
        puntaje++;
        preguntaContainer.innerHTML += `<p style="color:#84C786">✅ Correcto: ${opcion}</p>`;
    } else {
        preguntaContainer.innerHTML += `<p style="color:red">❌ Incorrecto. La respuesta correcta es: ${correcta}</p>`;
    }

    if (mensaje) {
        const loro = document.getElementById("loro");
        const speech = document.getElementById("speech-container");
        if (loro) loro.src = "img/Loro_Talking.png";
        if (speech) {
            speech.textContent = mensaje;
            speech.style.display = "block"; 
        }
    } else {
        const loro = document.getElementById("loro");
        const speech = document.getElementById("speech-container");
        if (loro) loro.src = "img/Loro_Silent.png";
        if (speech) {
            speech.textContent = "";
            speech.style.display = "none"; 
        }
    }




    indice++;
    const controls = document.getElementById("controls-container");
    controls.innerHTML = ""; // limpiar antes de añadir

    if (indice < preguntas.length) {
        const next = document.createElement("button");
        next.textContent = "Siguiente";
        next.onclick = mostrarPregunta;
        controls.appendChild(next);
    } else {
        const endMsg = document.createElement("h3");
        endMsg.textContent = `🎉 Juego terminado. Puntaje: ${puntaje}/${preguntas.length}`;
        controls.appendChild(endMsg);

        const btn = document.createElement("button");
        btn.textContent = "Regresar";
        btn.onclick = () => { 
            mostrarBribri();
            gamesound.pause();
            backsound.currentTime = 0;
            backsound.play();
        };
        controls.appendChild(btn);
    }
}


function volverMapa() {
    cardMapa.innerHTML = `
        <img src="img/Mapa5.png" alt="Mapa global" class="card-img">
        <button class="btn-costa-rica" onclick="mostrarCostaRica()"></button>
    `;
}