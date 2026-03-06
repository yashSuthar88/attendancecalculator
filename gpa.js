const boardData = [
    { name: "CBSE / Major Boards", formula: (c) => c * 9.5, info: "Standard CBSE Formula: CGPA × 9.5" },
    { name: "Standard (X 10)", formula: (c) => c * 10, info: "Standard 10 Point Scale: CGPA × 10" },
    { name: "Mumbai University", formula: (c) => (c * 7.1) + 11, info: "Mumbai University Formula: (7.1 × CGPA) + 11" },
    { name: "VTU (2015/17/18 Scheme)", formula: (c) => (c - 0.75) * 10, info: "VTU Older Scheme: (CGPA - 0.75) × 10" },
    { name: "KTU (Kerala)", formula: (c) => (c * 10) - 3.75, info: "KTU Formula: (10 × CGPA) - 3.75" },
    { name: "Pune University (SPPU)", formula: (c) => (c - 0.75) * 10, info: "SPPU Common Formula: (CGPA - 0.75) × 10" },
    { name: "JNTU (Hyderabad)", formula: (c) => (c - 0.5) * 10, info: "JNTU Formula: (CGPA - 0.5) × 10" },
    { name: "Anna University", formula: (c) => c * 10, info: "Anna University Formula: CGPA × 10" },
    { name: "AKTU / UPTU", formula: (c) => (c - 0.75) * 10, info: "AKTU Formula: (CGPA - 0.75) × 10" },
    { name: "GTU (Gujarat)", formula: (c) => (c - 0.5) * 10, info: "GTU Formula: (CGPA - 0.5) × 10" },
    { name: "Saurashtra University", formula: (c) => (c - 0.5) * 10, info: "Saurashtra University: (CGPA - 0.5) × 10" },
    { name: "Delhi University (DU)", formula: (c) => c * 9.5, info: "DU Formula: CGPA × 9.5" },
    { name: "Standard (X 9.5)", formula: (c) => c * 9.5, info: "Common 9.5 Multiplier: CGPA × 9.5" }
];

let selectedBoard = boardData[0]; // Default CBSE

const input = document.getElementById('cgpa-input');
const scaleSelect = document.getElementById('current-scale');
const searchInput = document.getElementById('country-search');
const listContainer = document.getElementById('country-list');
const convertBtn = document.getElementById('convert-btn');

const placeholder = document.getElementById('result-placeholder');
const display = document.getElementById('result-display');
const boardBadge = document.getElementById('target-country-badge');
const percentageResult = document.getElementById('converted-gpa');
const classificationResult = document.getElementById('grade-classification');
const formulaInfo = document.getElementById('scale-info');

// Handle board search and filtering
searchInput.addEventListener('focus', () => {
    renderList(boardData);
    listContainer.style.display = 'block';
});

searchInput.addEventListener('input', (e) => {
    const term = e.target.value.toLowerCase();
    const filtered = boardData.filter(b => b.name.toLowerCase().includes(term));
    renderList(filtered);
    listContainer.style.display = 'block';
});

document.addEventListener('click', (e) => {
    if (!e.target.closest('.country-search-container')) {
        listContainer.style.display = 'none';
    }
});

function renderList(list) {
    listContainer.innerHTML = '';
    list.forEach(board => {
        const item = document.createElement('div');
        item.className = 'country-item';
        item.textContent = board.name;
        item.addEventListener('click', () => {
            selectedBoard = board;
            searchInput.value = board.name;
            listContainer.style.display = 'none';
        });
        listContainer.appendChild(item);
    });
}

function calculatePercentage() {
    const cgpa = parseFloat(input.value);
    const sourceScale = parseFloat(scaleSelect.value);

    if (isNaN(cgpa) || cgpa < 0 || cgpa > sourceScale) {
        alert("Please enter a valid CGPA within your scale range.");
        return;
    }

    placeholder.style.display = 'none';
    display.style.display = 'flex';
    boardBadge.textContent = selectedBoard.name;

    // Conversion Logic
    // Most formulas assume 10 point scale. If user is on different scale, we normalize to 10 first.
    let normalizedCGPA = cgpa;
    if (sourceScale !== 10) {
        normalizedCGPA = (cgpa / sourceScale) * 10;
    }

    const percentage = selectedBoard.formula(normalizedCGPA).toFixed(2);
    const resultText = percentage + "%";

    // Indian Classification System
    let label = "";
    const p = parseFloat(percentage);
    if (p >= 75) label = "First Class with Distinction";
    else if (p >= 60) label = "First Class";
    else if (p >= 50) label = "Second Class";
    else if (p >= 40) label = "Pass Class";
    else label = "Failed / Below Pass Marks";

    percentageResult.textContent = resultText;
    classificationResult.textContent = label;
    formulaInfo.textContent = selectedBoard.info;

    // Dynamic Color Coding
    let color = 'var(--primary)';
    let perfClass = '';
    if (p >= 75) { color = 'var(--success)'; perfClass = 'gpa-success'; }
    else if (p >= 60) { color = 'var(--primary)'; perfClass = ''; }
    else if (p >= 45) { color = 'var(--warning)'; perfClass = 'gpa-warning'; }
    else { color = 'var(--danger)'; perfClass = 'gpa-danger'; }

    percentageResult.classList.remove('gpa-success', 'gpa-warning', 'gpa-danger');
    if (perfClass) percentageResult.classList.add(perfClass);

    percentageResult.style.color = color;
    classificationResult.style.color = color;

    // Auto-scroll for mobile/tablet
    if (window.innerWidth <= 1024) {
        setTimeout(() => {
            display.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }, 100);
    }
}

convertBtn.addEventListener('click', calculatePercentage);

// Initialize search input with default
searchInput.value = selectedBoard.name;
