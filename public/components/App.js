import React from 'react';
import * as d3 from 'd3';

export class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      data: [
        {label: "one", start_date: new Date(1992, 0, 0), end_date: new Date(1992, 0, 0)},
        {label: "two", start_date: new Date(2001, 0,0), end_date: new Date(2003, 0, 0)},
        {label: "three", start_date: new Date( 2010, 0, 0), end_date: new Date( 2011, 0, 0)}
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
                  .tickFormat(d3.timeFormat("%Y-%m-%d"))

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
    .append('rect')
    .attr('width', d=> {
      const width = scale(d.end_date) - scale(d.start_date) 
      return width > 0 ? width : 5
    })
    .attr('height', 10)
    .attr('x', d=> leftPadding + scale(d.start_date))
    .attr('y', 150)

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
