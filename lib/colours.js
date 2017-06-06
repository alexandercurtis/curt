
exports.red = s => {
  return "\x1b[31m\x1b[1m" + s + "\x1b[0m"
};
exports.green = s => {
  return "\x1b[32m\x1b[1m" + s + "\x1b[0m"
};
exports.yellow = s => {
  return "\x1b[33m\x1b[1m" + s + "\x1b[0m"
};
exports.blue = s => {
  return "\x1b[34m\x1b[1m" + s + "\x1b[0m"
};
exports.magenta = s => {
  return "\x1b[35m\x1b[1m" + s + "\x1b[0m"
};
exports.cyan = s => {
  return "\x1b[36m\x1b[1m" + s + "\x1b[0m"
};
exports.white = s => {
  return "\x1b[37m\x1b[1m" + s + "\x1b[0m"
};
