document.addEventListener('DOMContentLoaded', () => {
    // 1. DOM Elements
    const amountInput = document.getElementById('starting-amount');
    const rateSelect = document.getElementById('growth-rate');
    const bonusToggle = document.getElementById('bonus-toggle');
    const progressBar = document.getElementById('progress-bar');
    const resultsPanel = document.getElementById('results-panel');
    const statusBadge = document.getElementById('status-badge');
    const profitBadge = document.getElementById('profit-badge');
    const finalBalanceDisplay = document.getElementById('final-balance');

    // Intermediate Technique: Built-in currency formatter
    const moneyFormatter = new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
        minimumFractionDigits: 2
    });

    // 2. Calculation Logic (Separated from UI)
    function calculateInvestment() {
        const startingAmount = parseFloat(amountInput.value) || 0;
        const rate = parseFloat(rateSelect.value);
        const hasBonus = bonusToggle.checked;

        // Base math
        let finalBalance = startingAmount * rate;

        // Apply 15% VIP Bonus if toggled
        if (hasBonus) {
            finalBalance = finalBalance * 1.15;
        }

        const totalProfit = finalBalance - startingAmount;
        
        // Progress bar percentage (capped at 100% for a $10,000 goal)
        const progressPercentage = Math.min((startingAmount / 10000) * 100, 100);

        return { startingAmount, finalBalance, totalProfit, progressPercentage, hasBonus };
    }

    // 3. UI Update Logic
    function updateUI() {
        const data = calculateInvestment();

        // Update progress bar width
        progressBar.style.width = `${data.progressPercentage}%`;

        // If input is empty or 0, hide the results safely
        if (data.startingAmount <= 0) {
            resultsPanel.classList.remove('show');
            setTimeout(() => { if (!amountInput.value) resultsPanel.style.display = 'none'; }, 400);
            return;
        }

        // Show the panel
        resultsPanel.style.display = 'block';
        setTimeout(() => resultsPanel.classList.add('show'), 10);

        // Update text formatting using our currency formatter
        profitBadge.innerText = `+${moneyFormatter.format(data.totalProfit)}`;
        finalBalanceDisplay.innerText = moneyFormatter.format(data.finalBalance);

        // Handle visual state for the Bonus Toggle
        if (data.hasBonus) {
            statusBadge.innerText = 'VIP Boosted';
            statusBadge.className = 'badge warning'; // Turns red
            progressBar.style.background = 'var(--warning-color)';
            progressBar.style.boxShadow = '0 0 15px var(--warning-color)';
        } else {
            statusBadge.innerText = 'Standard';
            statusBadge.className = 'badge active'; // Turns green
            progressBar.style.background = 'var(--theme-accent)';
            progressBar.style.boxShadow = '0 0 15px var(--theme-accent)';
        }
    }

    // 4. Event Listeners
    amountInput.addEventListener('input', updateUI);
    rateSelect.addEventListener('change', updateUI);
    bonusToggle.addEventListener('change', updateUI);

    // Initial render
    updateUI();
});