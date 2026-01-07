// ===============================
// CONFIG BACKEND (ONLINE)
// ===============================
const BACKEND_URL = "https://stock-las-ninas-backend.onrender.com";

// ===============================
// ESTADO
// ===============================
let productos = [];
let textoBusqueda = "";

// ===============================
// ELEMENTOS
// ===============================
const contenedor = document.getElementById("productos");
const listaSuper = document.getElementById("listaSuper");
const inputBusqueda = document.getElementById("inputBusqueda");
const btnLimpiar = document.getElementById("btnLimpiar");
const btnAgregar = document.getElementById("btnAgregar");

// ===============================
// BACKEND
// ===============================
async function cargarProductosBackend() {
    try {
        const res = await fetch(`${BACKEND_URL}/productos`);
        productos = await res.json();
        render();
    } catch (e) {
        alert("No se pudo conectar con el backend");
        console.error(e);
    }
}

async function guardarProductosBackend() {
    await fetch(`${BACKEND_URL}/productos`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(productos)
    });
}

// ===============================
// EVENTOS
// ===============================
inputBusqueda.oninput = e => {
    textoBusqueda = e.target.value.toLowerCase();
    render();
};

btnLimpiar.onclick = () => {
    textoBusqueda = "";
    inputBusqueda.value = "";
    render();
};

btnAgregar.onclick = () => {
    const nombre = prompt("Nombre del producto:");
    if (!nombre) return;

    const categoria = prompt("Categoría:");
    if (!categoria) return;

    const minimo = parseInt(prompt("Stock mínimo:"), 10);
    if (isNaN(minimo)) {
        alert("El stock mínimo debe ser un número");
        return;
    }

    productos.push({
        nombre: capitalizar(nombre),
        categoria: capitalizar(categoria),
        stock: 0,
        minimo
    });

    guardarProductosBackend();
    render();
};

// ===============================
// RENDER
// ===============================
function render() {
    renderProductos();
    renderListaSuper();
}

function renderProductos() {
    contenedor.innerHTML = "";

    productos
        .filter(p =>
            p.nombre.toLowerCase().includes(textoBusqueda) ||
            p.categoria.toLowerCase().includes(textoBusqueda)
        )
        .forEach((p, i) => {
            const div = document.createElement("div");
            div.className = "producto" + (p.stock < p.minimo ? " falta" : "");

            div.innerHTML = `
                <div class="acciones">
                    <button onclick="editar(${i})">✏️</button>
                    <button onclick="borrar(${i})">🗑️</button>
                </div>

                <div class="nombre">${p.nombre}</div>
                <div class="stock">Stock: ${p.stock} (mín: ${p.minimo})</div>

                <div class="botones">
                    <button onclick="restar(${i})">−</button>
                    <button onclick="sumar(${i})">＋</button>
                </div>
            `;

            contenedor.appendChild(div);
        });
}

function renderListaSuper() {
    listaSuper.innerHTML = "";

    const faltantes = productos.filter(p => p.stock < p.minimo);

    if (faltantes.length === 0) {
        listaSuper.innerHTML = "<p>No falta nada 🎉</p>";
        return;
    }

    const porCategoria = {};

    faltantes.forEach(p => {
        if (!porCategoria[p.categoria]) porCategoria[p.categoria] = [];
        porCategoria[p.categoria].push(p);
    });

    for (const categoria in porCategoria) {
        const h3 = document.createElement("h3");
        h3.textContent = categoria;
        listaSuper.appendChild(h3);

        porCategoria[categoria].forEach(p => {
            const label = document.createElement("label");
            label.style.display = "block";

            const checkbox = document.createElement("input");
            checkbox.type = "checkbox";

            checkbox.onchange = () => {
                if (!checkbox.checked) return;

                const cantidad = parseInt(
                    prompt(`¿Cuánto compraste de ${p.nombre}?`),
                    10
                );

                if (!isNaN(cantidad) && cantidad > 0) {
                    p.stock += cantidad;
                    guardarProductosBackend();
                    render();
                }

                checkbox.checked = false;
            };

            label.appendChild(checkbox);
            label.append(` ${p.nombre}`);
            listaSuper.appendChild(label);
        });
    }
}

// ===============================
// ACCIONES
// ===============================
function sumar(i) {
    productos[i].stock++;
    guardarProductosBackend();
    render();
}

function restar(i) {
    if (productos[i].stock > 0) {
        productos[i].stock--;
        guardarProductosBackend();
        render();
    }
}

function borrar(i) {
    if (confirm("¿Eliminar producto?")) {
        productos.splice(i, 1);
        guardarProductosBackend();
        render();
    }
}

function editar(i) {
    const p = productos[i];

    const nombre = prompt("Nombre:", p.nombre);
    if (!nombre) return;

    const categoria = prompt("Categoría:", p.categoria);
    if (!categoria) return;

    const stock = parseInt(prompt("Stock:", p.stock), 10);
    const minimo = parseInt(prompt("Stock mínimo:", p.minimo), 10);

    if (isNaN(stock) || isNaN(minimo)) {
        alert("Stock y mínimo deben ser números");
        return;
    }

    p.nombre = capitalizar(nombre);
    p.categoria = capitalizar(categoria);
    p.stock = stock;
    p.minimo = minimo;

    guardarProductosBackend();
    render();
}

// ===============================
// UTIL
// ===============================
function capitalizar(texto) {
    return texto.charAt(0).toUpperCase() + texto.slice(1).toLowerCase();
}

// ===============================
// INIT
// ===============================
cargarProductosBackend();
