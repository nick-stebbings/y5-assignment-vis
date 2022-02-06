import m from "mithril";
import * as Stream from "mithril/stream";
import "./App.css";

import { Chart } from "./components/Chart.jsx";
import {
  HEADINGS_INFO,
  METRE_MEASURED_SERIES_INDICES,
  EXCLUDED_METRE_SERIES,
} from "./app/constants";

import { VisController } from "./app/helpers";

export const App = () => {
  const seriesSelectedIndex = Stream(2);
  const selectedIndex = Stream(0);

  const mainVis = new VisController();
  return {
    view: () => {
      return (
        <div>
          <div className="series-selector">
            <label>
              Choose a series for the main chart:
              <select
                name="series-choice"
                value={
                  Object.values(HEADINGS_INFO)[
                    METRE_MEASURED_SERIES_INDICES[selectedIndex()]
                  ]
                }
                onchange={(e) => {
                  selectedIndex(e.target.selectedIndex);

                  seriesSelectedIndex(
                    METRE_MEASURED_SERIES_INDICES[selectedIndex()] + 1
                  );

                  const chartDomNode = document.querySelector(".chart");

                  mainVis.chart.yDomain(
                    mainVis.getExtentByIndex(+seriesSelectedIndex())
                  );

                  mainVis.render(
                    chartDomNode,
                    +seriesSelectedIndex(),
                    mainVis.chart
                  );
                }}
              >
                {Object.values(HEADINGS_INFO)
                  .filter((_, idx) => {
                    return (
                      !EXCLUDED_METRE_SERIES.includes(idx) &&
                      METRE_MEASURED_SERIES_INDICES.includes(idx)
                    );
                  })
                  .map((heading, idx) => (
                    <option>{heading}</option>
                  ))}
              </select>
            </label>
          </div>
          <Chart mainVis={mainVis} seriesSelectorStream={seriesSelectedIndex} />
        </div>
      );
    },
  };
};
