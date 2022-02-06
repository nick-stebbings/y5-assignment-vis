import * as d3 from "d3";
import * as fc from "d3fc";
import { HEADINGS_INFO } from "./constants";

export function selectDateTimeValue(array) {
  return new Date(array[0]);
}

export function transformDateArrayToDateTimeStringsArray(datesArray) {
  return datesArray.map((d) => {
    return `${d.toLocaleDateString(undefined, {
      month: "numeric",
      day: "numeric",
    })} ${d.toLocaleTimeString(undefined, {
      hour: "numeric",
      minute: "numeric",
    })}`;
  });
}

export class VisController {
  constructor() {
    this.series = {};
    this.seriesIndicesForEachMeasurement = {};
    this.crosshair = [];
  }

  static UNITS_OF_MEASUREMENT = ["m", "s", "deg", "kts", "mm/hr", "C", "%"];

  static getIndicesForMetric(metricSymbol, headings) {
    switch (metricSymbol) {
      case "m":
        return headings
          .map((v, i) => (v.match(/.*(\[m\])$/) ? i : ""))
          .filter((v) => !!v);
      case "s":
        return headings
          .map((v, i) => (v.match(/.*(\[s\])$/) ? i : ""))
          .filter((v) => !!v);
      case "deg":
        return headings
          .map((v, i) => (v.match(/.*(\[deg\])$/) ? i : ""))
          .filter((v) => !!v);
      case "kts":
        return headings
          .map((v, i) => (v.match(/.*(\[kts\])$/) ? i : ""))
          .filter((v) => !!v);
      case "mm/hr":
        return headings
          .map((v, i) => (v.match(/.*(\[mm\/hr\])$/) ? i : ""))
          .filter((v) => !!v);
      case "%":
        return headings
          .map((v, i) => (v.match(/.*(\[%\])$/) ? i : ""))
          .filter((v) => !!v);
      case "C":
        return headings
          .map((v, i) => (v.match(/.*(\[C\])$/) ? i : ""))
          .filter((v) => !!v);
    }
  }

  // Transformation helpers
  _divideRows(divisionIndex) {
    return this.values.reduce((acc, el, idx) => {
      if (idx % this.numberOfMeasurements === 0) {
        acc.push([]);
        divisionIndex += this.numberOfMeasurements;
      }
      if (idx < divisionIndex - 1) {
        acc.slice(-1)[0].push(el);
      }
      return acc;
    }, []);
  }

  _assignRows() {
    this.rows = this._divideRows(this.numberOfMeasurements, this.values);
  }

  _assignSeries() {
    for (let i = 0; i < this.numberOfMeasurements; i++) {
      this.rows.forEach((row) => {
        const parsedValue = i == 0 ? row[i] : row[i].replace(/\s/, ""); // Strip spaces for non DateTime numeric values

        if (typeof this.series[i] == "undefined") {
          this.series[i] = [parsedValue];
        } else {
          this.series[i].push(parsedValue);
        }
      });
    }
  }

  _stratifySeriesIndicesByMeasurement() {
    this.constructor.UNITS_OF_MEASUREMENT.forEach((unit) => {
      this.seriesIndicesForEachMeasurement[unit] =
        this.constructor.getIndicesForMetric(unit, this.headings);
    });
  }

  // D3 chart prep helpers
  _calculateAndAssignRanges() {
    this.seriesRanges = Object.values(this.series).map((seriesArr, i) =>
      i == 0 // Use date extent for the first series, then linear extent
        ? fc
            .extentTime(seriesArr)
            .accessors([(d) => new Date(d)])
            .padUnit("domain")
            .pad([20, 20])(seriesArr)
        : fc
            .extentLinear(seriesArr)
            .include([0])
            .accessors([(d, i) => +d])
            .pad([0, 0.1])(seriesArr)
    );
  }

  _assignXAxisTickValues() {
    this.xAxisSeries = this.rows.map(selectDateTimeValue);
    this.xAxisTicks = transformDateArrayToDateTimeStringsArray(
      this.xAxisSeries
    );
  }

  _transformData() {
    this._assignRows();
    this._assignSeries();
    this._stratifySeriesIndicesByMeasurement();
    this._calculateAndAssignRanges();
    this._assignXAxisTickValues();
  }

  _bindPointer() {
    this.pointer = fc.pointer().on(
      "point",
      function (event) {
        this.crosshair = event.map(({ x: xVal }) => {
          const bisectDate = d3.bisector(function (a, b) {
            return a - b;
          }).left;

          const closestIndex = bisectDate(
            this.xAxisSeries,
            this.chart.xInvert(xVal)
          );
          return this.xAxisSeries[closestIndex - 1];
        });
      }.bind(this)
    );
  }

  //-- PUBLIC METHODS

  getSeriesByIndex(i) {
    return this.rows.map((row) => row[i]);
  }
  getExtentByIndex(i) {
    return this.seriesRanges[i];
  }

  // Dev helper
  logData() {
    this.headings.forEach((h, i) => {
      console.log(
        "this.headings :>> " + i + " ",
        h,
        " : ",
        HEADINGS_INFO[h.split("[")[0]]
      );
    });
    console.table(this.rows);
    // // console.log("xAxisSeries :>> ", this.xAxisSeries);
    // // console.log("xAxisTicks :>> ", this.xAxisTicks);
    // // console.log("seriesRanges :>> ", this.seriesRanges);
    // console.log(
    //   "seriesIndicesForEachMeasurement :>> ",
    //   this.seriesIndicesForEachMeasurement
    // );
  }

  init(headings, values, numberOfMeasurements) {
    this.headings = headings;
    this.values = values;
    this.numberOfMeasurements = numberOfMeasurements;

    this._transformData();
    this._bindPointer();
  }

  // Rendering
  render(vnode, seriesIndex, chart) {
    d3.select(vnode)
      .datum(this.getSeriesByIndex(seriesIndex)) //.concat([annotations]))
      .call(chart);
    d3.select(".plot-area").call(this.pointer);
  }
}
