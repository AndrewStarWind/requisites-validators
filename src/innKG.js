import helpers from './helpers';

const INN_LENGTH = 14;
const GENDER_INDEX = 0;
const SUBJECT_CODE_INDEX = 0;
const DAY_START_INDEX = 1;
const DAY_END_INDEX = 3;
const MONTH_START_INDEX = 3;
const MONTH_END_INDEX = 5;
const YEAR_START_INDEX = 5;
const YEAR_END_INDEX = 9;
const ISSUED_BY_INDEX = 9;

// юридическое лицо
const LEGAL_ENTITY = 0;

// нерезидент (юридическое лицо)
const NON_RESIDENT = 3;

// филиал, представительство иностранной организации
const FOREIGN_BRANCH = 4;

// дипломатическое представительство
const DIPLOMATIC_AGENCY = 5;

// ИНН Социальным фондом Кыргызской Республики
const ISSUED_BY_SOCIAL_FUND = 0;

// присвоения номера налоговой службой
const ISSUED_BY_TAX_SERVICE = 1;

const FEMALE = 1;
const MALE = 2;

const KG_CONSTANTS = {

   // признак субъекта
   CODES: [LEGAL_ENTITY, NON_RESIDENT, FOREIGN_BRANCH, DIPLOMATIC_AGENCY],

   // кем присвоен
   ISSUED_BY: [ISSUED_BY_SOCIAL_FUND, ISSUED_BY_TAX_SERVICE],

   // пол
   GENDER: [FEMALE, MALE]
};

const _private = {

   /**
    * Проверка правильности даты
    * @param {string} value - значение
    * @return {boolean}
    */
   checkDate(value) {
      const regDay = value.substring(DAY_START_INDEX, DAY_END_INDEX);
      const regMonth = value.substring(MONTH_START_INDEX, MONTH_END_INDEX);
      const regYear = value.substring(YEAR_START_INDEX, YEAR_END_INDEX);

      return !!Date.parse(regYear + '/' + regMonth + '/' + regDay);
   },

   /**
    * Проверка на корректность ИНН для ИП киргизии
    * @param {string} value - значение
    * @return {string|Boolean}
    */
   ieKG(value) {
      const gender = +value.charAt(GENDER_INDEX);
      let result = true;

      // шаг 2: проверяем код субъекта, корректность даты и идентифкатор
      if (!KG_CONSTANTS.GENDER.includes(gender) || !_private.checkDate(value)) {
         result = false;
      }
      return result;
   },

   /**
    * Проверка на корректность ИНН для организации киргизии
    * @param {string} value - значение
    * @return {string|boolean}
    */
   orgKG(value) {
      const subjectCode = +value.charAt(SUBJECT_CODE_INDEX);
      const issuedBy = +value.charAt(ISSUED_BY_INDEX);
      let result = true;

      // шаг 2: проверяем код субъекта, корректность даты и идентифкатор
      if (!KG_CONSTANTS.CODES.includes(subjectCode) ||
         !_private.checkDate(value) ||
         !KG_CONSTANTS.ISSUED_BY.includes(issuedBy)) {
         result = false;
      }
      return result;
   }
};

export default function innKG({value, isIE, doNotValidate}) {
   if (value && !doNotValidate) {
      if (!helpers.checkLength([INN_LENGTH], value)) {
         return false;
      }
      if (helpers.isOnlyZeros(value)) {
         return false;
      }
      if (typeof isIE === 'boolean') {
         return isIE ? _private.ieKG(value) : _private.orgKG(value);
      }
      return _private.ieKG(value) === true || _private.orgKG(value) === true;
   }
   return true;
}
