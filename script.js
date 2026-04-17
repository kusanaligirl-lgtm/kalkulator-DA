document.addEventListener('DOMContentLoaded', () => {
    // === ADVANCED CALCULATOR LOGIC ===
    const advBtn = document.getElementById('adv-calculate-btn');
    const advResultsPanel = document.getElementById('adv-results');

    advBtn.addEventListener('click', () => {
        const type = document.getElementById('adv-type').value;
        const n1 = parseInt(document.getElementById('adv-n1').value);
        const v1 = parseFloat(document.getElementById('adv-v1').value);
        const n2 = parseInt(document.getElementById('adv-n2').value);
        const v2 = parseFloat(document.getElementById('adv-v2').value);

        const targetN = parseInt(document.getElementById('adv-target-n').value);
        const rStart = parseInt(document.getElementById('adv-range-start').value);
        const rEnd = parseInt(document.getElementById('adv-range-end').value);

        if (isNaN(n1) || isNaN(v1) || isNaN(n2) || isNaN(v2) || isNaN(targetN) || isNaN(rStart) || isNaN(rEnd)) {
            alert("⚠️ Mohon isi semua field bilangan dengan lengkap!");
            return;
        }

        if (n1 === n2) {
            alert("⚠️ Nilai n1 dan n2 tidak boleh sama!");
            return;
        }

        let a, b;
        let formulaText = "";
        const formatNumber = (num) => Number.isInteger(num) ? num : parseFloat(num.toFixed(4));

        if (type === 'U') {
            // Un = a + (n-1)b
            b = (v1 - v2) / (n1 - n2);
            a = v1 - (n1 - 1) * b;

            formulaText = `Tipe Info: 2 Suku (U<sub>n</sub>)<br>
            b = (U<sub>${n1}</sub> - U<sub>${n2}</sub>) / (${n1} - ${n2}) <br>
            b = (${v1} - ${v2}) / (${n1 - n2}) = <b>${formatNumber(b)}</b> <br>
            a = U<sub>${n1}</sub> - (${n1}-1)b = ${v1} - (${n1 - 1})&times;(${formatNumber(b)}) = <b>${formatNumber(a)}</b>`;

        } else {
            // Sn = n/2 * (2a + (n-1)b) => 2a + (n-1)b = 2*Sn / n
            const rhs1 = (2 * v1) / n1;
            const rhs2 = (2 * v2) / n2;

            b = (rhs1 - rhs2) / (n1 - n2);
            a = (rhs1 - (n1 - 1) * b) / 2;

            formulaText = `Tipe Info: 2 Jumlah Suku (S<sub>n</sub>)<br>
            Pers. 1: 2a + (${n1}-1)b = 2S<sub>${n1}</sub>/${n1} &rarr; 2a + ${n1 - 1}b = ${formatNumber(rhs1)}<br>
            Pers. 2: 2a + (${n2}-1)b = 2S<sub>${n2}</sub>/${n2} &rarr; 2a + ${n2 - 1}b = ${formatNumber(rhs2)}<br>
            b = (${formatNumber(rhs1)} - ${formatNumber(rhs2)}) / (${n1} - ${n2}) = <b>${formatNumber(b)}</b> <br>
            a = (${formatNumber(rhs1)} - ${n1 - 1}b) / 2 = <b>${formatNumber(a)}</b>`;
        }

        const calcUn = (n) => a + (n - 1) * b;
        const calcSn = (n) => (n / 2) * (2 * a + (n - 1) * b);

        const targetUn = calcUn(targetN);
        const targetSn = calcSn(targetN);

        let rangeSum = 0;
        formulaText += `<br><br><span style="color:var(--accent-2); font-weight:bold; font-size:1.1rem;">Langkah Pencarian Target:</span><br>`;
        formulaText += `U<sub>${targetN}</sub> = a + (${targetN}-1)b <br>
            &nbsp;&nbsp;= ${formatNumber(a)} + (${targetN - 1})&times;(${formatNumber(b)}) = <b>${formatNumber(targetUn)}</b><br><br>`;
        formulaText += `S<sub>${targetN}</sub> = (${targetN}/2) &times; (2a + (${targetN}-1)b) <br>
            &nbsp;&nbsp;= (${targetN}/2) &times; (2(${formatNumber(a)}) + (${targetN - 1})(${formatNumber(b)})) = <b>${formatNumber(targetSn)}</b><br><br>`;

        formulaText += `<span style="color:var(--accent-2); font-weight:bold; font-size:1.1rem;">Langkah Jumlah Suku ke-${rStart} s/d ke-${rEnd}:</span><br>`;
        if (rStart <= 1) {
            rangeSum = calcSn(rEnd);
            formulaText += `Karena rentang dimulai dari suku awal, cukup hitung S<sub>${rEnd}</sub> = <b>${formatNumber(rangeSum)}</b>`;
        } else {
            rangeSum = calcSn(rEnd) - calcSn(rStart - 1);
            formulaText += `Total Rentang = S<sub>${rEnd}</sub> - S<sub>${rStart - 1}</sub> <br>
            S<sub>${rEnd}</sub> = ${formatNumber(calcSn(rEnd))} <br>
            S<sub>${rStart - 1}</sub> = ${formatNumber(calcSn(rStart - 1))} <br>
            Total = ${formatNumber(calcSn(rEnd))} - ${formatNumber(calcSn(rStart - 1))} = <b>${formatNumber(rangeSum)}</b>`;
        }

        document.getElementById('lbl-target-n1').innerText = targetN;
        document.getElementById('lbl-target-n2').innerText = targetN;
        document.getElementById('lbl-range-start').innerText = rStart;
        document.getElementById('lbl-range-end').innerText = rEnd;

        advResultsPanel.style.opacity = 0;
        advResultsPanel.classList.remove('hidden');

        setTimeout(() => {
            document.getElementById('adv-res-a').innerText = formatNumber(a);
            document.getElementById('adv-res-b').innerText = formatNumber(b);
            document.getElementById('adv-res-un').innerText = formatNumber(targetUn);
            document.getElementById('adv-res-sn').innerText = formatNumber(targetSn);
            document.getElementById('adv-res-range').innerText = formatNumber(rangeSum);
            document.getElementById('adv-res-formula').innerHTML = formulaText;

            advResultsPanel.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
            advResultsPanel.style.transform = 'translateY(20px)';

            requestAnimationFrame(() => {
                advResultsPanel.style.opacity = 1;
                advResultsPanel.style.transform = 'translateY(0)';
            });

            advResultsPanel.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
        }, 50);
    });
});
