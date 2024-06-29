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