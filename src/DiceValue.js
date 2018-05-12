import React from "react";

export default class DiceValue extends React.Component {
  render() {
    return (
      <React.Fragment>
        {this.props.name}
        <select value={this.props.value} onChange={this.props.onChange}>
          <option value="miss">miss</option>
          <option value="shield">shield</option>
          <option value="hit">hit</option>
          <option value="dhit">dhit</option>
        </select>
      </React.Fragment>
    )
  }
}