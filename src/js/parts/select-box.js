if(document.querySelector('.select-box-js')) {
    document.addEventListener('click', el=>{
        const {target} = el
    
        if(target.classList.contains('select-box-js__current')) {
            target.classList.toggle('select-box-js__current_active')
        }else if(target.classList.contains('select-box-js__li')) {
            document.querySelectorAll('.select-box-js__li').forEach(option=>{
                option.classList.remove('select-box-js__li_active')
            })
            const textOption = target.textContent
            const valOption = target.dataset.val
            const targetPaper = target.closest('.select-box-js')
            target.classList.add('select-box-js__li_active')
            targetPaper.querySelector('.select-box-js__current').textContent = valOption
            targetPaper.querySelector('.select-box-js__current').classList.remove('select-box-js__current_active')
            targetPaper.querySelector('.select-box-js__input').textContent = textOption
        }else {
            document.querySelector('.select-box-js__current').classList.remove('select-box-js__current_active')
        }
    
    })
}