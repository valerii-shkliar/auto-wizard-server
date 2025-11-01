const START_WITH_NUMBER = 1000;
let currentOrderNumber = START_WITH_NUMBER;

export default function test() {
  if (currentOrderNumber === START_WITH_NUMBER) {
    return currentOrderNumber++;
  }

  return currentOrderNumber++;
}
