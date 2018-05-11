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
    }
  }

  onPress = () => {

    console.log('fight!')
    const battle = new Battle(this.state.attackers, this.state.defenders)
    const log = battle.battle()
    this.setState({ log: log })

  }

  render() {
    return (
      <div className="App">
        <header className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <h1 className="App-title">Welcome to React</h1>
        </header>
        <p className="App-intro">
          To get started, edit <code>src/App.js</code> and save to reload.
        </p>
        Attackers: <input type="text" value={this.state.attackers} onChange={evt => this.setState({ attackers: evt.target.value })} />
        Defenders: <input type="text" value={this.state.defenders} onChange={evt => this.setState({ defenders: evt.target.value })} />
        <input type="button" className="fight" value="Fight" onClick={this.onPress} />
        <div className="results">
          <p><pre>{this.state.log}</pre></p>
        </div>
      </div>
    );
  }
}

export default App;
