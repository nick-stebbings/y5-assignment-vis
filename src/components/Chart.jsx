import * as d3 from "d3";
import { selection } from "d3";
import * as fc from "d3fc";
import m from "mithril";
import * as Stream from "mithril/stream";

import { NUMBER_OF_MEASUREMENTS, ARROW_SVG_PATH } from "../app/constants";

export const Chart = () => {
  return {
    oncreate: ({ dom, attrs: { mainVis, seriesSelectorStream } }) => {
      d3.text("metocean.tsv").then((text) => {
        const rows = d3.tsvParseRows(text, (d) => d)[0];
        const headings = rows.slice(0, NUMBER_OF_MEASUREMENTS);
        const values = rows.slice(NUMBER_OF_MEASUREMENTS);

        mainVis.init(headings, values, NUMBER_OF_MEASUREMENTS);
        // mainVis.logData();

        const timeSeries = mainVis.getExtentByIndex(0);

        const xAccessor = (d, i) => {
          return mainVis.xAxisSeries[i];
        };
        const yAccessor = (d, i) => d;

        const line = fc
          .seriesSvgLine()
          .crossValue(xAccessor)
          .mainValue(yAccessor);
        const point = fc
          .seriesSvgPoint()
          .crossValue(xAccessor)
          .mainValue(yAccessor)
          .size(25)
          .decorate((selection) => {
            selection.enter().append("text");
            selection.select("text").text(yAccessor);
          });

        const gridlines = fc.annotationSvgGridline();

        let xScale = d3.scaleTime().nice();
        const xScale2 = d3.scaleTime().domain(timeSeries);

        const annotations = fc
          .annotationSvgGridline()
          .xDecorate((sel) => {
            // sel.classed("hidden", true);
            sel.classed("x-annotations", true);
          })
          .xTicks(192 / 4)
          .xScale(xScale2);

        const multi = fc
          .seriesSvgMulti()
          .series([gridlines, annotations].concat(line).concat([point]))
          .mapping((data, index, series) => {
            switch (series[index]) {
              case point:
                return mainVis.crosshair;
              default:
                return data;
            }
          });

        mainVis.chart = fc
          .chartCartesian(xScale, d3.scaleLinear())
          .xDomain(timeSeries)
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

        mainVis.render(dom, seriesSelectorStream(), mainVis.chart);

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
              `scale(${(0.013 * windStrength) / 2}), rotate(${
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
