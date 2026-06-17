/**
 * FitForge — Premium Fitness & Gym Website
 * Complete interactive JavaScript module
 * ES6+ · Intersection Observer · Smooth Animations
 */

document.addEventListener('DOMContentLoaded', () => {

  /* ============================================================
     1. MOBILE NAVIGATION
     ============================================================ */
  const navToggle = document.querySelector('.nav-toggle');
  const navLinks  = document.querySelector('.nav-links');
  const navbar    = document.querySelector('.navbar');

  navToggle?.addEventListener('click', () => {
    navToggle.classList.toggle('active');
    navLinks.classList.toggle('active');
  });

  // Close mobile menu on link click
  navLinks?.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
      navToggle.classList.remove('active');
      navLinks.classList.remove('active');
    });
  });

  // Shrink navbar on scroll
  window.addEventListener('scroll', () => {
    navbar?.classList.toggle('scrolled', window.scrollY > 100);
  });

  /* ============================================================
     2. SMOOTH SCROLLING
     ============================================================ */
  const NAVBAR_HEIGHT = 80;

  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', (e) => {
      const targetId = anchor.getAttribute('href');
      if (targetId === '#') return;
      const target = document.querySelector(targetId);
      if (!target) return;
      e.preventDefault();
      const top = target.getBoundingClientRect().top + window.scrollY - NAVBAR_HEIGHT;
      window.scrollTo({ top, behavior: 'smooth' });
    });
  });

  /* ============================================================
     3. ACTIVE NAV LINK HIGHLIGHTING
     ============================================================ */
  const sections = document.querySelectorAll(
    '#home, #about, #programs, #trainers, #schedule, #bmi, #workout, #pricing, #testimonials, #contact'
  );
  const navItems = document.querySelectorAll('.nav-links a');

  const highlightNav = () => {
    let currentId = '';
    sections.forEach(sec => {
      const top = sec.offsetTop - NAVBAR_HEIGHT - 60;
      if (window.scrollY >= top) currentId = sec.id;
    });
    navItems.forEach(link => {
      link.classList.toggle('active', link.getAttribute('href') === `#${currentId}`);
    });
  };
  window.addEventListener('scroll', highlightNav);

  /* ============================================================
     4. SCROLL ANIMATIONS (Intersection Observer)
     ============================================================ */
  const animObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('animated');
          animObserver.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.15, rootMargin: '-50px' }
  );

  document.querySelectorAll('.animate-on-scroll').forEach(el => animObserver.observe(el));

  /* ============================================================
     5. COUNTER ANIMATION
     ============================================================ */
  const easeOutQuart = (t) => 1 - Math.pow(1 - t, 4);

  const formatNumber = (n) => Math.floor(n).toLocaleString('en-US');

  const animateCounter = (el) => {
    const target   = +el.dataset.target;
    const duration = 2000;
    const start    = performance.now();

    const tick = (now) => {
      const elapsed  = Math.min((now - start) / duration, 1);
      const progress = easeOutQuart(elapsed);
      el.textContent = formatNumber(target * progress) + '+';
      if (elapsed < 1) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  };

  const counterObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          animateCounter(entry.target);
          counterObserver.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.5 }
  );

  document.querySelectorAll('.counter-number').forEach(el => counterObserver.observe(el));

  /* ============================================================
     6. SCHEDULE TABS
     ============================================================ */
  const scheduleTabs = document.querySelectorAll('.schedule-tab');
  const scheduleDays = document.querySelectorAll('.schedule-day');

  scheduleTabs.forEach(tab => {
    tab.addEventListener('click', () => {
      const day = tab.dataset.day;

      scheduleTabs.forEach(t => t.classList.remove('active'));
      scheduleDays.forEach(d => {
        d.classList.remove('active');
        d.style.animation = 'none';
      });

      tab.classList.add('active');
      const target = document.querySelector(`.schedule-day[data-day="${day}"]`);
      if (target) {
        target.classList.add('active');
        // Trigger reflow for fade-in restart
        void target.offsetWidth;
        target.style.animation = 'fadeIn 0.4s ease forwards';
      }
    });
  });

  /* ============================================================
     7. BMI CALCULATOR
     ============================================================ */
  const bmiBtn        = document.getElementById('bmi-calculate');
  const bmiResultArea = document.getElementById('bmi-result-area');
  const bmiValueEl    = document.getElementById('bmi-value');
  const bmiCategoryEl = document.getElementById('bmi-category');
  const bmiFill       = document.getElementById('bmi-gauge-fill');
  const bmiTipsEl     = document.getElementById('bmi-tips');

  const bmiCategories = {
    underweight: { label: 'Underweight', color: '#4E9FFF',
      tip: 'Consider increasing caloric intake with nutrient-dense foods. Consult a nutritionist for a personalized plan.' },
    normal:      { label: 'Normal',      color: '#00FF87',
      tip: 'Great job! Maintain your current lifestyle with regular exercise and balanced nutrition.' },
    overweight:  { label: 'Overweight',  color: '#FFB800',
      tip: 'Try incorporating more cardio and strength training. Focus on whole foods and portion control.' },
    obese:       { label: 'Obese',       color: '#FF4444',
      tip: 'Consult a healthcare provider for a personalized weight management plan. Start with low-impact exercises.' }
  };

  const classifyBMI = (bmi) => {
    if (bmi < 18.5) return 'underweight';
    if (bmi < 25)   return 'normal';
    if (bmi < 30)   return 'overweight';
    return 'obese';
  };

  const bmiToRotation = (bmi) => {
    const clamped = Math.min(Math.max(bmi, 10), 40);
    return ((clamped - 10) / 30) * 180;
  };

  bmiBtn?.addEventListener('click', () => {
    const height = parseFloat(document.getElementById('bmi-height')?.value);
    const weight = parseFloat(document.getElementById('bmi-weight')?.value);

    // Validation
    if (!height || !weight || height <= 0 || weight <= 0) {
      alert('Please enter valid positive numbers for height and weight.');
      return;
    }
    if (height < 50 || height > 300) {
      alert('Please enter a height between 50 and 300 cm.');
      return;
    }
    if (weight < 10 || weight > 500) {
      alert('Please enter a weight between 10 and 500 kg.');
      return;
    }

    const heightM = height / 100;
    const bmi     = weight / (heightM * heightM);
    const key     = classifyBMI(bmi);
    const cat     = bmiCategories[key];
    const rotation = bmiToRotation(bmi);

    bmiValueEl.textContent    = bmi.toFixed(1);
    bmiCategoryEl.textContent = cat.label;
    bmiCategoryEl.style.color = cat.color;
    if (bmiTipsEl) bmiTipsEl.textContent = cat.tip;

    // Animate gauge
    if (bmiFill) {
      bmiFill.style.setProperty('--bmi-rotation', `${rotation}deg`);
      bmiFill.style.transition = 'transform 1s ease-out';
    }

    bmiResultArea?.classList.add('show');
  });

  /* ============================================================
     8. WORKOUT PLAN BUILDER
     ============================================================ */
  const exerciseDB = {
    'lose-weight':       ['Jumping Jacks', 'Burpees', 'Mountain Climbers', 'High Knees', 'Box Jumps',
                          'Kettlebell Swings', 'Battle Ropes', 'Sprint Intervals', 'Jump Rope', 'Cycling'],
    'build-muscle':      ['Bench Press', 'Squats', 'Deadlifts', 'Pull-ups', 'Shoulder Press',
                          'Barbell Rows', 'Lunges', 'Dips', 'Bicep Curls', 'Leg Press'],
    'improve-endurance': ['Running', 'Swimming', 'Cycling', 'Rowing', 'Jump Rope',
                          'Stair Climbing', 'Elliptical', 'Walking Lunges', 'Plank Hold', 'Bear Crawls'],
    'general-fitness':   ['Push-ups', 'Squats', 'Planks', 'Lunges', 'Dumbbell Rows',
                          'Bicycle Crunches', 'Step-ups', 'Resistance Band Pulls', 'Yoga Flow', 'Stretching']
  };

  const repSchemes = {
    beginner:     '3 sets × 10 reps',
    intermediate: '4 sets × 12 reps',
    advanced:     '5 sets × 15 reps'
  };

  const dayNames = { mon: 'Monday', tue: 'Tuesday', wed: 'Wednesday', thu: 'Thursday',
                     fri: 'Friday', sat: 'Saturday', sun: 'Sunday' };

  let wizardData = { goal: '', level: '', days: [] };

  // Option card selection (Steps 1 & 2)
  document.querySelectorAll('.workout-step .option-card').forEach(card => {
    card.addEventListener('click', () => {
      const step = card.closest('.workout-step');
      step.querySelectorAll('.option-card').forEach(c => c.classList.remove('selected'));
      card.classList.add('selected');

      // Enable the corresponding next button
      const nextBtn = step.querySelector('.workout-next');
      if (nextBtn) {
        nextBtn.removeAttribute('disabled');
      }
    });
  });

  // Track checkboxes selection for training days (Step 3)
  const dayCheckboxes = document.querySelectorAll('.day-option input[type="checkbox"]');
  const generatePlanBtn = document.getElementById('generate-plan');

  dayCheckboxes.forEach(cb => {
    cb.addEventListener('change', () => {
      const checkedCount = document.querySelectorAll('.day-option input[type="checkbox"]:checked').length;
      if (generatePlanBtn) {
        if (checkedCount >= 3) {
          generatePlanBtn.removeAttribute('disabled');
        } else {
          generatePlanBtn.setAttribute('disabled', 'true');
        }
      }
    });
  });

  const showStep = (stepNum) => {
    document.querySelectorAll('.workout-step').forEach(s => s.classList.remove('active'));
    const target = document.querySelector(`.workout-step[data-step="${stepNum}"]`);
    if (target) {
      target.classList.add('active');
      target.style.animation = 'none';
      void target.offsetWidth;
      target.style.animation = 'fadeIn 0.4s ease forwards';
    }
    // Update progress indicators
    document.querySelectorAll('.progress-step').forEach(ps => {
      const s = +ps.dataset.step || [...ps.parentElement.children].indexOf(ps) + 1;
      ps.classList.toggle('active', s === stepNum);
      ps.classList.toggle('completed', s < stepNum);
    });
  };

  // Next buttons
  document.querySelectorAll('.workout-next').forEach(btn => {
    btn.addEventListener('click', () => {
      const current = +btn.closest('.workout-step').dataset.step;

      if (current === 1) {
        const selected = btn.closest('.workout-step').querySelector('.option-card.selected');
        if (!selected) { alert('Please select a fitness goal.'); return; }
        wizardData.goal = selected.dataset.value;
      }
      if (current === 2) {
        const selected = btn.closest('.workout-step').querySelector('.option-card.selected');
        if (!selected) { alert('Please select your experience level.'); return; }
        wizardData.level = selected.dataset.value;
      }

      showStep(current + 1);
    });
  });

  // Back buttons
  document.querySelectorAll('.workout-back').forEach(btn => {
    btn.addEventListener('click', () => {
      const current = +btn.closest('.workout-step').dataset.step;
      if (current > 1) showStep(current - 1);
    });
  });

  // Shuffle helper
  const pickRandom = (arr, n) => {
    const shuffled = [...arr].sort(() => 0.5 - Math.random());
    return shuffled.slice(0, n);
  };

  // Generate plan
  document.getElementById('generate-plan')?.addEventListener('click', () => {
    const checkedDays = document.querySelectorAll('.day-option input[type="checkbox"]:checked');
    wizardData.days = [...checkedDays].map(cb => cb.value);

    if (wizardData.days.length < 3) {
      alert('Please select at least 3 days.');
      return;
    }

    const exercises = exerciseDB[wizardData.goal] || exerciseDB['general-fitness'];
    const reps      = repSchemes[wizardData.level] || repSchemes['beginner'];
    const resultEl  = document.getElementById('workout-result');
    if (!resultEl) return;

    let html = '<h3>Your Personalized Plan</h3><div class="day-cards">';
    wizardData.days.forEach(day => {
      const picks = pickRandom(exercises, Math.random() < 0.5 ? 4 : 5);
      html += `<div class="day-card"><h4>${day}</h4><ul>`;
      picks.forEach(ex => { html += `<li>${ex} — <span>${reps}</span></li>`; });
      html += '</ul></div>';
    });
    html += '</div>';

    resultEl.innerHTML = html;
    showStep(4);
  });

  // Restart handler (for both static and dynamic reset buttons)
  const resetWorkout = () => {
    wizardData = { goal: '', level: '', days: [] };
    document.querySelectorAll('.option-card').forEach(c => c.classList.remove('selected'));
    document.querySelectorAll('.day-option input[type="checkbox"]').forEach(cb => (cb.checked = false));

    // Disable next and generate plan buttons
    document.querySelectorAll('.workout-next').forEach(btn => btn.setAttribute('disabled', 'true'));
    if (generatePlanBtn) generatePlanBtn.setAttribute('disabled', 'true');

    const resultEl = document.getElementById('workout-result');
    if (resultEl) resultEl.innerHTML = '';

    showStep(1);
  };

  document.getElementById('workout-restart')?.addEventListener('click', resetWorkout);

  /* ============================================================
     9. PRICING TOGGLE (Monthly ↔ Yearly)
     ============================================================ */
  const pricingToggle = document.querySelector('.pricing-toggle-input');
  const priceAmounts  = document.querySelectorAll('.pricing-amount');
  const pricePeriods  = document.querySelectorAll('.pricing-period');
  const toggleLabels  = document.querySelectorAll('.toggle-label');

  pricingToggle?.addEventListener('change', () => {
    const yearly = pricingToggle.checked;

    toggleLabels.forEach((lbl, i) => {
      lbl.classList.toggle('active', yearly ? i === 1 : i === 0);
    });

    priceAmounts.forEach(el => {
      const value = yearly ? el.dataset.yearly : el.dataset.monthly;
      el.style.transform = 'scale(0.8)';
      el.style.opacity   = '0';
      setTimeout(() => {
        el.textContent     = value;
        el.style.transform = 'scale(1)';
        el.style.opacity   = '1';
      }, 200);
    });

    pricePeriods.forEach(el => {
      el.textContent = yearly ? '/year' : '/month';
    });
  });

  /* ============================================================
     10. TESTIMONIAL CAROUSEL
     ============================================================ */
  const track    = document.querySelector('.testimonial-track');
  const cards    = document.querySelectorAll('.testimonial-card');
  const prevBtn  = document.querySelector('.testimonial-prev');
  const nextBtn  = document.querySelector('.testimonial-next');
  const dotsWrap = document.querySelector('.testimonial-dots');
  let   current  = 0;
  let   autoPlay;

  const goToSlide = (index) => {
    if (!cards.length) return;
    current = ((index % cards.length) + cards.length) % cards.length;
    track.style.transform = `translateX(-${current * 100}%)`;
    dotsWrap?.querySelectorAll('button').forEach((dot, i) => {
      dot.classList.toggle('active', i === current);
    });
  };

  const startAutoPlay = () => { autoPlay = setInterval(() => goToSlide(current + 1), 5000); };
  const stopAutoPlay  = () => clearInterval(autoPlay);

  prevBtn?.addEventListener('click', () => { goToSlide(current - 1); stopAutoPlay(); startAutoPlay(); });
  nextBtn?.addEventListener('click', () => { goToSlide(current + 1); stopAutoPlay(); startAutoPlay(); });

  dotsWrap?.querySelectorAll('button').forEach((dot, i) => {
    dot.addEventListener('click', () => { goToSlide(i); stopAutoPlay(); startAutoPlay(); });
  });

  // Pause on hover
  track?.addEventListener('mouseenter', stopAutoPlay);
  track?.addEventListener('mouseleave', startAutoPlay);

  // Touch / Swipe support
  let touchStartX = 0;
  track?.addEventListener('touchstart', (e) => { touchStartX = e.changedTouches[0].clientX; stopAutoPlay(); }, { passive: true });
  track?.addEventListener('touchend',   (e) => {
    const diff = e.changedTouches[0].clientX - touchStartX;
    if (Math.abs(diff) > 50) goToSlide(current + (diff < 0 ? 1 : -1));
    startAutoPlay();
  }, { passive: true });

  if (cards.length) startAutoPlay();

  /* ============================================================
     11. CONTACT FORM
     ============================================================ */
  const contactForm = document.getElementById('contact-form');

  // Floating-label focus effects
  contactForm?.querySelectorAll('input, textarea, select').forEach(field => {
    field.addEventListener('focus', () => field.parentElement?.classList.add('focused'));
    field.addEventListener('blur',  () => {
      field.parentElement?.classList.remove('focused');
      if (field.value.trim()) field.parentElement?.classList.add('has-value');
      else field.parentElement?.classList.remove('has-value');
    });
  });

  const isValidEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

  contactForm?.addEventListener('submit', (e) => {
    e.preventDefault();

    const name    = document.getElementById('contact-name');
    const email   = document.getElementById('contact-email');
    const message = document.getElementById('contact-message');

    if (!name?.value.trim() || !email?.value.trim() || !message?.value.trim()) {
      alert('Please fill in all required fields.');
      return;
    }
    if (!isValidEmail(email.value.trim())) {
      alert('Please enter a valid email address.');
      return;
    }

    const btn = contactForm.querySelector('button[type="submit"]');
    if (btn) { btn.disabled = true; btn.textContent = 'Sending…'; }

    // Simulate network request
    setTimeout(() => {
      contactForm.reset();
      contactForm.querySelectorAll('.has-value').forEach(el => el.classList.remove('has-value'));
      if (btn) { btn.disabled = false; btn.textContent = 'Send Message'; }

      // Success toast / message
      const toast = document.createElement('div');
      toast.className = 'form-success-message';
      toast.textContent = '✓ Message sent successfully!';
      contactForm.appendChild(toast);
      requestAnimationFrame(() => toast.classList.add('visible'));
      setTimeout(() => { toast.classList.remove('visible'); setTimeout(() => toast.remove(), 400); }, 3000);
    }, 1500);
  });

  /* ============================================================
     12. BACK TO TOP BUTTON
     ============================================================ */
  const topBtn = document.querySelector('.back-to-top');

  window.addEventListener('scroll', () => {
    topBtn?.classList.toggle('visible', window.scrollY > 500);
  });

  topBtn?.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });

  /* ============================================================
     13. PARALLAX EFFECT (Hero section)
     ============================================================ */
  const hero = document.querySelector('#home');

  if (hero) {
    window.addEventListener('scroll', () => {
      const offset = window.scrollY;
      hero.style.backgroundPositionY = `${offset * 0.5}px`;
    });
  }

  /* ============================================================
     14. TYPING EFFECT (Hero)
     ============================================================ */
  const typingEl = document.querySelector('.typing-text');

  if (typingEl) {
    const words     = ['Strength', 'Power', 'Fitness', 'Health', 'Energy'];
    let wordIdx     = 0;
    let charIdx     = 0;
    let isDeleting  = false;

    const TYPE_SPEED   = 80;
    const DELETE_SPEED = 50;
    const HOLD_TIME    = 2000;
    const PAUSE_TIME   = 500;

    const tick = () => {
      const word    = words[wordIdx];
      const display = word.substring(0, charIdx);
      typingEl.textContent = display;

      if (!isDeleting && charIdx < word.length) {
        charIdx++;
        setTimeout(tick, TYPE_SPEED);
      } else if (!isDeleting && charIdx === word.length) {
        // Finished typing — hold
        setTimeout(() => { isDeleting = true; tick(); }, HOLD_TIME);
      } else if (isDeleting && charIdx > 0) {
        charIdx--;
        setTimeout(tick, DELETE_SPEED);
      } else {
        // Finished deleting — next word
        isDeleting = false;
        wordIdx = (wordIdx + 1) % words.length;
        setTimeout(tick, PAUSE_TIME);
      }
    };

    tick();
  }

  /* ============================================================
     15. INJECT KEYFRAME (fadeIn) if not already in CSS
     ============================================================ */
  if (!document.querySelector('#fitforge-keyframes')) {
    const style = document.createElement('style');
    style.id = 'fitforge-keyframes';
    style.textContent = `
      @keyframes fadeIn { from { opacity: 0; transform: translateY(12px); } to { opacity: 1; transform: translateY(0); } }
      .form-success-message { position:absolute;bottom:-48px;left:50%;transform:translateX(-50%);background:#00FF87;color:#111;
        padding:10px 24px;border-radius:8px;font-weight:600;opacity:0;transition:opacity .4s ease; }
      .form-success-message.visible { opacity:1; }
    `;
    document.head.appendChild(style);
  }

}); // end DOMContentLoaded
