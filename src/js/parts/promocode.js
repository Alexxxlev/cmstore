if(document.querySelectorAll('.basket__promocode').length) {    
    const input = document.querySelector('.basket__promocode');
    const inputContainer = input.closest('.basket__promocode-box');
    const button = document.querySelector('.basket__promocode-button');
    let promoCodes = [];

    fetch('json/promo.json')
        .then(response => response.json())
        .then(data => {
            promoCodes = data;
            button.disabled = false; 
        });

    document.querySelector('.promocode-box__form').addEventListener('submit', function (event) {
        event.preventDefault(); 
        const enteredCode = input.value.trim();
        const promo = promoCodes.find(p => p.promo === enteredCode);

        if (promo) {
            inputContainer.classList.add('_ok');
            inputContainer.classList.remove('_error');
        } else {
            inputContainer.classList.add('_error');
            inputContainer.classList.remove('_ok');
        }
    });

    input.addEventListener('input', function () {
        inputContainer.classList.remove('_ok');
        inputContainer.classList.remove('_error');
    });

    const promoBt = e=>{
        if(e.value.length){
            e.closest('.basket__promocode-box').querySelector('.basket__promocode-button').removeAttribute('disabled')
        }else {
            e.closest('.basket__promocode-box').querySelector('.basket__promocode-button').setAttribute('disabled', true)
        }
    }
    document.querySelectorAll('.basket__promocode').forEach(el=>{
        el.addEventListener('input', e=>{
            promoBt(e.target)
        })
        el.addEventListener('focus', e=>{
            el.classList.add('_active')
        })
        el.addEventListener('blur', e=>{
            if(el.value.length == 0) {
                el.classList.remove('_active')
            } 
        })
    })
}
