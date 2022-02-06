export const ARROW_SVG_PATH =
  "M322.528,387.207l-57.984-74.551V101.617l46.276,33.057c1.486,1.067,3.228,1.588,4.961,1.588 c1.981,0,3.954-0.692,5.542-2.049c2.989-2.545,3.851-6.798,2.092-10.316L263.639,4.342c-2.895-5.79-12.382-5.79-15.277,0 l-59.777,119.554c-1.759,3.51-0.888,7.763,2.092,10.316c2.98,2.545,7.31,2.733,10.504,0.461l46.285-33.057v211.048l-57.984,74.542 c-1.161,1.494-1.793,3.339-1.793,5.243v111.015c0,3.646,2.314,6.891,5.764,8.078c3.433,1.178,7.276,0.043,9.513-2.835 l53.039-68.197l53.031,68.189c1.648,2.126,4.159,3.296,6.746,3.296c0.922,0,1.862-0.154,2.775-0.461 c3.45-1.178,5.764-4.424,5.764-8.07V392.45C324.321,390.546,323.69,388.701,322.528,387.207z";

export const HEADINGS_INFO = {
  lev: "Elevation",
  hs: "Significant wave height",
  hx: "Spectral estimate of maximum wave",
  tp: "Peak Period",
  tm01: "Mean wave period",
  tm02: "Mean wave period",
  dp: "Peak wave direction (from)",
  dpm: "Mean direction at peak frequency (from)",
  hs_sw1: "Significant wave height of primary swell",
  hs_sw8: "Significant wave height of swell (> 8s)",
  tp_sw1: "Peak period of primary swell",
  tp_sw8: "Peak period of swell (> 8s)",
  dpm_sw8: "Mean direction at swell peak frequency (from)",
  dpm_sw1: "Mean direction of primary swell peak frequency",
  hs_sea8: "Significant wave height of sea (< 8s)",
  hs_sea: "Significant wave height of wind sea",
  tp_sea8: "Peak period of sea (< 8s)",
  tp_sea: "Peak period of wind sea",
  tm_sea: "Mean period of wind sea",
  dpm_sea8: "Mean direction at sea peak frequency (from)",
  dpm_sea: "Mean direction at wind sea peak frequency (from)",
  hs_ig: "Infragravity significant wave height",
  hs_fig: "Far infragravity wave height",
  wsp: "Mean wind speed at 10 m",
  gst: "Typical gust speed",
  wd: "Wind direction (from)",
  wsp100: "Mean wind speed at 100 m",
  wsp50: "Mean wind speed at 50 m",
  wsp80: "Mean wind speed at 80 m",
  precip: "Precipitation",
  tmp: "Air temperature",
  rh: "Relative humidity",
  vis: "Visibility",
  cld: "Cloud cover",
  cb: "Cloud base",
  csp0: "Surface current speed",
  cd0: "Surface current direction (to)",
  ss: "Storm surge elevation",
  sst: "Sea surface temperature",
};

export const METRE_MEASURED_SERIES_INDICES = [
  2, 3, 9, 10, 15, 16, 22, 23, 35, 38,
].map((el) => el - 1);

export const EXCLUDED_METRE_SERIES = [35, 38];

export const NUMBER_OF_MEASUREMENTS = 40;
