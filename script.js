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

let hist_arr = [];

// Функция для добавления записи в массив
function addToArray() {
    let currentDate = new Date();
    let currentValue = counter.textContent;

    // Проверяем, если в массиве уже есть записи
    if (hist_arr.length > 0) {
        // Сравниваем текущее значение с последним записанным значением
        let lastRecord = hist_arr[hist_arr.length - 1];
        if (lastRecord.value === currentValue) {
            console.log("Значение счетчика не изменилось, запись не добавляется.");
            return; 
        }
    }

    // Если в массиве уже 5 записей, удаляем первую (самую старую)
    if (hist_arr.length >= 5) {
        hist_arr.shift();
    }

    // Добавляем новую запись
    hist_arr.push({ value: currentValue, date: currentDate });

    // Сохраняем массив в localStorage
    localStorage.setItem('history', JSON.stringify(hist_arr));

    console.log("Saved to localStorage:", localStorage.getItem('history'));

    // Обновляем отображение истории
    updateHistoryRecords();
}

// Функция для проверки времени
function checkTime() {
    let now = new Date();
    if (now.getHours() === 0 && now.getMinutes() === 0) {
        addToArray();
    }
}

// Проверяем время каждую минуту
setInterval(checkTime, 60 * 1000);

// Функция обновления отображения истории
function updateHistoryRecords() {
    const historyRecords = document.querySelector('.history-records');
    const burgerRecords = document.querySelector('.burger-records');
    historyRecords.innerHTML = ''; // Очищаем старые записи
    burgerRecords.innerHTML = '';

    console.log("Rendering hist_arr:", hist_arr);

    hist_arr.forEach(record => {
        const date = new Date(record.date);
        const formattedDate = `${date.getDate().toString().padStart(2, '0')}.${(date.getMonth() + 1)
            .toString()
            .padStart(2, '0')}.${date.getFullYear()} ${date.getHours().toString().padStart(2, '0')}`;

        const recordHTML = `
            <div>${formattedDate} - <span class="highlight">${record.value}</span></div>
        `;
        historyRecords.innerHTML += recordHTML;
        burgerRecords.innerHTML += recordHTML;
    });
}

// Загрузка данных из localStorage при загрузке страницы
document.addEventListener('DOMContentLoaded', () => {
    const savedHistory = localStorage.getItem('history');

    if (savedHistory) {
        try {
            hist_arr = JSON.parse(savedHistory);
            if (!Array.isArray(hist_arr)) {
                hist_arr = []; // Если почему-то загрузилось не массивом, сбрасываем
            }
        } catch (error) {
            console.error("Ошибка парсинга истории:", error);
            hist_arr = []; // Если JSON был некорректен, сбрасываем
        }
    } else {
        hist_arr = []; // Если данных нет, создаем пустой массив
    }

    console.log("Parsed hist_arr:", hist_arr);
    updateHistoryRecords(); // Обновляем отображение истории
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
