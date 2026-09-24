const recomendaciones = [];

let recomendacionEditando = null;
let filtroActual = "todas";


const botonAgregar = document.getElementById(
    "boton-agregar-recommendation"
);

const formulario = document.getElementById(
    "formulario-recommendation"
);

const lista = document.getElementById(
    "lista-recommendations"
);

const mensajeVacio = document.getElementById(
    "sin-recommendations"
);

const contador = document.getElementById(
    "contador-recommendations"
);

const nombreInput = document.getElementById(
    "nombre-recommendation"
);

const tipoInput = document.getElementById(
    "tipo-recommendation"
);

const categoriaInput = document.getElementById(
    "categoria-recommendation"
);

const recomendadoPorInput = document.getElementById(
    "recomendado-por"
);

const portadaInput = document.getElementById(
    "portada-recommendation"
);

const vistaPrevia = document.getElementById(
    "vista-previa-recommendation"
);

const notaInput = document.getElementById(
    "nota-recommendation"
);

const guardarButton = document.getElementById(
    "guardar-recommendation"
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
   VISTA PREVIA DE PORTADA
========================================================= */

portadaInput.addEventListener("change", () => {

    const archivo = portadaInput.files[0];

    vistaPrevia.innerHTML = "";

    if (!archivo) {
        return;
    }

    const imagen = document.createElement("img");

    imagen.src = URL.createObjectURL(archivo);

    imagen.alt = "Vista previa de portada";

    vistaPrevia.appendChild(imagen);

});


/* =========================================================
   FILTROS
========================================================= */

const botonesFiltro = document.querySelectorAll(
    ".filtro-recommendation"
);

botonesFiltro.forEach((boton) => {

    boton.addEventListener("click", () => {

        botonesFiltro.forEach((otroBoton) => {
            otroBoton.classList.remove("activo");
        });

        boton.classList.add("activo");

        filtroActual = boton.dataset.filtro;

        renderizarRecomendaciones();

    });

});


/* =========================================================
   FORMULARIO
========================================================= */

formulario.addEventListener("submit", (evento) => {

    evento.preventDefault();

    const nombre = nombreInput.value.trim();

    const tipo = tipoInput.value;

    const categoria = categoriaInput.value;

    const recomendadoPor = recomendadoPorInput.value;

    const nota = notaInput.value.trim();

    const archivo = portadaInput.files[0];


    if (!nombre) {
        return;
    }


    let portada = null;


    if (archivo) {

        portada = URL.createObjectURL(archivo);

    }


    if (recomendacionEditando !== null) {

        const recomendacion =
            recomendaciones.find(
                (item) =>
                    item.id === recomendacionEditando
            );


        if (recomendacion) {

            recomendacion.nombre = nombre;

            recomendacion.tipo = tipo;

            recomendacion.categoria = categoria;

            recomendacion.recomendadoPor =
                recomendadoPor;

            recomendacion.nota = nota;


            if (portada) {
                recomendacion.portada = portada;
            }

        }

    } else {

        const nuevaRecomendacion = {

            id: Date.now(),

            nombre: nombre,

            tipo: tipo,

            categoria: categoria,

            recomendadoPor: recomendadoPor,

            portada: portada,

            nota: nota

        };


        recomendaciones.push(
            nuevaRecomendacion
        );

    }


    limpiarFormulario();

    renderizarRecomendaciones();

});


/* =========================================================
   RENDERIZAR RECOMENDACIONES
========================================================= */

function renderizarRecomendaciones() {

    lista.innerHTML = "";


    const recomendacionesFiltradas =
        recomendaciones.filter((recomendacion) => {

            if (filtroActual === "todas") {
                return true;
            }

            return (
                recomendacion.categoria ===
                filtroActual
            );

        });


    contador.textContent =
        `${recomendacionesFiltradas.length} recommendations`;


    if (recomendacionesFiltradas.length === 0) {

        mensajeVacio.style.display = "flex";

    } else {

        mensajeVacio.style.display = "none";

    }


    recomendacionesFiltradas.forEach(
        (recomendacion) => {

            const tarjeta =
                document.createElement("article");

            tarjeta.className =
                "recommendation-item";


            /* ---------- PORTADA ---------- */

            const portada =
                document.createElement("div");

            portada.className =
                "portada-recommendation";


            if (recomendacion.portada) {

                const imagen =
                    document.createElement("img");

                imagen.src =
                    recomendacion.portada;

                imagen.alt =
                    `Portada de ${recomendacion.nombre}`;

                portada.appendChild(imagen);

            } else {

                const simbolo =
                    document.createElement("span");

                simbolo.textContent = "✦";

                portada.appendChild(simbolo);

            }


            /* ---------- INFORMACIÓN ---------- */

            const informacion =
                document.createElement("div");

            informacion.className =
                "info-recommendation";


            const titulo =
                document.createElement("h2");

            titulo.textContent =
                recomendacion.nombre;


            const tipo =
                document.createElement("p");

            tipo.className =
                "tipo-recommendation";

            tipo.textContent =
                recomendacion.tipo;


            /* ---------- CATEGORÍA ---------- */

            const categoria =
                document.createElement("span");

            categoria.className =
                "categoria-recommendation";

            categoria.dataset.categoria =
                recomendacion.categoria;


            if (
                recomendacion.categoria ===
                "para-vale"
            ) {

                categoria.textContent =
                    "para vale";

            } else if (
                recomendacion.categoria ===
                "para-javi"
            ) {

                categoria.textContent =
                    "para javi";

            } else {

                categoria.textContent =
                    "para ver juntas";

            }


            /* ---------- QUIÉN RECOMENDÓ ---------- */

            const recomendadoPor =
                document.createElement("p");

            recomendadoPor.className =
                "recomendado-por";


            if (
                recomendacion.recomendadoPor ===
                "vale"
            ) {

                recomendadoPor.textContent =
                    "recomendada por vale";

            } else {

                recomendadoPor.textContent =
                    "recomendada por javi";

            }


            /* ---------- NOTA ---------- */

            informacion.appendChild(titulo);

            informacion.appendChild(tipo);

            informacion.appendChild(categoria);

            informacion.appendChild(recomendadoPor);


            if (recomendacion.nota) {

                const nota =
                    document.createElement("p");

                nota.className =
                    "nota-recommendation";

                nota.textContent =
                    recomendacion.nota;

                informacion.appendChild(nota);

            }


            /* ---------- ACCIONES ---------- */

            const acciones =
                document.createElement("div");

            acciones.className =
                "acciones-recommendation";


            const editar =
                document.createElement("button");

            editar.type = "button";

            editar.className = "editar";

            editar.textContent = "editar";


            editar.addEventListener(
                "click",
                () => {

                    cargarParaEditar(
                        recomendacion
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

                    eliminarRecomendacion(
                        recomendacion.id
                    );

                }
            );


            acciones.appendChild(editar);

            acciones.appendChild(eliminar);


            informacion.appendChild(acciones);


            tarjeta.appendChild(portada);

            tarjeta.appendChild(informacion);


            lista.appendChild(tarjeta);

        }
    );

}


/* =========================================================
   EDITAR
========================================================= */

function cargarParaEditar(recomendacion) {

    recomendacionEditando =
        recomendacion.id;


    nombreInput.value =
        recomendacion.nombre;

    tipoInput.value =
        recomendacion.tipo;

    categoriaInput.value =
        recomendacion.categoria;

    recomendadoPorInput.value =
        recomendacion.recomendadoPor;

    notaInput.value =
        recomendacion.nota;


    vistaPrevia.innerHTML = "";


    if (recomendacion.portada) {

        const imagen =
            document.createElement("img");

        imagen.src =
            recomendacion.portada;

        imagen.alt =
            `Vista previa de ${recomendacion.nombre}`;

        vistaPrevia.appendChild(imagen);

    }


    guardarButton.textContent =
        "guardar cambios";


    formulario.style.display =
        "flex";


    nombreInput.focus();

}


/* =========================================================
   ELIMINAR
========================================================= */

function eliminarRecomendacion(id) {

    const indice =
        recomendaciones.findIndex(
            (item) => item.id === id
        );


    if (indice === -1) {
        return;
    }


    recomendaciones.splice(
        indice,
        1
    );


    renderizarRecomendaciones();

}


/* =========================================================
   LIMPIAR FORMULARIO
========================================================= */

function limpiarFormulario() {

    formulario.reset();

    recomendacionEditando = null;

    vistaPrevia.innerHTML = "";

    guardarButton.textContent =
        "guardar recomendación";

    formulario.style.display =
        "none";

}


/* =========================================================
   INICIO
========================================================= */

renderizarRecomendaciones();