const locations = [];

let locationEditando = null;


const botonAgregar = document.getElementById(
    "boton-agregar-location"
);

const formulario = document.getElementById(
    "formulario-location"
);

const listaVisitados = document.getElementById(
    "lista-visitados"
);

const listaPorVisitar = document.getElementById(
    "lista-por-visitar"
);

const mensajeVacio = document.getElementById(
    "sin-locations"
);

const nombreInput = document.getElementById(
    "nombre-location"
);

const ubicacionInput = document.getElementById(
    "ubicacion-location"
);

const seccionInput = document.getElementById(
    "seccion-location"
);

const notaInput = document.getElementById(
    "nota-location"
);

const guardarButton = document.getElementById(
    "guardar-location"
);


/* =========================================================
   MOSTRAR / OCULTAR FORMULARIO
========================================================= */

botonAgregar.addEventListener("click", () => {

    const formularioVisible =
        formulario.style.display === "flex";


    if (formularioVisible) {

        formulario.style.display = "none";

    } else {

        formulario.style.display = "flex";

        nombreInput.focus();

    }

});


/* =========================================================
   GUARDAR
========================================================= */

formulario.addEventListener("submit", (evento) => {

    evento.preventDefault();


    const nombre =
        nombreInput.value.trim();

    const ubicacion =
        ubicacionInput.value.trim();

    const seccion =
        seccionInput.value;

    const nota =
        notaInput.value.trim();


    if (!nombre || !ubicacion) {
        return;
    }


    /* -----------------------------------------------------
       EDITAR
    ----------------------------------------------------- */

    if (locationEditando !== null) {

        const location =
            locations.find(
                (item) =>
                    item.id === locationEditando
            );


        if (location) {

            location.nombre = nombre;

            location.ubicacion = ubicacion;

            location.seccion = seccion;

            location.nota = nota;

        }

    }


    /* -----------------------------------------------------
       CREAR
    ----------------------------------------------------- */

    else {

        const nuevoLocation = {

            id: Date.now(),

            nombre: nombre,

            ubicacion: ubicacion,

            seccion: seccion,

            nota: nota

        };


        locations.push(
            nuevoLocation
        );

    }


    limpiarFormulario();

    renderizarLocations();

});


/* =========================================================
   RENDERIZAR
========================================================= */

function renderizarLocations() {

    listaVisitados.innerHTML = "";

    listaPorVisitar.innerHTML = "";


    const visitados =
        locations.filter(
            (location) =>
                location.seccion === "visitados"
        );


    const porVisitar =
        locations.filter(
            (location) =>
                location.seccion === "por-visitar"
        );


    /* -----------------------------------------------------
       MENSAJE GENERAL
    ----------------------------------------------------- */

    if (locations.length === 0) {

        mensajeVacio.style.display = "flex";

    } else {

        mensajeVacio.style.display = "none";

    }


    /* -----------------------------------------------------
       VISITADOS
    ----------------------------------------------------- */

    visitados.forEach(
        (location) => {

            const tarjeta =
                crearTarjetaLocation(
                    location
                );

            listaVisitados.appendChild(
                tarjeta
            );

        }
    );


    /* -----------------------------------------------------
       POR VISITAR
    ----------------------------------------------------- */

    porVisitar.forEach(
        (location) => {

            const tarjeta =
                crearTarjetaLocation(
                    location
                );

            listaPorVisitar.appendChild(
                tarjeta
            );

        }
    );

}


/* =========================================================
   CREAR TARJETA
========================================================= */

function crearTarjetaLocation(location) {

    const tarjeta =
        document.createElement("article");

    tarjeta.className =
        "location-item";


    /* -----------------------------------------------------
       ICONO
    ----------------------------------------------------- */

    const icono =
        document.createElement("div");

    icono.className =
        "location-icon";


    if (location.seccion === "visitados") {

        icono.textContent = "♡";

    } else {

        icono.textContent = "✦";

    }


    /* -----------------------------------------------------
       INFORMACIÓN
    ----------------------------------------------------- */

    const informacion =
        document.createElement("div");

    informacion.className =
        "info-location";


    const titulo =
        document.createElement("h3");

    titulo.textContent =
        location.nombre;


    const ubicacion =
        document.createElement("p");

    ubicacion.className =
        "ubicacion-location";

    ubicacion.textContent =
        location.ubicacion;


    informacion.appendChild(
        titulo
    );

    informacion.appendChild(
        ubicacion
    );


    /* -----------------------------------------------------
       NOTA
    ----------------------------------------------------- */

    if (location.nota) {

        const nota =
            document.createElement("p");

        nota.className =
            "nota-location";

        nota.textContent =
            location.nota;

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
        "acciones-location";


    const editar =
        document.createElement("button");

    editar.type = "button";

    editar.className = "editar";

    editar.textContent = "editar";


    editar.addEventListener(
        "click",
        () => {

            cargarParaEditar(
                location
            );

        }
    );


    const eliminar =
        document.createElement("button");

    eliminar.type = "button";

    eliminar.className =
        "eliminar";

    eliminar.textContent =
        "eliminar";


    eliminar.addEventListener(
        "click",
        () => {

            eliminarLocation(
                location.id
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

function cargarParaEditar(location) {

    locationEditando =
        location.id;


    nombreInput.value =
        location.nombre;

    ubicacionInput.value =
        location.ubicacion;

    seccionInput.value =
        location.seccion;

    notaInput.value =
        location.nota;


    guardarButton.textContent =
        "guardar cambios";


    formulario.style.display =
        "flex";


    nombreInput.focus();

}


/* =========================================================
   ELIMINAR
========================================================= */

function eliminarLocation(id) {

    const indice =
        locations.findIndex(
            (item) =>
                item.id === id
        );


    if (indice === -1) {
        return;
    }


    locations.splice(
        indice,
        1
    );


    renderizarLocations();

}


/* =========================================================
   LIMPIAR FORMULARIO
========================================================= */

function limpiarFormulario() {

    formulario.reset();

    locationEditando = null;

    guardarButton.textContent =
        "guardar lugar";

    formulario.style.display =
        "none";

}


/* =========================================================
   INICIO
========================================================= */

renderizarLocations();