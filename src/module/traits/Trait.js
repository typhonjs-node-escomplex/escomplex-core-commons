'use strict';

/**
 * Provides a wrapper around a data field which may be a function or other primitive value.
 */
export default class Trait
{
   /**
    * Initializes trait data.
    *
    * @param {*}  data - Data to wrap.
    */
   constructor(data)
   {
      this._data = data;
   }

   /**
    * Returns the typeof data being wrapper.
    *
    * @returns {string}
    */
   get type() { return typeof this._data; }

   /**
    * Returns the value of the given data. If the wrapped data is a function it is invoked with the given `params`
    * otherwise the data is returned directly.
    *
    * @param {*}  params - Provides parameters which are forwarded onto any data stored as a function.
    *
    * @returns {*}
    */
   valueOf(...params)
   {
      if (Array.isArray(this._data))
      {
         return this._data.map((entry) => { return typeof entry === 'function' ? entry(...params) : entry; });
      }

      return typeof this._data === 'function' ? this._data(...params) : this._data;
   }
}