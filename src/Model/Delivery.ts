import bitwise from 'bitwise';
import {Bit, Bits} from 'bitwise/types';
import {Pizza} from './Pizza';

export class Delivery {

  public bits: Bits = new Array<Bit>(Pizza.maxIngredients).fill(0);
  private readonly pizza: Pizza[] = [];

  public getPizzaCount(): number {
    return this.pizza.length;
  }

  public getScore(): number {
    this.resetBuffer();
    const ones = this.bits.reduce((score, bit) => score + bit, 0);
    return ones ** 2;
  }

  public addPizza(...pizza: Pizza[]): void {
    for (const p of pizza) {
      if (p.delivery) {
        throw new Error('pizza is already assigned');
      }
      p.delivery = this;
      this.pizza.push(p);
      this.addIngredientsToDelivery(p);
    }
  }

  public resetBuffer(): void {
    this.bits.fill(0);
    for (const pizza of this.pizza) {
      this.addIngredientsToDelivery(pizza);
    }
  }

  public toString(): string {
    return `${this.pizza.length} ${this.pizza.map(p => p.id).join(' ')}`;
  }

  private addIngredientsToDelivery(pizza: Pizza): void {
    this.bits = bitwise.bits.or(this.bits, pizza.bits);
  }
}