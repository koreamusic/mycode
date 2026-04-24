export const appState = {
  activePage: 'project',
  queue: null,
  config: null,
  presets: {
    longform: [],
    shorts: []
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

export function setPresets(kind, presets) {
  appState.presets[kind] = presets;
}
