import helpers from './helpers';
const IE_INN_LENGTH = 12;
const ORG_INN_LENGTH = 10;


const WEIGHTS = [3, 7, 2, 4, 10, 3, 5, 9, 4, 6, 8];
const ORG_CONTROL_SUM_INDEX = 9;
const ORG_CHECKSUM_INDEX = 9;
const CONTROL_SUM_FIRST_DIVIDER = 11;
const CONTROL_SUM_SECOND_DIVIDER = 10;
const IE_FIRST_CHECKSUM_INDEX = 10;
const IE_SECOND_CHECKSUM_INDEX = 11;


export default function inn({value, isIE, doNotValidate}) {
   let result = true;
   let length;
   let sum = 0;

   if (value && !doNotValidate) {
      // проверка на длину
      if (typeof isIE !== 'boolean') {
         result = helpers.checkLength([IE_INN_LENGTH, ORG_INN_LENGTH], value);
      } else {
         length = isIE ? IE_INN_LENGTH : ORG_INN_LENGTH;
         result = helpers.checkLength([length], value);
      }

      // только если прошли проверку на длину
      if (result === true) {
         // проверка для ИП
         if (value.length === IE_INN_LENGTH) {
            for (let i = 0, j = 1; i < IE_FIRST_CHECKSUM_INDEX; i++, j++) {
               sum += +value.charAt(i) * WEIGHTS[j];
            }
            sum = (sum % CONTROL_SUM_FIRST_DIVIDER) % CONTROL_SUM_SECOND_DIVIDER;
            if (sum === +value.charAt(IE_FIRST_CHECKSUM_INDEX)) {
               sum = 0;
               for (let i = 0, j = 0; i < IE_SECOND_CHECKSUM_INDEX; i++, j++) {
                  sum += +value.charAt(i) * WEIGHTS[j];
               }
               sum = (sum % CONTROL_SUM_FIRST_DIVIDER) % CONTROL_SUM_SECOND_DIVIDER;
               if (sum !== +value.charAt(IE_SECOND_CHECKSUM_INDEX)) {
                  result = false;
               }
            } else {
               result = false;
            }
         }

         // проверка для организации
         if (value.length === ORG_INN_LENGTH) {
            for (let i = 0, j = 2; i < ORG_CHECKSUM_INDEX; i++, j++) {
               sum += +value.charAt(i) * WEIGHTS[j];
            }
            if ((sum % CONTROL_SUM_FIRST_DIVIDER) % CONTROL_SUM_SECOND_DIVIDER !== +value.charAt(ORG_CONTROL_SUM_INDEX)) {
               result = false;
            }
         }

         // проверка на два нуля в начале
         if (helpers.startsWithZeros(value)) {
            result = false;
         }

         // проверка на нули
         if (helpers.isOnlyZeros(value)) {
            result = false;
         }
      }
   }

   return result;
}
