// Loading Screen
    window.addEventListener('load', function() {
        const loadingScreen = document.getElementById('loading-screen');
        setTimeout(() => {
            loadingScreen.classList.add('loading-fade-out');
            setTimeout(() => {
                loadingScreen.style.display = 'none';
            }, 500);
        }, 1000); // Show loading for 1 second minimum
    });

    // CV Download functionality
    async function resolveCvPath() {
      const candidates = [
        'Waheed_Gulzar_Resume%20.pdf',
        'Waheed_Gulzar_Resume .pdf',
        'Waheed Gulzar.pdf',
        '../Waheed_Gulzar_Resume%20.pdf',
        '../Waheed_Gulzar_Resume .pdf'
      ];

      for (const path of candidates) {
        try {
          const response = await fetch(path, { method: 'HEAD' });
          if (response.ok) {
            return path;
          }
        } catch (error) {
          // Try next candidate silently.
        }
      }

      return null;
    }

    async function downloadCV() {
      const cvPath = await resolveCvPath();
      if (!cvPath) {
        showNotification('Resume file is currently unavailable. Please contact me directly.', 'error');
        return;
      }

      window.open(cvPath, '_blank', 'noopener');
      showDownloadMessage();
    }

    // Success message for CV download
    function showDownloadMessage() {
      const message = document.createElement('div');
      message.className = 'fixed top-24 right-6 bg-gradient-to-r from-emerald-500 to-teal-600 text-white px-6 py-3 rounded-xl shadow-lg z-50 animate-fade-in';
      message.innerHTML = '<i class="fas fa-check-circle mr-2"></i>CV Downloaded Successfully!';
      
      document.body.appendChild(message);
      
      setTimeout(() => {
        message.style.opacity = '0';
        message.style.transform = 'translateX(100%)';
        setTimeout(() => {
          document.body.removeChild(message);
        }, 300);
      }, 3000);
    }

    // EmailJS Configuration
    // Initialize EmailJS when the page loads
    document.addEventListener('DOMContentLoaded', function() {
        // Check if EmailJS is loaded
        if (typeof emailjs !== 'undefined') {
            emailjs.init("lWWeHO1vEfGor2iFX"); 
            console.log('EmailJS initialized successfully');
        } else {
            console.error('EmailJS library not loaded');
        }
    });

    // Contact Form Functionality
    function showNotification(message, type = 'success') {
        const notification = document.createElement('div');
        const bgColor = type === 'success' 
            ? 'bg-gradient-to-r from-emerald-500 to-teal-600' 
            : 'bg-gradient-to-r from-red-500 to-red-600';
        
        notification.className = `fixed top-24 right-6 ${bgColor} text-white px-6 py-3 rounded-xl shadow-lg z-50 animate-fade-in`;
        notification.innerHTML = `<i class="fas fa-${type === 'success' ? 'check-circle' : 'exclamation-circle'} mr-2"></i>${message}`;
        
        document.body.appendChild(notification);
        
        setTimeout(() => {
            notification.style.opacity = '0';
            notification.style.transform = 'translateX(100%)';
            setTimeout(() => {
                if (document.body.contains(notification)) {
                    document.body.removeChild(notification);
                }
            }, 300);
        }, 4000);
    }

    function setSubmitButtonState(isLoading) {
        const submitBtn = document.getElementById('submit-btn');
        const btnText = document.getElementById('btn-text');
        const btnIcon = document.getElementById('btn-icon');
        
        if (submitBtn && btnText && btnIcon) {
            if (isLoading) {
                submitBtn.disabled = true;
                submitBtn.classList.add('opacity-70', 'cursor-not-allowed');
                btnText.textContent = 'Sending...';
                btnIcon.className = 'fas fa-spinner fa-spin ml-2';
            } else {
                submitBtn.disabled = false;
                submitBtn.classList.remove('opacity-70', 'cursor-not-allowed');
                btnText.textContent = 'Send Message';
                btnIcon.className = 'fas fa-paper-plane ml-2';
            }
        }
    }

      function clearFieldError(fieldName) {
        const field = document.getElementById(fieldName);
        if (!field) return;

        const existingError = field.parentElement.querySelector('.error-message');
        if (existingError) {
          existingError.remove();
        }
      }

      function showFieldError(fieldName, errorText) {
        const field = document.getElementById(fieldName);
        if (!field) return;

        clearFieldError(fieldName);
        const error = document.createElement('div');
        error.className = 'error-message text-red-400 text-sm mt-2';
        error.textContent = errorText;
        field.parentElement.appendChild(error);
      }

      function validateForm(form) {
        const errors = {};
        const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

        if (!form.first_name.value.trim()) {
          errors.first_name = 'First name is required.';
        }
        if (!form.last_name.value.trim()) {
          errors.last_name = 'Last name is required.';
        }
        if (!emailPattern.test(form.email.value.trim())) {
          errors.email = 'Please enter a valid email address.';
        }
        if (!form.subject.value.trim()) {
          errors.subject = 'Subject is required.';
        }
        if (!form.message.value.trim() || form.message.value.trim().length < 10) {
          errors.message = 'Message must be at least 10 characters.';
        }

        return errors;
      }

    // Handle contact form submission
    document.addEventListener('DOMContentLoaded', function() {
        const contactForm = document.getElementById('contact-form');
        if (contactForm) {
            contactForm.addEventListener('submit', function(e) {
                e.preventDefault();

              ['first_name', 'last_name', 'email', 'subject', 'message'].forEach(clearFieldError);

              const errors = validateForm(contactForm);
              if (Object.keys(errors).length > 0) {
                Object.entries(errors).forEach(([fieldName, message]) => {
                  showFieldError(fieldName, message);
                });
                showNotification('Please fix the highlighted form fields.', 'error');
                return;
              }
                
                // Check if EmailJS is available
                if (typeof emailjs === 'undefined') {
                    showNotification('Email service is not available. Please contact me directly.', 'error');
                    return;
                }
                
                // Set loading state
                setSubmitButtonState(true);
                
                // Get form data
                const formData = {
                    first_name: this.first_name.value,
                    last_name: this.last_name.value,
                    email: this.email.value,
                    subject: this.subject.value,
                    message: this.message.value,
                    full_name: this.first_name.value + ' ' + this.last_name.value
                };

                emailjs.send('service_44p9dy2', 'template_x2tthab', formData)
                    .then(function(response) {
                        console.log('SUCCESS!', response.status, response.text);
                        showNotification('Message sent successfully! I will get back to you soon.', 'success');
                        contactForm.reset();
                    })
                    .catch(function(error) {
                        console.log('FAILED...', error);
                        showNotification('Failed to send message. Please try again or contact me directly.', 'error');
                    })
                    .finally(function() {
                        setSubmitButtonState(false);
                    });
               
            });
        }
    });

    // Add event listeners for CV download buttons
    document.addEventListener('DOMContentLoaded', function() {
        const downloadCvBtn = document.getElementById('download-cv');
        const downloadCvAboutBtn = document.getElementById('download-cv-about');
        const downloadCvMobileBtn = document.getElementById('download-cv-mobile');

        if (downloadCvBtn) {
            downloadCvBtn.addEventListener('click', (e) => {
                e.preventDefault();
                downloadCV();
            });
        }

        if (downloadCvAboutBtn) {
            downloadCvAboutBtn.addEventListener('click', (e) => {
                e.preventDefault();
                downloadCV();
            });
        }

        if (downloadCvMobileBtn) {
            downloadCvMobileBtn.addEventListener('click', (e) => {
                e.preventDefault();
                downloadCV();
            });
        }
    });

    // Mobile menu functionality
    document.addEventListener('DOMContentLoaded', function() {
        const mobileMenuButton = document.getElementById('mobile-menu-button');
        const mobileMenu = document.getElementById('mobile-menu');
        const menuIcon = document.getElementById('menu-icon');
        let isMenuOpen = false;

        if (mobileMenuButton && mobileMenu && menuIcon) {
            mobileMenuButton.addEventListener('click', () => {
                isMenuOpen = !isMenuOpen;
            mobileMenuButton.setAttribute('aria-expanded', isMenuOpen ? 'true' : 'false');
                
                if (isMenuOpen) {
                    mobileMenu.classList.remove('hidden');
                    mobileMenu.classList.add('animate-fade-in');
                    menuIcon.classList.remove('fa-bars');
                    menuIcon.classList.add('fa-times');
                } else {
                    mobileMenu.classList.add('hidden');
                    mobileMenu.classList.remove('animate-fade-in');
                    menuIcon.classList.remove('fa-times');
                    menuIcon.classList.add('fa-bars');
                }
            });

            // Close mobile menu when clicking on a link
            document.querySelectorAll('.mobile-nav-link').forEach(link => {
                link.addEventListener('click', () => {
                    isMenuOpen = false;
                  mobileMenuButton.setAttribute('aria-expanded', 'false');
                    mobileMenu.classList.add('hidden');
                    mobileMenu.classList.remove('animate-fade-in');
                    menuIcon.classList.remove('fa-times');
                    menuIcon.classList.add('fa-bars');
                });
            });

            // Close mobile menu when clicking outside
            document.addEventListener('click', (e) => {
                if (isMenuOpen && !mobileMenuButton.contains(e.target) && !mobileMenu.contains(e.target)) {
                    isMenuOpen = false;
                  mobileMenuButton.setAttribute('aria-expanded', 'false');
                    mobileMenu.classList.add('hidden');
                    mobileMenu.classList.remove('animate-fade-in');
                    menuIcon.classList.remove('fa-times');
                    menuIcon.classList.add('fa-bars');
                }
            });
        }
    });

    // Particle animation
    function createParticle() {
        const particlesContainer = document.querySelector('.particles');
        if (particlesContainer) {
            const particle = document.createElement('div');
            particle.className = 'particle';
            particle.style.left = Math.random() * 100 + '%';
            particle.style.width = Math.random() * 6 + 3 + 'px';
            particle.style.height = particle.style.width;
            particle.style.animationDuration = Math.random() * 6 + 6 + 's';
            particle.style.animationDelay = Math.random() * 2 + 's';
            particlesContainer.appendChild(particle);
            
            setTimeout(() => {
                if (particle.parentNode) {
                    particle.parentNode.removeChild(particle);
                }
            }, 12000);
        }
    }

    // Create particles periodically and initialize some immediately
    setInterval(createParticle, 200);
    
    // Create initial particles
    document.addEventListener('DOMContentLoaded', function() {
        for(let i = 0; i < 10; i++) {
            setTimeout(createParticle, i * 100);
        }
    });

    // Counter animation for stats
    function animateCounters() {
        const counters = document.querySelectorAll('.counter');
        const observerOptions = {
            threshold: 0.7
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const counter = entry.target;
                    const target = parseInt(counter.getAttribute('data-count'));
                    const duration = 2000; // 2 seconds
                    const step = target / (duration / 16); // 60fps
                    let current = 0;

                    const timer = setInterval(() => {
                        current += step;
                        if (current >= target) {
                            counter.textContent = target;
                            clearInterval(timer);
                        } else {
                            counter.textContent = Math.floor(current);
                        }
                    }, 16);

                    observer.unobserve(counter);
                }
            });
        }, observerOptions);

        counters.forEach(counter => {
            observer.observe(counter);
        });
    }

    // Initialize counter animation
    document.addEventListener('DOMContentLoaded', animateCounters);

    // Scroll to top functionality
    document.addEventListener('DOMContentLoaded', function() {
        const scrollToTopBtn = document.getElementById('scroll-to-top');
        
        // Show/hide scroll to top button
        window.addEventListener('scroll', () => {
            if (window.pageYOffset > 300) {
                scrollToTopBtn.style.opacity = '1';
                scrollToTopBtn.style.visibility = 'visible';
            } else {
                scrollToTopBtn.style.opacity = '0';
                scrollToTopBtn.style.visibility = 'invisible';
            }
        });

        // Scroll to top when clicked
        scrollToTopBtn.addEventListener('click', () => {
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        });
    });

    // Fade in animations on scroll
    document.addEventListener('DOMContentLoaded', function() {
        const observerOptions = {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('visible');
                }
            });
        }, observerOptions);

        document.querySelectorAll('.fade-in-up').forEach(el => {
            observer.observe(el);
        });
    });

    // Smooth scrolling for navigation links
    document.addEventListener('DOMContentLoaded', function() {
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', function (e) {
                e.preventDefault();
                const target = document.querySelector(this.getAttribute('href'));
                if (target) {
                    target.scrollIntoView({
                        behavior: 'smooth',
                        block: 'start'
                    });
                }
            });
        });
    });

    // GSAP animations (if you want more advanced animations)
    document.addEventListener('DOMContentLoaded', function() {
        if (typeof gsap !== 'undefined') {
            gsap.from('.hero-text', {
                duration: 1.5,
                y: 100,
                opacity: 0,
                ease: 'power3.out',
                delay: 0.5
            });
            
            gsap.from('.floating-animation', {
                duration: 2,
                scale: 0,
                rotation: 180,
                opacity: 0,
                ease: 'elastic.out(1, 0.5)',
                delay: 1
            });
        }
    });
