const medicineSelect = document.getElementById('medicineSelect');
const orderBtn = document.getElementById('orderBtn');
const statusDiv = document.getElementById('status');

// Загрузка списка лекарств при запуске страницы
async function loadMedicines() {
    try {
        const res = await fetch('/api/medicines');
        const medicines = await res.json();
        
        // Наполняем выпадающий список
        medicineSelect.innerHTML = medicines.map(m => 
            `<option value="${m.id}">${m.name} — ${m.price} руб.</option>`
        ).join('');
    } catch (e) {
        console.error("Ошибка загрузки:", e);
        statusDiv.innerHTML = `<div style="color: red">Не удалось загрузить список лекарств</div>`;
    }
}

// Логика нажатия на кнопку "Оформить заказ"
orderBtn.onclick = async () => {
    const fName = document.getElementById('fName').value.trim();
    const lName = document.getElementById('lName').value.trim();
    const phone = document.getElementById('phone').value.trim();
    const address = document.getElementById('address').value.trim();
    const medicineId = medicineSelect.value;

    const statusDiv = document.getElementById('status');
    
    // Функция для показа ошибок в стиле сайта
    const showError = (text) => {
        statusDiv.innerHTML = `
            <div class="status-msg error-msg">
                <span class="icon">⚠️</span> ${text}
            </div>`;
        // Прокрутка к ошибке чтобы пользователь её увидел
        statusDiv.scrollIntoView({ behavior: 'smooth' });
    };

    // Валидация
    if (!/^[a-zA-Zа-яА-ЯёЁ\s\-]+$/.test(fName) || fName.length < 2) {
        showError("Имя должно состоять только из букв (минимум 2)!");
        return;
    }

    if (!/^(\+7|8)[0-9]{10}$/.test(phone.replace(/[\s\-\(\)]/g, ""))) {
        showError("Введите корректный номер телефона (например, +7...)!");
        return;
    }

    // Проверка адреса (минимум 5 букв и 1 цифра для дома)
    if (!/^(?=.*[0-9])(?=.*[a-zA-Zа-яА-ЯёЁ]).{10,}$/.test(address)) {
        showError("Пожалуйста, укажите улицу и номер дома (минимум 10 символов).");
        return;
    }

    // Если всё ок готовим данные
    const data = {
        firstName: fName,
        lastName: lName,
        phone: phone,
        address: address,
        medicineId: medicineId,
        deliveryType: 'home'
    };

    // Блокируем кнопку
    orderBtn.disabled = true;
    orderBtn.innerText = "Проверка безопасности...";

    try {
        const res = await fetch('/api/order', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data)
        });

        const result = await res.json();

        if (res.ok) {
            // Успех
            statusDiv.innerHTML = `
                <div class="status-msg success-msg">
                    <div class="success-header">✅ ЗАКАЗ №${result.orderId} ОФОРМЛЕН</div>
                    <p>Наш курьер свяжется с вами по номеру <b>${data.phone}</b></p>
                    <div class="security-badge">${result.securityNote}</div>
                </div>`;
            
            // Очистка полей
            document.getElementById('fName').value = '';
            document.getElementById('lName').value = '';
            document.getElementById('phone').value = '';
            document.getElementById('address').value = '';
            
        } else {
            // Ошибка
            showError(result.error);
        }
    } catch (e) {
        showError("Критическая ошибка: сервер недоступен.");
    } finally {
        orderBtn.disabled = false;
        orderBtn.innerText = "Оформить заказ на дом";
    }
};

// Запускаем загрузку товаров
loadMedicines();