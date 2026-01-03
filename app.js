// ===============================
// DATOS INICIALES
// ===============================
let productos = [
    { nombre: "Leche", categoria: "Alimentos", stock: 5, minimo: 3 },
    { nombre: "Arroz", categoria: "Alimentos", stock: 2, minimo: 2 },
    { nombre: "Papa", categoria: "Verdulería", stock: 3, minimo: 2 },
    { nombre: "Cebolla", categoria: "Verdulería", stock: 2, minimo: 2 },
    { nombre: "Papel higiénico", categoria: "Limpieza", stock: 4, minimo: 2 }
];

// ===============================
// REFERENCIAS DOM
// ===============================
const contenedor = document.getElementById("productos");
const listaSuper = document.getElementById("lista-super");
const inputBusqueda = document.getElementById("busqueda");
const btnLimpiar = document.getElementById("limpiar");
const btnAgregar = document.getElementById("agregar");

// ===============================
// ESTADO
// ===============================
let textoBusqueda = "";

// ===============================
// UTILIDADES
// ===============================
function capitalizar(texto) {
    return texto
        .trim()
        .toLowerCase()
        .replace(/^\w/, c => c.toUpperCase());
}

function coincideBusqueda(texto, busqueda) {
    let i = 0;
    texto = texto.toLowerCase();
    busqueda = busqueda.toLowerCase();

    for (let char of texto) {
        if (char === busqueda[i]) i++;
        if (i === busqueda.length) return true;
    }
    return false;
}

// ===============================
// STORAGE
// ===============================
function guardarDatos() {
    localStorage.setItem("productos", JSON.stringify(productos));
}

function cargarDatos() {
    const datos = localStorage.getItem("productos");
    if (datos) productos = JSON.parse(datos);
}

// ===============================
// STOCK
// ===============================
function cambiarStock(index, cantidad) {
    productos[index].stock += cantidad;
    if (productos[index].stock < 0) productos[index].stock = 0;
    guardarDatos();
    render();
}

// ===============================
// EDITAR / BORRAR
// ===============================
function editarProducto(index) {
    let nuevoNombre = prompt("Nombre del producto:", productos[index].nombre);
    if (!nuevoNombre) return;
    nuevoNombre = capitalizar(nuevoNombre);

    const duplicado = productos.some(
        (p, i) =>
            i !== index && p.nombre.toLowerCase() === nuevoNombre.toLowerCase()
    );
    if (duplicado) {
        alert("Ya existe un producto con ese nombre.");
        return;
    }

    let nuevaCategoria = prompt(
        "Categoría:",
        productos[index].categoria
    );
    if (!nuevaCategoria) return;
    nuevaCategoria = capitalizar(nuevaCategoria);

    let nuevoMinimo = parseInt(
        prompt("Stock mínimo:", productos[index].minimo),
        10
    );
    if (isNaN(nuevoMinimo)) return;

    productos[index].nombre = nuevoNombre;
    productos[index].categoria = nuevaCategoria;
    productos[index].minimo = nuevoMinimo;

    guardarDatos();
    render();
}

function borrarProducto(index) {
    const confirmar = confirm(
        `¿Seguro que querés eliminar "${productos[index].nombre}"?`
    );
    if (!confirmar) return;

    productos.splice(index, 1);
    guardarDatos();
    render();
}

// ===============================
// RENDER
// ===============================
function render() {
    contenedor.innerHTML = "";
    listaSuper.innerHTML = "";

    const faltantesPorCategoria = {};

    productos.forEach((p, index) => {
        if (textoBusqueda && !coincideBusqueda(p.nombre, textoBusqueda)) return;

        const div = document.createElement("div");
        div.className = "producto";

        if (p.stock <= p.minimo) {
            div.classList.add("falta");

            if (!faltantesPorCategoria[p.categoria]) {
                faltantesPorCategoria[p.categoria] = [];
            }
            faltantesPorCategoria[p.categoria].push({ nombre: p.nombre, index });
        }

        div.innerHTML = `
      <div class="nombre">${p.nombre}</div>
      <div class="stock">Stock: ${p.stock}</div>

      <div class="acciones">
        <button class="editar" title="Editar">✏️</button>
        <button class="borrar" title="Eliminar">🗑️</button>
      </div>

      <div class="botones">
        <button class="menos">−</button>
        <button class="mas">+</button>
      </div>
    `;

        div.querySelector(".menos").onclick = () => cambiarStock(index, -1);
        div.querySelector(".mas").onclick = () => cambiarStock(index, 1);
        div.querySelector(".editar").onclick = () => editarProducto(index);
        div.querySelector(".borrar").onclick = () => borrarProducto(index);

        contenedor.appendChild(div);
    });

    // Lista del súper
    for (const categoria in faltantesPorCategoria) {
        const h3 = document.createElement("h3");
        h3.textContent = categoria;
        listaSuper.appendChild(h3);

        const ul = document.createElement("ul");

        faltantesPorCategoria[categoria].forEach(item => {
            const li = document.createElement("li");

            const checkbox = document.createElement("input");
            checkbox.type = "checkbox";

            checkbox.onchange = () => {
                const cantidad = parseInt(
                    prompt(`¿Cuántos ${item.nombre} compraste?`, "1"),
                    10
                );

                if (!isNaN(cantidad) && cantidad > 0) {
                    productos[item.index].stock += cantidad;
                    guardarDatos();
                    render();
                }
            };

            li.appendChild(checkbox);
            li.appendChild(document.createTextNode(" " + item.nombre));
            ul.appendChild(li);
        });

        listaSuper.appendChild(ul);
    }
}

// ===============================
// EVENTOS
// ===============================
inputBusqueda.addEventListener("input", e => {
    textoBusqueda = e.target.value;
    render();
});

btnLimpiar.onclick = () => {
    textoBusqueda = "";
    inputBusqueda.value = "";
    render();
};

btnAgregar.onclick = () => {
    let nombre = prompt("Nombre del producto:");
    if (!nombre) return;
    nombre = capitalizar(nombre);

    const existe = productos.some(
        p => p.nombre.toLowerCase() === nombre.toLowerCase()
    );
    if (existe) {
        alert("Ese producto ya existe.");
        return;
    }

    let categoria = prompt("Categoría:");
    if (!categoria) return;
    categoria = capitalizar(categoria);

    const minimo = parseInt(prompt("Stock mínimo:", "1"), 10);
    if (isNaN(minimo)) return;

    productos.push({
        nombre,
        categoria,
        stock: 0,
        minimo
    });

    guardarDatos();
    render();
};

// ===============================
// INIT
// ===============================
cargarDatos();
render();
