import helpers from './helpers';

const SNILS_LENGTH = 11;
const CHECKSUM_FIRST_DIVIDER = 101;
const CONTROL_DIGITS_DIVIDER = 100;
const VALUE_LAST_INDEX = 9;

/**
 * Проверка контрольной суммы СНИЛС
 * @param {string} inputValue - поле ввода
 */
const checkSnils = (inputValue) => {

   // Получим контрольные цифры
   const lastDigs = parseInt(inputValue, 10) % CONTROL_DIGITS_DIVIDER;

   // Считаем контрольную сумму ( сумма произведений цифры на( 10 - (позиция, на которой она стоит) ) )
   const snilsNum = inputValue.substr(0, VALUE_LAST_INDEX);
   let ctrlDigs = 0;

   for (let i = 1, j = VALUE_LAST_INDEX; i <= VALUE_LAST_INDEX; i++, j--) {
      ctrlDigs += parseInt(snilsNum.substr(i - 1, 1), 10) * j;
   }

   // Посчитанную контрольную сумму надо взять по модулю 101 и после этого
   // по модулю 100( контрольная сумма для 100 должна быть 00 )
   ctrlDigs = (ctrlDigs % CHECKSUM_FIRST_DIVIDER) % CONTROL_DIGITS_DIVIDER;
   return ctrlDigs === lastDigs;
};


export default function snils({ value, doNotValidate }) {
   // удалим все разделители из поля ввода
   const inputValue = (value || '').replace(/[\-\s]/g, '');

   // проверка на пустые значения или передан флаг отмены валидации
   if (!inputValue || inputValue === '' || doNotValidate) {
      return true;
   }

   // Проверим длину входных данных и их корректность (цифры)
   if (!helpers.checkLength([SNILS_LENGTH], inputValue) || !helpers.isNumber(inputValue)) {
      return false;
   }

   // проверка на нули
   if (helpers.isOnlyZeros(inputValue)) {
      return false;
   }
   return checkSnils(inputValue);
}
