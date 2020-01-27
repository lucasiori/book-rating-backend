module.exports = function parseStringArray(array) {
  return array.split(',').map(item => item.trim());
}