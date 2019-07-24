import React from 'react';

export class Form extends React.Component {
  state = {
    label: '',
    start_date: '',
    end_date: ''
  };

  render() {
    const { label, start_date, end_date } = this.state;
    return (
      <div className="button-container">
        <input
          type="text"
          placeholder="title"
          onChange={e => this.setState({ label: e.target.value })}
        />
        <input
          type="date"
          onChange={e =>
            this.setState({ start_date: new Date(e.target.value) })
          }
        />
        <input
          type="date"
          onChange={e => this.setState({ end_date: new Date(e.target.value) })}
        />
        <button
          onClick={e => this.props.addNewEvent({ label, start_date, end_date })}
        >
          {' '}
          submit
        </button>
      </div>
    );
  }
}
