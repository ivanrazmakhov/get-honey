// ===== PAGE SYSTEM ===== //

let currentPage = 1;
const totalPages = 6;

function showPage(pageNumber) {
    currentPage = pageNumber;

    document.querySelectorAll(".page").forEach((page, index) => {
        page.classList.remove("active");
        if (index + 1 === pageNumber) {
            page.classList.add("active");
        }
    });

    // Update status bar
    document.getElementById("statusBar").innerText = `Step ${pageNumber} of 6`;

    if (pageNumber === 6) generateSummary();
}

function nextPage() {
    if (currentPage < totalPages) {
        showPage(currentPage + 1);
    }
}

function prevPage() {
    if (currentPage > 1) {
        showPage(currentPage - 1);
    }
}

showPage(1); // Initial page


// ====== USER SELECTION STORAGE ====== //

let selections = {
    style: null,
    ethnicity: null,
    body: null,
    breast: null,
    butt: null,
    hairstyle: null,
    haircolor: null,
    eyecolor: null,
    voice: null,
    relationship: null
};


// ====== SELECTION HANDLER ====== //

function selectOption(group, element, labelText) {
    selections[group] = labelText;

    // Remove selection highlight
    element.parentElement.querySelectorAll(".select-block").forEach(block => {
        block.classList.remove("selected");
    });

    // Highlight the chosen block
    element.classList.add("selected");
}


// ====== AUTO-BIND ALL CARDS ====== //
// Any element with data-group="" and data-label="" will automatically work.

document.querySelectorAll("[data-group]").forEach(block => {
    block.addEventListener("click", () => {
        const group = block.getAttribute("data-group");
        const label = block.getAttribute("data-label");

        selectOption(group, block, label);
    });
});


// ====== SUMMARY BUILDER ====== //

function generateSummary() {
    const summaryContainer = document.getElementById("summary");
    summaryContainer.innerHTML = "";

    for (const key in selections) {
        const value = selections[key];

        const row = document.createElement("div");
        row.className = "summary-row";

        row.innerHTML = `
            <strong>${key.replace(/^\w/, c => c.toUpperCase())}:</strong> 
            ${value ? value : "<span style='opacity:0.5'>Not selected</span>"}
        `;

        summaryContainer.appendChild(row);
    }
}