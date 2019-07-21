import React from 'react';
import * as d3 from 'd3';

export class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      data: [
        {label: "one", start_date: 100, end_date: 200},
        {label: "two", start_date: 400, end_date: 420},
        {label: "three", start_date: 600, end_date: 650}
      ],
      chart_width: 800,
      chart_height: 400
    };
  }
  componentDidMount() {
    const {chart_height, chart_width, data} = this.state
    const start_dates = data.map(d=> d.start_date)
    const end_dates = data.map(d=> d.end_date)
    const leftPadding = 30
    const svg = d3.select("#chart")
                .append("svg")
                .attr("width", chart_width)
                .attr("height", chart_height);

    const scale = d3.scaleLinear()
                  .domain([d3.min(start_dates), d3.max(end_dates)])
                  .range([0, chart_width - 100]);

    const x_axis = d3.axisBottom()
                  .scale(scale)
                  .ticks(5)

    svg
      .append("g")
      .attr("transform", `translate(${leftPadding} 180)`)
      .call(x_axis)

  svg.selectAll('.eventGroups')
    .data(data)
    .enter()
    .append('g')
    .attr('class', 'eventGroups')

const eventGroups = svg.selectAll('.eventGroups')
  
eventGroups
    .append('circle')
    .attr('r', 8)
    .attr('cx', d=> leftPadding + scale(d.start_date))
    .attr('cy', 150)

eventGroups
    .append('text')
    .text(d=> d.label)
    .attr('x', d=> leftPadding + scale(d.start_date))
    .attr('y', 130)
  }

  
  render() {
    return (
        <div id="chart" />


    );
  }
}
