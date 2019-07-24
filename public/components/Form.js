import React from 'react';

export class Form extends React.Component {
  state = {
    label: '',
    startDate: '',
    endDate: ''
  };

  render() {
    const { label, startDate, endDate } = this.state;
    return (
      <div className="button-container">
        <input
          type="text"
          placeholder="title"
          onChange={e => this.setState({ label: e.target.value })}
        />
        <input
          type="date"
          onChange={e => this.setState({ startDate: new Date(e.target.value) })}
        />
        <input
          type="date"
          onChange={e => this.setState({ endDate: new Date(e.target.value) })}
        />
        <button
          onClick={e => this.props.addNewEvent({ label, startDate, endDate })}
        >
          {' '}
          submit
        </button>
      </div>
    );
  }
}
