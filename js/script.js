// Reveal Animations
const observerOptions = {
    threshold: 0.1,
    rootMargin: "0px 0px -50px 0px"
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('active');
        }
    });
}, observerOptions);

document.querySelectorAll('.reveal').forEach(el => observer.observe(el));

// Tilt effect for glass cards
document.querySelectorAll('.glass-card').forEach(card => {
    card.addEventListener('mousemove', e => {
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;

        const centerX = rect.width / 2;
        const centerY = rect.height / 2;

        const rotateX = ((y - centerY) / centerY) * -5;
        const rotateY = ((x - centerX) / centerX) * 5;

        card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-10px)`;
    });

    card.addEventListener('mouseleave', () => {
        card.style.transform = 'perspective(1000px) rotateX(0) rotateY(0) translateY(0)';
    });
});

// Smooth scrolling for anchor links with offset
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        const targetId = this.getAttribute('href');
        if (targetId === '#') return;

        // Use getElementById to avoid potential DOM-based XSS via CSS selector injection
        const id = targetId.substring(1);
        const targetElement = document.getElementById(id);
        if (targetElement) {
            e.preventDefault();
            const headerOffset = 80;
            const elementPosition = targetElement.getBoundingClientRect().top;
            const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

            window.scrollTo({
                top: offsetPosition,
                behavior: "smooth"
            });
        }
    });
});

// Prevent form submission reload and send to Telegram
const contactForm = document.getElementById('contactForm');
if (contactForm) {
    contactForm.addEventListener('submit', async function (e) {
        e.preventDefault();

        // --- CONFIGURACIÓN DE TELEGRAM ---
        // REEMPLAZA ESTOS VALORES CON LOS DE TU BOT
        const BOT_TOKEN = '8625842821:AAFebfG5ElcITJB4T5en-MkEusLuPXV_8-4';
        const CHAT_ID = '7732140429';
        // ---------------------------------

        const name = document.getElementById('name').value;
        const email = document.getElementById('email').value;
        const messageText = document.getElementById('message').value;

        const submitBtn = contactForm.querySelector('button[type="submit"]');
        const originalBtnText = submitBtn.innerText;

        // Cambiar estado del botón
        submitBtn.innerText = 'Enviando...';
        submitBtn.disabled = true;

        // Formatear el mensaje para Telegram
        const text = `📬 *Nuevo Mensaje Web - DSSD*\n\n*Nombre/Empresa:* ${name}\n*Contacto:* ${email}\n*Mensaje:* ${messageText}`;

        try {
            const response = await fetch(`https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    chat_id: CHAT_ID,
                    text: text,
                    parse_mode: 'Markdown'
                })
            });

            if (response.ok) {
                alert('¡Mensaje enviado con éxito! Nos pondremos en contacto a la brevedad.');
                contactForm.reset(); // Limpiar el formulario
            } else {
                throw new Error('Error de conexión con Telegram');
            }
        } catch (error) {
            console.error('Error enviando a Telegram:', error);
            alert('Hubo un error al enviar. Por favor, contáctanos directamente por WhatsApp.');
        } finally {
            // Restaurar botón
            submitBtn.innerText = originalBtnText;
            submitBtn.disabled = false;
        }
    });
}

