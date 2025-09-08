/*
===========================================
AUTENTICACIÓN DEL PANEL DE ADMINISTRACIÓN
Este archivo maneja la lógica de autenticación
para el acceso al panel de administrador.
===========================================
*/

document.addEventListener('DOMContentLoaded', function() {
    // Credenciales del administrador
    const ADMIN_CREDENTIALS = {
        email: 'axelduran342@gmail.com',
        password: 'axelduran8'
    };

    // Elementos del DOM
    const adminLoginForm = document.getElementById('adminLoginForm');
    const alertContainer = document.getElementById('alertContainer');

    // Función para mostrar alertas
    function showAlert(message, type = 'danger') {
        if (alertContainer) {
            alertContainer.innerHTML = `
                <div class="alert alert-${type} alert-dismissible fade show" role="alert">
                    ${message}
                    <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
                </div>
            `;
        }
    }

    // Función para validar las credenciales
    function validateCredentials(email, password) {
        return email === ADMIN_CREDENTIALS.email && password === ADMIN_CREDENTIALS.password;
    }

    // Manejo del formulario de login
    if (adminLoginForm) {
        adminLoginForm.addEventListener('submit', function(e) {
            e.preventDefault();

            const email = document.getElementById('adminEmail').value;
            const password = document.getElementById('adminPassword').value;
            const rememberMe = document.getElementById('rememberMe').checked;

            if (validateCredentials(email, password)) {
                // Guardar el estado de la sesión
                if (rememberMe) {
                    localStorage.setItem('adminLoggedIn', 'true');
                } else {
                    sessionStorage.setItem('adminLoggedIn', 'true');
                }

                // Mostrar mensaje de éxito
                showAlert('Inicio de sesión exitoso. Redirigiendo...', 'success');

                // Redireccionar al panel de administración
                setTimeout(() => {
                    window.location.href = 'index.html';
                }, 1000);
            } else {
                showAlert('Credenciales incorrectas. Por favor, intente nuevamente.');
            }
        });
    }

    // Verificar si el usuario está autenticado
    function checkAuth() {
        const isLoggedIn = localStorage.getItem('adminLoggedIn') || sessionStorage.getItem('adminLoggedIn');
        const currentPage = window.location.pathname;
        
        // Si no está en la página de login y no está autenticado, redirigir al login
        if (!currentPage.includes('login.html') && !isLoggedIn) {
            window.location.href = 'login.html';
        }
        // Si está en la página de login y está autenticado, redirigir al panel
        else if (currentPage.includes('login.html') && isLoggedIn) {
            window.location.href = 'index.html';
        }
    }

    // Función para cerrar sesión
    window.logoutAdmin = function() {
        localStorage.removeItem('adminLoggedIn');
        sessionStorage.removeItem('adminLoggedIn');
        window.location.href = 'login.html';
    }

    // Verificar autenticación al cargar la página
    checkAuth();
});
