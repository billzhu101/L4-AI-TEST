const fabric = require('@umijs/fabric');

module.exports = {
    ...fabric.stylelint,
    rules: {
        'no-descending-specificity': null,
        'plugin/declaration-block-no-ignored-properties': true,
        'font-family-no-missing-generic-family-keyword': null,
        'at-rule-no-unknown': null,
    },
};
