let insuranceOk = (title, text, price, time = 0)=>{
    document.querySelectorAll('.cart-purchase__guarantee-text').forEach(e=>{
        e.textContent = "Защита добавлена"
    })
    document.querySelectorAll('.cart-purchase__guarantee-price').forEach(e=>{
        let nameInsurance = `${title} <span>${price} ₽</span>`
        e.innerHTML = nameInsurance
    })
    document.querySelectorAll('.cart-purchase__guarantee-link').forEach(e=>{
        e.textContent = "Изменить выбор"
    })
    let removeBT = `<a href="#" class="cart-purchase__guarantee-link-remove">
                        <svg>
                            <use xlink:href="img/sprite.svg#icon-remove"></use>
                        </svg>
                    </a>`
    document.querySelectorAll('.cart-purchase__guarantee-link-box').forEach(e=>{
        e.insertAdjacentHTML('beforeend', removeBT)
    })
    let fixPrice = `<div class="cart-fixed__price-order">
                        1 товар + <a href="#" class="cart-fixed__price-order-link">защита</a>
                        <div class="cart-fixed__price-order-tooltip">
                            <div class="cart-fixed__price-order-tooltip-container">
                                <a href="#" class="cart-fixed__price-order-tooltip-close">
                                <svg width="24" height="24">
                                    <use xlink:href="img/sprite.svg#icon-close"></use>
                                </svg>
                                </a>
                                <p class="cart-fixed__price-order-tooltip-title">${title}</p>
                                <p class="cart-fixed__price-order-tooltip-desc">${text}</p>
                                <div class="cart-fixed__price-order-tooltip-box">
                                    <span>${price} ₽</span>
                                    ${removeBT}
                                </div>
                            </div>
                        </div>
                        <div class="cart-fixed__price-order-tooltip-bg"></div>
                    </div>`
    document.querySelectorAll('.cart-fixed__price-box').forEach(e=>{
        e.insertAdjacentHTML('beforeend', fixPrice)
    })

    let priceText = `<div class="cart-purchase__buy-insurance">
                    <svg width="24" height="24">
                        <use xlink:href="img/sprite.svg#icon-insuranceOk"></use>
                    </svg>
                    <p>Защита устройства ${title}</p>
                 </div>`

    document.querySelectorAll('.cart-purchase__buy-price').forEach(e=>{
        e.insertAdjacentHTML('afterend', priceText)
    })

    if(document.querySelectorAll('.basket__item').length) {
        let link = document.querySelector('.basket__insurance-link._active')
        if(link.closest('.basket__item').querySelectorAll('.basket__insurance').length) {
            link.closest('.basket__item').querySelector('.basket__insurance').remove()
        }
        const boxInsurance = `<div class="basket__insurance">
                                <div class="basket__insurance-box">
                                    <p class="basket__insurance-title">Защита устройства</p>
                                    <p class="basket__insurance-text">Программа страхования от ВСК ${title} (${time})</p>
                                </div>            
                                <div class="basket__insurance-control">
                                    <p class="basket__insurance-price">${price} ₽</p>
                                    <a href="#" class="basket__insurance-remove">
                                        <svg width="24" height="24">
                                            <use xlink:href="img/sprite.svg#icon-remove"></use>
                                        </svg>
                                    </a>
                                </div>            
                              </div>`
        link.closest('.basket__item').insertAdjacentHTML('beforeend', boxInsurance)
        link.classList.add('_hide')
    }
}
let insuranceNo = (link)=>{
    document.querySelectorAll('.cart-purchase__guarantee-text').forEach(e=>{
        e.textContent = "Защитите устройство от повреждений или продлите гарантию с максимальной выгодой"
    })
    document.querySelectorAll('.cart-purchase__guarantee-price').forEach(e=>{
        e.textContent = 'от 1 800₽'
    })
    document.querySelectorAll('.cart-purchase__guarantee-link-box').forEach(e=>{
        e.innerHTML =  `<a href="#" class="cart-purchase__guarantee-link js-modal-inline" data-src="#insurance">
                            Выбрать защиту устройства
                            <svg>
                                <use xlink:href="img/sprite.svg#icon-arrow-left-link"></use>
                            </svg>
                        </a>`
    })
    if(document.querySelectorAll('.cart-purchase__buy-insurance').length) {
        document.querySelectorAll('.cart-purchase__buy-insurance').forEach(e=>{
            e.remove()
        })
    }
    if(document.querySelectorAll('.cart-fixed__price-order').length) {
        document.querySelectorAll('.cart-fixed__price-order').forEach(e=>{
            e.remove()
        })
    }
    if(document.querySelectorAll('.basket__insurance').length) {
        link.closest('.basket__item').querySelector('.basket__insurance-link').classList.remove('_hide')
        link.closest('.basket__insurance').remove()
    }
}
document.addEventListener('click', e=>{
    let {target} = e
    if(target.classList.contains('insurance-min-select__item')) {
        const items = document.querySelectorAll('.insurance-min-select__item');
        const index = Array.from(items).indexOf(target);
        const price = target.querySelector('.insurance-min-select__price span').textContent
        document.querySelector('.insurance-min-tab__button span').textContent = price
        items.forEach(e=>{
            e.classList.remove('_current')
        })
        target.classList.add('_current')
        document.querySelectorAll('.insurance-min-tab').forEach((e,i)=>{
            if(i == index) {
                e.style.display = 'block'
                e.classList.add('_current')
            }else {
                e.style.display = 'none'
                e.classList.remove('_current')
            }
        })
    }
    if(target.classList.contains('insurance-foot__select')) {
        e.preventDefault();
        let price = +target.dataset.price
        target.closest('.insurance-foot__list').querySelector('._current').classList.remove('_current')
        target.classList.add('_current')
        if(target.closest('.item').querySelector('.insurance-foot__price span')) {
            target.closest('.item').querySelector('.insurance-foot__price span').textContent = price.toLocaleString("ru-RU")
        }else {
            document.querySelector('.insurance-min-tab__button span').textContent = price.toLocaleString("ru-RU")
        }
    }
    if(target.classList.contains('cart-purchase__guarantee-link-remove')) {
        e.preventDefault();
        insuranceNo(e.target)
    }
    if(target.classList.contains('insurance-min-tab__button')) {
        e.preventDefault();
        target.classList.toggle('_active')
        console.log(23)
        let price = target.querySelector('span').textContent
        let name = document.querySelector('.insurance-min-select__item._current .insurance-min-select__title').textContent
        let text = document.querySelector('.insurance-min-select__item._current .insurance-min-select__desc').textContent
        let time = target.closest('.modal__insurance-content_mobile').querySelector('.item._current .insurance-foot__select._current').textContent
        insuranceOk(name, text, price, time)
    }
    if(target.classList.contains('cart-fixed__price-order-link')) {
        e.preventDefault();
        target.closest('.cart-fixed__price-order').classList.toggle('_active')
        document.documentElement.classList.toggle('head-hide-fix')
    }
    if(target.classList.contains('cart-fixed__price-order-tooltip-close')|| target.classList.contains('cart-fixed__price-order-tooltip-bg')) {
        e.preventDefault();
        target.closest('.cart-fixed__price-order').classList.remove('_active')
        document.documentElement.classList.remove('head-hide-fix')
    }
    if(target.classList.contains('insurance-foot__button')) {
        e.preventDefault();
        if(document.querySelectorAll('.insurance-foot__button._active').length && !target.classList.contains('_active')) {
            let activeButton = document.querySelector('.insurance-foot__button._active')
            activeButton.querySelector('span').textContent = target.dataset.no
            activeButton.querySelector('use').setAttribute('xlink:href', 'img/sprite.svg#icon-plus')
            activeButton.classList.remove('button__border')
            activeButton.classList.remove('_active')
        }
        target.classList.toggle('_active')
        target.classList.toggle('button__border')

        if(target.classList.contains('_active')) {
            target.querySelector('span').textContent = target.dataset.ok
            target.querySelector('use').setAttribute('xlink:href', 'img/sprite.svg#icon-check-insurance')
            let price = target.closest('.insurance-foot__price-box').querySelector('.insurance-foot__price span').textContent
            let name = target.closest('.item').querySelector('.insurance-offers__title').textContent
            let text = target.closest('.item').querySelector('.insurance-offers__desc').textContent
            let time = target.closest('.item').querySelector('.insurance-foot__select._current').textContent
            insuranceOk(name, text, price, time)
        }else {
            insuranceNo(e.target)
            target.querySelector('span').textContent = target.dataset.no
            target.querySelector('use').setAttribute('xlink:href', 'img/sprite.svg#icon-plus')
        }
    }
    if(e.target.classList.contains('basket__insurance-remove')) {
        e.preventDefault()
        insuranceNo(e.target)
    }
})