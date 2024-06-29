if(document.querySelectorAll('.box-hide').length) {
    const boxHideLinks = document.querySelectorAll('.box-hide__link');

    document.addEventListener('click', event=>{
        if(event.target.classList.contains('box-hide__link')) {
            event.preventDefault();
            const boxHide = event.target.parentNode.previousElementSibling;
            if (boxHide.style.display === 'none') {
                boxHide.style.display = 'block';
                event.target.textContent = event.target.getAttribute('data-hide');
            } else {
                boxHide.style.display = 'none';
                event.target.textContent = event.target.getAttribute('data-vis');
            }
        }
    })
}