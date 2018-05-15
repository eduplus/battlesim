import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';
import Battle from "./Battle";
import DiceValue from "./DiceValue";

class App extends Component {

  constructor(props) {
    super(props)
    this.state = {
      log: '',
      attackers: 3,
      defenders: 1,
      stats: null,
      dice: {
        attacker: {
          1: 'shield',
          2: 'miss',
          3: 'miss',
          4: 'miss',
          5: 'hit',
          6: 'dhit'
        },
        defender: {
          1: 'shield',
          2: 'shield',
          3: 'miss',
          4: 'miss',
          5: 'hit',
          6: 'dhit'
        }
      }
    }
  }

  onPress = () => {
    console.log('fight!')
    this.setState({ stats: null })
    const battle = new Battle(this.state.attackers, this.state.defenders, this.state.dice)
    const { log } = battle.battle()
    this.setState({ log })
  }

  onSimulate = () => {
    console.log('simulate!')
    this.setState({ log: '' })
    const results = []
    for (let i = 0; i < 100000; i++) {
      const battle = new Battle(this.state.attackers, this.state.defenders, this.state.dice)
      const { stats } = battle.battle()
      results.push(stats)
    }
    const { attackWin, defendWin, tieWin, rounds, attackerCasualties, defenderCasualties, attackWinCasualties, defendWinCasualties } = results.reduce((acc, battle) => {
      const res = {
        attackWin: (battle.winner === 'attacker') ? acc.attackWin + 1 : acc.attackWin,
        defendWin: (battle.winner === 'defender') ? acc.defendWin + 1 : acc.defendWin,
        tieWin: (battle.winner === 'tie') ? acc.tieWin + 1 : acc.tieWin,
        rounds: acc.rounds,
        attackerCasualties: acc.attackerCasualties,
        defenderCasualties: acc.defenderCasualties,
        attackWinCasualties: acc.attackWinCasualties,
        defendWinCasualties: acc.defendWinCasualties
      }
      res.rounds[battle.rounds] = (acc.rounds[battle.rounds]) ? acc.rounds[battle.rounds] + 1 : 1
      res.attackerCasualties[battle.attackerCasualties] = (acc.attackerCasualties[battle.attackerCasualties]) ? acc.attackerCasualties[battle.attackerCasualties] + 1 : 1
      res.defenderCasualties[battle.defenderCasualties] = (acc.defenderCasualties[battle.defenderCasualties]) ? acc.defenderCasualties[battle.defenderCasualties] + 1 : 1
      if (battle.winner === 'attacker') {
        res.attackWinCasualties[battle.attackerCasualties] = (acc.attackWinCasualties[battle.attackerCasualties]) ? acc.attackWinCasualties[battle.attackerCasualties] + 1 : 1
      } else if (battle.winner === 'defender') {
        res.defendWinCasualties[battle.defenderCasualties] = (acc.defendWinCasualties[battle.defenderCasualties]) ? acc.defendWinCasualties[battle.defenderCasualties] + 1 : 1
      }
      return res
    }, {
      attackWin: 0,
      defendWin: 0,
      tieWin: 0,
      rounds: {},
      attackWinCasualties: {},
      defendWinCasualties: {},
      attackerCasualties: {},
      defenderCasualties: {}
    })
    Object.keys(rounds).map((key) => { rounds[key] = ((rounds[key] / results.length) * 100).toFixed(2) })
    Object.keys(attackerCasualties).map((key) => { attackerCasualties[key] = ((attackerCasualties[key] / results.length) * 100).toFixed(2) })
    Object.keys(defenderCasualties).map((key) => { defenderCasualties[key] = ((defenderCasualties[key] / results.length) * 100).toFixed(2) })
    this.setState({
      stats: {
        battles: results.length,
        wins: { attacker: attackWin, defender: defendWin, tie: (tieWin / results.length * 100).toFixed(2) },
        rounds,
        attackerCasualties,
        defenderCasualties,
        attackWinCasualties,
        defendWinCasualties
      }})
  }

  logStats = () => {
    const { attackWinCasualties, defendWinCasualties, battles } = this.state.stats
    let log =  `Attacker won ${(this.state.stats.wins.attacker / battles * 100).toFixed(2)}% of the battles\n`
    Object.keys(attackWinCasualties).forEach((key) => {
      log += `(with ${key} casualties: ${((attackWinCasualties[key] / this.state.stats.wins.attacker) * 100).toFixed(2)}%)\n`
    })
    log += `Defender won ${(this.state.stats.wins.defender / battles * 100).toFixed(2)}% of the battles\n`
    Object.keys(defendWinCasualties).forEach((key) => {
      log += `(with ${key} casualties:  ${((defendWinCasualties[key] / this.state.stats.wins.defender) * 100).toFixed(2)}%)\n`
    })
    log += `Ties (mutual destructions) ${this.state.stats.wins.tie}% of the battles\n`
    log += `------------------ ROUNDS: ------------------------\n`
    Object.keys(this.state.stats.rounds).forEach((key) => {
      log += `rounds ${key}: ${this.state.stats.rounds[key]} %\n`
    })
    log += `------------------ ATTACKER CASUALTIES: ------------------------\n`
    Object.keys(this.state.stats.attackerCasualties).forEach((key) => {
      log += `casualties ${key}: ${this.state.stats.attackerCasualties[key]} %\n`
    })
    log += `------------------ DEFENDER CASUALTIES: ------------------------\n`
    Object.keys(this.state.stats.defenderCasualties).forEach((key) => {
      log += `casualties ${key}: ${this.state.stats.defenderCasualties[key]} %\n`
    })
    return log
  }

  onDiceChange = (dice, type, value) => {
    this.setState((prevState) => ({
      dice: {
        ...prevState.dice,
        [type]: {
          ...prevState.dice[type],
          [dice]: value
        }
      }
    }))
  }

  render() {
    return (
      <div className="App">
        <header className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <h1 className="App-title">Cuzco Battlesim</h1>
        </header>
        <p className="App-intro">
          Attacker:
          <DiceValue name={'1'} value={this.state.dice.attacker[1]} onChange={(event) => this.onDiceChange(1, 'attacker', event.target.value)}/>
          <DiceValue name={'2'} value={this.state.dice.attacker[2]} onChange={(event) => this.onDiceChange(2, 'attacker', event.target.value)}/>
          <DiceValue name={'3'} value={this.state.dice.attacker[3]} onChange={(event) => this.onDiceChange(3, 'attacker', event.target.value)}/>
          <DiceValue name={'4'} value={this.state.dice.attacker[4]} onChange={(event) => this.onDiceChange(4, 'attacker', event.target.value)}/>
          <DiceValue name={'5'} value={this.state.dice.attacker[5]} onChange={(event) => this.onDiceChange(5, 'attacker', event.target.value)}/>
          <DiceValue name={'6'} value={this.state.dice.attacker[6]} onChange={(event) => this.onDiceChange(6, 'attacker', event.target.value)}/>
          <br />
          Defender:
          <DiceValue name={'1'} value={this.state.dice.defender[1]} onChange={(event) => this.onDiceChange(1, 'defender', event.target.value)}/>
          <DiceValue name={'2'} value={this.state.dice.defender[2]} onChange={(event) => this.onDiceChange(2, 'defender', event.target.value)}/>
          <DiceValue name={'3'} value={this.state.dice.defender[3]} onChange={(event) => this.onDiceChange(3, 'defender', event.target.value)}/>
          <DiceValue name={'4'} value={this.state.dice.defender[4]} onChange={(event) => this.onDiceChange(4, 'defender', event.target.value)}/>
          <DiceValue name={'5'} value={this.state.dice.defender[5]} onChange={(event) => this.onDiceChange(5, 'defender', event.target.value)}/>
          <DiceValue name={'6'} value={this.state.dice.defender[6]} onChange={(event) => this.onDiceChange(6, 'defender', event.target.value)}/>
        </p>
        Attackers: <input type="text" value={this.state.attackers} onChange={evt => this.setState({ attackers: evt.target.value })} />
        Defenders: <input type="text" value={this.state.defenders} onChange={evt => this.setState({ defenders: evt.target.value })} />
        <input type="button" className="fight" value="Fight" onClick={this.onPress} />
        <input type="button" className="simulate" value="Simulate" onClick={this.onSimulate} />
        <div className="results">
          <pre>{this.state.log}</pre>
        </div>
        {this.state.stats &&
          <div><pre>{this.logStats()}</pre></div>
        }
      </div>
    );
  }
}

export default App;
