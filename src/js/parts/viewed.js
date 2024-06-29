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