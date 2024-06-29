if(document.querySelectorAll('.menu').length) {

    document.querySelectorAll('.menu-category__link').forEach(e=>{
        e.addEventListener('mouseenter', item=>{
            document.querySelectorAll('.menu-category__link_current').forEach(e=>{
                e.classList.remove('menu-category__link_current')
            })
            document.querySelectorAll('.menu-catalog').forEach(e=>{
                e.classList.remove('menu-catalog_active')
            })
            item.target.classList.add('menu-category__link_current')
            const idContent = item.target.dataset.link
            if(document.querySelectorAll(`#${idContent}`).length) {
                document.querySelector(`#${idContent}`).classList.add('menu-catalog_active')
            }
            if(!mobileWidthMediaQuery.matches) {
                sizeMobile(mobileWidthMediaQuery.matches)
                msnry.reloadItems();
                msnry.layout();
            }
        })
        e.addEventListener('click', item=>{
            item.preventDefault()
            const idContent = item.target.dataset.link
            if(document.querySelectorAll(`#${idContent}`).length) {
                document.querySelector(`#${idContent}`).classList.add('menu-catalog_active')
            }
        })
    })
    
    document.querySelectorAll('.menu-catalog__link_title').forEach(e=>{
        const nameGroup = e.textContent
        const hrefGroup = e.getAttribute('href')
        const linkGroup = `<a href="${hrefGroup}" class="menu-catalog__link-name">${nameGroup}</a>`
        if(e.closest('.menu-catalog__li').querySelectorAll('.menu-catalog__content').length) {
            e.nextElementSibling.insertAdjacentHTML('afterbegin', linkGroup)
        }
        e.addEventListener('click', item=>{
            if(window.matchMedia("(max-width: 1023px)").matches) {
                item.preventDefault()
                
                if(document.querySelectorAll('.menu-catalog__content_active').length) {
                    document.querySelector('.menu-catalog__content_active').classList.remove('menu-catalog__content_active')
                }
                item.target.nextElementSibling.classList.add('menu-catalog__content_active')
                item.target.closest('.menu-catalog').classList.add('_hide')
            }
        })
    })
    document.querySelectorAll('.menu-catalog__li_all').forEach(e => {
        let box = `<div class="menu-catalog__content menu-catalog__content_all" data-title="Все товары из категории"></div>`;
        e.insertAdjacentHTML('beforeend', box);
    
        let menuCatalogList = e.closest('.menu-catalog__list');
    
        let contentsToCopy = menuCatalogList.querySelectorAll('.menu-catalog__content:not(.menu-catalog__content_all)');
    
        let copyMenuCatalogContent = e.querySelector('.menu-catalog__content_all');
    
        contentsToCopy.forEach(item => {
            copyMenuCatalogContent.innerHTML += item.innerHTML;
        });
    });
    
    document.querySelectorAll('.menu-catalog__content, .menu-catalog').forEach(e=>{
        let back = `<a href="#" class="menu-catalog__back">Назад</a>`
        e.insertAdjacentHTML('afterbegin', back);
    })
    
    document.querySelectorAll('.menu-catalog__back').forEach(e=>{
        e.addEventListener('click', back=>{
            back.preventDefault()
            document.querySelectorAll('.menu-catalog').forEach(e=>{
                e.classList.remove('_hide')
            })
            if (back.target.closest('.menu-catalog__content_active')) {
                back.target.closest('.menu-catalog__content_active').classList.remove('menu-catalog__content_active');
            } else if (back.target.closest('.menu-catalog_active')) {
                back.target.closest('.menu-catalog_active').classList.remove('menu-catalog_active');
            }
        })
    })
    
    document.querySelectorAll('.header__menu-bt').forEach(e=>{
        e.addEventListener('click', bt=>{
            bt.preventDefault()
            bt.target.classList.toggle('header__menu-bt_active')
            document.querySelector('.menu-footer__control-menu').classList.toggle('menu-footer__control_active')
            document.querySelector('.menu').classList.toggle('menu_active')
            document.documentElement.classList.toggle('menu-open')
            sizeMobile(mobileWidthMediaQuery.matches)
            document.addEventListener('click', outsideClickHandler);
        })
    })
    
    document.querySelectorAll('.menu-footer__control-menu').forEach(e=>{
        e.addEventListener('click', bt=>{
            bt.preventDefault()
            document.querySelector('.menu').classList.toggle('menu_active')
            document.documentElement.classList.toggle('menu-open')
            bt.target.classList.toggle('menu-footer__control_active')
            document.querySelector('.header__menu-bt').classList.toggle('header__menu-bt_active')
            sizeMobile(mobileWidthMediaQuery.matches)
        })
    })
    
    document.querySelectorAll('.menu-catalog__list').forEach(e=>{
        if(e.hasAttribute('data-title')) {
            const link = `<a href="#" class="menu-catalog__list-title">${e.dataset.title}</a>`
            e.insertAdjacentHTML('beforebegin', link);
        }
    })
    
    const linksShow = ()=>{
        const boxes = document.querySelectorAll('.menu-catalog__box');
        boxes.forEach(box => {
            const links = box.querySelectorAll('.menu-catalog__link');
    
            if (links.length > 5) {
                links.forEach((link, index) => {
                    if (index >= 5) {
                        link.style.display = 'none';
                    }
                });
    
                // Добавление кнопки "Еще" с SVG
                const showMoreButton = `
                    <a href="#" class="menu-catalog__link-show" data-vis="Еще" data-hid="Свернуть">
                        <span>Еще</span>
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M8 11L12 15L16 11" stroke="#2A65C5" stroke-width="1.5" stroke-linecap="round"/>
                        </svg>
                    </a>
                `;
    
                box.insertAdjacentHTML('beforeend', showMoreButton);
    
                const showMoreLink = box.querySelector('.menu-catalog__link-show');
                
                showMoreLink.addEventListener('click', function () {
                    
    
                    showMoreLink.classList.toggle('_active')
                    if(showMoreLink.classList.contains('_active')) {
                        links.forEach((link) => {
                            link.style.display = 'block';
                        });
                        showMoreLink.querySelector('span').textContent = showMoreLink.dataset.hid
                    }else {
                        links.forEach((link, i) => {
                            if(i > 4) {
                                link.style.display = 'none';
                            }
                        });
                        showMoreLink.querySelector('span').textContent = showMoreLink.dataset.vis
                    }
                    msnry.reloadItems();
                    msnry.layout();
                });
            }
        });
    }
    linksShow()
    
    const elemMsnry = document.querySelector('.menu-catalog__list');
    let msnry; 
    
    function initMasonry() {
        msnry = new Masonry(elemMsnry, {
          itemSelector: '.menu-catalog__li:not(.menu-catalog__li_all)',
          horizontalOrder: true,
        });
    }
    initMasonry();
    const mobileWidthMediaQuery = window.matchMedia('(max-width: 1024px)')
    
    function sizeMobile(isMobileSize) {
        if(isMobileSize) {
            if(document.querySelectorAll('.menu-category__link_current').length) {
                document.querySelector('.menu-category__link_current').classList.remove('menu-category__link_current')
                document.querySelector('.menu-catalog_active').classList.remove('menu-catalog_active')
                msnry.destroy();
            }
        }else {
            initMasonry();
        }
    }
    
    sizeMobile(mobileWidthMediaQuery.matches)
    
    mobileWidthMediaQuery.addEventListener('change', function (event) {
        sizeMobile(event.matches)
    })
    const scrollPage = ()=>{
            let scrollTop = document.querySelector('header').clientHeight - pageYOffset
    
            if (document.querySelector('header').clientHeight < pageYOffset) {
                scrollTop = 0
            }
            document.documentElement.style.setProperty('--scroll', `${scrollTop}px`);
    }
    setTimeout(() => {
        scrollPage()
    }, 10);
    window.addEventListener('scroll', function() {
        scrollPage()
    });
    
    document.documentElement.style.setProperty('--headH', ` ${document.querySelector('header').clientHeight}px`)
    window.addEventListener('resize', e=>{
        document.documentElement.style.setProperty('--headH', ` ${document.querySelector('header').clientHeight}px`)
        scrollPage()
    })
    
    // Обработчик события клика вне меню
    function outsideClickHandler(event) {
        const menu = document.querySelector('.menu');
        const menuButton = document.querySelector('.header__menu-bt');
    
        if (!menu.contains(event.target) && !menuButton.contains(event.target)) {
            document.querySelector('.menu-footer__control-menu').classList.remove('menu-footer__control_active');
            document.querySelector('.menu').classList.remove('menu_active');
            document.querySelector('.header__menu-bt').classList.remove('header__menu-bt_active');
            document.documentElement.classList.remove('menu-open');
            sizeMobile(mobileWidthMediaQuery.matches);
    
            // Удаляем обработчик события клика на документ после закрытия меню
            document.removeEventListener('click', outsideClickHandler);
        }
    }
    
    document.querySelectorAll('.menu-catalog').forEach(e=>{
        e.addEventListener('scroll', el=>{
            const maxScroll = document.querySelector('.menu-catalog_active .menu-catalog__list').getBoundingClientRect().height - window.innerHeight;
            const scrollTop = Math.max(0, Math.min(maxScroll, el.target.scrollTop));
            document.querySelector('.menu').style.setProperty('--scrollMenu', `${scrollTop}px`);
        })
    })
}
