import * as d3 from "d3";
import * as fc from "d3fc";
import m from "mithril";
import * as Stream from "mithril/stream";

import { NUMBER_OF_MEASUREMENTS, ARROW_SVG_PATH } from "../app/constants";
import { VisController } from "../app/helpers";

export const Chart = () => {
  return {
    oncreate: ({ dom, attrs: { seriesSelectorStream } }) => {
      debugger;
      d3.text("metocean.tsv").then((text) => {
        const rows = d3.tsvParseRows(text, (d) => d)[0];
        const headings = rows.slice(0, NUMBER_OF_MEASUREMENTS);
        const values = rows.slice(NUMBER_OF_MEASUREMENTS);

        const mainVis = new VisController(
          headings,
          values,
          NUMBER_OF_MEASUREMENTS
        );
        // mainVis.logData();

        const line = fc
          .seriesSvgLine()
          .crossValue((d, i) => {
            return mainVis.xAxisSeries[i];
          })
          .mainValue((d, i) => {
            return d;
          });

        const gridlines = fc.annotationSvgGridline();
        const annotations = fc
          .annotationSvgLine()
          .value((d) => d)
          .label((d) => d);

        const multi = fc
          .seriesSvgMulti()
          .series([gridlines].concat(line).concat([annotations]))
          .mapping((data, index) => {
            return data;
          });

        let xScale = d3.scaleTime().nice();
        const xScale2 = d3.scaleTime().domain(mainVis.getExtentByIndex(0));

        const chart = fc
          .chartCartesian(xScale, d3.scaleLinear())
          .xDomain(mainVis.getExtentByIndex(0))
          .yDomain(mainVis.getExtentByIndex(seriesSelectorStream()))
          .yOrient("left")
          .yLabel("Height (m)")
          .xLabel("Date/Time")
          .chartLabel("MetOcean Data Series")
          .svgPlotArea(multi)
          .xTickSizeOuter(0)
          .decorate((selection) => {
            selection
              .enter()
              // additionally add a d3fc-svg element for the axis
              .append("d3fc-svg")
              // move the element into the right-axis cell
              .style("grid-column", 3)
              .style("grid-row", 5)
              // and set the axis height
              .style("height", "5rem")
              // when there's a measure event (namespaced to avoid removing existing handlers)
              .on("measure.x-axis", (event) => {
                // set the range on the scale to the elements width
                xScale2.range([0, event.detail.width]);
              })
              .on("draw.x-axis", (event, d) => {
                // draw the axis into the svg within the d3fc-svg element

                const xAxis2 = fc
                  .axisBottom(xScale2)
                  .tickArguments([192 / 4])
                  .tickFormat(d3.timeFormat("%H%M"))
                  .tickSizeOuter(0);
                d3.select(event.currentTarget).select("svg").call(xAxis2);
              });
            selection
              .enter()
              // additionally add a d3fc-svg element for the axis
              .append("d3fc-svg")
              // move the element into the right-axis cell
              .style("grid-column", 3)
              .style("grid-row", 1)
              // and set the axis height
              .style("height", "5rem")
              .classed("z-axis", true)
              // when there's a measure event (namespaced to avoid removing existing handlers)
              .on("measure.x-axis", (event) => {
                // set the range on the scale to the elements width
                xScale2.range([0, event.detail.width]);
              })
              .on("draw.x-axis", (event, d) => {
                // draw the axis into the svg within the d3fc-svg element

                const windIndicatorsAxis = fc
                  .axisBottom(xScale2)
                  .tickArguments([192 / 4])
                  .tickFormat(d3.timeFormat("%H%M"))
                  .tickSizeOuter(0)
                  .decorate((sel) => {
                    sel.selectAll(".tick path").each(appendWindIndicator);
                  });
                d3.select(event.currentTarget)
                  .select("svg")
                  .call(windIndicatorsAxis);
              });
          });

        mainVis.render(dom, seriesSelectorStream(), chart);

        function appendWindIndicator(d, i, domNode) {
          const seriesIndex = mainVis.xAxisSeries.findIndex(
            (el) => el.valueOf() == d.valueOf()
          );
          const windDirectionDeg = mainVis.getSeriesByIndex(26)[seriesIndex];
          const windStrength = mainVis.getSeriesByIndex(25)[seriesIndex];

          d3.select(domNode[0])
            .attr("d", ARROW_SVG_PATH)
            .classed("wind-direction-arrow", true)
            .attr(
              "transform",
              `scale(${(0.01 * windStrength) / 2}), rotate(${
                windDirectionDeg - 180
              })` // Adjust to point in the opposite direction (of 'from')
            );
        }
      });
    },
    view: () => {
      return <div className="chart"></div>;
    },
  };
};

// PEDAC

// P: We have a dataset of 39 series of data mapped against a timeframe of a few days.

//    It would be overwhelming to display all series at once as there are a total of 7 different units of measurement meaning at most 7 extra scales to plot against.
// 1. Determine the most useful 3 series of data to make prominent in the visualisation

// 2. Make an interactive visualisation of the most important series, with a possible interaction being the hiding/displaying of some of the other series (on another visualisation, perhaps a popup/modal)

// 3. Determine and accentuate patterns or correlations in the main series'.

// Rules:
// All series are mapped against a time scale. This is currently divided into 192 divisions (hourly measurements over 4 days.)
// The vis must be interactive in some way.
// The vis must draw out certain correlations or signals in the data to aid decision making.

// E:

// D:
// The input data structure will be a tsv file that has been formatted into a 2d array(a nested array represents all measurements for one point in time).There are 192 sub - arrays(one for each hourly time division).
// The data can be further subdivided into series that share the same unit of measurement.
// The output will be multiple data visualisations (one main component and some initially hiddent components that can become visible on interaction).

// A:
// -- \\  Create an object holding the relevant series indices for different units of measurement, which can be used to retrieve the data from the main values 2d array.
// -- Scaffold an initial chart with a basic line series of one of the most prominent metrics e.g. wave height.

// -- Decide on the number of divisions for the time scale and which axis it will occupy.
// -- Format the ticks appropriately to indicate the hourly division and change of days over the course of the time scale.
// -- Try millitary time e.g. 0100
// -- Decide on the chart dimensions. E.g. if all 192 time divisions are to be included it is possible that a total chart width of more than 100vw will be useful.
// -- Otherwise the division of 1 hour will have to be multiplied by 2 until we have a less crowded and more readable set of datapoints on the time axis.
