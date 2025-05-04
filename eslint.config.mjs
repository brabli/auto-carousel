import eslint from '@eslint/js';
import tseslint from 'typescript-eslint';

export default tseslint.config(
    eslint.configs.recommended,
    tseslint.configs.recommended,
    tseslint.configs.strict,
    {
        rules: {
            "prefer-const": "warn",
            "indent": [
                "warn", 4
            ],
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

            "comma-spacing": "warn",
            "curly": "warn",
            "eqeqeq": "error",
            "eol-last": ["warn", "always"],

            "keyword-spacing": ["warn"],
        },
    }
);
