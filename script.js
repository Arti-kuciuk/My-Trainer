const counter = document.getElementById('counter');
const resetButton = document.getElementById('reset');
const undoButton = document.getElementById('undo');
const history = document.getElementById('history-btn');

let previousValue = 0;

// Функция обновления значения счетчика
function updateCounter(value) {
    let currentValue = parseInt(counter.textContent);
    let newValue = currentValue + value;

    // Ограничиваем значение от 0 до 999
    newValue = Math.min(999, Math.max(0, newValue));

    counter.textContent = newValue;
    localStorage.setItem('counter', newValue);
}

// Функция получения истории из localStorage
function getHistory() {
    const savedHistory = localStorage.getItem('history');
    return savedHistory ? JSON.parse(savedHistory) : [];
}

// Функция сохранения истории в localStorage
function saveHistory(history) {
    localStorage.setItem('history', JSON.stringify(history));
}

// Функция добавления записи в историю (не более 5 записей)
function addToHistory() {
    const currentDate = new Date();
    const currentValue = parseInt(counter.textContent);

    let history = getHistory();

    // Проверяем, есть ли уже записи в истории
    if (history.length > 0) {
        const lastRecord = history[history.length - 1];
        const lastRecordDate = new Date(lastRecord.date);
        const lastRecordValue = parseInt(lastRecord.value);
        
        // Если запись за сегодня уже существует, обновляем её значение
        if (
            lastRecordDate.getDate() === currentDate.getDate() &&
            lastRecordDate.getMonth() === currentDate.getMonth() &&
            lastRecordDate.getFullYear() === currentDate.getFullYear()
        ) {
            // Обновляем значение только если оно изменилось
            if (currentValue !== lastRecordValue) {
                lastRecord.value = currentValue;
                saveHistory(history);
                updateHistoryRecords();
            }
            return;
        }
        
        // Не добавляем новую запись, если значение не изменилось с последней записи
        if (currentValue === lastRecordValue) {
            return;
        }
    }

    // Ограничиваем количество записей (макс. 5)
    if (history.length >= 5) {
        history.shift();
    }

    // Добавляем новую запись и сохраняем
    history.push({ value: currentValue, date: currentDate });
    saveHistory(history);
    updateHistoryRecords();
}

// Функция обновления интерфейса истории
function updateHistoryRecords() {
    const historyRecords = document.querySelector('.history-records');
    const burgerRecords = document.querySelector('.burger-records');

    const history = getHistory();
    historyRecords.innerHTML = '';
    burgerRecords.innerHTML = '';

    history.forEach(record => {
        const date = new Date(record.date);
        const formattedDate = `${date.getDate().toString().padStart(2, '0')}.${(date.getMonth() + 1)
        .toString()
        .padStart(2, '0')}.${date.getFullYear()}`;
        
        const recordHTML = `<div>${formattedDate} - <span class="highlight">${record.value}</span></div>`;
        historyRecords.innerHTML += recordHTML;
        burgerRecords.innerHTML += recordHTML;
    });
}

// Обработчик кнопки сброса
resetButton.addEventListener('click', () => {
    previousValue = parseInt(counter.textContent);
    counter.textContent = '0';
    localStorage.setItem('counter', '0');
});

// Обработчик кнопки отмены сброса
undoButton.addEventListener('click', () => {
    if (counter.textContent === '0') {
        counter.textContent = previousValue.toString();
        localStorage.setItem('counter', previousValue);
    }
});

// Добавляем обработчики событий для всех кнопок (+/-)
document.querySelectorAll('.button').forEach(button => {
    button.addEventListener('click', () => {
        const id = button.id;
        switch (id) {
            case '-10': updateCounter(-10); break;
            case '-': updateCounter(-1); break;
            case '+': updateCounter(1); break;
            case '+10': updateCounter(10); break;
        }
    });
});

// Обработчик кнопки "История" (раскрытие/скрытие истории)
history.addEventListener('click', () => {
    document.querySelector('.history').classList.toggle('expanded');
});

// Проверка времени для автоматического сохранения истории в 00:00
function checkTime() {
    const now = new Date();
    if (now.getHours() === 16 && now.getMinutes() === 30) {
        addToHistory();
    }
}
setInterval(checkTime, 60 * 1000); // Проверяем каждую минуту

// Загрузка данных при запуске страницы
document.addEventListener('DOMContentLoaded', () => {
    updateHistoryRecords();

    // Восстановление счетчика
    const savedCounter = localStorage.getItem('counter');
    if (savedCounter !== null) {
        counter.textContent = savedCounter;
    }

    // Добавляем запись в историю, если ее нет за сегодняшний день
    addToHistory();
});

// Бургер-меню
const burgerIcon = document.getElementById("burger-icon");
const menu = document.querySelector(".burger-menu");

if (burgerIcon && menu) {
    burgerIcon.addEventListener("click", () => {
        burgerIcon.classList.toggle("active");
        menu.classList.toggle("open");
        document.body.classList.toggle("no-scroll");
    });

    document.addEventListener("click", (e) => {
        if (!menu.contains(e.target) && !burgerIcon.contains(e.target)) {
            burgerIcon.classList.remove("active");
            menu.classList.remove("open");
            document.body.classList.remove("no-scroll");
        }
    });
}
