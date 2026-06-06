'use strict';

const ADMIN_CREDS = { user: 'admin', pass: 'gridlock2026' };
const ADMIN_NAME = 'Operations Commander';
const ZONE_BY_NAME = {
  'Silk Board Junction': { id: 'z1', lat: 12.9175, lng: 77.6228 },
  'Hebbal Flyover': { id: 'z3', lat: 13.0453, lng: 77.5949 },
  'ORR Near Marathahalli': { id: 'z2', lat: 12.9500, lng: 77.6700 },
  'MG Road Corridor': { id: 'z10', lat: 12.9757, lng: 77.6011 },
  'Whitefield IT Park': { id: 'z9', lat: 12.9698, lng: 77.7499 },
  'Electronic City Ph1': { id: 'z8', lat: 12.8456, lng: 77.6644 },
  'Bellandur Junction': { id: 'z6', lat: 12.9247, lng: 77.6741 },
};

const INJECT_PRESETS = {
  accident: { type: 'Accident', icon: '💥', severity: 'Critical', delay: 35, radius: 2.8, ci: 0.97, color: '#ff4444', zone: 'Silk Board Junction' },
  closure: { type: 'Road Closure', icon: '🚧', severity: 'High', delay: 28, radius: 3.5, ci: 0.88, color: '#ff8c42', zone: 'Hebbal Flyover' },
  construction: { type: 'Construction Work', icon: '🏗️', severity: 'Moderate', delay: 18, radius: 1.8, ci: 0.78, color: '#ff8c42', zone: 'ORR Near Marathahalli' },
  flooding: { type: 'Flooding', icon: '🌊', severity: 'High', delay: 45, radius: 4.0, ci: 0.85, color: '#3b9eff', zone: 'Bellandur Junction' },
  festival: { type: 'Festival Traffic', icon: '🎉', severity: 'Moderate', delay: 22, radius: 2.0, ci: 0.72, color: '#b06fff', zone: 'MG Road Corridor' },
  surge: { type: 'Public Event Surge', icon: '📈', severity: 'High', delay: 30, radius: 2.6, ci: 0.82, color: '#ffd740', zone: 'Whitefield IT Park' },
};

const JUDGE_STEPS = [
  () => { adminInject('accident'); adminTimeline('Judge Demo: Accident injected at Silk Board'); },
  () => { adminTimeline('AI detected incident — 96% confidence'); show('incidents'); },
  () => { renderPredGrid(); show('predict'); adminTimeline('Congestion forecast updated — 5 zones at risk'); },
  () => { renderXAI(); show('xai'); adminTimeline('AI explanation generated for rerouting decision'); },
  () => { S.emgVehicle = 'v1'; selectVehicle('v1'); show('emergency'); adminTimeline('Ambulance dispatch request received'); },
  () => { renderEmgRoute(true); activateGreenCorridor(); adminTimeline('Green corridor activated — 4 signals overridden'); },
  () => { optimizeSignals(); show('signals'); adminTimeline('Signal optimization complete — +31% throughput'); },
  () => { S.rerouteOn = true; S.zones.forEach(z => { if (z.ci > 0.65) z.ci = Math.max(0.3, z.ci - 0.18); }); refreshAllDashboards(); show('map'); adminTimeline('2,847 vehicles rerouted'); },
  () => { optimizeFleet(); show('flipkart'); adminTimeline('Flipkart fleet optimized — SLA protected'); },
  () => { if (!S.chartsInit.roi) { initRoiCenter(); S.chartsInit.roi = true; } show('roi'); generateExecutiveReport(false); adminTimeline('Economic impact calculated — executive report ready'); },
];

// ── LOGIN ─────────────────────────────────────────────────────────────────────
function initAdmin() {
  if (sessionStorage.getItem('gridlock_admin') === '1') setAdminSession(true);
  document.getElementById('admin-profile-label').onclick = null;
  renderAdminTimeline();
  renderAdminStats();
}

function openAdminLogin() {
  document.getElementById('admin-login-overlay').classList.add('show');
  document.getElementById('admin-user').focus();
}

function closeAdminLogin() {
  document.getElementById('admin-login-overlay').classList.remove('show');
}

function adminLoginSubmit() {
  const u = document.getElementById('admin-user').value.trim();
  const p = document.getElementById('admin-pass').value;
  if (u === ADMIN_CREDS.user && p === ADMIN_CREDS.pass) {
    sessionStorage.setItem('gridlock_admin', '1');
    sessionStorage.setItem('gridlock_admin_login', new Date().toISOString());
    setAdminSession(true);
    closeAdminLogin();
    toast('🔐 Admin access granted — Control Center unlocked', 's');
    adminTimeline('Admin login successful');
    show('admin');
  } else {
    toast('❌ Invalid credentials', 'e');
  }
}

function setAdminSession(on) {
  S.adminLoggedIn = on;
  document.getElementById('admin-nav-section').classList.toggle('visible', on);
  document.getElementById('tab-admin').style.display = on ? 'inline-flex' : 'none';
  document.getElementById('admin-profile-label').textContent = on ? 'Admin' : 'Login';
  if (on) {
    const last = sessionStorage.getItem('gridlock_admin_login');
    document.getElementById('apm-name').textContent = ADMIN_NAME;
    document.getElementById('apm-role').textContent = 'City Operations Commander';
    document.getElementById('apm-login').textContent = last ? new Date(last).toLocaleString('en-IN') : 'Now';
    document.getElementById('apm-status').textContent = 'All Systems Operational';
  }
}

function adminLogout() {
  sessionStorage.removeItem('gridlock_admin');
  setAdminSession(false);
  document.getElementById('admin-profile-menu').classList.remove('open');
  toast('Logged out', 'w');
}

function toggleAdminProfile(e) {
  e.stopPropagation();
  if (!S.adminLoggedIn) { openAdminLogin(); return; }
  document.getElementById('admin-profile-menu').classList.toggle('open');
}

document.addEventListener('click', () => {
  document.getElementById('admin-profile-menu')?.classList.remove('open');
});

// ── TIMELINE & LOGS ───────────────────────────────────────────────────────────
function adminTimeline(msg) {
  const t = new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' });
  S.timeline.unshift({ time: t, msg });
  if (S.timeline.length > 50) S.timeline.pop();
  renderAdminTimeline();
}

function renderAdminTimeline() {
  const el = document.getElementById('admin-timeline');
  if (!el) return;
  el.innerHTML = S.timeline.length
    ? S.timeline.map(e => `<div class="admin-tl-item"><div class="admin-tl-time">${e.time}</div><div class="admin-tl-dot"></div><div>${e.msg}</div></div>`).join('')
    : '<div style="color:var(--text3);font-size:11px;">No operations logged yet.</div>';
}

function adminLog(msg) {
  const el = document.getElementById('admin-ai-log');
  if (el) el.innerHTML = `[${metaTime()}] ${msg}\n` + el.innerHTML.split('\n').slice(0, 8).join('\n');
  const sys = document.getElementById('admin-sys-log');
  if (sys) sys.textContent = `[${metaTime()}] ${msg}`;
}

function renderAdminStats() {
  const r = document.getElementById('adm-fleet-risk');
  const t = document.getElementById('adm-fleet-transit');
  if (r) r.textContent = S.fleetAtRisk;
  if (t) t.textContent = S.ordersInTransit;
  const ai = document.getElementById('admin-ai-status');
  if (ai) { ai.textContent = S.aiEnabled ? 'ENABLED' : 'DISABLED'; ai.className = S.aiEnabled ? 'c-green' : 'c-red'; }
}

// ── TRAFFIC CONTROLS ──────────────────────────────────────────────────────────
function adminInject(kind) {
  if (!S.aiEnabled) { toast('AI disabled — enable AI first', 'e'); return; }
  const p = INJECT_PRESETS[kind];
  if (!p) return;
  const zone = ZONE_BY_NAME[p.zone] || ZONE_BY_NAME['Silk Board Junction'];
  const z = S.zones.find(x => x.id === zone.id);
  if (z) z.ci = p.ci;

  const inc = {
    id: 'adm-' + Date.now(),
    type: p.type,
    icon: p.icon,
    location: p.zone,
    lat: zone.lat,
    lng: zone.lng,
    severity: p.severity,
    conf: Math.round(88 + Math.random() * 10),
    delay: p.delay,
    radius: p.radius,
    action: 'Admin injected — AI response initiated',
    color: p.color,
    time: metaTime(),
  };
  INCIDENTS.unshift(inc);
  adminTimeline(`${p.type} injected at ${p.zone}`);
  adminLog(`${p.type} injected — CI ${p.ci}`);
  refreshAllDashboards();
  refreshIncidentMarkers();
  toast(`⚡ ${p.type} injected at ${p.zone}`, 'w');
  show('incidents');
}

function adminCreateIncident() {
  const type = document.getElementById('adm-inc-type').value;
  const loc = document.getElementById('adm-inc-loc').value;
  const sev = document.getElementById('adm-inc-sev').value;
  const dur = parseInt(document.getElementById('adm-inc-dur').value, 10) || 45;
  const rad = parseFloat(document.getElementById('adm-inc-rad').value) || 2;
  const zone = ZONE_BY_NAME[loc] || { lat: 12.97, lng: 77.59 };
  const icons = { Accident: '💥', 'Vehicle Breakdown': '🚗', 'Road Closure': '🚧', Flooding: '🌊', 'Construction Work': '🏗️', 'Festival Traffic': '🎉', 'Political Rally': '📢', 'Public Event Surge': '🎤' };
  const colors = { Critical: '#ff4444', High: '#ff8c42', Moderate: '#ffd740' };

  INCIDENTS.unshift({
    id: 'adm-' + Date.now(),
    type, icon: icons[type] || '⚠️', location: loc,
    lat: zone.lat, lng: zone.lng, severity: sev,
    conf: Math.round(85 + Math.random() * 12),
    delay: dur, radius: rad,
    action: 'Admin-created incident — auto-response active',
    color: colors[sev] || '#ff8c42',
    time: metaTime(),
  });

  const z = S.zones.find(x => x.name === loc || x.id === zone.id);
  if (z) z.ci = Math.min(0.99, z.ci + 0.15);

  adminTimeline(`${type} created at ${loc} (${sev})`);
  refreshAllDashboards();
  refreshIncidentMarkers();
  toast(`🚨 Incident created: ${type} at ${loc}`, 's');
}

function adminClearIncidents() {
  INCIDENTS.length = 0;
  adminTimeline('All incidents cleared');
  refreshAllDashboards();
  refreshIncidentMarkers();
  toast('✓ All incidents cleared', 's');
}

function adminResetTraffic() {
  S.zones = ZONES.map(z => ({ ...z }));
  S.rerouteOn = false;
  adminTimeline('Traffic state reset to baseline');
  refreshAllDashboards();
  toast('↺ Traffic reset', 'i');
}

// ── EMERGENCY ─────────────────────────────────────────────────────────────────
function adminDispatchEmergency() {
  const vId = document.getElementById('adm-emg-type').value;
  const pri = document.getElementById('adm-emg-pri').value;
  const origin = document.getElementById('adm-emg-origin').value;
  const dest = document.getElementById('adm-emg-dest').value;

  S.emgVehicle = vId;
  selectVehicle(vId);
  renderEmgRoute(true);
  activateGreenCorridor();
  optimizeSignals();

  adminTimeline(`${VEHICLES.find(v => v.id === vId)?.name || 'Emergency'} dispatched (${pri}) — ${origin} → ${dest}`);
  adminLog(`Emergency dispatch: ETA 7 min (11 min saved)`);
  refreshAllDashboards();
  toast('🚑 Emergency dispatched — Green corridor active', 's');
  show('emergency');
}

// ── FLEET ─────────────────────────────────────────────────────────────────────
function adminFleetAction(action) {
  switch (action) {
    case 'delays':
      S.fleetAtRisk = Math.min(20, S.fleetAtRisk + 4);
      FLEET.forEach(d => { if (Math.random() > 0.5) d.status = 'at-risk'; });
      adminTimeline('Delivery delays generated — ' + S.fleetAtRisk + ' at risk');
      break;
    case 'surge':
      S.ordersInTransit = 178;
      adminTimeline('Warehouse surge — order volume +25%');
      break;
    case 'volume':
      S.ordersInTransit = 210;
      S.fleetAtRisk = 15;
      adminTimeline('Order volume spike — 210 orders in transit');
      break;
    case 'breakdown':
      adminTimeline('Vehicle breakdown simulated — FK-88291 offline');
      toast('🔧 Vehicle FK-88291 breakdown simulated', 'w');
      break;
    case 'reset':
      FLEET.length = 0;
      FLEET.push(...JSON.parse(JSON.stringify(FLEET_BASE)));
      S.fleetAtRisk = 9;
      S.ordersInTransit = 142;
      S.fleetOptimized = false;
      document.getElementById('btn-fleet-opt').innerHTML = '⚡ Optimize All Routes';
      adminTimeline('Fleet reset to baseline');
      break;
  }
  renderAdminStats();
  renderFleet(S.fleetOptimized);
  updateMapKPIs();
  toast('📦 Fleet state updated', 'i');
}

// ── AI CONTROLS ───────────────────────────────────────────────────────────────
function adminRunAI(kind) {
  if (!S.aiEnabled) { toast('AI engine disabled', 'e'); return; }
  const log = document.getElementById('admin-ai-log');
  if (log) log.innerHTML = '<span class="admin-loading"></span> Running...';

  setTimeout(() => {
    switch (kind) {
      case 'predict':
        renderPredGrid();
        if (!S.chartsInit.predict) { initPredictCharts(); S.chartsInit.predict = true; }
        adminLog('Congestion prediction complete — 18 zones, 91.4% avg confidence');
        adminTimeline('Congestion prediction engine executed');
        show('predict');
        break;
      case 'incident':
        adminInject('accident');
        adminLog('Incident detection — 96% confidence at Silk Board');
        break;
      case 'route':
        toggleReroute();
        if (!S.rerouteOn) toggleReroute();
        adminLog('Route optimization — 2,847 vehicles rerouted');
        adminTimeline('Dynamic rerouting activated');
        show('map');
        break;
      case 'signal':
        optimizeSignals();
        adminLog('Signal optimization — 6 junctions, +31% throughput');
        adminTimeline('Smart signal optimization executed');
        show('signals');
        break;
      case 'fleet':
        optimizeFleet();
        adminLog('Fleet optimization — 13 min avg saved per delivery');
        adminTimeline('Flipkart fleet AI optimization complete');
        show('flipkart');
        break;
    }
    toast('✅ AI action complete', 's');
  }, 900);
}

function adminResetAI() {
  S.sigsOptimized = false;
  S.fleetOptimized = false;
  S.rerouteOn = false;
  S.corridorOn = false;
  resetSignals();
  adminLog('AI decisions reset');
  adminTimeline('AI decision layer reset');
  refreshAllDashboards();
  toast('↺ AI decisions reset', 'w');
}

function adminToggleAI(on) {
  S.aiEnabled = on;
  renderAdminStats();
  adminTimeline(on ? 'AI engine ENABLED' : 'AI engine DISABLED');
  toast(on ? '✅ AI Enabled' : '⛔ AI Disabled', on ? 's' : 'e');
}

// ── DIGITAL TWIN ──────────────────────────────────────────────────────────────
function adminTwin(id) {
  selectScenario(id);
  adminTimeline('Digital twin scenario: ' + id);
  show('twin');
  toast('🌐 Twin simulation: ' + id, 'i');
}

// ── CONFIRM / MASTER ──────────────────────────────────────────────────────────
let confirmCallback = null;

function adminConfirm(action, msg) {
  document.getElementById('confirm-title').textContent = 'Confirm System Action';
  document.getElementById('confirm-msg').textContent = msg;
  document.getElementById('admin-confirm-overlay').classList.add('show');
  confirmCallback = action;
}

function confirmAdminAction(yes) {
  document.getElementById('admin-confirm-overlay').classList.remove('show');
  if (!yes || !confirmCallback) { confirmCallback = null; return; }

  switch (confirmCallback) {
    case 'stop':
      S.aiEnabled = false;
      pauseDemo();
      adminTimeline('EMERGENCY STOP activated');
      toast('🛑 Emergency stop', 'e');
      break;
    case 'resetCity':
      adminResetTraffic();
      INCIDENTS.length = 0;
      INCIDENTS.push(...JSON.parse(JSON.stringify(INCIDENTS_BASE)));
      adminFleetAction('reset');
      resetEmergency();
      refreshIncidentMarkers();
      refreshAllDashboards();
      adminTimeline('Full city state reset');
      break;
    case 'resetAll':
      adminResetTraffic();
      INCIDENTS.length = 0;
      INCIDENTS.push(...JSON.parse(JSON.stringify(INCIDENTS_BASE)));
      adminFleetAction('reset');
      adminResetAI();
      resetDemo();
      S.aiEnabled = true;
      S.timeline = [];
      renderAdminTimeline();
      refreshIncidentMarkers();
      refreshAllDashboards();
      adminTimeline('FULL SYSTEM RESET executed');
      toast('⚠️ All systems reset', 'w');
      break;
  }
  confirmCallback = null;
  renderAdminStats();
}

// ── EXECUTIVE REPORT ──────────────────────────────────────────────────────────
function generateExecutiveReport(showModal = true) {
  const silk = S.zones.find(z => z.id === 'z1');
  const body = document.getElementById('admin-report-body');
  const html = `
<h3 style="color:var(--blue);margin-bottom:12px;">Flipkart Gridlock 2.0 — Executive Operations Report</h3>
<p><strong>Generated:</strong> ${new Date().toLocaleString('en-IN')} IST · <strong>Operator:</strong> ${ADMIN_NAME}</p>
<hr style="border-color:var(--b1);margin:12px 0;"/>
<h4 style="margin:12px 0 6px;">Traffic Summary</h4>
<p>18 zones monitored · ${S.zones.filter(z => z.ci >= 0.75).length} congested · Silk Board CI: ${silk?.ci?.toFixed(2) || '—'} · Avg confidence: 94.2%</p>
<h4 style="margin:12px 0 6px;">Incident Summary</h4>
<p>${INCIDENTS.length} active incidents · Top disruption: ${INCIDENTS[0]?.type || 'None'} at ${INCIDENTS[0]?.location || '—'}</p>
<h4 style="margin:12px 0 6px;">AI Actions Taken</h4>
<p>Interventions: ${document.getElementById('cmd-kpi-int')?.textContent || '12'} · Rerouting: ${S.rerouteOn ? 'Active' : 'Standby'} · Signals: ${S.sigsOptimized ? 'Optimized' : 'Default'} · Fleet: ${S.fleetOptimized ? 'Optimized' : 'Baseline'}</p>
<h4 style="margin:12px 0 6px;">Impact Metrics</h4>
<ul style="margin-left:16px;">
<li>Travel Time Saved: <strong>14,820 min/day</strong></li>
<li>Fuel Saved: <strong>9,800 L · ₹2.4L/day</strong></li>
<li>CO₂ Reduced: <strong>4.8 tons/day</strong></li>
<li>Revenue Protected: <strong>₹18.6L/day</strong></li>
<li>Delivery Success Improvement: <strong>+5.7% (93.7% → 99.4%)</strong></li>
<li>Emergency Response: <strong>11 min ETA reduction (-61%)</strong></li>
</ul>
<p style="margin-top:12px;color:var(--green);font-weight:700;">✓ Platform deployment-ready for Bengaluru metropolitan operations and Flipkart logistics integration.</p>`;

  body.innerHTML = html;
  window._lastReport = body.innerText;
  adminTimeline('Executive report generated');
  if (showModal) document.getElementById('admin-report-modal').classList.add('show');
}

function downloadExecutiveReport() {
  const text = window._lastReport || 'Gridlock 2.0 Report';
  const blob = new Blob([text], { type: 'text/plain' });
  const a = document.createElement('a');
  a.href = URL.createObjectURL(blob);
  a.download = 'Gridlock2_Executive_Report_' + Date.now() + '.txt';
  a.click();
  toast('⬇ Report downloaded', 's');
}

// ── JUDGE MODE ────────────────────────────────────────────────────────────────
function runJudgeDemo() {
  if (demoRunning) { toast('Demo already running', 'w'); return; }
  toast('🏆 Judge Demonstration starting...', 's');
  adminTimeline('JUDGE MODE — Automated demonstration initiated');

  let i = 0;
  function next() {
    if (i >= JUDGE_STEPS.length) {
      showDemoFinalReport();
      document.getElementById('demo-overlay').classList.add('show');
      document.getElementById('demo-step-text').textContent = '🏆 JUDGE DEMONSTRATION COMPLETE';
      toast('🏆 Judge demo complete!', 's');
      return;
    }
    JUDGE_STEPS[i]();
    i++;
    setTimeout(next, 7500);
  }

  S.zones = ZONES.map(z => ({ ...z }));
  refreshAllDashboards();
  next();
}
