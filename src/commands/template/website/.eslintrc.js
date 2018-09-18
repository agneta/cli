module.exports = {
  "globals": {
    angular: true,
    agneta: true,
    _t_template: true
  },
  "env": {
    "es6": false,
    "browser": true,
    "node": false
  },
  "rules": {
  "node/no-missing-require": ["error", {
    "allowModules": [],
    "resolvePaths": [__dirname],
    "tryExtensions": [".js", ".json", ".node"]
  }]
}
}
