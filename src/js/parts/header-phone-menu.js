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

