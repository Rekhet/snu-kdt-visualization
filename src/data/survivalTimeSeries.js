// Actual Prevalence data (per 100,000) from public/data/cancer_61_age5.csv
// Used for the Population Grid visualization where 1 mesh = 1%.
// Percentage = Value / 1000

export const survivalTimeSeries = {
  years: [
    2007, 2008, 2009, 2010, 2011, 2012, 2013, 2014, 2015, 2016, 2017, 2018,
    2019, 2020, 2021, 2022, 2023,
  ],
  data: {
    stomach: {
      label: "Stomach Cancer (C16)",
      values: [
        88.9, 99.3, 112.0, 123.6, 137.6, 150.4, 160.1, 166.9, 172.2, 177.2,
        182.5, 187.8, 194.4, 197.1, 203.0, 210.8, 222.9,
      ],
    },
    lung: {
      label: "Lung Cancer (C33-C34)",
      values: [
        10.7, 12.6, 15.0, 17.5, 21.1, 25.5, 29.7, 34.6, 40.0, 46.5, 54.3, 64.8,
        77.7, 91.3, 109.2, 131.2, 163.8,
      ],
    },
    liver: {
      label: "Liver Cancer (C22)",
      values: [
        13.4, 15.4, 17.6, 19.9, 22.8, 25.6, 28.1, 30.8, 33.5, 36.2, 39.2, 42.8,
        47.0, 51.5, 57.0, 63.7, 75.1,
      ],
    },
    colorectal: {
      label: "Colorectal Cancer (C18)",
      values: [
        38.0, 44.7, 52.0, 59.2, 66.9, 74.3, 79.4, 82.6, 85.2, 87.6, 90.1, 93.3,
        99.0, 103.3, 109.6, 116.6, 126.4,
      ],
    },
    breast: {
      label: "Breast Cancer (C50)",
      values: [
        74.9, 82.7, 90.8, 99.3, 109.0, 118.0, 127.4, 137.1, 146.5, 158.2, 170.4,
        183.4, 197.7, 210.7, 227.1, 243.3, 259.3,
      ],
    },
  },
};
