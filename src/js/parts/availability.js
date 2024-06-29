const mapsAvailability = ()=>{
    ymaps.ready(() => {
        const createMap = () => {
            const map = new ymaps.Map("map-availability", {
                center: [45.056021, 39.020867], 
                zoom: 10
            });

            return map;
        };

        const map = createMap();

        
        window.addEventListener('resize', () => {
            setTimeout(() => {
                map.container.fitToViewport(map.container.getSize());
            }, 500); 
        });

        function getPanTo(zoomLevel) {
            if (zoomLevel < 10) {
                return .002; 
            } else if (zoomLevel <= 15) {
                return .0075; 
            } else if (zoomLevel >= 15) {
                return .00005; 
            } else {
                return .001; 
            }
        };
        
        // Создаем макет кастомного балуна
        const customBalloonLayout = ymaps.templateLayoutFactory.createClass(
            '<div class="ballon">$[[options.contentLayout]]</div>'
        );

        // Создаем кастомный балун
        const customBalloonContentLayout = ymaps.templateLayoutFactory.createClass(
            '<p>$[properties.balloonContent]</p>'
        );

        const createPlacemark = (address, content, map) => {
            ymaps.geocode(address, {
                boundedBy: [[45.084989, 38.927612], [45.016677, 39.042607]] // Границы Краснодара
            }).then((res) => {
                const firstGeoObject = res.geoObjects.get(0);
                const placemark = new ymaps.Placemark(firstGeoObject.geometry.getCoordinates(), {
                    hintContent: address,
                    balloonHeader: address,
                    balloonContent: content,
                }, {
                    iconLayout: 'default#image',
                    iconImageHref: 'img/icon/pointer.svg', // Путь к кастомной метке
                    iconImageSize: [24, 32], // Размеры кастомной метке
                    iconImageOffset: [-11, -16],
                    balloonLayout: customBalloonLayout,
                    balloonContentLayout: customBalloonContentLayout,
                    balloonPanelMaxMapArea: 0,
                    hideIconOnBalloonOpen: false,
                });
                map.geoObjects.add(placemark);


                // Привязываем событие закрытия балуна к функции
                // placemark.balloon.events.add('close', function () {
                //     // Обходим все метки и изменяем размер и смещение иконок
                //     map.geoObjects.each(function (obj) {
                //         obj.options.set('iconImageSize', [24, 32]);
                //         obj.options.set('iconImageOffset', [-12, -16]);
                //     });
                // });

                placemark.events.add('click', () => {
                    document.querySelectorAll('.availability__li').forEach(item => {
                        item.classList.remove('availability__li_active');
                    });
                
                    const addressElement = [...document.querySelectorAll('.availability__address')].find(element => element.textContent.includes(address));
                    if (addressElement) {
                        addressElement.closest('.availability__li').classList.add('availability__li_active');
                    }
                
                    document.querySelector('.availability__button-bt').classList.remove('_disabled');
                    map.geoObjects.each(function (obj) {
                        obj.options.set('iconImageSize', [24, 32]);
                        obj.options.set('iconImageOffset', [-12, -16]);
                    });
                    placemark.options.set('iconImageSize', [45, 60]);
                    placemark.options.set('iconImageOffset', [-22.5, -60]);
                    const coords = placemark.geometry.getCoordinates();
                    const zoomLevel = map.getZoom()
                    const coordPan = coords[0] - getPanTo(zoomLevel)
                    map.panTo([coordPan, coords[1]], {
                        flying: true,
                        duration: 1000,
                    });
                    placemark.balloon.open();
                });
            });
        };

        // Создаем все метки на карте
        const availabilityItems = document.querySelectorAll('.availability__li');
        availabilityItems.forEach(item => {
            const address = item.querySelector('.availability__address').textContent;
            const content = item.innerHTML
            createPlacemark(address, content, map);
        });

        // Обработчик клика на элементы списка
        availabilityItems.forEach(item => {
            item.addEventListener('click', () => {
                if(document.querySelector('.availability__li_active')) {
                    document.querySelector('.availability__li_active').classList.remove('availability__li_active')
                }
                item.classList.add('availability__li_active')
                document.querySelector('.availability__button-bt').classList.remove('_disabled')
                const address = item.querySelector('.availability__address').textContent;
                map.geoObjects.each(obj => {
                    if (obj.properties.get('hintContent') === address) {
                        map.geoObjects.each(function (objc) {
                            objc.options.set('iconImageSize', [24, 32]);
                            objc.options.set('iconImageOffset', [-12, -16]);
                        });
                        obj.options.set('iconImageSize', [45, 60]);
                        obj.options.set('iconImageOffset', [-22.5, -60]);
                        map.panTo(obj.geometry.getCoordinates(), {
                            flying: true,
                            duration: 1000
                        });
                        obj.balloon.open();
                    }
                });
            });
        });

    });
}
document.addEventListener('click', e=>{
    if(e.target.classList.contains('availability-tabs__link')) {
        e.preventDefault()
        document.querySelectorAll('.availability-tabs__link').forEach(el=>{
            el.classList.remove('_current')
        })
        e.target.classList.add('_current')
        if(e.target.classList.contains('link-map')) {
            document.querySelector('.availability-tabs__box_map').classList.add('_show')
            document.querySelector('.availability-tabs__box_list-box').classList.remove('_show')
        }
        if(e.target.classList.contains('link-list')) {
            document.querySelector('.availability-tabs__box_list-box').classList.add('_show')
            document.querySelector('.availability-tabs__box_map').classList.remove('_show')
        }
    }
})