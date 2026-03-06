document.addEventListener('DOMContentLoaded', () => {
    const calculateBtn = document.getElementById('calculate-btn');
    const attendedInput = document.getElementById('attended');
    const totalInput = document.getElementById('total');
    const missUpcomingInput = document.getElementById('miss-upcoming');

    const resultSection = document.getElementById('result-section');
    const calcPlaceholder = document.getElementById('calc-placeholder');
    const dropDisplay = document.getElementById('drop-display');
    const statusMessage = document.getElementById('status-message');
    const actionMessage = document.getElementById('action-message');

    if (!calculateBtn) return;

    calculateBtn.addEventListener('click', () => {
        const attended = parseInt(attendedInput.value);
        const totalRaw = parseInt(totalInput.value);
        const missUpcoming = parseInt(missUpcomingInput.value);
        const noAttendanceInput = document.getElementById('no-attendance');
        const noAttendance = noAttendanceInput ? parseInt(noAttendanceInput.value) : 0;

        if (isNaN(attended) || isNaN(totalRaw) || isNaN(missUpcoming)) {
            alert('Please enter valid numbers for all fields.');
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
        if (missUpcoming < 0) {
            alert('Number of upcoming lectures to miss cannot be negative.');
            return;
        }

        const currentPct = (attended / total) * 100;
        const currentPctRounded = (Math.round(currentPct * 100) / 100).toFixed(2);

        const newTotal = total + missUpcoming;
        const newPct = (attended / newTotal) * 100;
        const newPctRounded = (Math.round(newPct * 100) / 100).toFixed(2);

        const dropPct = currentPct - newPct;
        const dropPctRounded = (Math.round(dropPct * 100) / 100).toFixed(2);

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

                    phTitle.innerText = 'Impact Results';
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

        // Stats updates
        document.getElementById('current-pct').innerText = currentPctRounded + '%';
        document.getElementById('new-pct').innerText = newPctRounded + '%';
        document.getElementById('drop-pct').innerText = `-${dropPctRounded}%`;
        document.getElementById('new-total').innerText = newTotal;

        setTimeout(() => {
            // Show the drop percentage as the main result
            dropDisplay.innerText = `-${dropPctRounded}%`;

            dropDisplay.style.color = '';
            statusMessage.classList.remove('text-success', 'text-danger', 'text-warning');

            // Show how many percentage remain right after
            statusMessage.innerHTML = `Remaining: <strong>${newPctRounded}%</strong>`;

            if (newPct >= 75) {
                dropDisplay.style.color = 'var(--success)';
                statusMessage.classList.add('text-success');
                actionMessage.innerHTML = `You drop by <strong>${dropPctRounded}%</strong> but stay in the <strong>Safe Zone</strong>.`;
            } else if (newPct >= 65) {
                dropDisplay.style.color = 'var(--warning)';
                statusMessage.classList.add('text-warning');
                actionMessage.innerHTML = `You drop by <strong>${dropPctRounded}%</strong> into the <strong>Warning Zone</strong>. You might need special permission.`;
            } else {
                dropDisplay.style.color = 'var(--danger)';
                statusMessage.classList.add('text-danger');
                actionMessage.innerHTML = `You drop drastically by <strong>${dropPctRounded}%</strong> into the <strong>Danger Zone</strong>. Skipping ${missUpcoming} class${missUpcoming > 1 ? 'es' : ''} is not recommended.`;
            }

            setTimeout(() => {
                resultSection.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
            }, 300);
        }, 50);
    });
});
