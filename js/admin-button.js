/*
===========================================
FUNCIONALIDAD DEL BOTÓN DE ADMINISTRADOR
Este archivo maneja la interacción y animación
del botón de acceso al panel de administración.
===========================================
*/

document.addEventListener('DOMContentLoaded', function() {
    // Verificar si el usuario está autenticado como administrador
    // Aquí puedes agregar tu lógica de verificación
    
    const adminButton = document.querySelector('.admin-button');
    
    if (adminButton) {
        // Efecto de pulsación al hacer click
        adminButton.addEventListener('mousedown', function() {
            this.style.transform = 'scale(0.95)';
        });
        
        adminButton.addEventListener('mouseup', function() {
            this.style.transform = '';
        });
        
        // Animación suave al cargar la página
        setTimeout(() => {
            adminButton.style.opacity = '1';
            adminButton.style.transform = 'translateY(0)';
        }, 500);
    }
});
