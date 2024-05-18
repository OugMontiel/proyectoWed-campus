import { html, css, LitElement } from 'lit';
import {
    getAbrigo,
    getCamiseta,
    getPantalon,
    getCarrito
} from "./bd.js";

export class productos extends LitElement {
    static properties = { //Se cargan las variables
        productosAll: { type: Array },
        productosAbrigo: { type: Array },
        productosCamiseta: { type: Array },
        productosPantalon: { type: Array },
        currentFilter: { type: String },
    }
    constructor() { //Se inicializan las variables
        super();
        this.productosAll = [];
        this.productosAbrigo = [];
        this.productosCamiseta = [];
        this.productosPantalon = [];
        this.currentFilter = "productosAll"; // Inicializa currentFilter como una cadena vacía en lugar de un array
        this.loadProducts(); //Esta es una funcion asincrona
    }
    async loadProducts() {
        try {
            this.productosAbrigo = await getAbrigo();
            this.productosCamiseta = await getCamiseta();
            this.productosPantalon = await getPantalon();
            this.productosAll = [
                ...this.productosAbrigo,
                ...this.productosCamiseta,
                ...this.productosPantalon
            ];
            this.currentFilter = "productos" + document.querySelector(".Selecion").id; // Añade "producto " antes del id
            this.requestUpdate(); //es una función integrada de la clase LitElement. Cuando se llama a requestUpdate(), se programa una actualización del componente, lo que implica que render() se ejecutará de nuevo para actualizar el DOM con los datos más recientes
        } catch (error) {
            console.error('Error loading products:', error);
        }
    }
    static styles = css`
    :host{
        padding:1em;
        display: grid;
        grid-template-columns: repeat(4, 1fr);
    }
    .producto {
        margin:.5em;

        display: flex;
        flex-direction: column;
        justify-content: center;
    
        overflow: hidden;
    }
    
    .producto img {
        max-width:100%;
        max-height:13em;
        border-radius:1em;
    }
    
    .producto div {    
        display: flex;
        flex-direction: column;

        margin-top:-2em;
    
        border-radius: 1em;
        padding: 0.5em;
    
        background: var(--color-producto);
        color: var(--color-w);
    }
    small{
        display: -webkit-box; /* Establece un contenedor flex de tipo caja */
            -webkit-box-orient: vertical; /* Establece la orientación vertical */
            -webkit-line-clamp: 2; /* Limita el texto a dos líneas */
    
        overflow: hidden; /* Oculta cualquier texto que desborde el contenedor */
        text-overflow: ellipsis; /* Agrega puntos suspensivos al final del texto que se trunca */
    }
    p{
        margin:0;
        padding:0;

        color: var(--color-Boton-letras);
    }
    button {
        padding:.5em;
        border-radius: 2em;
        background: var(--color-w);
        color: var(--color-fondo);
    }
    `;
    connectedCallback() {
        super.connectedCallback();
        const navegacion = document.querySelectorAll('.Menuli');
        navegacion.forEach(item => {
            item.addEventListener("click", (e) => {
                const selectedId = e.currentTarget.id;
                this.currentFilter = "productos" + selectedId;
                this.requestUpdate();
            });
        });
    }
    render() {
        const productos = this[this.currentFilter]// Coloca currentFilter dentro de un array para que funcione con el método map       
        return html` 
            ${productos.map(producto => html`
            <div class="producto">
                <img src="${producto.imagen}" alt="${producto.nombre}">
                <div>
                    <small>${producto.nombre}</small>
                    <p>$ ${producto.precio}</p>
                    <button>Agregar</button>
                </div>
              </div>
            
            `)}
        
        `
    }
}

export class Barra extends LitElement {
    static properties = {
        productosCarrito: { type: Array },
    }
    constructor() {
        super()
        this.productosCarrito=[]
        this.loadProducts()
    }
    async loadProducts() {
        try {
            this.productosCarrito = await getCarrito();
            this.requestUpdate();
        } catch (error) {
            console.error("Error loading products:", error);
        }
    }
    static styles = css`
                `;

    render() {
        return html`
        ${this.productosCarrito.map(producto=> html`
        
        <div class="producto Abrigo">
            <img src="../Storage/img/360_F_460013622_6xF8uN6ubMvLx0tAJECBHfKPoNOR5cRa.jpg" alt="">
            <div>
                <p>Titulo</p>
                <p>Abrigo 01</p>
            </div>
            <div>
                <p>Cantidad</p>
                <span>${producto.cantidad}</span>
            </div>
            <div>
                <p>Precio</p>
                <p>$ 1000</p>
            </div>
            <div>
                <p>SubTotal</p>
                <p>$ 2000</p>
            </div>
                <a href="carritoOnu.html">
                <box-icon type='solid' name='x-circle'></box-icon>
            </a>
        </div>       
        `)}
        
        `
    };
}


