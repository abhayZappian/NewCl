const path = require("path");

module.exports = function override(config) {
  // eslint-disable-next-line no-param-reassign
  config.resolve = {
    ...config.resolve,
    alias: {
      ...config.alias,
      "@config": path.resolve(__dirname, "src/config"),
      // '@utils': path.resolve(__dirname, 'src/utils'),
      // '@contexts': path.resolve(__dirname, 'src/contexts'),
    },
  };
  return config;
};
