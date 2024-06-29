if(document.querySelectorAll('.tabs').length) {
    document.querySelectorAll('.tabs').forEach(tabs=>{
        const tabsListItems = tabs.querySelectorAll('.tabs__li');
        const tabsContainers = tabs.querySelectorAll('.tabs__container');
        
        tabsListItems.forEach((tab, index) => {
            tab.addEventListener('click', () => {
                tabsListItems.forEach(item => item.classList.remove('_current'));
                tabsContainers.forEach(container => container.classList.remove('_active'));
        
                tab.classList.add('_current');
                tabsContainers[index].classList.add('_active');
            });
        });
    })
    if(document.querySelectorAll('a[data-tabs]').length) {
        const tabLinks = document.querySelectorAll('[data-tabs]');
        tabLinks.forEach(link => {
            link.addEventListener('click', function(event) {
                event.preventDefault();
                let targetTabId = this.getAttribute('data-tabs');
                
                // Убираем символ '#' из идентификатора, если он присутствует
                if (targetTabId.startsWith('#')) {
                    targetTabId = targetTabId.slice(1);
                }

                const targetTabs = document.querySelectorAll(`[data-id="${targetTabId}"]`);

                let validTargetTab = null;

                // Проверяем каждый элемент с атрибутом data-id="${targetTabId}"
                targetTabs.forEach(tab => {
                    if (!hasDisplayNoneParent(tab)) {
                        validTargetTab = tab;
                        tab.click()
                    }
                });

                if (validTargetTab) {
                    const yOffset = -180; // смещение относительно верха экрана, чтобы учесть фиксированное меню, если есть
                    const y = validTargetTab.getBoundingClientRect().top + window.pageYOffset + yOffset;
                    window.scrollTo({ top: y, behavior: 'smooth' });
                } 
            });
        });
        // Функция, которая проверяет, имеет ли элемент родительский элемент с display: none
        function hasDisplayNoneParent(element) {
            let parent = element.parentElement;
            while (parent) {
                const styles = window.getComputedStyle(parent);
                if (styles.getPropertyValue('display') === 'none') {
                    return true;
                }
                parent = parent.parentElement;
            }
            return false;
        }
    }
}