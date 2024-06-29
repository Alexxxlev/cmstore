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