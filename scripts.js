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
            <div class="bribri-text-box">
                <p>
                    La comunidad Bribri es un pueblo indígena de Talamanca,
                    con rica tradición lingüística y espiritual. Su cultura
                    se basa en el respeto a la naturaleza, la familia y la
                    sabiduría ancestral.
                </p>
            </div>
            <button onclick="mostrarDiccionario()">Diccionario</button>
            <button onclick="iniciarJuego1()">Juego de Preguntas</button>
            <button onclick="iniciarJuego2()">Juego de Memoria</button>
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

async function iniciarJuego1() {
    backsound.pause();
    gamesound.currentTime = 0;
    gamesound.play();
    const resp = await fetch("preguntas.json"); 
    let todas = Object.entries(await resp.json());
    todas = todas.sort(() => Math.random() - 0.5);
    preguntas = todas.slice(0, 3);
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
    controls.innerHTML = "";

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

function salirJuegoMemoria() {
    mostrarBribri();
    gamesound.pause();
    backsound.currentTime = 0;
    backsound.play();
}


async function iniciarJuego2() {
    backsound.pause();
    gamesound.currentTime = 0;
    gamesound.play();

    const resp = await fetch("memoria.json"); 
    const data = await resp.json();

    let cartas = [];
    Object.entries(data).forEach(([palabra, info]) => {
        cartas.push({ tipo: "imagen", palabra, contenido: `<img src="img/${info.Imagen}" alt="${palabra}">` });
        cartas.push({ tipo: "definicion", palabra, contenido: `<p>${info.Definicion}</p>` });
    });

    cartas = cartas.sort(() => Math.random() - 0.5).slice(0, 16);

    cardMapa.innerHTML = `
        <div id="memoria-container" class="memoria-grid"></div>
        <div class="controls">
            <button onclick="salirJuegoMemoria()">Regresar</button>
        </div>
    `;


    const grid = document.getElementById("memoria-container");
    cartas.forEach((carta, index) => {
        const btn = document.createElement("button");
        btn.className = "carta";
        btn.dataset.palabra = carta.palabra;
        btn.dataset.tipo = carta.tipo;
        btn.dataset.contenido = carta.contenido;
        btn.dataset.index = index;
        btn.textContent = "❓"; 
        btn.onclick = () => voltearCarta(btn);
        grid.appendChild(btn);
    });

    seleccionadas = [];
}

let seleccionadas = [];

function voltearCarta(btn) {
    if (seleccionadas.length >= 2 || btn.classList.contains("encontrada")) return;

    btn.innerHTML = btn.dataset.contenido;
    seleccionadas.push(btn);

    if (seleccionadas.length === 2) {
        setTimeout(() => {
            const [c1, c2] = seleccionadas;
            if (c1.dataset.palabra === c2.dataset.palabra && c1.dataset.tipo !== c2.dataset.tipo) {
                c1.classList.add("encontrada");
                c2.classList.add("encontrada");
                c1.disabled = true;
                c2.disabled = true;
            } else {
                c1.textContent = "❓";
                c2.textContent = "❓";
            }
            seleccionadas = [];

            const restantes = document.querySelectorAll(".carta:not(.encontrada)");
            if (restantes.length === 0) {
                setTimeout(() => {
                    cardMapa.innerHTML = `
                        <div class="memoria-end">
                            <h2>🎉 Juego de Memoria Terminado 🎉</h2>
                            <button onclick="salirJuegoMemoria()">Regresar</button>
                        </div>
                    `;
                }, 1000); 
            }
        }, 1000);
    }
}





function volverMapa() {
    cardMapa.innerHTML = `
        <img src="img/Mapa5.png" alt="Mapa global" class="card-img">
        <button class="btn-costa-rica" onclick="mostrarCostaRica()"></button>
    `;
}