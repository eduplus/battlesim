import Dice from "./Dice";

export default class Battle {

  constructor(attackers, defenders, diceValues) {
    this.initialAttackers = parseInt(attackers)
    this.initialDefenders = parseInt(defenders)
    this.attackers = parseInt(attackers)
    this.defenders = parseInt(defenders)
    this.battleLog = ''
    this.diceValues = diceValues
  }

  battle() {
    let battleRound = 0
    this.log(`Battle initiated with ${this.attackers} attacker(s) and ${this.defenders} defender(s)`)
   do {
      battleRound++
      this.log('------ Battle round: ' + battleRound)
      this.fightRound()
   } while ((this.attackers > 0 && this.defenders > 0) || battleRound > 50)
    return {
      log: this.battleLog,
      stats: {
        rounds: battleRound,
        winner: (this.attackers > 0) ? 'attacker' : 'defender',
        attackerCasualties: (this.initialAttackers - this.attackers > 0) ? this.initialAttackers - this.attackers : 0,
        defenderCasualties: (this.initialDefenders - this.defenders > 0) ? this.initialDefenders - this.defenders : 0
      }
    }
  }

  fightRound() {
    const attackerResults = this.getRoundResult(this.attackers, 'attacker')
    const defenderResults = this.getRoundResult(this.defenders + 1, 'defender')
    this.log('results for attacker: ')
    this.getLogForFightResult(attackerResults)
    this.log('results for defender: ')
    this.getLogForFightResult(defenderResults)
    const casualties = this.calculateCasualties(attackerResults, defenderResults)
    this.attackers = (this.attackers - casualties.attacker > 0) ? this.attackers - casualties.attacker : 0
    this.defenders = (this.defenders - casualties.defender > 0) ? this.defenders - casualties.defender : 0
    this.log('attacker casualties: ' + casualties.attacker + ' - attackers left: ' + this.attackers)
    this.log('defender casualties: ' + casualties.defender + ' - defenders left: ' + this.defenders)
  }

  getRoundResult(count, type) {
    const results = {
      dhit: 0,
      hit: 0,
      miss: 0,
      shield: 0
    }
    const dice = new Dice(this.diceValues[type])
    for (let i = 0; i < count; i++) {
      const roll = dice.roll()
      results[roll] = results[roll] + 1
    }
    return results
  }

  calculateCasualties(attackerResults, defenderResults) {
    const casualties = {
      attacker: defenderResults.dhit,
      defender: attackerResults.dhit
    }
    if (defenderResults.hit > attackerResults.shield) {
      casualties.attacker += (defenderResults.hit - attackerResults.shield)
    }
    if (attackerResults.hit > defenderResults.shield) {
      casualties.defender += (attackerResults.hit - defenderResults.shield)
    }
    return casualties
  }

  log(string) {
    this.battleLog += string + '\n'
  }

  getLogForFightResult(results) {
    Object.keys(results).forEach((key) => { this.log(`${key}: ${results[key]}`) })
  }
}