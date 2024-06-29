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