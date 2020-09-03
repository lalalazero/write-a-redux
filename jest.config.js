module.exports = {
    preset: 'ts-jest',
    testEnvironment: 'jsdom',
    setupFiles: ['./setup.js'],
    testPathIgnorePatterns: [
        '<rootDir>/esm',
        '<rootDir>/cjs'
    ],
    transform: {
        "^.+unit\\.(js|jsx)$": "babel-jest",
        '^.+\\.(js|jsx)$': 'babel-jest',
        '^.+\\.(ts|tsx)$': 'ts-jest',
    },
}