if(document.querySelectorAll('.basket__counter').length) {
    const blockMinus = el=>{
        if(el.value < 2) {
            el.closest('.basket__counter').querySelector('.basket__counter-bt_minus').classList.add('_disabled')
        }else {
            el.closest('.basket__counter').querySelector('.basket__counter-bt_minus').classList.remove('_disabled')
        }
    }
    document.querySelectorAll('.basket__counter-text').forEach(e=>{
        blockMinus(e)
    })
    document.querySelectorAll('.basket__counter-text').forEach(el=>{
        el.addEventListener('keydown', e=>{
            
             // Разрешаем: backspace, delete, tab, escape, enter и навигационные клавиши
            if (
                [46, 8, 9, 27, 13, 110, 190].indexOf(e.keyCode) !== -1 ||
                // Разрешаем: Ctrl+A, Ctrl+C, Ctrl+V, Ctrl+X
                (e.keyCode === 65 && (e.ctrlKey === true || e.metaKey === true)) ||
                (e.keyCode === 67 && (e.ctrlKey === true || e.metaKey === true)) ||
                (e.keyCode === 86 && (e.ctrlKey === true || e.metaKey === true)) ||
                (e.keyCode === 88 && (e.ctrlKey === true || e.metaKey === true)) ||
                // Разрешаем: home, end, left, right, down, up
                (e.keyCode >= 35 && e.keyCode <= 40)
            ) {
                // ничего не делаем
                return;
            }
            // Убедимся, что это число, и предотвращаем ввод всего остального
            if ((e.shiftKey || (e.keyCode < 48 || e.keyCode > 57)) && (e.keyCode < 96 || e.keyCode > 105)) {
                e.preventDefault();
            }
            blockMinus(e.target)
        })
        // Для поддержания текущего поведения при вставке
        el.addEventListener('input', e => {
            // Удаляем все нецифровые символы
            e.target.value = e.target.value.replace(/\D/g, '');
            // Если значение равно "0", меняем его на "1"
            if (e.target.value === '0') {
                e.target.value = '1';
            }
            if(e.target.value > 3) {
                Fancybox.show([{ src: "#max", type: "inline" }]);
                e.target.value = '3';
            }
            blockMinus(e.target)
        });
        // При потере фокуса, если значение пустое, устанавливаем его в "1"
        el.addEventListener('blur', e => {
            if (e.target.value === '') {
                e.target.value = '1';
            }
            blockMinus(e.target)
        });
    })
    document.addEventListener('click', e=>{
        if(e.target.classList.contains('basket__counter-bt_minus')) {
            e.preventDefault();
            let counterInput = e.target.closest('.basket__counter').querySelector('.basket__counter-text')
            let counterSum = +counterInput.value
            if(counterSum > 1) {
                counterInput.value = --counterSum
            }
            blockMinus(counterInput)
        }
        if(e.target.classList.contains('basket__counter-bt_plus')) {
            e.preventDefault();
            let counterInput = e.target.closest('.basket__counter').querySelector('.basket__counter-text')
            let counterSum = +counterInput.value
            if(counterSum > 2) {
                Fancybox.show([{ src: "#max", type: "inline" }]);
                return false
            }
            counterInput.value = ++counterSum
            blockMinus(counterInput)
        }
    })
}


