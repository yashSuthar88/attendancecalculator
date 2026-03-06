document.addEventListener('DOMContentLoaded', () => {
    const predictBtn = document.getElementById('predict-btn');

    // ==========================================
    // Dynamic Public Holidays (India) — all 12 months
    // ==========================================
    const allHolidays = [
        { month: 0, day: 1, name: 'New Year', value: '01-01' },
        { month: 0, day: 14, name: 'Makar Sankranti', value: '01-14' },
        { month: 0, day: 26, name: 'Republic Day', value: '01-26' },
        { month: 1, day: 15, name: 'Maha Shivaratri', value: '02-15' },
        { month: 1, day: 26, name: 'Guru Ravidas Jayanti', value: '02-26' },
        { month: 2, day: 4, name: 'Holi', value: '03-04' },
        { month: 2, day: 14, name: 'Pi Day / No Smoking Day', value: '03-14' },
        { month: 2, day: 20, name: 'Eid ul-Fitr', value: '03-20' },
        { month: 2, day: 28, name: 'Ram Navami', value: '03-28' },
        { month: 3, day: 3, name: 'Mahavir Jayanti', value: '04-03' },
        { month: 3, day: 10, name: 'Good Friday', value: '04-10' },
        { month: 3, day: 14, name: 'Ambedkar Jayanti', value: '04-14' },
        { month: 4, day: 1, name: 'Labour Day', value: '05-01' },
        { month: 4, day: 12, name: 'Buddha Purnima', value: '05-12' },
        { month: 5, day: 26, name: 'Eid ul-Adha (Bakrid)', value: '06-26' },
        { month: 6, day: 6, name: 'Rath Yatra', value: '07-06' },
        { month: 6, day: 17, name: 'Muharram', value: '07-17' },
        { month: 7, day: 15, name: 'Independence Day', value: '08-15' },
        { month: 7, day: 28, name: 'Raksha Bandhan', value: '08-28' },
        { month: 8, day: 4, name: 'Janmashtami', value: '09-04' },
        { month: 8, day: 14, name: 'Ganesh Chaturthi', value: '09-14' },
        { month: 8, day: 16, name: 'Milad-un-Nabi', value: '09-16' },
        { month: 8, day: 27, name: 'Onam', value: '09-27' },
        { month: 9, day: 2, name: 'Gandhi Jayanti', value: '10-02' },
        { month: 9, day: 12, name: 'Dussehra (Navratri End)', value: '10-12' },
        { month: 9, day: 19, name: 'Dussehra (Vijaya Dashami)', value: '10-19' },
        { month: 9, day: 31, name: 'Halloween', value: '10-31' },
        { month: 10, day: 1, name: 'Karva Chauth', value: '11-01' },
        { month: 10, day: 5, name: 'Diwali (Deepavali)', value: '11-05' },
        { month: 10, day: 7, name: 'Govardhan Puja', value: '11-07' },
        { month: 10, day: 8, name: 'Bhai Dooj', value: '11-08' },
        { month: 10, day: 24, name: 'Guru Nanak Jayanti', value: '11-24' },
        { month: 11, day: 25, name: 'Christmas', value: '12-25' },
        { month: 11, day: 31, name: 'New Year\'s Eve', value: '12-31' }
    ];

    const monthNames = [
        'January', 'February', 'March', 'April', 'May', 'June',
        'July', 'August', 'September', 'October', 'November', 'December'
    ];
    const monthShort = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

    function buildHolidayList() {
        const container = document.getElementById('holidays-list');
        if (!container) return;

        const currentMonth = new Date().getMonth(); // 0-indexed
        const currentYear = new Date().getFullYear();
        const VISIBLE_MONTHS = 3;

        // Build ordered list: current month → Dec, then Jan → month before current
        const monthOrder = [];
        for (let i = currentMonth; i < 12; i++) monthOrder.push(i);
        for (let i = 0; i < currentMonth; i++) monthOrder.push(i);

        // Filter to months that have holidays
        const monthsWithHolidays = monthOrder.filter(m => allHolidays.some(h => h.month === m));

        let visibleHtml = '';
        let hiddenHtml = '';
        let idCounter = 0;
        let monthIndex = 0;

        monthsWithHolidays.forEach(m => {
            const monthHolidays = allHolidays.filter(h => h.month === m);

            const isNextYear = m < currentMonth;
            const yearForMonth = isNextYear ? currentYear + 1 : currentYear;
            const label = isNextYear
                ? `${monthNames[m]} ${yearForMonth}`
                : monthNames[m];

            let block = `<h4 class="month-title">${label}</h4>`;
            block += `<div class="checkbox-grid">`;

            monthHolidays.forEach(h => {
                const uniqueId = `hol-${idCounter++}`;
                const mm = String(h.month + 1).padStart(2, '0');
                const dd = String(h.day).padStart(2, '0');
                const fullValue = `${yearForMonth}-${mm}-${dd}`;
                const shortLabel = `${h.name} (${monthShort[h.month]} ${h.day})`;

                block += `<div class="checkbox-wrapper small">`;
                block += `<input type="checkbox" class="holiday-checkbox" id="${uniqueId}" value="${fullValue}">`;
                block += `<label for="${uniqueId}">${shortLabel}</label>`;
                block += `</div>`;
            });

            block += `</div>`;

            if (monthIndex < VISIBLE_MONTHS) {
                visibleHtml += block;
            } else {
                hiddenHtml += block;
            }
            monthIndex++;
        });

        let finalHtml = visibleHtml;

        if (hiddenHtml) {
            finalHtml += `<div id="extra-holidays" style="display: none;">${hiddenHtml}</div>`;
            finalHtml += `<button type="button" id="show-more-holidays" style="
                margin-top: 12px;
                width: 100%;
                padding: 10px;
                background: rgba(6, 182, 212, 0.08);
                border: 1px solid rgba(6, 182, 212, 0.2);
                border-radius: 10px;
                color: var(--primary);
                font-size: 0.82rem;
                font-weight: 600;
                cursor: pointer;
                transition: all 0.25s ease;
                box-shadow: none;
            ">Show All Holidays ▼</button>`;
        }

        container.innerHTML = finalHtml;

        // Toggle button
        const showMoreBtn = document.getElementById('show-more-holidays');
        const extraHolidays = document.getElementById('extra-holidays');
        if (showMoreBtn && extraHolidays) {
            showMoreBtn.addEventListener('click', () => {
                const isHidden = extraHolidays.style.display === 'none';
                extraHolidays.style.display = isHidden ? 'block' : 'none';
                showMoreBtn.textContent = isHidden ? 'Show Less ▲' : 'Show All Holidays ▼';
            });
        }
    }

    buildHolidayList();

    // Accordion Toggle
    const accordionHeader = document.getElementById('holidays-toggle');
    const accordionContent = document.getElementById('holidays-content');
    if (accordionHeader && accordionContent) {
        accordionHeader.addEventListener('click', () => {
            accordionHeader.classList.toggle('active');
            accordionContent.classList.toggle('open');
        });
    }

    // ==========================================
    // College Holidays (custom user input)
    // ==========================================
    const collegeHolidays = []; // stores YYYY-MM-DD strings
    const collegeInput = document.getElementById('college-holiday-input');
    const addCollegeBtn = document.getElementById('add-college-holiday');
    const collegeList = document.getElementById('college-holidays-list');

    // Auto-format DD/MM/YYYY
    if (collegeInput) {
        collegeInput.addEventListener('input', function () {
            let val = this.value.replace(/[^\d]/g, '');
            if (val.length > 8) val = val.slice(0, 8);
            if (val.length >= 5) {
                val = val.slice(0, 2) + '/' + val.slice(2, 4) + '/' + val.slice(4);
            } else if (val.length >= 3) {
                val = val.slice(0, 2) + '/' + val.slice(2);
            }
            this.value = val;
        });
    }

    function parseDDMMYYYY(str) {
        const parts = str.split('/');
        if (parts.length !== 3) return null;
        const day = parseInt(parts[0], 10);
        const month = parseInt(parts[1], 10) - 1;
        const year = parseInt(parts[2], 10);
        if (isNaN(day) || isNaN(month) || isNaN(year)) return null;
        const d = new Date(year, month, day);
        if (d.getFullYear() !== year || d.getMonth() !== month || d.getDate() !== day) return null;
        return d;
    }

    function renderCollegeTags() {
        if (!collegeList) return;
        collegeList.innerHTML = collegeHolidays.map((dateStr, i) => {
            // Convert YYYY-MM-DD to readable DD/MM/YYYY
            const [y, m, d] = dateStr.split('-');
            const display = `${d}/${m}/${y}`;
            return `<span style="
                display: inline-flex; align-items: center; gap: 6px;
                padding: 6px 12px; background: rgba(6, 182, 212, 0.1);
                border: 1px solid rgba(6, 182, 212, 0.2); border-radius: 8px;
                font-size: 0.82rem; color: var(--primary); font-weight: 600;
            ">${display}<span class="remove-college-hol" data-index="${i}" style="
                cursor: pointer; font-size: 1rem; line-height: 1;
                color: var(--text-muted); transition: color 0.2s;
            " onmouseover="this.style.color='#f87171'" onmouseout="this.style.color='var(--text-muted)'">&times;</span></span>`;
        }).join('');

        // Attach remove handlers
        collegeList.querySelectorAll('.remove-college-hol').forEach(btn => {
            btn.addEventListener('click', () => {
                collegeHolidays.splice(parseInt(btn.dataset.index), 1);
                renderCollegeTags();
            });
        });
    }

    if (addCollegeBtn && collegeInput) {
        addCollegeBtn.addEventListener('click', () => {
            const val = collegeInput.value.trim();
            const parsed = parseDDMMYYYY(val);
            if (!parsed) {
                alert('Please enter a valid date in DD/MM/YYYY format.');
                return;
            }
            const mm = String(parsed.getMonth() + 1).padStart(2, '0');
            const dd = String(parsed.getDate()).padStart(2, '0');
            const yyyy = parsed.getFullYear();
            const isoDate = `${yyyy}-${mm}-${dd}`;

            if (collegeHolidays.includes(isoDate)) {
                alert('This date is already added.');
                return;
            }

            collegeHolidays.push(isoDate);
            collegeInput.value = '';
            renderCollegeTags();
        });

        // Also allow Enter key
        collegeInput.addEventListener('keydown', (e) => {
            if (e.key === 'Enter') {
                e.preventDefault();
                addCollegeBtn.click();
            }
        });
    }

    const attendedInput = document.getElementById('p-attended');
    const totalInput = document.getElementById('p-total');
    const goalInput = document.getElementById('p-goal');

    const inputs = {
        1: document.getElementById('mon'),
        2: document.getElementById('tue'),
        3: document.getElementById('wed'),
        4: document.getElementById('thu'),
        5: document.getElementById('fri'),
        6: document.getElementById('sat')
    };

    const weeklyOff = document.getElementById('weekly-off');
    const saturdayOff = document.getElementById('saturday-off');

    function updateOffDays() {
        for (let i = 1; i <= 6; i++) { if (inputs[i]) inputs[i].disabled = false; }
        if (weeklyOff && weeklyOff.value !== 'none') {
            const day = parseInt(weeklyOff.value);
            if (inputs[day]) { inputs[day].value = 0; inputs[day].disabled = true; }
        }
        if (saturdayOff && saturdayOff.value === 'all' && weeklyOff.value !== '6') {
            if (inputs[6]) { inputs[6].value = 0; inputs[6].disabled = true; }
        }
    }

    if (weeklyOff && saturdayOff) {
        weeklyOff.addEventListener('change', updateOffDays);
        saturdayOff.addEventListener('change', updateOffDays);
        updateOffDays();
    }

    const resultSection = document.getElementById('planner-result');
    const placeholder = document.getElementById('planner-placeholder');
    const dateDisplay = document.getElementById('planner-date');
    const dateLabel = document.getElementById('planner-date-label');
    const verdictDisplay = document.getElementById('planner-verdict');

    if (!predictBtn) return;

    predictBtn.addEventListener('click', () => {
        let attended = parseInt(attendedInput.value);
        let total = parseInt(totalInput.value);
        const goal = parseInt(goalInput.value);

        if (isNaN(attended) || isNaN(total) || isNaN(goal)) { alert('Please enter valid numbers.'); return; }
        if (attended > total) { alert('Attended cannot be greater than total.'); return; }
        if (total === 0) { alert('Total cannot be zero.'); return; }

        const schedule = { 0: 0 };
        for (let i = 1; i <= 6; i++) schedule[i] = parseInt(inputs[i].value) || 0;

        let totalWeeklySlots = 0;
        for (let i = 0; i <= 6; i++) totalWeeklySlots += schedule[i];
        if (totalWeeklySlots === 0) { alert('You must have at least one class slot!'); return; }

        const currentPct = (attended / total) * 100;

        // Animate placeholder to results header
        if (placeholder && !placeholder.classList.contains('calculated')) {
            placeholder.classList.add('calculated');
            const phIcon = document.getElementById('ph-icon');
            const phTitle = document.getElementById('ph-title');
            const phDesc = document.getElementById('ph-desc');

            if (phIcon && phDesc && phTitle) {
                phIcon.style.opacity = '0';
                phIcon.style.transform = 'scale(0.5) translateY(-20px)';
                phDesc.style.opacity = '0';
                phDesc.style.transform = 'translateY(10px) scale(0.9)';

                setTimeout(() => {
                    phIcon.style.display = 'none';
                    phDesc.style.display = 'none';

                    phTitle.innerText = 'Prediction Result';
                    phTitle.style.fontSize = '1.1rem';
                    phTitle.style.textTransform = 'uppercase';
                    phTitle.style.letterSpacing = '1px';
                    phTitle.style.marginBottom = '25px';

                    placeholder.style.flex = 'initial';

                    resultSection.classList.remove('hidden');
                    // Trigger reflow for animation
                    void resultSection.offsetWidth;
                    resultSection.style.opacity = '1';
                    resultSection.style.transform = 'translateY(0)';
                }, 300);
            } else {
                placeholder.classList.add('hidden');
                resultSection.classList.remove('hidden');
                resultSection.style.opacity = '1';
                resultSection.style.transform = 'translateY(0)';
            }
        }

        if (currentPct >= goal) {
            dateDisplay.innerText = '🎉';
            dateDisplay.style.color = 'var(--success)';
            dateLabel.innerText = 'Goal Already Reached';
            verdictDisplay.className = 'impact-verdict verdict-safe';
            verdictDisplay.innerHTML = '<strong>✅ You\'re already at ' + currentPct.toFixed(1) + '%!</strong> Your attendance is above the ' + goal + '% target.';
            return;
        }

        if (goal === 100 && currentPct < 100) {
            dateDisplay.innerText = '✕';
            dateDisplay.style.color = 'var(--danger)';
            dateLabel.innerText = 'Impossible Goal';
            verdictDisplay.className = 'impact-verdict verdict-danger';
            verdictDisplay.innerHTML = '<strong>⚠️ Cannot reach 100%.</strong> You\'ve already missed classes.';
            return;
        }

        let tempAttended = attended, tempTotal = total;
        let currentDate = new Date();
        let daysPassed = 0, actualDaysAttended = 0;
        const MAX_DAYS = 730;

        let weeklyOffDay = weeklyOff ? weeklyOff.value : 'none';
        let satOffType = saturdayOff ? saturdayOff.value : 'none';
        const holidayCheckboxes = document.querySelectorAll('.holiday-checkbox:checked');
        const activeHolidays = Array.from(holidayCheckboxes).map(cb => cb.value);
        // Merge in college holidays
        collegeHolidays.forEach(d => { if (!activeHolidays.includes(d)) activeHolidays.push(d); });

        while ((tempAttended / tempTotal) * 100 < goal && daysPassed < MAX_DAYS) {
            daysPassed++;
            currentDate.setDate(currentDate.getDate() + 1);
            const dayOfWeek = currentDate.getDay();
            let slotsToday = schedule[dayOfWeek];

            if (weeklyOffDay !== 'none' && dayOfWeek === parseInt(weeklyOffDay)) slotsToday = 0;
            if (dayOfWeek === 6 && weeklyOffDay !== '6' && satOffType !== 'none') {
                if (satOffType === 'all') { slotsToday = 0; }
                else {
                    const weekOfMonth = Math.ceil(currentDate.getDate() / 7);
                    if (satOffType === 'odd' && weekOfMonth % 2 !== 0) slotsToday = 0;
                    else if (satOffType === 'even' && weekOfMonth % 2 === 0) slotsToday = 0;
                }
            }

            if (activeHolidays.length > 0 && slotsToday > 0) {
                const cm = String(currentDate.getMonth() + 1).padStart(2, '0');
                const cd = String(currentDate.getDate()).padStart(2, '0');
                const cy = currentDate.getFullYear();
                if (activeHolidays.includes(cm + '-' + cd) || activeHolidays.includes(cy + '-' + cm + '-' + cd)) slotsToday = 0;
            }

            if (slotsToday > 0) { tempAttended += slotsToday; tempTotal += slotsToday; actualDaysAttended++; }
        }

        if (daysPassed >= MAX_DAYS) {
            dateDisplay.innerText = '∞';
            dateDisplay.style.color = 'var(--warning)';
            dateLabel.innerText = 'Takes Too Long';
            verdictDisplay.className = 'impact-verdict verdict-warning';
            verdictDisplay.innerHTML = '<strong>⚡ Over 2 years required.</strong> Consider lowering your target.';
        } else {
            const dateStr = currentDate.toLocaleDateString('en-US', { weekday: 'short', month: 'long', day: 'numeric', year: 'numeric' });
            dateDisplay.innerText = dateStr;
            dateDisplay.style.color = 'var(--primary)';
            dateLabel.innerText = 'in ' + actualDaysAttended + ' college days';
            const finalPct = (Math.round((tempAttended / tempTotal) * 10000) / 100).toFixed(1);
            verdictDisplay.className = 'impact-verdict verdict-safe';
            verdictDisplay.innerHTML = '<strong>✅ Goal reachable!</strong> Attend all classes for the next ' + actualDaysAttended + ' college day' + (actualDaysAttended !== 1 ? 's' : '') + ' to hit ' + finalPct + '%.';
        }

        setTimeout(() => {
            resultSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }, 300);
    });
});
