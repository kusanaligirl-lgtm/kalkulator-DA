document.addEventListener('DOMContentLoaded', () => {
    // === TAB LOGIC ===
    const tabBtns = document.querySelectorAll('.tab-btn');
    const tabContents = document.querySelectorAll('.tab-content');
    
    tabBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            // Remove active from all
            tabBtns.forEach(b => b.classList.remove('active'));
            tabContents.forEach(c => c.classList.remove('active'));
            
            // Add active to current
            btn.classList.add('active');
            const targetId = btn.getAttribute('data-tab');
            document.getElementById(targetId).classList.add('active');
        });
    });

    // === BASIC CALCULATOR LOGIC ===
    const btn = document.getElementById('calculate-btn');
    const resultsPanel = document.getElementById('results');
    
    btn.addEventListener('click', () => {
        const a = parseFloat(document.getElementById('first-term').value);
        const b = parseFloat(document.getElementById('difference').value);
        const n = parseInt(document.getElementById('term-n').value);
        
        if (isNaN(a) || isNaN(b) || isNaN(n) || n < 1) {
            alert("⚠️ Mohon masukkan semua nilai dengan benar. (Nilai n harus bilangan bulat ≥ 1)");
            return;
        }

        const un = a + (n - 1) * b;
        const sn = (n / 2) * (2 * a + (n - 1) * b);
        const formatNumber = (num) => Number.isInteger(num) ? num : parseFloat(num.toFixed(4));
        
        let series = [];
        let limit = Math.min(n, 10);
        for (let i = 0; i < limit; i++) {
            series.push(formatNumber(a + i * b));
        }
        let seriesText = series.join(', ');
        if (n > 10) seriesText += `, ... , ${formatNumber(un)}`;
        
        resultsPanel.style.opacity = 0;
        resultsPanel.classList.remove('hidden');
        
        setTimeout(() => {
            document.getElementById('res-un').innerText = formatNumber(un);
            document.getElementById('res-sn').innerText = formatNumber(sn);
            document.getElementById('res-series').innerText = seriesText;
            
            const formulaUn = `U<sub>${n}</sub> = a + (n-1)b <br>
                               U<sub>${n}</sub> = ${a} + (${n}-1) &times; (${b}) <br>
                               U<sub>${n}</sub> = ${a} + (${n-1}) &times; (${b}) <br>
                               U<sub>${n}</sub> = <b>${formatNumber(un)}</b>`;
                               
            const formulaSn = `S<sub>${n}</sub> = n/2 &times; (2a + (n-1)b) <br>
                               S<sub>${n}</sub> = ${n}/2 &times; (2(${a}) + (${n}-1)(${b})) <br>
                               S<sub>${n}</sub> = ${n/2} &times; (${2*a} + ${n-1}&times;(${b})) <br>
                               S<sub>${n}</sub> = <b>${formatNumber(sn)}</b>`;
                               
            document.getElementById('res-un-formula').innerHTML = formulaUn;
            document.getElementById('res-sn-formula').innerHTML = formulaSn;
            
            resultsPanel.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
            resultsPanel.style.transform = 'translateY(20px)';
            
            requestAnimationFrame(() => {
                resultsPanel.style.opacity = 1;
                resultsPanel.style.transform = 'translateY(0)';
            });
            
            resultsPanel.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
        }, 50);
    });

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
            a = U<sub>${n1}</sub> - (${n1}-1)b = ${v1} - (${n1-1})&times;(${formatNumber(b)}) = <b>${formatNumber(a)}</b>`;
            
        } else {
            // Sn = n/2 * (2a + (n-1)b) => 2a + (n-1)b = 2*Sn / n
            const rhs1 = (2 * v1) / n1;
            const rhs2 = (2 * v2) / n2;
            
            b = (rhs1 - rhs2) / (n1 - n2);
            a = (rhs1 - (n1 - 1) * b) / 2;
            
            formulaText = `Tipe Info: 2 Jumlah Suku (S<sub>n</sub>)<br>
            Pers. 1: 2a + (${n1}-1)b = 2S<sub>${n1}</sub>/${n1} &rarr; 2a + ${n1-1}b = ${formatNumber(rhs1)}<br>
            Pers. 2: 2a + (${n2}-1)b = 2S<sub>${n2}</sub>/${n2} &rarr; 2a + ${n2-1}b = ${formatNumber(rhs2)}<br>
            b = (${formatNumber(rhs1)} - ${formatNumber(rhs2)}) / (${n1} - ${n2}) = <b>${formatNumber(b)}</b> <br>
            a = (${formatNumber(rhs1)} - ${n1-1}b) / 2 = <b>${formatNumber(a)}</b>`;
        }
        
        const calcUn = (n) => a + (n - 1) * b;
        const calcSn = (n) => (n / 2) * (2 * a + (n - 1) * b);
        
        const targetUn = calcUn(targetN);
        const targetSn = calcSn(targetN);
        
        let rangeSum = 0;
        if (rStart <= 1) {
            rangeSum = calcSn(rEnd);
        } else {
            rangeSum = calcSn(rEnd) - calcSn(rStart - 1);
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
