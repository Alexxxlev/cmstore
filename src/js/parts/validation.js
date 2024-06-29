if(document.querySelector('.formValid')) {
    const formHandle = document.querySelectorAll('.formValid')
    const options = {
        rules: {
			phonemask: function (value) {
                return value.replace(/\D/g, '').length == 11
			},
			reppassword: function (value) {
                const repPass = document.querySelector('input[name="newpassword"]').value
				return (value == repPass);
			},
			mail: function (value) {
                const mailMask = emailRegExp = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                return (mailMask.test(value));
			},
		},
        messages: {
            en: {
                required:{
                    empty: "Заполните поле",
                    incorrect: 'Неправильно заполнено поле'
                },
                phonemask: {
                    empty: "Введите номер телефона",
                    incorrect: 'Неправильный номер телефона'
                },
                mail: {
                    empty: 'Введите почту',
                    incorrect: 'Неверный формат электронной почты'
                },
                name: {
                    incorrect: 'Введите ваше имя',
                    incorrect: 'Неправильно заполнено поле'
                },
                minlength: {
                    incorrect: 'Минимум {0} символа',
                    incorrect: 'Неправильно заполнено поле'
                },
                reppassword: {
                    incorrect: 'Пароли не совпадают',
                    incorrect: 'Неправильно заполнено поле'
                }
            }
        }
    };
    formHandle.forEach(form=>{
        new Validator(form, function (err, res) {
            if(res && form.classList.contains('footer__callback-form')) {
                document.querySelector('.footer__callback-send').classList.add('footer__callback-send_active')
                setTimeout(() => {
                    document.querySelector('.footer__callback-send').classList.remove('footer__callback-send_active')
                }, 5000);
                return false
            }
            return res;
        }, options);
    })
    
    // Находим все формы на странице
    const forms = document.querySelectorAll('.modal__form');

    // Функция для проверки валидности поля
    function isFieldValid(field) {
        const rule = field.dataset.rule;
        const value = field.value.trim();
        
        // Проверяем, есть ли у поля класс ошибки и пустое ли поле
        return !field.classList.contains('error') && (value !== '' || !rule.includes('required'));
    }

    // Функция для проверки всех полей формы
    function isFormValid(form) {
        const fields = form.querySelectorAll('[data-rule]');
        return Array.from(fields).every(isFieldValid);
    }

    // Функция для блокировки/разблокировки кнопки отправки
    function toggleSubmitButton(form) {
        const submitButton = form.querySelector('.form-button');
        submitButton.disabled = !isFormValid(form);
    }

    // Для каждой формы добавляем обработчики событий и проверяем состояние кнопки отправки
    forms.forEach(form => {
        const fields = form.querySelectorAll('[data-rule]');
        
        fields.forEach(field => {
            field.addEventListener('keyup', () => {
                setTimeout(() => {
                    toggleSubmitButton(form)
                }, 500);
            });
        });
    
        toggleSubmitButton(form);
    });
}