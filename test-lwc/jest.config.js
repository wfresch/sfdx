const { jestConfig } = require('@salesforce/sfdx-lwc-jest/config');
module.exports = {
    ...jestConfig,
    // add any custom configurations here
    moduleNameMapper: {
        '^thunder/hammerButton$': '<rootDir>/force-app/test/jest-mocks/thunder/hammerButton',
        '^c/displayPanel$': '<rootDir>/force-app/test/jest-mocks/c/displayPanel',
        '^lightning/button$': '<rootDir>/force-app/test/jest-mocks/lightning/button'
      }
};