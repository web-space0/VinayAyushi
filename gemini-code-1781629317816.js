document.addEventListener("DOMContentLoaded", () => {
    
    /* --- 1. Password Protection & Initialization --- */
    // Change "forever" to whatever private password you desire for your family.
    const CORRECT_PASSWORD = "forever"; 
    
    const passScreen = document.getElementById('password-screen');
    const passInput = document.getElementById('family-password');
    const enterBtn = document.getElementById('enter-btn');
    const passError = document.getElementById('password-error');
    const loader = document.getElementById('loader');
    const mainContent = document.getElementById('main-content');
    const musicController = document.getElementById('music-controller');

    function unlockExperience() {
        if (passInput.value.toLowerCase() === CORRECT_PASSWORD) {
            passScreen.style.opacity = '0';
            setTimeout(() => {
                passScreen.classList.add('hidden');
                loader.classList.remove('hidden');
                
                // Simulate Cinematic Loading Wait
                setTimeout(() => {
                    loader.style.opacity = '0';
                    setTimeout(() => {
                        loader.classList.add('hidden');
                        mainContent.classList.remove('hidden');
                        musicController.classList.remove('hidden');
                        initScrollObserver();
                        createParticles();
                    }, 1000);
                }, 3500); // 3.5 seconds loading for anticipation
            }, 1500);
        } else {
            passError.classList.remove('hidden');
        }
    }

    enterBtn.addEventListener('click', unlockExperience);
    passInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') unlockExperience();
    });

    /* --- 2. Scroll Reveal Animations --- */
    function initScrollObserver() {
        const reveals = document.querySelectorAll('.reveal');
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('active');
                    observer.unobserve(entry.target); // Animate only once
                }
            });
        }, { threshold: 0.15 });

        reveals.forEach(reveal => observer.observe(reveal));
    }

    /* --- 3. Lightbox Gallery --- */
    const lightbox = document.getElementById('lightbox');
    const lightboxImg = document.getElementById('lightbox-img');
    const closeBtn = document.getElementById('lightbox-close');
    const galleryImgs = document.querySelectorAll('.gallery-img');

    galleryImgs.forEach(img => {
        img.addEventListener('click', () => {
            lightboxImg.src = img.src;
            lightbox.classList.remove('hidden');
            lightbox.style.opacity = '1';
        });
    });

    closeBtn.addEventListener('click', closeLightbox);
    lightbox.addEventListener('click', (e) => {
        if(e.target !== lightboxImg) closeLightbox();
    });

    function closeLightbox() {
        lightbox.style.opacity = '0';
        setTimeout(() => { lightbox.classList.add('hidden'); }, 300);
    }

    /* --- 4. Ambient Particle Generation --- */
    function createParticles() {
        const container = document.body;
        const particleCount = 30; // Elegantly sparse, not overwhelming
        
        for (let i = 0; i < particleCount; i++) {
            let particle = document.createElement('div');
            particle.classList.add('particle');
            
            // Randomize size, starting position, and speed
            let size = Math.random() * 8 + 3; // 3px to 11px
            particle.style.width = `${size}px`;
            particle.style.height = `${size}px`;
            particle.style.left = `${Math.random() * 100}vw`;
            particle.style.animationDuration = `${Math.random() * 10 + 10}s`;
            particle.style.animationDelay = `${Math.random() * 5}s`;
            
            // Randomize gold/champagne color tints slightly
            particle.style.background = Math.random() > 0.5 ? 'var(--champagne)' : 'var(--antique-gold)';
            
            container.appendChild(particle);
        }
    }

    /* --- 5. Music Controller --- */
    const audio = document.getElementById('bg-music');
    const toggleMusicBtn = document.getElementById('toggle-music');
    let isPlaying = false;

    toggleMusicBtn.addEventListener('click', () => {
        if (isPlaying) {
            audio.pause();
            toggleMusicBtn.innerText = "🎵 Play Music";
        } else {
            audio.play().catch(e => console.log("Audio playback blocked by browser"));
            toggleMusicBtn.innerText = "⏸ Pause Music";
        }
        isPlaying = !isPlaying;
    });

    /* --- 6. Digital Guestbook (Local Storage) --- */
    const form = document.getElementById('guestbook-form');
    const nameInput = document.getElementById('gb-name');
    const messageInput = document.getElementById('gb-message');
    const entriesContainer = document.getElementById('guestbook-entries');

    // Load existing messages
    const loadMessages = () => {
        const messages = JSON.parse(localStorage.getItem('weddingMessages')) || [];
        entriesContainer.innerHTML = '';
        messages.forEach(msg => {
            const div = document.createElement('div');
            div.className = 'gb-entry';
            div.innerHTML = `<h4>${msg.name}</h4><p>"${msg.message}"</p>`;
            entriesContainer.appendChild(div);
        });
    }

    form.addEventListener('submit', (e) => {
        e.preventDefault();
        const newMessage = {
            name: nameInput.value,
            message: messageInput.value
        };
        const messages = JSON.parse(localStorage.getItem('weddingMessages')) || [];
        messages.unshift(newMessage); // Add to top
        localStorage.setItem('weddingMessages', JSON.stringify(messages));
        
        // Clear and reload
        nameInput.value = '';
        messageInput.value = '';
        loadMessages();
    });

    // Initialize Guestbook
    loadMessages();
});