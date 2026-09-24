import {
    db,
    collection,
    addDoc,
    onSnapshot,
    query,
    orderBy,
    serverTimestamp
} from "./firebase-config.js";
import { 
  doc, 
  updateDoc, 
  deleteDoc 
} from "https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore.js";

const coleccionRecomendaciones = collection(db, "recommendations");

let recomendaciones = [];
let recomendacionEditando = null;
let filtroActual = "todas";

const botonAgregar = document.getElementById("boton-agregar-recommendation");
const formulario = document.getElementById("formulario-recommendation");
const lista = document.getElementById("lista-recommendations");
const mensajeVacio = document.getElementById("sin-recommendations");
const contador = document.getElementById("contador-recommendations");
const nombreInput = document.getElementById("nombre-recommendation");
const tipoInput = document.getElementById("tipo-recommendation");
const categoriaInput = document.getElementById("categoria-recommendation");
const recomendadoPorInput = document.getElementById("recomendado-por");
const portadaInput = document.getElementById("portada-recommendation");
const vistaPrevia = document.getElementById("vista-previa-recommendation");
const notaInput = document.getElementById("nota-recommendation");
const guardarButton = document.getElementById("guardar-recommendation");
const botonesFiltro = document.querySelectorAll(".filtro-recommendation");

/* =========================================================
   CONVERSIÓN DE IMAGEN A BASE64 (Para no perderla)
========================================================= */
function convertirArchivoABase64(archivo) {
  return new Promise((resolve, reject) => {
    const lector = new FileReader();
    lector.onload = () => resolve(lector.result);
    lector.onerror = (error) => reject(error);
    lector.readAsDataURL(archivo);
  });
}

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
    if (!archivo) return;
    const imagen = document.createElement("img");
    imagen.src = URL.createObjectURL(archivo);
    imagen.alt = "Vista previa de portada";
    vistaPrevia.appendChild(imagen);
});

/* =========================================================
   FILTROS
========================================================= */

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
   SINCRONIZACIÓN EN TIEMPO REAL CON FIRESTORE
========================================================= */
const q = query(coleccionRecomendaciones, orderBy("fechaCreacion", "desc"));

onSnapshot(q, (snapshot) => {
  recomendaciones = [];
  snapshot.forEach((documento) => {
    recomendaciones.push({
      id: documento.id,
      ...documento.data()
    });
  });
  renderizarRecomendaciones();
});

/* =========================================================
   FORMULARIO (GUARDAR / EDITAR EN FIRESTORE)
========================================================= */

formulario.addEventListener("submit", async (evento) => {
    evento.preventDefault();

    const nombre = nombreInput.value.trim();
    const tipo = tipoInput.value;
    const categoria = categoriaInput.value;
    const recomendadoPor = recomendadoPorInput.value;
    const nota = notaInput.value.trim();
    const archivo = portadaInput.files[0];

    if (!nombre) return;

    let portada = null;
    if (archivo) {
        try {
          portada = await convertirArchivoABase64(archivo);
        } catch (e) {
          console.error("Error al procesar la imagen:", e);
        }
    }

    if (guardarButton) guardarButton.disabled = true;

    try {
        if (recomendacionEditando !== null) {
          // Editar en Firestore
          const docRef = doc(db, "recommendations", recomendacionEditando);
          const datosActualizados = {
            nombre,
            tipo,
            categoria,
            recomendadoPor,
            nota
          };
          if (portada) {
            datosActualizados.portada = portada;
          }
          await updateDoc(docRef, datosActualizados);
        } else {
          // Crear nueva recomendación en Firestore
          await addDoc(coleccionRecomendaciones, {
            nombre,
            tipo,
            categoria,
            recomendadoPor,
            portada,
            nota,
            fechaCreacion: serverTimestamp()
          });
        }
        limpiarFormulario();
      } catch (error) {
        console.error("Error al guardar en Firebase:", error);
        alert("Hubo un problema al guardar. Revisa la conexión.");
      } finally {
        if (guardarButton) guardarButton.disabled = false;
      }
    });

/* =========================================================
   RENDERIZAR RECOMENDACIONES
========================================================= */
function renderizarRecomendaciones() {
    lista.innerHTML = "";

    const recomendacionesFiltradas = recomendaciones.filter((recomendacion) => {
        if (filtroActual === "todas") return true;
        return recomendacion.categoria === filtroActual;
    });

    contador.textContent =`${recomendacionesFiltradas.length} recommendations`;

    if (recomendacionesFiltradas.length === 0) {
        mensajeVacio.style.display = "flex";
    } else {
        mensajeVacio.style.display = "none";
    }

    recomendacionesFiltradas.forEach((recomendacion) => {
        const tarjeta = document.createElement("article");
        tarjeta.className = "recommendation-item";

         /* ---------- PORTADA ---------- */
        const portada = document.createElement("div");
        portada.className = "portada-recommendation";

        if (recomendacion.portada) {
            const imagen = document.createElement("img");
            imagen.src = recomendacion.portada;
            imagen.alt = `Portada de ${recomendacion.nombre}`;
            portada.appendChild(imagen);
            } else {
            const simbolo = document.createElement("span");
            simbolo.textContent = "✦";
            portada.appendChild(simbolo);
        }

        /* ---------- INFORMACIÓN ---------- */
        const informacion = document.createElement("div");
        informacion.className = "info-recommendation";
        const titulo = document.createElement("h2");
        titulo.textContent = recomendacion.nombre;
        const tipo = document.createElement("p");
        tipo.className = "tipo-recommendation";
        tipo.textContent = recomendacion.tipo;

        /* ---------- CATEGORÍA ---------- */
        const categoria = document.createElement("span");
        categoria.className = "categoria-recommendation";
        categoria.dataset.categoria = recomendacion.categoria;

        if (recomendacion.categoria ==="para-vale") {
            categoria.textContent = "para vale";
        } else if (recomendacion.categoria ==="para-javi") {
            categoria.textContent = "para javi";
        } else {
            categoria.textContent ="para ver juntas";
        }

        /* ---------- QUIÉN RECOMENDÓ ---------- */
        const recomendadoPor =document.createElement("p");
        recomendadoPor.className = "recomendado-por";

        if (recomendacion.recomendadoPor ==="vale") {
            recomendadoPor.textContent = "recomendada por vale";
        } else {
            recomendadoPor.textContent ="recomendada por javi";
        }

        /* ---------- NOTA ---------- */
        informacion.appendChild(titulo);
        informacion.appendChild(tipo);
        informacion.appendChild(categoria);
        informacion.appendChild(recomendadoPor);

        if (recomendacion.nota) {
            const nota = document.createElement("p");
            nota.className = "nota-recommendation";
            nota.textContent = recomendacion.nota;
            informacion.appendChild(nota);
        }

        /* ---------- ACCIONES ---------- */
        const acciones = document.createElement("div");
        acciones.className = "acciones-recommendation";

        const editar = document.createElement("button");
        editar.type = "button";
        editar.className = "editar";
        editar.textContent = "editar";
        editar.addEventListener("click", () => {
            cargarParaEditar(recomendacion);
        });

        const eliminar =document.createElement("button");
        eliminar.type = "button";
        eliminar.className ="eliminar";
        eliminar.textContent ="eliminar";
        eliminar.addEventListener("click", () => {
            eliminarRecomendacion(recomendacion.id);
        });

        acciones.appendChild(editar);
        acciones.appendChild(eliminar);

        informacion.appendChild(acciones);

        tarjeta.appendChild(portada);
        tarjeta.appendChild(informacion);

        lista.appendChild(tarjeta);
    });
}

/* =========================================================
   EDITAR
========================================================= */
function cargarParaEditar(recomendacion) {
    recomendacionEditando = recomendacion.id;

    nombreInput.value = recomendacion.nombre;
    tipoInput.value = recomendacion.tipo;
    categoriaInput.value = recomendacion.categoria;
    recomendadoPorInput.value = recomendacion.recomendadoPor;
    notaInput.value = recomendacion.nota;

    vistaPrevia.innerHTML = "";

    if (recomendacion.portada) {
        const imagen = document.createElement("img");
        imagen.src = recomendacion.portada;
        imagen.alt = `Vista previa de ${recomendacion.nombre}`;
        vistaPrevia.appendChild(imagen);
    }

    guardarButton.textContent = "guardar cambios";
    formulario.style.display = "flex";
    nombreInput.focus();
}


/* =========================================================
   ELIMINAR EN FIRESTONE
========================================================= */
async function eliminarRecomendacion(id) {
  try {
    await deleteDoc(doc(db, "recommendations", id));
  } catch (error) {
    console.error("Error al eliminar:", error);
    alert("No se pudo eliminar.");
  }
}

/* =========================================================
   LIMPIAR FORMULARIO
========================================================= */

function limpiarFormulario() {
  formulario.reset();
  recomendacionEditando = null;
  vistaPrevia.innerHTML = "";
  guardarButton.textContent = "guardar recomendación";
  formulario.style.display = "none";
}