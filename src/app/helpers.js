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

export class VisObject {
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

  constructor(headings, values, numberOfMeasurements) {
    this.headings = headings;
    this.values = values;

    this.numberOfMeasurements = numberOfMeasurements;
    this.seriesIndicesForEachMeasurement = {};

    this.transformData();
  }

  divideRows(divisionIndex) {
    return this.values.reduce((acc, el, idx) => {
      if (idx % 40 === 0) {
        acc.push([]);
        divisionIndex += 40;
      }
      if (idx < divisionIndex - 1) {
        acc.slice(-1)[0].push(el);
      }
      return acc;
    }, []);
  }

  assignRows() {
    this.rows = this.divideRows(this.numberOfMeasurements, this.values);
  }

  stratifyByMeasurement() {
    this.constructor.UNITS_OF_MEASUREMENT.forEach((unit) => {
      this.seriesIndicesForEachMeasurement[unit] =
        this.constructor.getIndicesForMetric(unit, this.headings);
    });
  }

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
  }

  transformData() {
    this.assignRows();
    this.stratifyByMeasurement();
  }
}
