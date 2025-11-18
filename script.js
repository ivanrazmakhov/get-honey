// =====================
// GLOBAL STATE
// =====================
let state = {};

// текущая страница
let currentPage = 1;

// =====================
// SWITCH PAGES
// =====================
function goToPage(pageNum) {
    currentPage = pageNum;

    document.querySelectorAll(".page").forEach(p => p.classList.remove("active"));
    document.querySelector(`#page${pageNum}`).classList.add("active");

    updateStatusBar();
    lockNextButton();
    if (pageNum === 6) updateSummary();
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
    document.querySelectorAll(".status-dot").forEach((dot, index) => {
        if (index + 1 === currentPage) dot.classList.add("active");
        else dot.classList.remove("active");
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
    const summary = document.getElementById("summary");
    summary.innerHTML = "";

    // массив всех групп в порядке показа
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
        if (!state[group]) return;

        // найти выбранный блок
        const block = document.querySelector(
            `.select-block.selected[data-group="${group}"]`
        );

        if (!block) return;

        // клонируем и превращаем в итоговую карточку
        const clone = block.cloneNode(true);
        clone.classList.remove("selected");
        clone.classList.add("summary-card");

        summary.appendChild(clone);
    });
}

// =====================
// INITIALIZE EVENT LISTENERS
// =====================
document.addEventListener("DOMContentLoaded", () => {
    // Клики по карточкам
    document.querySelectorAll(".select-block").forEach(block => {
        block.addEventListener("click", () => handleSelection(block));
    });

    // показать первую страницу
    goToPage(1);
});
