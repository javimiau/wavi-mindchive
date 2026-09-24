/* =========================================================
   CURRENTLY WATCHING
========================================================= */


/* =========================================================
   DATOS
========================================================= */

const audiovisuales = [];

let audiovisualEditando = null;

let filtroActual = "todos";


/* =========================================================
   ELEMENTOS DEL HTML
========================================================= */

const botonAgregar =
    document.getElementById(
        "boton-agregar-watching"
    );

const formulario =
    document.getElementById(
        "formulario-watching"
    );

const lista =
    document.getElementById(
        "lista-watching"
    );

const sinWatching =
    document.getElementById(
        "sin-watching"
    );

const contador =
    document.getElementById(
        "contador-watching"
    );

const filtros =
    document.querySelectorAll(
        ".filtro-watching"
    );


const inputNombre =
    document.getElementById(
        "nombre-watching"
    );

const selectTipo =
    document.getElementById(
        "tipo-watching"
    );

const campoSerie =
    document.getElementById(
        "campo-serie"
    );

const inputProgreso =
    document.getElementById(
        "progreso-watching"
    );

const selectEstado =
    document.getElementById(
        "estado-watching"
    );

const inputPortada =
    document.getElementById(
        "portada-watching"
    );

const vistaPrevia =
    document.getElementById(
        "vista-previa-watching"
    );

const textareaNota =
    document.getElementById(
        "nota-watching"
    );

const botonGuardar =
    document.getElementById(
        "guardar-watching"
    );


/* =========================================================
   MOSTRAR / OCULTAR FORMULARIO
========================================================= */

botonAgregar.addEventListener(
    "click",
    () => {

        if (
            formulario.style.display === "flex"
        ) {

            formulario.style.display =
                "none";

            audiovisualEditando =
                null;

            limpiarFormulario();

            return;
        }


        audiovisualEditando =
            null;

        limpiarFormulario();


        botonGuardar.textContent =
            "guardar audiovisual";


        formulario.style.display =
            "flex";


        formulario.scrollIntoView({
            behavior: "smooth",
            block: "center"
        });

    }
);


/* =========================================================
   CAMBIAR ENTRE SERIE Y PELÍCULA
========================================================= */

selectTipo.addEventListener(
    "change",
    actualizarCampoSerie
);


function actualizarCampoSerie() {

    if (
        selectTipo.value === "serie"
    ) {

        campoSerie.style.display =
            "flex";

    } else {

        campoSerie.style.display =
            "none";

        inputProgreso.value =
            "";

    }

}


/* =========================================================
   PREVISUALIZACIÓN DE PORTADA
========================================================= */

inputPortada.addEventListener(
    "change",
    () => {

        const archivo =
            inputPortada.files[0];


        if (!archivo) {

            vistaPrevia.innerHTML =
                "";

            return;
        }


        const url =
            URL.createObjectURL(
                archivo
            );


        vistaPrevia.innerHTML = `
            <img
                src="${url}"
                alt="Vista previa de la portada"
            >
        `;

    }
);


/* =========================================================
   FILTROS
========================================================= */

filtros.forEach(
    (filtro) => {

        filtro.addEventListener(
            "click",
            () => {

                filtroActual =
                    filtro.dataset.filtro;


                filtros.forEach(
                    (boton) => {

                        boton.classList.remove(
                            "activo"
                        );

                    }
                );


                filtro.classList.add(
                    "activo"
                );


                mostrarAudiovisuales();

            }
        );

    }
);


/* =========================================================
   GUARDAR FORMULARIO
========================================================= */

formulario.addEventListener(
    "submit",
    (evento) => {

        evento.preventDefault();


        const nombre =
            inputNombre.value.trim();


        if (nombre === "") {

            return;
        }


        const tipo =
            selectTipo.value;


        const progreso =
            tipo === "serie"
                ? inputProgreso.value.trim()
                : "";


        const estado =
            selectEstado.value;


        const nota =
            textareaNota.value.trim();


        /* ---------------------------------------------
           EDITAR
        --------------------------------------------- */

        if (audiovisualEditando) {

            audiovisualEditando.nombre =
                nombre;

            audiovisualEditando.tipo =
                tipo;

            audiovisualEditando.progreso =
                progreso;

            audiovisualEditando.estado =
                estado;

            audiovisualEditando.nota =
                nota;


            const archivo =
                inputPortada.files[0];


            if (archivo) {

                audiovisualEditando.portada =
                    URL.createObjectURL(
                        archivo
                    );

            }


            audiovisualEditando =
                null;


            formulario.style.display =
                "none";


            limpiarFormulario();

            mostrarAudiovisuales();

            return;
        }


        /* ---------------------------------------------
           NUEVO
        --------------------------------------------- */

        let portada =
            "";


        const archivo =
            inputPortada.files[0];


        if (archivo) {

            portada =
                URL.createObjectURL(
                    archivo
                );

        }


        const nuevoAudiovisual = {

            id: Date.now(),

            nombre: nombre,

            tipo: tipo,

            progreso: progreso,

            estado: estado,

            portada: portada,

            nota: nota

        };


        audiovisuales.push(
            nuevoAudiovisual
        );


        formulario.style.display =
            "none";


        limpiarFormulario();

        mostrarAudiovisuales();

    }
);


/* =========================================================
   MOSTRAR AUDIOVISUALES
========================================================= */

function mostrarAudiovisuales() {

    lista.innerHTML =
        "";


    let filtrados =
        audiovisuales;


    if (
        filtroActual !== "todos"
    ) {

        filtrados =
            audiovisuales.filter(
                (audiovisual) =>
                    audiovisual.estado ===
                    filtroActual
            );

    }


    /* CONTADOR */

    contador.textContent =
        `${filtrados.length} ${
            filtrados.length === 1
                ? "audiovisual"
                : "audiovisuals"
        }`;


    /* MENSAJE VACÍO */

    if (
        filtrados.length === 0
    ) {

        sinWatching.style.display =
            "flex";

    } else {

        sinWatching.style.display =
            "none";

    }


    /* CREAR TARJETAS */

    filtrados.forEach(
        (audiovisual) => {

            const tarjeta =
                document.createElement(
                    "article"
                );


            tarjeta.className =
                "watching-item";


            /* -----------------------------------------
               PORTADA
            ----------------------------------------- */

            const portada =
                document.createElement(
                    "div"
                );


            portada.className =
                "portada-watching";


            if (
                audiovisual.portada !== ""
            ) {

                const imagen =
                    document.createElement(
                        "img"
                    );


                imagen.src =
                    audiovisual.portada;


                imagen.alt =
                    `Portada de ${audiovisual.nombre}`;


                portada.appendChild(
                    imagen
                );

            } else {

                portada.innerHTML = `
                    <span>♡</span>
                `;

            }


            /* -----------------------------------------
               INFORMACIÓN
            ----------------------------------------- */

            const informacion =
                document.createElement(
                    "div"
                );


            informacion.className =
                "info-watching";


            /* NOMBRE */

            const titulo =
                document.createElement(
                    "h2"
                );


            titulo.textContent =
                audiovisual.nombre;


            informacion.appendChild(
                titulo
            );


            /* TIPO */

            const tipo =
                document.createElement(
                    "p"
                );


            tipo.className =
                "tipo-watching";


            tipo.textContent =
                audiovisual.tipo;


            informacion.appendChild(
                tipo
            );


            /* PROGRESO */

            if (
                audiovisual.tipo === "serie" &&
                audiovisual.progreso !== ""
            ) {

                const progreso =
                    document.createElement(
                        "p"
                    );


                progreso.className =
                    "progreso-watching";


                progreso.textContent =
                    audiovisual.progreso;


                informacion.appendChild(
                    progreso
                );

            }


            /* ESTADO */

            const estado =
                document.createElement(
                    "span"
                );


            estado.className =
                "estado-watching";


            estado.dataset.estado =
                audiovisual.estado;


            estado.textContent =
                audiovisual.estado;


            informacion.appendChild(
                estado
            );


            /* NOTA */

            if (
                audiovisual.nota !== ""
            ) {

                const nota =
                    document.createElement(
                        "p"
                    );


                nota.className =
                    "nota-watching";


                nota.textContent =
                    `"${audiovisual.nota}"`;


                informacion.appendChild(
                    nota
                );

            }


            /* -----------------------------------------
               BOTONES
            ----------------------------------------- */

            const acciones =
                document.createElement(
                    "div"
                );


            acciones.className =
                "acciones-watching";


            const editar =
                document.createElement(
                    "button"
                );


            editar.type =
                "button";


            editar.className =
                "editar";


            editar.textContent =
                "editar";


            editar.addEventListener(
                "click",
                () => {

                    editarAudiovisual(
                        audiovisual
                    );

                }
            );


            const eliminar =
                document.createElement(
                    "button"
                );


            eliminar.type =
                "button";


            eliminar.className =
                "eliminar";


            eliminar.textContent =
                "eliminar";


            eliminar.addEventListener(
                "click",
                () => {

                    eliminarAudiovisual(
                        audiovisual
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


            /* -----------------------------------------
               ARMAR TARJETA
            ----------------------------------------- */

            tarjeta.appendChild(
                portada
            );

            tarjeta.appendChild(
                informacion
            );


            lista.appendChild(
                tarjeta
            );

        }
    );

}


/* =========================================================
   EDITAR
========================================================= */

function editarAudiovisual(
    audiovisual
) {

    audiovisualEditando =
        audiovisual;


    inputNombre.value =
        audiovisual.nombre;


    selectTipo.value =
        audiovisual.tipo;


    inputProgreso.value =
        audiovisual.progreso;


    selectEstado.value =
        audiovisual.estado;


    textareaNota.value =
        audiovisual.nota;


    actualizarCampoSerie();


    vistaPrevia.innerHTML =
        "";


    if (
        audiovisual.portada !== ""
    ) {

        vistaPrevia.innerHTML = `
            <img
                src="${audiovisual.portada}"
                alt="Portada actual"
            >
        `;

    }


    botonGuardar.textContent =
        "guardar cambios";


    formulario.style.display =
        "flex";


    formulario.scrollIntoView({
        behavior: "smooth",
        block: "center"
    });

}


/* =========================================================
   ELIMINAR
========================================================= */

function eliminarAudiovisual(
    audiovisual
) {

    const confirmar =
        confirm(
            `¿Quieres eliminar "${audiovisual.nombre}"?`
        );


    if (!confirmar) {

        return;

    }


    const indice =
        audiovisuales.indexOf(
            audiovisual
        );


    if (indice !== -1) {

        audiovisuales.splice(
            indice,
            1
        );

    }


    mostrarAudiovisuales();

}


/* =========================================================
   LIMPIAR FORMULARIO
========================================================= */

function limpiarFormulario() {

    inputNombre.value =
        "";

    selectTipo.value =
        "serie";

    inputProgreso.value =
        "";

    selectEstado.value =
        "viendo";

    inputPortada.value =
        "";

    textareaNota.value =
        "";

    vistaPrevia.innerHTML =
        "";


    actualizarCampoSerie();

}


/* =========================================================
   INICIO
========================================================= */

actualizarCampoSerie();

mostrarAudiovisuales();