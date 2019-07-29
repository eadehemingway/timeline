import React from 'react';

export class Form extends React.Component {
  state = {
    label: '',
    start_date: '',
    end_date: '',
    hierarchy_level: ''
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

        <button
          onClick={e =>
            this.props.addNewEvent({
              label: 'NEWWWWWWW',
              start_date: new Date(2030, 0, 0),
              end_date: new Date(2032, 0, 0),
              hierarchy_level: 2
            })
          }
        >
          {' '}
          auto fill
        </button>
      </div>
    );
  }
}
