if(document.querySelectorAll('.bx-filter').length) {
    let filterTitleIndication = ()=>{
        document.querySelectorAll('.bx-filter-block').forEach(block=>{
            if(block.querySelectorAll('input:checked').length) {
                block.closest('.bx-filter-parameters-box').classList.add('_active')
            }else {
                if(block.closest('.bx-filter-parameters-box')) {
                    block.closest('.bx-filter-parameters-box').classList.remove('_active')
                }
            }
        }) 
    }
    filterTitleIndication() 
    const chips = () => {
        document.querySelectorAll('.catalog-chips').forEach(catalogChips => {
            catalogChips.classList.remove('catalog-chips_active');
            while (catalogChips.firstChild) {
                catalogChips.removeChild(catalogChips.firstChild);
            }
            const close = `<svg><use xlink:href="img/sprite.svg#icon-close"></use></svg>`;
    
            document.querySelectorAll('.bx-filter-block input:checked').forEach(block => {
                const textChecked = block.nextElementSibling.innerHTML;
                const idCheck = block.getAttribute('id');
                const chipsEl = `<a href="#" class="catalog-chips__chip" data-id="${idCheck}">${textChecked}${close}</a>`;
                catalogChips.insertAdjacentHTML('beforeend', chipsEl);
            });
    
            document.querySelectorAll('price-range').forEach(block => {
                if (block.querySelector('.min-price').value != block.querySelector('input[type="range"]').getAttribute('min') ||
                    block.querySelector('.max-price').value != block.querySelector('input[type="range"]').getAttribute('max')) {
                    const titleEl = block.dataset.title;
                    const idCheck = block.getAttribute('id');
                    const chipsEl = `<a href="#" class="catalog-chips__chip-range" data-id="${idCheck}">${titleEl}${close}</a>`;
                    catalogChips.insertAdjacentHTML('beforeend', chipsEl);
                }
            });
            
            if (document.querySelectorAll('.catalog-chips__chip, .catalog-chips__chip-range').length) {
                const remAll = `<a href="#" class="catalog-chips__removeAll">Сбросить всё ${close}</a>`;
                catalogChips.insertAdjacentHTML('beforeend', remAll);
                catalogChips.classList.add('catalog-chips_active');
            }else {
                document.querySelectorAll('.catalog-chips_active').forEach(e=>{
                    e.classList.remove('catalog-chips_active')
                })
                document.querySelectorAll('.catalog-chips__removeAll').forEach(e=>{
                    e.remove()
                })
            }
        });
        let counterFilter = document.querySelectorAll('.catalog-head .catalog-chips__chip-range, .catalog-head .catalog-chips__chip').length
        if(counterFilter) {
            if(document.querySelector('.filter-open__counter')) {
                document.querySelector('.filter-open__counter').remove()
            }
            const counterFilterBox = `<span class="filter-open__counter">${counterFilter}</span>`
            document.querySelector('.filter-open').insertAdjacentHTML('afterbegin', counterFilterBox)
        }else {
            if(document.querySelector('.filter-open__counter')) {
                document.querySelector('.filter-open__counter').remove()
            }
        }
        if(document.querySelectorAll('.filter-chips a').length) {
            document.querySelector('.catalog-filter').classList.add('_chips')
        }else {
            document.querySelector('.catalog-filter').classList.remove('_chips')
        }
    }
    
    chips();

    function show(element, duration) {
        let start = null;
        const initialOpacity = parseFloat(window.getComputedStyle(element).opacity);
    
        function step(timestamp) {
            if (!start) start = timestamp;
            const progress = timestamp - start;
            const opacity = progress / duration;
    
            element.style.opacity = Math.min(opacity + initialOpacity, 1);
    
            if (progress < duration) {
                requestAnimationFrame(step);
            }
        }
    
        requestAnimationFrame(step);
    }
    
    function hide(element, duration) {
        let start = null;
        const initialOpacity = parseFloat(window.getComputedStyle(element).opacity);
    
        function step(timestamp) {
            if (!start) start = timestamp;
            const progress = timestamp - start;
            const opacity = 1 - progress / duration;
    
            element.style.opacity = Math.max(opacity + initialOpacity, 0);
    
            if (progress < duration) {
                requestAnimationFrame(step);
            }
        }
    
        requestAnimationFrame(step);
    }
    

    const rangeClear = (e=>{
        const idRange = e
        const min = document.querySelector(`#${idRange} input[type="range"]`).getAttribute('min')
        const max = document.querySelector(`#${idRange} input[type="range"]`).getAttribute('max')
        document.querySelector(`#${idRange} .min-price`).value = min
        document.querySelector(`#${idRange} .max-price`).value = max
        document.querySelectorAll(`#${idRange} input[type="range"]`)[0].value = min
        document.querySelectorAll(`#${idRange} input[type="range"]`)[1].value = max
        document.querySelector(`#${idRange} .range-container > div`).style.background = `linear-gradient(to right, var(--track-color) 0%, var(--track-highlight-color) 0%, var(--track-highlight-color) 100%, var(--track-color) 100%)`;
    })

    document.querySelector('.smartfilter').addEventListener('change', e=>{
        filterTitleIndication()
        chips()
    })
    document.addEventListener('click', e => {
        if (e.target.classList.contains('filter-button') || e.target.classList.contains('smartfilter__close')) {
            e.preventDefault()
            document.querySelector('.catalog-filter').classList.remove('catalog-filter_active')
            document.documentElement.classList.remove('filter-open-mob')
        }
        if (e.target.classList.contains('filter-open')) {
            e.preventDefault()
            document.querySelector('.catalog-filter').classList.add('catalog-filter_active')
            document.documentElement.classList.add('filter-open-mob')
        }
        if (e.target.classList.contains('linkShowFilter')) {
            e.preventDefault()
            const box = e.target.closest('.bx-filter-block').querySelector('.bx-filter-parameters-box-container')
            ShowCheckbox(box)
        }
        if (e.target.classList.contains('linkHideFilter')) {
            e.preventDefault()
            const box = e.target.closest('.bx-filter-block').querySelector('.bx-filter-parameters-box-container')
            hideCheckbox(box)
        }
        if (e.target.classList.contains('bx-filter-parameters-box-title')) {
            const box = e.target.closest('.bx-filter-parameters-box');
            box.classList.toggle('bx-active');
        }
        if (e.target.classList.contains('btn-reset')) {
            e.target.closest('form').reset()
        }
        if (e.target.classList.contains('catalog-chips__chip-range')) {
            e.preventDefault()
            rangeClear(e.target.dataset.id)
            chips()
        }
        if (e.target.classList.contains('catalog-chips__chip')) {
            e.preventDefault()
            const idCheck = e.target.dataset.id
            e.target.remove()
            document.querySelector(`#${idCheck}`).checked = false
            chips()
            if(document.querySelectorAll('.catalog-chips a').length == 1) {
                document.querySelectorAll('.catalog-chips a').forEach(el=>{
                    el.remove()
                })
                document.querySelectorAll('.catalog-chips').forEach(el=>{
                    el.classList.remove('catalog-chips_active')
                })
                document.querySelector('.catalog-filter').classList.remove('_chips')
            }
        }
        if (e.target.classList.contains('catalog-chips__removeAll')) {
            e.preventDefault()
            document.querySelector('form.smartfilter').reset()
            let catalogChips = document.querySelectorAll('.catalog-chips');
            document.querySelectorAll('price-range').forEach(e=>{
                const idRange = e.getAttribute('id')
                rangeClear(idRange)
            })
            catalogChips.forEach(el=>{
                while (el.firstChild) {
                    el.removeChild(el.firstChild);
                }
            })
            chips()
        }
    });
    
    document.querySelectorAll('.filter-search').forEach(input => {
        input.addEventListener('input', event => {
            let searchText = event.target.value.trim().toLowerCase();
            
            // Получаем блок с фильтрами
            let filterBlock = event.target.closest('.bx-filter-block');
    
            // Получаем все чекбоксы внутри блока
            let checkboxes = filterBlock.querySelectorAll('.bx-filter-param-label');
    
            checkboxes.forEach(checkbox => {
                // Получаем текст чекбокса и приводим его к нижнему регистру для сравнения
                let checkboxText = checkbox.querySelector('.bx-filter-param-text');
                let checkboxTextContent = checkboxText.textContent.trim();
    
                // Получаем содержимое span.text
                let checkboxSubTextContent = checkbox.querySelector('.text').textContent.trim();
    
                // Создаем регулярное выражение для поиска совпадений с текстом поиска
                let regex = new RegExp(searchText, 'ig');
    
                // Заменяем совпадения на текст с тегом <b> только в checkboxSubTextContent
                let replacedSubText = checkboxSubTextContent.replace(regex, match => `<b>${match}</b>`);
    
                // Заменяем содержимое span.text
                checkbox.querySelector('.text').innerHTML = replacedSubText;
    
                // Определяем видимость чекбокса
                checkbox.style.display = checkboxTextContent.toLowerCase().includes(searchText) || checkboxSubTextContent.toLowerCase().includes(searchText) ? 'block' : 'none';
            });
    
            if (searchText) {
                ShowCheckbox(event.target.nextElementSibling);
                event.target.closest('div').querySelector('.linkHideFilter').remove();
            } else {
                hideCheckbox(event.target.nextElementSibling);
            }
        });
    });

    const hideCheckbox = (e)=>{
        if(e.querySelectorAll('.checkbox').length > 5 ){
            e.querySelectorAll('.checkbox').forEach((e,i)=>{
                if(i>4) {
                    e.style.display = 'none'
                }
            })
            if(e.closest('.bx-filter-block').querySelectorAll('.linkHideFilter').length){
                e.closest('.bx-filter-block').querySelector('.linkHideFilter').remove()
            }
            const linkShow = `<a href="#" class="linkShowFilter">
                                Показать все
                                <svg width="24" height="24">
                                    <use xlink:href="img/sprite.svg#icon-arrow-small"></use>
                                </svg>
                            </a>`
            e.insertAdjacentHTML('afterend', linkShow)
        }
    }
    const ShowCheckbox = (e)=>{
        e.querySelectorAll('.checkbox').forEach((e,i)=>{
            e.style.display = 'block'
        })
        e.nextElementSibling.remove()
        const linkHide = `<a href="#" class="linkHideFilter">
                            Свернуть
                            <svg width="24" height="24">
                                <use xlink:href="img/sprite.svg#icon-arrow-small"></use>
                            </svg>
                        </a>`
        e.insertAdjacentHTML('afterend', linkHide)
    }
    document.querySelectorAll('.bx-filter-parameters-box-container').forEach(e=>{
        hideCheckbox(e)
    })

}