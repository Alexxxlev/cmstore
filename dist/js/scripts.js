const mapsAvailability = ()=>{
    ymaps.ready(() => {
        const createMap = () => {
            const map = new ymaps.Map("map-availability", {
                center: [45.056021, 39.020867], 
                zoom: 10
            });

            return map;
        };

        const map = createMap();

        
        window.addEventListener('resize', () => {
            setTimeout(() => {
                map.container.fitToViewport(map.container.getSize());
            }, 500); 
        });

        function getPanTo(zoomLevel) {
            if (zoomLevel < 10) {
                return .002; 
            } else if (zoomLevel <= 15) {
                return .0075; 
            } else if (zoomLevel >= 15) {
                return .00005; 
            } else {
                return .001; 
            }
        };
        
        // Создаем макет кастомного балуна
        const customBalloonLayout = ymaps.templateLayoutFactory.createClass(
            '<div class="ballon">$[[options.contentLayout]]</div>'
        );

        // Создаем кастомный балун
        const customBalloonContentLayout = ymaps.templateLayoutFactory.createClass(
            '<p>$[properties.balloonContent]</p>'
        );

        const createPlacemark = (address, content, map) => {
            ymaps.geocode(address, {
                boundedBy: [[45.084989, 38.927612], [45.016677, 39.042607]] // Границы Краснодара
            }).then((res) => {
                const firstGeoObject = res.geoObjects.get(0);
                const placemark = new ymaps.Placemark(firstGeoObject.geometry.getCoordinates(), {
                    hintContent: address,
                    balloonHeader: address,
                    balloonContent: content,
                }, {
                    iconLayout: 'default#image',
                    iconImageHref: 'img/icon/pointer.svg', // Путь к кастомной метке
                    iconImageSize: [24, 32], // Размеры кастомной метке
                    iconImageOffset: [-11, -16],
                    balloonLayout: customBalloonLayout,
                    balloonContentLayout: customBalloonContentLayout,
                    balloonPanelMaxMapArea: 0,
                    hideIconOnBalloonOpen: false,
                });
                map.geoObjects.add(placemark);


                // Привязываем событие закрытия балуна к функции
                // placemark.balloon.events.add('close', function () {
                //     // Обходим все метки и изменяем размер и смещение иконок
                //     map.geoObjects.each(function (obj) {
                //         obj.options.set('iconImageSize', [24, 32]);
                //         obj.options.set('iconImageOffset', [-12, -16]);
                //     });
                // });

                placemark.events.add('click', () => {
                    document.querySelectorAll('.availability__li').forEach(item => {
                        item.classList.remove('availability__li_active');
                    });
                
                    const addressElement = [...document.querySelectorAll('.availability__address')].find(element => element.textContent.includes(address));
                    if (addressElement) {
                        addressElement.closest('.availability__li').classList.add('availability__li_active');
                    }
                
                    document.querySelector('.availability__button-bt').classList.remove('_disabled');
                    map.geoObjects.each(function (obj) {
                        obj.options.set('iconImageSize', [24, 32]);
                        obj.options.set('iconImageOffset', [-12, -16]);
                    });
                    placemark.options.set('iconImageSize', [45, 60]);
                    placemark.options.set('iconImageOffset', [-22.5, -60]);
                    const coords = placemark.geometry.getCoordinates();
                    const zoomLevel = map.getZoom()
                    const coordPan = coords[0] - getPanTo(zoomLevel)
                    map.panTo([coordPan, coords[1]], {
                        flying: true,
                        duration: 1000,
                    });
                    placemark.balloon.open();
                });
            });
        };

        // Создаем все метки на карте
        const availabilityItems = document.querySelectorAll('.availability__li');
        availabilityItems.forEach(item => {
            const address = item.querySelector('.availability__address').textContent;
            const content = item.innerHTML
            createPlacemark(address, content, map);
        });

        // Обработчик клика на элементы списка
        availabilityItems.forEach(item => {
            item.addEventListener('click', () => {
                if(document.querySelector('.availability__li_active')) {
                    document.querySelector('.availability__li_active').classList.remove('availability__li_active')
                }
                item.classList.add('availability__li_active')
                document.querySelector('.availability__button-bt').classList.remove('_disabled')
                const address = item.querySelector('.availability__address').textContent;
                map.geoObjects.each(obj => {
                    if (obj.properties.get('hintContent') === address) {
                        map.geoObjects.each(function (objc) {
                            objc.options.set('iconImageSize', [24, 32]);
                            objc.options.set('iconImageOffset', [-12, -16]);
                        });
                        obj.options.set('iconImageSize', [45, 60]);
                        obj.options.set('iconImageOffset', [-22.5, -60]);
                        map.panTo(obj.geometry.getCoordinates(), {
                            flying: true,
                            duration: 1000
                        });
                        obj.balloon.open();
                    }
                });
            });
        });

    });
}
document.addEventListener('click', e=>{
    if(e.target.classList.contains('availability-tabs__link')) {
        e.preventDefault()
        document.querySelectorAll('.availability-tabs__link').forEach(el=>{
            el.classList.remove('_current')
        })
        e.target.classList.add('_current')
        if(e.target.classList.contains('link-map')) {
            document.querySelector('.availability-tabs__box_map').classList.add('_show')
            document.querySelector('.availability-tabs__box_list-box').classList.remove('_show')
        }
        if(e.target.classList.contains('link-list')) {
            document.querySelector('.availability-tabs__box_list-box').classList.add('_show')
            document.querySelector('.availability-tabs__box_map').classList.remove('_show')
        }
    }
})
if(document.querySelectorAll('.basket__counter').length) {
    const blockMinus = el=>{
        if(el.value < 2) {
            el.closest('.basket__counter').querySelector('.basket__counter-bt_minus').classList.add('_disabled')
        }else {
            el.closest('.basket__counter').querySelector('.basket__counter-bt_minus').classList.remove('_disabled')
        }
    }
    document.querySelectorAll('.basket__counter-text').forEach(e=>{
        blockMinus(e)
    })
    document.querySelectorAll('.basket__counter-text').forEach(el=>{
        el.addEventListener('keydown', e=>{
            
             // Разрешаем: backspace, delete, tab, escape, enter и навигационные клавиши
            if (
                [46, 8, 9, 27, 13, 110, 190].indexOf(e.keyCode) !== -1 ||
                // Разрешаем: Ctrl+A, Ctrl+C, Ctrl+V, Ctrl+X
                (e.keyCode === 65 && (e.ctrlKey === true || e.metaKey === true)) ||
                (e.keyCode === 67 && (e.ctrlKey === true || e.metaKey === true)) ||
                (e.keyCode === 86 && (e.ctrlKey === true || e.metaKey === true)) ||
                (e.keyCode === 88 && (e.ctrlKey === true || e.metaKey === true)) ||
                // Разрешаем: home, end, left, right, down, up
                (e.keyCode >= 35 && e.keyCode <= 40)
            ) {
                // ничего не делаем
                return;
            }
            // Убедимся, что это число, и предотвращаем ввод всего остального
            if ((e.shiftKey || (e.keyCode < 48 || e.keyCode > 57)) && (e.keyCode < 96 || e.keyCode > 105)) {
                e.preventDefault();
            }
            blockMinus(e.target)
        })
        // Для поддержания текущего поведения при вставке
        el.addEventListener('input', e => {
            // Удаляем все нецифровые символы
            e.target.value = e.target.value.replace(/\D/g, '');
            // Если значение равно "0", меняем его на "1"
            if (e.target.value === '0') {
                e.target.value = '1';
            }
            if(e.target.value > 3) {
                Fancybox.show([{ src: "#max", type: "inline" }]);
                e.target.value = '3';
            }
            blockMinus(e.target)
        });
        // При потере фокуса, если значение пустое, устанавливаем его в "1"
        el.addEventListener('blur', e => {
            if (e.target.value === '') {
                e.target.value = '1';
            }
            blockMinus(e.target)
        });
    })
    document.addEventListener('click', e=>{
        if(e.target.classList.contains('basket__counter-bt_minus')) {
            e.preventDefault();
            let counterInput = e.target.closest('.basket__counter').querySelector('.basket__counter-text')
            let counterSum = +counterInput.value
            if(counterSum > 1) {
                counterInput.value = --counterSum
            }
            blockMinus(counterInput)
        }
        if(e.target.classList.contains('basket__counter-bt_plus')) {
            e.preventDefault();
            let counterInput = e.target.closest('.basket__counter').querySelector('.basket__counter-text')
            let counterSum = +counterInput.value
            if(counterSum > 2) {
                Fancybox.show([{ src: "#max", type: "inline" }]);
                return false
            }
            counterInput.value = ++counterSum
            blockMinus(counterInput)
        }
    })
}



if(document.querySelectorAll('.basket-recommendation').length) {
    document.querySelectorAll('.basket-recommendation__slider').forEach(slider=>{
        const swiperPopular = new Swiper('.basket-recommendation__slider', {
            slidesPerView: "auto",
            spaceBetween: 8,
            slidesPerGroup: 2,
            grabCursor: true,
            resistanceRatio: .65,
            speed: 400,
            direction: 'horizontal', 
            mousewheel: {
                enabled: true,
                forceToAxis: true,
            },   
            freeMode: true,
            navigation: {
                nextEl: '.swiper-button-next',
                prevEl: '.swiper-button-prev',
            },
            breakpoints: {
                768: {
                    spaceBetween: 16,
                },
                800: {
                    slidesPerGroup: 3,
                },
                920: {
                    slidesPerGroup: 3,
                },
                1024: {
                    slidesPerGroup: 4,
                },
                1230: {
                    slidesPerGroup: 5,
                },
                1440: {
                    spaceBetween: 8,
                    slidesPerGroup: 2,
                }
            }
        });
        slider.addEventListener('wheel', (event) => {
            const deltaX = event.deltaX;
            if (deltaX !== 0) {
                event.preventDefault();
            }
        });
    })
    document.addEventListener('click', e=>{
        if(e.target.classList.contains('basket__recommendation-link')) {
            e.preventDefault();
            e.target.classList.toggle('_active')
            e.target.closest('.basket__item').querySelector('.basket-recommendation').classList.toggle('_hide')
        }
        if(e.target.classList.contains('basket-recommendation__bt')) {
            e.preventDefault();
            e.target.classList.toggle('_active')
            if(e.target.classList.contains('_active')) {
                document.querySelector('.basket-recommendation__ok').classList.add('basket-recommendation__ok_active')
                setTimeout(() => {
                    document.querySelector('.basket-recommendation__ok').classList.remove('basket-recommendation__ok_active')
                }, 5000);
            }
        }
    })
}
if(document.querySelectorAll('.basket__info').length) {
    document.querySelectorAll('.basket__info').forEach(e=>{
        let boxPrice = e.querySelector('.basket__box').cloneNode(true);
        boxPrice.classList.add('_clone');
        e.querySelector('.basket__name').insertAdjacentElement('afterend', boxPrice);
    })
}
document.addEventListener('click', e=>{
    if(e.target.classList.contains('basket__sidebar-sale-link')) {
        e.preventDefault();
        e.target.closest('.basket__sidebar-sale').classList.toggle('_active')
    }
})
if(document.querySelectorAll('.basket__control-open').length) {
    document.addEventListener('click', e=>{
        if(e.target.classList.contains('basket__control-open')) {
            e.preventDefault()
            e.target.closest('.basket__item').classList.add('_active')
        }
        if(e.target.classList.contains('basket__control-mob-bg')|| e.target.classList.contains('basket__control-mob-close')) {
            e.preventDefault()
            document.querySelectorAll('.basket__item').forEach(el=>{
                el.classList.remove('_active')
            })
        }
    })
}

if(document.querySelectorAll('.basket__checkbox').length) {

    const checkboxes = document.querySelectorAll('.basket__item:not(.basket__item_not-available) .basket__checkbox-item input, .basket-complect__head-check input');

    function areAllCheckboxesChecked() {
        return Array.from(checkboxes).every(checkbox => checkbox.checked);
    }

    checkboxes.forEach(checkbox => {
        checkbox.addEventListener('click', () => {
            const allChecked = areAllCheckboxesChecked();
            document.querySelector('.basket__checkbox input').checked = allChecked;
            btRemoveAll()
        });

    });

    document.querySelectorAll('.basket__checkbox .checkbox__input').forEach(check=>{
        check.addEventListener('change', e=>{
            if(e.target.checked) {
                document.querySelectorAll('.basket__checkbox-item, .basket-complect__head-check').forEach(el=>{
                    el.querySelector('input').checked = true
                })
            }
            else {
                document.querySelectorAll('.basket__checkbox-item, .basket-complect__head-check').forEach(el=>{
                    el.querySelector('input').checked = false
                })
            }
            btRemoveAll()
        })
    })

}
const btRemoveAll = ()=>{
    if(document.querySelectorAll('.basket__remove-all').length || document.querySelectorAll('.basket__checkbox-item, .basket-complect__head-check').length) {
        if(document.querySelectorAll('.basket__checkbox-item input:not([disabled]):checked, .basket-complect__head-check input:not([disabled]):checked').length) {
            document.querySelector('.basket__remove-all span').textContent = 'Удалить выбранные'
            document.querySelector('.basket__remove-all').dataset.src = '#remove-check'
            document.querySelectorAll('.basket__sidebar, .basket-menu').forEach(el=>{
                el.classList.remove('_hide')
                el.querySelector('.basket__buy').classList.remove('_disabled')
            })
        }else {
            document.querySelector('.basket__remove-all span').textContent = 'Удалить все'
            document.querySelector('.basket__remove-all').dataset.src = '#remove-all'
            document.querySelectorAll('.basket__sidebar, .basket-menu').forEach(el=>{
                el.classList.add('_hide')
                el.querySelector('.basket__buy').classList.add('_disabled')
            })
        }
    }
}
btRemoveAll()

if(document.querySelectorAll('.basket__sidebar').length) {
    let sideBar = document.querySelector('.basket__sidebar').cloneNode(true);
    sideBar.classList.add('_clone');
    document.querySelector('.basket__wrapper').insertAdjacentElement('beforeend', sideBar);
}
if(document.querySelectorAll('.basket-menu').length && document.querySelectorAll('.footer-small')) {
    document.querySelector('.footer-small').classList.add('bottom')
}

if(document.querySelectorAll('.box-hide').length) {
    const boxHideLinks = document.querySelectorAll('.box-hide__link');

    document.addEventListener('click', event=>{
        if(event.target.classList.contains('box-hide__link')) {
            event.preventDefault();
            const boxHide = event.target.parentNode.previousElementSibling;
            if (boxHide.style.display === 'none') {
                boxHide.style.display = 'block';
                event.target.textContent = event.target.getAttribute('data-hide');
            } else {
                boxHide.style.display = 'none';
                event.target.textContent = event.target.getAttribute('data-vis');
            }
        }
    })
}
if (document.querySelector('.card')) {
    const boxClone = (el, perent) => {
        let clone = document.querySelector(el).cloneNode(true);

        clone.classList.add('_mobile');
        document.querySelector(perent).insertAdjacentElement('beforeend', clone);
    }
    if(document.querySelector('.cart-purchase')) {
        boxClone('.cart-purchase', '.cart-parameter')
    }
    if(document.querySelector('.card__tabs')) {
        boxClone('.card__tabs', '.card-sliders')
    }
    if(document.querySelector('.cart-purchase__complect')) {
        boxClone('.cart-purchase__complect', '.card__preview')
    }

    const visibleContent = (el) => {
        document.querySelectorAll('.header__controll-hide').forEach(e => {
            e.classList.remove('header__controll-hide_active')
        })
        el.closest('.header__controll').querySelector('.header__controll-hide').classList.add('header__controll-hide_active')
        setTimeout(() => {
            el.closest('.header__controll').querySelector('.header__controll-hide').classList.remove('header__controll-hide_active')
        }, 2000);
    }
    document.addEventListener('click', e => {
        if (e.target.classList.contains('card__control-link_favorites')) {
            e.target.classList.toggle('card__control-link_favorites_active')
            if (e.target.classList.contains('card__control-link_favorites_active')) {
                if (!document.querySelectorAll('.header__controll_favorites .header__controll-sum').length) {
                    const sumElement = `<span class="header__controll-sum">1</span>`
                    document.querySelector('.header__controll_favorites').insertAdjacentHTML('beforeend', sumElement)
                    document.querySelector('.header__controll_favorites').classList.add('header__controll-link_active')
                    document.querySelector('.menu-footer__favorites').insertAdjacentHTML('beforeend', sumElement)
                    document.querySelector('.menu-footer__favorites').classList.add('menu-footer__control_active')
                } else {
                    +document.querySelector('.header__controll_favorites .header__controll-sum').textContent++
                        + document.querySelector('.menu-footer__favorites .header__controll-sum').textContent++
                    animationCount(document.querySelectorAll('.header__controll_favorites, .menu-footer__favorites'))
                }
                visibleContent(document.querySelector('.header__controll_favorites'))
            } else {
                if (+document.querySelector('.header__controll_favorites .header__controll-sum').textContent != 1) {
                    +document.querySelector('.header__controll_favorites .header__controll-sum').textContent--
                        + document.querySelector('.menu-footer__favorites .header__controll-sum').textContent--
                    animationCount(document.querySelectorAll('.header__controll_favorites, .menu-footer__favorites'))
                } else {
                    document.querySelector('.header__controll_favorites').classList.remove('header__controll-link_active')
                    document.querySelector('.header__controll_favorites .header__controll-sum').remove()
                    document.querySelector('.menu-footer__favorites .header__controll-sum').remove()
                }
            }
        }
        if (e.target.classList.contains('card__control-link_compare')) {
            e.preventDefault()
            e.target.classList.toggle('card__control-link_compare_active')
            if (e.target.classList.contains('card__control-link_compare_active')) {
                if (!document.querySelectorAll('.header__controll_compare .header__controll-sum').length) {
                    const sumElement = `<span class="header__controll-sum">1</span>`
                    document.querySelector('.header__controll_compare').insertAdjacentHTML('beforeend', sumElement)
                    document.querySelector('.header__controll_compare').classList.add('header__controll-link_active')
                } else {
                    +document.querySelector('.header__controll_compare .header__controll-sum').textContent++
                    animationCount(document.querySelectorAll('.header__controll_compare'))
                }
                visibleContent(document.querySelector('.header__controll_compare'))
            } else {
                if (+document.querySelector('.header__controll_compare .header__controll-sum').textContent != 1) {
                    +document.querySelector('.header__controll_compare .header__controll-sum').textContent--
                    animationCount(document.querySelectorAll('.header__controll_compare'))
                } else {
                    document.querySelector('.header__controll_compare .header__controll-sum').remove()
                    document.querySelector('.header__controll_compare').classList.remove('header__controll-link_active')
                }
            }
        }
        if (e.target.classList.contains('cart-purchase__buy-button')) {

        }
        if (e.target.classList.contains('card__control-link_share')) {
            e.preventDefault()
            e.target.closest('.card__control-link-box').classList.toggle('_active')
            document.documentElement.classList.toggle('head-hide')
        }
        if (e.target.classList.contains('card__control-bg') || e.target.classList.contains('card__control-close')) {
            e.target.closest('.card__control-link-box').classList.remove('_active')
            document.documentElement.classList.remove('head-hide')
        }
        if (!document.querySelector('.card__control-link-box').contains(e.target)) {
            document.querySelector('.card__control-link-box').classList.remove('_active');
            document.documentElement.classList.remove('head-hide')
        }
    })




    const cartPurchaseBuys = document.querySelectorAll('.cart-purchase__buy');
    const cartFixed = document.querySelector('.cart-fixed');

    // Функция, которая будет вызываться при прокрутке
    const handleScroll = () => {
        cartPurchaseBuys.forEach(cartPurchaseBuy => {
            // Получаем положение верхней и нижней границы текущего блока ".cart-purchase__buy"

            const {
                top,
                bottom
            } = cartPurchaseBuy.getBoundingClientRect();
            // Если текущий блок ".cart-purchase__buy" находится в пределах видимости
            if (top != 0 && bottom != 0) {
                if (top < window.innerHeight && bottom > 0) {
                    // Добавляем класс "_show" блоку "cart-fixed"
                    cartFixed.classList.remove('_show');
                } else {
                    // В противном случае удаляем класс "_show" у блока "cart-fixed"
                    cartFixed.classList.add('_show');
                }
            }
        });
    };

    // Добавляем обработчик события прокрутки страницы
    window.addEventListener('scroll', handleScroll);

    if ($('.detail-catalog--mini-slider').length) {
        if(document.querySelectorAll('.card-sliders__thumb-slide').length < 4) {
            document.querySelector('.card-sliders__thumb').classList.add('card-sliders__thumb_small')
        }
        if(document.querySelectorAll('.card-sliders__thumb-slide').length == 1) {
            document.querySelector('.card-sliders__thumb-box').classList.add('card-sliders__thumb-box_hide')
        }
        $(document).ready(function () {
            $(document).find('.detail-catalog--mini-slider').slick({
                vertical: true,
                verticalSwiping: true,
                swipeToSlide: true,
                slidesToShow: 4,
                slidesToScroll: 4,
                centerPadding: true,
                asNavFor: '.detail-catalog--main-slider--content',
                prevArrow: `<button class="slick-prev slick-arrow" aria-label="Prev" type="button" style="">
                                <svg>
                                    <use xlink:href="img/sprite.svg#icon-arrow-slider"></use>
                                </svg>
                            </button>`,
                nextArrow: `<button class="slick-next slick-arrow" aria-label="Next" type="button" style="">
                                <svg>
                                    <use xlink:href="img/sprite.svg#icon-arrow-slider"></use>
                                </svg>
                            </button>`,
                responsive: [{
                    breakpoint: 1440,
                    settings: {
                        vertical: false,
                        verticalSwiping: false,
                    }
                }, ]
            });
            var dcMainSlider = $(document).find('.detail-catalog--main-slider--content').slick({
                slidesToShow: 1,
                slidesToScroll: 1,
                dots: true,
                edgeFriction: 0.01,
                speed: 200,
                touchThreshold: 15,
                asNavFor: $(document).find('.detail-catalog--mini-slider').is("div") ? '.detail-catalog--mini-slider' : '',
                prevArrow: `<button class="slick-prev slick-arrow" aria-label="Prev" type="button" style="">
                                <svg>
                                    <use xlink:href="img/sprite.svg#icon-arrow-slider"></use>
                                </svg>
                            </button>`,
                nextArrow: `<button class="slick-next slick-arrow" aria-label="Next" type="button" style="">
                                <svg>
                                    <use xlink:href="img/sprite.svg#icon-arrow-slider"></use>
                                </svg>
                            </button>`,
            });

            $(document).on("click", ".detail-catalog--mini-slider--item", function () {
                dcMainSlider.slick("slickGoTo", $(this).parent().parent().attr("data-slick-index"))
            })
        })
    }
}
class CustomSwiper {
  constructor(selector) {
    this.swiperContainer = selector; // Store the element directly, not the selector
    this.swiperWrapper = this.swiperContainer.querySelector('.catalog-body__img-sl-wrapper');
    this.swiperPagination = this.swiperContainer.querySelector('.swiper-pagination');
    this.overlayBlock = document.createElement('div');
    this.overlayBlock.className = 'overlay-block';
    this.overlayBlocks = [];

    this.initSwiper();
    this.addOverlayBlocks();
    this.toggleElementsVisibility();
  }

  initSwiper() {
    this.swiper = new Swiper(this.swiperContainer, {
      spaceBetween: 30,
      loop: true,
      pagination: {
        el: this.swiperPagination,
        clickable: true,
      },
    });

    // Добавляем созданный overlayBlock внутрь swiperContainer
    this.swiperContainer.appendChild(this.overlayBlock);
  }

  addOverlayBlocks() {
    const numberOfSlides = this.swiper.slides.length;

    for (let i = 0; i < numberOfSlides; i++) {
      const overlayBlockItem = document.createElement('div');
      overlayBlockItem.className = 'overlay-block-item';
      overlayBlockItem.setAttribute('data-slide-index', i);

      overlayBlockItem.addEventListener('mouseenter', () => {
        const slideIndex = parseInt(overlayBlockItem.getAttribute('data-slide-index'));
        this.swiper.slideTo(slideIndex);
      });

      this.overlayBlocks.push(overlayBlockItem);
      this.overlayBlock.appendChild(overlayBlockItem);
    }
  }

  toggleElementsVisibility() {
    const numberOfSlides = this.swiper.slides.length;

    if (numberOfSlides <= 1) {
      this.swiperPagination.style.display = 'none';
      this.overlayBlock.style.display = 'none';
    }
  }
}
if (document.querySelectorAll('.catalog-body__img-sl').length > 0) {


  // Получаем все элементы с классом .catalog-body__img-sl и создаем экземпляр класса CustomSwiper для каждого из них
  const swiperElements = document.querySelectorAll('.catalog-body__img-sl:not(.swiper-slide-active)');
  swiperElements.forEach(element => {
    new CustomSwiper(element); // Pass the element directly
  });

}
const animationCount = (el)=>{
  el.forEach(e=>{
    e.querySelector('.header__controll-sum').classList.remove('addCount')
    setTimeout(() => {
      e.querySelector('.header__controll-sum').classList.add('addCount')
    }, 100);
  })
}

const visibleContent = (el)=>{
  document.querySelectorAll('.header__controll-hide').forEach(e=>{
    e.classList.remove('header__controll-hide_active')
  })
  el.closest('.header__controll').querySelector('.header__controll-hide').classList.add('header__controll-hide_active')
  setTimeout(() => {
    el.closest('.header__controll').querySelector('.header__controll-hide').classList.remove('header__controll-hide_active')
  }, 2000);
}

const insuranceBasket = ()=>{
  document.querySelectorAll('.cart-purchase__guarantee-link-box').forEach(e=>{
    e.innerHTML = `<p>Товар уже в корзине, добавлять и удалять защиту устройства можно там</p>`
  })
  document.querySelectorAll('.cart-purchase__guarantee-text').forEach(e=>{
    e.innerHTML = `Защитите устройство от&nbsp;повреждений или&nbsp;продлите гарантию с&nbsp;максимальной выгодой`
  })
  document.querySelectorAll('.cart-purchase__guarantee-price').forEach(e=>{
    e.innerHTML = `от 1 800₽`
  })
  document.querySelectorAll('.cart-purchase__guarantee-link-box').forEach(e=>{
    e.innerHTML = `<p>Товар уже в корзине, добавлять и удалять защиту устройства можно там</p>`
  })
  if(document.querySelectorAll('.cart-purchase__buy-insurance').length) {
    document.querySelectorAll('.cart-purchase__buy-insurance').forEach(e=>{
        e.remove()
    })
  }
  if(document.querySelectorAll('.cart-fixed__price-order').length) {
    document.querySelectorAll('.cart-fixed__price-order').forEach(e=>{
        e.remove()
    })
  }
}

document.addEventListener('click', e=>{
  if(e.target.classList.contains('catalog-control__button_list')) {
    e.preventDefault()
    document.querySelector('.catalog-body').classList.add('catalog-body_list')
    document.querySelector('.catalog-control__button_grid').classList.remove('catalog-control__button_active')
    e.target.classList.add('catalog-control__button_active')
  }
  if(e.target.classList.contains('catalog-control__button_grid')) {
    e.preventDefault()
    document.querySelector('.catalog-body').classList.remove('catalog-body_list')
    document.querySelector('.catalog-control__button_list').classList.remove('catalog-control__button_active')
    e.target.classList.add('catalog-control__button_active')
  }
  if(e.target.classList.contains('catalog-body__price-info-icon')) {
    e.target.classList.add('_active')
  }
  if(e.target.classList.contains('catalog-body__price-info-content-bg')
  || e.target.classList.contains('catalog-body__price-info-close')) {
    e.preventDefault()
    e.target.closest('.catalog-body__price-info').querySelector('.catalog-body__price-info-icon').classList.remove('_active')
  }
  if(e.target.classList.contains('catalog-body__favorites')) {
    e.preventDefault()
    e.target.classList.toggle('catalog-body__control-icon_active')
    if(e.target.classList.contains('catalog-body__control-icon_active')) {
      if(!document.querySelectorAll('.header__controll_favorites .header__controll-sum').length) {
        const sumElement = `<span class="header__controll-sum">1</span>`
        document.querySelector('.header__controll_favorites').insertAdjacentHTML('beforeend', sumElement)
        document.querySelector('.header__controll_favorites').classList.add('header__controll-link_active')
        document.querySelector('.menu-footer__favorites').insertAdjacentHTML('beforeend', sumElement)
        document.querySelector('.menu-footer__favorites').classList.add('menu-footer__control_active')
      }else {
        + document.querySelector('.header__controll_favorites .header__controll-sum').textContent ++
        + document.querySelector('.menu-footer__favorites .header__controll-sum').textContent ++
        animationCount(document.querySelectorAll('.header__controll_favorites, .menu-footer__favorites'))
      }
      visibleContent(document.querySelector('.header__controll_favorites'))
    }else {
      if(+ document.querySelector('.header__controll_favorites .header__controll-sum').textContent != 1) {
        + document.querySelector('.header__controll_favorites .header__controll-sum').textContent --
        + document.querySelector('.menu-footer__favorites .header__controll-sum').textContent --
        animationCount(document.querySelectorAll('.header__controll_favorites, .menu-footer__favorites'))
      }else {
        document.querySelector('.header__controll_favorites').classList.remove('header__controll-link_active')
        document.querySelector('.header__controll_favorites .header__controll-sum').remove()
        document.querySelector('.menu-footer__favorites .header__controll-sum').remove()
      } 
    }
  }
  if(e.target.classList.contains('catalog-body__compare')) {
    e.preventDefault()
    e.target.classList.toggle('catalog-body__control-icon_active')
    if(e.target.classList.contains('catalog-body__control-icon_active')) {
      if(!document.querySelectorAll('.header__controll_compare .header__controll-sum').length) {
        const sumElement = `<span class="header__controll-sum">1</span>`
        document.querySelector('.header__controll_compare').insertAdjacentHTML('beforeend', sumElement)
        document.querySelector('.header__controll_compare').classList.add('header__controll-link_active')
      }else {
        + document.querySelector('.header__controll_compare .header__controll-sum').textContent ++
        animationCount(document.querySelectorAll('.header__controll_compare'))
      }
      visibleContent(document.querySelector('.header__controll_compare'))
    }else {
      if(+ document.querySelector('.header__controll_compare .header__controll-sum').textContent != 1) {
        + document.querySelector('.header__controll_compare .header__controll-sum').textContent --
        animationCount(document.querySelectorAll('.header__controll_compare'))
      }else {
        document.querySelector('.header__controll_compare .header__controll-sum').remove()
        document.querySelector('.header__controll_compare').classList.remove('header__controll-link_active')
      } 
    }
  }
  
  if(e.target.classList.contains('catalog-body__basket')) {
    e.preventDefault()
    e.target.classList.toggle('catalog-body__basket_active')
    if(e.target.classList.contains('catalog-body__basket_active')) {
      if(e.target.querySelector('span')) {
        e.target.querySelector('span').textContent = e.target.dataset.ok
      }else {
        e.target.textContent = e.target.dataset.ok
      }
      if(!document.querySelectorAll('.header__controll_basket .header__controll-sum').length) {
        const sumElement = `<span class="header__controll-sum">1</span>`
        document.querySelector('.header__controll_basket').insertAdjacentHTML('beforeend', sumElement)
        document.querySelector('.header__controll_basket').classList.add('header__controll-link_active')
        document.querySelector('.menu-footer__basket').insertAdjacentHTML('beforeend', sumElement)
        document.querySelector('.menu-footer__basket').classList.add('menu-footer__control_active')
      }else {
        + document.querySelector('.header__controll_basket .header__controll-sum').textContent ++
        + document.querySelector('.menu-footer__basket .header__controll-sum').textContent ++
        animationCount(document.querySelectorAll('.menu-footer__basket, .header__controll_basket'))
      }
      visibleContent(document.querySelector('.header__controll_basket'))
      if(document.querySelectorAll('.cart-purchase__guarantee-link-box').length) {
        insuranceBasket()
      }
    }else {
      if(e.target.querySelector('span')) {
        e.target.querySelector('span').textContent = e.target.dataset.no
      }else {
        e.target.textContent = e.target.dataset.no
      }
      if(+ document.querySelector('.header__controll_basket .header__controll-sum').textContent != 1) {
        + document.querySelector('.header__controll_basket .header__controll-sum').textContent --
        + document.querySelector('.menu-footer__basket .header__controll-sum').textContent --
        animationCount(document.querySelectorAll('.menu-footer__basket, .header__controll_basket'))
      }else {
        document.querySelector('.header__controll_basket .header__controll-sum').remove()
        document.querySelector('.menu-footer__basket .header__controll-sum').remove()
        document.querySelector('.header__controll_basket').classList.remove('header__controll-link_active')
      } 
    }
  }
  
  if(e.target.classList.contains('catalog-body__basket-complect')) {
    e.preventDefault()
    document.querySelectorAll('.catalog-body__basket-complect').forEach(el=>{
      el.classList.remove('catalog-body__basket-complect_active')
    })
    e.target.classList.toggle('catalog-body__basket-complect_active')
    if(e.target.classList.contains('catalog-body__basket-complect_active')) {
      if(e.target.querySelector('span')) {
        e.target.querySelector('span').textContent = e.target.dataset.ok
      }else {
        e.target.textContent = e.target.dataset.ok
      }
    }else {
      if(e.target.querySelector('span')) {
        e.target.querySelector('span').textContent = e.target.dataset.no
      }else {
        e.target.textContent = e.target.dataset.no
      }
    }
  }
})

if(document.querySelector('.search-result-output__category-box')) {
  window.addEventListener('resize', () => {
    const categoryBox = document.querySelector('.search-result-output__category-box');
    const boxWidth = categoryBox.getBoundingClientRect().width;
    const linksWidth = Array.from(categoryBox.querySelectorAll('.search-result-output__category-link'))
                        .reduce((totalWidth, link) => totalWidth + link.offsetWidth, 0);
  
    if (boxWidth < linksWidth) {
        const numRows = Math.ceil(linksWidth / boxWidth);
        const numLinksPerRow = Math.ceil(categoryBox.children.length / numRows);
  
        let currentRow = 0;
        let linksInCurrentRow = 0;
        Array.from(categoryBox.children).forEach(link => {
            link.style.order = currentRow;
            linksInCurrentRow++;
            if (linksInCurrentRow === numLinksPerRow) {
                currentRow++;
                linksInCurrentRow = 0;
            }
        });
    }
  });

}
document.addEventListener('click', el=>{
    if(el.target.classList.contains('city-search__clear')) {
        el.target.closest('.city-search__box').querySelector('.city-search__input').value = ''
        el.target.closest('.city-search__box').querySelector('.city-search__input').classList.remove('input-text-val')
        const trackElement = el.target.closest('.fancybox__slide');
        if (trackElement) {
            trackElement.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        }
    }
})

const citySearchInput = document.querySelector('.city-search__input');

    // Проверяем, существует ли элемент с классом .city-search__input
    if (citySearchInput) {
        // Добавляем обработчик события для фокуса
        citySearchInput.addEventListener('focus', function() {
            this.classList.add('input-text-focus');
        });

        // Добавляем обработчик события для потери фокуса
        citySearchInput.addEventListener('blur', function() {
            setTimeout(() => {
                this.classList.remove('input-text-focus');
            }, 300);
        });
    }
if(document.querySelectorAll('.bx-filter').length) {
    let filterTitleIndication = ()=>{
        document.querySelectorAll('.bx-filter-block').forEach(block=>{
            if(block.querySelectorAll('input:checked').length) {
                block.closest('.bx-filter-parameters-box').classList.add('_active')
            }else {
                if(block.closest('.bx-filter-parameters-box')) {
                    block.closest('.bx-filter-parameters-box').classList.remove('_active')
                }
            }
        }) 
    }
    filterTitleIndication() 
    const chips = () => {
        document.querySelectorAll('.catalog-chips').forEach(catalogChips => {
            catalogChips.classList.remove('catalog-chips_active');
            while (catalogChips.firstChild) {
                catalogChips.removeChild(catalogChips.firstChild);
            }
            const close = `<svg><use xlink:href="img/sprite.svg#icon-close"></use></svg>`;
    
            document.querySelectorAll('.bx-filter-block input:checked').forEach(block => {
                const textChecked = block.nextElementSibling.innerHTML;
                const idCheck = block.getAttribute('id');
                const chipsEl = `<a href="#" class="catalog-chips__chip" data-id="${idCheck}">${textChecked}${close}</a>`;
                catalogChips.insertAdjacentHTML('beforeend', chipsEl);
            });
    
            document.querySelectorAll('price-range').forEach(block => {
                if (block.querySelector('.min-price').value != block.querySelector('input[type="range"]').getAttribute('min') ||
                    block.querySelector('.max-price').value != block.querySelector('input[type="range"]').getAttribute('max')) {
                    const titleEl = block.dataset.title;
                    const idCheck = block.getAttribute('id');
                    const chipsEl = `<a href="#" class="catalog-chips__chip-range" data-id="${idCheck}">${titleEl}${close}</a>`;
                    catalogChips.insertAdjacentHTML('beforeend', chipsEl);
                }
            });
            
            if (document.querySelectorAll('.catalog-chips__chip, .catalog-chips__chip-range').length) {
                const remAll = `<a href="#" class="catalog-chips__removeAll">Сбросить всё ${close}</a>`;
                catalogChips.insertAdjacentHTML('beforeend', remAll);
                catalogChips.classList.add('catalog-chips_active');
            }else {
                document.querySelectorAll('.catalog-chips_active').forEach(e=>{
                    e.classList.remove('catalog-chips_active')
                })
                document.querySelectorAll('.catalog-chips__removeAll').forEach(e=>{
                    e.remove()
                })
            }
        });
        let counterFilter = document.querySelectorAll('.catalog-head .catalog-chips__chip-range, .catalog-head .catalog-chips__chip').length
        if(counterFilter) {
            if(document.querySelector('.filter-open__counter')) {
                document.querySelector('.filter-open__counter').remove()
            }
            const counterFilterBox = `<span class="filter-open__counter">${counterFilter}</span>`
            document.querySelector('.filter-open').insertAdjacentHTML('afterbegin', counterFilterBox)
        }else {
            if(document.querySelector('.filter-open__counter')) {
                document.querySelector('.filter-open__counter').remove()
            }
        }
        if(document.querySelectorAll('.filter-chips a').length) {
            document.querySelector('.catalog-filter').classList.add('_chips')
        }else {
            document.querySelector('.catalog-filter').classList.remove('_chips')
        }
    }
    
    chips();

    function show(element, duration) {
        let start = null;
        const initialOpacity = parseFloat(window.getComputedStyle(element).opacity);
    
        function step(timestamp) {
            if (!start) start = timestamp;
            const progress = timestamp - start;
            const opacity = progress / duration;
    
            element.style.opacity = Math.min(opacity + initialOpacity, 1);
    
            if (progress < duration) {
                requestAnimationFrame(step);
            }
        }
    
        requestAnimationFrame(step);
    }
    
    function hide(element, duration) {
        let start = null;
        const initialOpacity = parseFloat(window.getComputedStyle(element).opacity);
    
        function step(timestamp) {
            if (!start) start = timestamp;
            const progress = timestamp - start;
            const opacity = 1 - progress / duration;
    
            element.style.opacity = Math.max(opacity + initialOpacity, 0);
    
            if (progress < duration) {
                requestAnimationFrame(step);
            }
        }
    
        requestAnimationFrame(step);
    }
    

    const rangeClear = (e=>{
        const idRange = e
        const min = document.querySelector(`#${idRange} input[type="range"]`).getAttribute('min')
        const max = document.querySelector(`#${idRange} input[type="range"]`).getAttribute('max')
        document.querySelector(`#${idRange} .min-price`).value = min
        document.querySelector(`#${idRange} .max-price`).value = max
        document.querySelectorAll(`#${idRange} input[type="range"]`)[0].value = min
        document.querySelectorAll(`#${idRange} input[type="range"]`)[1].value = max
        document.querySelector(`#${idRange} .range-container > div`).style.background = `linear-gradient(to right, var(--track-color) 0%, var(--track-highlight-color) 0%, var(--track-highlight-color) 100%, var(--track-color) 100%)`;
    })

    document.querySelector('.smartfilter').addEventListener('change', e=>{
        filterTitleIndication()
        chips()
    })
    document.addEventListener('click', e => {
        if (e.target.classList.contains('filter-button') || e.target.classList.contains('smartfilter__close')) {
            e.preventDefault()
            document.querySelector('.catalog-filter').classList.remove('catalog-filter_active')
            document.documentElement.classList.remove('filter-open-mob')
        }
        if (e.target.classList.contains('filter-open')) {
            e.preventDefault()
            document.querySelector('.catalog-filter').classList.add('catalog-filter_active')
            document.documentElement.classList.add('filter-open-mob')
        }
        if (e.target.classList.contains('linkShowFilter')) {
            e.preventDefault()
            const box = e.target.closest('.bx-filter-block').querySelector('.bx-filter-parameters-box-container')
            ShowCheckbox(box)
        }
        if (e.target.classList.contains('linkHideFilter')) {
            e.preventDefault()
            const box = e.target.closest('.bx-filter-block').querySelector('.bx-filter-parameters-box-container')
            hideCheckbox(box)
        }
        if (e.target.classList.contains('bx-filter-parameters-box-title')) {
            const box = e.target.closest('.bx-filter-parameters-box');
            box.classList.toggle('bx-active');
        }
        if (e.target.classList.contains('btn-reset')) {
            e.target.closest('form').reset()
        }
        if (e.target.classList.contains('catalog-chips__chip-range')) {
            e.preventDefault()
            rangeClear(e.target.dataset.id)
            chips()
        }
        if (e.target.classList.contains('catalog-chips__chip')) {
            e.preventDefault()
            const idCheck = e.target.dataset.id
            e.target.remove()
            document.querySelector(`#${idCheck}`).checked = false
            chips()
            if(document.querySelectorAll('.catalog-chips a').length == 1) {
                document.querySelectorAll('.catalog-chips a').forEach(el=>{
                    el.remove()
                })
                document.querySelectorAll('.catalog-chips').forEach(el=>{
                    el.classList.remove('catalog-chips_active')
                })
                document.querySelector('.catalog-filter').classList.remove('_chips')
            }
        }
        if (e.target.classList.contains('catalog-chips__removeAll')) {
            e.preventDefault()
            document.querySelector('form.smartfilter').reset()
            let catalogChips = document.querySelectorAll('.catalog-chips');
            document.querySelectorAll('price-range').forEach(e=>{
                const idRange = e.getAttribute('id')
                rangeClear(idRange)
            })
            catalogChips.forEach(el=>{
                while (el.firstChild) {
                    el.removeChild(el.firstChild);
                }
            })
            chips()
        }
    });
    
    document.querySelectorAll('.filter-search').forEach(input => {
        input.addEventListener('input', event => {
            let searchText = event.target.value.trim().toLowerCase();
            
            // Получаем блок с фильтрами
            let filterBlock = event.target.closest('.bx-filter-block');
    
            // Получаем все чекбоксы внутри блока
            let checkboxes = filterBlock.querySelectorAll('.bx-filter-param-label');
    
            checkboxes.forEach(checkbox => {
                // Получаем текст чекбокса и приводим его к нижнему регистру для сравнения
                let checkboxText = checkbox.querySelector('.bx-filter-param-text');
                let checkboxTextContent = checkboxText.textContent.trim();
    
                // Получаем содержимое span.text
                let checkboxSubTextContent = checkbox.querySelector('.text').textContent.trim();
    
                // Создаем регулярное выражение для поиска совпадений с текстом поиска
                let regex = new RegExp(searchText, 'ig');
    
                // Заменяем совпадения на текст с тегом <b> только в checkboxSubTextContent
                let replacedSubText = checkboxSubTextContent.replace(regex, match => `<b>${match}</b>`);
    
                // Заменяем содержимое span.text
                checkbox.querySelector('.text').innerHTML = replacedSubText;
    
                // Определяем видимость чекбокса
                checkbox.style.display = checkboxTextContent.toLowerCase().includes(searchText) || checkboxSubTextContent.toLowerCase().includes(searchText) ? 'block' : 'none';
            });
    
            if (searchText) {
                ShowCheckbox(event.target.nextElementSibling);
                event.target.closest('div').querySelector('.linkHideFilter').remove();
            } else {
                hideCheckbox(event.target.nextElementSibling);
            }
        });
    });

    const hideCheckbox = (e)=>{
        if(e.querySelectorAll('.checkbox').length > 5 ){
            e.querySelectorAll('.checkbox').forEach((e,i)=>{
                if(i>4) {
                    e.style.display = 'none'
                }
            })
            if(e.closest('.bx-filter-block').querySelectorAll('.linkHideFilter').length){
                e.closest('.bx-filter-block').querySelector('.linkHideFilter').remove()
            }
            const linkShow = `<a href="#" class="linkShowFilter">
                                Показать все
                                <svg width="24" height="24">
                                    <use xlink:href="img/sprite.svg#icon-arrow-small"></use>
                                </svg>
                            </a>`
            e.insertAdjacentHTML('afterend', linkShow)
        }
    }
    const ShowCheckbox = (e)=>{
        e.querySelectorAll('.checkbox').forEach((e,i)=>{
            e.style.display = 'block'
        })
        e.nextElementSibling.remove()
        const linkHide = `<a href="#" class="linkHideFilter">
                            Свернуть
                            <svg width="24" height="24">
                                <use xlink:href="img/sprite.svg#icon-arrow-small"></use>
                            </svg>
                        </a>`
        e.insertAdjacentHTML('afterend', linkHide)
    }
    document.querySelectorAll('.bx-filter-parameters-box-container').forEach(e=>{
        hideCheckbox(e)
    })

}
document.addEventListener('click', e=>{
    if(e.target.classList.contains('footer__menu-title')) {
        e.target.nextElementSibling.classList.toggle('footer__menu-link-container_active')
        e.target.classList.toggle('footer__menu-title_active')
    }
})
const btnClone = () => {
    let clone = document.querySelector('.footer__button-service').cloneNode(true);

    // Добавляем классы к клонированному узлу
    clone.classList.add('footer__button-service_tablet');
    clone.classList.add('footer__button-service_mobile');

    // Создаем клонированные узлы с нужными классами
    let cloneTablet = clone.cloneNode(true);
    let cloneMobile = clone.cloneNode(true);

    // Удаляем ненужные классы у клонов
    cloneTablet.classList.remove('footer__button-service_mobile');
    cloneMobile.classList.remove('footer__button-service_tablet');

    // Добавляем клонированные узлы на страницу
    document.querySelector('.footer__contacts').insertAdjacentElement('afterend', cloneTablet);
    document.querySelector('.footer__container').insertAdjacentElement('afterbegin', cloneMobile);
}

if(document.querySelector('.footer__button-service')) {
    btnClone();
}
document.addEventListener('click', e=>{
    if(
        e.target.classList.contains('header-city__question-button-close')
        || e.target.classList.contains('header-city__question-close')
        || e.target.classList.contains('header-city__question-bg')
        || e.target.classList.contains('header-city__question-button')
    ) {
        e.preventDefault()
        e.target.closest('.header-city').classList.remove('_active')
        localStorage.setItem('city', '1')
    }
})

if(document.querySelector('.header-city')) {
    if(localStorage.getItem('city') == null) {
        document.querySelector('.header-city').classList.add('_active')
    }
}


document.querySelectorAll('.header-item__remove-bt').forEach(e=>{
    e.addEventListener('click', el=>{
        el.preventDefault()
        el.target.closest('.header-item').remove()
    })
})
document.addEventListener('click',e=>{
    if(e.target.classList.contains('header-phone-menu')) {
        e.preventDefault()
        e.target.classList.toggle('_active')
    }
    if(e.target.classList.contains('header-phone-menu__bg') || e.target.classList.contains('header-phone-menu__close')) {
        e.target.closest('.header-phone-menu').classList.remove('_active')
    }
    if(document.querySelector('.header-phone-menu')) {
        if (!document.querySelector('.header-phone-menu').contains(e.target)) {
            document.querySelector('.header-phone-menu').classList.remove('_active');
        }
    }
})


if(document.querySelector('.header__buyers-link')) {
    const headerBuyers = document.querySelector('.header__buyers');

    
    const buyerLinks = Array.from(headerBuyers.querySelectorAll('.header__buyers-link'));

    
    buyerLinks.forEach(link => {
        link.addEventListener('click', (event) => {
            event.preventDefault(); 
            
            link.classList.toggle('header__buyers-link_active');
        });
    });

    document.addEventListener('click', (event) => {
        
        if (!headerBuyers.contains(event.target) && buyerLinks.some(link => link.classList.contains('header__buyers-link_active'))) {
            buyerLinks.forEach(link => link.classList.remove('header__buyers-link_active'));
        }
    });
}

document.documentElement.setAttribute('style', `--headH: ${document.querySelector('header').clientHeight}px`)
window.addEventListener('resize', e=>{
    document.documentElement.setAttribute('style', `--headH: ${document.querySelector('header').clientHeight}px`)
})

if(document.querySelectorAll('.header__search-input').length) {
    document.querySelector('.header__search-input').addEventListener('focus', e=>{
        e.target.closest('.header__search').classList.add('header__search_focus')
    })
    document.querySelector('.header__search-input').addEventListener('keyup', e=>{
        if(e.target.value) {
            e.target.closest('.header__search').classList.add('header__search_val')
        }else {
            e.target.closest('.header__search').classList.remove('header__search_val')
        }
    })
}
document.addEventListener('click', function(event) {
    if(document.querySelector('.header__search')) {
        const searchContainer = document.querySelector('.header__search');
        const isClickInsideSearch = searchContainer.contains(event.target);
        
        if (!isClickInsideSearch) {
            searchContainer.classList.remove('header__search_val')
            searchContainer.classList.remove('header__search_focus');
        }
    }

    if(event.target.classList.contains('header__search-clear')) {
        event.target.closest('.header__search').querySelector('.header__search-input').value = ''
        event.target.closest('.header__search').classList.remove('header__search_val')
        setTimeout(() => {
            event.target.closest('.header__search').querySelector('.header__search-input').focus()
        }, 100);
    }

    if(event.target.classList.contains('header__search-cancel')) {
        event.target.closest('.header__search').querySelector('.header__search-input').value = ''
        document.querySelector('.header__search-input').classList.remove('input-text-val')
        searchContainer.classList.remove('header__search_val')
        searchContainer.classList.remove('header__search_focus');
        
    }
    if(event.target.classList.contains('search-result__clear-history')) {
        event.preventDefault()
        event.target.closest('.search-result__box').remove()
    }
    if(event.target.classList.contains('search-result__link-remove')) {
        event.preventDefault()
        event.target.closest('.search-result__link').remove()
        if(!document.querySelector('.search-result__box_history').querySelectorAll('.search-result__link').length) {
            document.querySelector('.search-result__box_history').remove()
        }
    }
    if(event.target.classList.contains('search-result__clue-link')) {
        event.preventDefault();
        const textEl = event.target.textContent
        let val = event.target.closest('.header__search').querySelector('.header__search-input').value
        event.target.closest('.header__search').querySelector('.header__search-input').value = val + ' ' + textEl
    }
});
if(document.querySelectorAll('.header__search-input').length) {
    document.addEventListener('DOMContentLoaded', function() {
        const placeholderList = document.querySelectorAll('.header__search-form-placeholder-list li');
        const searchInput = document.querySelector('.header__search-input');
    
        // Функция для пошагового написания текста
        function typeText(text, index = 0) {
            const cursor = '|';
            if (index <= text.length) {
                const placeholderText = text.substring(0, index);
                searchInput.placeholder = placeholderText + cursor;
                setTimeout(function() {
                    typeText(text, index + 1);
                }, 100); // Интервал между появлением символов (в миллисекундах)
            } else {
                // Текст полностью набран, стираем его
                setTimeout(function() {
                    eraseText(text + cursor);
                }, 1000); // Задержка перед стиранием текста (в миллисекундах)
            }
        }
    
        // Функция для стирания текста
        function eraseText(text) {
            if (searchInput.placeholder.length > 0) {
                const placeholderText = text.substring(0, text.length - 1); // Удаляем последний символ (курсор)
                searchInput.placeholder = placeholderText;
                setTimeout(function() {
                    eraseText(placeholderText);
                }, 50); // Интервал между стиранием символов (в миллисекундах)
            } else {
                // Текст полностью стерт, начинаем набор заново
                setTimeout(function() {
                    typeNextPlaceholder();
                }, 500); // Задержка перед началом следующего набора (в миллисекундах)
            }
        }
    
        // Функция для запуска процесса набора текста для следующего placeholder
        function typeNextPlaceholder() {
            const randomIndex = Math.floor(Math.random() * placeholderList.length);
            const randomPlaceholder = placeholderList[randomIndex].textContent.trim();
            typeText(randomPlaceholder);
        }
    
        // Запуск процесса набора текста для первого placeholder
        typeNextPlaceholder();
 
    });
}


document.querySelectorAll('.input-text').forEach(inp=>{
    inp.addEventListener('input', e=>{
        e.target.classList.toggle('input-text-val', e.target.value.length)
    })
})
document.querySelectorAll('.textarea-text').forEach(inp=>{
    inp.addEventListener('input', e=>{
        e.target.classList.toggle('textarea-text-val', e.target.value.length)
    })
})
let insuranceOk = (title, text, price, time = 0)=>{
    document.querySelectorAll('.cart-purchase__guarantee-text').forEach(e=>{
        e.textContent = "Защита добавлена"
    })
    document.querySelectorAll('.cart-purchase__guarantee-price').forEach(e=>{
        let nameInsurance = `${title} <span>${price} ₽</span>`
        e.innerHTML = nameInsurance
    })
    document.querySelectorAll('.cart-purchase__guarantee-link').forEach(e=>{
        e.textContent = "Изменить выбор"
    })
    let removeBT = `<a href="#" class="cart-purchase__guarantee-link-remove">
                        <svg>
                            <use xlink:href="img/sprite.svg#icon-remove"></use>
                        </svg>
                    </a>`
    document.querySelectorAll('.cart-purchase__guarantee-link-box').forEach(e=>{
        e.insertAdjacentHTML('beforeend', removeBT)
    })
    let fixPrice = `<div class="cart-fixed__price-order">
                        1 товар + <a href="#" class="cart-fixed__price-order-link">защита</a>
                        <div class="cart-fixed__price-order-tooltip">
                            <div class="cart-fixed__price-order-tooltip-container">
                                <a href="#" class="cart-fixed__price-order-tooltip-close">
                                <svg width="24" height="24">
                                    <use xlink:href="img/sprite.svg#icon-close"></use>
                                </svg>
                                </a>
                                <p class="cart-fixed__price-order-tooltip-title">${title}</p>
                                <p class="cart-fixed__price-order-tooltip-desc">${text}</p>
                                <div class="cart-fixed__price-order-tooltip-box">
                                    <span>${price} ₽</span>
                                    ${removeBT}
                                </div>
                            </div>
                        </div>
                        <div class="cart-fixed__price-order-tooltip-bg"></div>
                    </div>`
    document.querySelectorAll('.cart-fixed__price-box').forEach(e=>{
        e.insertAdjacentHTML('beforeend', fixPrice)
    })

    let priceText = `<div class="cart-purchase__buy-insurance">
                    <svg width="24" height="24">
                        <use xlink:href="img/sprite.svg#icon-insuranceOk"></use>
                    </svg>
                    <p>Защита устройства ${title}</p>
                 </div>`

    document.querySelectorAll('.cart-purchase__buy-price').forEach(e=>{
        e.insertAdjacentHTML('afterend', priceText)
    })

    if(document.querySelectorAll('.basket__item').length) {
        let link = document.querySelector('.basket__insurance-link._active')
        if(link.closest('.basket__item').querySelectorAll('.basket__insurance').length) {
            link.closest('.basket__item').querySelector('.basket__insurance').remove()
        }
        const boxInsurance = `<div class="basket__insurance">
                                <div class="basket__insurance-box">
                                    <p class="basket__insurance-title">Защита устройства</p>
                                    <p class="basket__insurance-text">Программа страхования от ВСК ${title} (${time})</p>
                                </div>            
                                <div class="basket__insurance-control">
                                    <p class="basket__insurance-price">${price} ₽</p>
                                    <a href="#" class="basket__insurance-remove">
                                        <svg width="24" height="24">
                                            <use xlink:href="img/sprite.svg#icon-remove"></use>
                                        </svg>
                                    </a>
                                </div>            
                              </div>`
        link.closest('.basket__item').insertAdjacentHTML('beforeend', boxInsurance)
        link.classList.add('_hide')
    }
}
let insuranceNo = (link)=>{
    document.querySelectorAll('.cart-purchase__guarantee-text').forEach(e=>{
        e.textContent = "Защитите устройство от повреждений или продлите гарантию с максимальной выгодой"
    })
    document.querySelectorAll('.cart-purchase__guarantee-price').forEach(e=>{
        e.textContent = 'от 1 800₽'
    })
    document.querySelectorAll('.cart-purchase__guarantee-link-box').forEach(e=>{
        e.innerHTML =  `<a href="#" class="cart-purchase__guarantee-link js-modal-inline" data-src="#insurance">
                            Выбрать защиту устройства
                            <svg>
                                <use xlink:href="img/sprite.svg#icon-arrow-left-link"></use>
                            </svg>
                        </a>`
    })
    if(document.querySelectorAll('.cart-purchase__buy-insurance').length) {
        document.querySelectorAll('.cart-purchase__buy-insurance').forEach(e=>{
            e.remove()
        })
    }
    if(document.querySelectorAll('.cart-fixed__price-order').length) {
        document.querySelectorAll('.cart-fixed__price-order').forEach(e=>{
            e.remove()
        })
    }
    if(document.querySelectorAll('.basket__insurance').length) {
        link.closest('.basket__item').querySelector('.basket__insurance-link').classList.remove('_hide')
        link.closest('.basket__insurance').remove()
    }
}
document.addEventListener('click', e=>{
    let {target} = e
    if(target.classList.contains('insurance-min-select__item')) {
        const items = document.querySelectorAll('.insurance-min-select__item');
        const index = Array.from(items).indexOf(target);
        const price = target.querySelector('.insurance-min-select__price span').textContent
        document.querySelector('.insurance-min-tab__button span').textContent = price
        items.forEach(e=>{
            e.classList.remove('_current')
        })
        target.classList.add('_current')
        document.querySelectorAll('.insurance-min-tab').forEach((e,i)=>{
            if(i == index) {
                e.style.display = 'block'
                e.classList.add('_current')
            }else {
                e.style.display = 'none'
                e.classList.remove('_current')
            }
        })
    }
    if(target.classList.contains('insurance-foot__select')) {
        e.preventDefault();
        let price = +target.dataset.price
        target.closest('.insurance-foot__list').querySelector('._current').classList.remove('_current')
        target.classList.add('_current')
        if(target.closest('.item').querySelector('.insurance-foot__price span')) {
            target.closest('.item').querySelector('.insurance-foot__price span').textContent = price.toLocaleString("ru-RU")
        }else {
            document.querySelector('.insurance-min-tab__button span').textContent = price.toLocaleString("ru-RU")
        }
    }
    if(target.classList.contains('cart-purchase__guarantee-link-remove')) {
        e.preventDefault();
        insuranceNo(e.target)
    }
    if(target.classList.contains('insurance-min-tab__button')) {
        e.preventDefault();
        target.classList.toggle('_active')
        console.log(23)
        let price = target.querySelector('span').textContent
        let name = document.querySelector('.insurance-min-select__item._current .insurance-min-select__title').textContent
        let text = document.querySelector('.insurance-min-select__item._current .insurance-min-select__desc').textContent
        let time = target.closest('.modal__insurance-content_mobile').querySelector('.item._current .insurance-foot__select._current').textContent
        insuranceOk(name, text, price, time)
    }
    if(target.classList.contains('cart-fixed__price-order-link')) {
        e.preventDefault();
        target.closest('.cart-fixed__price-order').classList.toggle('_active')
        document.documentElement.classList.toggle('head-hide-fix')
    }
    if(target.classList.contains('cart-fixed__price-order-tooltip-close')|| target.classList.contains('cart-fixed__price-order-tooltip-bg')) {
        e.preventDefault();
        target.closest('.cart-fixed__price-order').classList.remove('_active')
        document.documentElement.classList.remove('head-hide-fix')
    }
    if(target.classList.contains('insurance-foot__button')) {
        e.preventDefault();
        if(document.querySelectorAll('.insurance-foot__button._active').length && !target.classList.contains('_active')) {
            let activeButton = document.querySelector('.insurance-foot__button._active')
            activeButton.querySelector('span').textContent = target.dataset.no
            activeButton.querySelector('use').setAttribute('xlink:href', 'img/sprite.svg#icon-plus')
            activeButton.classList.remove('button__border')
            activeButton.classList.remove('_active')
        }
        target.classList.toggle('_active')
        target.classList.toggle('button__border')

        if(target.classList.contains('_active')) {
            target.querySelector('span').textContent = target.dataset.ok
            target.querySelector('use').setAttribute('xlink:href', 'img/sprite.svg#icon-check-insurance')
            let price = target.closest('.insurance-foot__price-box').querySelector('.insurance-foot__price span').textContent
            let name = target.closest('.item').querySelector('.insurance-offers__title').textContent
            let text = target.closest('.item').querySelector('.insurance-offers__desc').textContent
            let time = target.closest('.item').querySelector('.insurance-foot__select._current').textContent
            insuranceOk(name, text, price, time)
        }else {
            insuranceNo(e.target)
            target.querySelector('span').textContent = target.dataset.no
            target.querySelector('use').setAttribute('xlink:href', 'img/sprite.svg#icon-plus')
        }
    }
    if(e.target.classList.contains('basket__insurance-remove')) {
        e.preventDefault()
        insuranceNo(e.target)
    }
})
if(document.querySelectorAll('.js-mask').length) {
  document.querySelectorAll('.js-mask').forEach(e=>{
    IMask(e,{
      mask: '+{7}(000)000-00-00'
    })
  })
}

if(document.querySelectorAll('.menu').length) {

    document.querySelectorAll('.menu-category__link').forEach(e=>{
        e.addEventListener('mouseenter', item=>{
            document.querySelectorAll('.menu-category__link_current').forEach(e=>{
                e.classList.remove('menu-category__link_current')
            })
            document.querySelectorAll('.menu-catalog').forEach(e=>{
                e.classList.remove('menu-catalog_active')
            })
            item.target.classList.add('menu-category__link_current')
            const idContent = item.target.dataset.link
            if(document.querySelectorAll(`#${idContent}`).length) {
                document.querySelector(`#${idContent}`).classList.add('menu-catalog_active')
            }
            if(!mobileWidthMediaQuery.matches) {
                sizeMobile(mobileWidthMediaQuery.matches)
                msnry.reloadItems();
                msnry.layout();
            }
        })
        e.addEventListener('click', item=>{
            item.preventDefault()
            const idContent = item.target.dataset.link
            if(document.querySelectorAll(`#${idContent}`).length) {
                document.querySelector(`#${idContent}`).classList.add('menu-catalog_active')
            }
        })
    })
    
    document.querySelectorAll('.menu-catalog__link_title').forEach(e=>{
        const nameGroup = e.textContent
        const hrefGroup = e.getAttribute('href')
        const linkGroup = `<a href="${hrefGroup}" class="menu-catalog__link-name">${nameGroup}</a>`
        if(e.closest('.menu-catalog__li').querySelectorAll('.menu-catalog__content').length) {
            e.nextElementSibling.insertAdjacentHTML('afterbegin', linkGroup)
        }
        e.addEventListener('click', item=>{
            if(window.matchMedia("(max-width: 1023px)").matches) {
                item.preventDefault()
                
                if(document.querySelectorAll('.menu-catalog__content_active').length) {
                    document.querySelector('.menu-catalog__content_active').classList.remove('menu-catalog__content_active')
                }
                item.target.nextElementSibling.classList.add('menu-catalog__content_active')
                item.target.closest('.menu-catalog').classList.add('_hide')
            }
        })
    })
    document.querySelectorAll('.menu-catalog__li_all').forEach(e => {
        let box = `<div class="menu-catalog__content menu-catalog__content_all" data-title="Все товары из категории"></div>`;
        e.insertAdjacentHTML('beforeend', box);
    
        let menuCatalogList = e.closest('.menu-catalog__list');
    
        let contentsToCopy = menuCatalogList.querySelectorAll('.menu-catalog__content:not(.menu-catalog__content_all)');
    
        let copyMenuCatalogContent = e.querySelector('.menu-catalog__content_all');
    
        contentsToCopy.forEach(item => {
            copyMenuCatalogContent.innerHTML += item.innerHTML;
        });
    });
    
    document.querySelectorAll('.menu-catalog__content, .menu-catalog').forEach(e=>{
        let back = `<a href="#" class="menu-catalog__back">Назад</a>`
        e.insertAdjacentHTML('afterbegin', back);
    })
    
    document.querySelectorAll('.menu-catalog__back').forEach(e=>{
        e.addEventListener('click', back=>{
            back.preventDefault()
            document.querySelectorAll('.menu-catalog').forEach(e=>{
                e.classList.remove('_hide')
            })
            if (back.target.closest('.menu-catalog__content_active')) {
                back.target.closest('.menu-catalog__content_active').classList.remove('menu-catalog__content_active');
            } else if (back.target.closest('.menu-catalog_active')) {
                back.target.closest('.menu-catalog_active').classList.remove('menu-catalog_active');
            }
        })
    })
    
    document.querySelectorAll('.header__menu-bt').forEach(e=>{
        e.addEventListener('click', bt=>{
            bt.preventDefault()
            bt.target.classList.toggle('header__menu-bt_active')
            document.querySelector('.menu-footer__control-menu').classList.toggle('menu-footer__control_active')
            document.querySelector('.menu').classList.toggle('menu_active')
            document.documentElement.classList.toggle('menu-open')
            sizeMobile(mobileWidthMediaQuery.matches)
            document.addEventListener('click', outsideClickHandler);
        })
    })
    
    document.querySelectorAll('.menu-footer__control-menu').forEach(e=>{
        e.addEventListener('click', bt=>{
            bt.preventDefault()
            document.querySelector('.menu').classList.toggle('menu_active')
            document.documentElement.classList.toggle('menu-open')
            bt.target.classList.toggle('menu-footer__control_active')
            document.querySelector('.header__menu-bt').classList.toggle('header__menu-bt_active')
            sizeMobile(mobileWidthMediaQuery.matches)
        })
    })
    
    document.querySelectorAll('.menu-catalog__list').forEach(e=>{
        if(e.hasAttribute('data-title')) {
            const link = `<a href="#" class="menu-catalog__list-title">${e.dataset.title}</a>`
            e.insertAdjacentHTML('beforebegin', link);
        }
    })
    
    const linksShow = ()=>{
        const boxes = document.querySelectorAll('.menu-catalog__box');
        boxes.forEach(box => {
            const links = box.querySelectorAll('.menu-catalog__link');
    
            if (links.length > 5) {
                links.forEach((link, index) => {
                    if (index >= 5) {
                        link.style.display = 'none';
                    }
                });
    
                // Добавление кнопки "Еще" с SVG
                const showMoreButton = `
                    <a href="#" class="menu-catalog__link-show" data-vis="Еще" data-hid="Свернуть">
                        <span>Еще</span>
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M8 11L12 15L16 11" stroke="#2A65C5" stroke-width="1.5" stroke-linecap="round"/>
                        </svg>
                    </a>
                `;
    
                box.insertAdjacentHTML('beforeend', showMoreButton);
    
                const showMoreLink = box.querySelector('.menu-catalog__link-show');
                
                showMoreLink.addEventListener('click', function () {
                    
    
                    showMoreLink.classList.toggle('_active')
                    if(showMoreLink.classList.contains('_active')) {
                        links.forEach((link) => {
                            link.style.display = 'block';
                        });
                        showMoreLink.querySelector('span').textContent = showMoreLink.dataset.hid
                    }else {
                        links.forEach((link, i) => {
                            if(i > 4) {
                                link.style.display = 'none';
                            }
                        });
                        showMoreLink.querySelector('span').textContent = showMoreLink.dataset.vis
                    }
                    msnry.reloadItems();
                    msnry.layout();
                });
            }
        });
    }
    linksShow()
    
    const elemMsnry = document.querySelector('.menu-catalog__list');
    let msnry; 
    
    function initMasonry() {
        msnry = new Masonry(elemMsnry, {
          itemSelector: '.menu-catalog__li:not(.menu-catalog__li_all)',
          horizontalOrder: true,
        });
    }
    initMasonry();
    const mobileWidthMediaQuery = window.matchMedia('(max-width: 1024px)')
    
    function sizeMobile(isMobileSize) {
        if(isMobileSize) {
            if(document.querySelectorAll('.menu-category__link_current').length) {
                document.querySelector('.menu-category__link_current').classList.remove('menu-category__link_current')
                document.querySelector('.menu-catalog_active').classList.remove('menu-catalog_active')
                msnry.destroy();
            }
        }else {
            initMasonry();
        }
    }
    
    sizeMobile(mobileWidthMediaQuery.matches)
    
    mobileWidthMediaQuery.addEventListener('change', function (event) {
        sizeMobile(event.matches)
    })
    const scrollPage = ()=>{
            let scrollTop = document.querySelector('header').clientHeight - pageYOffset
    
            if (document.querySelector('header').clientHeight < pageYOffset) {
                scrollTop = 0
            }
            document.documentElement.style.setProperty('--scroll', `${scrollTop}px`);
    }
    setTimeout(() => {
        scrollPage()
    }, 10);
    window.addEventListener('scroll', function() {
        scrollPage()
    });
    
    document.documentElement.style.setProperty('--headH', ` ${document.querySelector('header').clientHeight}px`)
    window.addEventListener('resize', e=>{
        document.documentElement.style.setProperty('--headH', ` ${document.querySelector('header').clientHeight}px`)
        scrollPage()
    })
    
    // Обработчик события клика вне меню
    function outsideClickHandler(event) {
        const menu = document.querySelector('.menu');
        const menuButton = document.querySelector('.header__menu-bt');
    
        if (!menu.contains(event.target) && !menuButton.contains(event.target)) {
            document.querySelector('.menu-footer__control-menu').classList.remove('menu-footer__control_active');
            document.querySelector('.menu').classList.remove('menu_active');
            document.querySelector('.header__menu-bt').classList.remove('header__menu-bt_active');
            document.documentElement.classList.remove('menu-open');
            sizeMobile(mobileWidthMediaQuery.matches);
    
            // Удаляем обработчик события клика на документ после закрытия меню
            document.removeEventListener('click', outsideClickHandler);
        }
    }
    
    document.querySelectorAll('.menu-catalog').forEach(e=>{
        e.addEventListener('scroll', el=>{
            const maxScroll = document.querySelector('.menu-catalog_active .menu-catalog__list').getBoundingClientRect().height - window.innerHeight;
            const scrollTop = Math.max(0, Math.min(maxScroll, el.target.scrollTop));
            document.querySelector('.menu').style.setProperty('--scrollMenu', `${scrollTop}px`);
        })
    })
}

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
if(document.querySelectorAll('.popular-slider').length) {
    document.querySelectorAll('.popular-slider').forEach(slider=>{
        const swiperPopular = new Swiper(slider, {
            slidesPerView: "auto",
            spaceBetween: 8,
            slidesPerGroup: 2,
            grabCursor: true,
            resistanceRatio: .65,
            speed: 400,
            direction: 'horizontal', 
            mousewheel: {
                enabled: true,
                forceToAxis: true,
            },   
            freeMode: true,
            navigation: {
                nextEl: '.swiper-button-next',
                prevEl: '.swiper-button-prev',
            },
            breakpoints: {
                768: {
                    spaceBetween: 16,
                },
                800: {
                    slidesPerGroup: 3,
                },
                920: {
                    slidesPerGroup: 3,
                },
                1024: {
                    slidesPerGroup: 4,
                },
                1230: {
                    slidesPerGroup: 5,
                },
                1440: {
                    spaceBetween: 12,
                    slidesPerGroup: 4,
                }
            }
        });
        slider.addEventListener('wheel', (event) => {
            const deltaX = event.deltaX;
            if (deltaX !== 0) {
                event.preventDefault();
            }
        });
    })
}
document.addEventListener('DOMContentLoaded', function() {
    if(document.querySelector('.min-price')) {
        class PriceRange extends HTMLElement {
            constructor() {
                super();
            }
        
            connectedCallback() {
                // Элементы
                this.elements = {
                    container: this.querySelector('.range-container'),
                    track: this.querySelector('.range-container > div'),
                    from: this.querySelector('input[type="range"]:first-of-type'),
                    to: this.querySelector('input[type="range"]:last-of-type'),
                    minInput: this.querySelector('.min-price'),
                    maxInput: this.querySelector('.max-price'),
                };
            
                // Event listeners
                this.elements.from.addEventListener('input', this.handleInput.bind(this));
                this.elements.to.addEventListener('input', this.handleInput.bind(this));
                this.elements.minInput.addEventListener('input', this.handleTextInput.bind(this));
                this.elements.maxInput.addEventListener('input', this.handleTextInput.bind(this));
            
                // Update the DOM
                this.updateDom();
            
                // Вызываем вашу функцию для установки ширины input при загрузке
                setInputWidth(this.elements.minInput);
                setInputWidth(this.elements.maxInput);
            }
        
            disconnectedCallback() {
                delete this.elements;
            }
        
            get from() {
                return parseInt(this.elements.from.value);
            }
            get to() {
                return parseInt(this.elements.to.value);
            }
        
            handleInput(event) {
                if (parseInt(this.elements.to.value) - parseInt(this.elements.from.value) <= 1) {
                    if (event.target === this.elements.from) {
                        this.elements.from.value = (parseInt(this.elements.to.value) - 1);
                    } else if (event.target === this.elements.to) {
                        this.elements.to.value = (parseInt(this.elements.from.value) + 1);
                    }
                }
            
                // Если 'from' больше 'to', меняем их местами
                if (parseInt(this.elements.from.value) > parseInt(this.elements.to.value)) {
                    [this.elements.from.value, this.elements.to.value] = [this.elements.to.value, this.elements.from.value];
                    // Обновляем DOM после обмена значениями
                    this.updateDom();
                }
            
                // Обновляем текстовые поля
                this.drawOutput();
            
                // Вызываем вашу функцию для обработки ширины input
                setInputWidth(this.elements.minInput);
                setInputWidth(this.elements.maxInput);
            }
            
            handleTextInput(event) {
                const value = parseInt(event.target.value);
                if (!isNaN(value)) {
                    if (event.target === this.elements.minInput) {
                        this.elements.from.value = value;
                    } else if (event.target === this.elements.maxInput) {
                        this.elements.to.value = value;
                    }
                }
            
                // Если 'from' больше 'to', меняем их местами
                if (parseInt(this.elements.from.value) > parseInt(this.elements.to.value)) {
                    [this.elements.from.value, this.elements.to.value] = [this.elements.to.value, this.elements.from.value];
                    // Обновляем DOM после обмена значениями
                    this.updateDom();
                }
            
                // Обновляем текстовые поля
                this.drawOutput();
            
                // Вызываем вашу функцию для обработки ширины input
                setInputWidth(this.elements.minInput);
                setInputWidth(this.elements.maxInput);
            }
        
            updateDom() {
                this.drawFill();
                this.drawOutput();
            }
        
            drawFill() {
                const percent1 = (this.elements.from.value / this.elements.from.max) * 100,
                    percent2 = (this.elements.to.value / this.elements.to.max) * 100;
            
                this.elements.track.style.background = `linear-gradient(to right, var(--track-color) ${percent1}%, var(--track-highlight-color) ${percent1}%, var(--track-highlight-color) ${percent2}%, var(--track-color) ${percent2}%)`;
            }
        
            drawOutput() {
                this.elements.minInput.value = `${this.elements.from.value}`;
                this.elements.maxInput.value = `${this.elements.to.value}`;
            }
        }
        
        customElements.define('price-range', PriceRange);
        // Добавляем обработчик для изменения ширины input
        const minInput = document.querySelector('.min-price');
        const maxInput = document.querySelector('.max-price');
        
        minInput.addEventListener('input', function() {
            setInputWidth(minInput);
        });
        
        maxInput.addEventListener('input', function() {
            setInputWidth(maxInput);
        });
        
        function setInputWidth(input) {
            const textWidth = getTextWidth(input.value, getComputedStyle(input).font);
            input.style.width = (textWidth + 10) + 'px';
        }
        
        function getTextWidth(text, font) {
            const canvas = document.createElement('canvas');
            const context = canvas.getContext('2d');
            context.font = font;
            const metrics = context.measureText(text);
            return metrics.width;
        }
    }
});
if(document.querySelectorAll('.basket__promocode').length) {    
    const input = document.querySelector('.basket__promocode');
    const inputContainer = input.closest('.basket__promocode-box');
    const button = document.querySelector('.basket__promocode-button');
    let promoCodes = [];

    fetch('json/promo.json')
        .then(response => response.json())
        .then(data => {
            promoCodes = data;
            button.disabled = false; 
        });

    document.querySelector('.promocode-box__form').addEventListener('submit', function (event) {
        event.preventDefault(); 
        const enteredCode = input.value.trim();
        const promo = promoCodes.find(p => p.promo === enteredCode);

        if (promo) {
            inputContainer.classList.add('_ok');
            inputContainer.classList.remove('_error');
        } else {
            inputContainer.classList.add('_error');
            inputContainer.classList.remove('_ok');
        }
    });

    input.addEventListener('input', function () {
        inputContainer.classList.remove('_ok');
        inputContainer.classList.remove('_error');
    });

    const promoBt = e=>{
        if(e.value.length){
            e.closest('.basket__promocode-box').querySelector('.basket__promocode-button').removeAttribute('disabled')
        }else {
            e.closest('.basket__promocode-box').querySelector('.basket__promocode-button').setAttribute('disabled', true)
        }
    }
    document.querySelectorAll('.basket__promocode').forEach(el=>{
        el.addEventListener('input', e=>{
            promoBt(e.target)
        })
        el.addEventListener('focus', e=>{
            el.classList.add('_active')
        })
        el.addEventListener('blur', e=>{
            if(el.value.length == 0) {
                el.classList.remove('_active')
            } 
        })
    })
}

if(document.querySelectorAll('.reviews__stars').length) {

    const ratingBlocks = document.querySelectorAll('.reviews__stars');

    ratingBlocks.forEach(block => {
        const rating = parseFloat(block.getAttribute('data-rating')); // Получаем рейтинг из атрибута data-rating
        let starsHTML = ''; // HTML-код для звезд

        // Создаем HTML-код для заполненных звезд
        for (let i = 0; i < 5; i++) {
            if (i < Math.floor(rating)) {
                // Заполненная звезда
                starsHTML += `
                    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 18 18" fill="none">
                        <path d="M9.26919 1.53637C9.15809 1.31545 8.84243 1.31627 8.73247 1.53776L6.62436 5.78413C6.58046 5.87255 6.49587 5.93372 6.39815 5.94771L1.60732 6.63327C1.36017 6.66863 1.26184 6.97279 1.44152 7.14614L4.90845 10.491C4.9804 10.5604 5.01304 10.6611 4.9955 10.7595L4.1693 15.3964C4.12552 15.6422 4.38344 15.8308 4.60433 15.7146L8.85978 13.4758C8.94721 13.4298 9.05168 13.4298 9.13911 13.4758L13.3965 15.7151C13.6172 15.8312 13.875 15.6429 13.8316 15.3973L13.0112 10.7591C12.9939 10.6609 13.0264 10.5605 13.0982 10.4911L16.5598 7.14563C16.7391 6.97229 16.6409 6.6685 16.394 6.63297L11.6315 5.94767C11.5344 5.93369 11.4503 5.87314 11.4062 5.78551L9.26919 1.53637Z" fill="#0E0E0E" stroke="#0E0E0E" stroke-width="1.3" stroke-linejoin="round"/>
                    </svg>
                `;
            } else if (i === Math.floor(rating) && rating % 1 !== 0) {
                // Заполненная наполовину звезда
                starsHTML += `
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="19" viewBox="0 0 18 19" fill="none">
                    <path fill-rule="evenodd" clip-rule="evenodd" d="M8 14.4281V3.51317L6.62436 6.28413C6.58046 6.37255 6.49587 6.43372 6.39815 6.44771L1.60732 7.13327C1.36017 7.16863 1.26184 7.47279 1.44152 7.64614L4.90845 10.991C4.9804 11.0604 5.01304 11.1611 4.9955 11.2595L4.1693 15.8964C4.12552 16.1422 4.38344 16.3308 4.60433 16.2146L8 14.4281Z" fill="#0E0E0E"/>
                    <path d="M8 14.4281L4.60433 16.2146C4.38344 16.3308 4.12552 16.1422 4.1693 15.8964L4.9955 11.2595C5.01304 11.1611 4.9804 11.0604 4.90845 10.991L1.44152 7.64614C1.26184 7.47279 1.36017 7.16863 1.60732 7.13326L6.39815 6.44771C6.49587 6.43372 6.58046 6.37255 6.62436 6.28413L8 3.51317M8 14.4281L8.85978 13.9758C8.94721 13.9298 9.05168 13.9298 9.13911 13.9758L13.3965 16.2151C13.6172 16.3312 13.875 16.1429 13.8316 15.8973L13.0112 11.2591C12.9939 11.1609 13.0264 11.0605 13.0982 10.9911L16.5598 7.64563C16.7391 7.47229 16.6409 7.1685 16.394 7.13297L11.6315 6.44767C11.5344 6.43369 11.4503 6.37314 11.4062 6.28551L9.26919 2.03637C9.15809 1.81545 8.84243 1.81627 8.73247 2.03776L8 3.51317M8 14.4281V3.51317" stroke="#0E0E0E" stroke-width="1.3" stroke-linejoin="round"/>
                    </svg>
                `;
            } else {
                // Незаполненная звезда
                starsHTML += `
                    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 18 18" fill="none">
                        <path d="M9.26919 1.53637C9.15809 1.31545 8.84243 1.31627 8.73247 1.53776L6.62436 5.78413C6.58046 5.87255 6.49587 5.93372 6.39815 5.94771L1.60732 6.63327C1.36017 6.66863 1.26184 6.97279 1.44152 7.14614L4.90845 10.491C4.9804 10.5604 5.01304 10.6611 4.9955 10.7595L4.1693 15.3964C4.12552 15.6422 4.38344 15.8308 4.60433 15.7146L8.85978 13.4758C8.94721 13.4298 9.05168 13.4298 9.13911 13.4758L13.3965 15.7151C13.6172 15.8312 13.875 15.6429 13.8316 15.3973L13.0112 10.7591C12.9939 10.6609 13.0264 10.5605 13.0982 10.4911L16.5598 7.14563C16.7391 6.97229 16.6409 6.6685 16.394 6.63297L11.6315 5.94767C11.5344 5.93369 11.4503 5.87314 11.4062 5.78551L9.26919 1.53637Z" stroke="#0E0E0E" stroke-width="1.3" stroke-linejoin="round"/>
                    </svg>
                `;
            }
        }

        block.innerHTML = starsHTML; // Вставляем звезды в блок
    });
}
if(document.querySelectorAll('.reviews__grade-link').length) {
    document.addEventListener('click', e=>{
        if(e.target.classList.contains('reviews__grade-link')) {
            e.preventDefault()
            e.target.classList.toggle('reviews__grade-link_active')
            if(e.target.classList.contains('reviews__grade-link_active')) {
                e.target.querySelector('span').textContent = ++ e.target.querySelector('span').textContent
            }else {
                e.target.querySelector('span').textContent = -- e.target.querySelector('span').textContent
            }
        }
        if(e.target.classList.contains('reviews__vis')) {
            e.preventDefault()
            e.target.closest('.reviews__items').classList.toggle('_show')
            if (e.target.closest('.reviews__items').classList.contains('_show')) {
                e.target.textContent = event.target.getAttribute('data-hide');
            } else {
                e.target.textContent = event.target.getAttribute('data-vis');
            }
        }
    })
    document.querySelectorAll('.reviews__result-sort-item').forEach(e=>{
        const minus = +e.querySelector('.reviews__result-sort-minus').textContent
        const plus = +e.querySelector('.reviews__result-sort-plus').textContent
        let widthLine
        if(minus<plus) {
            widthLine = plus / ((plus + minus)/100)
        }
        if(minus>plus) {
            widthLine =  minus / ((plus + minus)/100)
        }
        if(minus==plus) {
            widthLine = 50
        }
        e.style.setProperty('--widthLine', `${widthLine}%`)
    })
}


if (document.querySelectorAll('.reviews').length) {
    function createStars(parentElement, count) {
        for (let i = 0; i < count; i++) {
            const svg = `<span data-index="${i}"><svg width="24" height="24" ><use xlink:href="img/sprite.svg#icon-stars"></use></svg></span>`;
            parentElement.insertAdjacentHTML('beforeend', svg);
        }
    }

    const starsContainer = document.querySelector('.reviews-rating__select-stars');
    createStars(starsContainer, 5);

    const stars = document.querySelectorAll('.reviews-rating__select-stars span');
    const input = document.querySelector('.reviews-rating__select-input');

    function handleMouseOver(event) {
        const targetIndex = parseInt(event.target.dataset.index);
        stars.forEach((star, index) => {
            if (index <= targetIndex) {
                star.classList.add('_active');
            } else {
                if (!document.querySelectorAll('._clicked').length) {
                    star.classList.remove('_active');
                }
            }
        });
    }
    
    function handleClick(event) {
        const targetIndex = parseInt(event.target.dataset.index);
        input.value = targetIndex + 1;
        stars.forEach((star) => {
            star.classList.remove('_clicked');
            if (!document.querySelectorAll('._clicked').length) {
                star.classList.remove('_active');
            }
        });
        handleMouseOver(event)
        event.target.classList.add('_clicked');
    }
    
    function handleMouseOut() {
        stars.forEach((star) => {
            if (!document.querySelectorAll('._clicked').length) {
                star.classList.remove('_active');
            }
        });
    }

    stars.forEach((star) => {
        star.addEventListener('mouseover', handleMouseOver);
        star.addEventListener('click', handleClick);
    });

    document.querySelector('.reviews-rating__select').addEventListener('mouseout', handleMouseOut);
}

document.addEventListener('DOMContentLoaded', function() {
    var element = document.documentElement; 
    if (element) {
        var safeAreaBottom = window.getComputedStyle(document.documentElement).getPropertyValue('--safe-area-inset-bottom');
        if (safeAreaBottom) {
            element.style.paddingBottom = safeAreaBottom;
        }
    }
});
if(document.querySelector('.select-box-js')) {
    document.addEventListener('click', el=>{
        const {target} = el
    
        if(target.classList.contains('select-box-js__current')) {
            target.classList.toggle('select-box-js__current_active')
        }else if(target.classList.contains('select-box-js__li')) {
            document.querySelectorAll('.select-box-js__li').forEach(option=>{
                option.classList.remove('select-box-js__li_active')
            })
            const textOption = target.textContent
            const valOption = target.dataset.val
            const targetPaper = target.closest('.select-box-js')
            target.classList.add('select-box-js__li_active')
            targetPaper.querySelector('.select-box-js__current').textContent = valOption
            targetPaper.querySelector('.select-box-js__current').classList.remove('select-box-js__current_active')
            targetPaper.querySelector('.select-box-js__input').textContent = textOption
        }else {
            document.querySelector('.select-box-js__current').classList.remove('select-box-js__current_active')
        }
    
    })
}
function setCustomVh() {
    let vh = window.innerHeight * 0.01;
    document.documentElement.style.setProperty('--vh', `${vh}px`);
}
window.addEventListener('resize', setCustomVh);
  
setCustomVh();
if(document.querySelectorAll('.tabs').length) {
    document.querySelectorAll('.tabs').forEach(tabs=>{
        const tabsListItems = tabs.querySelectorAll('.tabs__li');
        const tabsContainers = tabs.querySelectorAll('.tabs__container');
        
        tabsListItems.forEach((tab, index) => {
            tab.addEventListener('click', () => {
                tabsListItems.forEach(item => item.classList.remove('_current'));
                tabsContainers.forEach(container => container.classList.remove('_active'));
        
                tab.classList.add('_current');
                tabsContainers[index].classList.add('_active');
            });
        });
    })
    if(document.querySelectorAll('a[data-tabs]').length) {
        const tabLinks = document.querySelectorAll('[data-tabs]');
        tabLinks.forEach(link => {
            link.addEventListener('click', function(event) {
                event.preventDefault();
                let targetTabId = this.getAttribute('data-tabs');
                
                // Убираем символ '#' из идентификатора, если он присутствует
                if (targetTabId.startsWith('#')) {
                    targetTabId = targetTabId.slice(1);
                }

                const targetTabs = document.querySelectorAll(`[data-id="${targetTabId}"]`);

                let validTargetTab = null;

                // Проверяем каждый элемент с атрибутом data-id="${targetTabId}"
                targetTabs.forEach(tab => {
                    if (!hasDisplayNoneParent(tab)) {
                        validTargetTab = tab;
                        tab.click()
                    }
                });

                if (validTargetTab) {
                    const yOffset = -180; // смещение относительно верха экрана, чтобы учесть фиксированное меню, если есть
                    const y = validTargetTab.getBoundingClientRect().top + window.pageYOffset + yOffset;
                    window.scrollTo({ top: y, behavior: 'smooth' });
                } 
            });
        });
        // Функция, которая проверяет, имеет ли элемент родительский элемент с display: none
        function hasDisplayNoneParent(element) {
            let parent = element.parentElement;
            while (parent) {
                const styles = window.getComputedStyle(parent);
                if (styles.getPropertyValue('display') === 'none') {
                    return true;
                }
                parent = parent.parentElement;
            }
            return false;
        }
    }
}
const labels = document.querySelectorAll('[data-tooltip]');

labels.forEach(label => {
  label.addEventListener('mouseenter', showTooltip);
  label.addEventListener('touchstart', el=>{
      if(!el.target.classList.contains('tooltip-no-touch')) {
        el.preventDefault()
      }
      showTooltip(el)
  });
  label.addEventListener('mouseleave', hideTooltip);
});

function showTooltip(event) {
  if ((window.innerWidth >= 1024 || !event.target.classList.contains('tooltip-no-touch'))) {
    document.querySelectorAll('.tooltip').forEach(tooltip => tooltip.remove());

    const label = event.target;
    const tooltipText = label.dataset.tooltip || ''; 

    if (tooltipText) { 
      const tooltip = createTooltip(label.dataset.title, label.dataset.class, tooltipText);
      document.body.appendChild(tooltip);
      setPosition(event, tooltip);
      setTimeout(() => tooltip.style.opacity = '1', 10);
      setTimeout(() => tooltip.style.transform = 'translateY(0px)', 10);
      const bg = createBackground();
      document.body.appendChild(bg);
      tooltip.addEventListener('mouseout', () => hideTooltip(tooltip));
      bg.addEventListener('click', hideTooltip);
    }
  }
}

function hideTooltip(event) {
  if(document.querySelectorAll('.tooltip').length) {
    const tooltip = document.querySelector('.tooltip');
    const bg = document.querySelector('.tooltip__bg');

    if (!tooltip || !event.relatedTarget || !tooltip.contains(event.relatedTarget)) {
      tooltip.style.opacity = '0';
      setTimeout(() => tooltip.remove(), 300);
    }

    if (bg) {
      bg.style.opacity = '0';
      setTimeout(() => bg.remove(), 300);
    }
  }
}

function setPosition(event, tooltip) {
  const labelRect = event.target.getBoundingClientRect();
  const screenWidth = window.innerWidth;
  const tooltipWidth = tooltip.offsetWidth;
  const tooltipLeft = labelRect.left + window.pageXOffset + labelRect.width / 2 - tooltipWidth / 2;

  tooltip.style.left = Math.max(0, Math.min(screenWidth - tooltipWidth, tooltipLeft)) + 'px'; // Constrain to viewport
  tooltip.style.top = (labelRect.top + window.pageYOffset + labelRect.height + 14) + 'px';
}

function createTooltip(text, dataClass, tooltipText) {
  const tooltip = document.createElement('div');
  tooltip.classList.add('tooltip');
  console.log(text)
  if (text) {
    const titleElement = document.createElement('p');
    titleElement.classList.add('tooltip__title');
    titleElement.textContent = text;
    tooltip.appendChild(titleElement);
  }else {
    tooltip.classList.add('_no-title')
  }

  // Add content from data-tooltip
  if (tooltipText) {
    const textElement = document.createElement('p');
    textElement.classList.add('tooltip__text');
    textElement.innerHTML = tooltipText;
    tooltip.appendChild(textElement);
  }

  const closeLink = document.createElement('a');
  closeLink.classList.add('tooltip__close');
  closeLink.innerHTML = `
    <svg width="24" height="24">
      <use xlink:href="img/sprite.svg#icon-close"></use>
    </svg>
  `;
  closeLink.addEventListener('click', hideTooltip);
  tooltip.appendChild(closeLink);

  if (dataClass) {
    tooltip.classList.add(dataClass);
  }

  return tooltip;
}

function createBackground() {
  const bg = document.createElement('div');
  bg.classList.add('tooltip__bg');
  return bg;
}

if(document.querySelector('.formValid')) {
    const formHandle = document.querySelectorAll('.formValid')
    const options = {
        rules: {
			phonemask: function (value) {
                return value.replace(/\D/g, '').length == 11
			},
			reppassword: function (value) {
                const repPass = document.querySelector('input[name="newpassword"]').value
				return (value == repPass);
			},
			mail: function (value) {
                const mailMask = emailRegExp = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                return (mailMask.test(value));
			},
		},
        messages: {
            en: {
                required:{
                    empty: "Заполните поле",
                    incorrect: 'Неправильно заполнено поле'
                },
                phonemask: {
                    empty: "Введите номер телефона",
                    incorrect: 'Неправильный номер телефона'
                },
                mail: {
                    empty: 'Введите почту',
                    incorrect: 'Неверный формат электронной почты'
                },
                name: {
                    incorrect: 'Введите ваше имя',
                    incorrect: 'Неправильно заполнено поле'
                },
                minlength: {
                    incorrect: 'Минимум {0} символа',
                    incorrect: 'Неправильно заполнено поле'
                },
                reppassword: {
                    incorrect: 'Пароли не совпадают',
                    incorrect: 'Неправильно заполнено поле'
                }
            }
        }
    };
    formHandle.forEach(form=>{
        new Validator(form, function (err, res) {
            if(res && form.classList.contains('footer__callback-form')) {
                document.querySelector('.footer__callback-send').classList.add('footer__callback-send_active')
                setTimeout(() => {
                    document.querySelector('.footer__callback-send').classList.remove('footer__callback-send_active')
                }, 5000);
                return false
            }
            return res;
        }, options);
    })
    
    // Находим все формы на странице
    const forms = document.querySelectorAll('.modal__form');

    // Функция для проверки валидности поля
    function isFieldValid(field) {
        const rule = field.dataset.rule;
        const value = field.value.trim();
        
        // Проверяем, есть ли у поля класс ошибки и пустое ли поле
        return !field.classList.contains('error') && (value !== '' || !rule.includes('required'));
    }

    // Функция для проверки всех полей формы
    function isFormValid(form) {
        const fields = form.querySelectorAll('[data-rule]');
        return Array.from(fields).every(isFieldValid);
    }

    // Функция для блокировки/разблокировки кнопки отправки
    function toggleSubmitButton(form) {
        const submitButton = form.querySelector('.form-button');
        submitButton.disabled = !isFormValid(form);
    }

    // Для каждой формы добавляем обработчики событий и проверяем состояние кнопки отправки
    forms.forEach(form => {
        const fields = form.querySelectorAll('[data-rule]');
        
        fields.forEach(field => {
            field.addEventListener('keyup', () => {
                setTimeout(() => {
                    toggleSubmitButton(form)
                }, 500);
            });
        });
    
        toggleSubmitButton(form);
    });
}
if(document.querySelectorAll('.viewed').length) {
    document.querySelectorAll('.viewed__slider').forEach(slider=>{
        const swiperViewed = new Swiper(slider, {
            spaceBetween: 8,
            grabCursor: true,
            slidesPerView: 'auto',
            touchEventsTarget: 'container',
            direction: 'horizontal',
            slidesPerGroup: 2,
            navigation: {
                nextEl: '.swiper-button-next',
                prevEl: '.swiper-button-prev',
            },
            mousewheel: {
                enabled: true,
                forceToAxis: true,
            },   
            freeMode: true,
            grid: {
                rows: 2,
                fill: "row",
            },
            breakpoints: {
                1024: {
                    spaceBetween: 12,
                    grid: {
                        rows: 1,
                    },
                },
                1300: {
                    slidesPerGroup: 3,
                    spaceBetween: 12,
                    grid: {
                        rows: 1,
                    },
                }
            }
        });
        slider.addEventListener('wheel', (event) => {
            const deltaX = event.deltaX;
            if (deltaX !== 0) {
                event.preventDefault();
            }
        });
    })
}