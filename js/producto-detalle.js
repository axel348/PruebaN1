/**
 * Clase para manejar los detalles del producto
 */
class ProductDetail {
    constructor() {
        this.initializeElements();
        this.setupEventListeners();
        this.loadProductData();
    }

    /**
     * Inicializa los elementos del DOM
     */
    initializeElements() {
        this.mainImage = document.querySelector('.product-main-image');
        this.thumbnails = document.querySelectorAll('.product-thumbnail');
        this.quantityInput = document.querySelector('.quantity-input');
        this.minusBtn = document.querySelector('.quantity-btn.minus');
        this.plusBtn = document.querySelector('.quantity-btn.plus');
        this.addToCartBtn = document.querySelector('.add-to-cart-btn');
    }

    /**
     * Configura los event listeners
     */
    setupEventListeners() {
        // Manejo de miniaturas
        this.thumbnails.forEach(thumb => {
            thumb.addEventListener('click', () => this.changeMainImage(thumb.src));
        });

        // Manejo de cantidad
        if (this.minusBtn) {
            this.minusBtn.addEventListener('click', () => this.updateQuantity('decrease'));
        }
        if (this.plusBtn) {
            this.plusBtn.addEventListener('click', () => this.updateQuantity('increase'));
        }
        if (this.quantityInput) {
            this.quantityInput.addEventListener('change', () => this.validateQuantity());
        }

        // Agregar al carrito
        if (this.addToCartBtn) {
            this.addToCartBtn.addEventListener('click', () => this.addToCart());
        }
    }

    /**
     * Cambia la imagen principal
     */
    changeMainImage(src) {
        if (this.mainImage) {
            this.mainImage.src = src;
            
            // Actualizar estado activo de miniaturas
            this.thumbnails.forEach(thumb => {
                thumb.classList.toggle('active', thumb.src === src);
            });
        }
    }

    /**
     * Actualiza la cantidad
     */
    updateQuantity(action) {
        let currentValue = parseInt(this.quantityInput.value);
        if (action === 'increase') {
            currentValue++;
        } else if (action === 'decrease' && currentValue > 1) {
            currentValue--;
        }
        this.quantityInput.value = currentValue;
        this.validateQuantity();
    }

    /**
     * Valida la cantidad ingresada
     */
    validateQuantity() {
        let value = parseInt(this.quantityInput.value);
        if (isNaN(value) || value < 1) {
            value = 1;
        }
        const stock = parseInt(this.getStockAmount());
        if (value > stock) {
            value = stock;
            this.showNotification('Solo hay ' + stock + ' unidades disponibles');
        }
        this.quantityInput.value = value;
    }

    /**
     * Obtiene la cantidad en stock (simulado)
     */
    getStockAmount() {
        const stockText = document.querySelector('.stock-indicator').textContent;
        const match = stockText.match(/\d+/);
        return match ? parseInt(match[0]) : 10;
    }

    /**
     * Agrega el producto al carrito
     */
    addToCart() {
        const productId = this.addToCartBtn.dataset.productId;
        const quantity = parseInt(this.quantityInput.value);
        
        // Obtener datos del producto
        const product = {
            id: productId,
            name: document.querySelector('.product-info h1').textContent,
            price: this.getProductPrice(),
            image: this.mainImage.src,
            quantity: quantity
        };

        // Agregar al carrito (usando la clase existente de Carrito)
        if (typeof Carrito !== 'undefined') {
            window.carrito.agregarProducto(product);
            this.showNotification('Producto agregado al carrito', 'success');
        }
    }

    /**
     * Obtiene el precio actual del producto
     */
    getProductPrice() {
        const priceText = document.querySelector('.product-price').textContent;
        const match = priceText.match(/\$?([\d,.]+)/);
        return match ? parseFloat(match[1].replace(/[,.]/g, '')) : 0;
    }

    /**
     * Muestra notificaciones
     */
    showNotification(message, type = 'info') {
        // Crear el elemento de notificación
        const notification = document.createElement('div');
        notification.className = `alert alert-${type === 'success' ? 'success' : 'info'} alert-dismissible fade show`;
        notification.innerHTML = `
            ${message}
            <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
        `;

        // Agregar al DOM
        const container = document.querySelector('.product-info');
        container.insertBefore(notification, container.firstChild);

        // Auto-cerrar después de 3 segundos
        setTimeout(() => {
            notification.classList.remove('show');
            setTimeout(() => notification.remove(), 150);
        }, 3000);
    }

    /**
     * Carga los datos del producto (simulado)
     */
    async loadProductData() {
        // Aquí irían las llamadas a tu API
        // Por ahora los datos están en el HTML
    }
}

// Inicializar cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', () => {
    new ProductDetail();
});
