const counter = document.getElementById('counter');
const resetButton = document.getElementById('reset');
const undoButton = document.getElementById('undo');
const history = document.getElementById('history-btn');

// Функция обновления значения счетчика
function updateCounter(value) {
    const currentValue = parseInt(counter.textContent);
    const newValue = currentValue + value;
    counter.textContent = newValue;

    localStorage.setItem('counter', counter.textContent);
}

let previousValue = 0;

// Функция для сброса счетчика
resetButton.addEventListener('click', () => {
    previousValue = parseInt(counter.textContent);
    counter.textContent = '0';

    localStorage.setItem('counter', '0');
});

// Функция для отмены последнего сброса
undoButton.addEventListener('click', () => {
    // Восстанавливаем предыдущее значение счетчика, если текущее значение равно 0
    if (counter.textContent === '0') {
        counter.textContent = previousValue.toString();
    }
});

// Добавляем обработчики событий для всех кнопок (увеличение/уменьшение значения)
document.querySelectorAll('.button').forEach(button => {
    button.addEventListener('click', () => {
        const id = button.id;

        switch (id) {
            case '-10':
                updateCounter(-10);
                break;
            case '-':
                updateCounter(-1);
                break;
            case '+':
                updateCounter(1);
                break;
            case '+10':
                updateCounter(10);
                break;
        }

        // Ограничиваем значение счетчика от 0 до 999
        let currentValue = parseInt(counter.textContent);
        if (currentValue < 0) {
            counter.textContent = '0';
        } else if (currentValue > 999) {
            counter.textContent = '999';
        }
    });
});

// Обработчик для кнопки "История" (раскрытие записей истории)
history.addEventListener('click', () => {
    // Находим контейнер с классом .history
    const historyContainer = document.querySelector('.history');

    // Проверяем, есть ли класс expanded
    if (historyContainer.classList.contains('expanded')) {
        // Убираем класс, если он есть
        historyContainer.classList.remove('expanded');
    } else {
        // Добавляем класс, если его нет
        historyContainer.classList.add('expanded');
    }
});

// Функция получения истории из localStorage
function getHistory() {
    try {
        const savedHistory = localStorage.getItem('history');
        return savedHistory ? JSON.parse(savedHistory) : [];
    } catch (error) {
        console.error("Ошибка парсинга истории:", error);
        return [];
    }
}

// Функция сохранения истории в localStorage
function saveHistory(history) {
    localStorage.setItem('history', JSON.stringify(history));
}

// Функция добавления записи в историю
function addToHistory() {
    const currentDate = new Date();
    const currentValue = counter.textContent;
    
    let history = getHistory();

    // Проверяем, изменилось ли значение
    if (history.length > 0 && parseInt(history[history.length - 1].value) === parseInt(currentValue)) {
        console.log("Значение счетчика не изменилось, запись не добавляется.");
        return;
    }

    // Ограничиваем количество записей (не более 5)
    if (history.length >= 5) {
        history.shift();
    }

    // Добавляем новую запись и сохраняем
    history.push({ value: currentValue, date: currentDate });
    saveHistory(history);

    console.log("История обновлена:", history);
    updateHistoryRecords();
}

// Функция проверки времени (добавляет запись в 00:00)
function checkTime() {
    const now = new Date();
    if (now.getHours() === 0 && now.getMinutes() === 0) {
        addToHistory();
    }
}

// Проверка каждую минуту
setInterval(checkTime, 60 * 1000);

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
            .padStart(2, '0')}.${date.getFullYear()} ${date.getHours().toString().padStart(2, '0')}`;

        const recordHTML = `<div>${formattedDate} - <span class="highlight">${record.value}</span></div>`;
        historyRecords.innerHTML += recordHTML;
        burgerRecords.innerHTML += recordHTML;
    });

    console.log("Отображение истории обновлено:", history);
}

// Загрузка данных при запуске страницы
document.addEventListener('DOMContentLoaded', () => {
    updateHistoryRecords();

    const savedCounter = localStorage.getItem('counter');
    if (savedCounter !== null) {
        counter.textContent = savedCounter;
    }
});

const burgerIcon = document.getElementById("burger-icon");
const menu = document.querySelector(".burger-menu");

if (burgerIcon && menu) {
    // Обработка клика на иконку бургера
    burgerIcon.addEventListener("click", () => {
        burgerIcon.classList.toggle("active");
        menu.classList.toggle("open");

        // Блокировка скролла
        if (menu.classList.contains("open")) {
            document.body.classList.add("no-scroll");
        } else {
            document.body.classList.remove("no-scroll");
        }
    });

    // Обработка клика вне меню
    document.addEventListener("click", (e) => {
        if (!menu.contains(e.target) && !burgerIcon.contains(e.target)) {
            burgerIcon.classList.remove("active");
            menu.classList.remove("open");
            document.body.classList.remove("no-scroll"); // Убираем блокировку скролла
        }
    });
}
