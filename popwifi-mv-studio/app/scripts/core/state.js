export const appState = {
  activePage: 'project',
  queue: null,
  config: null,
  renderDraft: null,
  presets: {
    longform: [],
    shorts: []
  },
  selectedPresets: {
    longform: null,
    shorts: null
  }
};

export function setActivePage(pageName) {
  appState.activePage = pageName;
}

export function setQueue(queue) {
  appState.queue = queue;
}

export function setConfig(config) {
  appState.config = config;
}

export function setRenderDraft(renderDraft) {
  appState.renderDraft = renderDraft;
}

export function setPresets(kind, presets) {
  appState.presets[kind] = presets;
}

export function setSelectedPreset(kind, preset) {
  appState.selectedPresets[kind] = preset;
}

export function getPresetById(kind, batchId, presetId) {
  return (appState.presets[kind] || []).find((preset) => {
    return preset.id === presetId && preset.batchId === batchId;
  }) || null;
}
