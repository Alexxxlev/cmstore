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
