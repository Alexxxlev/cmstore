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

