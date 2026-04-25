function parseTimecode(value) {
  const trimmed = String(value || '').trim();
  if (!trimmed) return null;

  // mm:ss.ms or mm:ss
  const mmss = trimmed.match(/^(\d+):(\d{2})(?:\.(\d+))?$/);
  if (mmss) {
    const ms = mmss[3] ? parseFloat('0.' + mmss[3]) : 0;
    return Number(mmss[1]) * 60 + Number(mmss[2]) + ms;
  }

  const seconds = parseFloat(trimmed);
  return isNaN(seconds) ? null : seconds;
}

function formatTimecode(seconds) {
  if (seconds === null || seconds === undefined) return '';
  const m = Math.floor(seconds / 60);
  const s = (seconds % 60).toFixed(2).padStart(5, '0');
  return m + ':' + s;
}

function buildSyncJson(lines) {
  const title = document.getElementById('lyrics-title');
  return {
    title: title ? title.value.trim() : '',
    lines: lines.map((l) => ({ time: l.time, text: l.text })).filter((l) => l.time !== null)
  };
}

function updatePreview(lines) {
  const preview = document.getElementById('lyrics-preview');
  const exportBtn = document.getElementById('lyrics-export-btn');
  const sync = buildSyncJson(lines);
  if (preview) preview.textContent = JSON.stringify(sync, null, 2);
  if (exportBtn) exportBtn.disabled = !sync.lines.length;
}

function renderLyricsLines(lines) {
  const container = document.getElementById('lyrics-lines');
  if (!container) return;

  container.innerHTML = '';

  lines.forEach((line, index) => {
    const row = document.createElement('div');
    row.className = 'lyrics-row';
    row.style.cssText = 'display:flex;gap:0.5rem;align-items:center;margin-bottom:0.4rem;';

    const timeInput = document.createElement('input');
    timeInput.className = 'text-input';
    timeInput.style.cssText = 'width:7rem;flex-shrink:0;font-variant-numeric:tabular-nums;';
    timeInput.placeholder = '0:00.00';
    timeInput.value = line.time !== null ? formatTimecode(line.time) : '';

    const label = document.createElement('span');
    label.style.cssText = 'flex:1;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;opacity:0.8;font-size:0.85rem;';
    label.textContent = line.text;

    timeInput.addEventListener('input', () => {
      lines[index].time = parseTimecode(timeInput.value);
      updatePreview(lines);
    });

    row.appendChild(timeInput);
    row.appendChild(label);
    container.appendChild(row);
  });

  updatePreview(lines);
}

function parseLyrics(text) {
  return text.split('\n')
    .map((l) => l.trim())
    .filter((l) => l.length > 0)
    .map((l) => ({ text: l, time: null }));
}

export function hydrateLyricsPage() {
  const parseBtn = document.getElementById('lyrics-parse-btn');
  const exportBtn = document.getElementById('lyrics-export-btn');
  const lyricsText = document.getElementById('lyrics-text');
  const linesContainer = document.getElementById('lyrics-lines');

  let lines = [];

  if (linesContainer) linesContainer.textContent = '가사를 입력하고 파싱하세요.';

  if (parseBtn && lyricsText) {
    parseBtn.addEventListener('click', () => {
      lines = parseLyrics(lyricsText.value);
      if (!lines.length) {
        if (linesContainer) linesContainer.textContent = '가사를 입력하세요.';
        return;
      }
      renderLyricsLines(lines);
    });
  }

  if (exportBtn) {
    exportBtn.addEventListener('click', () => {
      const sync = buildSyncJson(lines);
      const blob = new Blob([JSON.stringify(sync, null, 2)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = (sync.title || 'lyrics') + '-sync.json';
      a.click();
      URL.revokeObjectURL(url);
    });
  }
}
