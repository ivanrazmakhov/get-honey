// =====================
// GLOBAL STATE
// =====================
let state = {};

// Альтернативные картинки для расы в Summary
const ethnicitySummaryImages = {
    "White":  "images/eth_white_summary.png",
    "Asian":  "images/eth_asian_summary.png",
    "Arab":   "images/eth_arab_summary.png",
    "Black":  "images/eth_black_summary.png",
    "Latina": "images/eth_latina_summary.png"
};

// текущая страница
let currentPage = 1;

function goToPage(pageNum) {
    const pages = document.querySelectorAll('.page');

    // снимаем active со всех
    pages.forEach(p => p.classList.remove('active'));

    const target = document.getElementById('page' + pageNum);

    if (target) {
        // если страница найдена — активируем её
        target.classList.add('active');
        currentPage = pageNum;
    } else {
        // если страницы с таким id нет — оставим хотя бы первую,
        // чтобы не был пустой экран
        const first = document.getElementById('page1');
        if (first) {
            first.classList.add('active');
            currentPage = 1;
        }
    }

    updateStatusBar();

    if (currentPage === 6) {
        updateSummary();
    }

    lockNextButton();
}

function nextPage() {
    goToPage(currentPage + 1);
}

function prevPage() {
    goToPage(currentPage - 1);
}

// =====================
// STATUS BAR
// =====================
function updateStatusBar() {
    const dots = document.querySelectorAll(".status-dot");
    dots.forEach((dot, index) => {
        if (index + 1 === currentPage) {
            dot.classList.add("active");
        } else {
            dot.classList.remove("active");
        }
    });
}

// =====================
// HANDLE SELECTION
// =====================
function handleSelection(el) {
    const group = el.dataset.group;
    const label = el.dataset.label;

    // снять предыдущий выбор
    document.querySelectorAll(`.select-block[data-group="${group}"]`)
        .forEach(i => i.classList.remove("selected"));

    // отметить выбранный
    el.classList.add("selected");

    // сохранить
    state[group] = label;

    // активируем кнопку next
    activateNextButton();
}

// Активировать кнопку Next на текущей странице
function activateNextButton() {
    const page = document.querySelector(".page.active");
    if (!page) return;

    const btn = page.querySelector('button[onclick="nextPage()"]');
    if (btn) btn.disabled = false;
}

// Заблокировать кнопку Next при входе на страницу
function lockNextButton() {
    const page = document.querySelector(".page.active");
    if (!page) return;

    const btn = page.querySelector('button[onclick="nextPage()"]');
    if (btn) btn.disabled = true;
}

// =====================
// SUMMARY BUILDER
// =====================
function updateSummary() {
    const container = document.getElementById('summary');
    container.innerHTML = '';

    const groups = [
        "style",
        "ethnicity",
        "bodyType",
        "breast",
        "butt",
        "hairStyle",
        "hairColor",
        "eyeColor",
        "voice",
        "relationship"
    ];

    groups.forEach(group => {
        const value = state[group];
        if (!value) return;

        // находим выбранный блок
        const block = document.querySelector(
            `.select-block.selected[data-group="${group}"]`
        );
        if (!block) return;

        // клонируем карточку
        const clone = block.cloneNode(true);
        clone.classList.remove("selected");
        clone.classList.add("summary-card");

        const media = clone.querySelector("img, video");
if (media) {
    const wrapper = document.createElement("div");
    wrapper.classList.add("media-wrapper");
    media.parentNode.insertBefore(wrapper, media);
    wrapper.appendChild(media);
}

        // 🔁 специальная обработка только для Ethnicity
        if (group === "ethnicity" && ethnicitySummaryImages[value]) {
            const media = clone.querySelector("img, video");

            if (media) {
                // если это <video> — меняем source
                if (media.tagName.toLowerCase() === "video") {
                    const source = media.querySelector("source");
                    if (source) {
                        source.src = ethnicitySummaryImages[value];
                        media.load();
                    }
                } else {
                    // иначе это <img>
                    media.src = ethnicitySummaryImages[value];
                }
            }
        }

        container.appendChild(clone);
    });
}

function initAgeSlider() {
    const range = document.getElementById("ageRange");
    const bubble = document.getElementById("ageBubble");
    if (!range || !bubble) return;

    const updateBubble = () => {
        const min = Number(range.min) || 0;
        const max = Number(range.max) || 100;
        const val = Number(range.value);

        const percent = (val - min) / (max - min); // 0–1
        const trackWidth = range.clientWidth;
        const x = percent * trackWidth;

        bubble.style.left = x + "px";
        bubble.textContent = val + "+";

        // если хочешь сохранить возраст в state:
        if (typeof state !== "undefined") {
            state.age = val;
        }
    };

    range.addEventListener("input", updateBubble);
    window.addEventListener("resize", updateBubble);

    // первое позиционирование
    updateBubble();
}


// =====================
// INITIALIZE EVENT LISTENERS
// =====================
document.addEventListener("DOMContentLoaded", () => {
    // Клики по карточкам
    document.querySelectorAll(".select-block").forEach(block => {
        block.addEventListener("click", () => handleSelection(block));
    });
// === ЛОГИКА СЛАЙДЕРА ВОЗРАСТА НА 2Й СТРАНИЦЕ ===
function initAgeSlider() {
    const range = document.getElementById("ageRange");
    const bubble = document.getElementById("ageBubble");
    if (!range || !bubble) return;

    const updateBubble = () => {
        const min = Number(range.min) || 0;
        const max = Number(range.max) || 100;
        const val = Number(range.value);

        const percent = (val - min) / (max - min); // 0–1
        const trackWidth = range.offsetWidth;

        // позиция по ширине
        const x = percent * trackWidth;
        bubble.style.left = x + "px";

        // текст
        bubble.textContent = val + "+";
    };

    range.addEventListener("input", updateBubble);
    window.addEventListener("resize", updateBubble);
    updateBubble();
}

// инициализация после загрузки страницы
document.addEventListener("DOMContentLoaded", () => {
    // твои существующие привязки к .select-block и т.п.
    document.querySelectorAll(".select-block").forEach(block => {
        block.addEventListener("click", () => handleSelection(block));
    });

    initAgeSlider();
    goToPage(1);
});

    function goToPage(pageNum) {
    // твоя текущая логика скрытия/показа:
    currentPage = pageNum;
    document.querySelectorAll(".page").forEach(p => p.classList.remove("active"));
    const page = document.getElementById("page" + pageNum);
    if (page) page.classList.add("active");

    updateStatusBar();
    lockNextButton();

    if (pageNum === 2) {
        initAgeSlider();
    }
    if (pageNum === 6) {
        updateSummary();
    }
}
