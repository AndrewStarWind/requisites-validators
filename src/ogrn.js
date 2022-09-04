import helpers from './helpers';

const LEGAL_ENTITY_ID_1 = 1;
const LEGAL_ENTITY_ID_2 = 5;
const IE_ID = 3;
const NUMBER_ID = 2;
const allowsFirstDig = [LEGAL_ENTITY_ID_1, IE_ID, NUMBER_ID, LEGAL_ENTITY_ID_2];
const DIGITS_TO_CUT = 2;
const CHECKSUM_DIVIDER = 10;


const OGRN_LENGTH = {
    IE: 15,
    ORG: 13
};

const ogrnLengthCheck = (isIE, value) => {
    return helpers.checkLength([isIE ? OGRN_LENGTH.IE : OGRN_LENGTH.ORG], value);
};


export default function ogrn({
    value,
    doNotValidate,
    isIE
}) {
    const effectiveLength = parseInt(value, 10).toString().length;
    let firstDigIsCorrect = false;
    let result = true;
    let lastDigit;
    let ctrlDigit;
    let lastControlDigit;
    let firstDigit;

    if (value && !doNotValidate) {
        const len = value.length;
        if (ogrnLengthCheck(isIE, value)) {
            // Проверим контрольную сумму для НЕ иностранных представительств.

            if (helpers.isOnlyZeros(value)) {
                result = false;
            } else {
                // первая цифра
                firstDigit = parseInt(value.charAt(0), 10);

                // контрольное число
                lastDigit = parseInt(value.charAt(len - 1), 10);

                // сумма 1 по 12-ю (14-ю для ИП) цифру
                ctrlDigit = parseInt(value.substr(0, len - 1), 10) % (effectiveLength - DIGITS_TO_CUT);

                // вычисляем остаток от деления на 10, должна равнять контрольному числу
                lastControlDigit = ctrlDigit % CHECKSUM_DIVIDER;

                // в правильном ли диапазоне 1-я цифра
                firstDigIsCorrect = allowsFirstDig.includes(firstDigit);
                if ((lastControlDigit !== lastDigit) || !firstDigIsCorrect) {
                    result = false;
                }
            }

        } else {
            result = false
        }
    }
    return result;
}
