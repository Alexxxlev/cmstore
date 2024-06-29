document.addEventListener('DOMContentLoaded', function() {
    if(document.querySelector('.min-price')) {
        class PriceRange extends HTMLElement {
            constructor() {
                super();
            }
        
            connectedCallback() {
                // Элементы
                this.elements = {
                    container: this.querySelector('.range-container'),
                    track: this.querySelector('.range-container > div'),
                    from: this.querySelector('input[type="range"]:first-of-type'),
                    to: this.querySelector('input[type="range"]:last-of-type'),
                    minInput: this.querySelector('.min-price'),
                    maxInput: this.querySelector('.max-price'),
                };
            
                // Event listeners
                this.elements.from.addEventListener('input', this.handleInput.bind(this));
                this.elements.to.addEventListener('input', this.handleInput.bind(this));
                this.elements.minInput.addEventListener('input', this.handleTextInput.bind(this));
                this.elements.maxInput.addEventListener('input', this.handleTextInput.bind(this));
            
                // Update the DOM
                this.updateDom();
            
                // Вызываем вашу функцию для установки ширины input при загрузке
                setInputWidth(this.elements.minInput);
                setInputWidth(this.elements.maxInput);
            }
        
            disconnectedCallback() {
                delete this.elements;
            }
        
            get from() {
                return parseInt(this.elements.from.value);
            }
            get to() {
                return parseInt(this.elements.to.value);
            }
        
            handleInput(event) {
                if (parseInt(this.elements.to.value) - parseInt(this.elements.from.value) <= 1) {
                    if (event.target === this.elements.from) {
                        this.elements.from.value = (parseInt(this.elements.to.value) - 1);
                    } else if (event.target === this.elements.to) {
                        this.elements.to.value = (parseInt(this.elements.from.value) + 1);
                    }
                }
            
                // Если 'from' больше 'to', меняем их местами
                if (parseInt(this.elements.from.value) > parseInt(this.elements.to.value)) {
                    [this.elements.from.value, this.elements.to.value] = [this.elements.to.value, this.elements.from.value];
                    // Обновляем DOM после обмена значениями
                    this.updateDom();
                }
            
                // Обновляем текстовые поля
                this.drawOutput();
            
                // Вызываем вашу функцию для обработки ширины input
                setInputWidth(this.elements.minInput);
                setInputWidth(this.elements.maxInput);
            }
            
            handleTextInput(event) {
                const value = parseInt(event.target.value);
                if (!isNaN(value)) {
                    if (event.target === this.elements.minInput) {
                        this.elements.from.value = value;
                    } else if (event.target === this.elements.maxInput) {
                        this.elements.to.value = value;
                    }
                }
            
                // Если 'from' больше 'to', меняем их местами
                if (parseInt(this.elements.from.value) > parseInt(this.elements.to.value)) {
                    [this.elements.from.value, this.elements.to.value] = [this.elements.to.value, this.elements.from.value];
                    // Обновляем DOM после обмена значениями
                    this.updateDom();
                }
            
                // Обновляем текстовые поля
                this.drawOutput();
            
                // Вызываем вашу функцию для обработки ширины input
                setInputWidth(this.elements.minInput);
                setInputWidth(this.elements.maxInput);
            }
        
            updateDom() {
                this.drawFill();
                this.drawOutput();
            }
        
            drawFill() {
                const percent1 = (this.elements.from.value / this.elements.from.max) * 100,
                    percent2 = (this.elements.to.value / this.elements.to.max) * 100;
            
                this.elements.track.style.background = `linear-gradient(to right, var(--track-color) ${percent1}%, var(--track-highlight-color) ${percent1}%, var(--track-highlight-color) ${percent2}%, var(--track-color) ${percent2}%)`;
            }
        
            drawOutput() {
                this.elements.minInput.value = `${this.elements.from.value}`;
                this.elements.maxInput.value = `${this.elements.to.value}`;
            }
        }
        
        customElements.define('price-range', PriceRange);
        // Добавляем обработчик для изменения ширины input
        const minInput = document.querySelector('.min-price');
        const maxInput = document.querySelector('.max-price');
        
        minInput.addEventListener('input', function() {
            setInputWidth(minInput);
        });
        
        maxInput.addEventListener('input', function() {
            setInputWidth(maxInput);
        });
        
        function setInputWidth(input) {
            const textWidth = getTextWidth(input.value, getComputedStyle(input).font);
            input.style.width = (textWidth + 10) + 'px';
        }
        
        function getTextWidth(text, font) {
            const canvas = document.createElement('canvas');
            const context = canvas.getContext('2d');
            context.font = font;
            const metrics = context.measureText(text);
            return metrics.width;
        }
    }
});