// ==========================================
// CLASE CARRITO DE COMPRAS
// Esta clase maneja toda la lógica del carrito:
// - Agregar/quitar productos
// - Actualizar cantidades
// - Calcular totales
// - Guardar en localStorage
// ==========================================

class ShoppingCart {
    constructor() {
        // Recuperar carrito del localStorage o crear uno nuevo
        this.items = JSON.parse(localStorage.getItem('cart')) || [];
        this.total = 0;
        this.init();
    }

    // Inicializa el carrito
    init() {
        this.updateCartCount(); // Actualiza el número de items en el ícono del carrito
        this.setupEventListeners(); // Configura los eventos de click y cambios
    }

    // Configura todos los eventos necesarios para el carrito
    setupEventListeners() {
        // Agregar al carrito
        document.querySelectorAll('.add-to-cart-btn').forEach(button => {
            button.addEventListener('click', (e) => {
                const card = e.target.closest('.product-card');
                const product = {
                    id: card.dataset.productId,
                    name: card.querySelector('.product-title').textContent,
                    price: parseFloat(card.querySelector('.product-price').textContent.replace('$', '')),
                    image: card.querySelector('.product-img').src,
                    quantity: 1
                };
                this.addItem(product);
            });
        });

        // Actualizar cantidades
        document.querySelectorAll('.quantity-input').forEach(input => {
            input.addEventListener('change', (e) => {
                const id = e.target.closest('.cart-item').dataset.productId;
                this.updateQuantity(id, parseInt(e.target.value));
            });
        });
    }

    addItem(product) {
        const existingItem = this.items.find(item => item.id === product.id);
        
        if (existingItem) {
            existingItem.quantity += 1;
        } else {
            this.items.push(product);
        }

        this.updateCart();
        this.showNotification('Producto agregado al carrito');
    }

    removeItem(productId) {
        this.items = this.items.filter(item => item.id !== productId);
        this.updateCart();
    }

    updateQuantity(productId, quantity) {
        const item = this.items.find(item => item.id === productId);
        if (item) {
            item.quantity = quantity;
            if (item.quantity <= 0) {
                this.removeItem(productId);
            }
        }
        this.updateCart();
    }

    updateCart() {
        localStorage.setItem('cart', JSON.stringify(this.items));
        this.updateCartCount();
        this.updateCartTotal();
        this.renderCartItems();
    }

    updateCartCount() {
        const count = this.items.reduce((total, item) => total + item.quantity, 0);
        document.querySelector('.cart-badge').textContent = count;
    }

    updateCartTotal() {
        this.total = this.items.reduce((total, item) => total + (item.price * item.quantity), 0);
        if (document.querySelector('.cart-total')) {
            document.querySelector('.cart-total').textContent = `$${this.total.toFixed(2)}`;
        }
    }

    renderCartItems() {
        const cartContainer = document.querySelector('.cart-items');
        if (!cartContainer) return;

        cartContainer.innerHTML = this.items.map(item => `
            <div class="cart-item" data-product-id="${item.id}">
                <img src="${item.image}" alt="${item.name}" class="cart-item-img">
                <div class="cart-item-details">
                    <h6>${item.name}</h6>
                    <p>$${item.price}</p>
                    <input type="number" value="${item.quantity}" min="0" class="quantity-input">
                </div>
                <button class="remove-item-btn" onclick="cart.removeItem('${item.id}')">
                    <i class="fas fa-trash"></i>
                </button>
            </div>
        `).join('');
    }

    showNotification(message) {
        const notification = document.createElement('div');
        notification.className = 'notification';
        notification.textContent = message;
        document.body.appendChild(notification);

        setTimeout(() => {
            notification.remove();
        }, 3000);
    }
}

// Inicializar el carrito
const cart = new ShoppingCart();

// Animaciones al hacer scroll
document.addEventListener('DOMContentLoaded', () => {
    const animateElements = document.querySelectorAll('.animate-on-scroll');
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate-fade-in');
            }
        });
    });

    animateElements.forEach(element => observer.observe(element));
});

// Filtrado de productos
function filterProducts(category) {
    const products = document.querySelectorAll('.product-card');
    products.forEach(product => {
        if (category === 'all' || product.dataset.category === category) {
            product.style.display = 'block';
        } else {
            product.style.display = 'none';
        }
    });
}

// Newsletter
document.querySelector('.newsletter-form')?.addEventListener('submit', (e) => {
    e.preventDefault();
    const email = e.target.querySelector('input[type="email"]').value;
    // Aquí iría la lógica para guardar el email
    alert('¡Gracias por suscribirte!');
});

// Lazy loading de imágenes
document.addEventListener('DOMContentLoaded', () => {
    const images = document.querySelectorAll('img[data-src]');
    const imageObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                img.src = img.dataset.src;
                img.removeAttribute('data-src');
                observer.unobserve(img);
            }
        });
    });

    images.forEach(img => imageObserver.observe(img));
});
