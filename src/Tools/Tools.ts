import {Bit} from 'bitwise/types';
import {Delivery} from '../Model/Delivery';

export const zerosReducer = (ones: number, bit: Bit) => ones + Number(bit === 0);
export const onesReducer = (ones: number, bit: Bit) => ones + Number(bit === 1);

export function computeScore(deliveries: Delivery[]): number {
  return deliveries.reduce((score, delivery) => score + delivery.getScore(), 0);
}

export function getDeliveriesCount(deliveries: Delivery[], size: number): number {
  return deliveries.filter(d => d.getPizzaCount() === size).length;
}

export function peekFirstMatchingDelivery(deliveries: Delivery[], size: number): Delivery | undefined {
  for (const delivery of deliveries) {
    if (delivery.getPizzaCount() === size) {
      return delivery;
    }
  }
}

export function popFirstMatchingDelivery(deliveries: Delivery[], size: number): Delivery | undefined {
  let delivery: Delivery;
  for (let i = 0; delivery = deliveries[i], i < deliveries.length; i++) {
    if (delivery.getPizzaCount() === size) {
      deliveries.splice(i, 1);
      return delivery;
    }
  }
}