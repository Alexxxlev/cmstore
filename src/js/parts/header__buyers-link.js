if(document.querySelector('.header__buyers-link')) {
    const headerBuyers = document.querySelector('.header__buyers');

    
    const buyerLinks = Array.from(headerBuyers.querySelectorAll('.header__buyers-link'));

    
    buyerLinks.forEach(link => {
        link.addEventListener('click', (event) => {
            event.preventDefault(); 
            
            link.classList.toggle('header__buyers-link_active');
        });
    });

    document.addEventListener('click', (event) => {
        
        if (!headerBuyers.contains(event.target) && buyerLinks.some(link => link.classList.contains('header__buyers-link_active'))) {
            buyerLinks.forEach(link => link.classList.remove('header__buyers-link_active'));
        }
    });
}