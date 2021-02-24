import bitwise from 'bitwise';
import {Bit, Bits} from 'bitwise/types';
import {onesReducer} from '../Tools/Tools';
import {Delivery} from './Delivery';

export class Pizza {

  public static maxIngredients: number;
  public bits: Bits;
  public delivery: Delivery;

  constructor(
    public readonly id: number,
    public readonly ingredients: string[],
  ) {
  }

  public ingredientsToBitsArray(ingredientsMap: Map<string, number>): void {
    Pizza.maxIngredients = ingredientsMap.size;
    this.bits = new Array<Bit>(ingredientsMap.size).fill(0);
    this.ingredients.forEach(ingredient => {
      const ingredientIndex = ingredientsMap.get(ingredient);
      this.bits[ingredientIndex] = 1;
    });
  }

  public compareTo(delivery: Delivery): number;
  public compareTo(pizza: Pizza): number;
  public compareTo(bits: Bits): number;
  public compareTo(bits: Delivery | Pizza | Bits): number {
    const a = this.bits;
    const b = bits instanceof Delivery ? bits.bits : bits instanceof Pizza ? bits.bits : bits;
    const notA = bitwise.bits.not(a);
    const notB = bitwise.bits.not(b);
    const notAOnes = notA.reduce(onesReducer, 0);
    const notBOnes = notB.reduce(onesReducer, 0);
    const potentialAB = notAOnes === 0 ? 1 : bitwise.bits.and(notA, b).reduce(onesReducer, 0) / notAOnes;
    const potentialBA = notBOnes === 0 ? 1 : bitwise.bits.and(notB, a).reduce(onesReducer, 0) / notBOnes;
    const aUnionB = bitwise.bits.or(a, b).reduce(onesReducer, 0);
    const aIntersectB = bitwise.bits.and(a, b).reduce(onesReducer, 0);
    // console.log(potentialAB, potentialBA, aIntersectB, aUnionB);
    // console.log(Math.max(potentialAB, potentialBA), (1 - (aIntersectB / Pizza.maxIngredients)), (aUnionB / Pizza.maxIngredients));
    // console.log(Math.max(potentialAB, potentialBA) * (1 - (aIntersectB / Pizza.maxIngredients)) * (aUnionB / Pizza.maxIngredients));
    return Math.max(potentialAB, potentialBA) * (1 - (aIntersectB / Pizza.maxIngredients)) * (aUnionB / Pizza.maxIngredients);
  }
}