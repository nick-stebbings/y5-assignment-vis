// PEDAC

// P: We have a dataset of 39 series of data mapped against a timeframe of a few days.

// It would be overwhelming to display all series at once as there are a total of 7 different units of measurement meaning at most 7 extra scales to plot against.
// 1. Determine the most useful 3 series of data to make prominent in the visualisation

// 2. Make an interactive visualisation of the most important series, with a possible interaction being the hiding/displaying of some of the other series (on another visualisation, perhaps a popup/modal)

// 3. Determine and accentuate patterns or correlations in the main series'.

// Rules:
// All series are mapped against a time scale. This is currently divided into 192 divisions (hourly measurements over 4 days.)
// The vis must be interactive in some way.
// The vis must draw out certain correlations or signals in the data to aid decision making.

<!-- // E: -->

// D:
// The input data structure will be a tsv file that has been formatted into a 2d array(a nested array represents all measurements for one point in time).There are 192 sub - arrays(one for each hourly time division).
// The data can be further subdivided into series that share the same unit of measurement.
// The output will be multiple data visualisations (one main component and some initially hidden component(s) that can become visible on interaction).

// A:
// -- \\ Create an object holding the relevant series indices for different units of measurement, which can be used to retrieve the data from the main values 2d array.
// -- \\ Scaffold an initial chart with a basic line series of one of the most prominent metrics e.g. wave height.

// -- \\ Decide on the number of divisions for the time scale and which axis it will occupy.
// -- \\ Format the ticks appropriately to indicate the hourly division and change of days over the course of the time scale.
// -- \\ Try millitary time e.g. 0100
// -- \\ Decide on the chart dimensions. E.g. if all 192 time divisions are to be included it is possible that a total chart width of more than 100vw will be useful.
// -- \\ Otherwise the division of 1 hour will have to be multiplied by 2 until we have a less crowded and more readable set of datapoints on the time axis.

// Interactions:
// -- \\Use an input selector to determine which series are plotted on the main chart.
// - \\ Create controlled component for feeding the series index to the Vis Controller;
// - \\ Re-render the vis with the input selector index from the view
// \\ translate to overall series index.
// Call re-render on the main vis controller instance with the given index.
// - \\Allow hovering over the wind indicators to show a tooltip and gridline.
// - \\Determine relevant pieces of data to show on the tooltip
// - \\Create a hidden div that is populated with the datapoints at that index of the series at a specific wind indicator.
// - \\Style the box and wind indicator
