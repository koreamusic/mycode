function escapeHtml(value) {
  return String(value || '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/\"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

function getPanelId(kind) {
  if (kind === 'shorts') return 'shortsRenderDraft';
  return 'longformRenderDraft';
}

function getDraftPreset(draft, kind) {
  if (!draft || !draft.selected) return null;
  return draft.selected[kind] || null;
}

function getFlowText(preset) {
  const flow = preset && preset.flow ? preset.flow : {};
  return [
    flow.frameSeconds ? '프레임 ' + flow.frameSeconds + '초' : null,
    flow.titleSeconds ? '제목 ' + flow.titleSeconds + '초' : null,
    flow.ctaSeconds ? 'CTA ' + flow.ctaSeconds + '초' : null,
    flow.bottomBarStartsAfterSeconds ? '하단바 ' + flow.bottomBarStartsAfterSeconds + '초 이후' : null
  ].filter(Boolean).join(' · ') || '타이밍 정보 없음';
}

function getStatusClass(statusText) {
  if (String(statusText).includes('완료')) return 'done';
  if (String(statusText).includes('실패')) return 'fail';
  if (String(statusText).includes('중')) return 'running';
  if (String(statusText).includes('추가')) return 'queued';
  return 'ready';
}

function getResultText(result) {
  if (!result || !result.job || !result.job.result) return '';
  const output = result.job.result.primaryFile || result.job.result.manifestFile || '';
  if (!output) return '';
  return [
    '<div class="render-output-card">',
    '  <span>출력 파일</span>',
    '  <code>' + escapeHtml(output) + '</code>',
    '  <button class="control-btn subtle" data-action="copy-render-output" data-output="' + escapeHtml(output) + '">경로 복사</button>',
    '</div>'
  ].join('');
}

export function renderDraftPanel(kind, draft, options = {}) {
  const panel = document.getElementById(getPanelId(kind));
  if (!panel) return;

  const preset = getDraftPreset(draft, kind);
  if (!preset) {
    panel.classList.remove('ready');
    panel.innerHTML = '렌더 준비 프리셋이 없습니다.';
    return;
  }

  const statusText = options.statusText || '렌더 준비됨';
  const statusClass = getStatusClass(statusText);
  const resultText = getResultText(options.result);
  panel.classList.add('ready');
  panel.innerHTML = [
    '<div class="render-draft-kicker ' + escapeHtml(statusClass) + '"><span></span>' + escapeHtml(statusText) + '</div>',
    '<strong>' + escapeHtml(preset.title || preset.presetId || 'Untitled preset') + '</strong>',
    '<span class="render-draft-path">' + escapeHtml([preset.ratio, preset.batchId, preset.presetId].filter(Boolean).join(' · ')) + '</span>',
    '<small>' + escapeHtml(getFlowText(preset)) + '</small>',
    preset.variant ? '<em>' + escapeHtml('variant: ' + preset.variant) + '</em>' : '',
    resultText,
    '<div class="transport-row render-actions">',
    '  <button class="control-btn primary" data-action="run-capture-render" data-kind="' + escapeHtml(kind) + '">렌더 실행</button>',
    '  <button class="control-btn subtle" data-action="queue-render-draft" data-kind="' + escapeHtml(kind) + '">큐에만 추가</button>',
    '</div>'
  ].join('');
}
