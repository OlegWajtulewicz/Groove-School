// Підключення функціоналу "Чертоги Фрілансера"
import { isMobile } from "./functions.js";
// Підключення списку активних модулів
import { flsModules } from "./modules.js";

import Lenis from 'lenis'
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger.js";
import { Draggable } from "gsap/Draggable.js";
import { ScrollToPlugin } from 'gsap/ScrollToPlugin.js';
gsap.registerPlugin(ScrollTrigger, SplitText, Draggable, ScrollToPlugin);
gsap.registerPlugin(Power4, Elastic);

//========== Lenis-scroll ==============================================================================================================================================
const lenis = new Lenis({
  duration: 1.1,
  easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)), // Функция easing для более естественного движения
  direction: "vertical", // Направление скролла: вертикальное
  gestureDirection: "vertical", // Направление жестов: вертикальное
  smooth: true, // Включаем плавный скролл
  mouseMultiplier: 1, // Уровень чувствительности для мыши
  smoothTouch: false, // Отключаем плавный скролл для сенсорных экранов
  touchMultiplier: 2, // Уровень чувствительности для сенсорных экранов
  infinite: false, // Отключаем бесконечный скролл
});

// Удаление старого скроллбара (если нужно)
const scrollbar = document.querySelectorAll('.c-scrollbar');
if (scrollbar.length > 1) {
  // scrollbar[0].remove(); // Это можно активировать по необходимости
}

// Отслеживаем элементы с атрибутом `data-scroll-speed`
const speedElements = document.querySelectorAll('[data-scroll-speed]');

lenis.on('scroll', (e) => {
  // Обновляем ScrollTrigger
  ScrollTrigger.update();

  // Применяем parallax эффект для элементов
  speedElements.forEach((el) => {
    const speed = parseFloat(el.getAttribute('data-scroll-speed')) || 1;
    const y = window.scrollY * speed;  // Вычисляем на основе прокрутки
    el.style.transform = `translateY(${y}px)`;  // Применяем смещение
  });
});

// Функция для обработки атрибутов скролла
function handleScrollElements() {
  const scrollElements = document.querySelectorAll('[data-scroll]');

  scrollElements.forEach((element) => {
    const speed = parseFloat(element.getAttribute('data-scroll-speed')) || 0;
    const position = element.getAttribute('data-scroll-position') || 'top';
    const offset = element.getAttribute('data-scroll-offset') || '0%';

    // Обработчик скролла
    lenis.on('scroll', () => {
      const scrollY = window.scrollY || window.pageYOffset;
      const elementRect = element.getBoundingClientRect();

      // Прокрутка элемента с учетом speed
      const translateY = scrollY * speed;

      // Устанавливаем позицию элемента в зависимости от data-scroll-position
      if (position === 'bottom') {
        element.style.transform = `translateY(${translateY + parseFloat(offset)}px)`;
      } else {
        element.style.transform = `translateY(${translateY - parseFloat(offset)}px)`;
      }
    });
  });
}

// Инициализация обработки скролла
handleScrollElements();

// Обновляем ScrollTrigger при изменении размера окна
window.addEventListener('resize', () => {
  ScrollTrigger.refresh();
});

function raf(time) {
  const startTime = performance.now();
  lenis.raf(time); // Запускаем анимацию прокрутки
  const endTime = performance.now();
  const elapsedTime = endTime - startTime;

  if (elapsedTime < 16) {
    requestAnimationFrame(raf);
  } else {
    setTimeout(() => {
      requestAnimationFrame(raf);
    }, elapsedTime - 16);
  }
}

requestAnimationFrame(raf); // Инициируем анимацию
ScrollTrigger.refresh(); // Обновляем ScrollTrigger после инициализации

/**
* Custom Scrollbar (Lenis)
*/
function initCustomScrollbar() {
  if (window.innerWidth >= 1024) {
    let scrollbar = document.querySelector('[data-scrollbar]');
    if (!scrollbar) {
      console.error('Scrollbar element not found');
      return;
    }
    
    let thumb = scrollbar.querySelector('[data-scrollbar-thumb]');
    if (!thumb) {
      console.error('Scrollbar thumb not found');
      return;
    }

    let content = document.querySelector('[data-scroll-container]');
    if (!content) {
      console.error('Scroll container not found');
      return;
    }

    let scrollbarHeight = scrollbar.getBoundingClientRect().height;
    let thumbHeight = thumb.getBoundingClientRect().height;
    let contentHeight = content.getBoundingClientRect().height;

    if (document.querySelector('[data-scrollbar-thumb-height="variable"]')) {
      gsap.set(thumb, {
        height: (scrollbarHeight / contentHeight) * scrollbarHeight
      });
      thumbHeight = (scrollbarHeight / contentHeight) * scrollbarHeight;
    }
    

    let scrollTween = gsap.to(thumb, {
      y: scrollbarHeight - thumbHeight,
      ease: "none",
      scrollTrigger: {
        start: '0%',
        end: 'max',
        scrub: true
      }
    });

    Draggable.create(thumb, {
      type: "y",
      bounds: scrollbar,
      inertia: false,
      onDrag() {
          let progress = gsap.utils.normalize(this.minY, this.maxY, this.y);
          
          // Если используете Lenis
          scroll.scrollTo((contentHeight - scrollbarHeight) * progress, {
              immediate: true
          });
  
          // Или если используете стандартный скролл
          // window.scrollTo({ top: (contentHeight - scrollbarHeight) * progress, behavior: 'smooth' });
  
          scrollbar.setAttribute('data-scrollbar-drag', 'true');
      },
      onRelease() {
          let progress = gsap.utils.normalize(this.minY, this.maxY, this.y);
          scrollTween.scrollTrigger.enable();
          scrollTween.progress(progress);
          scrollbar.setAttribute('data-scrollbar-drag', 'false');
      }
  });
  
  }
}

window.onload = function () {
  initCustomScrollbar();
};




//=======  menu - overlay  ========================================================================================================================================================

document.addEventListener("DOMContentLoaded", function ()  {
    let tl = gsap.timeline({paused: true});

    tl.set(".menu-overlay", { 
        clipPath: "polygon(0 0, 100% 0, 100% 0, 0 0)" 
      });

    tl.to(".menu-overlay", {
        duration: .5,
        clipPath: "polygon(0 0, 100% 0, 100% 100%, 0 100%)",
        ease: "power2.out",
    });

    tl.from(".menu-link, .btn", 
        { opacity: 0,
            y: 60,
            stagger: 0.05,
            duration: 0.75,
            ease: "power1.inOut",
        },
        "<",
    );

    tl.to(".menu-divider", 
        {
            duration: 2,
            width: "100%",
            ease: "power4.out",
        },
        "<",
    );

    

    function openMenu() {
        document.querySelector(".menu-overlay").style.pointerEvents = "all";
        tl.play();
    }

    function closeMenu() {
        document.querySelector(".menu-overlay").style.pointerEvents = "none";
        tl.timeScale(1.5);
        tl.reverse();
         
    }

    document.querySelector(".header__menu").addEventListener("click", openMenu);
    document
        .querySelector(".menu-close")
        .addEventListener("click", closeMenu);
        tl.reversed();

        document.querySelectorAll('.col a').forEach(link => {
          link.addEventListener("click", closeMenu);
      });
        
});


//========================================================================================================================================================



/**
* GSAP Split Text
*/
// function initSplitText() {

//     // var splitTextLines = new SplitText(".split-lines", {type: "lines, chars", linesClass: "single-line"});
//     // $('.split-lines .single-line').wrapInner('<div class="single-line-inner">');
  
//     // var splitWordsWrap = new SplitText(".split-words-wrap", {type: "words", wordsClass: "single-word"});
//     // $('.split-words-wrap .single-word').wrapInner('<div class="single-word-inner">');
  
//     var splitWords = new SplitText(".split-words", {type: "words", wordsClass: "single-word"});
//     var splitTextChars = new SplitText(".split-chars", {type: "chars", charsClass: "single-char"});
  
// }
// initSplitText()
//========================================================================================================================================================


/**
* Magnetic Buttons
*/
function initMagneticButtons() {
    
    // Magnetic Buttons
    // Found via: https://codepen.io/tdesero/pen/RmoxQg
    var magnets = document.querySelectorAll('.magnetic');
    var strength = 100;
    
    // START : If screen is bigger as 540 px do magnetic
    if(window.innerWidth > 540){
    // Mouse Reset
    magnets.forEach((magnet) => {
        // Добавляем обработчик события 'mousemove' для перемещения магнита
        magnet.addEventListener('mousemove', moveMagnet);
        // Удаляем класс 'not-active' у родительского элемента
        magnet.parentNode.classList.remove('not-active');
        // Добавляем обработчик события 'mouseleave' для возврата элемента на исходную позицию
        magnet.addEventListener('mouseleave', function(event) {
          gsap.to(event.currentTarget, {
            duration: 1.5,
            x: 0, 
            y: 0, 
            ease: Elastic.easeOut
          });
      
          const btnText = magnet.querySelector('.hello__btn');
          if (btnText) {
            gsap.to(btnText, {
              duration: 1.5,
              x: 0, 
              y: 0, 
              ease: Elastic.easeOut
            });
          }
        });
      });
  
    // Mouse move
    function moveMagnet(event) {
      var magnetButton = event.currentTarget;
      var bounding = magnetButton.getBoundingClientRect();
      var magnetsStrength = magnetButton.getAttribute("data-strength");
      var magnetsStrengthText = magnetButton.getAttribute("data-strength-text");
        
      gsap.to(magnetButton, {
        duration: 1.5,
        x: (((event.clientX - bounding.left) / magnetButton.offsetWidth) - 0.5) * magnetsStrength,
        y: (((event.clientY - bounding.top) / magnetButton.offsetHeight) - 0.5) * magnetsStrength,
        rotate: "0.001deg",
        ease: Power4.easeOut
      });
      gsap.to(magnetButton.querySelector(".btn-text"), {
       // duration: 1.5,
        x: (((event.clientX - bounding.left) / magnetButton.offsetWidth) - 0.5) * magnetsStrengthText,
        y: (((event.clientY - bounding.top) / magnetButton.offsetHeight) - 0.5) * magnetsStrengthText,
        rotate: "0.001deg",
        ease: Power4.easeOut
      });
      gsap.to(magnetButton.querySelector(".btn-text"), {
        x: 0, 
        y: 0, 
        scale: 1,
        rotate: 0,
        duration: 1.5,
        ease: "elastic.out(1, 0.5)"
    });
    }
  
    }; // END : If screen is bigger as 540 px do magnetic
  
// Получаем все кнопки с классом .btn-click.magnetic
document.querySelectorAll('.hello__btn.magnetic').forEach(function(btn) {

    // Mouse Enter (Наведение курсора на элемент)
    btn.addEventListener('mouseenter', function() {
      const btnFill = btn.querySelector('.btn-fill');
      const btnTextInner = btn.querySelector('.btn-text-inner.change');
  
      if (btnFill) {
        gsap.to(btnFill, {
          duration: 0.6,
          startAt: { y: "76%" },
          y: "0%",
          ease: Power2.easeInOut
        });
      }
  
      if (btnTextInner) {
        gsap.to(btnTextInner, {
          duration: 0.3,
          startAt: { color: "#FFFFFF" },
          color: "#ff0000",
          ease: Power3.easeIn,
        });
      }
  
      btn.parentNode.classList.add('not-active');
    });
  
    // Mouse Leave (Уход курсора с элемента)
    btn.addEventListener('mouseleave', function() {
      const btnFill = btn.querySelector('.btn-fill');
      const btnTextInner = btn.querySelector('.btn-text-inner.change');
  
      if (btnFill) {
        gsap.to(btnFill, {
          duration: 0.6,
          y: "-76%",
          ease: Power2.easeInOut
        });
      }
  
      if (btnTextInner) {
        gsap.to(btnTextInner, {
          duration: 0.3,
          color: "#FFFFFF",
          ease: Power3.easeOut,
          delay: 0.3
        });
      }
  
      btn.parentNode.classList.add('not-active');
    });
  });
}  

initMagneticButtons();

// document.addEventListener('load', function() {
//     initMagneticButtons()
    
// }); 

// document.addEventListener('scroll', function() {
//   const scrollPosition = window.scrollY || document.documentElement.scrollTop;
//   const targetElement = document.querySelector('.header__logo'); // Элемент, которому хотите добавить класс

//   if (scrollPosition > 200) {
//       targetElement.classList.add('scrolled');
//   } else {
//       targetElement.classList.remove('scrolled');
//   }
// });

//========================================================================================================================================================
// Добавление/удаление класса hover  при наведении
document.querySelectorAll('.body-supplement__wrapper-image').forEach(function(anchor) {
  anchor.addEventListener('mouseenter', function() {
      this.classList.add('hover');
  });

  anchor.addEventListener('mouseleave', function() {
      this.classList.remove('hover');
  });
});

// Выбираем все элементы с классом .body-supplement__item
const supplementItems = document.querySelectorAll('.body-supplement__item');

supplementItems.forEach(item => {
  const imageWrapper = item.querySelector('.body-supplement__wrapper-image');
  const description = item.querySelector('.body-supplement__descr');

  // Добавляем обработчик события наведения на изображение
  imageWrapper.addEventListener('mouseenter', () => {
    // Добавляем класс accent к описанию текущей карточки
    description.classList.add('accent');
    
    // Добавляем класс no-hover всем остальным карточкам
    supplementItems.forEach(otherItem => {
      if (otherItem !== item) {
        const otherImageWrapper = otherItem.querySelector('.body-supplement__wrapper-image');
        const otherDescription = otherItem.querySelector('.body-supplement__descr');
        
        otherImageWrapper.classList.add('no-hover');
        otherDescription.classList.add('no-hover');
      }
    });
  });

  // Добавляем обработчик события ухода мыши с изображения
  imageWrapper.addEventListener('mouseleave', () => {
    // Удаляем класс accent у описания текущей карточки
    description.classList.remove('accent');
    
    // Удаляем класс no-hover у всех остальных карточек
    supplementItems.forEach(otherItem => {
      const otherImageWrapper = otherItem.querySelector('.body-supplement__wrapper-image');
      const otherDescription = otherItem.querySelector('.body-supplement__descr');
      
      otherImageWrapper.classList.remove('no-hover');
      otherDescription.classList.remove('no-hover');
    });
  });
});

//========================================================================================================================================================
// Получаем блоки
const videoBlock = document.querySelector('.second-block__video');
const supplementBlock = document.querySelector('.supplement');

// Настраиваем ScrollTrigger
ScrollTrigger.create({
    trigger: videoBlock,
    start: 'top 50px', // Срабатывает, когда верх блока достигает 50 пикселей от верхней части окна
    end: '120% top', // Останавливаем прокрутку, когда нижняя часть блока достигает верхней части окна
    pin: true, // Пиннинг блока
   // markers: true, // Включаем маркеры для отладки (можно удалить после)
    
});
