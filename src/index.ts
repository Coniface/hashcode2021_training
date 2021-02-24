import * as assert from 'assert';
import * as fs from 'fs';
import * as path from 'path';
import {Logger} from './Logger/Logger';
import {Delivery} from './Model/Delivery';
import {Pizza} from './Model/Pizza';
import {computeScore, onesReducer} from './Tools/Tools';

/**
 * PARAMS
 */

const INPUT = process.env.INPUT || 'a';
const MAX_OPTI = 0.95;

/**
 * INPUT
 */

const inputPath = path.resolve(__dirname, 'input');
const inputFiles = fs.readdirSync(inputPath);
const inputFile = inputFiles.find(filename => filename.startsWith(INPUT));
Logger.info('Input file', inputFile);

const input = fs.readFileSync(path.resolve(inputPath, inputFile)).toString().trim();
const [firstLine, ...pizzaLines] = input.split('\n');
const [pizzaCount, binomeCount, trinomeCount, quadrinomeCount] = firstLine.split(' ').map(n => parseInt(n));
assert(pizzaLines.length === pizzaCount);

const pizza: Pizza[] = [];
const ingredientsMap = new Map<string, number>();
for (const line of pizzaLines) {
  const [ingredientsCount, ...ingredientsLines] = line.split(' ');
  assert(ingredientsLines.length === parseInt(ingredientsCount), `Ingredients count mismatch (${ingredientsLines.length} < ${ingredientsCount})`);
  for (const ingredient of ingredientsLines) {
    !ingredientsMap.has(ingredient) && ingredientsMap.set(ingredient, ingredientsMap.size);
  }
  pizza.push(new Pizza(pizza.length, ingredientsLines));
}

Logger.info('Input details', {
  pizzaCount,
  binomeCount,
  trinomeCount,
  quadrinomeCount,
  ingredientsCount: ingredientsMap.size,
});

pizza.forEach(p => p.ingredientsToBitsArray(ingredientsMap));
pizza.sort((a, b) => b.bits.reduce(onesReducer, 0) - a.bits.reduce(onesReducer, 0));

Logger.info('Pizza buffered successfully');

/**
 * SOLUTION
 */
const remainingPizza = pizza.slice();
const deliveries: Delivery[] = [];
for (let i = 0; remainingPizza.length >= 2 && i < binomeCount; i++) {
  const pizza1 = remainingPizza.pop();
  let maxScore = -Infinity;
  let index: number;
  for (let j = 0, pizza2; pizza2 = remainingPizza[j], j < remainingPizza.length; j++) {
    const score = pizza2.compareTo(pizza1);
    if (index === undefined || score > maxScore) {
      maxScore = score;
      index = j;
      if (score > MAX_OPTI) {
        break;
      }
    }
  }
  const bestPizza = remainingPizza.splice(index, 1)[0];
  const delivery = new Delivery();
  delivery.addPizza(pizza1, bestPizza);
  deliveries.push(delivery);
}
deliveries.sort((a, b) => a.getScore() - b.getScore());
Logger.debug(`Completed binomes deliveries (${deliveries.filter(d => d.getPizzaCount() === 2).length}/${binomeCount}). ${remainingPizza.length} remaining pizza`);
for (let i = 0; remainingPizza.length >= 3 && i < trinomeCount; i++) {
  const delivery = new Delivery();
  const pizza1 = remainingPizza.pop();
  let maxScore = -Infinity;
  let index: number;
  for (let j = 0, pizza2; pizza2 = remainingPizza[j], j < remainingPizza.length; j++) {
    const score = pizza2.compareTo(pizza1);
    if (index === undefined || score > maxScore) {
      maxScore = score;
      index = j;
      if (score > MAX_OPTI) {
        break;
      }
    }
  }
  let bestPizza = remainingPizza.splice(index, 1)[0];
  delivery.addPizza(pizza1, bestPizza);
  maxScore = -Infinity;
  for (let j = 0, pizza2; pizza2 = remainingPizza[j], j < remainingPizza.length; j++) {
    const score = pizza2.compareTo(delivery);
    if (index === undefined || score > maxScore) {
      maxScore = score;
      index = j;
      if (score > MAX_OPTI) {
        break;
      }
    }
  }
  bestPizza = remainingPizza.splice(index, 1)[0];
  delivery.addPizza(bestPizza);
  deliveries.push(delivery);
}
deliveries.sort((a, b) => a.getScore() - b.getScore());
Logger.debug(`Completed trinomes deliveries (${deliveries.filter(d => d.getPizzaCount() === 3).length}/${trinomeCount}). ${remainingPizza.length} remaining pizza`);
for (let i = 0; remainingPizza.length >= 4 && i < quadrinomeCount; i++) {
  const delivery = new Delivery();
  const pizza1 = remainingPizza.pop();
  let maxScore = -Infinity;
  let index: number;
  for (let j = 0, pizza2; pizza2 = remainingPizza[j], j < remainingPizza.length; j++) {
    const score = pizza2.compareTo(pizza1);
    if (index === undefined || score > maxScore) {
      maxScore = score;
      index = j;
      if (score > MAX_OPTI) {
        break;
      }
    }
  }
  let bestPizza = remainingPizza.splice(index, 1)[0];
  delivery.addPizza(pizza1, bestPizza);
  maxScore = -Infinity;
  for (let j = 0, pizza2; pizza2 = remainingPizza[j], j < remainingPizza.length; j++) {
    const score = pizza2.compareTo(delivery);
    if (index === undefined || score > maxScore) {
      maxScore = score;
      index = j;
      if (score > MAX_OPTI) {
        break;
      }
    }
  }
  bestPizza = remainingPizza.splice(index, 1)[0];
  delivery.addPizza(bestPizza);
  maxScore = -Infinity;
  for (let j = 0, pizza2; pizza2 = remainingPizza[j], j < remainingPizza.length; j++) {
    const score = pizza2.compareTo(delivery);
    if (index === undefined || score > maxScore) {
      maxScore = score;
      index = j;
      if (score > MAX_OPTI) {
        break;
      }
    }
  }
  bestPizza = remainingPizza.splice(index, 1)[0];
  delivery.addPizza(bestPizza);
  deliveries.push(delivery);
}
deliveries.sort((a, b) => a.getScore() - b.getScore());
Logger.debug(`Completed quadrinomes deliveries (${deliveries.filter(d => d.getPizzaCount() === 4).length}/${quadrinomeCount}). ${remainingPizza.length} remaining pizza`);
const counts = [binomeCount, trinomeCount, quadrinomeCount];
for (const remainingPizz of remainingPizza) {
  const deliveriesCounts = [
    deliveries.filter(d => d.getPizzaCount() === 2).length,
    deliveries.filter(d => d.getPizzaCount() === 3).length,
    deliveries.filter(d => d.getPizzaCount() === 4).length,
  ];
  const remainingDeliveries = deliveries.filter(
    d => d.getPizzaCount() < 4
      && deliveriesCounts[d.getPizzaCount() - 1] > 0
      && deliveriesCounts[d.getPizzaCount() - 1] < counts[d.getPizzaCount() - 1],
  );
  if (remainingDeliveries.length === 0) {
    break;
  }
  let maxScore = -Infinity;
  let index: number;
  for (let j = 0, remainingDelivery; remainingDelivery = remainingDeliveries[j], j < remainingDeliveries.length; j++) {
    const score = remainingPizz.compareTo(remainingDelivery);
    if (index === undefined || score > maxScore) {
      maxScore = score;
      index = j;
      if (score > MAX_OPTI) {
        break;
      }
    }
  }
  const bestDelivery = remainingDeliveries[index];
  bestDelivery?.addPizza(remainingPizz);
}
Logger.debug('Completed remaining pizz', remainingPizza.length, deliveries.length);

/**
 * SCORING
 */
const score = computeScore(deliveries);
Logger.info('Score', score);

/**
 * OUTPUT
 */
const outputPath = path.resolve(__dirname, 'output');
const outputFile = path.resolve(outputPath, `${path.parse(inputFile).name}_${new Date().getTime()}`);
const output: string[] = [
  deliveries.length.toString(),
  ...deliveries.map(delivery => delivery.toString()),
];
fs.writeFileSync(outputFile, output.join('\n'));
