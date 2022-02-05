import * as d3 from "d3";
import * as fc from "d3fc";
import m from "mithril";
import "./App.css";

import { HEADINGS_INFO, NUMBER_OF_MEASUREMENTS } from "./app/constants";
import {
  selectDateTimeValue,
  transformDateArrayToDateTimeStringsArray,
  VisObject,
} from "./app/helpers";

export const App = () => {
  return {
    oncreate: (vnode) => {
      d3.text("metocean.tsv").then((text) => {
        const rows = d3.tsvParseRows(text, (d) => d)[0];
        const headings = rows.slice(0, NUMBER_OF_MEASUREMENTS);
        const values = rows.slice(NUMBER_OF_MEASUREMENTS);

        const mainVis = new VisObject(headings, values, NUMBER_OF_MEASUREMENTS);
        mainVis.logData();

        // console.log("separatedValues :>> ", separatedValues);

        // const timeAxisSeries = valuesArrays.map(selectDateTimeValue);
        // const xAxisTicks =
        //   transformDateArrayToDateTimeStringsArray(timeAxisSeries);

        // console.log("xAxisTicks :>> ", xAxisTicks);
        // // group into buckets
        // let grouped = d3
        //   .groups(splits, bucketByHour)
        //   .map(([key, values]) => ({ key, values }))
        //   .sort((a, b) => d3.ascending(+a.key, +b.key));

        // grouped.forEach((g) => {
        //   // Each bucket contains all the splits for the given time interval. Here we
        //   // reduce them down to a single array of splits giving the mean.
        //   g.mean = d3
        //     .range(0, 27)
        //     .map((d, i) => d3.mean(g.values.map((h) => h[i])))
        //     // and convert from seconds per mile to mph
        //     .map((d) => 60 / (d / 60));
        //   g.datapoints = g.values.length;
        // });

        // // use d3.pairs to pair the data allowing us to render the data as bands
        // grouped = d3
        //   .pairs(grouped)
        //   .map((d) => {
        //     const mean = d[0].mean.map((r, i) => ({
        //       y0: r,
        //       y1: d[1].mean[i],
        //     }));
        //     mean.upperKey = d[0].key;
        //     mean.lowerKey = d[1].key;
        //     mean.datapoints = d[0].datapoints;
        //     return mean;
        //   })
        //   // remove any that don't have many points
        //   .filter((d) => d.datapoints > 100);

        // // construct an array of annotations to label the bands
        // const annotations = grouped.map((d) => {
        //   const f = d3.format(".1f");
        //   return {
        //     time: f(d.upperKey) + " - " + f(d.lowerKey),
        //     mph: (d[26].y1 + d[26].y0) / 2,
        //   };
        // });

        const gridlines = fc.annotationSvgGridline();

        const series = fc
          .seriesSvgLine()
          .crossValue((d, i) => i)
          .mainValue((d) => d.y)
          // .baseValue((d) => d.y1)
          .curve(d3.curveCatmullRom.alpha(0.5));

        const annotation = fc
          .annotationSvgLine()
          .value((d) => d.mph)
          .label((d) => d.time);

        // const multi = fc
        //   .seriesSvgMulti()
        //   .series(
        //     [gridlines].concat(grouped.map(() => series).concat(annotation))
        //   )
        //   .mapping(
        //     (data, index) =>
        //       // the gridlines are not bound to data, so skip the first index
        //       data[index - 1]
        //   )
        //   .decorate((sel) =>
        //     // make the bands pretty!
        //     sel.attr("fill", (d, i) => d3.interpolateSpectral(i / 12))
        //   );

        const swhValues = valuesArrays.map((va) => va[2]);

        const chart = fc
          .chartCartesian(d3.scaleTime(), d3.scaleLinear())
          .xDomain([timeAxisSeries[0], timeAxisSeries.slice(-1)[0]])
          .yDomain([
            Math.min.apply(null, swhValues),
            Math.max.apply(null, swhValues),
          ])
          .yOrient("left")
          .yLabel("Height (m)")
          .xLabel("Date/Time")
          .chartLabel("MetOcean Data Series")
          .svgPlotArea(series);
        // debugger;

        d3.select(vnode.dom)
          .datum(swhValues.concat([annotations]))
          .call(chart);
      });
    },
    view: () => {
      return <div id="chart"></div>;
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
