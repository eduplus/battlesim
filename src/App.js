import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';
import Battle from "./Battle";

class App extends Component {

  constructor(props) {
    super(props)
    this.state = {
      log: '',
      attackers: 3,
      defenders: 1,
      stats: null
    }
  }

  onPress = () => {
    console.log('fight!')
    this.setState({ stats: null })
    const battle = new Battle(this.state.attackers, this.state.defenders)
    const { log } = battle.battle()
    this.setState({ log })
  }

  onSimulate = () => {
    console.log('simulate!')
    this.setState({ log: '' })
    const results = []
    for (let i = 0; i < 100000; i++) {
      const battle = new Battle(this.state.attackers, this.state.defenders)
      const { stats } = battle.battle()
      results.push(stats)
    }
    const { attackWin, defendWin, rounds, attackerCasualties, defenderCasualties } = results.reduce((acc, battle) => {
      const res = {
        attackWin: (battle.winner === 'attacker') ? acc.attackWin + 1 : acc.attackWin,
        defendWin: (battle.winner === 'defender') ? acc.defendWin + 1 : acc.defendWin,
        rounds: acc.rounds,
        attackerCasualties: acc.attackerCasualties,
        defenderCasualties: acc.defenderCasualties
      }
      res.rounds[battle.rounds] = (acc.rounds[battle.rounds]) ? acc.rounds[battle.rounds] + 1 : 1
      res.attackerCasualties[battle.attackerCasualties] = (acc.attackerCasualties[battle.attackerCasualties]) ? acc.attackerCasualties[battle.attackerCasualties] + 1 : 1
      res.defenderCasualties[battle.defenderCasualties] = (acc.defenderCasualties[battle.defenderCasualties]) ? acc.defenderCasualties[battle.defenderCasualties] + 1 : 1
      return res
    }, {
      attackWin: 0,
      defendWin: 0,
      rounds: {},
      attackerCasualties: {},
      defenderCasualties: {}
    })
    Object.keys(rounds).map((key) => { rounds[key] = ((rounds[key] / results.length) * 100).toFixed(2) })
    Object.keys(attackerCasualties).map((key) => { attackerCasualties[key] = ((attackerCasualties[key] / results.length) * 100).toFixed(2) })
    Object.keys(defenderCasualties).map((key) => { defenderCasualties[key] = ((defenderCasualties[key] / results.length) * 100).toFixed(2) })
    this.setState({
      stats: {
        wins: { attacker: (attackWin / results.length * 100).toFixed(2), defender: (defendWin / results.length * 100).toFixed(2) },
        rounds,
        attackerCasualties,
        defenderCasualties
      }})
  }

  logStats = () => {
    let log =  `Attacker won ${this.state.stats.wins.attacker}% of the battles\n` +
      `Defender won ${this.state.stats.wins.defender}% of the battles\n`
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

  render() {
    return (
      <div className="App">
        <header className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <h1 className="App-title">Cuzco Battlesim</h1>
        </header>
        <p className="App-intro">
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