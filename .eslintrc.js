module.exports = {
  env: {
    es6: true,
    node: true
  },
  rules: {
    'no-multiple-empty-lines': [
      2,
      {
        max: 2,
        maxEOF: 1
      }
    ],
    'no-mixed-operators': 0,
    'no-debugger': 0,
    'no-const-assign': 'warn',
    'no-this-before-super': 'warn',
    'no-undef': 'warn',
    'no-unreachable': 'warn',
    'no-unused-vars': 'warn',
    'constructor-super': 'warn',
    'valid-typeof': 'warn',
    indent: 'off',
    yoda: 'off',
    'space-before-function-paren': 'off',
    'func-call-spacing': 'off',
    'template-tag-spacing': 'off'
  },  plugins: [
      'vue'
    ],
  extends: ['standard','plugin:vue/recommended']
}
