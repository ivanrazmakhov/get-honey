// =====================
// ГЛОБАЛЬНОЕ СОСТОЯНИЕ
// =====================
let currentPage = 1;

const state = {
    style: null,
    ethnicity: null,
    bodyType: null,
    breast: null,
    butt: null,
    hairStyle: null,
    hairColor: null,
    eyeColor: null,
    voice: null,
    relationship: null,
    age: null
};

// Альтернативные картинки для Ethnicity в Summary
const ethnicitySummaryImages = {
    "White":  "images/eth_white_summary.png",
    "Asian":  "images/eth_asian_summary.png",
    "Arab":   "images/eth_arab_summary.png",
    "Black":  "images/eth_black_summary.png",
    "Latina": "images/eth_latina_summary.png"
};

// =====================
// НАВИГАЦИЯ ПО СТРАНИЦАМ
// =====================
function goToPage(pageNum) {
    const pages = document.querySelectorAll(".page");

    // снять active со всех страниц
    pages.forEach(p => p.classList.remove("active"));

    const target = document.getElementById("page" + pageNum);

    if (target) {
        target.classList.add("active");
        currentPage = pageNum;
    } else {
        // Фоллбэк, чтобы не было чёрного экрана
        const first = document.getElementById("page1");
        if (first) {
            first.classList.add("active");
            currentPage = 1;
        }
    }

    updateStatusBar();
    lockNextButton();

    // На 2 странице — обновляем/инициализируем слайдер
    if (currentPage === 2) {
        initAgeSlider();
    }
    // На 6 странице — собираем Summary
    if (currentPage === 6) {
        updateSummary();
    }
}

function nextPage() {
    goToPage(currentPage + 1);
}

function prevPage() {
    goToPage(currentPage - 1);
}

// =====================
// СТАТУС-БАР (КРУЖКИ 1–6)
// =====================
function updateStatusBar() {
    const dots = document.querySelectorAll("#statusBar .status-dot");
    dots.forEach((dot, index) => {
        if (index + 1 === currentPage) {
            dot.classList.add("active");
        } else {
            dot.classList.remove("active");
        }
    });
}

// =====================
// ВЫБОР КАРТОЧЕК
// =====================
function handleSelection(el) {
    const group = el.dataset.group;   // например "style", "ethnicity", "bodyType"
    const label = el.dataset.label;   // текстовое значение (Realistic, Asian и т.д.)

    // Снять выделение со всех в этой группе
    document
        .querySelectorAll(`.select-block[data-group="${group}"]`)
        .forEach(i => i.classList.remove("selected"));

    // Пометить выбранный
    el.classList.add("selected");

    // Сохранить в state
    state[group] = label;

    // Активировать кнопку Next на текущей странице
    activateNextButton();
}

function activateNextButton() {
    const page = document.querySelector(".page.active");
    if (!page) return;
    const btn = page.querySelector('button[onclick="nextPage()"]');
    if (btn) btn.disabled = false;
}

function lockNextButton() {
    const page = document.querySelector(".page.active");
    if (!page) return;
    const btn = page.querySelector('button[onclick="nextPage()"]');
    if (btn) btn.disabled = true;
}

// =====================
// СЛАЙДЕР ВОЗРАСТА НА 2 СТРАНИЦЕ
// =====================
function initAgeSlider() {
    const range = document.getElementById("ageRange");
    const bubble = document.getElementById("ageBubble");
    if (!range || !bubble) return;

    const updateBubble = () => {
        const min = Number(range.min) || 0;
        const max = Number(range.max) || 100;
        const val = Number(range.value);

        const percent = (val - min) / (max - min);  // 0..1
        const trackWidth = range.clientWidth;
        const x = percent * trackWidth;

        bubble.style.left = x + "px";
        bubble.textContent = val + "+";

        state.age = val;
    };

    // На всякий случай очищаем прежний обработчик
    if (range._ageHandler) {
        range.removeEventListener("input", range._ageHandler);
    }
    range._ageHandler = updateBubble;

    range.addEventListener("input", updateBubble);
    window.addEventListener("resize", updateBubble);

    // Первичное позиционирование
    updateBubble();
}

// =====================
// SUMMARY НА 6 СТРАНИЦЕ
// =====================
function updateSummary() {
    const container = document.getElementById("summary");
    if (!container) return;

    container.innerHTML = "";

    const groups = [
        ["style",        "Style"],
        ["ethnicity",    "Ethnicity"],
        ["bodyType",     "Body Type"],
        ["breast",       "Breast Size"],
        ["butt",         "Butt Size"],
        ["hairStyle",    "Hair Style"],
        ["hairColor",    "Hair Color"],
        ["eyeColor",     "Eye Color"],
        ["voice",        "Voice"],
        ["relationship", "Relationship"]
    ];

    groups.forEach(([key]) => {
        const value = state[key];
        if (!value) return;

        // Находим исходную выбранную карточку
        const block = document.querySelector(
            `.select-block.selected[data-group="${key}"]`
        );
        if (!block) return;

        // Клонируем карточку
        const clone = block.cloneNode(true);
        clone.classList.remove("selected");
        clone.classList.add("summary-card");

        // Медиаконтент внутри карточки
        const media = clone.querySelector("img, video");

        // Специальная замена изображения для Ethnicity
        if (key === "ethnicity" && media && ethnicitySummaryImages[value]) {
            if (media.tagName.toLowerCase() === "video") {
                const source = media.querySelector("source");
                if (source) {
                    source.src = ethnicitySummaryImages[value];
                    media.load();
                }
            } else {
                media.src = ethnicitySummaryImages[value];
            }
        }

        // Обёртка для медиа, чтобы fit-content работал красиво
        if (media) {
            const wrapper = document.createElement("div");
            wrapper.classList.add("media-wrapper");
            media.parentNode.insertBefore(wrapper, media);
            wrapper.appendChild(media);
        }

        container.appendChild(clone);
    });
}

// =====================
// ИНИЦИАЛИЗАЦИЯ
// =====================
document.addEventListener("DOMContentLoaded", () => {
    // Клики по карточкам
    document.querySelectorAll(".select-block").forEach(block => {
        block.addEventListener("click", () => handleSelection(block));
    });

    // Инициализируем слайдер (на всякий случай сразу)
    initAgeSlider();

    // Показываем первую страницу
    goToPage(1);
});
