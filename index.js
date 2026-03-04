const express = require('express');
const { Pool } = require('pg');
require('dotenv').config();

const app = express();
const pool = new Pool({
    user: process.env.DB_USER,
    host: process.env.DB_HOST,
    database: process.env.DB_NAME,
    password: process.env.DB_PASSWORD,
    port: process.env.DB_PORT,
});

app.use(express.static('public'));
app.use(express.json());

// Получить список лекарств для витрины
app.get('/api/medicines', async (req, res) => {
    try {
        const result = await pool.query('SELECT * FROM medicines');
        res.json(result.rows);
    } catch (err) {
        res.status(500).json({ error: "Ошибка при получении товаров" });
    }
});

// Оформить заказ
app.post('/api/order', async (req, res) => {
    try {
        const rawData = req.body;
        
        // Валидация
        const validation = guard.validate(rawData);
        if (!validation.isValid) {
            return res.status(400).json({ 
                error: validation.errors.join(" | ") 
            });
        }

        const safeData = {
            firstName: guard.sanitize(rawData.firstName),
            lastName: guard.sanitize(rawData.lastName),
            address: guard.sanitize(rawData.address),
            phone: rawData.phone,
            medicineId: rawData.medicineId,
            deliveryType: 'home'
        };

        const medicine = await pharmacy.getMedicineById(safeData.medicineId);
        const securityReport = guard.analyzeOrder(safeData, medicine);

        const orderId = await pharmacy.createOrder(safeData, safeData.medicineId, safeData.deliveryType);

        res.status(201).json({
            success: true,
            orderId: orderId,
            securityNote: securityReport.recommendation // Передаем рекомендацию тут
        });

    } catch (e) {
        console.error(e);
        res.status(500).json({ error: "Внутренняя ошибка сервера" });
    }
});

const PORT = 8080;
app.listen(PORT, () => console.log(`Pharmacy server run on ${PORT}`));