export default class Dice {

  constructor(values) {
    this.values = values
  }

  roll() {
    const number = Math.floor(Math.random() * 6) + 1
    return this.values[number]
  }

}