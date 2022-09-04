import helpers from './helpers';

const ENTITY_TYPE_INDEX = 4;
const ENTITY_SUBTYPE_INDEX = 5;
const AGE_SEX_START_INDEX = 4;
const AGE_SEX_END_INDEX = 6;
const IIN_OR_BIN_SIZE = 12;
const MONTH_START_INDEX = 2;
const MONTH_END_INDEX = 4;
const FIRST_MONTH_IN_YEAR = 1;
const LAST_MONTH_IN_YEAR = 12;
const FIRST_DAY_IN_MONTH = 1;
const LAST_DAY_IN_MONTH = 31;
const AGE_AND_SEX_MIN_INDEX = 1;
const AGE_AND_SEX_MAX_INDEX = 6;
const TYPE_IE_MIN_INDEX = 0;
const TYPE_IE_MAX_INDEX = 3;
const TYPE_ENTITY_MIN_INDEX = 4;
const TYPE_ENTITY_MAX_INDEX = 6;
const SUBTYPE_ENTITY_MIN_INDEX = 0;
const SUBTYPE_ENTITY_MAX_INDEX = 4;
const WEIGHTS_1 = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11];
const WEIGHTS_2 = [3, 4, 5, 6, 7, 8, 9, 10, 11, 1, 2];
const CHECKSUM_INDEX = 11;
const CHECKSUM_DIVIDER = 11;
const BAD_CHECKSUM = 10;

/**
 * Подсчитывает значение контрольной суммы БИН/ИИН
 * @param {String} value - значение
 * @param {Array} weights - массив с весами разрядов
 * @return {Number} - значение контрольной суммы
 * @private
 */
const getBINOrIINCheckSum = (value, weights) => {
    // sum(ai * bi)
    const reducer = (checksum, currentWeight, index) =>
        checksum + currentWeight * parseInt(value[index], 10);

    return weights.reduce(reducer, 0) % CHECKSUM_DIVIDER;
};

/**
 * Проверка ИИН и БИН по контрольной сумме
 * Считается по формуле sum(a[i] * b[i]) mod 11 === a[12],
 * где i - разряд от 1 до 11, a - ИНН/БИН, b - массив весов разряда
 * Если остаток от деления === 10, то берётся второй массив весов и алгоритм повторяется,
 * если остаток от деления так же 10, то ИИН/БИН не используется и является невалидным
 * @param {String} val - значение БИН/ИНН
 * @return {Boolean} - результат сравнения
 */
const checkBINOrIINByChecksum = (val) => {
    let checksum = getBINOrIINCheckSum(val, WEIGHTS_1);
    let result = true;

    // при остатке от деления 10 - считаем по второму набору весов
    if (checksum !== BAD_CHECKSUM) {
        if (checksum !== parseInt(val[CHECKSUM_INDEX], 10)) {
            result = false;
        }
    } else {
        checksum = getBINOrIINCheckSum(val, WEIGHTS_2);

        // если остаток опять 10, то код невалидный
        if (checksum !== BAD_CHECKSUM) {
            if (parseInt(val[CHECKSUM_INDEX], 10) !== checksum) {
                result = false;
            }
        } else {
            result = false;
        }
    }
    return result;
};

/**
 * Проверка для ИП (соответствие даты рождения и идентификатора возраста и пола)
 * @param val
 * @param month
 * @return {boolean}
 */
const checkIE = (val, month) => {
    let result = false;

    if (month >= FIRST_MONTH_IN_YEAR && month <= LAST_MONTH_IN_YEAR) {
        const day = parseInt(val.substring(AGE_SEX_START_INDEX, AGE_SEX_END_INDEX), 10);
        if (day >= FIRST_DAY_IN_MONTH && day <= LAST_DAY_IN_MONTH) {
            const ageAndSex = parseInt(val[AGE_SEX_END_INDEX], 10);
            if (ageAndSex >= AGE_AND_SEX_MIN_INDEX && ageAndSex <= AGE_AND_SEX_MAX_INDEX) {
                result = checkBINOrIINByChecksum(val);
            }
        }
    }

    return result;
};

/**
 * Проверка для организации (месяц и тип сущности)
 * @param {string} val
 * @param {string} month
 * @return {boolean}
 */
const checkOrg = (val, month) => {
    let result = false;

    if (month >= FIRST_MONTH_IN_YEAR && month <= LAST_MONTH_IN_YEAR) {
        const subtype = parseInt(val[ENTITY_SUBTYPE_INDEX], 10);
        if (subtype >= SUBTYPE_ENTITY_MIN_INDEX && subtype <= SUBTYPE_ENTITY_MAX_INDEX) {
            result = checkBINOrIINByChecksum(val);
        }
    }

    return result;
};

export default function iinBin({ value, doNotValidate, isIE }) {
    if (!value || doNotValidate) {
        return true;
    }

    const month = parseInt(value.substring(MONTH_START_INDEX, MONTH_END_INDEX), 10);
    let result = false;


    if (!helpers.checkLength([IIN_OR_BIN_SIZE], value)) {
        return false;
    }

    if (helpers.isNumber(value)) {
        const typeEntity = parseInt(value[ENTITY_TYPE_INDEX], 10);
        let isIETypeEntity = (typeEntity >= TYPE_IE_MIN_INDEX && typeEntity <= TYPE_IE_MAX_INDEX);
        let isBinTypeEntity = (typeEntity >= TYPE_ENTITY_MIN_INDEX && typeEntity <= TYPE_ENTITY_MAX_INDEX);

        // тип сущности должен совпадать с передаваемым значением
        if (typeof isIE === 'boolean') {
            isIETypeEntity = isIETypeEntity && isIE;
            isBinTypeEntity = isBinTypeEntity && !isIE;
        }
        if (isIETypeEntity) {
            result = checkIE(value, month);
        } else if (isBinTypeEntity) {
            result = checkOrg(value, month);
        }
    }

    return result;
}
