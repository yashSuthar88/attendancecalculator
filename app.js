document.addEventListener('DOMContentLoaded', () => {
    const calculateBtn = document.getElementById('calculate-btn');
    const attendedInput = document.getElementById('attended');
    const totalInput = document.getElementById('total');
    const goalInput = document.getElementById('goal');

    const resultSection = document.getElementById('result-section');
    const calcPlaceholder = document.getElementById('calc-placeholder');
    const progressCircle = document.getElementById('progress-circle');
    const percentageDisplay = document.getElementById('percentage-display');
    const statusMessage = document.getElementById('status-message');
    const actionMessage = document.getElementById('action-message');

    const CIRCUMFERENCE = 2 * Math.PI * 45;

    if (!calculateBtn) return;

    // Dismiss button
    const dismissBtn = document.getElementById('dismiss-alert-btn');
    if (dismissBtn) {
        dismissBtn.addEventListener('click', () => {
            document.getElementById('no-attendance-alert').classList.add('hidden');
        });
    }

    calculateBtn.addEventListener('click', () => {
        const attended = parseInt(attendedInput.value);
        let totalRaw = parseInt(totalInput.value);
        const goal = parseInt(goalInput.value);
        const noAttendanceInput = document.getElementById('no-attendance');
        const noAttendance = noAttendanceInput ? parseInt(noAttendanceInput.value) : 0;

        if (isNaN(attended) || isNaN(totalRaw) || isNaN(goal)) {
            alert('Please enter valid numbers for Attended, Total Held, and Goal.');
            return;
        }

        const total = isNaN(noAttendance) ? totalRaw : totalRaw - noAttendance;

        if (attended > total) {
            alert('Attended classes cannot be greater than the effective total classes.');
            return;
        }
        if (total <= 0) {
            alert('Effective total classes must be greater than zero.');
            return;
        }

        const currentPct = (attended / total) * 100;
        const currentPctRounded = Math.round(currentPct * 100) / 100;

        // Animate placeholder to results header
        if (calcPlaceholder && !calcPlaceholder.classList.contains('calculated')) {
            calcPlaceholder.classList.add('calculated');
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

                    phTitle.innerText = 'Your Results';
                    phTitle.style.fontSize = '1.1rem';
                    phTitle.style.textTransform = 'uppercase';
                    phTitle.style.letterSpacing = '1px';
                    phTitle.style.marginBottom = '25px';

                    calcPlaceholder.style.flex = 'initial';

                    resultSection.classList.remove('hidden');
                    // Trigger reflow for animation
                    void resultSection.offsetWidth;
                    resultSection.style.opacity = '1';
                    resultSection.style.transform = 'translateY(0)';
                }, 300);
            } else {
                calcPlaceholder.classList.add('hidden');
                resultSection.classList.remove('hidden');
                resultSection.style.opacity = '1';
                resultSection.style.transform = 'translateY(0)';
            }
        }

        // Absent stats
        const missed = total - attended;
        const absentPct = ((missed / total) * 100).toFixed(1);
        document.getElementById('missed-count').innerText = missed;
        document.getElementById('absent-pct').innerText = absentPct + '%';
        document.getElementById('attended-count').innerText = attended;
        document.getElementById('total-count').innerText = total;

        // No Attendance Alert
        const noAttAlert = document.getElementById('no-attendance-alert');
        if (attended === 0) {
            noAttAlert.classList.remove('hidden');
            document.getElementById('no-att-total').innerText = total;
            let needed = 0, tempAtt = 0, tempTotal = total;
            while ((tempAtt / tempTotal) * 100 < goal) { needed++; tempAtt++; tempTotal++; }
            document.getElementById('no-att-recovery').innerHTML =
                `You need to attend the next <span class="highlight-number needed">${needed}</span> consecutive classes to reach ${goal}%.`;
        } else {
            noAttAlert.classList.add('hidden');
        }

        // Progress circle animation
        progressCircle.style.transition = 'none';
        progressCircle.style.strokeDashoffset = CIRCUMFERENCE;
        progressCircle.getBoundingClientRect();
        progressCircle.style.transition = 'stroke-dashoffset 1s cubic-bezier(0.4, 0, 0.2, 1)';

        setTimeout(() => {
            const offset = CIRCUMFERENCE - (currentPct / 100) * CIRCUMFERENCE;
            progressCircle.style.strokeDashoffset = offset;
            percentageDisplay.innerText = `${currentPctRounded}%`;

            progressCircle.classList.remove('stroke-success', 'stroke-danger', 'stroke-warning');
            statusMessage.classList.remove('text-success', 'text-danger', 'text-warning');

            if (currentPct >= goal) {
                progressCircle.classList.add('stroke-success');
                statusMessage.classList.add('text-success');
                statusMessage.innerText = 'On Track!';

                let missable = 0, tempTotal = total;
                while ((attended / (tempTotal + 1)) * 100 >= goal) { missable++; tempTotal++; }

                if (missable > 0) {
                    actionMessage.innerHTML = `You can miss the next <span class="highlight-number missable">${missable}</span> class${missable > 1 ? 'es' : ''} and stay above ${goal}%.
                    <div class="predictor-suggestion success">
                        <span class="predictor-suggestion-title">Planning a trip?</span>
                        <a href="holiday-planner.html" class="predictor-suggestion-link">
                            Plan your holidays efficiently 🌴 <span class="predictor-suggestion-arrow">→</span>
                        </a>
                    </div>`;
                } else {
                    actionMessage.innerText = `You're exactly on the line. Don't miss the next class!`;
                }
            } else {
                progressCircle.classList.add('stroke-danger');
                statusMessage.classList.add('text-danger');
                statusMessage.innerText = 'Needs Improvement';

                if (goal === 100 && currentPct < 100) {
                    statusMessage.innerText = 'Impossible Goal';
                    actionMessage.innerText = 'You cannot reach 100% since you have already missed at least one class.';
                    return;
                }

                let needed = 0, tempAttended = attended, tempTotal = total;
                while ((tempAttended / tempTotal) * 100 < goal) { needed++; tempAttended++; tempTotal++; }
                actionMessage.innerHTML = `You need to attend the next <span class="highlight-number needed">${needed}</span> class${needed > 1 ? 'es' : ''} to reach ${goal}%.
                <div class="predictor-suggestion">
                    <span class="predictor-suggestion-title">Want to know when?</span>
                    <a href="attendance-predictor.html" class="predictor-suggestion-link">
                        Predict the exact date you'll hit ${goal}% 📅 <span class="predictor-suggestion-arrow">→</span>
                    </a>
                </div>`;
            }

            setTimeout(() => {
                resultSection.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
            }, 300);
        }, 50);
    });
});
