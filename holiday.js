document.addEventListener('DOMContentLoaded', () => {
    const calculateBtn = document.getElementById('calculate-impact-btn');
    const resultPlaceholder = document.getElementById('result-placeholder');
    const holidayResults = document.getElementById('holiday-results');

    // ==========================================
    // Dynamic Public Holidays (India)
    // ==========================================
    const allHolidays = [
        { month: 0, day: 1, name: 'New Year', value: '01-01' },
        { month: 0, day: 14, name: 'Makar Sankranti', value: '01-14' },
        { month: 0, day: 26, name: 'Republic Day', value: '01-26' },
        { month: 1, day: 15, name: 'Maha Shivaratri', value: '02-15' },
        { month: 2, day: 4, name: 'Holi (Dhuleti)', value: '03-04' },
        { month: 2, day: 21, name: 'Ramjan-Id (Eid-ul-Fitr)', value: '03-21' },
        { month: 2, day: 26, name: 'Shree Ram Navmi', value: '03-26' },
        { month: 2, day: 31, name: 'Mahavir Janma Kalyanak', value: '03-31' },
        { month: 3, day: 3, name: 'Good Friday', value: '04-03' },
        { month: 3, day: 14, name: 'Ambedkar Jayanti', value: '04-14' },
        { month: 4, day: 1, name: 'Gujarat Day / Labour Day', value: '05-01' },
        { month: 4, day: 27, name: 'Id-ul-Zuha (Bakri Id)', value: '05-27' },
        { month: 5, day: 26, name: 'Muharram', value: '06-26' },
        { month: 7, day: 15, name: 'Independence Day', value: '08-15' },
        { month: 7, day: 26, name: 'Id-e-Milad', value: '08-26' },
        { month: 9, day: 2, name: 'Gandhi Jayanti', value: '10-02' },
        { month: 10, day: 8, name: 'Diwali', value: '11-08' },
        { month: 11, day: 25, name: 'Christmas', value: '12-25' },
        { month: 11, day: 31, name: 'New Year\'s Eve', value: '12-31' }
    ];

    const monthNames = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
    const monthShort = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

    const startInput = document.getElementById('start-date');
    const endInput = document.getElementById('end-date');
    const collegeInput = document.getElementById('college-holiday-input');

    function buildHolidayList() {
        const container = document.getElementById('holidays-list');
        if (!container) return;

        const startStr = startInput ? startInput.value : '';
        const endStr = endInput ? endInput.value : '';
        const startDate = parseDDMMYYYY(startStr);
        const endDate = parseDDMMYYYY(endStr);

        // If dates aren't valid yet, just show current/next few months like before or empty?
        // Let's show months between start and end date if they exist.

        const currentYear = new Date().getFullYear();

        let targetMonths = [];
        if (startDate && endDate && endDate >= startDate) {
            let curr = new Date(startDate.getFullYear(), startDate.getMonth(), 1);
            let end = new Date(endDate.getFullYear(), endDate.getMonth(), 1);
            while (curr <= end) {
                targetMonths.push({ month: curr.getMonth(), year: curr.getFullYear() });
                curr.setMonth(curr.getMonth() + 1);
            }
        }

        if (targetMonths.length === 0) {
            const today = new Date();
            targetMonths.push({ month: today.getMonth(), year: today.getFullYear() });
        }

        let html = '';
        let idCounter = 0;

        targetMonths.forEach(tm => {
            const hols = allHolidays.filter(h => h.month === tm.month);
            if (hols.length === 0) return;

            const label = tm.year !== currentYear ? `${monthNames[tm.month]} ${tm.year}` : monthNames[tm.month];

            html += `<h4 class="month-title">${label}</h4><div class="checkbox-grid">`;
            hols.forEach(h => {
                const uid = `h-hol-${idCounter++}`;
                const mm = String(h.month + 1).padStart(2, '0');
                const dd = String(h.day).padStart(2, '0');
                const val = `${tm.year}-${mm}-${dd}`;
                html += `<div class="checkbox-wrapper small"><input type="checkbox" class="holiday-checkbox" id="${uid}" value="${val}"><label for="${uid}">${h.name} (${monthShort[h.month]} ${h.day})</label></div>`;
            });
            html += `</div>`;
        });

        if (!html) {
            container.innerHTML = '<p style="font-size: 0.82rem; color: var(--text-muted); text-align: center; padding: 10px;">No public holidays found in these months.</p>';
        } else {
            container.innerHTML = html;
        }
    }

    if (startInput && endInput) {
        startInput.addEventListener('change', buildHolidayList);
        endInput.addEventListener('change', buildHolidayList);
        const checkUpdate = (e) => { if (e.target.value.length === 10) buildHolidayList(); };
        startInput.addEventListener('input', checkUpdate);
        endInput.addEventListener('input', checkUpdate);
    }

    buildHolidayList();

    const accordionHeader = document.getElementById('holidays-toggle');
    const accordionContent = document.getElementById('holidays-content');
    if (accordionHeader && accordionContent) {
        accordionHeader.addEventListener('click', () => {
            accordionHeader.classList.toggle('active');
            accordionContent.classList.toggle('open');
        });
    }

    // ==========================================
    // College Holidays
    // ==========================================
    const collegeHolidays = [];
    const addCollegeBtn = document.getElementById('add-college-holiday');
    const collegeList = document.getElementById('college-holidays-list');

    function renderCollegeTags() {
        if (!collegeList) return;
        collegeList.innerHTML = collegeHolidays.map((dateStr, i) => {
            const [y, m, d] = dateStr.split('-');
            return `<span style="display: inline-flex; align-items: center; gap: 6px; padding: 6px 12px; background: rgba(6, 182, 212, 0.1); border: 1px solid rgba(6, 182, 212, 0.2); border-radius: 8px; font-size: 0.82rem; color: var(--primary); font-weight: 600;">${d}/${m}/${y}<span class="remove-college-hol" data-index="${i}" style="cursor: pointer; font-size: 1rem; line-height: 1; color: var(--text-muted);">&times;</span></span>`;
        }).join('');
        collegeList.querySelectorAll('.remove-college-hol').forEach(btn => {
            btn.addEventListener('click', () => { collegeHolidays.splice(parseInt(btn.dataset.index), 1); renderCollegeTags(); });
        });
    }

    if (addCollegeBtn && collegeInput) {
        addCollegeBtn.addEventListener('click', () => {
            const val = collegeInput.value.trim();
            const parsed = parseDDMMYYYY(val);
            if (!parsed) { alert('Please enter a valid date in DD/MM/YYYY format.'); return; }
            const mm = String(parsed.getMonth() + 1).padStart(2, '0');
            const dd = String(parsed.getDate()).padStart(2, '0');
            const iso = `${parsed.getFullYear()}-${mm}-${dd}`;
            if (collegeHolidays.includes(iso)) { alert('Already added.'); return; }
            collegeHolidays.push(iso);
            collegeInput.value = '';
            renderCollegeTags();
        });
        collegeInput.addEventListener('keydown', (e) => { if (e.key === 'Enter') { e.preventDefault(); addCollegeBtn.click(); } });
    }

    // ==========================================
    // Exam Schedule
    // ==========================================
    const examRanges = []; // [{start: Date, end: Date}]
    const examStartInput = document.getElementById('exam-start-date');
    const examEndInput = document.getElementById('exam-end-date');
    const addExamBtn = document.getElementById('add-exam-range');
    const examList = document.getElementById('exam-ranges-list');

    function renderExamTags() {
        if (!examList) return;
        examList.innerHTML = examRanges.map((range, i) => {
            return `<span class="exam-tag">${formatDateDDMMYYYY(range.start)} - ${formatDateDDMMYYYY(range.end)}<span class="exam-tag-remove" data-index="${i}">&times;</span></span>`;
        }).join('');
        examList.querySelectorAll('.exam-tag-remove').forEach(btn => {
            btn.addEventListener('click', () => { examRanges.splice(parseInt(btn.dataset.index), 1); renderExamTags(); });
        });
    }

    if (addExamBtn && examStartInput && examEndInput) {
        addExamBtn.addEventListener('click', () => {
            const start = parseDDMMYYYY(examStartInput.value.trim());
            const end = parseDDMMYYYY(examEndInput.value.trim());
            if (!start || !end) { alert('Please enter both start and end dates.'); return; }
            if (end < start) { alert('End date cannot be before start date.'); return; }
            examRanges.push({ start, end });
            examStartInput.value = '';
            examEndInput.value = '';
            renderExamTags();
        });
    }

    autoFormatDate(examStartInput);
    autoFormatDate(examEndInput);

    // DD/MM/YYYY helpers
    function formatDateDDMMYYYY(date) {
        const dd = String(date.getDate()).padStart(2, '0');
        const mm = String(date.getMonth() + 1).padStart(2, '0');
        const yyyy = date.getFullYear();
        return `${dd}/${mm}/${yyyy}`;
    }

    function parseDDMMYYYY(str) {
        const parts = str.split('/');
        if (parts.length !== 3) return null;
        const day = parseInt(parts[0], 10);
        const month = parseInt(parts[1], 10) - 1;
        const year = parseInt(parts[2], 10);
        const d = new Date(year, month, day);
        if (d.getFullYear() !== year || d.getMonth() !== month || d.getDate() !== day) return null;
        return d;
    }

    // Auto-format DD/MM/YYYY
    function autoFormatDate(input) {
        if (!input) return;
        input.addEventListener('input', function (e) {
            let val = this.value.replace(/[^\d]/g, '');
            if (val.length > 8) val = val.slice(0, 8);
            if (val.length >= 5) val = val.slice(0, 2) + '/' + val.slice(2, 4) + '/' + val.slice(4);
            else if (val.length >= 3) val = val.slice(0, 2) + '/' + val.slice(2);
            this.value = val;
        });
    }

    autoFormatDate(startInput);
    autoFormatDate(endInput);
    autoFormatDate(collegeInput);

    // Set default dates
    const today = new Date();
    const nextWeek = new Date();
    nextWeek.setDate(today.getDate() + 5);
    if (startInput) startInput.value = formatDateDDMMYYYY(today);
    if (endInput) endInput.value = formatDateDDMMYYYY(nextWeek);

    const inputs = {
        1: document.getElementById('h-mon'),
        2: document.getElementById('h-tue'),
        3: document.getElementById('h-wed'),
        4: document.getElementById('h-thu'),
        5: document.getElementById('h-fri'),
        6: document.getElementById('h-sat')
    };

    const weeklyOff = document.getElementById('h-weekly-off');
    const saturdayOff = document.getElementById('h-saturday-off');

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

    if (!calculateBtn) return;

    calculateBtn.addEventListener('click', () => {
        const attended = parseInt(document.getElementById('h-attended').value);
        const totalRaw = parseInt(document.getElementById('h-total').value);
        const noAttendanceInput = document.getElementById('h-no-attendance');
        const noAttendance = noAttendanceInput ? parseInt(noAttendanceInput.value) || 0 : 0;
        const currentTotal = totalRaw - noAttendance;
        const startDateStr = startInput.value;
        const endDateStr = endInput.value;

        if (isNaN(attended) || isNaN(totalRaw) || !startDateStr || !endDateStr) {
            alert('Please fill in all fields with valid data.');
            return;
        }

        if (attended > currentTotal) {
            alert('Attended classes cannot be greater than the effective total held classes.');
            return;
        }

        const startDate = parseDDMMYYYY(startDateStr);
        const endDate = parseDDMMYYYY(endDateStr);

        if (!startDate || !endDate) {
            alert('Please enter valid dates.');
            return;
        }

        if (endDate < startDate) { alert('End date cannot be before start date!'); return; }

        const schedule = {
            1: parseInt(document.getElementById('h-mon').value) || 0,
            2: parseInt(document.getElementById('h-tue').value) || 0,
            3: parseInt(document.getElementById('h-wed').value) || 0,
            4: parseInt(document.getElementById('h-thu').value) || 0,
            5: parseInt(document.getElementById('h-fri').value) || 0,
            6: parseInt(document.getElementById('h-sat').value) || 0,
            0: 0
        };

        const holidayCheckboxes = document.querySelectorAll('.holiday-checkbox:checked');
        const activeHolidays = Array.from(holidayCheckboxes).map(cb => cb.value);
        collegeHolidays.forEach(d => { if (!activeHolidays.includes(d)) activeHolidays.push(d); });

        let weeklyOffDay = weeklyOff ? weeklyOff.value : 'none';
        let satOffType = saturdayOff ? saturdayOff.value : 'none';

        let examOverlapDetected = false;
        let examDatesFound = [];

        function getSlotsOnDate(date) {
            const dayOfWeek = date.getDay();
            let slots = schedule[dayOfWeek];
            if (weeklyOffDay !== 'none' && dayOfWeek === parseInt(weeklyOffDay)) slots = 0;
            if (dayOfWeek === 6 && weeklyOffDay !== '6' && satOffType !== 'none') {
                if (satOffType === 'all') slots = 0;
                else {
                    const weekOfMonth = Math.ceil(date.getDate() / 7);
                    if (satOffType === 'odd' && weekOfMonth % 2 !== 0) slots = 0;
                    else if (satOffType === 'even' && weekOfMonth % 2 === 0) slots = 0;
                }
            }
            if (slots > 0) {
                const cm = String(date.getMonth() + 1).padStart(2, '0');
                const cd = String(date.getDate()).padStart(2, '0');
                const cy = date.getFullYear();
                const isoLong = cy + '-' + cm + '-' + cd;
                const isoShort = cm + '-' + cd;
                if (activeHolidays.includes(isoLong) || activeHolidays.includes(isoShort)) slots = 0;

                // Check exam ranges
                if (slots > 0) {
                    const isExam = examRanges.some(range => {
                        const d = new Date(date);
                        d.setHours(0, 0, 0, 0);
                        const s = new Date(range.start);
                        s.setHours(0, 0, 0, 0);
                        const e = new Date(range.end);
                        e.setHours(0, 0, 0, 0);
                        return d >= s && d <= e;
                    });
                    if (isExam) {
                        slots = 0;
                        examOverlapDetected = true;
                        const dateStr = formatDateDDMMYYYY(date);
                        if (!examDatesFound.includes(dateStr)) examDatesFound.push(dateStr);
                    }
                }
            }
            return slots;
        }

        // 1. Calculate attendance on start date (assuming full attendance until then)
        let tempToday = new Date();
        tempToday.setHours(0, 0, 0, 0);
        let futureAttended = attended;
        let futureTotal = currentTotal;

        let calcDate = new Date(tempToday);
        calcDate.setDate(calcDate.getDate() + 1); // Start from tomorrow

        while (calcDate < startDate) {
            const s = getSlotsOnDate(calcDate);
            futureAttended += s;
            futureTotal += s;
            calcDate.setDate(calcDate.getDate() + 1);
        }

        const startPct = (futureAttended / futureTotal) * 100;

        // 2. Calculate impact of the trip
        let lostSlots = 0;
        let tripDays = 0;
        calcDate = new Date(startDate);
        while (calcDate <= endDate) {
            lostSlots += getSlotsOnDate(calcDate);
            tripDays++;
            calcDate.setDate(calcDate.getDate() + 1);
        }

        const finalTotal = futureTotal + lostSlots;
        const finalPct = (futureAttended / finalTotal) * 100;
        const drop = startPct - finalPct;

        // Show results
        if (resultPlaceholder && !resultPlaceholder.classList.contains('calculated')) {
            resultPlaceholder.classList.add('calculated');
            const phIcon = document.getElementById('ph-icon'), phTitle = document.getElementById('ph-title'), phDesc = document.getElementById('ph-desc');
            if (phIcon && phDesc && phTitle) {
                phIcon.style.opacity = '0'; phDesc.style.opacity = '0';
                setTimeout(() => {
                    phIcon.style.display = 'none'; phDesc.style.display = 'none';
                    phTitle.innerText = 'Trip Impact Report';
                    phTitle.style.fontSize = '1.1rem'; phTitle.style.textTransform = 'uppercase'; phTitle.style.letterSpacing = '1px'; phTitle.style.marginBottom = '25px';
                    resultPlaceholder.style.flex = 'initial';
                    holidayResults.classList.remove('hidden');
                    void holidayResults.offsetWidth;
                    holidayResults.style.opacity = '1'; holidayResults.style.transform = 'translateY(0)';
                }, 300);
            }
        }

        document.getElementById('h-drop').innerText = `-${drop.toFixed(1)}%`;
        document.getElementById('h-start-pct').innerText = startPct.toFixed(1) + '%';
        document.getElementById('h-slots-lost').innerText = lostSlots;
        document.getElementById('h-before-pct').innerText = startPct.toFixed(1) + '%';
        document.getElementById('h-after-pct').innerText = finalPct.toFixed(1) + '%';

        setTimeout(() => {
            document.getElementById('before-bar').style.width = Math.min(startPct, 100) + '%';
            document.getElementById('after-bar').style.width = Math.min(finalPct, 100) + '%';
        }, 100);

        const dropEl = document.getElementById('h-drop');
        dropEl.style.color = drop > 10 ? '#dc2626' : drop > 5 ? '#f59e0b' : '#10b981';

        const verdict = document.getElementById('h-verdict');
        let verdictHtml = '';
        let verdictClass = '';

        if (drop > 10) {
            verdictClass = 'impact-verdict verdict-danger';
            verdictHtml = `<strong>⚠️ High Impact!</strong> Your attendance will drop significantly. You'll start the trip with ${startPct.toFixed(1)}% and end with ${finalPct.toFixed(1)}%.`;
        } else if (drop > 5) {
            verdictClass = 'impact-verdict verdict-warning';
            verdictHtml = `<strong>⚡ Moderate Impact.</strong> You'll go from ${startPct.toFixed(1)}% to ${finalPct.toFixed(1)}%. Be careful!`;
        } else if (lostSlots === 0) {
            verdictClass = 'impact-verdict verdict-safe';
            verdictHtml = `<strong>🎉 Zero Impact!</strong> No classes fall on your trip dates. You'll stay at ${startPct.toFixed(1)}%. Enjoy!`;
        } else {
            verdictClass = 'impact-verdict verdict-safe';
            verdictHtml = `<strong>✅ Low Impact.</strong> Manageable drop from ${startPct.toFixed(1)}% to ${finalPct.toFixed(1)}%.`;
        }

        if (finalPct < 75) {
            verdictHtml += `<br><span style="display: block; margin-top: 8px; color: #dc2626; font-weight: 600;">⚠️ Suggestion: You should attend your remaining classes to stay above 75%.</span>`;
        }

        verdict.className = verdictClass;
        verdict.innerHTML = verdictHtml;

        const examWarning = document.getElementById('h-exam-warning');
        if (examWarning) {
            if (examOverlapDetected) {
                examWarning.style.display = 'block';
                examWarning.innerHTML = `<strong>📝 Exam Schedule Alert:</strong> Your selected trip dates overlap with your exam schedule (e.g., ${examDatesFound.slice(0, 3).join(', ')}${examDatesFound.length > 3 ? '...' : ''}). Classes are already marked as off during these days.`;
            } else {
                examWarning.style.display = 'none';
            }
        }

        setTimeout(() => { holidayResults.scrollIntoView({ behavior: 'smooth', block: 'start' }); }, 300);
    });
});

