const tarjetasServicio = document.querySelectorAll(".card-servicio");
const form = document.getElementById("form-envio");
const btnMasDatos = document.getElementById("btn-mas-datos");
const datosAdicionales = document.getElementById("datos-adicionales");
const panelResultado = document.getElementById("panel-resultado");
const btnLimpiar = document.getElementById("btn-limpiar");

let servicioSeleccionado = null;

tarjetasServicio.forEach((tarjeta) => {
  tarjeta.addEventListener("click", () => seleccionarServicio(tarjeta));
  tarjeta.addEventListener("keydown", (evento) => {
    if (evento.key === "Enter" || evento.key === " ") {
      evento.preventDefault();
      seleccionarServicio(tarjeta);
    }
  });
});

function seleccionarServicio(tarjeta) {
  tarjetasServicio.forEach((t) => t.classList.remove("is-selected"));
  tarjeta.classList.add("is-selected");
  servicioSeleccionado = tarjeta.dataset.servicio;
}

btnMasDatos.addEventListener("click", () => {
  const oculto = datosAdicionales.classList.toggle("oculto");
  btnMasDatos.textContent = oculto ? "Agregar datos adicionales" : "Ocultar datos adicionales";
});

form.addEventListener("submit", (evento) => {
  evento.preventDefault();

  const camposNumericos = ["peso", "largo", "ancho", "alto"];
  let formularioValido = form.checkValidity();

  camposNumericos.forEach((id) => {
    const campo = document.getElementById(id);
    const valor = parseFloat(campo.value);
    const esValido = campo.checkValidity() && valor > 0;
    campo.classList.toggle("is-error", !esValido);
    campo.classList.toggle("is-valid", esValido);
    if (!esValido) formularioValido = false;
  });

  if (!formularioValido) {
    form.reportValidity();
    return;
  }

  mostrarResultado();
});

function mostrarResultado() {
  const datos = new FormData(form);
  const urgencia = datos.get("urgencia");
  const servicioSugerido = obtenerServicioPorUrgencia(urgencia);

  panelResultado.innerHTML = `
    <dl>
      <dt>Origen</dt>
      <dd>${datos.get("origen")}</dd>
      <dt>Destino</dt>
      <dd>${datos.get("destino")}</dd>
      <dt>Tipo de envío</dt>
      <dd>${datos.get("tipoEnvio")}</dd>
      <dt>Peso</dt>
      <dd>${datos.get("peso")} kg</dd>
      <dt>Servicio sugerido</dt>
      <dd class="servicio-sugerido">${servicioSugerido}</dd>
    </dl>
  `;
  panelResultado.classList.remove("oculto");
  panelResultado.scrollIntoView({ behavior: "smooth", block: "start" });
}

function obtenerServicioPorUrgencia(urgencia) {
  if (urgencia === "baja") return "Básico";
  if (urgencia === "media") return "Estándar";
  return "Prioritario";
}

btnLimpiar.addEventListener("click", () => {
  tarjetasServicio.forEach((t) => t.classList.remove("is-selected"));
  servicioSeleccionado = null;
  datosAdicionales.classList.add("oculto");
  btnMasDatos.textContent = "Agregar datos adicionales";
  panelResultado.classList.add("oculto");
  panelResultado.innerHTML = "";
  form.querySelectorAll(".is-error, .is-valid").forEach((campo) => {
    campo.classList.remove("is-error", "is-valid");
  });
});
