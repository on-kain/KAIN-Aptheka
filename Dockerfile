# Используем официальный образ Node.js
FROM node:18

# Создаем рабочую директорию внутри контейнера
WORKDIR /usr/src/app

# Копируем файлы package.json и package-lock.json
COPY package*.json ./

# Устанавливаем зависимости
RUN npm install

# Копируем весь код проекта (включая папку public)
COPY . .

# Открываем порт 8080
EXPOSE 8080

# Команда для запуска приложения
CMD ["node", "index.js"]