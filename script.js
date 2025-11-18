/* ================================
   GLOBAL STATE
================================= */

let state = {
    style: null,
    ethnicity: null,
    bodyType: null,
    breast: null,
    butt: null,
    hairStyle: null,
    hairColor: null,
    eyeColor: null,
    voice: null,
    relationship: null
};

/* ================================
   PAGE NAVIGATION
================================= */

function goToPage(pageNum) {
    document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
    document.getElementById('page' + pageNum).classList.add('active');

    document.getElementById('statusBar').innerText = `Step ${pageNum} of 6`;

    if (pageNum === 6) updateSummary();
}

function nextPage() {
    let current = getCurrentPage();
    goToPage(current + 1);
}

function prevPage() {
    let current = getCurrentPage();
    goToPage(current - 1);
}

function getCurrentPage() {
    let pages = [...document.querySelectorAll('.page')];
    return pages.findIndex(p => p.classList.contains('active')) + 1;
}

/* ================================
   SELECTION SYSTEM
================================= */

document.querySelectorAll('.select-block').forEach(block => {
    block.addEventListener('click', () => {
        const group = block.dataset.group;
        const value = block.dataset.label;  // <— FIXED

        // remove highlight from others
        document.querySelectorAll(`.select-block[data-group="${group}"]`)
            .forEach(b => b.classList.remove('selected'));

        // highlight this one
        block.classList.add('selected');

        // save selection
        state[group] = value;
    });
});

/* ================================
   SUMMARY
================================= */

function updateSummary() {
    const container = document.getElementById('summary');
    container.innerHTML = '';

    const groups = [
        ['style', 'Style'],
        ['ethnicity', 'Ethnicity'],
        ['bodyType', 'Body Type'],
        ['breast', 'Breast Size'],
        ['butt', 'Butt Size'],
        ['hairStyle', 'Hair Style'],
        ['hairColor', 'Hair Color'],
        ['eyeColor', 'Eye Color'],
        ['voice', 'Voice'],
        ['relationship', 'Relationship']
    ];

    groups.forEach(([key, title]) => {
        const value = state[key];

        if (!value) return;

        // ищем выбранный блок по data-group и data-label
        const block = document.querySelector(
            `.select-block.selected[data-group="${key}"]`
        );

        if (!block) return;

        // клонируем объект
        const clone = block.cloneNode(true);
        clone.classList.remove('selected');
        clone.classList.add('summary-card');

        container.appendChild(clone);
    });
}

/* ================================
   INIT
================================= */

goToPage(1);
