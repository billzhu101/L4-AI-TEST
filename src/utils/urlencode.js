import urlencodeForPhp from 'urlencode-for-php';

const urlencode = (arg) => {
    if (!arg) {
        return '';
    }

    const params = Object.assign({}, arg);

    Object.keys(arg).forEach((key) => {
        if (
            arg[key] === '' ||
            arg[key] === null ||
            arg[key] === undefined ||
            (Array.isArray(arg[key]) && arg[key].length === 0) ||
            (typeof arg[key] === 'object' && arg[key].length === undefined)
        ) {
            delete params[key];
        }
    });

    return urlencodeForPhp(params);
};

const formEncode = (arg) => {
    const params = Object.assign({}, arg);

    Object.keys(arg).forEach((key) => {
        /* 过滤掉对象 */
        if ((arg[key] !== null && typeof arg[key] === 'object' && arg[key].length === undefined) || arg[key] === undefined) {
            delete params[key];
        }

        if (arg[key] === null) {
            params[key] = '';
        }
    });

    return urlencodeForPhp(params);
};

export {
    urlencodeForPhp,
    urlencode,
    formEncode,
};
