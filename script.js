// Dark Mode Toggle with LocalStorage
    const darkModeToggle = document.getElementById('darkModeToggle');
    const htmlEl = document.documentElement;
    const bodyEl = document.body;

    function setDarkMode(enabled) {
      if (enabled) {
        htmlEl.classList.add('dark');
        bodyEl.classList.add('bg-black', 'text-white');
        darkModeToggle.innerHTML = '<i class="fas fa-sun"></i>';
        localStorage.setItem('darkMode', 'enabled');
      } else {
        htmlEl.classList.remove('dark');
        bodyEl.classList.remove('bg-black', 'text-black');
        darkModeToggle.innerHTML = '<i class="fas fa-moon"></i>';
        localStorage.setItem('darkMode', 'disabled');
      }
    }

    // Initialize dark mode from localStorage or default to enabled
    const darkModeStored = localStorage.getItem('darkMode');
    if (darkModeStored === 'disabled') {
      setDarkMode(false);
    } else {
      setDarkMode(true);
    }

    darkModeToggle.addEventListener('click', () => {
      const isDark = htmlEl.classList.contains('dark');
      setDarkMode(!isDark);
    });

    // Mobile menu toggle
    const mobileMenuButton = document.getElementById('mobileMenuButton');
    const mobileMenu = document.getElementById('mobileMenu');
    mobileMenuButton.addEventListener('click', () => {
      if (mobileMenu.classList.contains('hidden')) {
        mobileMenu.classList.remove('hidden');
        mobileMenuButton.setAttribute('aria-label', 'Close Menu');
        mobileMenuButton.innerHTML = '<i class="fas fa-times fa-lg"></i>';
      } else {
        mobileMenu.classList.add('hidden');
        mobileMenuButton.setAttribute('aria-label', 'Open Menu');
        mobileMenuButton.innerHTML = '<i class="fas fa-bars fa-lg"></i>';
      }
    });

    // Typing effect for hero role
    class TxtType {
      constructor(el, toRotate, period) {
        this.toRotate = toRotate;
        this.el = el;
        this.loopNum = 0;
        this.period = parseInt(period, 10) || 2000;
        this.txt = '';
        this.isDeleting = false;
        this.tick = this.tick.bind(this);
        this.tick();
      }

      tick() {
        const i = this.loopNum % this.toRotate.length;
        const fullTxt = this.toRotate[i];

        if (this.isDeleting) {
          this.txt = fullTxt.substring(0, this.txt.length - 1);
        } else {
          this.txt = fullTxt.substring(0, this.txt.length + 1);
        }

        this.el.innerHTML = '<span class="wrap">' + this.txt + '</span>';

        let delta = 120 - Math.random() * 50;

        if (this.isDeleting) {
          delta /= 2;
        }

        if (!this.isDeleting && this.txt === fullTxt) {
          delta = this.period;
          this.isDeleting = true;
        } else if (this.isDeleting && this.txt === '') {
          this.isDeleting = false;
          this.loopNum++;
          delta = 500;
        }

        setTimeout(this.tick, delta);
      }
    }

    window.onload = function () {
      const elements = document.getElementsByClassName('typing');
      for (let i = 0; i < elements.length; i++) {
        const toRotate = ['Web Developer', 'IT', 'Graphics Design', 'Hardware troubleshooting'];
        new TxtType(elements[i].getElementsByClassName('wrap')[0], toRotate, 2500);
      }
    };

    // Intersection Observer for scroll fade animations
    const faders = document.querySelectorAll('.scroll-fade');
    const appearOptions = {
      threshold: 0.1,
      rootMargin: '0px 0px -50px 0px',
    };

    const appearOnScroll = new IntersectionObserver(function (
      entries,
      appearOnScroll
    ) {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) {
          return;
        } else {
          entry.target.classList.add('opacity-100', 'translate-y-0');
          entry.target.classList.remove('opacity-0', 'translate-y-10');
          appearOnScroll.unobserve(entry.target);
        }
      });
    },
    appearOptions);

    faders.forEach((fader) => {
      fader.classList.add('opacity-0', 'translate-y-10', 'transition-all', 'duration-700', 'ease-out');
      appearOnScroll.observe(fader);
    });

    // Project Modal Logic
    const projectCards = document.querySelectorAll('#projects article');
    const modal = document.getElementById('projectModal');
    const modalCloseBtn = document.getElementById('modalCloseBtn');
    const modalTitle = document.getElementById('modalTitle');
    const modalDescription = document.getElementById('modalDescription');
    const modalImage = document.getElementById('modalImage');
    const modalTech = document.getElementById('modalTech');
    const modalLink = document.getElementById('modalLink');

    function openModal(project) {
      modalTitle.textContent = project.title;
      modalDescription.textContent = project.description;
      modalImage.src = project.image;
      modalImage.alt = `Screenshot of project titled ${project.title}`;
      modalTech.innerHTML = '';
      project.technologies.forEach((tech) => {
        const span = document.createElement('span');
        span.textContent = tech;
        span.className =
          'text-xs bg-gray-700 rounded-full px-3 py-1 font-mono mr-2 mb-2 inline-block';
        modalTech.appendChild(span);
      });
      modalLink.href = project.link;
      modal.classList.remove('opacity-0', 'pointer-events-none');
      modal.setAttribute('aria-hidden', 'false');
      document.body.style.overflow = 'hidden';
      modalCloseBtn.focus();
    }

    function closeModal() {
      modal.classList.add('opacity-0', 'pointer-events-none');
      modal.setAttribute('aria-hidden', 'true');
      document.body.style.overflow = '';
    }

    projectCards.forEach((card) => {
      card.addEventListener('click', () => {
        const project = JSON.parse(card.getAttribute('data-project'));
        openModal(project);
      });
      card.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          const project = JSON.parse(card.getAttribute('data-project'));
          openModal(project);
        }
      });
    });

    modalCloseBtn.addEventListener('click', closeModal);
    modal.addEventListener('click', (e) => {
      if (e.target === modal) {
        closeModal();
      }
    });
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && modal.getAttribute('aria-hidden') === 'false') {
        closeModal();
      }
    });

    // Contact Form Validation
    const contactForm = document.getElementById('contactForm');
    const nameInput = contactForm.name;
    const emailInput = contactForm.email;
    const messageInput = contactForm.message;
    const nameError = document.getElementById('nameError');
    const emailError = document.getElementById('emailError');
    const messageError = document.getElementById('messageError');
    const formSuccess = document.getElementById('formSuccess');

    function validateEmail(email) {
      // Simple email regex
      const re =
        /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@(([^<>()[\]\\.,;:\s@"]+\.)+[^<>()[\]\\.,;:\s@"]{2,})$/i;
      return re.test(String(email).toLowerCase());
    }

    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();
      let valid = true;

      // Name validation
      if (!nameInput.value.trim() || nameInput.value.trim().length < 2) {
        nameError.classList.remove('hidden');
        valid = false;
      } else {
        nameError.classList.add('hidden');
      }

      // Email validation
      if (!validateEmail(emailInput.value.trim())) {
        emailError.classList.remove('hidden');
        valid = false;
      } else {
        emailError.classList.add('hidden');
      }

      // Message validation
      if (!messageInput.value.trim() || messageInput.value.trim().length < 10) {
        messageError.classList.remove('hidden');
        valid = false;
      } else {
        messageError.classList.add('hidden');
      }

      if (valid) {
        // Simulate form submission success
        formSuccess.classList.remove('hidden');
        contactForm.reset();
        setTimeout(() => {
          formSuccess.classList.add('hidden');
        }, 5000);
      }
    });

    // Particle background animation
    const canvas = document.getElementById('particleCanvas');
    const ctx = canvas.getContext('2d');
    let particlesArray = [];
    let width, height;

    function initCanvas() {
      width = window.innerWidth;
      height = window.innerHeight;
      canvas.width = width;
      canvas.height = height;
    }

    class Particle {
      constructor() {
        this.x = Math.random() * width;
        this.y = Math.random() * height;
        this.size = Math.random() * 2 + 1;
        this.speedX = (Math.random() - 0.5) * 0.5;
        this.speedY = (Math.random() - 0.5) * 0.5;
        this.opacity = Math.random() * 0.5 + 0.1;
      }
      update() {
        this.x += this.speedX;
        this.y += this.speedY;

        if (this.x < 0 || this.x > width) this.speedX = -this.speedX;
        if (this.y < 0 || this.y > height) this.speedY = -this.speedY;
      }
      draw() {
        ctx.fillStyle = `rgba(255, 255, 255, ${this.opacity})`;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fill();
      }
    }

    function createParticles() {
      particlesArray = [];
      const numberOfParticles = Math.floor((width * height) / 8000);
      for (let i = 0; i < numberOfParticles; i++) {
        particlesArray.push(new Particle());
      }
    }

    function animateParticles() {
      ctx.clearRect(0, 0, width, height);
      particlesArray.forEach((particle) => {
        particle.update();
        particle.draw();
      });
      connectParticles();
      requestAnimationFrame(animateParticles);
    }

    function connectParticles() {
      let maxDistance = 120;
      for (let a = 0; a < particlesArray.length; a++) {
        for (let b = a + 1; b < particlesArray.length; b++) {
          let dx = particlesArray[a].x - particlesArray[b].x;
          let dy = particlesArray[a].y - particlesArray[b].y;
          let distance = Math.sqrt(dx * dx + dy * dy);
          if (distance < maxDistance) {
            ctx.strokeStyle = `rgba(255, 255, 255, ${
              0.2 * (1 - distance / maxDistance)
            })`;
            ctx.lineWidth = 1;
            ctx.beginPath();
            ctx.moveTo(particlesArray[a].x, particlesArray[a].y);
            ctx.lineTo(particlesArray[b].x, particlesArray[b].y);
            ctx.stroke();
          }
        }
      }
    }

    window.addEventListener('resize', () => {
      initCanvas();
      createParticles();
    });

    initCanvas();
    createParticles();
    animateParticles();