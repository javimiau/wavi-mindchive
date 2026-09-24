const canciones = [];

let cancionEditando = null;


const botonAgregar = document.getElementById(
    "boton-agregar-music"
);

const formulario = document.getElementById(
    "formulario-music"
);

const listaVale = document.getElementById(
    "lista-vale"
);

const listaJavi = document.getElementById(
    "lista-javi"
);

const listaJuntas = document.getElementById(
    "lista-juntas"
);

const mensajeVacio = document.getElementById(
    "sin-music"
);

const nombreInput = document.getElementById(
    "nombre-cancion"
);

const artistaInput = document.getElementById(
    "artista-cancion"
);

const seccionInput = document.getElementById(
    "seccion-music"
);

const agregadaPorInput = document.getElementById(
    "agregada-por"
);

const notaInput = document.getElementById(
    "nota-cancion"
);

const guardarButton = document.getElementById(
    "guardar-music"
);


/* =========================================================
   MOSTRAR / OCULTAR FORMULARIO
========================================================= */

botonAgregar.addEventListener("click", () => {

    const visible =
        formulario.style.display === "flex";


    if (visible) {

        formulario.style.display = "none";

    } else {

        formulario.style.display = "flex";

        nombreInput.focus();

    }

});


/* =========================================================
   GUARDAR CANCIÓN
========================================================= */

formulario.addEventListener("submit", (evento) => {

    evento.preventDefault();


    const nombre =
        nombreInput.value.trim();

    const artista =
        artistaInput.value.trim();

    const seccion =
        seccionInput.value;

    const agregadaPor =
        agregadaPorInput.value;

    const nota =
        notaInput.value.trim();


    if (!nombre || !artista) {
        return;
    }


    /* -----------------------------------------------------
       EDITAR
    ----------------------------------------------------- */

    if (cancionEditando !== null) {

        const cancion =
            canciones.find(
                (item) =>
                    item.id === cancionEditando
            );


        if (cancion) {

            cancion.nombre =
                nombre;

            cancion.artista =
                artista;

            cancion.seccion =
                seccion;

            cancion.agregadaPor =
                agregadaPor;

            cancion.nota =
                nota;

        }

    }


    /* -----------------------------------------------------
       CREAR
    ----------------------------------------------------- */

    else {

        const nuevaCancion = {

            id: Date.now(),

            nombre: nombre,

            artista: artista,

            seccion: seccion,

            agregadaPor: agregadaPor,

            nota: nota

        };


        canciones.push(
            nuevaCancion
        );

    }


    limpiarFormulario();

    renderizarCanciones();

});


/* =========================================================
   RENDERIZAR
========================================================= */

function renderizarCanciones() {

    listaVale.innerHTML = "";

    listaJavi.innerHTML = "";

    listaJuntas.innerHTML = "";


    canciones.forEach(
        (cancion) => {

            const tarjeta =
                crearTarjetaCancion(
                    cancion
                );


            if (
                cancion.seccion ===
                "vale"
            ) {

                listaVale.appendChild(
                    tarjeta
                );

            } else if (
                cancion.seccion ===
                "javi"
            ) {

                listaJavi.appendChild(
                    tarjeta
                );

            } else {

                listaJuntas.appendChild(
                    tarjeta
                );

            }

        }
    );


    if (canciones.length === 0) {

        mensajeVacio.style.display =
            "flex";

    } else {

        mensajeVacio.style.display =
            "none";

    }

}


/* =========================================================
   CREAR TARJETA
========================================================= */

function crearTarjetaCancion(cancion) {

    const tarjeta =
        document.createElement("article");

    tarjeta.className =
        "music-item";


    /* -----------------------------------------------------
       ICONO
    ----------------------------------------------------- */

    const icono =
        document.createElement("div");

    icono.className =
        "music-icon";

    icono.textContent =
        "♫";


    /* -----------------------------------------------------
       INFORMACIÓN
    ----------------------------------------------------- */

    const informacion =
        document.createElement("div");

    informacion.className =
        "info-music";


    const nombre =
        document.createElement("h3");

    nombre.textContent =
        cancion.nombre;


    const artista =
        document.createElement("p");

    artista.className =
        "artista-music";

    artista.textContent =
        cancion.artista;


    informacion.appendChild(
        nombre
    );

    informacion.appendChild(
        artista
    );


    /* -----------------------------------------------------
       AGREGADA POR
    ----------------------------------------------------- */

    const agregadaPor =
        document.createElement("span");

    agregadaPor.className =
        "agregada-por-music";


    if (
        cancion.agregadaPor ===
        "vale"
    ) {

        agregadaPor.textContent =
            "agregada por vale";

    } else {

        agregadaPor.textContent =
            "agregada por javi";

    }


    informacion.appendChild(
        agregadaPor
    );


    /* -----------------------------------------------------
       NOTA
    ----------------------------------------------------- */

    if (cancion.nota) {

        const nota =
            document.createElement("p");

        nota.className =
            "nota-music";

        nota.textContent =
            cancion.nota;

        informacion.appendChild(
            nota
        );

    }


    /* -----------------------------------------------------
       ACCIONES
    ----------------------------------------------------- */

    const acciones =
        document.createElement("div");

    acciones.className =
        "acciones-music";


    const editar =
        document.createElement("button");

    editar.type =
        "button";

    editar.className =
        "editar";

    editar.textContent =
        "editar";


    editar.addEventListener(
        "click",
        () => {

            cargarParaEditar(
                cancion
            );

        }
    );


    const eliminar =
        document.createElement("button");

    eliminar.type =
        "button";

    eliminar.className =
        "eliminar";

    eliminar.textContent =
        "eliminar";


    eliminar.addEventListener(
        "click",
        () => {

            eliminarCancion(
                cancion.id
            );

        }
    );


    acciones.appendChild(
        editar
    );

    acciones.appendChild(
        eliminar
    );


    informacion.appendChild(
        acciones
    );


    /* -----------------------------------------------------
       TARJETA FINAL
    ----------------------------------------------------- */

    tarjeta.appendChild(
        icono
    );

    tarjeta.appendChild(
        informacion
    );


    return tarjeta;

}


/* =========================================================
   EDITAR
========================================================= */

function cargarParaEditar(cancion) {

    cancionEditando =
        cancion.id;


    nombreInput.value =
        cancion.nombre;

    artistaInput.value =
        cancion.artista;

    seccionInput.value =
        cancion.seccion;

    agregadaPorInput.value =
        cancion.agregadaPor;

    notaInput.value =
        cancion.nota;


    guardarButton.textContent =
        "guardar cambios";


    formulario.style.display =
        "flex";


    nombreInput.focus();

}


/* =========================================================
   ELIMINAR
========================================================= */

function eliminarCancion(id) {

    const indice =
        canciones.findIndex(
            (cancion) =>
                cancion.id === id
        );


    if (indice === -1) {
        return;
    }


    canciones.splice(
        indice,
        1
    );


    renderizarCanciones();

}


/* =========================================================
   LIMPIAR FORMULARIO
========================================================= */

function limpiarFormulario() {

    formulario.reset();

    cancionEditando =
        null;


    guardarButton.textContent =
        "guardar canción";


    formulario.style.display =
        "none";

}


/* =========================================================
   INICIO
========================================================= */

renderizarCanciones();