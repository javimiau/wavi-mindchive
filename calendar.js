const eventos = [];

let eventoEditando = null;

const tiposEvento = {
    date: {
        label: "date",
        simbolo: "♡"
    },
    birthday: {
        label: "birthday",
        simbolo: "♢"
    },
    special: {
        label: "special",
        simbolo: "✦"
    },
    movie: {
        label: "movie / series",
        simbolo: "▸"
    },
    music: {
        label: "music",
        simbolo: "♫"
    },
    study: {
        label: "study",
        simbolo: "✎"
    },
    plan: {
        label: "plan",
        simbolo: "☕"
    },
    other: {
        label: "other",
        simbolo: "☆"
    }
};

const meses = [
    "enero",
    "febrero",
    "marzo",
    "abril",
    "mayo",
    "junio",
    "julio",
    "agosto",
    "septiembre",
    "octubre",
    "noviembre",
    "diciembre"
];

const hoy = new Date();

let mesActual = hoy.getMonth();
let añoActual = hoy.getFullYear();

let fechaSeleccionada = crearFecha(
    hoy.getFullYear(),
    hoy.getMonth(),
    hoy.getDate()
);

const calendarMes = document.getElementById("calendar-mes");
const calendarGrid = document.getElementById("calendar-grid");

const fechaSeleccionadaTexto =
    document.getElementById("fecha-seleccionada");

const listaEventos =
    document.getElementById("lista-eventos-calendar");

const sinEventos =
    document.getElementById("sin-eventos-calendar");

const botonAgregar =
    document.getElementById("boton-agregar-calendar");

const formulario =
    document.getElementById("formulario-calendar");

const botonGuardar =
    document.getElementById("guardar-calendar");

const botonMesAnterior =
    document.getElementById("mes-anterior");

const botonMesSiguiente =
    document.getElementById("mes-siguiente");

const nombreInput =
    document.getElementById("nombre-calendar");

const fechaInput =
    document.getElementById("fecha-calendar");

const horaInput =
    document.getElementById("hora-calendar");

const tipoInput =
    document.getElementById("tipo-calendar");

const agregadoInput =
    document.getElementById("agregado-calendar");

const notaInput =
    document.getElementById("nota-calendar");


function crearFecha(año, mes, dia) {
    return (
        año +
        "-" +
        String(mes + 1).padStart(2, "0") +
        "-" +
        String(dia).padStart(2, "0")
    );
}


function obtenerFechaBonita(fecha) {

    const partes = fecha.split("-");

    const año = Number(partes[0]);
    const mes = Number(partes[1]) - 1;
    const dia = Number(partes[2]);

    return `${dia} de ${meses[mes]} de ${año}`;
}


function obtenerEventosDelDia(fecha) {

    return eventos
        .filter(evento => evento.fecha === fecha)
        .sort((a, b) => {

            if (!a.hora && !b.hora) {
                return 0;
            }

            if (!a.hora) {
                return 1;
            }

            if (!b.hora) {
                return -1;
            }

            return a.hora.localeCompare(b.hora);
        });
}


function renderCalendario() {

    calendarMes.textContent =
        `${meses[mesActual]} ${añoActual}`;

    calendarGrid.innerHTML = "";

    const primerDia = new Date(
        añoActual,
        mesActual,
        1
    );

    const ultimoDia = new Date(
        añoActual,
        mesActual + 1,
        0
    );

    let primerDiaSemana = primerDia.getDay();

    /*
        JavaScript considera domingo como 0.
        Lo convertimos para que lunes sea 0.
    */

    primerDiaSemana =
        primerDiaSemana === 0
            ? 6
            : primerDiaSemana - 1;

    const cantidadDias = ultimoDia.getDate();

    const cantidadCeldas =
        Math.ceil(
            (primerDiaSemana + cantidadDias) / 7
        ) * 7;

    for (
        let i = 0;
        i < cantidadCeldas;
        i++
    ) {

        const diaNumero =
            i - primerDiaSemana + 1;

        if (
            diaNumero < 1 ||
            diaNumero > cantidadDias
        ) {

            const celdaVacia =
                document.createElement("div");

            celdaVacia.className =
                "calendar-dia vacio";

            calendarGrid.appendChild(
                celdaVacia
            );

            continue;
        }

        const fecha =
            crearFecha(
                añoActual,
                mesActual,
                diaNumero
            );

        const celda =
            document.createElement("div");

        celda.className =
            "calendar-dia";

        if (fecha === crearFecha(
            hoy.getFullYear(),
            hoy.getMonth(),
            hoy.getDate()
        )) {
            celda.classList.add("hoy");
        }

        if (fecha === fechaSeleccionada) {
            celda.classList.add("seleccionado");
        }

        const numero =
            document.createElement("span");

        numero.className =
            "numero-dia";

        numero.textContent =
            diaNumero;

        celda.appendChild(numero);

        const eventosDia =
            obtenerEventosDelDia(fecha);

        if (eventosDia.length > 0) {

            const simbolos =
                document.createElement("div");

            simbolos.className =
                "simbolos-calendario";

            eventosDia
                .slice(0, 4)
                .forEach(evento => {

                    const simbolo =
                        document.createElement("span");

                    simbolo.className =
                        "simbolo-evento";

                    simbolo.textContent =
                        tiposEvento[evento.tipo].simbolo;

                    simbolo.title =
                        evento.nombre;

                    simbolos.appendChild(
                        simbolo
                    );
                });

            if (eventosDia.length > 4) {

                const mas =
                    document.createElement("span");

                mas.className =
                    "mas-eventos";

                mas.textContent =
                    `+${eventosDia.length - 4}`;

                simbolos.appendChild(mas);
            }

            celda.appendChild(simbolos);
        }

        celda.addEventListener(
            "click",
            () => {

                fechaSeleccionada = fecha;

                renderCalendario();
                renderDetalleDia();
            }
        );

        calendarGrid.appendChild(celda);
    }
}


function renderDetalleDia() {

    fechaSeleccionadaTexto.textContent =
        obtenerFechaBonita(
            fechaSeleccionada
        );

    listaEventos.innerHTML = "";

    const eventosDia =
        obtenerEventosDelDia(
            fechaSeleccionada
        );

    if (eventosDia.length === 0) {

        sinEventos.style.display =
            "block";

    } else {

        sinEventos.style.display =
            "none";

        eventosDia.forEach(evento => {

            const item =
                document.createElement("article");

            item.className =
                "evento-calendar";

            const icono =
                document.createElement("div");

            icono.className =
                "evento-calendar-icono";

            icono.textContent =
                tiposEvento[evento.tipo].simbolo;

            const info =
                document.createElement("div");

            info.className =
                "info-evento-calendar";

            const titulo =
                document.createElement("h3");

            titulo.textContent =
                evento.nombre;

            const meta =
                document.createElement("p");

            meta.className =
                "meta-evento-calendar";

            let textoMeta =
                tiposEvento[evento.tipo].label;

            if (evento.hora) {
                textoMeta +=
                    ` · ${evento.hora}`;
            }

            meta.textContent =
                textoMeta;

            info.appendChild(titulo);
            info.appendChild(meta);

            if (evento.nota) {

                const nota =
                    document.createElement("p");

                nota.className =
                    "nota-evento-calendar";

                nota.textContent =
                    evento.nota;

                info.appendChild(nota);
            }

            const agregado =
                document.createElement("span");

            agregado.className =
                "agregado-evento-calendar";

            agregado.textContent =
                `agregado por ${evento.agregadoPor}`;

            info.appendChild(agregado);

            const acciones =
                document.createElement("div");

            acciones.className =
                "acciones-evento-calendar";

            const editar =
                document.createElement("button");

            editar.type = "button";
            editar.className = "editar";
            editar.textContent = "editar";

            editar.addEventListener(
                "click",
                () => editarEvento(evento.id)
            );

            const eliminar =
                document.createElement("button");

            eliminar.type = "button";
            eliminar.className = "eliminar";
            eliminar.textContent = "eliminar";

            eliminar.addEventListener(
                "click",
                () => eliminarEvento(evento.id)
            );

            acciones.appendChild(editar);
            acciones.appendChild(eliminar);

            info.appendChild(acciones);

            item.appendChild(icono);
            item.appendChild(info);

            listaEventos.appendChild(item);
        });
    }
}


function abrirFormulario() {

    formulario.style.display =
        "flex";

    botonAgregar.style.display =
        "none";

    nombreInput.focus();
}


function cerrarFormulario() {

    formulario.style.display =
        "none";

    botonAgregar.style.display =
        "block";

    formulario.reset();

    eventoEditando = null;

    botonGuardar.textContent =
        "guardar evento";

    fechaInput.value =
        fechaSeleccionada;
}


function limpiarFormulario() {

    formulario.reset();

    eventoEditando = null;

    botonGuardar.textContent =
        "guardar evento";

    fechaInput.value =
        fechaSeleccionada;
}


function editarEvento(id) {

    const evento =
        eventos.find(
            item => item.id === id
        );

    if (!evento) {
        return;
    }

    eventoEditando = id;

    nombreInput.value =
        evento.nombre;

    fechaInput.value =
        evento.fecha;

    horaInput.value =
        evento.hora;

    tipoInput.value =
        evento.tipo;

    agregadoInput.value =
        evento.agregadoPor;

    notaInput.value =
        evento.nota;

    botonGuardar.textContent =
        "guardar cambios";

    formulario.style.display =
        "flex";

    botonAgregar.style.display =
        "none";

    formulario.scrollIntoView({
        behavior: "smooth",
        block: "start"
    });
}


function eliminarEvento(id) {

    const indice =
        eventos.findIndex(
            evento => evento.id === id
        );

    if (indice === -1) {
        return;
    }

    eventos.splice(indice, 1);

    renderCalendario();
    renderDetalleDia();
}


formulario.addEventListener(
    "submit",
    function (event) {

        event.preventDefault();

        const nombre =
            nombreInput.value.trim();

        const fecha =
            fechaInput.value;

        if (!nombre || !fecha) {
            return;
        }

        const nuevoEvento = {

            id: eventoEditando || Date.now(),

            nombre: nombre,

            fecha: fecha,

            hora: horaInput.value,

            tipo: tipoInput.value,

            agregadoPor: agregadoInput.value,

            nota: notaInput.value.trim()
        };

        if (eventoEditando) {

            const indice =
                eventos.findIndex(
                    evento =>
                        evento.id === eventoEditando
                );

            if (indice !== -1) {
                eventos[indice] =
                    nuevoEvento;
            }

        } else {

            eventos.push(
                nuevoEvento
            );
        }

        fechaSeleccionada =
            fecha;

        const partes =
            fecha.split("-");

        añoActual =
            Number(partes[0]);

        mesActual =
            Number(partes[1]) - 1;

        renderCalendario();
        renderDetalleDia();

        cerrarFormulario();
    }
);


botonAgregar.addEventListener(
    "click",
    () => {

        limpiarFormulario();

        abrirFormulario();
    }
);


botonMesAnterior.addEventListener(
    "click",
    () => {

        mesActual--;

        if (mesActual < 0) {

            mesActual = 11;
            añoActual--;
        }

        fechaSeleccionada =
            crearFecha(
                añoActual,
                mesActual,
                1
            );

        renderCalendario();
        renderDetalleDia();

        cerrarFormulario();
    }
);


botonMesSiguiente.addEventListener(
    "click",
    () => {

        mesActual++;

        if (mesActual > 11) {

            mesActual = 0;
            añoActual++;
        }

        fechaSeleccionada =
            crearFecha(
                añoActual,
                mesActual,
                1
            );

        renderCalendario();
        renderDetalleDia();

        cerrarFormulario();
    }
);


renderCalendario();
renderDetalleDia();