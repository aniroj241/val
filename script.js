document.addEventListener('DOMContentLoaded', () => {
    const yesBtn = document.getElementById('yesBtn');
    const noBtn = document.getElementById('noBtn');
    const contentDiv = document.querySelector('.content');
    const successDiv = document.getElementById('success-message');
    const glassCard = document.querySelector('.glass-card');

    // Confetti configurations
    const fireConfetti = () => {
        const count = 200;
        const defaults = {
            origin: { y: 0.7 }
        };

        function fire(particleRatio, opts) {
            confetti(Object.assign({}, defaults, opts, {
                particleCount: Math.floor(count * particleRatio)
            }));
        }

        fire(0.25, { spread: 26, startVelocity: 55 });
        fire(0.2, { spread: 60 });
        fire(0.35, { spread: 100, decay: 0.91, scalar: 0.8 });
        fire(0.1, { spread: 120, startVelocity: 25, decay: 0.92, scalar: 1.2 });
        fire(0.1, { spread: 120, startVelocity: 45 });
    };

    // Yes Button Logic
    yesBtn.addEventListener('click', () => {
        // Reset tilt
        glassCard.style.transform = `rotateY(0deg) rotateX(0deg)`;

        // Hide initial content
        contentDiv.style.display = 'none';

        // Show success message
        successDiv.classList.remove('hidden');

        // Fire confetti
        fireConfetti();

        // Continuous confetti
        let duration = 3 * 1000;
        let animationEnd = Date.now() + duration;
        let skew = 1;

        (function frame() {
            let timeLeft = animationEnd - Date.now();
            let ticks = Math.max(200, 500 * (timeLeft / duration));
            skew = Math.max(0.8, skew - 0.001);

            confetti({
                particleCount: 1,
                startVelocity: 0,
                ticks: ticks,
                origin: { x: Math.random(), y: (Math.random() * skew) - 0.2 },
                colors: ['#ff3366', '#ff9a9e'],
                shapes: ['heart'],
                gravity: randomInRange(0.4, 0.6),
                scalar: randomInRange(0.4, 1),
                drift: randomInRange(-0.4, 0.4)
            });

            if (timeLeft > 0) {
                requestAnimationFrame(frame);
            }
        }());
    });

    function randomInRange(min, max) {
        return Math.random() * (max - min) + min;
    }

    // No Button Logic
    const moveButton = () => {
        const windowWidth = window.innerWidth;
        const windowHeight = window.innerHeight;
        const btnWidth = noBtn.offsetWidth;
        const btnHeight = noBtn.offsetHeight;
        const padding = 20;

        const randomX = Math.random() * (windowWidth - btnWidth - 2 * padding) + padding;
        const randomY = Math.random() * (windowHeight - btnHeight - 2 * padding) + padding;

        noBtn.style.position = 'fixed';
        noBtn.style.left = `${randomX}px`;
        noBtn.style.top = `${randomY}px`;
        noBtn.classList.add('moving');
    };

    noBtn.addEventListener('mouseover', moveButton);
    noBtn.addEventListener('click', (e) => {
        e.preventDefault();
        moveButton();
    });
    noBtn.addEventListener('touchstart', (e) => {
        e.preventDefault();
        moveButton();
    });

    // 3D Tilt Effect
    document.addEventListener('mousemove', (e) => {
        // Disable tilt slightly if celebrating to focus content
        if (!successDiv.classList.contains('hidden')) return;

        if (window.innerWidth < 768) return;

        const xAxis = (window.innerWidth / 2 - e.pageX) / 20;
        const yAxis = (window.innerHeight / 2 - e.pageY) / 20;

        glassCard.style.transform = `rotateY(${xAxis}deg) rotateX(${yAxis}deg)`;
    });

    // Mobile orientation support (Gyroscope)
    window.addEventListener("deviceorientation", (e) => {
        if (!successDiv.classList.contains('hidden')) return;

        const x = e.gamma / 2; // Left/Right tilt
        const y = e.beta / 2;  // Front/Back tilt

        // Limit the rotation
        if (x > 20 || x < -20 || y > 20 || y < -20) return;

        glassCard.style.transform = `rotateY(${x}deg) rotateX(${y}deg)`;
    }, true);
});
