'use strict';

/**
 * Provides all Halstead metric data / parameters.
 * @see https://en.wikipedia.org/wiki/Halstead_complexity_measures
 */
export default class HalsteadData
{
   /**
    * Initializes the default Halstead data.
    */
   constructor()
   {
      /**
       * Measures an estimate for the number of potential errors.
       * @type {number}
       */
      this.bugs = 0;

      /**
       * Measures the difficulty of the program to write or understand.
       * @type {number}
       */
      this.difficulty = 0;

      /**
       * Measures the maintenance effort of the program.
       * @type {number}
       */
      this.effort = 0;

      /**
       * Defines the number of operands and operators.
       * @type {number}
       */
      this.length = 0;

      /**
       * Measures potential coding time.
       * @type {number}
       */
      this.time = 0;

      /**
       * Defines the unique number of operands and operators.
       * @type {number}
       */
      this.vocabulary = 0;

      /**
       * Measures how much information a reader of the code potential has to absorb to understand its meaning.
       * @type {number}
       */
      this.volume = 0;

      /**
       * In general an operand participates in actions associated with operators. A distinct and total count is provided
       * with all identifiers.
       * @type {{distinct: number, total: number, identifiers: Array}}
       */
      this.operands = { distinct: 0, total: 0, identifiers: [] };

      /**
       * In general an operator carries out an action. A distinct and total count is provided with all identifiers.
       * @type {{distinct: number, total: number, identifiers: Array}}
       */
      this.operators = { distinct: 0, total: 0, identifiers: [] };
   }

   /**
    * Resets the state of all Halstead data metrics without removing any operand or operator data.
    */
   reset()
   {
      this.bugs = this.difficulty = this.effort = this.length = this.time = this.vocabulary = this.volume = 0;
   }
}