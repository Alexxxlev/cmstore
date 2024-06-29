document.addEventListener('click', e=>{
  if(e.target.classList.contains('js-modal-ajax')) {
    e.preventDefault();
    let srcEl = e.target.dataset.src
    Fancybox.show([
      {
        src: srcEl,
        type: "ajax",
        Carousel: {
          Navigation: false
        },
        hideScrollbar: false,
        Hash: false,
        groupAttr: false,
        autoFocus: false,
      }
    ],
    {
      dragToClose: false,
      on: {
        done: (fancybox) => {
          scrollBlock()
          if(fancybox.container.querySelectorAll('.catalog-body__img-sl:not(.swiper-slide-active)').length) {

          }
          if(fancybox.container.querySelectorAll('.catalog-body__img-sl:not(.swiper-slide-active)').length) {
            const swiperElements = fancybox.container.querySelectorAll('.catalog-body__img-sl:not(.swiper-slide-active)');
            swiperElements.forEach(element => {
              new CustomSwiper(element);
            });
          }
        },
        close: (fancybox) => {
          scrollOn()
        }
      },
    },);
  }
  if(e.target.classList.contains('js-modal-close')) {
    e.preventDefault();
    Fancybox.close();
  }
  if(e.target.classList.contains('js-modal-inline')) {
    e.preventDefault();
    Fancybox.close();
    let srcEl = e.target.dataset.src
    Fancybox.show([
      {
        src: srcEl,
        type: "inline",
        Carousel: {
          Navigation: false
        },
        hideScrollbar: false,
        Hash: false,
        groupAttr: false,
      },
    ],{
        dragToClose: false,
        autoFocus: false,
        on: {
          done: (fancybox) => {
            scrollBlock() 
            if(fancybox.container.querySelectorAll('#remove-all').length) {
              document.addEventListener('click', rem=> {
                if(rem.target.classList.contains('basket__control-mob-link_remove-ok')) {
                  if(document.querySelectorAll('.basket-complect').length) {
                    document.querySelectorAll('.basket-complect').forEach(el=>{
                      el.remove()
                    })
                  }
                  if(document.querySelectorAll('.basket__item').length) {
                    document.querySelectorAll('.basket__item').forEach(el=>{
                      el.remove()
                    })
                  }
                }
              })
            }
            if(fancybox.container.querySelectorAll('#remove').length) {
              document.addEventListener('click', rem=> {
                if(rem.target.classList.contains('basket__control-mob-link_remove-ok')) {
                  rem.preventDefault()
                  if(e.target.closest('.basket-complect')) {
                    e.target.closest('.basket-complect').remove()
                  }
                  if(e.target.closest('.basket__item')) {
                    e.target.closest('.basket__item').remove()
                  }
                  Fancybox.close();
                }
              })
            }
             
            if(fancybox.container.querySelectorAll('#remove-check').length) {
              document.addEventListener('click', rem=> {
                document.addEventListener('click', rem=> {
                  if(rem.target.classList.contains('basket__control-mob-link_remove-ok')) {
                    rem.preventDefault()
                    
                    if(document.querySelectorAll('.basket__checkbox-item input:checked').length) {
                      document.querySelectorAll('.basket__checkbox-item input:checked').forEach(el=>{
                        el.closest('.basket__item').remove()
                      })
                    }

                    if(document.querySelectorAll('.basket-complect__head-check input:checked').length) {
                      document.querySelectorAll('.basket-complect__head-check input:checked').forEach(el=>{
                        el.closest('.basket-complect').remove()
                      })
                    }
                    Fancybox.close();
                    btRemoveAll();
                  }
                })
              })
            }

            if(fancybox.container.querySelectorAll('#map-availability').length && !document.querySelectorAll('ymaps').length) {
              mapsAvailability()
            }
          },
          close: (fancybox) => {
            scrollOn()
            if(e.target.classList.contains('basket__insurance-link')) {
              e.target.classList.remove('_active')
            }
          }
        }
    },);
    setTimeout(() => {
      if(e.target.classList.contains('header-city__link')) {
        modalSticky()
        const input = document.querySelector('.city-search__input');
        if (input) {
          input.blur(); 
        }
        document.querySelector('#city').closest('.fancybox__slide').classList.add('fancy-city')
      }
    }, 300)
    if(e.target.classList.contains('basket__insurance-link')) {
      e.target.classList.add('_active')
      if(document.querySelectorAll('.insurance-foot__button._active').length) {
        let activeButton = document.querySelector('.insurance-foot__button._active')
        activeButton.querySelector('span').textContent = activeButton.dataset.no
        activeButton.querySelector('use').setAttribute('xlink:href', 'img/sprite.svg#icon-plus')
        activeButton.classList.remove('button__border')
        activeButton.classList.remove('_active')
        activeButton.classList.remove('button__border')
        activeButton.classList.remove('_active')
      }
    }
  }
})
Fancybox.bind('.js-gallery', {
    Carousel : {
      infinite: false
    },
    Hash: false,
    Thumbs: false,
    Toolbar: {
  
      display: {
        left: ["infobar"],
        middle: [],
        right: [ "close"],
      },
    },
    Carousel: {
      // Navigation: {
      //   prevTpl:
      //   ' <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none"><path d="M9 18L15 12L9 6" stroke="#0E0E0E" stroke-width="1.5" stroke-linecap="round"/></svg> ',
      // nextTpl:
      //   ' <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none"><path d="M9 18L15 12L9 6" stroke="#0E0E0E" stroke-width="1.5" stroke-linecap="round"/></svg> ',
      // }
    }
    
}); 


const modalSticky = ()=>{
  let fancyboxSlide = document.querySelector('.fancybox__slide');
  
  // Добавляем обработчик события scroll к блоку .fancybox__slide
  fancyboxSlide.addEventListener('scroll', function() {
      let stickyElement = document.querySelector('.city-search__box');
      let stickyPosition = stickyElement.getBoundingClientRect().top;
      // Проверяем, находится ли элемент в застрявшем состоянии
      if (stickyPosition <= 0) {
          stickyElement.classList.add('_sticky')
      } else {
        stickyElement.classList.remove('_sticky')    
      }
  });
}

const scrollBlock = ()=>{
 let scroll = window.pageYOffset
 document.querySelector('body').style.setProperty('--top', `-${scroll}px`);
 document.querySelector('body').classList.add('blockScroll')
}
const scrollOn = ()=>{
  const htmlElement = document.querySelector('body'); // Получаем элемент <html>
  const htmlStyle = window.getComputedStyle(htmlElement); // Получаем вычисленные стили элемента
  const htmlTop = Math.abs(parseInt(htmlStyle.getPropertyValue('--top'))); // Получаем значение свойства top без px и -
  document.querySelector('body').classList.remove('blockScroll')
  document.documentElement.scrollTop = htmlTop
}

document.addEventListener('click', e=>{
  if(e.target.classList.contains('modal-close')) {
    e.preventDefault()
    Fancybox.close();
  }
})