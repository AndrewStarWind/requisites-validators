export default {
   /**
    * Проверка на введенные символы
    * @param {String|Number} value
    * @return {Boolean} вернет true если только цифры
    */
   isNumber(value) {
      return /^\d+$/.test(value);
   },

   /**
    * Проверяет равна ли длина заданной
    * @param {Array} lengths - возможные длины
    * @param {String} value - значение
    */
   checkLength(lengths, value) {
      return !value || (value && lengths.includes(value.length));
   },

   /**
    * Проверка на нули
    * @param value
    */
   isOnlyZeros(value) {
      let result = false;

      if (value && !value.replace(/^0+/, '').length) {
         result = true;
      }
      return result;
   },

   /**
    * Проверка на начальные нули
    * @param {string} value
    */
   startsWithZeros(value) {
      let result = false;

      if (value && value.startsWith('00')) {
         result = true;
      }
      return result;
   }
};
