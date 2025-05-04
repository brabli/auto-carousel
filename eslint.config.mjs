import js from "@eslint/js";
import { defineConfig } from "eslint/config";
import globals from "globals";

export default defineConfig([
    {
        languageOptions: {
            globals: {
                ...globals.browser,
            }
        },
        files: ["**/*.{js,mjs,cjs,ts}"],
        plugins: { js },
        extends: ["js/recommended"],
        rules: {
            "prefer-const": "warn",
            "indent": ["warn", 4],

            "brace-style": [
                "error"
            ],

            "linebreak-style": [
                "error",
                "unix"
            ],

            "semi": [
                "warn",
                "always"
            ],

            "comma-spacing": "error",
            "curly": "error",
            "eqeqeq": "error",
            "eol-last": ["warn", "always"],

            "no-console": ["warn", { "allow": ["error"] }],

            "keyword-spacing": ["warn"],
        },

    },
]);

