const nombreInput = document.querySelector('#nombre');
const codigoInput = document.querySelector('#codigo');
const cantidadInput = document.querySelector('#cantidad');
const costoInput = document.querySelector('#costo');
const eliminarInput = document.querySelector('#eliminar-input');
const form = document.querySelector('#nuevo-producto');
const botonBuscar = document.querySelector('#buscar');
const botonListado = document.querySelector('#listar');
const botonEliminar = document.querySelector('#eliminar');
const botonListadoInverso = document.querySelector('#listar-inverso');

function eventListeners() {
    nombreInput.addEventListener('input', datosProducto);
    codigoInput.addEventListener('input', datosProducto);
    costoInput.addEventListener('input', datosProducto);
    cantidadInput.addEventListener('input', datosProducto);
    botonEliminar.addEventListener('click', eliminarProducto);
    botonListado.addEventListener('click', listar);
    botonListadoInverso.addEventListener('click', listarInver);
    botonBuscar.addEventListener('click', buscarProducto);
    form.addEventListener('submit', nuevoProducto);
} // Acá no me explico cómo es que no se necesita los paréntesis después del nombre de las funciones,
// pero bueno, de igual forma no se necesitan argumentos.
let productos = document.querySelector('#productos');
eventListeners();
const inputs = {
    codigo: '',
    nombre: '',
    costo: '',
    cantidad: '',
}
function datosProducto(e) {
    inputs[e.target.name] = e.target.value
}

class Inventario {
    constructor() {
        this.productos = [];
    }
    addProducto(producto) {
        this.productos[this.productos.length] =  producto
    }
    eliminarProducto(codigo) {
        let isFound = false;
        for(let i = 0; i < this.productos.length; i++) {
            if(this.productos[i].codigo == codigo) {
                isFound = true
            }
            if(isFound) {
                this.productos[i] = this.productos[i+1]
            }
        }
        if(isFound) {
            this.productos.length -= 1;
        }
    }
    listarInver() {
        const iterations = Math.floor(this.productos.length / 2)
        for(let i = 0, x = 1 ; x <= iterations; i++, x++) {
            let temp = this.productos[this.productos.length - x];
            this.productos[this.productos.length - x] = this.productos[i]
            this.productos[i] = temp;
        }
        listar()
        syncStorage()
    }
    buscar(codigo) {
        for (let i = 0; i < this.productos.length; i++) {
            if (this.productos[i].codigo == codigo) {
                return this.productos[i]
            }
        }
        return null;
    }
}
const inventario = new Inventario();
getStorageData();
function listar() {
    ui.mostrarProductos(inventario.productos)
}
class UI {
    mostrarProductos(inventario) {
        limpiarHTML();
        for(let i = 0; i < inventario.length; i++) {
            const li = document.createElement('li');
            li.innerHTML = `Nombre: ${inventario[i].nombre} <br>
                            Codigo: ${inventario[i].codigo} <br>
                            Cantidad: ${inventario[i].cantidad} <br>
                            Costo: ${inventario[i].costo} <br>`
            productos.appendChild(li);
        }
    }
}
const ui = new UI();
class Producto {
    constructor(codigo, nombre, cantidad, costo) {
        this.codigo = codigo;
        this.nombre = nombre;
        this.cantidad = cantidad;
        this.costo = costo;
    }
}
function nuevoProducto(e) {
    e.preventDefault();
    const {codigo, nombre, costo , cantidad} = inputs
    if(!codigo || !nombre || !costo || !cantidad) {
        alert('Todos los campos son obligatorios!')
    } else {
        const {codigo, nombre, costo , cantidad} = inputs
        let producto = new Producto(codigo, nombre, costo, cantidad);
        inventario.addProducto(producto)
        form.reset();
        syncStorage()
    }
}
function limpiarInputs() {
    inputs.nombre = '';
    inputs.codigo = '';
    inputs.costo = '';
    inputs.cantidad = '';
} // Probablemente hay una forma más ágil de limpiar los inputs, pero intenté en otras ocasiones con el .value = "";
// usando una clase para todos los inputs y por alguna razón no los limpia.
function limpiarHTML() {
    while(productos.firstChild) {
        productos.removeChild(productos.firstChild)
    }
}
function eliminarProducto() {
    const codigo = Number(eliminarInput.value)
    console.log(codigo)
    inventario.eliminarProducto(codigo)
    console.log('Eliminando')
}
function syncStorage() {
    localStorage.setItem('productos', JSON.stringify(inventario.productos))
}
function getStorageData() {
    inventario.productos = JSON.parse(localStorage.getItem('productos'));
}
function listarInver() {
    inventario.listarInver();
}
function buscarProducto() {
    const codigo = Number(eliminarInput.value)
    console.log(inventario.buscar(codigo));
}