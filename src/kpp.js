const KPP_LENGTH = 9;
const TYPE_CODE_INDEX = 4;
const TYPE_CODE_LENGTH = 2;
const isKpp = (value) => ((/^(\d{9})?$/).test(value))
   || ((/^(\d{4}[a-zA-Z0-9]{2}\d{3})?$/).test(value));

export default function kpp({value, isBranch, doNotValidate}) {
   let typeDigits;
   let result = true;

   if (value && !doNotValidate) {
      // параметр не обязательный, который игнорируется если передан ИНН и это инстранное представительство
      if (typeof isBranch === 'boolean') {
         if (isBranch) {
            // для филиала валидны все те, что не валидны для организации + тип с 77 в 5 и 6 символах
            if (helpers.checkLength([KPP_LENGTH], value) && helpers.isNumber(value) && isKpp(value)) {
               typeDigits = value.substr(TYPE_CODE_INDEX, TYPE_CODE_LENGTH);
               result = !(/^(01|50)?$/).test(typeDigits);
            } else {
               result = false;
            }
         } else {
            if (helpers.checkLength([KPP_LENGTH], value) && isKpp(value)) {
               typeDigits = value.substr(TYPE_CODE_INDEX, TYPE_CODE_LENGTH);
               result = (/^([a-zA-Z]{2}|([a-zA-Z][0-9])|([0-9][a-zA-Z])|01|50|51|35|77|88|91|92)?$/).test(typeDigits);
            } else {
               result = false;
            }
         }
      } else {
         // если не указали филиал или нет, просто проверяем на правильность
         result = isKpp(value);
      }

      // проверка на ведущие нули, не может быть более одного
      if (value.startsWith('00')) {
         result = false;
      }

      // проверка на нули
      if (helpers.isOnlyZeros(value)) {
         result = false;
      }
   }

   return result;
}
