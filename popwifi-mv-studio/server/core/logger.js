function write(level, message) {
  process.stdout.write('[' + new Date().toISOString() + '] [' + level + '] ' + message + '\n');
}

module.exports = {
  info: (msg) => write('INFO', msg),
  warn: (msg) => write('WARN', msg),
  error: (msg) => write('ERROR', msg)
};
