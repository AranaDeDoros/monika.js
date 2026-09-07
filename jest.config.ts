import type { Config } from "jest";

const config: Config = {
    testEnvironment: "node",
    extensionsToTreatAsEsm: [".ts"],
    transform: {
        "^.+\\.ts$": [
            "ts-jest",
            {
                useESM: true,
                tsconfig: "./tsconfig.json",
            },
        ],
    },
    moduleNameMapper: {
        "^monika$": "<rootDir>/src/index.ts",
        "^(\\.\\.?\\/.*)\\.js$": "$1",
    },
};

export default config;
