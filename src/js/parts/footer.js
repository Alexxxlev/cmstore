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