document.addEventListener("DOMContentLoaded", () => {
    // =====================
    // КОНФИГУРАЦИЯ И СОСТОЯНИЕ
    // =====================
    let currentPage = 1;
    let currentAudio = null; // Переменная для хранения текущего аудио
    
    const state = {
        style: null, ethnicity: null, bodyType: null, breast: null,
        butt: null, hairStyle: null, hairColor: null, eyeColor: null,
        voice: null, relationship: null, age: 25
    };

    const ethnicitySummaryImages = {
        "White": "images/eth_white_summary.png",
        "Asian": "images/eth_asian_summary.png",
        "Arab":  "images/eth_arab_summary.png",
        "Black": "images/eth_black_summary.png",
        "Latina":"images/eth_latina_summary.png"
    };

    const totalPages = 6;

    init();

    function init() {
        updatePageVisibility();
        initAgeSlider();
        setupEventListeners();
    }

    // =====================
    // ОБРАБОТЧИКИ СОБЫТИЙ
    // =====================
    function setupEventListeners() {
        // Делегирование клика для карточек
        document.addEventListener('click', (e) => {
            const card = e.target.closest('.select-block');
            if (card) {
                handleSelection(card);
            }
        });

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
    // ЛОГИКА ВЫБОРА И АУДИО
    // =====================
    function handleSelection(el) {
        const group = el.dataset.group;
        const label = el.dataset.label;

        // 1. Визуальное выделение
        document.querySelectorAll(`.select-block[data-group="${group}"]`)
            .forEach(i => i.classList.remove("selected"));
        el.classList.add("selected");

        // 2. Обновление состояния
        state[group] = label;

        // 3. Проигрывание аудио (если есть data-audio)
        if (el.dataset.audio) {
            playAudio(el.dataset.audio);
        }

        // 4. Проверка кнопки Next
        validateCurrentPage();
    }

    function playAudio(src) {
        // Если что-то уже играет — останавливаем
        if (currentAudio) {
            currentAudio.pause();
            currentAudio.currentTime = 0;
        }
        // Создаем и запускаем новое
        currentAudio = new Audio(src);
        currentAudio.play().catch(e => console.log("Audio play error:", e));
    }

    // =====================
    // НАВИГАЦИЯ
    // =====================
    function nextPage() {
        // Останавливаем звук при уходе со страницы
        if (currentAudio) {
            currentAudio.pause();
            currentAudio = null;
        }

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
        document.querySelectorAll(".page").forEach((p, idx) => {
            if (idx + 1 === currentPage) {
                p.classList.add("active");
            } else {
                p.classList.remove("active");
            }
        });

        updateStatusBar();
        validateCurrentPage();

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
    // ВАЛИДАЦИЯ
    // =====================
    function validateCurrentPage() {
        const activePage = document.querySelector(`.page#page${currentPage}`);
        const nextBtn = activePage.querySelector('[data-action="next"]');
        
        if (!nextBtn) return;

        let isValid = false;
        switch (currentPage) {
            case 1: isValid = !!state.style; break;
            case 2: isValid = !!state.ethnicity; break;
            case 3: isValid = !!state.bodyType && !!state.breast && !!state.butt; break;
            case 4: isValid = !!state.hairStyle && !!state.hairColor && !!state.eyeColor; break;
            case 5: isValid = !!state.voice && !!state.relationship; break;
            default: isValid = true;
        }
        nextBtn.disabled = !isValid;
    }

    // =====================
    // СЛАЙДЕР
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
            const offset = percent * (range.offsetWidth - 20); 
            bubble.style.left = `calc(${percent * 100}% + (${10 - percent * 20}px))`; 
            bubble.textContent = val + "+";
            state.age = val;
        };

        range.addEventListener("input", update);
        window.addEventListener("resize", update);
        update();
    }

    // =====================
    // SUMMARY
    // =====================
    function renderSummary() {
        const container = document.getElementById("summary");
        if (!container) return;
        container.innerHTML = "";

        const fields = [
            { key: "style", label: "Style" },
            { key: "ethnicity", label: "Ethnicity" },
            { key: "age", label: "Age" },
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
            if (field.key === 'age') return; 

            const val = state[field.key];
            if (!val) return;

            const originalBlock = document.querySelector(`.select-block[data-group="${field.key}"][data-label="${val}"]`);
            if (!originalBlock) return;

            const card = document.createElement('div');
            card.className = 'summary-card';

            let mediaContent = '';
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
    }
});
