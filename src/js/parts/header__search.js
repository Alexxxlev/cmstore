
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

