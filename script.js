// --- FORM SUBMISSION LOGIC ---

// Paste your Google Apps Script Web App URL here after deploying (See Instructions)
const googleScriptWebAppURL = "https://script.google.com/macros/s/AKfycby1GAh-a52WLTJiUqKwo_bIJg70q4Qx_udVf7uPiwYDpIPsxqj19zvW0jb94qEa7Bni/exec";

const contactForm = document.getElementById('consultation-form');
const formInputs = document.getElementById('form-inputs');
const formLoading = document.getElementById('form-loading');
const formSuccess = document.getElementById('form-success');
const submitBtn = document.getElementById('submit-btn');

if (contactForm) {
    contactForm.addEventListener('submit', async (e) => {
        e.preventDefault(); // Prevent standard page reload

        // Basic validation check
        if (!contactForm.checkValidity()) {
            contactForm.reportValidity();
            return;
        }

        // Show loading state, hide inputs
        formInputs.style.display = 'none';
        formLoading.style.display = 'block';
        submitBtn.disabled = true;

        // Gather Form Data
        const formData = new FormData(contactForm);
        const dataObj = {};
        formData.forEach((value, key) => {
            // Prettify select option values for email
            if (key === 'goal') {
                const select = document.getElementById('contact-goal');
                dataObj[key] = select.options[select.selectedIndex].text;
            } else {
                dataObj[key] = value;
            }
        });

        try {
            // Send data to Google Script Web App
            // We use 'no-cors' mode because Google web apps don't return standard CORS headers
            await fetch(googleScriptWebAppURL, {
                method: 'POST',
                mode: 'no-cors',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(dataObj)
            });

            // SUCCESS: Standard fetch in no-cors mode won't return status ok/200,
            // but if it didn't throw an error, it sent successfully.
            formLoading.style.display = 'none';
            formSuccess.style.display = 'block';
            contactForm.reset(); // Clear inputs for security

        } catch (error) {
            // ERROR HANDLING
            console.error('Submission Error:', error);
            alert('We apologize, but there was an error sending your request. Please try calling us directly.');

            // Rollback state so they can try again
            formLoading.style.display = 'none';
            formInputs.style.display = 'flex';
            submitBtn.disabled = false;
        }
    });
}

// --- INTERACTIVE UI LOGIC ---

// Sticky Navigation & Mobile Menu
window.addEventListener('scroll', () => {
    const navbar = document.getElementById('navbar');
    if (window.scrollY > 50) navbar.classList.add('scrolled');
    else navbar.classList.remove('scrolled');
});

const menuBtn = document.getElementById('menu-btn');
const navLinks = document.getElementById('nav-links');
if (menuBtn && navLinks) {
    menuBtn.addEventListener('click', () => {
        navLinks.classList.toggle('active');
        menuBtn.classList.replace(navLinks.classList.contains('active') ? 'fa-bars' : 'fa-xmark', navLinks.classList.contains('active') ? 'fa-xmark' : 'fa-bars');
    });
    navLinks.querySelectorAll('a').forEach(link => {
        link.addEventListener('click', () => {
            navLinks.classList.remove('active');
            menuBtn.classList.replace('fa-xmark', 'fa-bars');
        });
    });
}

// Interactive Core Focus (Financial Architects)
const focusData = [
    { icon: "fa-magnifying-glass-chart", title: "Understand Current Position", desc: "We begin by taking a comprehensive look at your complete financial picture. By understanding exactly where you stand today, we can map out the precise steps needed to reach your long-term goals." },
    { icon: "fa-lightbulb", title: "Identify Growth Opportunities", desc: "We analyze your assets and income to find untapped potential. Our goal is to position your finances in a way that maximizes growth while mitigating unnecessary risks." },
    { icon: "fa-chess-knight", title: "Create Personalized Strategies", desc: "We don't believe in one-size-fits-all. You receive a bespoke financial blueprint tailored specifically to your family's unique dynamics and future aspirations." },
    { icon: "fa-chart-line", title: "Build Long-Term Wealth", desc: "Through disciplined planning and education, we guide you on how to steadily grow your assets, ensuring financial independence and stability for the years ahead." },
    { icon: "fa-shield-heart", title: "Protect Your Family", desc: "The foundation of any great financial plan is protection. We implement robust life insurance and security strategies so your loved ones are cared for, no matter what happens." }
];

function updateFocus(index, element) {
    document.querySelectorAll('.focus-item').forEach(item => item.classList.remove('active'));
    element.classList.add('active');

    const display = document.getElementById('focus-display');
    const icon = document.getElementById('focus-icon');
    const title = document.getElementById('focus-title');
    const desc = document.getElementById('focus-desc');

    display.style.animation = 'none';
    display.offsetHeight;
    display.style.animation = 'fadeIn 0.5s ease-in-out';

    icon.className = `fa-solid ${focusData[index].icon}`;
    title.textContent = focusData[index].title;
    desc.textContent = focusData[index].desc;
}

// Customer Journey Click-to-Reveal
let currentStep = 0;
const totalSteps = 4;
const nextStepBtn = document.getElementById('next-step-btn');

if (nextStepBtn) {
    nextStepBtn.addEventListener('click', () => {
        document.getElementById(`j-step-${currentStep}`).classList.remove('active');
        document.querySelectorAll('.progress-dot')[currentStep].classList.remove('active');

        currentStep = (currentStep + 1) % totalSteps;

        document.getElementById(`j-step-${currentStep}`).classList.add('active');
        document.querySelectorAll('.progress-dot')[currentStep].classList.add('active');

        if (currentStep === totalSteps - 1) {
            nextStepBtn.innerHTML = 'Restart Journey <i class="fa-solid fa-rotate-right" style="margin-left: 8px;"></i>';
        } else {
            nextStepBtn.innerHTML = 'Reveal Next Step <i class="fa-solid fa-arrow-right" style="margin-left: 8px;"></i>';
        }
    });
}

// Testimonial Slider
let currentSlide = 0;
const track = document.getElementById('testimonial-track');
const prevBtn = document.getElementById('prev-test');
const nextBtn = document.getElementById('next-test');

if (track && prevBtn && nextBtn) {
    function moveSlider() {
        track.style.transform = `translateX(-${currentSlide * 33.333}%)`;
    }

    nextBtn.addEventListener('click', () => {
        currentSlide = (currentSlide + 1) % 3;
        moveSlider();
    });

    prevBtn.addEventListener('click', () => {
        currentSlide = (currentSlide - 1 + 3) % 3;
        moveSlider();
    });

    setInterval(() => {
        currentSlide = (currentSlide + 1) % 3;
        moveSlider();
    }, 6000);
}
