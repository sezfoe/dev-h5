<!DOCTYPE html>
<html lang="zh-TW">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no">
    <title>鼓譜編輯器 - 彈性佈局版</title>
    <style>
        :root {
            --bg: #0f172a;
            --panel: #1e293b;
            --primary: #10b981;
            --accent-ui: #f43f5e;
            --text: #f8fafc;
            --focus: #3b82f6;
            --box-size: 80px; 
            /* 計算一個小節的寬度：(格子*4) + (間距*3) + (小節內距*2) */
            --measure-width: calc((var(--box-size) * 4) + (8px * 3) + (20px));
        }
        @media (max-width: 768px) {
            :root {
                --box-size: 60px;
            }
        }

        body {
            margin: 0; background: var(--bg); color: var(--text);
            font-family: 'Inter', system-ui, -apple-system, sans-serif;
            display: flex; flex-direction: column; height: 100vh; overflow-x: hidden;
        }
        
        .controls {
            padding: 10px 15px; background: var(--panel);
            display: flex; justify-content: space-between; align-items: center;
            box-shadow: 0 4px 15px rgba(0,0,0,0.4);
            position: sticky; top: 0; z-index: 100;
            flex-wrap: wrap; gap: 10px;
        }
        .actions { display: flex; align-items: center; gap: 12px; flex-wrap: wrap; }
        .control-group { display: flex; align-items: center; gap: 6px; }
        
        select {
            background: #334155; color: white; border: 1px solid #475569;
            padding: 5px 8px; border-radius: 6px; outline: none; cursor: pointer; font-size: 14px;
        }

        .random-options {
            display: flex; gap: 2px; background: #334155; padding: 3px; border-radius: 8px; border: 1px solid #475569;
        }
        .random-chip {
            padding: 4px 8px; border-radius: 5px; cursor: pointer; font-size: 11px; font-weight: bold;
            color: #94a3b8; transition: all 0.2s; user-select: none; white-space: nowrap;
        }
        .random-chip.selected { background: var(--focus); color: white; }

        .btn-play {
            background: var(--primary); color: white; border: none;
            padding: 8px 16px; border-radius: 8px; font-weight: bold;
            cursor: pointer; display: flex; align-items: center; gap: 8px;
            transition: all 0.2s; min-width: 70px; justify-content: center;
        }
        .btn-play.playing { background: var(--accent-ui); }

        .btn-random {
            background: #6366f1; color: white; border: none;
            padding: 8px 12px; border-radius: 8px; font-weight: bold;
            cursor: pointer; transition: all 0.2s; font-size: 13px;
        }

        .main-content {
            flex-grow: 1; display: flex; flex-direction: column;
            align-items: center; padding: 20px 10px;
            overflow-y: auto;
        }
        
        .editor-row { 
            display: flex; flex-direction: column; align-items: flex-start; 
            margin-bottom: 40px; width: auto; /* 寬度由內容決定 */
        }
        
        .row-header { display: flex; align-items: center; gap: 10px; margin-bottom: 8px; }
        .row-label { font-weight: bold; color: #94a3b8; font-size: 0.9rem; }
        .editor-row.playing-row .row-label { color: var(--primary); transform: scale(1.05); }

        /* 關鍵修正佈局：使用 flex-wrap 與 max-width */
        .editor-strip {
            display: flex;
            flex-wrap: wrap; /* 寬度不足時自動以小節為單位換行 */
            background: #fff; padding: 5px;
            border-radius: 12px; box-shadow: 0 10px 25px rgba(0,0,0,0.5);
            /* 最大寬度設為 4 小節寬度 */
            max-width: calc(var(--measure-width) * 4 + 10px); 
            width: fit-content;
        }

        .measure {
            flex: 0 0 var(--measure-width); /* 固定寬度，不隨視窗縮放格子 */
            display: flex; flex-direction: column; gap: 5px; 
            border-right: 2px solid #cbd5e1; 
            padding: 10px;
            box-sizing: border-box;
        }
        
        /* 視覺上的邊框處理：每一行（或換行後）的最後一個不需要右邊框 */
        /* 在 4 小節狀態下 */
        @media (min-width: 1400px) {
            .measure:nth-child(4n) { border-right: none; }
        }

        .measure-beats { display: flex; gap: 8px; justify-content: center; }
        .beat-info { font-size: 10px; color: #94a3b8; text-align: left; margin-bottom: 4px; font-weight: 800; padding-left: 5px; }

        .beat-box {
            width: var(--box-size); height: var(--box-size); background: #f8fafc;
            border: 2px solid #e2e8f0; border-radius: 8px;
            display: flex; align-items: center; justify-content: center;
            cursor: pointer; transition: all 0.1s; position: relative;
            touch-action: manipulation;
        }
        .beat-box.active { border-color: var(--focus); box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.2); }
        .beat-box.playing-now { background: rgba(16, 185, 129, 0.2) !important; border-color: var(--primary) !important; }
        
        canvas { max-width: 100%; max-height: 100%; }

        .btn-remove {
            width: 24px; height: 24px; border-radius: 50%; border: 1px solid var(--accent-ui);
            background: transparent; color: var(--accent-ui); font-size: 0.8rem; cursor: pointer;
            display: flex; align-items: center; justify-content: center;
        }

        .btn-add {
            width: 45px; height: 45px; border-radius: 50%; border: 2px dashed #475569;
            background: transparent; color: #475569; font-size: 1.5rem; cursor: pointer;
            display: flex; align-items: center; justify-content: center; margin: 10px 0 30px 0;
        }

        #countInOverlay {
            position: absolute; top: 0; left: 0; width: 100%; height: 100%;
            background: rgba(15, 23, 42, 0.7); border-radius: 8px;
            display: none; align-items: center; justify-content: center;
            z-index: 50; color: #fff; font-size: 2.5rem; font-weight: 900;
            pointer-events: none; text-shadow: 0 0 10px rgba(0,0,0,0.8);
        }

        .instruction-footer {
            background: var(--panel); border-top: 1px solid #475569; padding: 20px;
            display: grid; grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
            gap: 20px; width: 100%; box-sizing: border-box;
        }
        .instruction-item { font-size: 0.8rem; color: #cbd5e1; line-height: 1.5; }
        .instruction-item h4 { margin: 0 0 8px 0; color: var(--primary); font-size: 0.85rem; }
    </style>
</head>
<body>

    <div class="controls">
        <div style="font-size: 1rem; font-weight: 800; letter-spacing: 1px;">DRUM BEAT <span style="color:var(--primary)">SEQ</span></div>
        <div class="actions">
            <div class="control-group">
                <select id="soundSelect">
                    <option value="snap" selected>Snap</option>
                    <option value="noise">Noise</option>
                </select>
                <select id="accentSoundSelect">
                    <option value="snap">Snap</option>
                    <option value="noise" selected>Noise</option>
                </select>
            </div>
            <div class="control-group">
                <div class="random-options" id="randomOptionsContainer">
                    <div class="random-chip selected" data-value="1">1</div>
                    <div class="random-chip" data-value="2">2</div>
                    <div class="random-chip" data-value="3">3</div>
                    <div class="random-chip" data-value="4">4</div>
                    <div class="random-chip" data-value="5">5</div>
                    <div class="random-chip" data-value="6">6</div>
                    <div class="random-chip" data-value="7">7</div>
                    <div class="random-chip" data-value="8">8</div>
                </div>
                <button id="randomFillBtn" class="btn-random">隨機</button>
            </div>
            <div class="control-group">
                <span style="font-size: 0.8rem; white-space: nowrap;">BPM: <strong id="bpmValue">120</strong></span>
                <input type="range" id="bpmSlider" min="40" max="220" step="5" value="120" style="width: 60px; accent-color: var(--primary);">
            </div>
            <button id="playBtn" class="btn-play">播放</button>
        </div>
    </div>

    <div class="main-content">
        <div id="rowsContainer" style="width: 100%; display: flex; flex-direction: column; align-items: center;"></div>
        <button class="btn-add" id="addRowBtn">+</button>
    </div>

    <div class="instruction-footer">
        <div class="instruction-item">
            <h4>彈性佈局規則</h4>
            <div>一行最多 4 小節。視窗大於 4 小節時寬度固定；視窗縮小時，以「小節」為單位自動向下換行。</div>
        </div>
        <div class="instruction-item">
            <h4>快速鍵</h4>
            <div>空白鍵播放。數字 1-8 選擇節奏型。方向鍵移動焦點格。</div>
        </div>
    </div>

    <script>
        // --- 核心邏輯保持不變 ---
        const workerCode = `let t=null;self.onmessage=(e)=>{if(e.data==="start")t=setInterval(()=>postMessage("tick"),25);else if(e.data==="stop")clearInterval(t);};`;
        const blob = new Blob([workerCode], { type: 'application/javascript' });
        const timerWorker = new Worker(URL.createObjectURL(blob));

        let audioCtx = null, isPlaying = false, nextNoteTime = 0.0, currentGlobalStep = 0;
        let isCountingIn = false, countInStep = 0;

        const rowsContainer = document.getElementById('rowsContainer'), addRowBtn = document.getElementById('addRowBtn');
        const playBtn = document.getElementById('playBtn'), bpmSlider = document.getElementById('bpmSlider'), bpmValue = document.getElementById('bpmValue');
        const soundSelect = document.getElementById('soundSelect'), accentSoundSelect = document.getElementById('accentSoundSelect');
        const randomOptionsContainer = document.getElementById('randomOptionsContainer'), randomFillBtn = document.getElementById('randomFillBtn');
        const totalBeats = 16, maxRows = 16; 
        
        const SERIES_MAP = {
            1: [11], 2: [21, 22, 23], 3: [31, 32, 33, 34], 4: [41, 42, 43, 44, 45],
            5: [51, 52, 53, 54, 55], 6: [61, 62, 63, 64], 7: [71, 72, 73, 74, 75], 8: [81, 82, 83, 84, 85]
        };

        let focusState = { row: 0, beat: 0 };
        let scoreData = [new Array(totalBeats).fill(0)];

        function initApp() {
            renderRows();
            initRandomToggles();
            bpmSlider.oninput = (e) => { bpmValue.textContent = e.target.value; };
            addRowBtn.onclick = () => { if (scoreData.length < maxRows) { scoreData.push(new Array(totalBeats).fill(0)); renderRows(); } };
            playBtn.onclick = togglePlayback;
            randomFillBtn.onclick = handleRandomFill;
        }

        function initRandomToggles() {
            randomOptionsContainer.querySelectorAll('.random-chip').forEach(chip => { chip.onclick = () => { chip.classList.toggle('selected'); }; });
        }

        function handleRandomFill() {
            const selectedSeries = Array.from(randomOptionsContainer.querySelectorAll('.random-chip.selected')).map(chip => chip.getAttribute('data-value'));
            if (selectedSeries.length === 0) return;
            let pool = []; selectedSeries.forEach(s => { pool = pool.concat(SERIES_MAP[s]); });
            scoreData.forEach((rowData) => { for (let i = 0; i < totalBeats; i++) { rowData[i] = pool[Math.floor(Math.random() * pool.length)]; } });
            renderRows();
        }

        async function togglePlayback() {
            if (!audioCtx) audioCtx = new (window.AudioContext || window.webkitAudioContext)();
            if (audioCtx.state === 'suspended') await audioCtx.resume();
            if (!isPlaying) {
                isPlaying = true; isCountingIn = true; countInStep = 0; currentGlobalStep = 0; 
                nextNoteTime = audioCtx.currentTime + 0.1;
                const overlay = document.getElementById('countInOverlay');
                if (overlay) overlay.style.display = 'flex';
                timerWorker.postMessage("start");
                playBtn.classList.add('playing'); playBtn.textContent = "停止";
            } else { stopPlayback(); }
        }

        function stopPlayback() {
            isPlaying = false; isCountingIn = false;
            timerWorker.postMessage("stop");
            playBtn.classList.remove('playing'); playBtn.textContent = "播放"; 
            const overlay = document.getElementById('countInOverlay');
            if (overlay) overlay.style.display = 'none';
            clearPlaybackUI(); resetRowStyles();
        }

        function clearPlaybackUI() { document.querySelectorAll('.beat-box').forEach(el => el.classList.remove('playing-now')); }
        function resetRowStyles() { document.querySelectorAll('.editor-row').forEach(row => { row.classList.remove('playing-row'); }); }

        timerWorker.onmessage = (e) => {
            if (e.data === "tick") {
                if (!isPlaying) return;
                const bpm = parseInt(bpmSlider.value), beatDur = 60.0 / bpm;
                while (nextNoteTime < audioCtx.currentTime + 0.1) {
                    if (isCountingIn) {
                        if (countInStep < 4) { scheduleCountIn(countInStep, nextNoteTime); countInStep++; }
                        else { isCountingIn = false; updateCountInUI(null); processSequenceStep(beatDur); }
                    } else { processSequenceStep(beatDur); }
                    nextNoteTime += beatDur; 
                }
            }
        };

        function processSequenceStep(dur) {
            const totalStepsInSequence = totalBeats * scoreData.length;
            if (currentGlobalStep >= totalStepsInSequence) { stopPlayback(); return; }
            const r = Math.floor(currentGlobalStep / totalBeats), b = currentGlobalStep % totalBeats;
            scheduleStep(r, b, nextNoteTime, dur); currentGlobalStep++;
        }

        function scheduleCountIn(step, time) {
            const osc = audioCtx.createOscillator(), gain = audioCtx.createGain();
            osc.type = 'sine'; osc.frequency.setValueAtTime(1200, time);
            gain.gain.setValueAtTime(0.4, time); gain.gain.exponentialRampToValueAtTime(0.001, time + 0.1);
            osc.connect(gain); gain.connect(audioCtx.destination);
            osc.start(time); osc.stop(time + 0.1);
            const countText = (4 - step).toString();
            const delay = (time - audioCtx.currentTime) * 1000;
            setTimeout(() => { if (isCountingIn && isPlaying) updateCountInUI(countText); }, Math.max(0, delay));
        }

        function updateCountInUI(text) {
            const overlay = document.getElementById('countInOverlay'); if (!overlay) return;
            if (text === null) overlay.style.display = 'none'; else { overlay.style.display = 'flex'; overlay.textContent = text; }
        }

        function playSound(time, freq, volume = 0.3, soundType = 'snap', isAccent = false) {
            const finalVol = isAccent ? volume * 1.6 : volume, finalFreq = isAccent ? freq * 1.2 : freq;
            if (soundType === 'noise') {
                const bufferSize = audioCtx.sampleRate * 0.1, buffer = audioCtx.createBuffer(1, bufferSize, audioCtx.sampleRate), data = buffer.getChannelData(0);
                for (let i = 0; i < bufferSize; i++) data[i] = Math.random() * 2 - 1;
                const noiseSource = audioCtx.createBufferSource(); noiseSource.buffer = buffer;
                const gainNode = audioCtx.createGain(), noiseFilter = audioCtx.createBiquadFilter();
                noiseFilter.type = 'highpass'; noiseFilter.frequency.value = finalFreq * 3;
                noiseSource.connect(noiseFilter); noiseFilter.connect(gainNode);
                gainNode.gain.setValueAtTime(finalVol * 0.4, time); gainNode.gain.exponentialRampToValueAtTime(0.001, time + 0.08);
                noiseSource.start(time); noiseSource.stop(time + 0.1); gainNode.connect(audioCtx.destination); return;
            }
            const osc = audioCtx.createOscillator(), gainNode = audioCtx.createGain();
            osc.type = 'square'; osc.frequency.setValueAtTime(finalFreq * 2, time);
            gainNode.gain.setValueAtTime(finalVol * 0.5, time); gainNode.gain.exponentialRampToValueAtTime(0.001, time + 0.05);
            osc.connect(gainNode); gainNode.connect(audioCtx.destination); osc.start(time); osc.stop(time + 0.1);
        }

        function scheduleStep(r, b, time, dur) {
            const type = scoreData[r][b]; updateUI(r, b, time);
            if (type === 0 || type === 12) return;
            const baseFreq = 220, p16 = [0, 0.25, 0.5, 0.75], cS = soundSelect.value, cAS = accentSoundSelect.value;
            const play = (t, isAcc = false) => { playSound(t, baseFreq, 0.3, isAcc ? cAS : cS, isAcc); };
            if (type === 11) play(time);
            else if (type === 21) play(time); else if (type === 22) play(time + dur * 0.5); else if (type === 23) { play(time); play(time + dur * 0.5); }
            else if (type >= 31 && type <= 34) play(time + dur * p16[type - 31]);
            else if (type >= 41 && type <= 45) { const m = { 41:[0,1], 42:[1,2], 43:[2,3], 44:[0,3], 45:[1,3] }; m[type].forEach(idx => play(time + dur * p16[idx])); }
            else if (type >= 51 && type <= 55) { const m = { 51:[0,2,3], 52:[0,1,2], 53:[0,1,3], 54:[1,2,3], 55:[0,1,2,3] }; m[type].forEach(idx => play(time + dur * p16[idx])); }
            else if (type >= 61 && type <= 64) { const aI = type - 61; p16.forEach((off, i) => play(time + dur * off, i === aI)); }
            else if (type >= 71 && type <= 75) { const m = { 71:[0,1], 72:[1,2], 73:[2,3], 74:[0,3], 75:[1,3] }; p16.forEach((off, i) => play(time + dur * off, m[type].includes(i))); }
            else if (type >= 81 && type <= 85) { const m = { 81:[0,2,3], 82:[0,1,2], 83:[0,1,3], 84:[1,2,3], 85:[0,1,2,3] }; p16.forEach((off, i) => play(time + dur * off, m[type].includes(i))); }
        }

        function updateUI(r, b, time) {
            const delay = (time - audioCtx.currentTime) * 1000;
            setTimeout(() => {
                if (!isPlaying || isCountingIn) return;
                document.querySelectorAll('.editor-row').forEach((row, idx) => { if (idx === r) row.classList.add('playing-row'); else row.classList.remove('playing-row'); });
                clearPlaybackUI(); const el = document.getElementById(`beat-${r}-${b}`); if (el) el.classList.add('playing-now');
            }, Math.max(0, delay));
        }

        function drawNoteHead(ctx, x, y, color = '#1e293b') { ctx.save(); ctx.fillStyle = color; ctx.translate(x, y); ctx.rotate(-0.25); ctx.beginPath(); ctx.ellipse(0, 0, 5, 3.5, 0, 0, Math.PI * 2); ctx.fill(); ctx.restore(); }
        function drawStem(ctx, x, yT, yB, color = '#1e293b', w = 1.5) { ctx.save(); ctx.strokeStyle = color; ctx.lineWidth = w; ctx.beginPath(); ctx.moveTo(x, yT); ctx.lineTo(x, yB); ctx.stroke(); ctx.restore(); }
        function drawQuarterRest(ctx, x, y) { ctx.save(); ctx.strokeStyle = '#1e293b'; ctx.lineWidth = 1.8; ctx.lineCap = 'round'; ctx.lineJoin = 'round'; ctx.beginPath(); ctx.moveTo(x - 4, y - 10); ctx.lineTo(x + 2, y - 4); ctx.lineTo(x - 4, y + 2); ctx.lineTo(x + 2, y + 8); ctx.bezierCurveTo(x + 2, y + 11, x - 1, y + 12, x - 4, y + 10); ctx.stroke(); ctx.restore(); }
        function drawAccent(ctx, x, y) { ctx.save(); ctx.strokeStyle = '#1e293b'; ctx.lineWidth = 2; ctx.lineCap = 'round'; ctx.lineJoin = 'round'; ctx.beginPath(); ctx.moveTo(x - 4, y - 3); ctx.lineTo(x + 3, y); ctx.lineTo(x - 4, y + 3); ctx.stroke(); ctx.restore(); }

        function drawNote(ctx, type) {
            ctx.clearRect(0, 0, 80, 80); if (type === 0) return;
            const bY = 55, sT = 22, center = 40, sSB = 38;
            if (type === 11) { drawNoteHead(ctx, center - 4, bY); drawStem(ctx, center + 0.5, sT, bY); }
            else if (type === 12) { drawQuarterRest(ctx, center, 40); }
            else if (type >= 21 && type <= 23) { 
                const p1 = 25, p2 = 55; ctx.save(); ctx.strokeStyle = '#1e293b'; ctx.lineWidth = 4; ctx.beginPath(); ctx.moveTo(p1+4.5, sT+2); ctx.lineTo(p2+4.5, sT+2); ctx.stroke(); ctx.restore();
                if (type === 21 || type === 23) { drawNoteHead(ctx, p1, bY); drawStem(ctx, p1+4.5, sT, bY, '#1e293b', 2); } else { drawStem(ctx, p1+4.5, sT, sSB, '#1e293b', 1.5); }
                if (type === 22 || type === 23) { drawNoteHead(ctx, p2, bY); drawStem(ctx, p2+4.5, sT, bY, '#1e293b', 2); } else { drawStem(ctx, p2+4.5, sT, sSB, '#1e293b', 1.5); }
            } else if (type >= 31) { 
                const pos = [18, 32, 46, 60]; let act = [], acc = [];
                if (type >= 31 && type <= 34) act = [type - 31];
                else if (type === 41) act = [0, 1]; else if (type === 42) act = [1, 2]; else if (type === 43) act = [2, 3]; else if (type === 44) act = [0, 3]; else if (type === 45) act = [1, 3];
                else if (type === 51) act = [0, 2, 3]; else if (type === 52) act = [0, 1, 2]; else if (type === 53) act = [0, 1, 3]; else if (type === 54) act = [1, 2, 3]; else if (type === 55) act = [0, 1, 2, 3];
                else if (type >= 61 && type <= 64) { act = [0, 1, 2, 3]; acc = [type - 61]; }
                else if (type >= 71 && type <= 75) { act = [0, 1, 2, 3]; if (type === 71) acc = [0, 1]; else if (type === 72) acc = [1, 2]; else if (type === 73) acc = [2, 3]; else if (type === 74) acc = [0, 3]; else if (type === 75) acc = [1, 3]; }
                else if (type >= 81 && type <= 85) { act = [0, 1, 2, 3]; if (type === 81) acc = [0, 2, 3]; else if (type === 82) acc = [0, 1, 2]; else if (type === 83) acc = [0, 1, 3]; else if (type === 84) acc = [1, 2, 3]; else if (type === 85) acc = [0, 1, 2, 3]; }
                ctx.save(); ctx.strokeStyle = '#1e293b'; ctx.lineWidth = 3; ctx.beginPath(); ctx.moveTo(pos[0]+4.5, sT); ctx.lineTo(pos[3]+4.5, sT); ctx.stroke(); ctx.beginPath(); ctx.moveTo(pos[0]+4.5, sT+6); ctx.lineTo(pos[3]+4.5, sT+6); ctx.stroke(); ctx.restore();
                pos.forEach((x, i) => { if (act.includes(i)) { drawNoteHead(ctx, x, bY); drawStem(ctx, x+4.5, sT, bY, '#1e293b', 1.5); if (acc.includes(i)) drawAccent(ctx, x + 4, sT - 8); } else { drawStem(ctx, x+4.5, sT, sSB, '#1e293b', 1.2); } });
            }
        }

        function renderRows() {
            rowsContainer.innerHTML = '';
            scoreData.forEach((rowData, rI) => {
                const row = document.createElement('div'); row.className = 'editor-row';
                const head = document.createElement('div'); head.className = 'row-header';
                const lab = document.createElement('div'); lab.className = 'row-label'; lab.textContent = `句段 ${rI+1}`;
                head.appendChild(lab);
                if (scoreData.length > 1) { const rm = document.createElement('button'); rm.className = 'btn-remove'; rm.textContent = '×'; rm.onclick = () => { scoreData.splice(rI,1); renderRows(); }; head.appendChild(rm); }
                row.appendChild(head);
                const strip = document.createElement('div'); strip.className = 'editor-strip';
                for (let m = 0; m < 4; m++) {
                    const meas = document.createElement('div'); meas.className = 'measure';
                    const inf = document.createElement('div'); inf.className = 'beat-info'; inf.textContent = `小節 ${m+1}`; meas.appendChild(inf);
                    const bR = document.createElement('div'); bR.className = 'measure-beats';
                    for (let b = 0; b < 4; b++) {
                        const bIdx = m * 4 + b, box = document.createElement('div');
                        box.className = `beat-box`; if(rI===focusState.row && bIdx===focusState.beat) box.classList.add('active');
                        box.id = `beat-${rI}-${bIdx}`;
                        if (rI === 0 && bIdx === 0) { const over = document.createElement('div'); over.id = 'countInOverlay'; box.appendChild(over); }
                        const can = document.createElement('canvas'); can.width = 80; can.height = 80;
                        box.appendChild(can); box.onclick = () => setFocus(rI, bIdx); bR.appendChild(box);
                        requestAnimationFrame(() => drawNote(can.getContext('2d'), rowData[bIdx]));
                    }
                    meas.appendChild(bR); strip.appendChild(meas);
                }
                row.appendChild(strip); rowsContainer.appendChild(row);
            });
        }

        function setFocus(r, b) { r = (r + scoreData.length) % scoreData.length; b = (b + totalBeats) % totalBeats; focusState = { row: r, beat: b }; renderRows(); }

        window.onkeydown = (e) => {
            if (e.code === 'Space') { e.preventDefault(); togglePlayback(); return; }
            if (!scoreData[focusState.row]) return;
            const cur = scoreData[focusState.row][focusState.beat]; let val = -1;
            if (e.key === '1') val = (cur === 11) ? 12 : 11;
            else if (e.key === '2') { if (cur === 21) val = 22; else if (cur === 22) val = 23; else val = 21; }
            else if (e.key === '3') { if (cur >= 31 && cur < 34) val = cur + 1; else val = 31; }
            else if (e.key === '4') { if (cur >= 41 && cur < 45) val = cur + 1; else val = 41; }
            else if (e.key === '5') { if (cur >= 51 && cur < 55) val = cur + 1; else val = 51; }
            else if (e.key === '6') { if (cur >= 61 && cur < 64) val = cur + 1; else val = 61; }
            else if (e.key === '7') { if (cur >= 71 && cur < 75) val = cur + 1; else val = 71; }
            else if (e.key === '8') { if (cur >= 81 && cur < 85) val = cur + 1; else val = 81; }
            else if (e.key === 'Escape' || e.key === 'Backspace') val = 0;
            if (val !== -1) { scoreData[focusState.row][focusState.beat] = val; renderRows(); }
            if (e.key === 'ArrowRight') { e.preventDefault(); setFocus(focusState.row, focusState.beat + 1); }
            if (e.key === 'ArrowLeft') { e.preventDefault(); setFocus(focusState.row, focusState.beat - 1); }
            if (e.key === 'ArrowUp') { e.preventDefault(); setFocus(focusState.row - 1, focusState.beat); }
            if (e.key === 'ArrowDown') { e.preventDefault(); setFocus(focusState.row + 1, focusState.beat); }
        };

        initApp();
    </script>
</body>
</html>