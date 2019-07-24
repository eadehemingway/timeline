import React from 'react';
import * as d3 from 'd3';
import { ButtonPanel } from './ButtonPanel';
import { Form } from './Form';

export class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      data: [
        {
          label: 'one',
          start_date: new Date(1992, 0, 0),
          end_date: new Date(1992, 0, 0)
        },
        {
          label: 'close',
          start_date: new Date(1992, 1, 0),
          end_date: new Date(1992, 1, 0)
        },
        {
          label: 'two',
          start_date: new Date(2001, 0, 0),
          end_date: new Date(2003, 0, 0)
        },
        {
          label: 'half',
          start_date: new Date(2001, 0, 0),
          end_date: new Date(2005, 0, 0)
        },
        {
          label: 'more',
          start_date: new Date(2001, 0, 0),
          end_date: new Date(2006, 0, 0)
        },
        {
          label: 'three',
          start_date: new Date(2010, 0, 0),
          end_date: new Date(2011, 0, 0)
        }
      ],
      chart_width: 800,
      chart_height: 400,
      timeline_x: 0,
      zoom_level: 1,
      leftPadding: 50,
      midScreenDate: 0,
      xTranslationFromZoom: 0
    };
  }

  getDataWithYVals = () => {
    const { data } = this.state;

    const sortedData = data.sort(d => d.start_date);
    return sortedData.reduce((acc, d, i) => {
      let y = 165;
      if (i > 0) {
        const prevData = acc[i - 1];
        const isOverlap = prevData.end_date > d.start_date;
        y = isOverlap ? prevData.y - 40 : 165;
      }
      const newObj = {
        ...d,
        y
      };
      return [...acc, newObj];
    }, []);
  };

  componentDidMount() {
    const { chart_height, chart_width, leftPadding } = this.state;

    const svg = d3
      .select('#chart')
      .append('svg')
      .attr('width', chart_width)
      .attr('height', chart_height);

    svg
      .append('line')
      .attr('x1', chart_width / 2)
      .attr('x2', chart_width / 2)
      .attr('y1', 0)
      .attr('y2', chart_height)
      .attr('stroke', 'grey')
      .attr('stroke-width', 1);

    svg
      .append('g')
      .attr('class', 'timelineGroup')
      .append('g')
      .attr('class', 'axisGroup');

    const inverseScale = this.inverseScale();

    const midScreenDate = inverseScale(
      this.state.chart_width / 2 - this.state.leftPadding
    );
    this.setState({ midScreenDate });
    this.drawAfterMount();
  }

  drawAfterMount = () => {
    const { chart_height, chart_width, leftPadding } = this.state;
    const scale = this.calculateScale();
    const dataWithYVals = this.getDataWithYVals();
    const x_axis = d3
      .axisBottom()
      .scale(scale)
      .ticks(5)
      .tickFormat(d3.timeFormat('%Y-%m-%d'));

    d3.select('.axisGroup')
      .attr('transform', `translate(${leftPadding} 180)`)
      .call(x_axis);

    const existingEventGroups = d3.select('svg').selectAll('.eventGroups');

    console.log(existingEventGroups);
    const enteringEventGroups = existingEventGroups
      .data(dataWithYVals)
      .enter()
      .append('g')
      .attr('class', 'eventGroups');
    console.log(enteringEventGroups);

    const existingAndEnteringEventGroups = existingEventGroups.merge(
      enteringEventGroups
    );

    enteringEventGroups
      .append('rect')
      .attr('width', d => {
        const width = scale(d.end_date) - scale(d.start_date);
        return width > 0 ? width : 1;
      })
      .attr('height', 10)
      .attr('class', 'eventRects')
      .attr('x', d => leftPadding + scale(d.start_date))
      .attr('y', d => d.y)
      .attr('fill', 'LightSteelBlue');

    enteringEventGroups.append('g').attr('class', 'labelGroup');

    const enteringLabelGroups = enteringEventGroups.selectAll('.labelGroup');

    enteringLabelGroups
      .append('rect')
      .attr('class', 'textBackground')
      .attr('width', d => d.label.length * 10)
      .attr('height', 20)
      .attr('x', d => leftPadding + scale(d.start_date) - 5)
      .attr('y', d => d.y - 25)
      .attr('fill', ' #f7f7f7');

    enteringLabelGroups
      .append('text')
      .attr('class', 'labels')
      .text(d => d.label)
      .attr('x', d => leftPadding + scale(d.start_date))
      .attr('y', d => d.y - 10);
  };

  calculateScale = () => {
    const { chart_width, data, zoom_level, leftPadding } = this.state;
    const start_dates = data.map(d => d.start_date);
    const end_dates = data.map(d => d.end_date);
    return d3
      .scaleLinear()
      .domain([d3.min(start_dates), d3.max(end_dates)])
      .range([0, chart_width * zoom_level - leftPadding * 2]);
  };

  inverseScale = () => {
    const { chart_width, data, zoom_level, leftPadding } = this.state;
    const start_dates = data.map(d => d.start_date);
    const end_dates = data.map(d => d.end_date);
    return d3
      .scaleLinear()
      .domain([0, chart_width * zoom_level - leftPadding * 2])
      .range([d3.min(start_dates), d3.max(end_dates)]);
  };
  redraw = () => {
    const { leftPadding, timeline_x, chart_width, midScreenDate } = this.state;

    const scale = this.calculateScale();

    const xTranslationFromZoom =
      chart_width / 2 - scale(midScreenDate) - timeline_x - leftPadding;

    const x_axis = d3
      .axisBottom()
      .scale(scale)
      .ticks(5)
      .tickFormat(d3.timeFormat('%Y-%m-%d'));

    d3.select('.axisGroup')
      .transition()
      .duration(750)
      .call(x_axis)
      .attr('transform', `translate(${xTranslationFromZoom}, 180)`);

    d3.selectAll('.eventRects')
      .transition()
      .duration(750)
      .attr('width', d => {
        const width = scale(d.end_date) - scale(d.start_date);
        return width > 0 ? width : 1;
      })
      .attr('x', d => scale(d.start_date))
      .attr('transform', `translate(${xTranslationFromZoom}, 0)`);

    const labelGroups = d3.selectAll('.labelGroup');

    labelGroups
      .select('.textBackground')
      .transition()
      .duration(750)
      .attr('x', d => scale(d.start_date) - 5)
      .attr('transform', `translate(${xTranslationFromZoom}, 0)`);

    labelGroups
      .select('text')
      .transition()
      .duration(750)
      .attr('x', d => scale(d.start_date))
      .attr('transform', `translate(${xTranslationFromZoom}, 0)`);

    this.setState({ xTranslationFromZoom });
  };

  move = num => {
    const {
      timeline_x,
      chart_width,
      zoom_level,
      midScreenDate,
      xTranslationFromZoom
    } = this.state;

    const lengthOfChart = chart_width * zoom_level;

    const reachedLeftEnd =
      timeline_x + num + xTranslationFromZoom > chart_width / 2;

    const reachedRightEnd =
      timeline_x + lengthOfChart + num + xTranslationFromZoom < chart_width / 2;

    const moveValue = reachedLeftEnd || reachedRightEnd ? 0 : num;
    const newtimeline_x = timeline_x + moveValue;

    const scale = this.calculateScale();
    const inverseScale = this.inverseScale();
    const prevMidScreenCoordinate = scale(midScreenDate);
    const newMidScreenCoordinate = prevMidScreenCoordinate - moveValue;
    const newMidDate = inverseScale(newMidScreenCoordinate);

    this.setState(
      { timeline_x: newtimeline_x, midScreenDate: newMidDate },
      () => {
        d3.select('.timelineGroup')
          .transition()
          .duration(750)
          .attr('transform', `translate(${this.state.timeline_x} ,0)`);
      }
    );
  };

  zoom = num => {
    const { zoom_level } = this.state;
    const new_zoom_level = zoom_level + num < 1 ? 1 : zoom_level + num;
    this.setState({ zoom_level: new_zoom_level }, () => this.redraw());
  };

  addNewEvent = newEvent => {
    const newDataArr = [...this.state.data, newEvent];
    this.setState({ data: newDataArr }, () => {
      this.redraw();
    });
  };
  render() {
    return (
      <div>
        <div id="chart" />

        <ButtonPanel zoom={this.zoom} move={this.move} />
        <Form addNewEvent={this.addNewEvent} />
      </div>
    );
  }
}
