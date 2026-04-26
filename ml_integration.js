/**
 * ML_INTEGRATION.JS - ADVANCED CLINICAL INTELLIGENCE EDITION
 * Implements a high-fidelity 3D AI Dashboard for AR/VR.
 * Features: Confidence Scores, Smart Recommendations, and Treatment Prognosis.
 */

AFRAME.registerComponent('ai-hud', {
    init: function () {
        // Create the HUD Container
        this.hudContainer = document.createElement('a-entity');
        this.hudContainer.setAttribute('id', 'aiHudContainer');
        // Position and Scale are now managed by the responsiveness engine in index.html
        
        // Main Dashboard Panel (Premium Glass)
        this.panel = document.createElement('a-plane');
        this.panel.setAttribute('width', '3.6');
        this.panel.setAttribute('height', '2.4');
        this.panel.setAttribute('material', 'color: #050a1a; opacity: 0.85; transparent: true; shader: flat; side: double');
        this.panel.setAttribute('geometry', 'primitive: plane; radius: 0.2');
        this.hudContainer.appendChild(this.panel);

        // Header - Bold and Large with Neon Glow
        this.createLabel('AI CARDIAC INTELLIGENCE', '#00ffcc', 3.8, '-1.6 1.1 0.01', 'mozillavr');

        // ── LIVE VITALS SECTION (High Contrast White) ──
        this.createLabel('LIVE VITALS:', '#ffffff', 2.0, '-1.6 0.8 0.01');
        this.bpmReadout = this.createLabel('72 BPM', '#00ffcc', 2.6, '-0.4 0.8 0.02');
        this.bpReadout = this.createLabel('120/80 mmHg', '#ffffff', 2.2, '0.8 0.8 0.02');

        this.createLabel('RHYTHM:', '#ffffff', 2.0, '-1.6 0.58 0.01');
        this.rhythmVal = this.createLabel('SINUS', '#00ffcc', 2.6, '-0.4 0.58 0.02');
        
        // ── LIVE DIAGNOSIS SECTION ──
        this.createLabel('RISK ANALYSIS:', '#ffffff', 2.2, '-1.6 0.28 0.01');
        this.riskVal = this.createLabel('LOW', '#00ffcc', 4.5, '0.4 0.28 0.02', 'mozillavr');
        
        this.createLabel('CONFIDENCE:', '#ffffff', 2.0, '-1.6 0.05 0.01');
        this.confVal = this.createLabel('99.2%', '#00ffcc', 2.6, '0.4 0.05 0.02');

        // ── SMART RECOMMENDATION SECTION ──
        this.createLabel('AI-ASSISTED RECOMMENDATION:', '#00ffcc', 2.2, '-1.6 -0.35 0.01');
        this.rectBox = document.createElement('a-plane');
        this.rectBox.setAttribute('width', '3.4');
        this.rectBox.setAttribute('height', '0.5');
        this.rectBox.setAttribute('position', '0 -0.65 0.01');
        this.rectBox.setAttribute('material', 'color: #00ffcc; opacity: 0.15; transparent: true');
        this.hudContainer.appendChild(this.rectBox);

        this.recVal = this.createLabel('Maintain Current Vitals', '#ffffff', 3.0, '-1.6 -0.65 0.02');

        // ── PROGNOSIS SECTION ──
        this.createLabel('TREATMENT SUCCESS RATE:', '#ffffff', 2.0, '-1.6 -1.0 0.01');
        this.successVal = this.createLabel('--%', '#00ffcc', 2.6, '1.0 -1.0 0.02');

        // Progress Bar
        this.progBg = this.createPlane('3.4 0.1', '0 -1.2 0.01', '#112233');
        this.progFill = this.createPlane('3.4 0.1', '0 -1.2 0.02', '#00ffcc');

        // Pulse Status
        this.pulse = document.createElement('a-circle');
        this.pulse.setAttribute('radius', '0.08');
        this.pulse.setAttribute('color', '#00ffcc');
        this.pulse.setAttribute('position', '1.55 1.05 0.02');
        this.pulse.setAttribute('animation', 'property: scale; from: 1 1 1; to: 1.4 1.4 1.4; dir: alternate; loop: true; dur: 800');
        this.hudContainer.appendChild(this.pulse);

        this.el.appendChild(this.hudContainer);
        this.lastState = '';
    },

    // Helper to create labels quickly
    createLabel: function(text, color, width, pos, font) {
        const el = document.createElement('a-text');
        el.setAttribute('value', text);
        el.setAttribute('color', color);
        el.setAttribute('width', width);
        el.setAttribute('position', pos);
        if (font) el.setAttribute('font', font);
        this.hudContainer.appendChild(el);
        return el;
    },

    createPlane: function(wh, pos, color) {
        const p = document.createElement('a-plane');
        const dims = wh.split(' ');
        p.setAttribute('width', dims[0]);
        p.setAttribute('height', dims[1]);
        p.setAttribute('position', pos);
        p.setAttribute('material', `color: ${color}; shader: flat`);
        this.hudContainer.appendChild(p);
        return p;
    },

    tick: function () {
        const bpm = window.targetBPM || 72;
        const disease = window.currentDisease || 'none';
        const isFib = window.isFibrillation || false;

        this.runInference(bpm, disease, isFib);
    },

    runInference: function(bpm, disease, isFib) {
        let risk = 'LOW';
        let color = '#00ffcc';
        let confidence = 98.4 + (Math.random() * 1.5);
        let recommendation = 'Maintain Current Vitals';
        let successRate = '99%';
        let healthScore = 1.0;
        let rhythm = 'SINUS';
        
        // Dynamic Blood Pressure Calculation (Systolic / Diastolic)
        let sys = 110 + (bpm * 0.15) + (Math.random() * 5);
        let dia = 70 + (bpm * 0.1) + (Math.random() * 3);

        if (isFib) {
            risk = 'CRITICAL';
            color = '#ff3333';
            confidence = 99.9;
            recommendation = 'CODE BLUE - COMMENCE CPR';
            successRate = '5%';
            healthScore = 0.0;
            rhythm = 'V-FIB';
            sys = 40; dia = 20; // Hypotension during arrest
        } else if (disease === 'heart_attack') {
            risk = 'HIGH RISK';
            color = '#ff5500';
            confidence = 94.2;
            recommendation = 'CORONARY ANGIOPLASTY';
            successRate = '72%';
            healthScore = 0.3;
            rhythm = 'STEMI';
        } else if (bpm === 0) {
            risk = 'CRITICAL';
            color = '#ff3333';
            rhythm = 'ASYSTOLE';
            recommendation = 'CODE BLUE';
            healthScore = 0; sys = 0; dia = 0;
        } else if (bpm > 160) {
            risk = 'CRITICAL';
            color = '#ff3333';
            rhythm = 'TACHY';
            recommendation = 'ADENOSINE IV PUSH';
            healthScore = 0.2;
        } else if (bpm < 60) {
            rhythm = 'BRADY';
            risk = bpm < 40 ? 'CRITICAL' : 'HIGH RISK';
            color = bpm < 40 ? '#ff3333' : '#ff5500';
            recommendation = bpm < 40 ? 'EMERGENCY PACING' : 'ATROPINE';
            healthScore = 0.4;
        }

        const stateKey = risk + recommendation + bpm + Math.floor(sys);
        if (this.lastState !== stateKey) {
            this.updateUI(risk, color, confidence, recommendation, successRate, healthScore, bpm, sys, dia, rhythm);
            this.lastState = stateKey;
        }
    },

    updateUI: function(risk, color, conf, rec, success, score, bpm, sys, dia, rhythm) {
        this.riskVal.setAttribute('value', risk);
        this.riskVal.setAttribute('color', color);
        this.confVal.setAttribute('value', conf.toFixed(1) + '%');
        this.recVal.setAttribute('value', rec);
        this.successVal.setAttribute('value', success);
        this.successVal.setAttribute('color', color);
        
        // Vitals Update
        this.bpmReadout.setAttribute('value', bpm + ' BPM');
        this.bpReadout.setAttribute('value', Math.floor(sys) + '/' + Math.floor(dia) + ' mmHg');
        this.rhythmVal.setAttribute('value', rhythm);
        this.rhythmVal.setAttribute('color', color);

        this.pulse.setAttribute('color', color);
        this.progFill.setAttribute('scale', `${score} 1 1`);
        this.progFill.setAttribute('color', color);
        this.rectBox.setAttribute('material', `color: ${color}; opacity: 0.15`);

        // Visual Binding to Heart Model
        const heart = document.getElementById('heartMesh');
        if (heart) heart.setAttribute('animation', `property: components.material.material.color; to: ${score < 0.5 ? '#ff3344' : '#ffffff'}; dur: 1000`);
    }
});
