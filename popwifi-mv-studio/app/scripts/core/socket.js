import { setQueue } from './state.js';
import { renderQueueCards } from '../pages/queue.js';

export function connectSocket(options) {
  const serverStatus = options.serverStatus;
  const renderStatus = options.renderStatus;

  const protocol = location.protocol === 'https:' ? 'wss' : 'ws';
  const ws = new WebSocket(protocol + '://' + location.host);

  ws.addEventListener('open', () => {
    if (serverStatus) serverStatus.textContent = '서버 연결됨';
  });

  ws.addEventListener('message', (event) => {
    try {
      const data = JSON.parse(event.data);

      if (data.type === 'sync') {
        setQueue(data.queue);
        renderQueueCards(data.queue);
        const queueBox = document.getElementById('queueBox');
        if (queueBox) queueBox.textContent = JSON.stringify(data.queue, null, 2);
      }

      if (data.type === 'progress' && renderStatus) {
        renderStatus.textContent = (data.stage || 'render') + ' ' + (data.percent || 0) + '%';
      }
    } catch (error) {
      // ignore invalid socket payload
    }
  });

  ws.addEventListener('close', () => {
    if (serverStatus) serverStatus.textContent = '서버 재연결 필요';
  });

  return ws;
}
