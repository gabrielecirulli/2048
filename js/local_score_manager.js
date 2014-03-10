function LocalScoreManager() {
  this.key = 'bestScore';
}

LocalScoreManager.prototype.get = function () {
  if (!this.isSupported()) {
    return 0;
  }

  return localStorage.getItem(this.key);
};

LocalScoreManager.prototype.set = function (score) {
  if (!this.isSupported()) {
    return false;
  }

  localStorage.setItem(this.key, score);
};

LocalScoreManager.prototype.isSupported = function () {
  return !!window.localStorage;
};

