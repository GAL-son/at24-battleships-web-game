const { exec } = require('child_process');

module.exports = function (config) {
  config.set({
    basePath: '',
    frameworks: ['jasmine', '@angular-devkit/build-angular'],
    plugins: [
      'karma-jasmine',
      'karma-chrome-launcher',
      '@angular-devkit/build-angular/plugins/karma',
      'karma-html-reporter',
    ],
    client: {
      clearContext: false,
    },
    files: [
      'src/app/tests/**/*.spec.ts',
    ],
    preprocessors: {},
    reporters: ['progress', 'html'],
    htmlReporter: {
      outputFile: 'karma-results.html',
      pageTitle: 'Unit Test Results',
    },
    port: 9876,
    colors: true,
    logLevel: config.LOG_INFO,
    autoWatch: true,
    browsers: ['Chrome'],
    singleRun: true, // Change to true so it exits after running
    restartOnFileChange: true,
    // Open results dynamically
    afterRun: function() {
      exec('start karma-results.html'); // Windows: Replace this with "open karma-results.html" for macOS/Linux
    },
  });
};
