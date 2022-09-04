import helpers from './helpers';

const ALPHABET = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ';
const ALPHABET_FOR_SECOND_LETTER = 'ABCEHKMOPT';

// веса разрядов УНП
const WEIGHTS = [29, 23, 19, 17, 13, 7, 5, 3];
const UNP_LENGTH = 9;
const CONTROL_DIGIT_INDEX = 8;
const BAD_CHECKSUM = 10;
const CHECKSUM_DIVIDER = 11;
const MAX_NUMBER = 9;

const unpControlSumCheck = (value) => {
   // последняя цифра - контрольная суума
   const controlDigit = parseInt(value.charAt(CONTROL_DIGIT_INDEX), 10);
   let controlSum = 0;
   let result = false;
   let currentSymbol;

   for (let index = 0; index < value.length - 1; index++) {
      // вычисляем численное значение символа в разряде
      currentSymbol = ALPHABET.indexOf(value.charAt(index));

      // если это буква
      if (currentSymbol > MAX_NUMBER) {
         // второй символ
         if (index === 1) {
            // численное значение для второго разряда
            currentSymbol = ALPHABET_FOR_SECOND_LETTER.indexOf(value.charAt(index));

            // со второго символа букв быть не может
         } else if (index > 1) {
            // если буква не в первом и втором разряде, то УНП невалидный
            controlSum = false;
            break;
         }
      }
      controlSum += currentSymbol * WEIGHTS[index];
   }
   if (controlSum !== false) {
      // контрольная сумма - остаток от деления на 11
      controlSum %= CHECKSUM_DIVIDER;

      // если контрольная сумма равна 10, то УНП невалидный
      result = controlSum !== BAD_CHECKSUM && controlSum === controlDigit;
   }
   return result;
};


export default function unp({value, doNotValidate}) {
   let unpRes = true;

   if (value && !doNotValidate) {
      if (!helpers.checkLength([UNP_LENGTH], value)) {
         return false;
      }
       if (helpers.isOnlyZeros(value)) {
         return false;
      }
      return unpControlSumCheck(value);
   }
   return unpRes;
}
