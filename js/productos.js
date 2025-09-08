// ==========================================
// FUNCIONALIDAD DE LA PÁGINA DE PRODUCTOS
// Incluye:
// - Filtrado de productos
// - Sistema de carrito
// - Animaciones
// - Paginación
// ==========================================

document.addEventListener('DOMContentLoaded', () => {
    // Inicializar AOS (Animate On Scroll)
    AOS.init({
        duration: 800,
        once: true
    });

    // Referencias a elementos del DOM
    const filterButtons = document.querySelectorAll('.filters button');
    const productCards = document.querySelectorAll('.product-card');
    const cartBadge = document.querySelector('.cart-badge');
    const addToCartButtons = document.querySelectorAll('.add-to-cart-btn');

    // Estado del carrito
    let cart = JSON.parse(localStorage.getItem('cart')) || [];

    // ==========================================
    // SISTEMA DE FILTRADO
    // ==========================================
    filterButtons.forEach(button => {
        button.addEventListener('click', () => {
            // Remover clase active de todos los botones
            filterButtons.forEach(btn => btn.classList.remove('active'));
            // Agregar clase active al botón clickeado
            button.classList.add('active');

            const filterValue = button.getAttribute('data-filter');

            productCards.forEach(card => {
                if (filterValue === 'all' || card.getAttribute('data-category') === filterValue) {
                    card.style.display = 'block';
                    // Añadir animación de fade
                    card.style.opacity = '0';
                    setTimeout(() => {
                        card.style.opacity = '1';
                    }, 100);
                } else {
                    card.style.display = 'none';
                }
            });
        });
    });

    // ==========================================
    // SISTEMA DE CARRITO
    // ==========================================
    function updateCart() {
        // Actualizar badge del carrito
        cartBadge.textContent = cart.reduce((total, item) => total + item.quantity, 0);
        // Guardar en localStorage
        localStorage.setItem('cart', JSON.stringify(cart));
    }

    function showNotification(message) {
        const notification = document.createElement('div');
        notification.className = 'notification';
        notification.textContent = message;
        document.body.appendChild(notification);

        // Remover notificación después de 3 segundos
        setTimeout(() => {
            notification.remove();
        }, 3000);
    }

    function addToCart(productId) {
        const productCard = document.querySelector(`.product-card[data-product-id="${productId}"]`);
        const product = {
            id: productId,
            name: productCard.querySelector('.product-title').textContent,
            price: parseFloat(productCard.querySelector('.product-price').textContent.replace('$', '').replace('.', '')),
            image: productCard.querySelector('.product-img').src,
            quantity: 1
        };

        const existingProduct = cart.find(item => item.id === productId);
        if (existingProduct) {
            existingProduct.quantity++;
        } else {
            cart.push(product);
        }

        updateCart();
        showNotification('Producto agregado al carrito');
    }

    // Event listeners para botones de agregar al carrito
    addToCartButtons.forEach(button => {
        button.addEventListener('click', (e) => {
            e.preventDefault();
            const productId = button.getAttribute('data-product-id');
            addToCart(productId);

            // Animación del botón
            button.classList.add('clicked');
            setTimeout(() => {
                button.classList.remove('clicked');
            }, 200);
        });
    });

    // ==========================================
    // LAZY LOADING DE IMÁGENES
    // ==========================================
    const images = document.querySelectorAll('.product-img[data-src]');
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

    // ==========================================
    // BÚSQUEDA DE PRODUCTOS
    // ==========================================
    const searchInput = document.querySelector('.search-box input');
    searchInput?.addEventListener('input', (e) => {
        const searchTerm = e.target.value.toLowerCase();

        productCards.forEach(card => {
            const title = card.querySelector('.product-title').textContent.toLowerCase();
            const description = card.querySelector('.text-muted').textContent.toLowerCase();

            if (title.includes(searchTerm) || description.includes(searchTerm)) {
                card.style.display = 'block';
            } else {
                card.style.display = 'none';
            }
        });
    });

    // Inicializar el carrito al cargar la página
    updateCart();
});
