// Clase para manejar el carrito de compras
/**
 * Clase ShoppingCart
 * Esta clase maneja toda la funcionalidad del carrito de compras:
 * - Agregar/eliminar productos
 * - Actualizar cantidades
 * - Persistencia en localStorage
 * - Cálculo de totales
 * - Renderizado del carrito
 */
class ShoppingCart {
    constructor() {
        this.items = this.getCartItems();
        this.total = 0;
        this.shipping = 2500; // Costo fijo de envío
        this.init();
    }

    // Obtener items del carrito desde localStorage
    getCartItems() {
        try {
            const items = JSON.parse(localStorage.getItem('cartItems')) || [];
            // Validar que cada item tenga todas las propiedades necesarias
            return items.filter(item => 
                item && 
                item.id && 
                item.name && 
                item.price && 
                item.image && 
                typeof item.quantity === 'number'
            );
        } catch (e) {
            console.error('Error al cargar el carrito:', e);
            return [];
        }
    }

    init() {
        this.updateCartCount();
        this.renderCart();
        this.setupEventListeners();
    }

    // Agregar un producto al carrito
    addItem(product) {
        if (!product || !product.id || !product.name || !product.price || !product.image) {
            console.error('Producto inválido:', product);
            return;
        }

        const existingItem = this.items.find(item => item.id === product.id);
        
        if (existingItem) {
            existingItem.quantity = (existingItem.quantity || 0) + 1;
        } else {
            this.items.push({
                id: product.id,
                name: product.name,
                price: product.price,
                image: product.image,
                quantity: 1
            });
        }
        
        this.saveCart();
        this.updateCartCount();
        this.showAddToCartSuccess();
    }

    // Eliminar un producto del carrito
    removeItem(productId) {
        this.items = this.items.filter(item => item.id !== productId);
        this.saveCart();
        this.renderCart();
        this.updateCartCount();
    }

    // Actualizar la cantidad de un producto
    updateQuantity(productId, newQuantity) {
        const item = this.items.find(item => item.id === productId);
        if (item) {
            item.quantity = Math.max(1, newQuantity);
            this.saveCart();
            this.renderCart();
            this.updateCartCount();
        }
    }

    // Calcular el total
    calculateTotal() {
        this.total = this.items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
        return this.total;
    }

    // Guardar el carrito en localStorage
    saveCart() {
        localStorage.setItem('cartItems', JSON.stringify(this.items));
    }

    // Actualizar el contador del carrito en la navegación
    updateCartCount() {
        const count = this.items.reduce((sum, item) => sum + item.quantity, 0);
        document.querySelectorAll('.cart-badge').forEach(badge => {
            badge.textContent = count;
        });
    }

    // Renderizar el carrito
    renderCart() {
        // Si no estamos en la página del carrito, solo actualizamos el contador
        if (!document.getElementById('cartItems')) {
            this.updateCartCount();
            return;
        }

        const cartTableBody = document.getElementById('cartItems');
        const emptyCartMessage = document.getElementById('emptyCartMessage');
        const cartSummary = document.getElementById('cartSummary');

        if (!this.items.length) {
            if (emptyCartMessage) emptyCartMessage.style.display = 'block';
            if (cartTableBody) cartTableBody.style.display = 'none';
            if (cartSummary) cartSummary.style.display = 'none';
            return;
        }

        if (emptyCartMessage) emptyCartMessage.style.display = 'none';
        if (cartTableBody) cartTableBody.style.display = 'table-body-group';
        if (cartSummary) cartSummary.style.display = 'block';

        if (cartTableBody) {
            cartTableBody.innerHTML = this.items.map(item => `
                <tr class="cart-item">
                    <td>
                        <img src="${item.image}" alt="${item.name}" class="cart-item-image">
                    </td>
                    <td>
                        <a href="#" class="cart-item-title">${item.name}</a>
                    </td>
                    <td class="cart-item-price">$${item.price.toLocaleString()}</td>
                    <td>
                        <div class="quantity-control">
                            <button class="quantity-btn" onclick="cart.updateQuantity('${item.id}', ${item.quantity - 1})">-</button>
                            <input type="number" class="quantity-input" value="${item.quantity}" 
                                   onchange="cart.updateQuantity('${item.id}', this.value)">
                            <button class="quantity-btn" onclick="cart.updateQuantity('${item.id}', ${item.quantity + 1})">+</button>
                        </div>
                    </td>
                    <td class="cart-item-price">$${(item.price * item.quantity).toLocaleString()}</td>
                    <td>
                        <i class="fas fa-trash remove-item" onclick="cart.removeItem('${item.id}')"></i>
                    </td>
                </tr>
            `).join('');
        }

        // Actualizar el resumen
        this.updateSummary();
    }

    // Actualizar el resumen del carrito
    updateSummary() {
        const subtotal = this.calculateTotal();
        const shipping = this.items.length ? this.shipping : 0;
        const total = subtotal + shipping;

        document.getElementById('subtotal').textContent = `$${subtotal.toLocaleString()}`;
        document.getElementById('shipping').textContent = `$${shipping.toLocaleString()}`;
        document.getElementById('total').textContent = `$${total.toLocaleString()}`;
    }

    // Configurar event listeners
    setupEventListeners() {
        const checkoutBtn = document.getElementById('checkoutBtn');
        if (checkoutBtn) {
            checkoutBtn.addEventListener('click', () => this.processCheckout());
        }
    }

    // Procesar el checkout
    processCheckout() {
        if (this.items.length === 0) {
            alert('Tu carrito está vacío');
            return;
        }

        // Aquí iría la lógica de procesamiento del pago
        // Por ahora solo mostraremos un mensaje de éxito
        this.showSuccessModal();
    }

    // Mostrar modal de éxito al agregar al carrito
    showAddToCartSuccess() {
        const toast = new bootstrap.Toast(document.getElementById('addToCartToast'));
        toast.show();
    }

    // Mostrar modal de compra exitosa
    showSuccessModal() {
        const successModal = new bootstrap.Modal(document.getElementById('successModal'));
        successModal.show();
        
        // Limpiar el carrito después de la compra exitosa
        setTimeout(() => {
            this.items = [];
            this.saveCart();
            this.renderCart();
            this.updateCartCount();
            successModal.hide();
            window.location.href = 'index.html'; // Redirigir al inicio
        }, 3000);
    }
}

// Inicializar el carrito cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', () => {
    // Inicializar AOS
    AOS.init({
        duration: 1000,
        once: true
    });

    // Crear instancia del carrito
    window.cart = new ShoppingCart();
});
