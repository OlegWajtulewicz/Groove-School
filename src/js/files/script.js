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
  wheelEventsTarget: document.body,
});

// Удаление старого скроллбара (если нужно)
const scrollbar = document.querySelectorAll('.c-scrollbar');
if (scrollbar.length > 1) {
  // scrollbar[0].remove(); // Это можно активировать по необходимости
}

// Обработчик скролла
lenis.on('scroll', () => {
  // 1. Обновляем ScrollTrigger
  ScrollTrigger.update();

  // 2. Обрабатываем Flickity слайдеры
  $('.flickity-carousel').each(function () {
    const flkty = $(this).data('flickity');
    if (flkty) {
      flkty.resize();  // Вызываем resize только если Flickity инициализирован
    }
  });

  // 3. Обрабатываем элементы с параллакс-эффектом (data-scroll-speed)
  const speedElements = document.querySelectorAll('[data-scroll-speed]');
  speedElements.forEach((el) => {
    const speed = parseFloat(el.getAttribute('data-scroll-speed')) || 1;
    const rect = el.getBoundingClientRect();

    // Проверяем, находится ли элемент в зоне видимости
    if (rect.top < window.innerHeight && rect.bottom > 0) {
      const y = window.scrollY * speed;
      el.style.transform = `translateY(${y}px)`;  // Применяем смещение для параллакса
    }
  });
});

// Функция для обработки атрибутов `data-scroll`
function handleScrollElements() {
  const scrollElements = document.querySelectorAll('[data-scroll]');

  scrollElements.forEach((element) => {
    const speed = parseFloat(element.getAttribute('data-scroll-speed')) || 0;
    const position = element.getAttribute('data-scroll-position') || 'top';
    const offset = parseFloat(element.getAttribute('data-scroll-offset')) || 0;

    lenis.on('scroll', () => {
      const scrollY = window.scrollY || window.pageYOffset;
      const rect = element.getBoundingClientRect();

      const buffer = 150;
      // Проверяем, находится ли элемент в зоне видимости
      if (rect.top < window.innerHeight + buffer && rect.bottom > -buffer) {
        const translateY = scrollY * speed;

        // Устанавливаем позицию элемента в зависимости от data-scroll-position
        if (position === 'bottom') {
          element.style.transform = `translateY(${translateY + offset}px)`;
        } else {
          element.style.transform = `translateY(${translateY - offset}px)`;
        }
      }
    });
  });
}

// Инициализация
handleScrollElements();



// Обновляем ScrollTrigger при изменении размера окна
window.addEventListener('resize', () => {
  ScrollTrigger.refresh();
  lenis.off('scroll');
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

    tl.from(".menu-link, .btn, .social-menu", 
        {   opacity: 0,
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
      document.querySelector(".menu-overlay__back").classList.add("active");
        document.querySelector(".menu-overlay").style.pointerEvents = "all";
        tl.play();
    }

    function closeMenu() {
      document.querySelector(".menu-overlay__back").classList.remove("active");
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
  
    }; // END : Если экран больше 540 px, сделайте магнитный
  
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
          color: "#c300ff",
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

//========  наезд блока ================================================================================================================================================
// Получаем блоки
const videoBlock = document.querySelector('.second-block__video');
//const supplementBlock = document.querySelector('.supplement');

// Настраиваем ScrollTrigger
ScrollTrigger.create({
    trigger: videoBlock,
    start: 'top 50px', // Срабатывает, когда верх блока достигает 50 пикселей от верхней части окна
    end: '120% top', // Останавливаем прокрутку, когда нижняя часть блока достигает верхней части окна
    pin: true, // Пиннинг блока
   // markers: true, // Включаем маркеры для отладки (можно удалить после)
    
});



document.addEventListener('DOMContentLoaded', function () {
  if (document.querySelector('.testimonial-slider__container')) {
      gsap.to('.flickity-carousel', {
          scrollTrigger: {
              trigger: '.testimonial-slider',
              start: "top bottom",
              scrub: 1,
          },
          xPercent: -20,
      });
  }
});






//========================================================================================================================================================
/**
* Marquee on Scroll Direction
*/
function initMarqueeScrollV2() {

  $('[data-marquee-target]').each(function(){

     let marquee = $(this);
     
     let marqueeItemsWidth = marquee.find(".marquee-content").width();
     let marqueeSpeed = marquee.attr('data-marquee-speed') * (marqueeItemsWidth / $(window).width());

     // Speed up Marquee on Tablet & Mobile
     if($(window).width() <= 540){
        marqueeSpeed = marqueeSpeed * 0.25;
     } else if($(window).width() <= 1024){
        marqueeSpeed = marqueeSpeed * 0.5;
     }

     let marqueeDirection = 1;
     let marqueeContent = gsap.to(marquee.find('.marquee-content'), {xPercent: -100, repeat: -1, duration: marqueeSpeed, ease: "linear", paused: true}).totalProgress(0.5);
  
     gsap.set(marquee.find(".marquee-content"), {xPercent: 50});

     ScrollTrigger.create({
        trigger: marquee,
        start: "top bottom",
        end: "bottom top",
        onUpdate(self) {
           if (self.direction !== marqueeDirection) {
              marqueeDirection *= -1;
              if(marquee.attr('data-marquee-direction') == 'right') {
                 gsap.to([marqueeContent], { timeScale: (marqueeDirection * -1), overwrite: true });
              } else {
                 gsap.to([marqueeContent], { timeScale: marqueeDirection, overwrite: true });
              }
           }
           self.direction === -1 ? marquee.attr('data-marquee-status', 'normal') : marquee.attr('data-marquee-status', 'inverted');
        },
        onEnter: () => marqueeContent.play(),
        onEnterBack: () => marqueeContent.play(),
        onLeave: () => marqueeContent.pause(),
        onLeaveBack: () => marqueeContent.pause()
     });

     // Extra speed on scroll
     marquee.each(function () {

        let triggerElement = $(this);
        let targetElement = $(this).find('.marquee-scroll');
        let marqueeScrollSpeed = $(this).attr('data-marquee-scroll-speed');
     
        let tl = gsap.timeline({
           scrollTrigger: {
              trigger: $(this),
              start: "0% 100%",
              end: "100% 0%",
              scrub: 0
           }
        });   

        if(triggerElement.attr('data-marquee-direction') == 'left') {         
           tl.fromTo(targetElement, {
              x: marqueeScrollSpeed + "vw",
           }, {
              x: marqueeScrollSpeed * -1 + "vw",
              ease: "none"
           });
        }

        if(triggerElement.attr('data-marquee-direction') == 'right') {         
           tl.fromTo(targetElement, {
              x: marqueeScrollSpeed * -1 + "vw",
           }, {
              x: marqueeScrollSpeed + "vw",
              ease: "none"
           });
        }
     });
  });
}
initMarqueeScrollV2()

//========================================================================================================================================================
/**
* Flickity Slider
*/

function initScripts() {
  initLoader();
  // Остановка Lenis скролла перед инициализацией Flickity
  if (typeof lenis !== 'undefined') {
      lenis.stop();  // Останавливаем Lenis
  }
  if (typeof lenis !== 'undefined') {
      lenis.start(); // Возобновляем Lenis
  }
}

  // Инициализация после полной загрузки страницы
  window.addEventListener('load', initScripts);
  
  var elem = document.querySelector('.flickity-carousel');
  var flkty = new Flickity( elem, {
    // options
    watchCSS: true,
    contain: true,
    wrapAround: true,
    dragThreshold: 10,
    prevNextButtons: false,
    pageDots: false,
    cellAlign: 'left',
    selectedAttraction: 0.015,
    friction: 0.25,
    percentPosition: true,
    freeScroll: false,
   // adaptiveHeight: true,
    imagesLoaded: true,
});
  
//========================================================================================================================================================







//========================================================================================================================================================
function initLoader() {
  var tl = gsap.timeline();


  tl.call(function() {
    lenis.stop();
 });

    tl.set(".transition", { 
		yPercent: 0,
        scale: 1,
	  });

    tl.set(".transition__screen", {
        y: 0
    });

     tl.set("html", { 
		  cursor: "wait"
	  });

    tl.set(".transition__word", {
        yPercent: 0,  // Оставляем слова на месте
    });

    tl.from(".transition__screen .transition__word-2 .logo__word-2", {
        duration: 1.5,
        yPercent: 160,
        ease: "Expo.easeOut",
        stagger: .066,
    },"<0");

    tl.from(".transition__screen .transition__word-1 .logo__word-1", {
        duration: 1.5,
        yPercent: 160,
        ease: "Expo.easeOut",
        stagger: .066,
    },"<0.3"); 

    tl.to(".transition__screen .transition__word", 
      {   opacity: 1,
          y: 130,
          stagger: .096,
          duration: 0.75,
          ease: "power1.inOut",
         // clearProps: "all",
      },
      "-=0.5",
  );

    tl.to(".transition", {
        duration: 1,
        yPercent: -100,  // Экран поднимается вверх
        ease: "Expo.easeInOut",
        delay: 0.1,  // Небольшая задержка перед уходом экрана
        
    },"-=.5");
      
    tl.set("html", { 
		cursor: "auto"
	},"< -0.3");

  tl.call(function(){ 
    lenis.start(); 
    ScrollTrigger.refresh();
 }, null, 3);	

}

function initTricksWords() {
    
  // Copyright start
  // © Code by T.RICKS, https://www.tricksdesign.com/
  // You have the license to use this code in your projects but not redistribute it to others
  // Tutorial: https://www.youtube.com/watch?v=xiAqTu4l3-g&ab_channel=TimothyRicks

  // Find all text with .tricks class and break each letter into a span
  var spanWord = document.getElementsByClassName("span-lines");
  for (var i = 0; i < spanWord.length; i++) {

  var wordWrap = spanWord.item(i);
  wordWrap.innerHTML = wordWrap.innerHTML.replace(/(^|<\/?[^>]+>|\s+)([^\s<]+)/g, '$1<span class="span-line"><span class="span-line-inner">$2</span></span>');
  }
}  

function initSpanLinesAnimation() {
  if (document.querySelector('.span-lines.animate')) {
    document.querySelectorAll('.span-lines.animate').forEach(function(triggerElement) {
      let targetElements = triggerElement.querySelectorAll('.span-line-inner');

      let tl = gsap.timeline({
        scrollTrigger: {
          trigger: triggerElement,
          toggleActions: 'play none none reset',
          start: "0% 100%",
          end: "100% 0%"
        }
      });

      if (targetElements.length > 0) {
        tl.from(targetElements, {
          y: "100%",
          stagger: 0.01,
          ease: "power3.out",
          duration: 1,
          delay: 0
        });
      }
    });
  }
}

document.addEventListener('DOMContentLoaded', () => {
  initTricksWords();
  initSpanLinesAnimation();
  initLoader();
  initPlayVideoInview();
});

/**
* Play Video Inview
*/
function initPlayVideoInview() {

  let allVideoDivs = gsap.utils.toArray('.playpauze');

  allVideoDivs.forEach((videoDiv, i) => {

    let videoElem = videoDiv.querySelector('video')

    ScrollTrigger.create({
      scroller: document.querySelector('[data-scroll-container]'),
      trigger: videoElem,
      start: '0% 120%',
      end: '100% -20%',
      onEnter: () => videoElem.play(),
      onEnterBack: () => videoElem.play(),
      onLeave: () => videoElem.pause(),
      onLeaveBack: () => videoElem.pause(),
    });

  });
}




