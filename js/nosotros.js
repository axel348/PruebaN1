// Inicializar AOS
document.addEventListener('DOMContentLoaded', function() {
    // Inicializar AOS
    AOS.init({
        duration: 1000,
        once: true
    });

    // Contador para las cifras
    const counters = document.querySelectorAll('.counter');
    counters.forEach(counter => {
        const target = parseInt(counter.innerText);
        const increment = target / 50;
        let count = 0;

        const updateCount = () => {
            if (count < target) {
                count += increment;
                counter.innerText = Math.ceil(count) + '+';
                setTimeout(updateCount, 30);
            } else {
                counter.innerText = target + '+';
            }
        };

        updateCount();
    });
});
