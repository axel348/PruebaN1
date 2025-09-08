/**
 * Clase principal para el manejo del panel de administración
 */
class AdminPanel {
    constructor() {
        this.initializeComponents();
        this.setupEventListeners();
        this.loadDashboardData();
    }

    /**
     * Inicializa los componentes del panel
     */
    initializeComponents() {
        this.sidebar = document.querySelector('.admin-sidebar');
        this.notificationBell = document.querySelector('.notification-bell');
        this.notificationsDropdown = document.querySelector('.notifications-dropdown');
        this.menuToggle = document.querySelector('.menu-toggle');
        this.setupCharts();
    }

    /**
     * Configura los event listeners
     */
    setupEventListeners() {
        // Toggle del menú en móviles
        if (this.menuToggle) {
            this.menuToggle.addEventListener('click', () => {
                this.sidebar.classList.toggle('show');
            });
        }

        // Toggle de notificaciones
        if (this.notificationBell) {
            this.notificationBell.addEventListener('click', (e) => {
                e.stopPropagation();
                this.notificationsDropdown.classList.toggle('show');
            });
        }

        // Cerrar dropdown al hacer click fuera
        document.addEventListener('click', (e) => {
            if (!this.notificationsDropdown?.contains(e.target) && 
                !this.notificationBell?.contains(e.target)) {
                this.notificationsDropdown?.classList.remove('show');
            }
        });

        // Manejo de las pestañas de navegación
        const tabLinks = document.querySelectorAll('[data-tab]');
        tabLinks.forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                this.switchTab(link.dataset.tab);
            });
        });
    }

    /**
     * Carga los datos del dashboard
     */
    async loadDashboardData() {
        try {
            // Aquí normalmente harías una llamada a tu API
            const data = await this.fetchDashboardData();
            this.updateDashboardUI(data);
        } catch (error) {
            console.error('Error loading dashboard data:', error);
            this.showNotification('Error', 'No se pudieron cargar los datos del dashboard', 'error');
        }
    }

    /**
     * Simula la obtención de datos del dashboard
     */
    async fetchDashboardData() {
        // Simulación de datos - Reemplazar con llamadas reales a tu API
        return {
            sales: {
                total: 15750,
                trend: '+12.5%',
                period: 'vs mes anterior'
            },
            orders: {
                total: 356,
                trend: '+5.2%',
                period: 'vs mes anterior'
            },
            customers: {
                total: 892,
                trend: '+15.7%',
                period: 'vs mes anterior'
            },
            revenue: {
                total: '$45,678',
                trend: '+8.3%',
                period: 'vs mes anterior'
            }
        };
    }

    /**
     * Actualiza la UI del dashboard con los datos
     */
    updateDashboardUI(data) {
        // Actualizar cards
        Object.entries(data).forEach(([key, value]) => {
            const card = document.querySelector(`#${key}Card`);
            if (card) {
                card.querySelector('.card-value').textContent = value.total;
                card.querySelector('.card-trend').textContent = `${value.trend} ${value.period}`;
            }
        });

        // Actualizar gráficos
        this.updateCharts(data);
    }

    /**
     * Configura los gráficos del dashboard
     */
    setupCharts() {
        // Configuración de gráficos con Chart.js
        if (typeof Chart === 'undefined') return;

        // Gráfico de ventas
        const salesCtx = document.getElementById('salesChart')?.getContext('2d');
        if (salesCtx) {
            new Chart(salesCtx, {
                type: 'line',
                data: {
                    labels: ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun'],
                    datasets: [{
                        label: 'Ventas',
                        data: [12, 19, 3, 5, 2, 3],
                        borderColor: '#2c3e50',
                        tension: 0.4
                    }]
                },
                options: {
                    responsive: true,
                    plugins: {
                        legend: {
                            position: 'bottom'
                        }
                    }
                }
            });
        }
    }

    /**
     * Actualiza los gráficos con nuevos datos
     */
    updateCharts(data) {
        // Actualizar datos de los gráficos
        // Implementar según necesidades
    }

    /**
     * Cambia entre las diferentes secciones del panel
     */
    switchTab(tabId) {
        // Ocultar todas las secciones
        document.querySelectorAll('.admin-section').forEach(section => {
            section.style.display = 'none';
        });

        // Mostrar la sección seleccionada
        const selectedSection = document.querySelector(`#${tabId}Section`);
        if (selectedSection) {
            selectedSection.style.display = 'block';
        }

        // Actualizar clase activa en el menú
        document.querySelectorAll('.menu-item').forEach(item => {
            item.classList.remove('active');
        });
        document.querySelector(`[data-tab="${tabId}"]`)?.classList.add('active');
    }

    /**
     * Muestra notificaciones en el panel
     */
    showNotification(title, message, type = 'info') {
        const notification = document.createElement('div');
        notification.className = `notification-item ${type}`;
        notification.innerHTML = `
            <div class="notification-title">${title}</div>
            <div class="notification-text">${message}</div>
            <div class="notification-time">Ahora</div>
        `;

        this.notificationsDropdown.insertBefore(
            notification, 
            this.notificationsDropdown.firstChild
        );

        // Actualizar contador
        const count = document.querySelector('.notification-count');
        if (count) {
            count.textContent = parseInt(count.textContent || 0) + 1;
        }
    }

    /**
     * Maneja el formulario de inventario
     */
    handleInventoryForm(event) {
        event.preventDefault();
        const formData = new FormData(event.target);
        
        // Aquí irían las validaciones y el envío a tu API
        this.showNotification(
            'Éxito',
            'Producto actualizado correctamente',
            'success'
        );
    }

    /**
     * Maneja el formulario de empleados
     */
    handleEmployeeForm(event) {
        event.preventDefault();
        const formData = new FormData(event.target);
        
        // Aquí irían las validaciones y el envío a tu API
        this.showNotification(
            'Éxito',
            'Empleado agregado correctamente',
            'success'
        );
    }
}

// Inicializar cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', () => {
    window.adminPanel = new AdminPanel();
});
