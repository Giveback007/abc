const getType = (val) => {
    if (typeof val === 'object') {
        if (Array.isArray(val)) return 'array';
        else if (val === null)  return 'null';
        else                    return 'object';
    } else {
        if (val !== val)        return 'NaN';
        else                    return typeof val;
    }
}

const isType = (val, testType) => getType(val) === testType;

const arrGen = (length) => Array(length).fill(null);

const wait = (ms) => new Promise((res) => setTimeout(() => res(), ms));

const objEntries = (obj) => Object.keys(obj).map((key) => [key, obj[key]]);

const log = console.log;


