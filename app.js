const STORAGE_KEY = 'hokkadee_homework';
const days = ['จันทร์', 'อังคาร', 'พุธ', 'พฤหัสบดี', 'ศุกร์'];

const courses = {
  vp: { sj: 'เขียนโปรแกรมแบบวิชวล', rm: 'บธ.2-401' },
  ux: { sj: 'ออกแบบ UX/UI', rm: 'บธ.2-302' },
  dc: { sj: 'สื่อสารข้อมูลธุรกิจ', rm: 'บธ.2-301' },
  sm: { sj: 'จัดการเชิงกลยุทธ์', rm: 'บธ.1-502' },
  adb: { sj: 'วิเคราะห์และออกแบบระบบ', rm: 'บธ.1-402' },
  oop: { sj: 'เขียนโปรแกรมเชิงวัตถุ', rm: 'บธ.2-302' },
  bpm: { sj: 'จัดกระบวนการธุรกิจ', rm: 'บธ.3-505' },
};

const sch = [
  [null, 'vp', 'ux', 'dc', 'sm'],
  [null, 'vp', 'ux', 'dc', 'sm'],
  [null, 'vp', 'ux', 'dc', 'sm'],
  [null, 'vp', 'ux', 'dc', 'sm'],
  [null, 'vp', 'ux', 'dc', 'sm'],
  [null, 'vp', 'ux', 'dc', 'sm'],
  [null, 'vp', 'ux', 'dc', 'sm'],
  [null, 'vp', 'ux', 'dc', 'sm'],
  [null, null, null, null, null],
  [null, null, null, null, null],
  ['adb', 'oop', null, null, 'bpm'],
  ['adb', 'oop', null, null, 'bpm'],
  ['adb', 'oop', null, null, 'bpm'],
  ['adb', 'oop', null, null, 'bpm'],
  ['adb', 'oop', null, null, 'bpm'],
  ['adb', 'oop', null, null, 'bpm'],
  ['adb', 'oop', null, null, 'bpm'],
  ['adb', 'oop', null, null, 'bpm'],
];

let homework = [];

const hwIcons = {
  'เขียนโปรแกรมแบบวิชวล': '💻',
  'ออกแบบ UX/UI': '🎨',
  'เขียนโปรแกรมเชิงวัตถุ': '🧩',
  'จัดการเชิงกลยุทธ์': '📊',
  'วิเคราะห์และออกแบบระบบ': '📋',
  'สื่อสารข้อมูลธุรกิจ': '🌐',
};

const seedData = [
  { id: 1, subj: 'เขียนโปรแกรมแบบวิชวล', task: 'สร้างเว็บ CRUD ด้วย C#', detail: 'สร้าง CRUD Web Application ด้วย ASP.NET MVC', due: '2026-07-12 23:59:00', done: false },
  { id: 2, subj: 'เขียนโปรแกรมแบบวิชวล', task: 'แบบฝึกหัด Inheritance', detail: '', due: '2026-07-19 23:59:00', done: false },
  { id: 3, subj: 'ออกแบบ UX/UI', task: 'ออกแบบ Mobile App Prototype', detail: '', due: '2026-07-15 23:59:00', done: false },
  { id: 4, subj: 'ออกแบบ UX/UI', task: 'ทำ User Persona', detail: '', due: '2026-07-22 23:59:00', done: true },
  { id: 5, subj: 'เขียนโปรแกรมเชิงวัตถุ', task: 'ส่งงาน UML Diagram', detail: '', due: '2026-07-18 23:59:00', done: true },
  { id: 6, subj: 'เขียนโปรแกรมเชิงวัตถุ', task: 'เขียนโปรแกรม Polymorphism', detail: '', due: '2026-07-25 23:59:00', done: false },
  { id: 7, subj: 'จัดการเชิงกลยุทธ์', task: 'รายงานการวิเคราะห์คู่แข่ง', detail: '', due: '2026-07-20 23:59:00', done: false },
  { id: 8, subj: 'วิเคราะห์และออกแบบระบบ', task: 'Analysis Report บริษัทตัวอย่าง', detail: '', due: '2026-07-22 23:59:00', done: false },
  { id: 9, subj: 'สื่อสารข้อมูลธุรกิจ', task: 'จำลองเครือข่ายด้วย Packet Tracer', detail: '', due: '2026-07-25 23:59:00', done: true },
];

function saveHomework() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(homework));
}

function formatDate(dateStr) {
  if (!dateStr) return '';
  const d = new Date(dateStr);
  if (isNaN(d)) return dateStr;
  const months = ['ม.ค.','ก.พ.','มี.ค.','เม.ย.','พ.ค.','มิ.ย.','ก.ค.','ส.ค.','ก.ย.','ต.ค.','พ.ย.','ธ.ค.'];
  return `${d.getDate()} ${months[d.getMonth()]} ${d.getFullYear()+543}`;
}

function startCountdown() {
  const els = document.querySelectorAll('[data-due]');
  if (!els.length) return;
  const now = Date.now();
  els.forEach(el => {
    const target = new Date(el.dataset.due).getTime();
    const diff = target - now;
    if (diff <= 0) {
      el.textContent = '⏰ หมดเวลาส่งงานแล้ว!';
      el.className = 'hw-countdown overdue';
      return;
    }
    const days = Math.floor(diff / 86400000);
    const hrs = Math.floor((diff % 86400000) / 3600000);
    const mins = Math.floor((diff % 3600000) / 60000);
    const secs = Math.floor((diff % 60000) / 1000);
    el.textContent = `⏱ ${days}วัน ${hrs}ชม ${mins}น ${secs}วิ`;
    el.className = 'hw-countdown' + (days < 3 ? ' urgent' : '');
  });
}

function loadHomework() {
  const stored = localStorage.getItem(STORAGE_KEY);
  if (stored) {
    homework = JSON.parse(stored);
  } else {
    homework = seedData.map(h => ({ ...h }));
    saveHomework();
  }
  renderHomework();
}

function init() {
  loadHomework();
  renderSchedule();
  renderDrinks();
  setInterval(startCountdown, 1000);
}

function closeMobileMenu() {
  document.querySelector('.nav-links').classList.remove('open');
  const overlay = document.getElementById('nav-overlay');
  if (overlay) { overlay.remove(); document.body.style.overflow = ''; }
}

function showPage(page) {
  document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
  const el = document.getElementById('page-' + page);
  if (el) el.classList.add('active');
  closeMobileMenu();
  if (page === 'homework') showHwSubjects();
  if (page === 'drinks') renderDrinks();
}

function toggleMobileMenu() {
  const nav = document.querySelector('.nav-links');
  const isOpen = nav.classList.toggle('open');
  let overlay = document.getElementById('nav-overlay');
  if (isOpen) {
    if (!overlay) {
      overlay = document.createElement('div');
      overlay.id = 'nav-overlay';
      overlay.className = 'nav-overlay';
      overlay.onclick = toggleMobileMenu;
      document.body.appendChild(overlay);
      document.body.style.overflow = 'hidden';
    }
  } else {
    if (overlay) { overlay.remove(); document.body.style.overflow = ''; }
  }
}

function renderSchedule() {
  const thead = document.getElementById('sch-head');
  const tbody = document.getElementById('sch-body');
  thead.innerHTML = '';
  tbody.innerHTML = '';

  let headHtml = '<tr><th>วัน</th>';
  headHtml += '<th colspan="8">เช้า</th>';
  headHtml += '<th colspan="2">พักเที่ยง</th>';
  headHtml += '<th colspan="8">บ่าย</th>';
  headHtml += '</tr>';
  thead.innerHTML = headHtml;

  days.forEach((day, d) => {
    let cells = '';
    let p = 0;
    while (p < 18) {
      const key = sch[p][d];
      if (!key) {
        cells += '<td></td>';
        p++;
      } else {
        let count = 1;
        while (p + count < 18 && sch[p + count][d] === key) count++;
        const c = courses[key];
        cells += `<td colspan="${count}" class="sch-filled"><span class="sch-subj">${c.sj}<span class="sch-room">${c.rm}</span></span></td>`;
        p += count;
      }
    }
    const tr = document.createElement('tr');
    tr.innerHTML = `<td class="sch-day">${day}</td>${cells}`;
    tbody.appendChild(tr);
  });
}

function renderHomework() {
  const subjects = Object.keys(hwIcons);
  const grid = document.getElementById('hw-subj-grid');
  grid.innerHTML = subjects.map(s => {
    const total = homework.filter(h => h.subj === s).length;
    return `
      <div class="hw-subj-btn" onclick="showHwDetail('${s}')">
        <div class="hw-subj-icon">${hwIcons[s] || '📚'}</div>
        <div class="hw-subj-name">${s}</div>
        <div class="hw-subj-count">${total} งาน</div>
      </div>
    `;
  }).join('');
}

function showHwDetail(subj) {
  document.getElementById('hw-subject-view').style.display = 'none';
  document.getElementById('hw-detail-view').style.display = 'block';
  document.getElementById('hw-detail-title').textContent = subj;
  renderHwList(subj);
}

function renderHwList(subj) {
  const items = homework.filter(h => h.subj === subj);
  const list = document.getElementById('hw-list');
  list.innerHTML = items.map(h => {
    const idx = homework.indexOf(h);
    return `
      <div class="hw-card ${h.done ? 'hw-done' : ''}">
        <div class="hw-head">
          <span class="hw-status">${h.done ? '✅ เสร็จ' : '⏳'}</span>
          <button class="hw-del" onclick="deleteHomework(${idx})" title="ลบ">✕</button>
        </div>
        <div class="hw-task">${h.task}</div>
        ${h.detail ? `<div class="hw-detail">${h.detail}</div>` : ''}
        <div class="hw-foot">
          <span class="hw-due">📅 ${formatDate(h.due)}</span>
          <span class="hw-countdown" data-due="${h.due}"></span>
          <button class="hw-toggle" onclick="toggleHw(${idx})">${h.done ? '🔁' : '✅'}</button>
        </div>
      </div>
    `;
  }).join('') + `
    <div class="hw-add-box">
      <input class="hw-add-input" id="hwAddTask" placeholder="ชื่อการบ้าน...">
      <input class="hw-add-input" id="hwAddDetail" placeholder="รายละเอียด...">
      <input type="date" class="hw-add-input hw-add-date" id="hwAddDue">
      <button class="hw-add-btn" onclick="addHomework('${subj}')">➕ เพิ่ม</button>
    </div>
  `;
  startCountdown();
}

function showToast(msg, isError) {
  let t = document.getElementById('toast-msg');
  if (!t) {
    t = document.createElement('div');
    t.id = 'toast-msg';
    t.className = 'toast';
    document.body.appendChild(t);
  }
  t.textContent = msg;
  t.style.background = isError ? '#ff4444' : '#ffd700';
  t.style.color = isError ? '#fff' : '#0a0a0a';
  t.classList.add('show');
  setTimeout(() => t.classList.remove('show'), 3000);
}

function addHomework(subj) {
  const task = document.getElementById('hwAddTask');
  const detail = document.getElementById('hwAddDetail');
  const due = document.getElementById('hwAddDue');
  if (!task || !due) return;
  const taskVal = task.value.trim();
  const detailVal = detail ? detail.value.trim() : '';
  const dueVal = due.value.trim();
  if (!taskVal || !dueVal) { showToast('กรุณากรอกชื่อการบ้านและวันที่ให้ครบ', true); return; }

  const maxId = homework.length > 0 ? Math.max(...homework.map(h => h.id)) : 0;
  homework.push({ id: maxId + 1, subj, task: taskVal, detail: detailVal, due: dueVal + ' 23:59:00', done: false });
  saveHomework();

  task.value = '';
  if (detail) detail.value = '';
  due.value = '';
  renderHwList(subj);
  renderHomework();
  showToast('เพิ่มการบ้านสำเร็จ');
}

function showHwSubjects() {
  document.getElementById('hw-subject-view').style.display = 'block';
  document.getElementById('hw-detail-view').style.display = 'none';
}

function toggleHw(idx) {
  homework[idx].done = !homework[idx].done;
  saveHomework();
  renderHwList(homework[idx].subj);
  renderHomework();
}

function deleteHomework(idx) {
  const subj = homework[idx].subj;
  homework.splice(idx, 1);
  saveHomework();
  renderHwList(subj);
  renderHomework();
}

/* ===== Randomdrink Wheel ===== */

let wheelEntries = ['King Cup', 'Never Have I Ever', 'เกม 21', 'สุดารัตน์', 'เกมทายเพลง', 'ปืน-ยา-เงิน'];
let wheelAngle = 0;
let spinning = false;

const wheelColors = [
  '#ff6b6b','#ffd93d','#6bcb77','#4d96ff','#ff6b9d','#c084fc',
  '#fb923c','#38bdf8','#f472b6','#34d399','#fbbf24','#ef4444',
  '#22d3ee','#a78bfa','#fb7185','#eab308'
];

function renderDrinks() {
  const grid = document.getElementById('drink-btn-grid');
  grid.innerHTML = `
    <div class="wheel-wrap">
      <div class="wheel-title">🎡 Randomdrink</div>
      <p class="wheel-sub">เพิ่มชื่อคนหรือคำสั่ง แล้วหมุนวงล้อ!</p>

      <div class="wheel-main">
        <canvas id="wheelCanvas" width="400" height="400"></canvas>
        <div class="wheel-pointer">▼</div>
      </div>

      <button class="wheel-spin" onclick="spinWheel()" id="spinBtn">หมุนวงล้อ!</button>

      <div class="wheel-result" id="wheelResult"></div>

      <div class="wheel-entries-box">
        <div class="wheel-add-row">
          <input class="wheel-input" id="wheelInput" placeholder="เพิ่มชื่อ..." onkeydown="if(event.key==='Enter')addEntry()">
          <button class="wheel-add-btn" onclick="addEntry()">เพิ่ม</button>
        </div>
        <div class="wheel-list" id="wheelList"></div>
      </div>
    </div>
  `;
  renderWheelList();
  drawWheel();
}

function drawWheel() {
  const c = document.getElementById('wheelCanvas');
  if (!c) return;
  const ctx = c.getContext('2d');
  const n = wheelEntries.length;
  if (n === 0) {
    ctx.clearRect(0, 0, c.width, c.height);
    ctx.fillStyle = '#333';
    ctx.font = 'bold 18px Kanit';
    ctx.textAlign = 'center';
    ctx.fillText('เพิ่มชื่อก่อนหมุน!', c.width/2, c.height/2);
    return;
  }
  const arc = (2 * Math.PI) / n;
  const cx = c.width / 2, cy = c.height / 2, r = c.width / 2 - 12;

  ctx.clearRect(0, 0, c.width, c.height);

  for (let i = 0; i < n; i++) {
    const start = wheelAngle + i * arc;
    const end = start + arc;

    ctx.beginPath();
    ctx.moveTo(cx, cy);
    ctx.arc(cx, cy, r, start, end);
    ctx.closePath();
    ctx.fillStyle = wheelColors[i % wheelColors.length];
    ctx.fill();
    ctx.strokeStyle = '#0a0a0a';
    ctx.lineWidth = 2;
    ctx.stroke();

    ctx.save();
    ctx.translate(cx, cy);
    ctx.rotate(start + arc / 2);
    ctx.textAlign = 'right';
    ctx.fillStyle = '#000';
    ctx.font = 'bold 13px Kanit, sans-serif';
    ctx.fillText(wheelEntries[i], r - 14, 5);
    ctx.restore();
  }

  ctx.beginPath();
  ctx.arc(cx, cy, 16, 0, 2 * Math.PI);
  ctx.fillStyle = '#ffd700';
  ctx.fill();
  ctx.strokeStyle = '#0a0a0a';
  ctx.lineWidth = 2;
  ctx.stroke();
}

function renderWheelList() {
  const list = document.getElementById('wheelList');
  if (!list) return;
  list.innerHTML = wheelEntries.map((e, i) =>
    `<span class="wheel-tag" onclick="removeEntry(${i})">${e} ✕</span>`
  ).join('');
  document.getElementById('spinBtn').disabled = wheelEntries.length < 2;
}

function addEntry() {
  const input = document.getElementById('wheelInput');
  const val = input.value.trim();
  if (!val) return;
  wheelEntries.push(val);
  input.value = '';
  renderWheelList();
  drawWheel();
}

function removeEntry(i) {
  wheelEntries.splice(i, 1);
  renderWheelList();
  drawWheel();
}

function spinWheel() {
  if (spinning || wheelEntries.length < 2) return;
  spinning = true;

  const spinBtn = document.getElementById('spinBtn');
  spinBtn.disabled = true;

  const resultDiv = document.getElementById('wheelResult');
  resultDiv.innerHTML = '';

  const totalRotation = 5 * 2 * Math.PI + Math.random() * 2 * Math.PI;
  const targetAngle = wheelAngle + totalRotation;
  const duration = 4000;
  const start = performance.now();
  const startAngle = wheelAngle;

  function animate(now) {
    const elapsed = now - start;
    const progress = Math.min(elapsed / duration, 1);
    const ease = 1 - Math.pow(1 - progress, 3);
    wheelAngle = startAngle + totalRotation * ease;
    drawWheel();

    if (progress < 1) {
      requestAnimationFrame(animate);
    } else {
      wheelAngle = targetAngle % (2 * Math.PI);
      spinning = false;
      spinBtn.disabled = false;

      const n = wheelEntries.length;
      const arc = (2 * Math.PI) / n;
      const pointerAngle = -Math.PI / 2;
      let norm = ((pointerAngle - wheelAngle) % (2 * Math.PI) + 2 * Math.PI) % (2 * Math.PI);
      const idx = Math.floor(norm / arc);
      const winner = wheelEntries[idx % n];

      resultDiv.innerHTML = `<div class="wheel-winner">🍺 ${winner} 🍺</div>`;
      drawWheel();
    }
  }

  requestAnimationFrame(animate);
}

init();
