class SecurityGuard {
    constructor() {
        this.nameRegex = /^[a-zA-Zа-яА-ЯёЁ\s\-]+$/;
        this.phoneRegex = /^(\+7|8)[0-9]{10}$/;
        // Регулярка для адреса хотя бы 5 букв и хотя бы 1 цифра
        this.addressRegex = /^(?=.*[0-9])(?=.*[a-zA-Zа-яА-ЯёЁ]).{10,}$/;
    }

    validate(data) {
        const errors = [];

        if (!this.nameRegex.test(data.firstName)) errors.push("Имя должно быть настоящим");
        
        // Очищаем телефон от лишних знаков перед проверкой
        const cleanPhone = data.phone.replace(/[\s\-\(\)]/g, "");
        if (!this.phoneRegex.test(cleanPhone)) errors.push("Телефон должен быть в формате +79991112233");

        // Продвинутая проверка адреса
        if (!this.addressRegex.test(data.address)) {
            errors.push("Адрес должен содержать название улицы и номер дома (минимум 10 символов)");
        }

        // Проверка
        if (/(.)\1{3,}/.test(data.address) || /[^а-яА-ЯёЁa-zA-Z0-9\s,.\-]/.test(data.address)) {
            errors.push("Адрес содержит подозрительные символы или повторы");
        }

        return {
            isValid: errors.length === 0,
            errors: errors
        };
    }

    analyzeOrder(orderData, medicine) {
        let riskScore = 0;
        if (medicine && medicine.category === 'antibiotics') riskScore += 50;
        
        return {
            score: riskScore,
            recommendation: riskScore >= 50 ? "⚠️ Требуется проверка рецепта курьером" : "✅ Одобрено к доставке"
        };
    }

    sanitize(text) {
        if (typeof text !== 'string') return "";
        return text.trim().replace(/</g, "&lt;").replace(/>/g, "&gt;");
    }
}
module.exports = new SecurityGuard();