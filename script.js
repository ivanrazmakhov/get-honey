document.addEventListener("DOMContentLoaded", () => {
    // =====================
    // КОНФИГУРАЦИЯ И СОСТОЯНИЕ
    // =====================
    let currentPage = 1;
    
    const state = {
        style: null, ethnicity: null, bodyType: null, breast: null,
        butt: null, hairStyle: null, hairColor: null, eyeColor: null,
        voice: null, relationship: null, age: 25 // Значение по умолчанию
    };

    const ethnicitySummaryImages = {
        "White": "images/eth_white_summary.png",
        "Asian": "images/eth_asian_summary.png",
        "Arab":  "images/eth_arab_summary.png",
        "Black": "images/eth_black_summary.png",
        "Latina":"images/eth_latina_summary.png"
    };

    const totalPages = 6;

    // =====================
    // ИНИЦИАЛИЗАЦИЯ
    // =====================
    init();

    function init() {
        updatePageVisibility();
        initAgeSlider();
        setupEventListeners();
    }

    // =====================
    // ОБРАБОТЧИКИ СОБЫТИЙ (Event Delegation)
    // =====================
    function setupEventListeners() {
        // Клик по карточкам (делегирование)
        document.addEventListener('click', (e) => {
            const card = e.target.closest('.select-block');
            if (card) {
                handleSelection(card);
            }
        });

        // Кнопки навигации
        document.querySelectorAll('[data-action="next"]').forEach(btn => {
            btn.addEventListener('click', nextPage);
        });
        
        document.querySelectorAll('[data-action="prev"]').forEach(btn => {
            btn.addEventListener('click', prevPage);
        });
        
        document.querySelectorAll('[data-action="generate"]').forEach(btn => {
            btn.addEventListener('click', () => alert("AI Generation Started..."));
        });
    }

    // =====================
    // ЛОГИКА ВЫБОРА
    // =====================
    function handleSelection(el) {
        const group = el.dataset.group;
        const label = el.dataset.label;

        // Визуальное выделение
        document.querySelectorAll(`.select-block[data-group="${group}"]`)
            .forEach(i => i.classList.remove("selected"));
        el.classList.add("selected");

        // Обновление состояния
        state[group] = label;

        // Проверка валидации текущей страницы
        validateCurrentPage();
    }

    // =====================
    // НАВИГАЦИЯ
    // =====================
    function nextPage() {
        if (currentPage < totalPages) {
            currentPage++;
            updatePageVisibility();
        }
    }

    function prevPage() {
        if (currentPage > 1) {
            currentPage--;
            updatePageVisibility();
        }
    }

    function updatePageVisibility() {
        // Скрываем все, показываем текущую
        document.querySelectorAll(".page").forEach((p, idx) => {
            if (idx + 1 === currentPage) {
                p.classList.add("active");
            } else {
                p.classList.remove("active");
            }
        });

        updateStatusBar();
        validateCurrentPage(); // Проверяем кнопку Next при смене страницы

        if (currentPage === 6) {
            renderSummary();
        }
    }

    function updateStatusBar() {
        document.querySelectorAll(".status-dot").forEach((dot, index) => {
            if (index + 1 === currentPage) dot.classList.add("active");
            else dot.classList.remove("active");
        });
    }

    // =====================
    // ВАЛИДАЦИЯ (LOCK/UNLOCK NEXT)
    // =====================
    function validateCurrentPage() {
        const activePage = document.querySelector(`.page#page${currentPage}`);
        const nextBtn = activePage.querySelector('[data-action="next"]');
        
        if (!nextBtn) return; // На последней странице нет кнопки Next

        let isValid = false;

        // Логика валидации для каждой страницы
        switch (currentPage) {
            case 1: isValid = !!state.style; break;
            case 2: isValid = !!state.ethnicity; break; // Возраст есть по дефолту
            case 3: isValid = !!state.bodyType && !!state.breast && !!state.butt; break;
            case 4: isValid = !!state.hairStyle && !!state.hairColor && !!state.eyeColor; break;
            case 5: isValid = !!state.voice && !!state.relationship; break;
            default: isValid = true;
        }

        nextBtn.disabled = !isValid;
    }

    // =====================
    // СЛАЙДЕР ВОЗРАСТА
    // =====================
    function initAgeSlider() {
        const range = document.getElementById("ageRange");
        const bubble = document.getElementById("ageBubble");
        if (!range || !bubble) return;

        const update = () => {
            const val = range.value;
            const min = range.min || 18;
            const max = range.max || 55;
            const percent = (val - min) / (max - min);
            
            // Двигаем пузырек
            const offset = percent * (range.offsetWidth - 20); // -20 это ширина thumb примерно
            bubble.style.left = `calc(${percent * 100}% + (${10 - percent * 20}px))`; 
            bubble.textContent = val + "+";
            state.age = val;
        };

        range.addEventListener("input", update);
        window.addEventListener("resize", update);
        update(); // Первый запуск
    }

    // =====================
    // SUMMARY GENERATION
    // =====================
    function renderSummary() {
        const container = document.getElementById("summary");
        if (!container) return;
        container.innerHTML = "";

        const fields = [
            { key: "style", label: "Style" },
            { key: "ethnicity", label: "Ethnicity" },
            { key: "age", label: "Age", isText: true }, // Пример текстового поля
            { key: "bodyType", label: "Body" },
            { key: "breast", label: "Breast" },
            { key: "butt", label: "Butt" },
            { key: "hairStyle", label: "Hair Style" },
            { key: "hairColor", label: "Hair Color" },
            { key: "eyeColor", label: "Eyes" },
            { key: "voice", label: "Voice" },
            { key: "relationship", label: "Relation" }
        ];

        fields.forEach(field => {
            if (field.key === 'age') return; // Возраст обычно не имеет картинки, но можно добавить

            const val = state[field.key];
            if (!val) return;

            // Находим оригинальный элемент, чтобы взять картинку
            const originalBlock = document.querySelector(`.select-block[data-group="${field.key}"][data-label="${val}"]`);
            if (!originalBlock) return;

            const card = document.createElement('div');
            card.className = 'summary-card';

            // Обработка медиа
            let mediaContent = '';
            // Спец. условие для Ethnicity Summary Image
            if (field.key === "ethnicity" && ethnicitySummaryImages[val]) {
                mediaContent = `<img src="${ethnicitySummaryImages[val]}" alt="${val}">`;
            } else {
                const img = originalBlock.querySelector('img');
                const vid = originalBlock.querySelector('video');
                if (img) mediaContent = `<img src="${img.src}" alt="${val}">`;
                if (vid) mediaContent = `<video src="${vid.querySelector('source').src}" muted playsinline></video>`;
            }

            card.innerHTML = `
                <div class="media-wrapper">${mediaContent}</div>
                <p>${field.label}: ${val}</p>
            `;
            container.appendChild(card);
        });
        
        // Добавим карточку возраста отдельно, если нужно, или просто текстом
    }
});
