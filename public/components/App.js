import React from 'react';
import * as d3 from 'd3';

export class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      data: [
        { label: "one", start_date: new Date(1992, 0, 0), end_date: new Date(1992, 0, 0) },
        { label: "close", start_date: new Date(1992, 1, 0), end_date: new Date(1992, 1, 0) },
        { label: "two", start_date: new Date(2001, 0, 0), end_date: new Date(2003, 0, 0) },
        { label: "half", start_date: new Date(2001, 0, 0), end_date: new Date(2005, 0, 0) },
        { label: "more", start_date: new Date(2001, 0, 0), end_date: new Date(2006, 0, 0) },
        { label: "three", start_date: new Date(2010, 0, 0), end_date: new Date(2011, 0, 0) }
      ],
      chart_width: 800,
      chart_height: 400,
      timeline_x: 0,
      zoom_level: 1
    };
  }

  calculateScale = () => {
    const { chart_height, chart_width, data, zoom_level } = this.state
    const start_dates = data.map(d => d.start_date)
    const end_dates = data.map(d => d.end_date)
    return d3.scaleLinear()
      .domain([d3.min(start_dates), d3.max(end_dates)])
      .range([0, (chart_width * zoom_level) - 100]);
  }
  componentDidMount() {
    const { chart_height, chart_width, data, zoom_level } = this.state

    const svg = d3.select("#chart")
      .append("svg")
      .attr("width", chart_width)
      .attr("height", chart_height);

    const leftPadding = 30

    const sortedData = data.sort(d => d.start_date)
    const dataWithYVals = sortedData.reduce((acc, d, i) => {
      let y = 165
      if (i > 0) {
        const prevData = acc[i - 1]
        const isOverlap = prevData.end_date > d.start_date
        y = isOverlap ? prevData.y - 40 : 165
      }
      const newObj = {
        ...d,
        y
      }
      return [...acc, newObj]
    }, [])

    const scale = this.calculateScale()
    const x_axis = d3.axisBottom()
      .scale(scale)
      .ticks(5)
      .tickFormat(d3.timeFormat("%Y-%m-%d"))

    const timelineGroup = svg.append('g').attr('class', 'timelineGroup')
    timelineGroup
      .append("g")
      .attr('class', 'axisGroup')
      .attr("transform", `translate(${leftPadding} 180)`)
      .call(x_axis)

    timelineGroup.selectAll('.eventGroups')
      .data(dataWithYVals)
      .enter()
      .append('g')
      .attr('class', 'eventGroups')

    const eventGroups = svg.selectAll('.eventGroups')

    eventGroups
      .append('rect')
      .attr('width', d => {
        const width = scale(d.end_date) - scale(d.start_date)
        return width > 0 ? width : 1
      })
      .attr('height', 10)
      .attr('class', 'eventRects')
      .attr('x', d => leftPadding + scale(d.start_date))
      .attr('y', d => d.y)
      .attr('fill', 'LightSteelBlue')


    eventGroups
      .append('g')
      .attr('class', 'labelGroup')

    const labelGroups = eventGroups.selectAll('.labelGroup')


    labelGroups.append('rect')
      .attr('class', 'textBackground')
      .attr('width', d => d.label.length * 10)
      .attr('height', 20)
      .attr('x', d => leftPadding + scale(d.start_date) - 5)
      .attr('y', d => d.y - 25)
      .attr('fill', ' #f7f7f7')

    labelGroups
      .append('text')
      .text(d => d.label)
      .attr('x', d => leftPadding + scale(d.start_date))
      .attr('y', d => d.y - 10)
  }

  redraw = () => {
    const leftPadding = 30
    const scale = this.calculateScale()
    const x_axis = d3.axisBottom()
      .scale(scale)
      .ticks(5)
      .tickFormat(d3.timeFormat("%Y-%m-%d"))

    d3.select('.axisGroup').transition().duration(750)
      .call(x_axis)
    const timelineGroup = d3.select('.timelineGroup')
    timelineGroup
      .append("g")
      .attr('class', 'axisGroup')
      .attr("transform", `translate(${leftPadding} 180)`)
      .call(x_axis)

    const eventGroups = d3.selectAll('.eventRects')
      .attr('width', d => {
        const width = scale(d.end_date) - scale(d.start_date)
        return width > 0 ? width : 1
      })
      .attr('x', d => leftPadding + scale(d.start_date))




    const labelGroups = d3.selectAll('.labelGroup')


    labelGroups.select('.textBackground')
      .attr('x', d => leftPadding + scale(d.start_date) - 5)


    labelGroups.select('text')
      .attr('x', d => leftPadding + scale(d.start_date))

  }


  move = (num) => {
    this.setState({ timeline_x: this.state.timeline_x + num }, () => {
      const { timeline_x } = this.state
      d3.select('.timelineGroup')
        .transition()
        .duration(750)
        .attr("transform", `translate(${timeline_x} ,0)`)
    })
  }

  zoom = (num) => {
    this.setState({ zoom_level: this.state.zoom_level + num }, () => this.redraw())
  }

  render() {
    return (
      <div>

        <div id="chart" />
        <button onClick={() => this.move(300)}> LEFT ======================== </button>
        <button onClick={() => this.move(-300)}>  RIGHT =================== </button>
        <button onClick={() => this.zoom(1)}> IN ++++++++++++++++++++++ </button>
        <button onClick={() => this.zoom(-1)}> OUT --------------------- </button>

      </div>
    );
  }
}
