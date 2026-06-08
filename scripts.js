/**
 * ООО «Глобал» Уфа — Официальный скрипт корпоративного прототипа
 * Разработано с использованием премиальных фронтенд-анимаций,
 * интерактивного калькулятора, фильтрации и интерактивных микро-эффектов.
 */

document.addEventListener('DOMContentLoaded', () => {
  initMobileMenu();
  initHeaderScroll();
  initCalculator();
  initModals();
  initHeroSparks();
  initConfettiEffect();
  initScrollReveal();
});

/* ==========================================================================
   1. Мобильное навигационное меню (Hamburger)
   ========================================================================== */
function initMobileMenu() {
  const burger = document.getElementById('burger-menu');
  const nav = document.getElementById('main-nav');
  
  if (burger && nav) {
    burger.addEventListener('click', () => {
      burger.classList.toggle('active');
      nav.classList.toggle('active');
      
      // Блокируем скролл страницы при открытом мобильном меню
      document.body.classList.toggle('no-scroll');
    });

    // Закрываем меню при клике по ссылкам
    const navLinks = nav.querySelectorAll('.nav-link');
    navLinks.forEach(link => {
      link.addEventListener('click', () => {
        burger.classList.remove('active');
        nav.classList.remove('active');
        document.body.classList.remove('no-scroll');
      });
    });
  }
}

/* ==========================================================================
   2. Скролл хедера (добавление тени при прокрутке)
   ========================================================================== */
function initHeaderScroll() {
  const header = document.getElementById('header');
  if (header) {
    window.addEventListener('scroll', () => {
      if (window.scrollY > 30) {
        header.classList.add('scrolled');
      } else {
        header.classList.remove('scrolled');
      }
    });
  }
}

/* ==========================================================================
   3. Интерактивный калькулятор фундамента
   ========================================================================== */
function initCalculator() {
  // Вызываем первоначальный расчет
  calculatePrice();
}

window.updateLenLabel = function(val) {
  const lbl = document.getElementById('range-len-lbl');
  if (lbl) lbl.textContent = parseFloat(val).toFixed(1);
  calculatePrice();
};

window.updateQtyLabel = function(val) {
  const lbl = document.getElementById('range-qty-lbl');
  if (lbl) lbl.textContent = parseInt(val);
  calculatePrice();
};

window.calculatePrice = function() {
  const buildingSelect = document.getElementById('calc-building');
  const soilSelect = document.getElementById('calc-soil');
  const slopeSelect = document.getElementById('calc-slope');
  const ogolSelect = document.getElementById('calc-ogol');
  const lenInput = document.getElementById('calc-len');
  const qtyInput = document.getElementById('calc-qty');

  if (!buildingSelect || !qtyInput) return;

  const building = buildingSelect.value;
  const soil = soilSelect ? soilSelect.value : 'loam';
  const slope = slopeSelect ? slopeSelect.value : 'flat';
  const ogol = ogolSelect ? ogolSelect.value : 'yes';
  const len = parseFloat(lenInput ? lenInput.value : 2.5);
  const qty = parseInt(qtyInput.value);

  let basePileName = 'СВС-89';
  let pileDiameterText = 'СВС 89 мм (усиленная)';
  let baseMaterialPrice = 2050;
  let baseInstallPrice = 1400;
  let singlePileCapacity = 3.5; // тонн

  // 1. Определение характеристик свай в зависимости от типа строения
  switch (building) {
    case 'fence':
      basePileName = 'СВС-57';
      pileDiameterText = 'СВС 57 мм (легкая)';
      baseMaterialPrice = 1250;
      baseInstallPrice = 1000;
      singlePileCapacity = 1.2;
      break;
    case 'gazebo':
      basePileName = 'СВС-76';
      pileDiameterText = 'СВС 76 мм (заборы, террасы)';
      baseMaterialPrice = 1650;
      baseInstallPrice = 1200;
      singlePileCapacity = 2.0;
      break;
    case 'frame':
      basePileName = 'СВС-89';
      pileDiameterText = 'СВС 89 мм (усиленная)';
      baseMaterialPrice = 2050;
      baseInstallPrice = 1400;
      singlePileCapacity = 3.5;
      break;
    case 'heavy':
      basePileName = 'СВС-108';
      pileDiameterText = 'СВС 108 мм (коттеджная)';
      baseMaterialPrice = 2450;
      baseInstallPrice = 1600;
      singlePileCapacity = 5.0;
      break;
  }

  // Коррекция на длину (базовая длина свай 2.5м)
  const lengthDiff = len - 2.5;
  // За каждые 0.5 метра длины прибавляем/вычитаем 250 рублей
  const lengthCorrection = (lengthDiff / 0.5) * 250;
  baseMaterialPrice += lengthCorrection;

  // 2. Коррекция на тип грунта
  let soilAlert = '';
  if (soil === 'marsh') {
    // Болото требует удлинения свай
    baseMaterialPrice += 300;
    baseInstallPrice += 200;
  } else if (soil === 'sand') {
    baseInstallPrice += 100;
  }

  // 3. Рельеф (уклон)
  let slopeCorrection = 0;
  if (slope === 'slight') {
    slopeCorrection = 150; // руб на сваю
  } else if (slope === 'steep') {
    slopeCorrection = 350; // руб на сваю
  }

  // 4. Оголовки
  const ogolPrice = (ogol === 'yes') ? 400 : 0;

  // Итоговые цены за одну сваю
  const finalMaterialPerUnit = baseMaterialPrice + ogolPrice;
  const finalInstallPerUnit = baseInstallPrice + slopeCorrection;

  // Суммарные показатели
  const totalMaterial = finalMaterialPerUnit * qty;
  const totalInstall = finalInstallPerUnit * qty;
  const totalPrice = totalMaterial + totalInstall;
  const totalCapacity = singlePileCapacity * qty;

  // Форматирование чисел в рубли
  const formatter = new Intl.NumberFormat('ru-RU', { style: 'currency', currency: 'RUB', maximumFractionDigits: 0 });

  // Обновление интерфейса
  const resultPileType = document.getElementById('result-pile-type');
  const resultCapacity = document.getElementById('result-capacity');
  const resultMaterial = document.getElementById('result-material-cost');
  const resultInstall = document.getElementById('result-install-cost');
  const resultTotal = document.getElementById('result-total-price');

  if (resultPileType) resultPileType.textContent = pileDiameterText;
  if (resultCapacity) resultCapacity.textContent = `до ${totalCapacity.toFixed(1)} тонн`;
  if (resultMaterial) resultMaterial.textContent = formatter.format(totalMaterial);
  if (resultInstall) resultInstall.textContent = formatter.format(totalInstall);
  if (resultTotal) resultTotal.textContent = formatter.format(totalPrice);
};

/* ==========================================================================
   4. Каталог: Фильтрация по диаметру свай
   ========================================================================== */
window.filterCatalog = function(diameter, btnElement) {
  const container = document.getElementById('catalog-products');
  if (!container) return;

  // Смена активного класса у кнопок фильтра
  const filterButtons = document.querySelectorAll('.filter-btn');
  filterButtons.forEach(btn => btn.classList.remove('active'));
  if (btnElement) btnElement.classList.add('active');

  const cards = container.querySelectorAll('.product-card');
  cards.forEach(card => {
    const cardDiameter = card.getAttribute('data-diameter');
    if (diameter === 'all' || cardDiameter === diameter) {
      card.style.display = 'flex';
      card.style.opacity = '0';
      // Плавное появление
      setTimeout(() => {
        card.style.transition = 'opacity 0.4s ease-out';
        card.style.opacity = '1';
      }, 50);
    } else {
      card.style.display = 'none';
    }
  });
};

/* ==========================================================================
   5. Модальные окна (Обратная связь, Заказы)
   ========================================================================== */
function initModals() {
  // Закрытие по нажатию Esc
  window.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      const activeOverlays = document.querySelectorAll('.modal-overlay.active');
      activeOverlays.forEach(overlay => overlay.classList.remove('active'));
      document.body.classList.remove('no-scroll');
    }
  });

  // Закрытие при клике по фону
  const overlays = document.querySelectorAll('.modal-overlay');
  overlays.forEach(overlay => {
    overlay.addEventListener('click', (e) => {
      if (e.target === overlay) {
        overlay.classList.remove('active');
        document.body.classList.remove('no-scroll');
      }
    });
  });
}

window.openModal = function(modalId) {
  const modal = document.getElementById(modalId);
  if (modal) {
    modal.classList.add('active');
    document.body.classList.add('no-scroll');
  }
};

window.closeModal = function(modalId) {
  const modal = document.getElementById(modalId);
  if (modal) {
    modal.classList.remove('active');
    document.body.classList.remove('no-scroll');
  }
};

window.openOrderModal = function(pileName) {
  const pileLabel = document.getElementById('modal-pile-name');
  if (pileLabel) {
    pileLabel.textContent = pileName;
  }
  openModal('order-modal');
};

/* ==========================================================================
   6. Премиальные Canvas эффекты — Искры Лазера (Laser Cutting Sparks)
   ========================================================================== */
function initHeroSparks() {
  const canvas = document.getElementById('hero-sparks');
  if (!canvas) return;

  const ctx = canvas.getContext('2d');
  let width = canvas.offsetWidth;
  let height = canvas.offsetHeight;
  canvas.width = width;
  canvas.height = height;

  const particles = [];
  const maxParticles = 65;

  let mouse = { x: width / 2, y: height / 2, active: false };

  window.addEventListener('resize', () => {
    if (!canvas) return;
    width = canvas.offsetWidth;
    height = canvas.offsetHeight;
    canvas.width = width;
    canvas.height = height;
  });

  // Отслеживаем мышь в пределах контейнера
  const parent = canvas.parentElement;
  parent.addEventListener('mousemove', (e) => {
    const rect = parent.getBoundingClientRect();
    mouse.x = e.clientX - rect.left;
    mouse.y = e.clientY - rect.top;
    mouse.active = true;
  });

  parent.addEventListener('mouseleave', () => {
    mouse.active = false;
  });

  class Spark {
    constructor(x, y, isAuto = false) {
      this.x = x;
      this.y = y;
      // Вектор скорости: искры лазера летят в разные стороны
      const angle = isAuto ? (Math.random() * Math.PI * 2) : (Math.random() * Math.PI * 2);
      const speed = Math.random() * 4 + 1.5;
      
      this.vx = Math.cos(angle) * speed;
      this.vy = Math.sin(angle) * speed - (Math.random() * 1.5); // с небольшим подъемом вверх
      
      this.size = Math.random() * 2.5 + 0.8;
      this.life = 1.0;
      this.decay = Math.random() * 0.02 + 0.01;
      
      // Оранжевый или голубой/белый спектр искры
      const r = Math.random();
      if (r < 0.65) {
        this.color = `rgba(249, 115, 22, ${this.life})`; // Оранжевый
      } else if (r < 0.85) {
        this.color = `rgba(14, 165, 233, ${this.life})`; // Голубой стальной
      } else {
        this.color = `rgba(255, 255, 255, ${this.life})`; // Белый (центр лазерной искры)
      }
    }

    update() {
      this.x += this.vx;
      this.y += this.vy;
      
      // Небольшая гравитация
      this.vy += 0.08;
      
      this.life -= this.decay;
      if (this.color.startsWith('rgba(249, 115, 22')) {
        this.color = `rgba(249, 115, 22, ${Math.max(0, this.life)})`;
      } else if (this.color.startsWith('rgba(14, 165, 233')) {
        this.color = `rgba(14, 165, 233, ${Math.max(0, this.life)})`;
      } else {
        this.color = `rgba(255, 255, 255, ${Math.max(0, this.life)})`;
      }
    }

    draw() {
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
      ctx.fillStyle = this.color;
      ctx.shadowBlur = this.size * 3;
      ctx.shadowColor = this.color;
      ctx.fill();
    }
  }

  function animate() {
    ctx.shadowBlur = 0; // Сброс размытия теней
    ctx.fillStyle = 'rgba(9, 13, 22, 0.25)'; // Затухающий фон
    ctx.fillRect(0, 0, width, height);

    // Добавляем новые искры от мышки или из центра
    if (mouse.active) {
      if (particles.length < maxParticles) {
        particles.push(new Spark(mouse.x, mouse.y, false));
        if (Math.random() < 0.5) particles.push(new Spark(mouse.x, mouse.y, false));
      }
    } else {
      // Авто-генерация искр по центру (имитируем работу лазера)
      if (particles.length < maxParticles / 2 && Math.random() < 0.4) {
        const centerX = width / 2;
        const centerY = height / 2;
        particles.push(new Spark(centerX, centerY, true));
      }
    }

    for (let i = particles.length - 1; i >= 0; i--) {
      particles[i].update();
      if (particles[i].life <= 0) {
        particles.splice(i, 1);
      } else {
        particles[i].draw();
      }
    }

    requestAnimationFrame(animate);
  }

  animate();
}

/* ==========================================================================
   7. Конфетти при успешной отправке лидов (wow-эффект)
   ========================================================================== */
let triggerConfetti = () => {};

function initConfettiEffect() {
  const canvas = document.createElement('canvas');
  canvas.style.position = 'fixed';
  canvas.style.top = '0';
  canvas.style.left = '0';
  canvas.style.width = '100vw';
  canvas.style.height = '100vh';
  canvas.style.pointerEvents = 'none';
  canvas.style.zIndex = '99999';
  document.body.appendChild(canvas);

  const ctx = canvas.getContext('2d');
  let width = window.innerWidth;
  let height = window.innerHeight;
  canvas.width = width;
  canvas.height = height;

  window.addEventListener('resize', () => {
    width = window.innerWidth;
    height = window.innerHeight;
    canvas.width = width;
    canvas.height = height;
  });

  const confettis = [];
  let animationFrameId = null;

  class ConfettiPiece {
    constructor() {
      this.x = Math.random() * width;
      this.y = -20 - Math.random() * 100;
      this.size = Math.random() * 8 + 4;
      this.color = `hsl(${Math.random() * 360}, 90%, 60%)`;
      this.vx = Math.random() * 4 - 2;
      this.vy = Math.random() * 5 + 3;
      this.rotation = Math.random() * 360;
      this.rotationSpeed = Math.random() * 10 - 5;
    }

    update() {
      this.x += this.vx;
      this.y += this.vy;
      this.rotation += this.rotationSpeed;
    }

    draw() {
      ctx.save();
      ctx.translate(this.x, this.y);
      ctx.rotate((this.rotation * Math.PI) / 180);
      ctx.fillStyle = this.color;
      ctx.fillRect(-this.size / 2, -this.size / 2, this.size, this.size);
      ctx.restore();
    }
  }

  function loop() {
    ctx.clearRect(0, 0, width, height);
    let active = false;

    for (let i = confettis.length - 1; i >= 0; i--) {
      confettis[i].update();
      confettis[i].draw();

      if (confettis[i].y > height) {
        confettis.splice(i, 1);
      } else {
        active = true;
      }
    }

    if (active) {
      animationFrameId = requestAnimationFrame(loop);
    } else {
      cancelAnimationFrame(animationFrameId);
      animationFrameId = null;
    }
  }

  triggerConfetti = function() {
    for (let i = 0; i < 80; i++) {
      confettis.push(new ConfettiPiece());
    }
    if (!animationFrameId) {
      loop();
    }
  };
}

/* ==========================================================================
   8. Обработка отправки форм (Lead Capture)
   ========================================================================== */
window.handleFormSubmit = function(event, modalOrFormId) {
  event.preventDefault();

  // Получаем форму
  const form = event.target;
  const submitBtn = form.querySelector('button[type="submit"]');
  const originalText = submitBtn ? submitBtn.innerHTML : 'Отправить';

  if (submitBtn) {
    submitBtn.disabled = true;
    submitBtn.innerHTML = `
      <svg class="spinner" viewBox="0 0 50 50" style="width: 18px; height: 18px; animation: spin 1s linear infinite; display: inline-block; vertical-align: middle; margin-right: 8px;">
        <circle cx="25" cy="25" r="20" fill="none" stroke="currentColor" stroke-width="5" stroke-linecap="round" style="stroke-dasharray: 45, 150;"></circle>
      </svg> Отправка...
    `;
  }

  // Имитируем отправку на бэкенд/WordPress
  setTimeout(() => {
    // Включаем кнопку обратно
    if (submitBtn) {
      submitBtn.disabled = false;
      submitBtn.innerHTML = originalText;
    }

    // Закрываем модальное окно если форма была в нем
    if (modalOrFormId.endsWith('-modal')) {
      closeModal(modalOrFormId);
    }

    // Сбрасываем форму
    form.reset();

    // Запуск праздничного конфетти
    triggerConfetti();

    // Показываем красивое всплывающее уведомление
    showNotification('Заявка успешно отправлена! Мы свяжемся с вами в течение 15 минут.');
  }, 1200);
};

/* ==========================================================================
   9. Всплывающее красивое уведомление (Toast Notification)
   ========================================================================== */
function showNotification(message) {
  const toast = document.createElement('div');
  // Стилизуем всплывающее окно
  toast.style.position = 'fixed';
  toast.style.bottom = '2rem';
  toast.style.right = '2rem';
  toast.style.backgroundColor = 'var(--bg-dark)';
  toast.style.color = 'var(--text-light)';
  toast.style.borderLeft = '4px solid var(--color-orange)';
  toast.style.padding = '1.25rem 2rem';
  toast.style.borderRadius = 'var(--radius-md)';
  toast.style.boxShadow = 'var(--shadow-xl)';
  toast.style.zIndex = '999999';
  toast.style.fontFamily = 'var(--font-heading)';
  toast.style.fontWeight = '700';
  toast.style.fontSize = '0.9rem';
  toast.style.opacity = '0';
  toast.style.transform = 'translateY(20px)';
  toast.style.transition = 'all 0.4s cubic-bezier(0.16, 1, 0.3, 1)';

  toast.innerHTML = `
    <div style="display: flex; align-items: center; gap: 0.75rem;">
      <span style="color: var(--color-orange); font-size: 1.25rem;">✓</span>
      <span>${message}</span>
    </div>
  `;

  document.body.appendChild(toast);

  // Плавный показ
  setTimeout(() => {
    toast.style.opacity = '1';
    toast.style.transform = 'translateY(0)';
  }, 50);

  // Плавное скрытие и удаление через 4 секунды
  setTimeout(() => {
    toast.style.opacity = '0';
    toast.style.transform = 'translateY(20px)';
    setTimeout(() => {
      toast.remove();
    }, 400);
  }, 4000);
}

// Спиннер ключевых фреймов для формы
const styleSheet = document.createElement('style');
styleSheet.innerText = `
  @keyframes spin {
    100% { transform: rotate(360deg); }
  }
`;
document.head.appendChild(styleSheet);

/* ==========================================================================
   10. Плавная анимация прокрутки (Scroll Reveal observer)
   ========================================================================== */
function initScrollReveal() {
  const elementsToReveal = document.querySelectorAll(
    '.service-card, .product-card, .blog-card, .calc-container, .hero-content > *, .about-photo-card, .about-visual, .contact-card, .contacts-info, .section-header > *'
  );

  elementsToReveal.forEach((el) => {
    el.classList.add('scroll-reveal');
    
    // Пытаемся автоматически сопоставить задержку на основе позиции в сетке
    const parent = el.parentElement;
    if (parent && (parent.classList.contains('grid-3') || parent.classList.contains('grid-2') || parent.classList.contains('grid-4') || parent.classList.contains('calc-grid'))) {
      const children = Array.from(parent.children);
      const childIndex = children.indexOf(el);
      if (childIndex > 0 && childIndex < 5) {
        el.classList.add(`reveal-delay-${childIndex}`);
      }
    }
  });

  const observerOptions = {
    root: null,
    rootMargin: '0px',
    threshold: 0.12
  };

  const observer = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  }, observerOptions);

  elementsToReveal.forEach(el => observer.observe(el));
}
