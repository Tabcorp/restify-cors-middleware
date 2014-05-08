
exports.match = function(origin, list) {
  function belongs(o) {
    return (origin === o || o === "*");
  }
  if (origin && list.some(belongs)) {
    return origin;
  } else {
    return false;
  }
};
