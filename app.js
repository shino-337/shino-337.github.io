const DATA_URL = './data/dsomm-devsecops.json';

/**
 * Trạng thái lựa chọn: { [activityId]: boolean }
 * Quy ước tính mức: Tính tỷ lệ đạt % theo từng mức, mức đạt nếu ≥ threshold (80%)
 */
const STATE_KEY = 'dsomm_assessment_devsecops_v1';
const LEVEL_THRESHOLD = 0.8; // 80% activity phải tick để coi là đạt mức đó
const COLLAPSE_STATE_KEY = 'dsomm_collapse_state_v1';
const LANG_KEY = 'dsomm_language_v1';

// Translations
const translations = {
  vi: {
    'app.title': 'Đánh giá DSOMM (DevSecOps)',
    'import': 'Nhập đánh giá',
    'export': 'Xuất đánh giá',
    'reset': 'Xóa trạng thái',
    'summary.title': 'Tổng quan mức trưởng thành',
    'summary.current': 'Mức hiện tại:',
    'summary.scale': '(thang 1–5)',
    'summary.analysis': 'Biểu đồ phân tích',
    'samm.title': 'Mapping với OWASP SAMM 2.0',
    'samm.chart': 'Biểu đồ SAMM',
    'samm.summary': 'Tổng quan SAMM Mapping',
    'samm.totalPractices': 'Tổng Practices',
    'samm.functions': 'Business Functions',
    'samm.achieved': 'Practices Đạt',
    'samm.rate': 'Tỷ lệ đạt',
    'samm.dsommScore': 'DSOMM Score (TB)',
    'samm.sammLevel': 'SAMM Level (TB)',
    'samm.allFunctions': 'Tất cả Functions',
    'samm.allStreams': 'Tất cả Streams',
    'samm.stream': 'Stream',
    'samm.level': 'Level',
    'samm.activities': 'DSOMM Activities:',
    'samm.noActivities': 'Chưa có activity nào được đánh giá',
    'samm.noMapping': 'Không có mapping SAMM trong dữ liệu hiện tại.',
    'matrix.title': 'Ma trận tiêu chí',
    'matrix.allDomains': 'Tất cả Domain',
    'matrix.search': 'Tìm kiếm...',
    'matrix.dense': 'Cô đọng',
    'matrix.collapseAll': 'Thu gọn tất cả',
    'matrix.expandAll': 'Mở rộng tất cả',
    'matrix.prev': '‹ Trước',
    'matrix.next': 'Sau ›',
    'matrix.page': 'Trang',
    'matrix.level': 'Mức đạt:',
    'matrix.loading': 'Đang tải dữ liệu...',
    'matrix.notFound': 'Không tìm thấy tiêu chí nào...',
    'view.dsomm': 'DSOMM Assessment',
    'view.samm': 'SAMM Mapping',
  },
  en: {
    'app.title': 'DSOMM (DevSecOps) Assessment',
    'import': 'Import Assessment',
    'export': 'Export Assessment',
    'reset': 'Clear State',
    'summary.title': 'Maturity Overview',
    'summary.current': 'Current Level:',
    'summary.scale': '(scale 1–5)',
    'summary.analysis': 'Analysis Chart',
    'samm.title': 'Mapping with OWASP SAMM 2.0',
    'samm.chart': 'SAMM Chart',
    'samm.summary': 'SAMM Mapping Overview',
    'samm.totalPractices': 'Total Practices',
    'samm.functions': 'Business Functions',
    'samm.achieved': 'Achieved Practices',
    'samm.rate': 'Achievement Rate',
    'samm.dsommScore': 'DSOMM Score (Avg)',
    'samm.sammLevel': 'SAMM Level (Avg)',
    'samm.allFunctions': 'All Functions',
    'samm.allStreams': 'All Streams',
    'samm.stream': 'Stream',
    'samm.level': 'Level',
    'samm.activities': 'DSOMM Activities:',
    'samm.noActivities': 'No activities have been assessed',
    'samm.noMapping': 'No SAMM mapping found in current data.',
    'matrix.title': 'Criteria Matrix',
    'matrix.allDomains': 'All Domains',
    'matrix.search': 'Search...',
    'matrix.dense': 'Dense',
    'matrix.collapseAll': 'Collapse All',
    'matrix.expandAll': 'Expand All',
    'matrix.prev': '‹ Prev',
    'matrix.next': 'Next ›',
    'matrix.page': 'Page',
    'matrix.level': 'Level Achieved:',
    'matrix.loading': 'Loading data...',
    'matrix.notFound': 'No criteria found...',
    'view.dsomm': 'DSOMM Assessment',
    'view.samm': 'SAMM Mapping',
  },
};

let currentLang = 'vi';

function loadLanguage() {
  try {
    const saved = localStorage.getItem(LANG_KEY);
    if (saved && (saved === 'vi' || saved === 'en')) {
      currentLang = saved;
    }
  } catch {
    currentLang = 'vi';
  }
}

function t(key) {
  return translations[currentLang][key] || key;
}

function applyTranslations() {
  // Update all elements with data-i18n attribute
  document.querySelectorAll('[data-i18n]').forEach(el => {
    const key = el.getAttribute('data-i18n');
    if (translations[currentLang][key]) {
      el.textContent = t(key);
    }
  });
  
  // Update placeholders
  document.querySelectorAll('[data-i18n-placeholder]').forEach(el => {
    const key = el.getAttribute('data-i18n-placeholder');
    if (translations[currentLang][key]) {
      el.placeholder = t(key);
    }
  });
  
  // Update language button
  const langText = $('#lang-text');
  if (langText) {
    langText.textContent = currentLang.toUpperCase();
  }
  
  // Update select options
  const sammFunctionFilter = $('#samm-function-filter');
  if (sammFunctionFilter && sammFunctionFilter.options.length > 0) {
    sammFunctionFilter.options[0].textContent = t('samm.allFunctions');
  }
  
  const sammStreamFilter = $('#samm-stream-filter');
  if (sammStreamFilter && sammStreamFilter.options.length > 0) {
    sammStreamFilter.options[0].textContent = t('samm.allStreams');
  }
  
  const domainFilter = $('#domain-filter');
  if (domainFilter && domainFilter.options.length > 0) {
    domainFilter.options[0].textContent = t('matrix.allDomains');
  }
  
  // Re-render content
  if (dsommData) {
    renderSummary();
    renderMatrix();
    // Only render SAMM if SAMM tab is visible
    const sammMapping = document.querySelector('.samm-mapping');
    if (sammMapping && sammMapping.style.display !== 'none') {
      renderSAMMChart();
      renderSAMMMapping();
    }
  }
}

function switchLanguage(lang) {
  if (lang === 'vi' || lang === 'en') {
    currentLang = lang;
    localStorage.setItem(LANG_KEY, lang);
    applyTranslations();
  }
}

/** @type {Record<string, boolean>} */
let selectionState = {};
/** @type {any} */
let dsommData = null;
/** @type {Record<string, boolean>} */
let collapsedState = {};

const $ = (q) => document.querySelector(q);

function loadState() {
  try {
    const raw = localStorage.getItem(STATE_KEY);
    selectionState = raw ? JSON.parse(raw) : {};
  } catch {
    selectionState = {};
  }
  try {
    const rawC = localStorage.getItem(COLLAPSE_STATE_KEY);
    collapsedState = rawC ? JSON.parse(rawC) : {};
  } catch {
    collapsedState = {};
  }
}

function saveState() {
  localStorage.setItem(STATE_KEY, JSON.stringify(selectionState));
}

function saveCollapseState() {
  localStorage.setItem(COLLAPSE_STATE_KEY, JSON.stringify(collapsedState));
}

async function loadData() {
  const res = await fetch(DATA_URL);
  dsommData = await res.json();
}

/**
 * Tính mức và tỷ lệ đạt của một practice (subdimension)
 * Chuẩn hoá: nếu practice chỉ có tối đa K mức khả dụng, sẽ quy về thang 5 bằng round((raw/K)*5)
 * Trả về: { level: 0-5 (normalized), rawLevel: 0-K, maxAvailableLevel: K, percentages: {1..5: 0..1} }
 */
function computePracticeLevel(practice) {
  const percentages = {};
  let achievedRaw = 0;
  // Xác định số mức khả dụng (có activity)
  let maxAvailable = 0;
  for (let lvl = 1; lvl <= 5; lvl++) {
    const group = practice.levels.find(l => l.level === lvl);
    const activities = group?.activities || [];
    if (activities.length > 0) {
      maxAvailable = Math.max(maxAvailable, lvl);
    }
  }

  // Tính theo mức khả dụng
  for (let lvl = 1; lvl <= 5; lvl++) {
    const group = practice.levels.find(l => l.level === lvl);
    const activities = group?.activities || [];
    if (activities.length === 0) {
      // Không có activity ở mức này: coi như đạt 100% để không chặn chuỗi tuần tự
      percentages[lvl] = 1;
      // achievedRaw không tăng trực tiếp ở đây; chỉ tăng khi gặp mức có activity và đạt ngưỡng
      continue;
    }
    const ticked = activities.filter(a => !!selectionState[a.id]).length;
    const percent = ticked / activities.length;
    percentages[lvl] = percent;

    if (percent >= LEVEL_THRESHOLD) {
      // Kiểm tra các mức trước đó đã đạt chưa (tuần tự)
      let prevAllOk = true;
      for (let prev = 1; prev < lvl; prev++) {
        if ((percentages[prev] ?? 0) < LEVEL_THRESHOLD) {
          prevAllOk = false;
          break;
        }
      }
      if (prevAllOk && lvl > achievedRaw) {
        achievedRaw = lvl;
      }
    }
  }

  const normalized = maxAvailable > 0 ? Math.round((achievedRaw / maxAvailable) * 5) : 0;
  return { level: normalized, rawLevel: achievedRaw, maxAvailableLevel: maxAvailable, percentages };
}

function computeScores() {
  // Trả về: { domains: {id: {avg, practicesCount, practiceDetails}}, overall: {avg} }
  const domainScores = new Map();
  let sum = 0;
  let count = 0;

  dsommData.domains.forEach((domain) => {
    let dSum = 0;
    let dCount = 0;
    const practiceDetails = [];
    
    domain.practices.forEach((p) => {
      const result = computePracticeLevel(p);
      const lvl = result.level; // normalized 0..5
      dSum += lvl;
      dCount += 1;
      sum += lvl;
      count += 1;
      practiceDetails.push({ id: p.id, name: p.name, ...result });
    });
    
    const avg = dCount > 0 ? dSum / dCount : 0;
    domainScores.set(domain.id, { avg, practicesCount: dCount, practiceDetails });
  });

  const overallAvg = count > 0 ? sum / count : 0;
  return { domainScores, overallAvg, count };
}

function renderSummary() {
  const { domainScores, overallAvg, count } = computeScores();
  const overallLevel = Math.max(1, Math.round(overallAvg || 0));
  $('#overall-score').textContent = count > 0 ? String(overallLevel) : '-';
  $('#overall-progress').style.width = `${(overallAvg / 5) * 100}%`;

  // Render overall segmented bar showing level thresholds 1..5 and current level highlight
  const seg = document.getElementById('overall-segments');
  seg.innerHTML = '';
  for (let lvl = 1; lvl <= 5; lvl++) {
    const el = document.createElement('div');
    el.className = 'segment' + (lvl <= overallLevel ? ` fill lv${lvl}` : '');
    const lab = document.createElement('div');
    lab.className = 'label';
    lab.textContent = `L${lvl}`;
    el.appendChild(lab);
    seg.appendChild(el);
  }

  const domainWrap = $('#domain-cards');
  domainWrap.innerHTML = '';
  dsommData.domains.forEach((d) => {
    const info = domainScores.get(d.id) || { avg: 0, practicesCount: 0, practiceDetails: [] };
    const level = Math.max(1, Math.round(info.avg || 0));

    // Phân bố mức theo subdimension
    const dist = {1:0,2:0,3:0,4:0,5:0};
    info.practiceDetails.forEach((pd) => { 
      if (pd.level > 0) dist[pd.level]++; 
    });

    const card = document.createElement('div');
    card.className = 'domain-card';
    const seg = document.createElement('div');
    seg.className = 'segments';
    for (let lvl = 1; lvl <= 5; lvl++) {
      const el = document.createElement('div');
      el.className = 'segment' + (lvl <= level ? ` fill lv${lvl}` : '');
      seg.appendChild(el);
    }

    const counts = document.createElement('div');
    counts.className = 'counts';
    for (let lvl = 1; lvl <= 5; lvl++) {
      const b = document.createElement('span');
      b.className = 'badge';
      b.textContent = `L${lvl}: ${dist[lvl]}`;
      counts.appendChild(b);
    }

    card.innerHTML = `
      <h3>${d.name}</h3>
      <div class="meta"><span>Mức TB: ${level.toFixed(1)}/5</span><span>${d.practices.length} tiểu mục</span></div>
    `;
    card.appendChild(seg);
    card.appendChild(counts);
    domainWrap.appendChild(card);
  });
  
  renderRadarChart();
}

function renderRadarChart() {
  const container = document.getElementById('radar-chart');
  if (!container) return;
  
  const { domainScores } = computeScores();
  const canvas = document.createElement('canvas');
  container.innerHTML = '';
  container.appendChild(canvas);
  const ctx = canvas.getContext('2d');
  const containerWidth = container.offsetWidth;
  const containerHeight = container.offsetHeight || 500;
  const size = Math.min(containerWidth, containerHeight);
  // Tạo padding để có chỗ vẽ nhãn đầy đủ
  const padding = 80;
  canvas.width = size;
  canvas.height = size;
  const centerX = canvas.width / 2;
  const centerY = canvas.height / 2;
  const radius = Math.min(centerX, centerY) - padding;
  
  ctx.clearRect(0, 0, size, size);
  
  const domains = dsommData.domains;
  const angleStep = (2 * Math.PI) / domains.length;
  
  // Vẽ grid
  ctx.strokeStyle = 'rgba(255, 255, 255, 0.1)';
  ctx.lineWidth = 1;
  for (let ring = 1; ring <= 5; ring++) {
    ctx.beginPath();
    ctx.arc(centerX, centerY, radius * (ring / 5), 0, 2 * Math.PI);
    ctx.stroke();
  }
  
  // Vẽ trục
  ctx.strokeStyle = 'rgba(255, 255, 255, 0.15)';
  for (let i = 0; i < domains.length; i++) {
    const angle = i * angleStep - Math.PI / 2;
    const x = centerX + Math.cos(angle) * radius;
    const y = centerY + Math.sin(angle) * radius;
    ctx.beginPath();
    ctx.moveTo(centerX, centerY);
    ctx.lineTo(x, y);
    ctx.stroke();
  }
  
  // Vẽ data
  ctx.fillStyle = 'rgba(58, 160, 255, 0.3)';
  ctx.strokeStyle = '#3aa0ff';
  ctx.lineWidth = 2;
  ctx.beginPath();
  domains.forEach((domain, i) => {
    const info = domainScores.get(domain.id) || { avg: 0 };
    const value = Math.max(0, Math.min(5, info.avg));
    const angle = i * angleStep - Math.PI / 2;
    const r = radius * (value / 5);
    const x = centerX + Math.cos(angle) * r;
    const y = centerY + Math.sin(angle) * r;
    if (i === 0) ctx.moveTo(x, y);
    else ctx.lineTo(x, y);
  });
  ctx.closePath();
  ctx.fill();
  ctx.stroke();
  
  // Labels đầy đủ, tự xuống dòng
  ctx.fillStyle = '#e6edf3';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  const baseFontSize = 13;
  ctx.font = `${baseFontSize}px sans-serif`;

  function wrapText(text, maxChars) {
    const words = text.split(' ');
    const lines = [];
    let current = '';
    for (const w of words) {
      const next = current ? current + ' ' + w : w;
      if (next.length > maxChars) {
        if (current) lines.push(current);
        current = w;
      } else {
        current = next;
      }
    }
    if (current) lines.push(current);
    return lines;
  }

  domains.forEach((domain, i) => {
    const angle = i * angleStep - Math.PI / 2;
    const x = centerX + Math.cos(angle) * (radius + 30);
    const y = centerY + Math.sin(angle) * (radius + 30);
    const lines = wrapText(domain.name, 20);
    const lineHeight = baseFontSize + 1;
    const totalH = lines.length * lineHeight;
    lines.forEach((line, idx) => {
      ctx.fillText(line, x, y - totalH / 2 + idx * lineHeight);
    });
  });
  
  // Level labels
  ctx.fillStyle = 'rgba(255, 255, 255, 0.5)';
  ctx.font = '10px sans-serif';
  for (let ring = 1; ring <= 5; ring++) {
    const r = radius * (ring / 5);
    ctx.fillText(ring.toString(), centerX + r - 8, centerY);
  }
}

let currentPage = 1;
const itemsPerPage = 10;
let filteredPractices = [];

function renderActivityTooltip(a) {
  let html = `<h4>${a.name}</h4>`;
  
  if (a.description) {
    html += `<div class="section">
      <div class="section-title">Description</div>
      <div class="section-content">${a.description}</div>
    </div>`;
  }
  
  if (a.risk) {
    html += `<div class="section">
      <div class="section-title">Risk</div>
      <div class="section-content">${a.risk}</div>
    </div>`;
  }
  
  if (a.measure) {
    html += `<div class="section">
      <div class="section-title">Measure</div>
      <div class="section-content">${a.measure}</div>
    </div>`;
  }
  
  if (a.implementationGuide || a.difficulty) {
    html += `<div class="section">
      <div class="section-title">Implementation Guide</div>`;
    if (a.implementationGuide) {
      html += `<div class="section-content">${a.implementationGuide}</div>`;
    }
    if (a.difficulty && (a.difficulty.knowledge || a.difficulty.time || a.difficulty.resources)) {
      html += `<div class="difficulty">
        ${a.difficulty.knowledge ? `<span class="difficulty-item">Knowledge: ${a.difficulty.knowledge}</span>` : ''}
        ${a.difficulty.time ? `<span class="difficulty-item">Time: ${a.difficulty.time}</span>` : ''}
        ${a.difficulty.resources ? `<span class="difficulty-item">Resources: ${a.difficulty.resources}</span>` : ''}
      </div>`;
    }
    html += `</div>`;
  }
  
  if (a.tags && a.tags.length > 0 && !(a.tags.length === 1 && a.tags[0] === 'none')) {
    html += `<div class="section">
      <div class="section-title">Tags</div>
      <div class="tags">${a.tags.map(t => `<span class="tag">${t}</span>`).join('')}</div>
    </div>`;
  }
  
  if (a.references && Object.keys(a.references).length > 0) {
    html += `<div class="section references">
      <div class="section-title">References</div>`;
    Object.entries(a.references).forEach(([key, values]) => {
      if (values && values.length > 0) {
        html += `<div class="ref-group">
          <div class="ref-group-title">${key.toUpperCase()}:</div>
          <ul class="ref-list">${values.map(v => `<li>${v}</li>`).join('')}</ul>
        </div>`;
      }
    });
    html += `</div>`;
  }
  
  return html;
}

function renderMatrix() {
  const matrix = $('#matrix');
  
  if (!dsommData || !dsommData.domains || dsommData.domains.length === 0) {
    matrix.innerHTML = '<div style="padding: 20px; text-align: center; color: var(--muted);">Đang tải dữ liệu...</div>';
    return;
  }
  
  // Filter
  const domainFilter = $('#domain-filter')?.value || '';
  const searchQuery = $('#search-input')?.value?.toLowerCase() || '';
  
  filteredPractices = [];
  dsommData.domains.forEach((domain) => {
    // Filter by domain
    if (domainFilter && domainFilter !== '' && domain.id !== domainFilter && domain.name !== domainFilter) return;
    
    domain.practices.forEach((p) => {
      // Filter by search
      const matchesSearch = !searchQuery || searchQuery.trim() === '' ||
        p.name.toLowerCase().includes(searchQuery) ||
        domain.name.toLowerCase().includes(searchQuery);
      if (matchesSearch) {
        filteredPractices.push({ domain, practice: p });
      }
    });
  });
  
  // Pagination
  const totalPages = Math.max(1, Math.ceil(filteredPractices.length / itemsPerPage));
  if (currentPage > totalPages) currentPage = Math.max(1, totalPages);
  if (currentPage < 1) currentPage = 1;
  const start = (currentPage - 1) * itemsPerPage;
  const end = start + itemsPerPage;
  const pageItems = filteredPractices.slice(start, end);
  
  // Update pagination UI (an toàn khi phần tử chưa tồn tại do cache)
  const pageInfoEl = $('#page-info');
  if (pageInfoEl) pageInfoEl.textContent = `Trang ${currentPage} / ${totalPages}`;
  const prevBtn = $('#prev-page');
  if (prevBtn) prevBtn.disabled = currentPage === 1;
  const nextBtn = $('#next-page');
  if (nextBtn) nextBtn.disabled = currentPage >= totalPages;
  
  // Populate domain filter
  const df = $('#domain-filter');
  if (df && df.options.length === 1) {
    dsommData.domains.forEach(d => {
      const opt = document.createElement('option');
      opt.value = d.id;
      opt.textContent = d.name;
      df.appendChild(opt);
    });
  }
  
  matrix.innerHTML = '';
  
  if (pageItems.length === 0) {
    matrix.innerHTML = '<div style="padding: 20px; text-align: center; color: var(--muted);">Không tìm thấy tiêu chí nào phù hợp với bộ lọc.</div>';
    return;
  }
  
  pageItems.forEach(({ domain, practice: p }) => {
      const wrap = document.createElement('div');
      wrap.className = 'practice';

      const header = document.createElement('div');
      header.className = 'practice-header';

      const title = document.createElement('div');
      title.className = 'practice-title';
      title.innerHTML = `
        <span class="name">${p.name}</span>
        <span class="domain">${domain.name}</span>
      `;

      const picker = document.createElement('div');
      picker.className = 'level-picker';
      const result = computePracticeLevel(p);
      const currentLevel = result.level; // normalized 0..5
      const percentages = result.percentages;
      
      // Hiển thị mức đạt và tỷ lệ %
      const levelDisplay = document.createElement('div');
      levelDisplay.style.cssText = 'font-size: 12px; color: var(--muted); margin-right: 8px;';
      if (currentLevel > 0) {
        levelDisplay.innerHTML = `Mức đạt: <strong style="color: var(--primary);">${currentLevel}/5</strong>`;
      } else {
        levelDisplay.innerHTML = `Mức đạt: <span style="color: var(--muted);">0/5</span>`;
      }
      
      const levels = [0,1,2,3,4,5];
      levels.forEach((lvl) => {
        const btn = document.createElement('button');
        btn.className = 'level-btn' + (lvl === currentLevel ? ' active' : '');
        const percent = percentages[lvl] || 0;
        btn.textContent = lvl === 0 ? '0' : `${lvl}`;
        btn.title = lvl === 0 ? 'Chưa đáp ứng' : `Mức ${lvl}: ${Math.round(percent * 100)}% (click để tick tất cả)`;
        btn.addEventListener('click', () => {
          // Chọn mức L (chuẩn hoá) => ánh xạ về mức thô theo số mức khả dụng
          const maxAvail = result.maxAvailableLevel || 5;
          const desiredRaw = Math.max(0, Math.min(maxAvail, Math.round((lvl / 5) * maxAvail)));
          for (let l = 1; l <= 5; l++) {
            const group = p.levels.find(g => g.level === l);
            (group?.activities || []).forEach(a => {
              selectionState[a.id] = l <= desiredRaw;
            });
          }
          saveState();
          renderSummary();
          renderMatrix();
        });
        picker.appendChild(btn);
      });

      // Collapse button
      const collapseBtn = document.createElement('button');
      collapseBtn.className = 'collapse-btn';
      collapseBtn.textContent = 'Thu gọn';

      header.appendChild(title);
      header.appendChild(levelDisplay);
      header.appendChild(picker);
      header.appendChild(collapseBtn);

      const body = document.createElement('div');
      body.className = 'practice-body';

      // Hiển thị theo nhóm mức 1..5, mỗi activity là một checkbox tick được
      for (let lvl = 1; lvl <= 5; lvl++) {
        const group = p.levels.find(l => l.level === lvl);
        const acts = group?.activities || [];
        if (acts.length === 0) continue;
        
        const ticked = acts.filter(a => !!selectionState[a.id]).length;
        const percent = acts.length > 0 ? (ticked / acts.length) * 100 : 0;
        const isAchieved = percent >= LEVEL_THRESHOLD * 100;
        
        const header = document.createElement('div');
        header.className = 'level-header';
        header.innerHTML = `<strong>Mức ${lvl}</strong> <span style="color: ${isAchieved ? 'var(--ok)' : 'var(--muted)'};">(${ticked}/${acts.length} - ${Math.round(percent)}%)</span>`;
        body.appendChild(header);

        acts.forEach((a) => {
          const item = document.createElement('label');
          item.className = 'criterion';

          const check = document.createElement('input');
          check.type = 'checkbox';
          check.checked = !!selectionState[a.id];
          check.addEventListener('change', () => {
            selectionState[a.id] = check.checked;
            saveState();
            renderSummary();
            // Cập nhật lại level hiển thị ở header
            renderMatrix();
            // Cập nhật SAMM mapping nếu đang ở tab SAMM
            if (document.querySelector('.samm-mapping')?.style.display !== 'none') {
              renderSAMMChart();
              renderSAMMMapping();
            }
          });

          const text = document.createElement('div');
          text.className = 'text';
          text.textContent = a.name;

          if (a.description) {
            const desc = document.createElement('div');
            desc.className = 'desc';
            desc.textContent = a.description.replace(/\s+/g, ' ').slice(0, 300);
            text.appendChild(desc);
          }

          // Tooltip
          const tooltip = document.createElement('div');
          tooltip.className = 'activity-tooltip';
          tooltip.innerHTML = renderActivityTooltip(a);

          item.appendChild(check);
          item.appendChild(text);
          item.appendChild(tooltip);
          body.appendChild(item);

          // Tooltip positioning
          const show = (e) => {
            tooltip.style.display = 'block';
            // đo kích thước sau khi hiển thị
            const pad = 12;
            const vw = window.innerWidth;
            const vh = window.innerHeight;
            const rect = tooltip.getBoundingClientRect();
            let x = e.clientX + 16;
            let y = e.clientY + 16;
            if (x + rect.width + pad > vw) x = Math.max(pad, vw - rect.width - pad);
            if (y + rect.height + pad > vh) y = Math.max(pad, vh - rect.height - pad);
            tooltip.style.left = x + 'px';
            tooltip.style.top = y + 'px';
          };
          const hide = () => {
            tooltip.style.display = 'none';
          };
          item.addEventListener('mouseenter', show);
          item.addEventListener('mousemove', show);
          item.addEventListener('mouseleave', hide);
        });
      }

      // Áp dụng trạng thái thu gọn: mặc định thu gọn nếu chưa có trạng thái
      const defaultCollapsed = collapsedState[p.id] ?? true;
      if (defaultCollapsed) wrap.classList.add('collapsed');
      collapseBtn.textContent = defaultCollapsed ? 'Mở rộng' : 'Thu gọn';

      wrap.appendChild(header);
      wrap.appendChild(body);
      matrix.appendChild(wrap);

      collapseBtn.addEventListener('click', () => {
        const isCollapsed = wrap.classList.toggle('collapsed');
        collapsedState[p.id] = isCollapsed;
        saveCollapseState();
        collapseBtn.textContent = isCollapsed ? 'Mở rộng' : 'Thu gọn';
      });
    });
}

function wireIO() {
  $('#export-btn').addEventListener('click', () => {
    const payload = {
      version: '1.0',
      selections: selectionState,
      generatedAt: new Date().toISOString(),
    };
    const blob = new Blob([JSON.stringify(payload, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'dsomm-assessment.json';
    a.click();
    URL.revokeObjectURL(url);
  });

  $('#import-input').addEventListener('change', async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      const text = await file.text();
      const data = JSON.parse(text);
      if (data && data.selections && typeof data.selections === 'object') {
        selectionState = data.selections;
        saveState();
        renderSummary();
        renderMatrix();
      } else {
        alert('Tệp JSON không đúng định dạng.');
      }
    } catch (err) {
      alert('Không thể đọc tệp JSON.');
    } finally {
      e.target.value = '';
    }
  });

  $('#reset-btn').addEventListener('click', () => {
    if (confirm('Xóa toàn bộ trạng thái đánh giá?')) {
      selectionState = {};
      saveState();
      renderSummary();
      renderMatrix();
    }
  });
  
  // Pagination
  $('#prev-page')?.addEventListener('click', () => {
    if (currentPage > 1) {
      currentPage--;
      renderMatrix();
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  });
  
  $('#next-page')?.addEventListener('click', () => {
    const totalPages = Math.max(1, Math.ceil(filteredPractices.length / itemsPerPage));
    if (currentPage < totalPages) {
      currentPage++;
      renderMatrix();
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  });
  
  // Filter
  $('#domain-filter')?.addEventListener('change', () => {
    currentPage = 1;
    renderMatrix();
  });
  
  $('#search-input')?.addEventListener('input', () => {
    currentPage = 1;
    renderMatrix();
  });

  // Dense toggle
  $('#dense-toggle')?.addEventListener('change', (e) => {
    const checked = e.target.checked;
    document.body.classList.toggle('dense', checked);
  });

  // Collapse/Expand all
  $('#collapse-all')?.addEventListener('click', () => {
    dsommData?.domains?.forEach((d) => d.practices.forEach((p) => { collapsedState[p.id] = true; }));
    saveCollapseState();
    renderMatrix();
  });
  $('#expand-all')?.addEventListener('click', () => {
    dsommData?.domains?.forEach((d) => d.practices.forEach((p) => { collapsedState[p.id] = false; }));
    saveCollapseState();
    renderMatrix();
  });
}

// SAMM Business Functions mapping
const SAMM_FUNCTIONS = {
  'G': 'Governance',
  'D': 'Design',
  'I': 'Implementation',
  'V': 'Verification',
  'O': 'Operations',
};

// SAMM Practices mapping (từ SAMM Toolkit 2.0.6)
const SAMM_PRACTICES = {
  'G': {
    'PS': 'Strategy & Metrics',
    'PC': 'Policy & Compliance',
    'ED': 'Education & Guidance',
    'TM': 'Threat Assessment',
    'SS': 'Security Requirements',
  },
  'D': {
    'AD': 'Architecture Design',
    'TM': 'Technology Management',
    'TA': 'Threat Assessment',
  },
  'I': {
    'SB': 'Secure Build',
    'SD': 'Secure Deployment',
    'DH': 'Defect Management',
    'SS': 'Security Architecture',
  },
  'V': {
    'SA': 'Security Testing',
    'VT': 'Vulnerability Management',
    'AR': 'Architecture Review',
  },
  'O': {
    'EM': 'Environment Management',
    'IM': 'Incident Management',
    'OC': 'Operational Management',
  },
};

function parseSAMMCode(code) {
  // Format: "I-SB-1-A" -> { function: "I", practice: "SB", level: 1, stream: "A" }
  const parts = code.split('-');
  if (parts.length !== 4) return null;
  const func = parts[0];
  const practice = parts[1];
  return {
    function: func,
    functionName: SAMM_FUNCTIONS[func] || func,
    practice: practice,
    practiceName: SAMM_PRACTICES[func]?.[practice] || practice,
    level: parseInt(parts[2], 10),
    stream: parts[3],
    code: code,
  };
}

/**
 * Tính điểm DSOMM theo domain
 * Bước 1: Chuẩn hóa true/false thành 1/0
 * Bước 3: Tính điểm trung bình theo domain (scale 0-3)
 */
function computeDSOMMDomainScores() {
  const domainScores = new Map();
  
  dsommData.domains.forEach((domain) => {
    let totalScore = 0;
    let totalCount = 0;
    
    domain.practices.forEach((practice) => {
      practice.levels.forEach((levelGroup) => {
        levelGroup.activities.forEach((activity) => {
          const score = selectionState[activity.id] ? 1 : 0; // Bước 1: true/false → 1/0
          totalScore += score;
          totalCount += 1;
        });
      });
    });
    
    // Bước 3: Tính điểm trung bình và scale lên 0-3
    const avgScore = totalCount > 0 ? (totalScore / totalCount) * 3 : 0;
    domainScores.set(domain.id, {
      domain: domain.name,
      score: avgScore,
      totalCount,
      tickedCount: totalScore,
      percentage: totalCount > 0 ? (totalScore / totalCount) * 100 : 0,
    });
  });
  
  return domainScores;
}

/**
 * Quy đổi DSOMM score sang SAMM level
 * Bước 4: SAMM_Level = round(1 + (DSOMM_Score/3) * 2, 1)
 */
function convertDSOMMToSAMMLevel(dsommScore) {
  // dsommScore: 0-3
  // SAMM Level: 1-3
  // Công thức: SAMM_Level = 1 + (DSOMM_Score/3) * 2
  const sammLevel = 1 + (dsommScore / 3) * 2;
  return Math.max(1, Math.min(3, Math.round(sammLevel * 10) / 10)); // Round to 1 decimal
}

function aggregateSAMMResults() {
  // Bước 2 & 4: Gắn UUID với domain DSOMM và quy đổi sang SAMM
  const sammMap = new Map();
  const dsommDomainScores = computeDSOMMDomainScores();
  
  // Map domain DSOMM → SAMM practices
  const domainToSAMM = new Map(); // domain.id → [samm practices]
  
  dsommData.domains.forEach((domain) => {
    domain.practices.forEach((practice) => {
      practice.levels.forEach((levelGroup) => {
        levelGroup.activities.forEach((activity) => {
          if (!activity.references?.samm2) return;
          
          activity.references.samm2.forEach((sammCode) => {
            const parsed = parseSAMMCode(sammCode);
            if (!parsed) return;
            
            const key = `${parsed.function}-${parsed.practice}`;
            
            // Lưu domain DSOMM mapping
            if (!domainToSAMM.has(domain.id)) {
              domainToSAMM.set(domain.id, new Set());
            }
            domainToSAMM.get(domain.id).add(key);
            
            // Tạo SAMM practice entry
            if (!sammMap.has(key)) {
              sammMap.set(key, {
                function: parsed.function,
                functionName: parsed.functionName,
                practice: parsed.practice,
                practiceName: parsed.practiceName,
                code: key,
                dsommDomains: new Set(),
                levels: { 1: { A: [], B: [], C: [] }, 2: { A: [], B: [], C: [] }, 3: { A: [], B: [], C: [] } },
              });
            }
            
            const entry = sammMap.get(key);
            entry.dsommDomains.add(domain.id);
            
            // Lưu activities (cho reference)
            const isTicked = !!selectionState[activity.id];
            if (isTicked) {
              entry.levels[parsed.level][parsed.stream].push({
                id: activity.id,
                name: activity.name,
                dsommLevel: levelGroup.level,
                dsommDomain: domain.id,
              });
            }
          });
        });
      });
    });
  });
  
  // Tính SAMM level từ DSOMM domain scores
  sammMap.forEach((practice, key) => {
    // Tính average DSOMM score từ các domains liên quan
    let totalScore = 0;
    let count = 0;
    practice.dsommDomains.forEach(domainId => {
      const domainScore = dsommDomainScores.get(domainId);
      if (domainScore) {
        totalScore += domainScore.score;
        count += 1;
      }
    });
    
    const avgDSOMMScore = count > 0 ? totalScore / count : 0;
    practice.dsommScore = avgDSOMMScore;
    
    // Quy đổi sang SAMM level (theo stream)
    practice.sammLevels = {};
    ['A', 'B', 'C'].forEach(stream => {
      // Có thể tính theo stream riêng hoặc dùng chung
      // Tạm thời dùng chung cho tất cả streams
      practice.sammLevels[stream] = convertDSOMMToSAMMLevel(avgDSOMMScore);
    });
  });
  
  return sammMap;
}

function computeSAMMLevel(sammPractice, stream, requireSequential = true) {
  // requireSequential: true = yêu cầu tuần tự (Level N chỉ đạt nếu đã đạt Level 1..N-1)
  // requireSequential: false = không yêu cầu tuần tự (chỉ cần có activity ở level đó)
  
  if (requireSequential) {
    // Kiểm tra tuần tự: Level N chỉ đạt nếu tất cả Level 1..N-1 đều có ít nhất 1 activity
    let achievedLevel = 0;
    for (let level = 1; level <= 3; level++) {
      const hasActivity = sammPractice.levels[level][stream].length > 0;
      if (hasActivity) {
        // Kiểm tra các level trước đó
        let allPrevOk = true;
        for (let prev = 1; prev < level; prev++) {
          if (sammPractice.levels[prev][stream].length === 0) {
            allPrevOk = false;
            break;
          }
        }
        if (allPrevOk) {
          achievedLevel = level;
        } else {
          // Nếu level hiện tại có activity nhưng level trước chưa đạt → dừng
          break;
        }
      } else {
        // Nếu level hiện tại không có activity → dừng
        break;
      }
    }
    return achievedLevel;
  } else {
    // Không yêu cầu tuần tự: mức cao nhất có activity
    for (let level = 3; level >= 1; level--) {
      if (sammPractice.levels[level][stream].length > 0) {
        return level;
      }
    }
    return 0;
  }
}

function renderSAMMChart() {
  const container = document.getElementById('samm-chart');
  if (!container || !dsommData) {
    if (container) {
      container.innerHTML = '<div style="padding: 20px; text-align: center; color: var(--muted);">' + t('samm.noMapping') + '</div>';
    }
    return;
  }
  
  const sammMap = aggregateSAMMResults();
  if (!sammMap || sammMap.size === 0) {
    container.innerHTML = '<div style="padding: 20px; text-align: center; color: var(--muted);">' + t('samm.noMapping') + '</div>';
    return;
  }
  
  const streamFilter = $('#samm-stream-filter')?.value || '';
  const streams = streamFilter ? [streamFilter] : ['A', 'B', 'C'];
  
  const canvas = document.createElement('canvas');
  container.innerHTML = '';
  container.appendChild(canvas);
  const ctx = canvas.getContext('2d');
  
  const containerWidth = container.offsetWidth || 450;
  const containerHeight = container.offsetHeight || 450;
  const size = Math.min(containerWidth, containerHeight);
  const padding = 80;
  canvas.width = size;
  canvas.height = size;
  const centerX = canvas.width / 2;
  const centerY = canvas.height / 2;
  const radius = Math.min(centerX, centerY) - padding;
  
  ctx.clearRect(0, 0, size, size);
  
  // Group practices by function
  const practicesByFunction = new Map();
  Array.from(sammMap.values()).forEach(p => {
    if (!practicesByFunction.has(p.function)) {
      practicesByFunction.set(p.function, []);
    }
    practicesByFunction.get(p.function).push(p);
  });
  
  const functions = Array.from(practicesByFunction.keys()).sort();
  if (functions.length === 0) {
    container.innerHTML = '<div style="padding: 20px; text-align: center; color: var(--muted);">' + t('samm.noMapping') + '</div>';
    return;
  }
  
  const angleStep = (2 * Math.PI) / functions.length;
  
  // Vẽ grid (3 levels SAMM)
  ctx.strokeStyle = 'rgba(255, 255, 255, 0.1)';
  ctx.lineWidth = 1;
  for (let ring = 1; ring <= 3; ring++) {
    ctx.beginPath();
    ctx.arc(centerX, centerY, radius * (ring / 3), 0, 2 * Math.PI);
    ctx.stroke();
  }
  
  // Vẽ trục
  ctx.strokeStyle = 'rgba(255, 255, 255, 0.15)';
  functions.forEach((func, i) => {
    const angle = i * angleStep - Math.PI / 2;
    const x = centerX + Math.cos(angle) * radius;
    const y = centerY + Math.sin(angle) * radius;
    ctx.beginPath();
    ctx.moveTo(centerX, centerY);
    ctx.lineTo(x, y);
    ctx.stroke();
  });
  
  // Vẽ data cho từng stream
  const streamColors = {
    'A': '#3aa0ff',
    'B': '#26c281',
    'C': '#f0c44c',
  };
  
  streams.forEach((stream, streamIdx) => {
    ctx.fillStyle = streamColors[stream] + '33'; // 30% opacity
    ctx.strokeStyle = streamColors[stream];
    ctx.lineWidth = 2;
    ctx.beginPath();
    
    let firstPoint = true;
    functions.forEach((func, i) => {
      const practices = practicesByFunction.get(func) || [];
      // Tính average SAMM level từ quy đổi DSOMM (Bước 4)
      let totalLevel = 0;
      let count = 0;
      practices.forEach(p => {
        const level = p.sammLevels?.[stream] || 0; // SAMM level từ quy đổi DSOMM
        if (level > 0) {
          totalLevel += level;
          count++;
        }
      });
      const avgLevel = count > 0 ? totalLevel / count : 0;
      const value = Math.max(0, Math.min(3, avgLevel)); // Giới hạn 0-3
      
      const angle = i * angleStep - Math.PI / 2;
      const r = radius * (value / 3);
      const x = centerX + Math.cos(angle) * r;
      const y = centerY + Math.sin(angle) * r;
      
      if (firstPoint) {
        ctx.moveTo(x, y);
        firstPoint = false;
      } else {
        ctx.lineTo(x, y);
      }
    });
    ctx.closePath();
    ctx.fill();
    ctx.stroke();
  });
  
  // Labels
  ctx.fillStyle = '#e6edf3';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  const baseFontSize = 12;
  ctx.font = `${baseFontSize}px sans-serif`;
  
  functions.forEach((func, i) => {
    const angle = i * angleStep - Math.PI / 2;
    const x = centerX + Math.cos(angle) * (radius + 25);
    const y = centerY + Math.sin(angle) * (radius + 25);
    const funcName = SAMM_FUNCTIONS[func] || func;
    ctx.fillText(funcName, x, y);
  });
  
  // Level labels
  ctx.fillStyle = 'rgba(255, 255, 255, 0.5)';
  ctx.font = '10px sans-serif';
  for (let ring = 1; ring <= 3; ring++) {
    const r = radius * (ring / 3);
    ctx.fillText(ring.toString(), centerX + r - 8, centerY);
  }
  
  // Legend
  ctx.fillStyle = '#e6edf3';
  ctx.font = '11px sans-serif';
  ctx.textAlign = 'left';
  let legendY = 20;
  streams.forEach(stream => {
    ctx.fillStyle = streamColors[stream];
    ctx.fillRect(20, legendY - 8, 12, 12);
    ctx.fillStyle = '#e6edf3';
    ctx.fillText(`Stream ${stream}`, 38, legendY);
    legendY += 18;
  });
}

function renderSAMMMapping() {
  const container = document.getElementById('samm-matrix');
  if (!container || !dsommData) {
    if (container) {
      container.innerHTML = '<div style="padding: 20px; text-align: center; color: var(--muted);">' + t('samm.noMapping') + '</div>';
    }
    return;
  }
  
  try {
    const sammMap = aggregateSAMMResults();
    if (!sammMap || sammMap.size === 0) {
      container.innerHTML = '<div style="padding: 20px; text-align: center; color: var(--muted);">' + t('samm.noMapping') + '</div>';
      return;
    }
    
    const functionFilter = $('#samm-function-filter')?.value || '';
    const streamFilter = $('#samm-stream-filter')?.value || '';
  
  const practices = Array.from(sammMap.values())
    .filter(p => !functionFilter || p.function === functionFilter)
    .sort((a, b) => a.code.localeCompare(b.code));
  
  // SAMM Summary
  const totalPractices = practices.length;
  const totalFunctions = new Set(practices.map(p => p.function)).size;
  const achievedPractices = practices.filter(p => {
    const streams = streamFilter ? [streamFilter] : ['A', 'B', 'C'];
    return streams.some(s => (p.sammLevels?.[s] || 0) >= 1); // SAMM level từ quy đổi DSOMM
  }).length;
  
  // Tính tổng DSOMM score và SAMM level
  let totalDSOMMScore = 0;
  let totalSAMMLevel = 0;
  let count = 0;
  practices.forEach(p => {
    const streams = streamFilter ? [streamFilter] : ['A', 'B', 'C'];
    streams.forEach(s => {
      const sammLevel = p.sammLevels?.[s] || 0;
      if (sammLevel > 0) {
        totalDSOMMScore += p.dsommScore || 0;
        totalSAMMLevel += sammLevel;
        count++;
      }
    });
  });
  const avgDSOMMScore = count > 0 ? totalDSOMMScore / count : 0;
  const avgSAMMLevel = count > 0 ? totalSAMMLevel / count : 0;
  
  // Clear container
  container.innerHTML = '';
  
  // SAMM Summary
  const summaryDiv = document.createElement('div');
  summaryDiv.className = 'samm-summary';
  summaryDiv.innerHTML = `
    <h3 style="margin: 0 0 12px;">${t('samm.summary')}</h3>
    <div class="samm-summary-grid">
      <div class="samm-summary-item">
        <div class="samm-summary-label">${t('samm.totalPractices')}</div>
        <div class="samm-summary-value">${totalPractices}</div>
      </div>
      <div class="samm-summary-item">
        <div class="samm-summary-label">${t('samm.functions')}</div>
        <div class="samm-summary-value">${totalFunctions}</div>
      </div>
      <div class="samm-summary-item">
        <div class="samm-summary-label">${t('samm.achieved')}</div>
        <div class="samm-summary-value">${achievedPractices} / ${totalPractices}</div>
      </div>
      <div class="samm-summary-item">
        <div class="samm-summary-label">${t('samm.rate')}</div>
        <div class="samm-summary-value">${totalPractices > 0 ? Math.round((achievedPractices / totalPractices) * 100) : 0}%</div>
      </div>
      <div class="samm-summary-item">
        <div class="samm-summary-label">${t('samm.dsommScore')}</div>
        <div class="samm-summary-value">${avgDSOMMScore.toFixed(1)} / 3.0</div>
      </div>
      <div class="samm-summary-item">
        <div class="samm-summary-label">${t('samm.sammLevel')}</div>
        <div class="samm-summary-value">${avgSAMMLevel.toFixed(1)} / 3.0</div>
      </div>
    </div>
  `;
  container.appendChild(summaryDiv);
  
  // Populate function filter
  const funcFilter = $('#samm-function-filter');
  if (funcFilter && funcFilter.options.length === 1) {
    const functions = [...new Set(practices.map(p => p.function))];
    functions.forEach(f => {
      const opt = document.createElement('option');
      opt.value = f;
      opt.textContent = `${f} - ${SAMM_FUNCTIONS[f] || f}`;
      funcFilter.appendChild(opt);
    });
  }
  
  practices.forEach((practice) => {
    const div = document.createElement('div');
    div.className = 'samm-practice';
    
    const header = document.createElement('div');
    header.className = 'samm-practice-header';
    header.innerHTML = `
      <div>
        <div class="samm-practice-code">${practice.code}</div>
        <div style="font-size: 12px; color: var(--muted); margin-top: 2px;">
          ${practice.functionName} → ${practice.practiceName}
        </div>
      </div>
    `;
    
    const levels = document.createElement('div');
    levels.className = 'samm-levels';
    
    const streams = streamFilter ? [streamFilter] : ['A', 'B', 'C'];
    streams.forEach((stream) => {
      // Dùng SAMM level từ quy đổi DSOMM score (Bước 4)
      const sammLevel = practice.sammLevels?.[stream] || 0;
      const dsommScore = practice.dsommScore || 0;
      
      const levelDiv = document.createElement('div');
      let levelClass = 'samm-level';
      if (sammLevel >= 1) {
        levelClass += ' achieved';
      }
      levelDiv.className = levelClass;
      
      const title = document.createElement('div');
      title.className = 'samm-level-title';
      title.textContent = `${t('samm.stream')} ${stream}`;
      
      const value = document.createElement('div');
      value.className = 'samm-level-value';
      if (sammLevel > 0) {
        // Hiển thị mức SAMM (1-3) từ quy đổi DSOMM
        const levelInt = Math.round(sammLevel);
        value.innerHTML = `${t('samm.level')} ${levelInt.toFixed(1)} <span style="font-size: 11px; color: var(--muted);">(DSOMM: ${dsommScore.toFixed(1)})</span>`;
      } else {
        value.textContent = '-';
      }
      
      levelDiv.appendChild(title);
      levelDiv.appendChild(value);
      levels.appendChild(levelDiv);
    });
    
    // List activities
    const activitiesDiv = document.createElement('div');
    activitiesDiv.className = 'samm-activities';
    activitiesDiv.innerHTML = `<strong>${t('samm.activities')}</strong>`;
    const list = document.createElement('ul');
    list.className = 'samm-activities-list';
    
    streams.forEach((stream) => {
      for (let level = 1; level <= 3; level++) {
        practice.levels[level][stream].forEach((act) => {
          const li = document.createElement('li');
          li.textContent = `${act.name} (DSOMM Level ${act.dsommLevel})`;
          list.appendChild(li);
        });
      }
    });
    
    if (list.children.length === 0) {
      list.innerHTML = `<li style="color: var(--muted);">${t('samm.noActivities')}</li>`;
    }
    
    activitiesDiv.appendChild(list);
    
    div.appendChild(header);
    div.appendChild(levels);
    div.appendChild(activitiesDiv);
    container.appendChild(div);
  });
  } catch (error) {
    console.error('Error rendering SAMM mapping:', error);
    container.innerHTML = '<div style="padding: 20px; text-align: center; color: var(--danger);">Error: ' + error.message + '</div>';
  }
}

async function main() {
  loadLanguage();
  loadState();
  await loadData();
  wireIO();
  applyTranslations();
  renderSummary();
  renderMatrix();
  
  // Language selector
  setTimeout(() => {
    const langBtn = $('#lang-btn');
    const langMenu = $('#lang-menu');
    
    if (langBtn && langMenu) {
      langBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        const isHidden = langMenu.style.display === 'none' || !langMenu.style.display;
        langMenu.style.display = isHidden ? 'block' : 'none';
      });
      
      const langOptions = document.querySelectorAll('.lang-option');
      langOptions.forEach(option => {
        option.addEventListener('click', (e) => {
          e.stopPropagation();
          const lang = option.dataset.lang;
          if (lang) {
            switchLanguage(lang);
            langMenu.style.display = 'none';
          }
        });
      });
      
      // Close menu when clicking outside
      document.addEventListener('click', (e) => {
        if (langBtn && langMenu && !langBtn.contains(e.target) && !langMenu.contains(e.target)) {
          langMenu.style.display = 'none';
        }
      });
    }
  }, 100);
  
  // Tab switching
  document.querySelectorAll('.view-tab').forEach(tab => {
    tab.addEventListener('click', () => {
      const view = tab.dataset.view;
      document.querySelectorAll('.view-tab').forEach(t => t.classList.remove('active'));
      tab.classList.add('active');
      
      if (view === 'dsomm') {
        const summaryEl = document.querySelector('.summary');
        const matrixEl = document.querySelector('.matrix');
        const sammEl = document.querySelector('.samm-mapping');
        if (summaryEl) summaryEl.style.display = 'block';
        if (matrixEl) matrixEl.style.display = 'block';
        if (sammEl) sammEl.style.display = 'none';
      } else {
        const summaryEl = document.querySelector('.summary');
        const matrixEl = document.querySelector('.matrix');
        const sammEl = document.querySelector('.samm-mapping');
        if (summaryEl) summaryEl.style.display = 'none';
        if (matrixEl) matrixEl.style.display = 'none';
        if (sammEl) sammEl.style.display = 'block';
        
        // Render SAMM content
        if (dsommData) {
          try {
            renderSAMMChart();
            renderSAMMMapping();
          } catch (error) {
            console.error('Error rendering SAMM:', error);
          }
        }
      }
    });
  });
  
  // SAMM filters
  $('#samm-function-filter')?.addEventListener('change', () => {
    renderSAMMChart();
    renderSAMMMapping();
  });
  $('#samm-stream-filter')?.addEventListener('change', () => {
    renderSAMMChart();
    renderSAMMMapping();
  });
}

main();


