// Mock data for 5-year Relative Survival Rates (%) in Korea (2007-2023)
// Based on typical trends (Source: approximation of KCCR data)

export const survivalTimeSeries = {
  years: Array.from({ length: 17 }, (_, i) => 2007 + i),
  data: {
    stomach: {
      label: 'Stomach Cancer',
      values: [61.2, 63.1, 65.3, 67.0, 69.4, 71.5, 73.1, 74.4, 75.4, 76.0, 76.5, 77.0, 77.5, 78.0, 78.5, 79.0, 79.5]
    },
    lung: {
      label: 'Lung Cancer',
      values: [17.5, 18.9, 20.3, 21.9, 23.5, 25.1, 26.8, 28.2, 30.0, 32.4, 34.7, 36.8, 38.5, 39.9, 41.2, 42.0, 43.5]
    },
    liver: {
      label: 'Liver Cancer',
      values: [23.8, 25.1, 26.7, 28.3, 30.1, 31.5, 32.8, 34.0, 35.6, 36.9, 37.7, 38.5, 39.3, 40.1, 41.0, 41.5, 42.1]
    },
    colorectal: {
      label: 'Colorectal Cancer',
      values: [70.1, 71.3, 72.6, 73.8, 74.5, 75.0, 75.6, 76.3, 76.9, 77.4, 77.9, 78.3, 78.8, 79.2, 79.6, 80.0, 80.5]
    },
    breast: {
      label: 'Breast Cancer',
      values: [89.5, 90.1, 90.6, 91.0, 91.3, 91.7, 92.0, 92.3, 92.6, 92.9, 93.2, 93.5, 93.8, 94.1, 94.4, 94.7, 95.0]
    }
  }
};
