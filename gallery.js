const fotos = [];

let fotoEditando = null;
let ordenActual = "recientes";


const botonAgregar = document.getElementById(
    "boton-agregar-gallery"
);

const formulario = document.getElementById(
    "formulario-gallery"
);

const imagenInput = document.getElementById(
    "imagen-gallery"
);

const fechaInput = document.getElementById(
    "fecha-gallery"
);

const descripcionInput = document.getElementById(
    "descripcion-gallery"
);

const vistaPrevia = document.getElementById(
    "vista-previa-gallery"
);

const lista = document.getElementById(
    "gallery-grid"
);

const mensajeVacio = document.getElementById(
    "sin-gallery"
);

const contador = document.getElementById(
    "contador-gallery"
);

const botonOrden = document.getElementById(
    "orden-gallery"
);

const guardarButton = document.getElementById(
    "guardar-gallery"
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

        fechaInput.focus();

    }

});


/* =========================================================
   VISTA PREVIA
========================================================= */

imagenInput.addEventListener("change", () => {

    const archivo =
        imagenInput.files[0];


    vistaPrevia.innerHTML = "";


    if (!archivo) {
        return;
    }


    const imagen =
        document.createElement("img");


    imagen.src =
        URL.createObjectURL(archivo);


    imagen.alt =
        "Vista previa de la foto";


    vistaPrevia.appendChild(
        imagen
    );

});


/* =========================================================
   CAMBIAR ORDEN
========================================================= */

botonOrden.addEventListener("click", () => {

    if (ordenActual === "recientes") {

        ordenActual = "antiguas";

        botonOrden.textContent =
            "más antiguas";

    } else {

        ordenActual = "recientes";

        botonOrden.textContent =
            "más recientes";

    }


    renderizarGaleria();

});


/* =========================================================
   GUARDAR FOTO
========================================================= */

formulario.addEventListener("submit", (evento) => {

    evento.preventDefault();


    const archivo =
        imagenInput.files[0];

    const fecha =
        fechaInput.value;

    const descripcion =
        descripcionInput.value.trim();


    if (!fecha) {
        return;
    }


    /* -----------------------------------------------------
       EDITAR
    ----------------------------------------------------- */

    if (fotoEditando !== null) {

        const foto =
            fotos.find(
                (item) =>
                    item.id === fotoEditando
            );


        if (foto) {

            foto.fecha =
                fecha;

            foto.descripcion =
                descripcion;


            if (archivo) {

                foto.imagen =
                    URL.createObjectURL(
                        archivo
                    );

            }

        }

    }


    /* -----------------------------------------------------
       CREAR
    ----------------------------------------------------- */

    else {

        if (!archivo) {
            return;
        }


        const nuevaFoto = {

            id: Date.now(),

            imagen:
                URL.createObjectURL(
                    archivo
                ),

            fecha:
                fecha,

            descripcion:
                descripcion

        };


        fotos.push(
            nuevaFoto
        );

    }


    limpiarFormulario();

    renderizarGaleria();

});


/* =========================================================
   RENDERIZAR GALERÍA
========================================================= */

function renderizarGaleria() {

    lista.innerHTML = "";


    const fotosOrdenadas =
        [...fotos].sort((a, b) => {

            const fechaA =
                new Date(a.fecha);

            const fechaB =
                new Date(b.fecha);


            if (
                ordenActual ===
                "recientes"
            ) {

                return fechaB - fechaA;

            }


            return fechaA - fechaB;

        });


    contador.textContent =
        `${fotos.length} photos`;


    if (fotos.length === 0) {

        mensajeVacio.style.display =
            "flex";

    } else {

        mensajeVacio.style.display =
            "none";

    }


    fotosOrdenadas.forEach(
        (foto) => {

            const tarjeta =
                document.createElement(
                    "article"
                );


            tarjeta.className =
                "gallery-item";


            /* ------------------------------------------------
               IMAGEN
            ------------------------------------------------ */

            const contenedorImagen =
                document.createElement(
                    "div"
                );


            contenedorImagen.className =
                "gallery-imagen-container";


            const imagen =
                document.createElement(
                    "img"
                );


            imagen.src =
                foto.imagen;

            imagen.alt =
                foto.descripcion ||
                "Foto de nuestra galería";


            imagen.addEventListener(
                "click",
                () => {

                    abrirLightbox(
                        foto
                    );

                }
            );


            contenedorImagen.appendChild(
                imagen
            );


            /* ------------------------------------------------
               INFORMACIÓN
            ------------------------------------------------ */

            const informacion =
                document.createElement(
                    "div"
                );


            informacion.className =
                "gallery-info";


            const fecha =
                document.createElement(
                    "span"
                );


            fecha.className =
                "gallery-fecha";


            fecha.textContent =
                formatearFecha(
                    foto.fecha
                );


            informacion.appendChild(
                fecha
            );


            if (foto.descripcion) {

                const descripcion =
                    document.createElement(
                        "p"
                    );


                descripcion.className =
                    "gallery-descripcion";


                descripcion.textContent =
                    foto.descripcion;


                informacion.appendChild(
                    descripcion
                );

            }


            /* ------------------------------------------------
               ACCIONES
            ------------------------------------------------ */

            const acciones =
                document.createElement(
                    "div"
                );


            acciones.className =
                "acciones-gallery";


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
                (evento) => {

                    evento.stopPropagation();

                    cargarParaEditar(
                        foto
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
                (evento) => {

                    evento.stopPropagation();

                    eliminarFoto(
                        foto.id
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


            /* ------------------------------------------------
               TARJETA FINAL
            ------------------------------------------------ */

            tarjeta.appendChild(
                contenedorImagen
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
   FORMATEAR FECHA
========================================================= */

function formatearFecha(fecha) {

    const partes =
        fecha.split("-");


    if (partes.length !== 3) {
        return fecha;
    }


    const año =
        partes[0];

    const mes =
        partes[1];

    const dia =
        partes[2];


    return `${dia}/${mes}/${año}`;

}


/* =========================================================
   EDITAR
========================================================= */

function cargarParaEditar(foto) {

    fotoEditando =
        foto.id;


    fechaInput.value =
        foto.fecha;

    descripcionInput.value =
        foto.descripcion;


    imagenInput.required =
        false;


    vistaPrevia.innerHTML =
        "";


    const imagen =
        document.createElement(
            "img"
        );


    imagen.src =
        foto.imagen;

    imagen.alt =
        "Vista previa de la foto";


    vistaPrevia.appendChild(
        imagen
    );


    guardarButton.textContent =
        "guardar cambios";


    formulario.style.display =
        "flex";


    fechaInput.focus();

}


/* =========================================================
   ELIMINAR
========================================================= */

function eliminarFoto(id) {

    const indice =
        fotos.findIndex(
            (foto) =>
                foto.id === id
        );


    if (indice === -1) {
        return;
    }


    fotos.splice(
        indice,
        1
    );


    renderizarGaleria();

}


/* =========================================================
   LIMPIAR FORMULARIO
========================================================= */

function limpiarFormulario() {

    formulario.reset();

    fotoEditando =
        null;


    imagenInput.required =
        true;


    vistaPrevia.innerHTML =
        "";


    guardarButton.textContent =
        "guardar foto";


    formulario.style.display =
        "none";

}


/* =========================================================
   LIGHTBOX
========================================================= */

const lightbox =
    document.getElementById(
        "gallery-lightbox"
    );

const lightboxImagen =
    document.getElementById(
        "lightbox-imagen"
    );

const lightboxDescripcion =
    document.getElementById(
        "lightbox-descripcion"
    );

const cerrarLightbox =
    document.getElementById(
        "cerrar-lightbox"
    );


function abrirLightbox(foto) {

    lightboxImagen.src =
        foto.imagen;

    lightboxImagen.alt =
        foto.descripcion ||
        "Foto ampliada";


    lightboxDescripcion.textContent =
        foto.descripcion || "";


    lightbox.classList.add(
        "visible"
    );

}


function cerrarLightboxFuncion() {

    lightbox.classList.remove(
        "visible"
    );

    lightboxImagen.src =
        "";

}


cerrarLightbox.addEventListener(
    "click",
    cerrarLightboxFuncion
);


lightbox.addEventListener(
    "click",
    (evento) => {

        if (
            evento.target ===
            lightbox
        ) {

            cerrarLightboxFuncion();

        }

    }
);


/* =========================================================
   INICIO
========================================================= */

renderizarGaleria();