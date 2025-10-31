document.addEventListener('DOMContentLoaded', function() {
    
    const cvSections = document.querySelectorAll('.cv-section');
    cvSections.forEach(section => {
        const header = section.querySelector('.section-header');
        
        section.addEventListener('mouseenter', function() {
            cvSections.forEach(otherSection => {
                if (otherSection !== section) {
                    otherSection.classList.remove('active');
                }
            });
            this.classList.add('active');
        });
        
        header.addEventListener('click', function(e) {
            e.stopPropagation();
            section.classList.toggle('active');
        });
    });
    
    document.addEventListener('click', function(e) {
        if (!e.target.closest('.cv-section')) {
            cvSections.forEach(section => {
                section.classList.remove('active');
            });
        }
    });
    
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape') {
            cvSections.forEach(section => {
                section.classList.remove('active');
            });
        }
    });
    
    const goToTopLink = document.querySelector('.go-to-top');
    if (goToTopLink) {
        goToTopLink.addEventListener('click', function(e) {
            e.preventDefault();
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        });
    }
    
    function animateContentItems() {
        const activeSections = document.querySelectorAll('.cv-section.active');
        
        activeSections.forEach(section => {
            const contentItems = section.querySelectorAll('.section-content > *');
            contentItems.forEach((item, index) => {
                item.style.animationDelay = `${index * 0.1}s`;
            });
        });
    }
    
    const observer = new MutationObserver(animateContentItems);
    cvSections.forEach(section => {
        observer.observe(section, {
            attributes: true,
            attributeFilter: ['class']
        });
    });
    
    function enablePrintView() {
        const printButton = document.createElement('button');
        printButton.textContent = 'Print CV';
        printButton.className = 'btn btn-dark position-fixed';
        printButton.style.cssText = 'bottom: 30px; right: 30px; z-index: 1000; padding: 12px 24px; border-radius: 50px; box-shadow: 0 4px 15px rgba(0,0,0,0.2);';
        
        printButton.addEventListener('click', function() {
            cvSections.forEach(section => {
                section.classList.add('active');
            });
            setTimeout(() => {
                window.print();
            }, 500);
        });
        
        document.body.appendChild(printButton);
    }
    
    enablePrintView();
    function handleScrollAnimation() {
        const scrollPosition = window.scrollY;
        
        cvSections.forEach((section, index) => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.offsetHeight;
            
            if (scrollPosition > sectionTop - window.innerHeight + 100) {
                section.style.opacity = '1';
                section.style.transform = 'translateY(0)';
            }
        });
    }
    
    cvSections.forEach(section => {
        section.style.opacity = '0';
        section.style.transform = 'translateY(30px)';
        section.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
    });
    
    window.addEventListener('scroll', handleScrollAnimation);
    handleScrollAnimation();
    function createRipple(event) {
        const button = event.currentTarget;
        const ripple = document.createElement('span');
        const rect = button.getBoundingClientRect();
        const size = Math.max(rect.width, rect.height);
        const x = event.clientX - rect.left - size / 2;
        const y = event.clientY - rect.top - size / 2;
        
        ripple.style.cssText = `
            position: absolute;
            width: ${size}px;
            height: ${size}px;
            border-radius: 50%;
            background: rgba(255, 255, 255, 0.3);
            left: ${x}px;
            top: ${y}px;
            transform: scale(0);
            animation: ripple 0.6s ease-out;
            pointer-events: none;
        `;
        
        button.style.position = 'relative';
        button.style.overflow = 'hidden';
        button.appendChild(ripple);
        
        setTimeout(() => ripple.remove(), 600);
    }
    
    const style = document.createElement('style');
    style.textContent = `
        @keyframes ripple {
            to {
                transform: scale(4);
                opacity: 0;
            }
        }
    `;
    document.head.appendChild(style);
    
    cvSections.forEach(section => {
        const header = section.querySelector('.section-header');
        header.addEventListener('click', createRipple);
    });
    
    console.log('CV page loaded successfully!');
});