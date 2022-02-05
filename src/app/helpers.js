export function divideRows(divisionIndex, valuesArray) {
  return valuesArray.reduce((acc, el, idx) => {
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

export function getIndicesForMetric(metricSymbol, headings) {
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
