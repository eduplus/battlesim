export default class Dice {

  constructor(type) {
    this.type = type
  }

  roll() {
    const number = Math.floor(Math.random() * 6) + 1
    const result = this.mapNumberToResult(number)
    return result
  }

  mapNumberToResult(number) {
    switch (number) {
      case 1: {
        return 'shield'
      }
      case 2: {
        return (this.type === 'defender') ? 'shield' : 'miss'
      }
      case 3:
      case 4: {
        return 'miss'
      }
      case 5: {
        return 'hit'
      }
      case 6: {
        return 'dhit'
      }
      default:
        return 'miss'
    }
  }
}