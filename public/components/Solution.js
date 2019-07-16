import React from 'react';
import * as d3 from 'd3';

export class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      data: [
        { id: 1, height: 90, liquidHeight: 35, color: '#FDA7DF' },
        { id: 2, height: 100, liquidHeight: 40, color: '#54a0ff' },
        { id: 3, height: 50, liquidHeight: 10, color: '#e84118' },
        { id: 4, height: 30, liquidHeight: 20, color: '#FF851B' },
        { id: 5, height: 80, liquidHeight: 30, color: '#3D9970' },
        { id: 6, height: 20, liquidHeight: 5, color: '#9980FA' }
      ],
      vaseY: 300
    };
  }
  componentDidMount() {
    const { data, vaseY } = this.state;
    const svgWidth = 700;
    const svgHeight = 500;
    d3.select('#chart')
      .append('svg')
      .attr('width', svgWidth)
      .attr('height', svgHeight);

    const vaseGroups = d3
      .select('svg')
      .selectAll('g')
      .data(data)
      .enter()
      .append('g')
      .attr('class', 'vase-group');
    const margin = 230;
    const padding = 60;
    const vaseWidth = 15;

    vaseGroups
      .append('rect')
      .attr('class', 'vase')
      .attr('width', vaseWidth)
      .attr('height', d => d.height)
      .attr('x', (_, i) => i * padding + margin)
      .attr('y', d => vaseY - d.height)
      .attr('fill', 'none')
      .attr('stroke', d => d.color);

    vaseGroups
      .append('rect')
      .attr('class', 'liquid')
      .attr('width', vaseWidth)
      .attr('height', d => d.liquidHeight)
      .attr('x', (_, i) => i * padding + margin)
      .attr('y', d => vaseY - d.liquidHeight)
      .attr('fill', d => d.color);
  }

  componentDidUpdate() {
    this.redrawLiquid();
  }

  redrawLiquid = () => {
    const { vaseY, data } = this.state;
    const vaseGroups = d3.selectAll('.vase-group');
    vaseGroups
      .data(data)
      .select('rect.liquid')
      .transition()
      .duration(750)
      .attr('height', d => d.liquidHeight)
      .attr('y', d => vaseY - d.liquidHeight);
  };

  updateData = direction => {
    const { data } = this.state;

    const newData = data.map(d => {
      const newValue =
        direction === 'increase' ? d.liquidHeight + 10 : d.liquidHeight - 10;

      const newLiquidHeight =
        newValue > d.height ? d.height : newValue < 0 ? 0 : newValue;

      return { ...d, liquidHeight: newLiquidHeight };
    });
    this.setState({ data: newData });
  };

  render() {
    return (
      <section>
        <div id="chart" />
        <div className="button-container">
          <button
            id="increase"
            className="increase-btn"
            onClick={() => this.updateData('increase')}
          >
            +
          </button>
          <button
            id="decrease"
            className="decrease-btn"
            onClick={() => this.updateData('decrease')}
          >
            -
          </button>
        </div>
      </section>
    );
  }
}
