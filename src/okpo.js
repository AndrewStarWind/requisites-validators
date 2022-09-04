import helpers from './helpers';

const IE_OKPO_LENGTH = 10;

// последние две цифры - номера хозяйства
const IE_OKPO_LENGTH_WITH_ID = 12;
const ORG_OKPO_LENGTH = 8;
const SEP_DEP_OKPO_LENGTH = 14;
const CHECKSUM_DIVIDER = 11;
const BAD_CHECKSUM = 10;
const WEIGHT_DIVIDER = 11;
const weightsStartValues = {
   FIRST: 1,
   SECOND: 3
};

/**
 * Проверка на контрольую сумму ОКПО
 * @param {string} value
 * @param {number} start
 * @param {number} period
 * @return {number}
 */
const okpoCheckSum = (value, start) => {
   let sum = 0;
   let weight = start;
   const len = value.length;

   for (let i = 0; i < len - 1; i++, weight++) {
      weight %= WEIGHT_DIVIDER;
      if (weight === 0) {
         weight++;
      }
      sum += parseInt(value.charAt(i), 10) * weight;
   }
   return sum % CHECKSUM_DIVIDER;
};

/**
 *
 * @param value
 * @param isIE
 */
const checkOKPOLength = (value, isIE) => {
   let result = true;

   if (typeof isIE !== 'boolean') {
      if (!helpers.checkLength([ORG_OKPO_LENGTH, IE_OKPO_LENGTH, SEP_DEP_OKPO_LENGTH, IE_OKPO_LENGTH_WITH_ID], value)) {
         result = false;
      }
   } else {
      if (isIE && !helpers.checkLength([IE_OKPO_LENGTH, IE_OKPO_LENGTH_WITH_ID], value)) {
         result = false;
      }
      if (!isIE && !helpers.checkLength([ORG_OKPO_LENGTH, SEP_DEP_OKPO_LENGTH], value)) {
         // Комментарий отдела форм отчётности - от 8 до 14 знаков
         result = false;
      }
   }
   return result;
};


export default function okpo({value, isIE, doNotValidate}) {
   let val = value;
   let result = true;
   let ctrlDig;
   let lastDig;
   let len;

   if (val && !doNotValidate) {
      result = checkOKPOLength(val, isIE);
      if (result === true) {
         len = val.length;
         if (len === SEP_DEP_OKPO_LENGTH) {
            // Для обособленных подразделений контрольную сумму считаем по первым 8
            val = value.substr(0, ORG_OKPO_LENGTH);
            len = ORG_OKPO_LENGTH;
         }

         if (len === IE_OKPO_LENGTH_WITH_ID) {
            // последние две цифры - номера хозяйства
            val = value.substr(0, IE_OKPO_LENGTH);
            len = IE_OKPO_LENGTH;
         }

         // контрольное число
         lastDig = parseInt(val.charAt(len - 1), 10);

         // считаем контрольную сумму
         ctrlDig = okpoCheckSum(val, weightsStartValues.FIRST);

         // если получили 10, то считаем иначе, с другими весами
         if (ctrlDig === BAD_CHECKSUM) {
            ctrlDig = okpoCheckSum(val, weightsStartValues.SECOND);
         }

         // если и с другими весами 10, то принимается равной 0
         if (ctrlDig === BAD_CHECKSUM) {
            ctrlDig = 0;
         }

         // если контрольная сумма не равна контрольному числу, то ОКПО невалиден
         if (ctrlDig !== lastDig) {
            result = false;
         }
      }
   }
   return result;
}
