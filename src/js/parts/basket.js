if(document.querySelectorAll('.basket__info').length) {
    document.querySelectorAll('.basket__info').forEach(e=>{
        let boxPrice = e.querySelector('.basket__box').cloneNode(true);
        boxPrice.classList.add('_clone');
        e.querySelector('.basket__name').insertAdjacentElement('afterend', boxPrice);
    })
}
document.addEventListener('click', e=>{
    if(e.target.classList.contains('basket__sidebar-sale-link')) {
        e.preventDefault();
        e.target.closest('.basket__sidebar-sale').classList.toggle('_active')
    }
})
if(document.querySelectorAll('.basket__control-open').length) {
    document.addEventListener('click', e=>{
        if(e.target.classList.contains('basket__control-open')) {
            e.preventDefault()
            e.target.closest('.basket__item').classList.add('_active')
        }
        if(e.target.classList.contains('basket__control-mob-bg')|| e.target.classList.contains('basket__control-mob-close')) {
            e.preventDefault()
            document.querySelectorAll('.basket__item').forEach(el=>{
                el.classList.remove('_active')
            })
        }
    })
}

if(document.querySelectorAll('.basket__checkbox').length) {

    const checkboxes = document.querySelectorAll('.basket__item:not(.basket__item_not-available) .basket__checkbox-item input, .basket-complect__head-check input');

    function areAllCheckboxesChecked() {
        return Array.from(checkboxes).every(checkbox => checkbox.checked);
    }

    checkboxes.forEach(checkbox => {
        checkbox.addEventListener('click', () => {
            const allChecked = areAllCheckboxesChecked();
            document.querySelector('.basket__checkbox input').checked = allChecked;
            btRemoveAll()
        });

    });

    document.querySelectorAll('.basket__checkbox .checkbox__input').forEach(check=>{
        check.addEventListener('change', e=>{
            if(e.target.checked) {
                document.querySelectorAll('.basket__checkbox-item, .basket-complect__head-check').forEach(el=>{
                    el.querySelector('input').checked = true
                })
            }
            else {
                document.querySelectorAll('.basket__checkbox-item, .basket-complect__head-check').forEach(el=>{
                    el.querySelector('input').checked = false
                })
            }
            btRemoveAll()
        })
    })

}
const btRemoveAll = ()=>{
    if(document.querySelectorAll('.basket__remove-all').length || document.querySelectorAll('.basket__checkbox-item, .basket-complect__head-check').length) {
        if(document.querySelectorAll('.basket__checkbox-item input:not([disabled]):checked, .basket-complect__head-check input:not([disabled]):checked').length) {
            document.querySelector('.basket__remove-all span').textContent = 'Удалить выбранные'
            document.querySelector('.basket__remove-all').dataset.src = '#remove-check'
            document.querySelectorAll('.basket__sidebar, .basket-menu').forEach(el=>{
                el.classList.remove('_hide')
                el.querySelector('.basket__buy').classList.remove('_disabled')
            })
        }else {
            document.querySelector('.basket__remove-all span').textContent = 'Удалить все'
            document.querySelector('.basket__remove-all').dataset.src = '#remove-all'
            document.querySelectorAll('.basket__sidebar, .basket-menu').forEach(el=>{
                el.classList.add('_hide')
                el.querySelector('.basket__buy').classList.add('_disabled')
            })
        }
    }
}
btRemoveAll()

if(document.querySelectorAll('.basket__sidebar').length) {
    let sideBar = document.querySelector('.basket__sidebar').cloneNode(true);
    sideBar.classList.add('_clone');
    document.querySelector('.basket__wrapper').insertAdjacentElement('beforeend', sideBar);
}
if(document.querySelectorAll('.basket-menu').length && document.querySelectorAll('.footer-small')) {
    document.querySelector('.footer-small').classList.add('bottom')
}
