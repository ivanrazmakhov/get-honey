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
    const s = document.getElementById('summary');

    s.innerHTML = `
        <p><strong>Style:</strong> ${state.style ?? 'Not selected'}</p>
        <p><strong>Ethnicity:</strong> ${state.ethnicity ?? 'Not selected'}</p>
        <p><strong>Body Type:</strong> ${state.bodyType ?? 'Not selected'}</p>
        <p><strong>Breast Size:</strong> ${state.breast ?? 'Not selected'}</p>
        <p><strong>Butt Size:</strong> ${state.butt ?? 'Not selected'}</p>
        <p><strong>Hair Style:</strong> ${state.hairStyle ?? 'Not selected'}</p>
        <p><strong>Hair Color:</strong> ${state.hairColor ?? 'Not selected'}</p>
        <p><strong>Eye Color:</strong> ${state.eyeColor ?? 'Not selected'}</p>
        <p><strong>Voice:</strong> ${state.voice ?? 'Not selected'}</p>
        <p><strong>Relationship:</strong> ${state.relationship ?? 'Not selected'}</p>
    `;
}

/* ================================
   INIT
================================= */

goToPage(1);
