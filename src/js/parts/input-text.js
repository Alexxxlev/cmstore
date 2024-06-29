document.querySelectorAll('.input-text').forEach(inp=>{
    inp.addEventListener('input', e=>{
        e.target.classList.toggle('input-text-val', e.target.value.length)
    })
})
document.querySelectorAll('.textarea-text').forEach(inp=>{
    inp.addEventListener('input', e=>{
        e.target.classList.toggle('textarea-text-val', e.target.value.length)
    })
})