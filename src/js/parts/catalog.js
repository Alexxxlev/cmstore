class CustomSwiper {
  constructor(selector) {
    this.swiperContainer = selector; // Store the element directly, not the selector
    this.swiperWrapper = this.swiperContainer.querySelector('.catalog-body__img-sl-wrapper');
    this.swiperPagination = this.swiperContainer.querySelector('.swiper-pagination');
    this.overlayBlock = document.createElement('div');
    this.overlayBlock.className = 'overlay-block';
    this.overlayBlocks = [];

    this.initSwiper();
    this.addOverlayBlocks();
    this.toggleElementsVisibility();
  }

  initSwiper() {
    this.swiper = new Swiper(this.swiperContainer, {
      spaceBetween: 30,
      loop: true,
      pagination: {
        el: this.swiperPagination,
        clickable: true,
      },
    });

    // Добавляем созданный overlayBlock внутрь swiperContainer
    this.swiperContainer.appendChild(this.overlayBlock);
  }

  addOverlayBlocks() {
    const numberOfSlides = this.swiper.slides.length;

    for (let i = 0; i < numberOfSlides; i++) {
      const overlayBlockItem = document.createElement('div');
      overlayBlockItem.className = 'overlay-block-item';
      overlayBlockItem.setAttribute('data-slide-index', i);

      overlayBlockItem.addEventListener('mouseenter', () => {
        const slideIndex = parseInt(overlayBlockItem.getAttribute('data-slide-index'));
        this.swiper.slideTo(slideIndex);
      });

      this.overlayBlocks.push(overlayBlockItem);
      this.overlayBlock.appendChild(overlayBlockItem);
    }
  }

  toggleElementsVisibility() {
    const numberOfSlides = this.swiper.slides.length;

    if (numberOfSlides <= 1) {
      this.swiperPagination.style.display = 'none';
      this.overlayBlock.style.display = 'none';
    }
  }
}
if (document.querySelectorAll('.catalog-body__img-sl').length > 0) {


  // Получаем все элементы с классом .catalog-body__img-sl и создаем экземпляр класса CustomSwiper для каждого из них
  const swiperElements = document.querySelectorAll('.catalog-body__img-sl:not(.swiper-slide-active)');
  swiperElements.forEach(element => {
    new CustomSwiper(element); // Pass the element directly
  });

}
const animationCount = (el)=>{
  el.forEach(e=>{
    e.querySelector('.header__controll-sum').classList.remove('addCount')
    setTimeout(() => {
      e.querySelector('.header__controll-sum').classList.add('addCount')
    }, 100);
  })
}

const visibleContent = (el)=>{
  document.querySelectorAll('.header__controll-hide').forEach(e=>{
    e.classList.remove('header__controll-hide_active')
  })
  el.closest('.header__controll').querySelector('.header__controll-hide').classList.add('header__controll-hide_active')
  setTimeout(() => {
    el.closest('.header__controll').querySelector('.header__controll-hide').classList.remove('header__controll-hide_active')
  }, 2000);
}

const insuranceBasket = ()=>{
  document.querySelectorAll('.cart-purchase__guarantee-link-box').forEach(e=>{
    e.innerHTML = `<p>Товар уже в корзине, добавлять и удалять защиту устройства можно там</p>`
  })
  document.querySelectorAll('.cart-purchase__guarantee-text').forEach(e=>{
    e.innerHTML = `Защитите устройство от&nbsp;повреждений или&nbsp;продлите гарантию с&nbsp;максимальной выгодой`
  })
  document.querySelectorAll('.cart-purchase__guarantee-price').forEach(e=>{
    e.innerHTML = `от 1 800₽`
  })
  document.querySelectorAll('.cart-purchase__guarantee-link-box').forEach(e=>{
    e.innerHTML = `<p>Товар уже в корзине, добавлять и удалять защиту устройства можно там</p>`
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
}

document.addEventListener('click', e=>{
  if(e.target.classList.contains('catalog-control__button_list')) {
    e.preventDefault()
    document.querySelector('.catalog-body').classList.add('catalog-body_list')
    document.querySelector('.catalog-control__button_grid').classList.remove('catalog-control__button_active')
    e.target.classList.add('catalog-control__button_active')
  }
  if(e.target.classList.contains('catalog-control__button_grid')) {
    e.preventDefault()
    document.querySelector('.catalog-body').classList.remove('catalog-body_list')
    document.querySelector('.catalog-control__button_list').classList.remove('catalog-control__button_active')
    e.target.classList.add('catalog-control__button_active')
  }
  if(e.target.classList.contains('catalog-body__price-info-icon')) {
    e.target.classList.add('_active')
  }
  if(e.target.classList.contains('catalog-body__price-info-content-bg')
  || e.target.classList.contains('catalog-body__price-info-close')) {
    e.preventDefault()
    e.target.closest('.catalog-body__price-info').querySelector('.catalog-body__price-info-icon').classList.remove('_active')
  }
  if(e.target.classList.contains('catalog-body__favorites')) {
    e.preventDefault()
    e.target.classList.toggle('catalog-body__control-icon_active')
    if(e.target.classList.contains('catalog-body__control-icon_active')) {
      if(!document.querySelectorAll('.header__controll_favorites .header__controll-sum').length) {
        const sumElement = `<span class="header__controll-sum">1</span>`
        document.querySelector('.header__controll_favorites').insertAdjacentHTML('beforeend', sumElement)
        document.querySelector('.header__controll_favorites').classList.add('header__controll-link_active')
        document.querySelector('.menu-footer__favorites').insertAdjacentHTML('beforeend', sumElement)
        document.querySelector('.menu-footer__favorites').classList.add('menu-footer__control_active')
      }else {
        + document.querySelector('.header__controll_favorites .header__controll-sum').textContent ++
        + document.querySelector('.menu-footer__favorites .header__controll-sum').textContent ++
        animationCount(document.querySelectorAll('.header__controll_favorites, .menu-footer__favorites'))
      }
      visibleContent(document.querySelector('.header__controll_favorites'))
    }else {
      if(+ document.querySelector('.header__controll_favorites .header__controll-sum').textContent != 1) {
        + document.querySelector('.header__controll_favorites .header__controll-sum').textContent --
        + document.querySelector('.menu-footer__favorites .header__controll-sum').textContent --
        animationCount(document.querySelectorAll('.header__controll_favorites, .menu-footer__favorites'))
      }else {
        document.querySelector('.header__controll_favorites').classList.remove('header__controll-link_active')
        document.querySelector('.header__controll_favorites .header__controll-sum').remove()
        document.querySelector('.menu-footer__favorites .header__controll-sum').remove()
      } 
    }
  }
  if(e.target.classList.contains('catalog-body__compare')) {
    e.preventDefault()
    e.target.classList.toggle('catalog-body__control-icon_active')
    if(e.target.classList.contains('catalog-body__control-icon_active')) {
      if(!document.querySelectorAll('.header__controll_compare .header__controll-sum').length) {
        const sumElement = `<span class="header__controll-sum">1</span>`
        document.querySelector('.header__controll_compare').insertAdjacentHTML('beforeend', sumElement)
        document.querySelector('.header__controll_compare').classList.add('header__controll-link_active')
      }else {
        + document.querySelector('.header__controll_compare .header__controll-sum').textContent ++
        animationCount(document.querySelectorAll('.header__controll_compare'))
      }
      visibleContent(document.querySelector('.header__controll_compare'))
    }else {
      if(+ document.querySelector('.header__controll_compare .header__controll-sum').textContent != 1) {
        + document.querySelector('.header__controll_compare .header__controll-sum').textContent --
        animationCount(document.querySelectorAll('.header__controll_compare'))
      }else {
        document.querySelector('.header__controll_compare .header__controll-sum').remove()
        document.querySelector('.header__controll_compare').classList.remove('header__controll-link_active')
      } 
    }
  }
  
  if(e.target.classList.contains('catalog-body__basket')) {
    e.preventDefault()
    e.target.classList.toggle('catalog-body__basket_active')
    if(e.target.classList.contains('catalog-body__basket_active')) {
      if(e.target.querySelector('span')) {
        e.target.querySelector('span').textContent = e.target.dataset.ok
      }else {
        e.target.textContent = e.target.dataset.ok
      }
      if(!document.querySelectorAll('.header__controll_basket .header__controll-sum').length) {
        const sumElement = `<span class="header__controll-sum">1</span>`
        document.querySelector('.header__controll_basket').insertAdjacentHTML('beforeend', sumElement)
        document.querySelector('.header__controll_basket').classList.add('header__controll-link_active')
        document.querySelector('.menu-footer__basket').insertAdjacentHTML('beforeend', sumElement)
        document.querySelector('.menu-footer__basket').classList.add('menu-footer__control_active')
      }else {
        + document.querySelector('.header__controll_basket .header__controll-sum').textContent ++
        + document.querySelector('.menu-footer__basket .header__controll-sum').textContent ++
        animationCount(document.querySelectorAll('.menu-footer__basket, .header__controll_basket'))
      }
      visibleContent(document.querySelector('.header__controll_basket'))
      if(document.querySelectorAll('.cart-purchase__guarantee-link-box').length) {
        insuranceBasket()
      }
    }else {
      if(e.target.querySelector('span')) {
        e.target.querySelector('span').textContent = e.target.dataset.no
      }else {
        e.target.textContent = e.target.dataset.no
      }
      if(+ document.querySelector('.header__controll_basket .header__controll-sum').textContent != 1) {
        + document.querySelector('.header__controll_basket .header__controll-sum').textContent --
        + document.querySelector('.menu-footer__basket .header__controll-sum').textContent --
        animationCount(document.querySelectorAll('.menu-footer__basket, .header__controll_basket'))
      }else {
        document.querySelector('.header__controll_basket .header__controll-sum').remove()
        document.querySelector('.menu-footer__basket .header__controll-sum').remove()
        document.querySelector('.header__controll_basket').classList.remove('header__controll-link_active')
      } 
    }
  }
  
  if(e.target.classList.contains('catalog-body__basket-complect')) {
    e.preventDefault()
    document.querySelectorAll('.catalog-body__basket-complect').forEach(el=>{
      el.classList.remove('catalog-body__basket-complect_active')
    })
    e.target.classList.toggle('catalog-body__basket-complect_active')
    if(e.target.classList.contains('catalog-body__basket-complect_active')) {
      if(e.target.querySelector('span')) {
        e.target.querySelector('span').textContent = e.target.dataset.ok
      }else {
        e.target.textContent = e.target.dataset.ok
      }
    }else {
      if(e.target.querySelector('span')) {
        e.target.querySelector('span').textContent = e.target.dataset.no
      }else {
        e.target.textContent = e.target.dataset.no
      }
    }
  }
})

if(document.querySelector('.search-result-output__category-box')) {
  window.addEventListener('resize', () => {
    const categoryBox = document.querySelector('.search-result-output__category-box');
    const boxWidth = categoryBox.getBoundingClientRect().width;
    const linksWidth = Array.from(categoryBox.querySelectorAll('.search-result-output__category-link'))
                        .reduce((totalWidth, link) => totalWidth + link.offsetWidth, 0);
  
    if (boxWidth < linksWidth) {
        const numRows = Math.ceil(linksWidth / boxWidth);
        const numLinksPerRow = Math.ceil(categoryBox.children.length / numRows);
  
        let currentRow = 0;
        let linksInCurrentRow = 0;
        Array.from(categoryBox.children).forEach(link => {
            link.style.order = currentRow;
            linksInCurrentRow++;
            if (linksInCurrentRow === numLinksPerRow) {
                currentRow++;
                linksInCurrentRow = 0;
            }
        });
    }
  });

}