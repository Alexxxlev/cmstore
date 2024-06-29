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