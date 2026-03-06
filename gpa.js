const countryData = [
    { name: "USA", scale: 4.0, system: "4.0 Grade Point", info: "Standard US 4.0 Scale." },
    { name: "United Kingdom", scale: "Classification", system: "1st, 2:1, 2:2, 3rd", info: "UK Honors Classification System." },
    { name: "Canada", scale: 4.0, system: "4.0 or 4.33 Scale", info: "Typically OUA or standard 4.0." },
    { name: "Germany", scale: 1.0, system: "Modified Bavarian Formula", info: "Scale of 1.0 (Best) to 5.0 (Fail)." },
    { name: "Australia", scale: 7.0, system: "7.0 Scale", info: "Mostly used by Australian universities." },
    { name: "India", scale: 10.0, system: "10.0 CGPA", info: "Most common Indian university scale." },
    { name: "Europe (ECTS)", scale: "ECTS", system: "A to F", info: "European Credit Transfer System." },
    { name: "France", scale: 20.0, system: "20 Point Scale", info: "Standard French grading." },
    { name: "Spain", scale: 10.0, system: "10 Point Scale", info: "Standard Spanish grading." },
    { name: "Netherlands", scale: 10.0, system: "10 Point Scale", info: "Standard Dutch grading." },
    { name: "Singapore", scale: 5.0, system: "5.0 CAP", info: "Used by NUS, NTU etc." },
    { name: "China", scale: 4.0, system: "4.0 or 5.0 Scale", info: "Varies by province and university." },
    { name: "Japan", scale: 4.0, system: "4.0 Scale (S,A,B,C)", info: "Standard Japanese GPA." },
    { name: "Russia", scale: 5.0, system: "5.0 Scale", info: "5 = Excellent, 1 = Fail." },
    { name: "Brazil", scale: 10.0, system: "10.0 Scale", info: "Standard Brazilian grading." },
    { name: "Mexico", scale: 10.0, system: "10.0 Scale", info: "Standard Mexican grading." },
    { name: "Pakistan", scale: 4.0, system: "4.0 Scale", info: "Standard HEC GPA." },
    { name: "Bangladesh", scale: 4.0, system: "4.0 or 5.0" },
    { name: "South Africa", scale: "Percentage", system: "Percentage Based" },
    { name: "Sweden", scale: "Pass/VG", system: "U, G, VG" },
    { name: "Italy", scale: 30.0, system: "30 Point Scale" }
];

let selectedCountry = countryData[0]; // Default USA

const input = document.getElementById('cgpa-input');
const scaleSelect = document.getElementById('current-scale');
const searchInput = document.getElementById('country-search');
const listContainer = document.getElementById('country-list');
const convertBtn = document.getElementById('convert-btn');

const placeholder = document.getElementById('result-placeholder');
const display = document.getElementById('result-display');
const countryBadge = document.getElementById('target-country-badge');
const gpaResult = document.getElementById('converted-gpa');
const gradeClassification = document.getElementById('grade-classification');
const scaleInfo = document.getElementById('scale-info');

// Handle country search and filtering
searchInput.addEventListener('focus', () => {
    renderList(countryData);
    listContainer.style.display = 'block';
});

searchInput.addEventListener('input', (e) => {
    const term = e.target.value.toLowerCase();
    const filtered = countryData.filter(c => c.name.toLowerCase().includes(term));
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
    list.forEach(country => {
        const item = document.createElement('div');
        item.className = 'country-item';
        item.textContent = country.name;
        item.addEventListener('click', () => {
            selectedCountry = country;
            searchInput.value = country.name;
            listContainer.style.display = 'none';
        });
        listContainer.appendChild(item);
    });
}

function calculateGPA() {
    const cgpa = parseFloat(input.value);
    const sourceScale = parseFloat(scaleSelect.value);

    if (isNaN(cgpa) || cgpa < 0 || cgpa > sourceScale) {
        alert("Please enter a valid CGPA within your current scale range.");
        return;
    }

    placeholder.style.display = 'none';
    display.style.display = 'flex';
    countryBadge.textContent = selectedCountry.name;

    // Conversion Logic
    const percentage = cgpa / sourceScale;
    let result = 0;
    let label = "";
    let info = "";

    if (selectedCountry.name === "USA" || selectedCountry.scale === 4.0) {
        result = (percentage * 4.0).toFixed(2);
        label = getUSClassification(result);
        info = "Standard US 4.0 Scale based on percentage linear conversion.";
    } else if (selectedCountry.name === "United Kingdom") {
        const p = percentage * 100;
        if (p >= 70) { result = "1st"; label = "First-Class Honours"; }
        else if (p >= 60) { result = "2:1"; label = "Upper Second-Class Honours"; }
        else if (p >= 50) { result = "2:2"; label = "Lower Second-Class Honours"; }
        else if (p >= 40) { result = "3rd"; label = "Third-Class Honours"; }
        else { result = "Fail"; label = "Failed / Pass Degree"; }
        info = "Calculated using UK standard percentage-to-honours classification.";
    } else if (selectedCountry.name === "Germany") {
        // (1 + 3 * (Max - User) / (Max - Pass))
        // Assuming user enters on a scale where 100% is max and 40% is pass for source system
        // We'll approximate using the percentage
        const x_max = sourceScale;
        const x_pass = sourceScale * 0.4; // Assuming 40% is pass universally for the formula if not specified
        const x = cgpa;
        const score = (1 + 3 * (x_max - x) / (x_max - x_pass)).toFixed(1);
        result = Math.max(1, Math.min(score, 5)).toFixed(1);
        label = result <= 1.5 ? "Very Good" : result <= 2.5 ? "Good" : result <= 3.5 ? "Satisfactory" : result <= 4 ? "Sufficient" : "Insufficient";
        info = "Modified Bavarian Formula: Grade = 1+3*((Xmax - X)/(Xmax - Xpass)).";
    } else if (typeof selectedCountry.scale === 'number') {
        result = (percentage * selectedCountry.scale).toFixed(2);
        label = "Target Scale Equivalent";
        info = `Converted onto ${selectedCountry.name}'s ${selectedCountry.scale} point scale.`;
    } else {
        result = (percentage * 100).toFixed(1) + "%";
        label = "Equivalent Performance";
        info = `Standard percentage conversion used for ${selectedCountry.name}.`;
    }

    gpaResult.textContent = result;
    gradeClassification.textContent = label;
    scaleInfo.textContent = info;

    // Dynamic Color Coding
    let color = 'var(--primary)';
    let perfClass = '';
    if (selectedCountry.name === "United Kingdom") {
        if (result === "1st" || result === "2:1") { color = 'var(--success)'; perfClass = 'gpa-success'; }
        else if (result === "2:2") { color = 'var(--warning)'; perfClass = 'gpa-warning'; }
        else { color = 'var(--danger)'; perfClass = 'gpa-danger'; }
    } else {
        if (percentage >= 0.8) { color = 'var(--success)'; perfClass = 'gpa-success'; }
        else if (percentage >= 0.6) { color = 'var(--warning)'; perfClass = 'gpa-warning'; }
        else { color = 'var(--danger)'; perfClass = 'gpa-danger'; }
    }

    gpaResult.classList.remove('gpa-success', 'gpa-warning', 'gpa-danger');
    if (perfClass) gpaResult.classList.add(perfClass);

    gpaResult.style.color = color;
    gradeClassification.style.color = color;

    // Auto-scroll for mobile/tablet
    if (window.innerWidth <= 1024) {
        setTimeout(() => {
            display.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }, 100);
    }
}

function getUSClassification(gpa) {
    if (gpa >= 3.7) return "Excellent (A)";
    if (gpa >= 3.3) return "Very Good (B+)";
    if (gpa >= 3.0) return "Good (B)";
    if (gpa >= 2.7) return "Above Average (B-)";
    if (gpa >= 2.3) return "Average (C+)";
    if (gpa >= 2.0) return "Satisfactory (C)";
    return "Below Average / Academic Probation";
}

convertBtn.addEventListener('click', calculateGPA);

// Initialize search input with USA
searchInput.value = selectedCountry.name;
