function addScenario() {
    const container = document.getElementById('scenarios');
    const div = document.createElement('div');
    div.className = 'scenario';
  
    div.innerHTML = `
      <div class="input-group">
        <label>Ticker<br><input type="text" class="ticker" placeholder=""></label>
      </div>
      <div class="input-group">
        <label>Entry Price<br><input type="number" class="entry" placeholder=""></label>
      </div>
      <div class="input-group">
        <label>Target Price<br><input type="number" class="exit" placeholder=""></label>
      </div>
      <div class="input-group">
        <label>Shares<br><input type="number" class="shares" placeholder=""></label>
      </div>
      <div class="input-group">
        <label>Stop Loss<br><input type="number" class="stop" placeholder=""></label>
      </div>
      <div class="input-group">
        <label>Reward ($)<br><input type="number" class="reward" readonly></label>
      </div>
      <div class="input-group">
        <label>Risk ($)<br><input type="number" class="risk" readonly></label>
      </div>
      <div class="input-group">
        <label>Win %<br><input type="number" class="win" placeholder=""></label>
      </div>
      <div class="input-group">
        <label>Loss %<br><input type="number" class="loss" readonly></label>
      </div>
  
      <button class="remove-btn" onclick="removeScenario(this)">Remove</button>
      <p class="ev-output">EV: </p>
    `;
  
    container.appendChild(div);
  
    // Attach auto-calculation listeners
    const inputsToWatch = ['entry', 'exit', 'shares', 'stop', 'win'];
    inputsToWatch.forEach((cls) => {
      div.querySelector(`.${cls}`).addEventListener('input', () => autoCalculate(div));
    });
  }

  function autoCalculate(scenarioDiv) {
    const entry = parseFloat(scenarioDiv.querySelector('.entry').value);
    const exit = parseFloat(scenarioDiv.querySelector('.exit').value);
    const stop = parseFloat(scenarioDiv.querySelector('.stop').value);
    const shares = parseFloat(scenarioDiv.querySelector('.shares').value);
    const win = parseFloat(scenarioDiv.querySelector('.win').value);
  
    const rewardInput = scenarioDiv.querySelector('.reward');
    const riskInput = scenarioDiv.querySelector('.risk');
    const lossInput = scenarioDiv.querySelector('.loss');
  
    // Calculate reward if valid
    if (!isNaN(entry) && !isNaN(exit) && !isNaN(shares)) {
      const reward = (exit - entry) * shares;
      rewardInput.value = reward.toFixed(2);
    } else {
      rewardInput.value = '';
    }
  
    // Calculate risk if valid
    if (!isNaN(entry) && !isNaN(stop) && !isNaN(shares)) {
      const risk = (entry - stop) * shares;
      riskInput.value = risk.toFixed(2);
    } else {
      riskInput.value = '';
    }
  
    // Calculate loss % if win is valid
    if (!isNaN(win)) {
      const loss = 100 - win;
      lossInput.value = loss.toFixed(2);
    } else {
      lossInput.value = '';
    }
  }
  
  
  
  function removeScenario(button) {
    const scenarioDiv = button.parentElement;
    scenarioDiv.remove();
  }

  function calculateReward(button) {
    const scenarioDiv = button.parentElement;
  
    const entry = parseFloat(scenarioDiv.querySelector('.entry').value);
    const exit = parseFloat(scenarioDiv.querySelector('.exit').value);
    const stop = parseFloat(scenarioDiv.querySelector('.stop').value);
    const shares = parseFloat(scenarioDiv.querySelector('.shares').value);
    const winInput = scenarioDiv.querySelector('.win');
    const lossInput = scenarioDiv.querySelector('.loss');
  
    const rewardInput = scenarioDiv.querySelector('.reward');
    const riskInput = scenarioDiv.querySelector('.risk');
  
    const win = parseFloat(winInput.value);
  
    if (isNaN(entry) || isNaN(exit) || isNaN(stop) || isNaN(shares) || isNaN(win)) {
      rewardInput.value = '';
      riskInput.value = '';
      lossInput.value = '';
      alert("Please fill out entry, exit, stop loss, shares, and win %.");
      return;
    }
  
    const reward = (exit - entry) * shares;
    const risk = (entry - stop) * shares;
    const loss = 100 - win;
  
    rewardInput.value = reward.toFixed(2);
    riskInput.value = risk.toFixed(2);
    lossInput.value = loss.toFixed(2);
  }
  
  
  
  function calculateAll() {
    const scenarios = document.querySelectorAll('.scenario');
    const results = [];
  
    scenarios.forEach((scenario) => {
      const ticker = scenario.querySelector('.ticker').value || "Unnamed";
      const reward = parseFloat(scenario.querySelector('.reward').value);
      const win = parseFloat(scenario.querySelector('.win').value) / 100;
      const risk = parseFloat(scenario.querySelector('.risk').value);
      const loss = parseFloat(scenario.querySelector('.loss').value) / 100;
      const output = scenario.querySelector('.ev-output');
  
      if (isNaN(reward) || isNaN(win) || isNaN(risk) || isNaN(loss)) {
        output.textContent = `EV (${ticker}): Incomplete`;
        output.className = 'ev-output';
        return;
      }
  
      const ev = (reward * win) - (risk * loss);
      const evClass = ev >= 0 ? 'ev-positive' : 'ev-negative';
  
      output.textContent = `EV (${ticker}): $${ev.toFixed(2)}`;
      output.className = `ev-output ${evClass}`;
  
      const evToRisk = risk !== 0 ? ev / risk : 0; // Prevent divide-by-zero
  
      results.push({
        ticker: ticker.toUpperCase(),
        ev: ev,
        evToRisk: evToRisk,
      });
    });
  
    // Sort and show ranked results
    results.sort((a, b) => b.ev - a.ev);
  
    const rankedResultsDiv = document.getElementById('ranked-results');
    rankedResultsDiv.innerHTML = '';
  
    results.forEach((result, i) => {
        const p = document.createElement('p');
        p.innerHTML = `#${i + 1}: ${result.ticker} → EV: $${result.ev.toFixed(2)}<br>EV/Risk: ${result.evToRisk.toFixed(2)}`;
        p.className = result.ev >= 0 ? 'ev-positive' : 'ev-negative';
        rankedResultsDiv.appendChild(p);
      });
      
  }
  