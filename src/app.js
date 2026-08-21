const $ = selector => document.querySelector(selector);
let inventory = null;
const i18n = window.AgentSyncI18n;
let language = i18n.normalize(localStorage.getItem('agent-sync-language') || navigator.language);
const t = (key, value) => i18n.translate(language, key, value);

function escapeHtml(value) {
  return String(value).replace(/[&<>'"]/g, char => ({'&':'&amp;','<':'&lt;','>':'&gt;',"'":'&#39;','"':'&quot;'}[char]));
}

function renderAgents() {
  $('#agents').innerHTML = inventory.agents.map(agent => `<article class="agent-card agent-${escapeHtml(agent.key)}">
    <div class="agent-name"><span></span><b>${escapeHtml(agent.label)}</b><em>${agent.installed ? t('detected') : t('notFound')}</em></div>
    <strong>${agent.skillCount}</strong><small>${t('skillsIndexed')}</small>
  </article>`).join('');
}

function renderMatrix(query = '') {
  if (!inventory) return;
  const active = inventory.agents.filter(agent => agent.installed);
  const names = [...new Set(active.flatMap(agent => agent.skills))]
    .filter(name => name.toLowerCase().includes(query.toLowerCase())).sort();
  $('#matrix-head').innerHTML = `<tr><th>${t('skill')}</th>${active.map(a => `<th>${escapeHtml(a.label)}</th>`).join('')}</tr>`;
  $('#matrix-body').innerHTML = names.length ? names.map(name => `<tr><td><b>${escapeHtml(name)}</b></td>${active.map(agent =>
    `<td><span class="presence ${agent.skills.includes(name) ? 'yes' : 'no'}">${agent.skills.includes(name) ? t('present') : '—'}</span></td>`).join('')}</tr>`).join('') :
    `<tr><td class="empty">${t('emptyFiltered')}</td></tr>`;
}

function applyLanguage(nextLanguage) {
  language = i18n.normalize(nextLanguage);
  localStorage.setItem('agent-sync-language', language);
  document.documentElement.lang = language;
  document.querySelectorAll('[data-i18n]').forEach(node => { node.textContent = t(node.dataset.i18n); });
  document.querySelectorAll('[data-i18n-placeholder]').forEach(node => { node.placeholder = t(node.dataset.i18nPlaceholder); });
  document.querySelectorAll('[data-i18n-aria]').forEach(node => { node.setAttribute('aria-label', t(node.dataset.i18nAria)); });
  document.querySelectorAll('[data-language]').forEach(node => node.classList.toggle('active', node.dataset.language === language));
  if (inventory) { renderAgents(); renderMatrix($('#filter').value); $('#status').textContent = t('agentsDetected', inventory.agents.filter(agent => agent.installed).length); }
}

async function scan() {
  const button = $('#scan');
  button.disabled = true;
  $('#status').textContent = t('scanning');
  try {
    const result = await window.agentSync.scan();
    if (!result || !Array.isArray(result.agents)) throw new Error('Scanner returned an invalid result');
    inventory = result;
    renderAgents();
    renderMatrix($('#filter').value);
    $('#status').textContent = t('agentsDetected', result.agents.filter(a => a.installed).length);
    $('#scanned').textContent = new Date(result.scannedAt).toLocaleString(language);
  } catch (error) {
    $('#status').textContent = t('scanFailed', error.message);
  } finally { button.disabled = false; }
}

$('#scan').addEventListener('click', scan);
$('#filter').addEventListener('input', event => renderMatrix(event.target.value));
document.querySelectorAll('[data-language]').forEach(node => node.addEventListener('click', () => applyLanguage(node.dataset.language)));
applyLanguage(language);
window.agentSync.meta().then(meta => { $('#runtime').textContent = `v${meta.version} · ${meta.platform}/${meta.arch}`; });
scan();
