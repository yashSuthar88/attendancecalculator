document.addEventListener('DOMContentLoaded', () => {
    const calculateBtn = document.getElementById('calculate-impact-btn');
    const resultPlaceholder = document.getElementById('result-placeholder');
    const holidayResults = document.getElementById('holiday-results');

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
        if (isNaN(day) || isNaN(month) || isNaN(year)) return null;
        const d = new Date(year, month, day);
        if (d.getFullYear() !== year || d.getMonth() !== month || d.getDate() !== day) return null;
        return d;
    }

    // Auto-format DD/MM/YYYY as user types
    function autoFormatDate(input) {
        input.addEventListener('input', function (e) {
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

    const startInput = document.getElementById('start-date');
    const endInput = document.getElementById('end-date');

    autoFormatDate(startInput);
    autoFormatDate(endInput);

    // Set default dates
    const today = new Date();
    const nextWeek = new Date();
    nextWeek.setDate(today.getDate() + 5);

    startInput.value = formatDateDDMMYYYY(today);
    endInput.value = formatDateDDMMYYYY(nextWeek);

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
        const total = parseInt(document.getElementById('h-total').value);
        const startDateStr = startInput.value;
        const endDateStr = endInput.value;

        if (isNaN(attended) || isNaN(total) || !startDateStr || !endDateStr) {
            alert('Please fill in all fields with valid data.');
            return;
        }

        const startDate = parseDDMMYYYY(startDateStr);
        const endDate = parseDDMMYYYY(endDateStr);

        if (!startDate || !endDate) {
            alert('Please enter valid dates in DD/MM/YYYY format.');
            return;
        }

        if (endDate < startDate) {
            alert('End date cannot be before start date!');
            return;
        }

        const timetable = {
            1: parseInt(document.getElementById('h-mon').value) || 0,
            2: parseInt(document.getElementById('h-tue').value) || 0,
            3: parseInt(document.getElementById('h-wed').value) || 0,
            4: parseInt(document.getElementById('h-thu').value) || 0,
            5: parseInt(document.getElementById('h-fri').value) || 0,
            6: parseInt(document.getElementById('h-sat').value) || 0,
            0: 0 // Sunday always 0
        };

        let lostSlots = 0;
        let currentDate = new Date(startDate);
        let daysCount = 0;

        let weeklyOffDay = weeklyOff ? weeklyOff.value : 'none';
        let satOffType = saturdayOff ? saturdayOff.value : 'none';

        while (currentDate <= endDate) {
            const dayOfWeek = currentDate.getDay();
            let slotsToday = timetable[dayOfWeek];

            if (weeklyOffDay !== 'none' && dayOfWeek === parseInt(weeklyOffDay)) slotsToday = 0;
            if (dayOfWeek === 6 && weeklyOffDay !== '6' && satOffType !== 'none') {
                if (satOffType === 'all') { slotsToday = 0; }
                else {
                    const weekOfMonth = Math.ceil(currentDate.getDate() / 7);
                    if (satOffType === 'odd' && weekOfMonth % 2 !== 0) slotsToday = 0;
                    else if (satOffType === 'even' && weekOfMonth % 2 === 0) slotsToday = 0;
                }
            }

            lostSlots += slotsToday;
            currentDate.setDate(currentDate.getDate() + 1);
            daysCount++;
        }

        const currentPct = (attended / total) * 100;
        const newTotal = total + lostSlots;
        const newPct = (attended / newTotal) * 100;
        const drop = currentPct - newPct;

        // Animate placeholder to results header
        if (resultPlaceholder && !resultPlaceholder.classList.contains('calculated')) {
            resultPlaceholder.classList.add('calculated');
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

                    phTitle.innerText = 'Trip Impact Report';
                    phTitle.style.fontSize = '1.1rem';
                    phTitle.style.textTransform = 'uppercase';
                    phTitle.style.letterSpacing = '1px';
                    phTitle.style.marginBottom = '25px';

                    resultPlaceholder.style.flex = 'initial';

                    holidayResults.classList.remove('hidden');
                    // Trigger reflow for animation
                    void holidayResults.offsetWidth;
                    holidayResults.style.opacity = '1';
                    holidayResults.style.transform = 'translateY(0)';
                }, 300);
            } else {
                resultPlaceholder.classList.add('hidden');
                holidayResults.classList.remove('hidden');
                holidayResults.style.opacity = '1';
                holidayResults.style.transform = 'translateY(0)';
            }
        }

        // Populate values
        document.getElementById('h-drop').innerText = `-${drop.toFixed(1)}%`;
        document.getElementById('h-days-count').innerText = daysCount;
        document.getElementById('h-slots-lost').innerText = lostSlots;
        document.getElementById('h-before-pct').innerText = currentPct.toFixed(1) + '%';
        document.getElementById('h-after-pct').innerText = newPct.toFixed(1) + '%';

        // Animate comparison bars
        setTimeout(() => {
            document.getElementById('before-bar').style.width = Math.min(currentPct, 100) + '%';
            document.getElementById('after-bar').style.width = Math.min(newPct, 100) + '%';
        }, 100);

        // Color the drop value
        const dropEl = document.getElementById('h-drop');
        dropEl.style.color = drop > 10 ? '#dc2626' : drop > 5 ? '#f59e0b' : '#10b981';

        // Verdict
        const verdict = document.getElementById('h-verdict');
        if (drop > 10) {
            verdict.className = 'impact-verdict verdict-danger';
            verdict.innerHTML = `<strong>⚠️ High Impact!</strong> This trip will significantly hurt your attendance. Consider shortening it.`;
        } else if (drop > 5) {
            verdict.className = 'impact-verdict verdict-warning';
            verdict.innerHTML = `<strong>⚡ Moderate Impact.</strong> You'll lose noticeable ground. Make sure to attend all classes after.`;
        } else if (lostSlots === 0) {
            verdict.className = 'impact-verdict verdict-safe';
            verdict.innerHTML = `<strong>🎉 Zero Impact!</strong> No classes fall on your trip dates. Enjoy your break!`;
        } else {
            verdict.className = 'impact-verdict verdict-safe';
            verdict.innerHTML = `<strong>✅ Low Impact.</strong> This trip is manageable. You'll barely feel the difference.`;
        }

        setTimeout(() => {
            holidayResults.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }, 300);
    });
});
