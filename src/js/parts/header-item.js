document.querySelectorAll('.header-item__remove-bt').forEach(e=>{
    e.addEventListener('click', el=>{
        el.preventDefault()
        el.target.closest('.header-item').remove()
    })
})