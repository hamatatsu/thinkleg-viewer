const sum = (arr) => arr.reduce((p, c) => p + c);
const sum2 = (arr) => arr.reduce((p, c) => p + c * c);
const variance = (arr) => sum2(arr) / arr.length - (sum(arr) / arr.length) ** 2;
const std = (arr) => Math.sqrt(variance(arr));

const labelFormatter = (value) => {
  const d = new Date(value);
  return (
    d.toLocaleTimeString('ja-JP', { hour12: false }) +
    `.${('000' + d.getMilliseconds().toString()).slice(-3)}`
  );
};

const options = {
  series: [],
  chart: {
    type: 'line',
    width: 1600,
    height: 800,
    animations: {
      enabled: false,
    }
  },
  tooltip: {
    enabled: false
  },
  stroke: {
    width: 1,
    curve: 'straight',
  },
  xaxis: {
    type: 'numeric',
    tickAmount: 10,
    categories: [],
    labels: {
      formatter: labelFormatter,
    },
  },
  yaxis: {
    labels: {
      formatter: (val) => val.toFixed(0),
    },
    min: 0,
    max: 250,
    title: { text: 'Value' },
  },
};

function dateFormatter(str) {
  const year = parseInt(str.slice(0, 2)) + 2000
  const monthIndex = parseInt(str.slice(2, 4)) - 1
  const day = parseInt(str.slice(4, 6))
  const hours = parseInt(str.slice(6, 8))
  const minutes = parseInt(str.slice(8, 10))
  const seconds = parseInt(str.slice(10, 12))
  return new Date(year, monthIndex, day, hours, minutes, seconds)
}

function fileChanged(input) {
  document.querySelector("#chart").textContent = "loading"
  const reader = new FileReader
  if (input.files[0]) {
    const file = input.files[0]
    reader.readAsText(file)
    reader.onload = function (event) {
      const result = event.target.result;
      csv_parse.parse(result, options, (err, data) => {
        const start = dateFormatter(file.name)
        console.log(start)
        const seriesData = data.map((value, index) => {
          const x = start.getTime() + parseInt(value[0])
          const y = value[1] === '' ? 0 : parseFloat(value[1])
          return { x, y }
        })
        console.log(seriesData)
        options.series = [{ name: file.name, data: seriesData }]
        document.querySelector("#chart").textContent = ""
        const chart = new ApexCharts(document.querySelector("#chart"), options);
        chart.render();
      });
    };
  }
}