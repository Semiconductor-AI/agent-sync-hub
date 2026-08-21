(function exposeI18n(root) {
  const messages = {
    en: { tagline:'Local agent control plane', scanButton:'Scan this computer', heroEyebrow:'Inventory before synchronization', heroTitle:'See what every coding agent can actually reach.', heroBody:'Agent Sync Hub discovers local agent homes and skills without uploading their contents. The first public release is read-only by design.', ready:'Ready to scan', scanning:'Scanning local agent directories…', detected:'Detected', notFound:'Not found', skillsIndexed:'skills indexed', matrixEyebrow:'Skill matrix', matrixTitle:'Availability across agents', filterPlaceholder:'Filter skills', skill:'Skill', present:'Present', emptyInitial:'Run a scan to build the local matrix.', emptyFiltered:'No matching skills were found.', agentsDetected:n=>`${n} agents detected`, scanFailed:m=>`Scan failed: ${m}` },
    'zh-CN': { tagline:'本地 Agent 控制中心', scanButton:'扫描此电脑', heroEyebrow:'先盘点，再同步', heroTitle:'看清每个编程 Agent 真正能够访问的内容。', heroBody:'Agent Sync Hub 可发现本机 Agent 目录与技能，内容无需上传。首个公开版本按设计仅提供只读能力。', ready:'已就绪，可以扫描', scanning:'正在扫描本地 Agent 目录…', detected:'已发现', notFound:'未发现', skillsIndexed:'个技能已索引', matrixEyebrow:'技能矩阵', matrixTitle:'各 Agent 的技能可用情况', filterPlaceholder:'筛选技能', skill:'技能', present:'存在', emptyInitial:'运行扫描以生成本地技能矩阵。', emptyFiltered:'未找到匹配的技能。', agentsDetected:n=>`已发现 ${n} 个 Agent`, scanFailed:m=>`扫描失败：${m}` }
  };
  const normalize = value => String(value || '').toLowerCase().startsWith('zh') ? 'zh-CN' : 'en';
  const translate = (language, key, value) => { const entry = messages[normalize(language)][key] ?? messages.en[key] ?? key; return typeof entry === 'function' ? entry(value) : entry; };
  const api = { messages, normalize, translate };
  if (typeof module !== 'undefined' && module.exports) module.exports = api;
  if (root) root.AgentSyncI18n = api;
})(typeof window !== 'undefined' ? window : undefined);
