import React from 'react';
import * as d3 from 'd3';

export class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      data: [
        {label: "one", start_date: new Date(1992, 0, 0), end_date: new Date(1992, 0, 0)},
        {label: "close", start_date: new Date(1992, 1, 0), end_date: new Date(1992, 1, 0)},
        {label: "two", start_date: new Date(2001, 0,0), end_date: new Date(2003, 0, 0)},
        {label: "half", start_date: new Date(2001, 0,0), end_date: new Date(2005, 0, 0)},
        {label: "more", start_date: new Date(2001, 0,0), end_date: new Date(2006, 0, 0)},
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
  const sortedData = data.sort(d=> d.start_date)
  const dataWithYVals = sortedData.reduce((acc, d, i)=> {
    let y = 165
    if (i > 0 ){
    const prevData = acc[i-1]
    const isOverlap = prevData.end_date > d.start_date 
     y = isOverlap ? prevData.y - 40 : 165
  }
    const newObj = {
      ...d, 
      y
    }
    return [...acc, newObj]
  }, [])

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
    .data(dataWithYVals)
    .enter()
    .append('g')
    .attr('class', 'eventGroups')

  const eventGroups = svg.selectAll('.eventGroups')
    
  eventGroups
      .append('rect')
      .attr('width', d=> {
        const width = scale(d.end_date) - scale(d.start_date) 
        return width > 0 ? width : 1
      })
      .attr('height', 10)
      .attr('x', d=> leftPadding + scale(d.start_date))
      .attr('y',d=> d.y)

      
      eventGroups
      .append('g')
      .attr('class','labelGroup')
      
      const labelGroups = eventGroups.selectAll('.labelGroup')


      labelGroups.append('rect')
      .attr('width', d=> d.label.length * 10)
      .attr('height', 20)
      .attr('x', d=> leftPadding + scale(d.start_date) - 5)
      .attr('y',d=> d.y - 25 )
      .attr('fill', ' #f7f7f7')

      labelGroups
      .append('text')
      .text(d=> d.label)
      .attr('x', d=> leftPadding + scale(d.start_date))
      .attr('y',d=> d.y - 10)
  }

  
  render() {
    return (
        <div id="chart" />


    );
  }
}
