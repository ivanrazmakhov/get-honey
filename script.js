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
    updateStatusBar(pageNum);

    if (pageNum === 6) {
        updateSummary();
    }
}

function nextPage(current) {
    goToPage(current + 1);
}

function prevPage(current) {
    goToPage(current - 1);
}

/* ================================
   STATUS BAR
================================= */

function updateStatusBar(activeStep) {
    const bar = document.getElementById('statusBar');
    bar.textContent = `Step ${activeStep} / 6`;
}

/* ================================
   SELECTION SYSTEM
================================= */

document.querySelectorAll('.select-block').forEach(block => {
    block.addEventListener('click', () => {
        const group = block.dataset.group;
        const value = block.dataset.value;

        /* remove previous selection */
        document.querySelectorAll(`.select-block[data-group="${group}"]`)
            .forEach(b => b.classList.remove('selected'));

        /* set new selection */
        block.classList.add('selected');
        state[group] = value;
    });
});

/* ================================
   SUMMARY
================================= */

function updateSummary() {
    const summary = document.getElementById('summary');

    summary.innerHTML = `
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
