// https://medium.com/@uistephen/style-guides-for-linting-ecmascript-2015-eslint-common-google-airbnb-6c25fd3dff0
// npm install -g eslint eslint-plugin-jsx-a11y eslint-config-airbnb eslint-plugin-react eslint-plugin-import
module.exports = {
  "env": {
    "browser": true,
    "es6": true
  },
  "parserOptions": {
    "ecmaVersion": 6,
    "ecmaFeatures": {},
    "sourceType": "module"
  },
  "extends": ["eslint:recommended", "airbnb"],
  "rules": {
    "indent": ["error", 2],
    "linebreak-style": ["error", "unix"],
    "quotes": ["error", "double"],
    "semi": ["error", "always"],
    "import/extensions": ["js", "off"],
    "no-multi-spaces": "off",
    "comma-dangle": "off",
    "key-spacing": "off",
    "one-var": "off"
  }
};
