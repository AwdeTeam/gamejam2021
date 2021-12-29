module.exports = {
    "env": {
        "browser": true,
        "es6": true,
        "jest": true,
    },
    "extends": [
        "airbnb",
    ],
    "globals": {
        "Atomics": "readonly",
        "SharedArrayBuffer": "readonly",
    },
    "parserOptions": {
        "ecmaFeatures": {
            "jsx": true,
        },
        "ecmaVersion": 2018,
        "sourceType": "module",
    },
    "plugins": [
        "react",
    ],
    "rules": {
        "indent": [1, 4],
        "semi": [1, "never"],
        "quotes": [1, "double"],
        "no-unused-vars": 1,
        "comma-dangle": 0,
        "quote-props": 0,
        "max-classes-per-file": 0,
        "no-console": 0,
        "object-curly-newline": 0,
        "no-unreachable": "warn",
        "class-methods-use-this": 0,
        "no-multiple-empty-lines": ["warn", { "max": 2 }],

        "import/prefer-default-export": 0,

        "react/jsx-filename-extension": 0,
        "react/jsx-one-expression-per-line": 0,
        "react/jsx-indent": [2, 4],
        "react/jsx-indent-props": [2, 4],
        "react/jsx-props-no-multi-spaces": 0,
        "react/self-closing-comp": 1,
        "react/prop-types": 0,
    },
}
