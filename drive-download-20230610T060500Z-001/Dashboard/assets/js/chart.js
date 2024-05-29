
// Donut Chart

var donutOptions = {
    series: [44, 55, 41],
    labels: ["Accounting", "Faculty", "Administration"],
    colors: ["#69006c", "#380049", "#6040a7"],
          chart: {
          width: 500,
          type: 'donut',
        },
        plotOptions: {
          pie: {
            startAngle: -90,
            endAngle: 270
          }
        },
        dataLabels: {
          enabled: false
        },
        fill: {
          type: 'gradient',
        },
        legend: {
          position: 'top',
          formatter: function(val, opts) {
            return val + " - " + opts.w.globals.series[opts.seriesIndex]
          }
        },
        title: {
          text: ''
        },
        responsive: [{
          breakpoint: 480,
          options: {
            chart: {
              width: 400
            },
            legend: {
              position: 'bottom'
            }
          }
        }]
        };

  var Donut = new ApexCharts(document.querySelector("#donut"), donutOptions);
  Donut.render();

// Area Chart

var areaChartOptions = {
    series: [{
    name: 'Absents',
    data: [28, 20, 38, 32, 34, 22, 41]
  }, {
    name: 'Late',
    data: [18, 30, 12, 32, 56, 12, 32]
  }, {
    name: 'Attendees',
    data: [80, 60, 48, 70, 56, 109, 100]
  }],
    chart: {
    height: 400,
    type: 'area',
    toolbar: {
        show: false,
    },
  },
  dataLabels: {
    enabled: false
  },
  colors: ["#69006c", "#380049", "#6040a7"],
  stroke: {
    curve: 'smooth'
  },
  labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul"],
  markers: {
    size: 0,
  },
  yaxis: [
    {
        title: {
            text: ''
        },
    },
    {
        opposite: true,
        title: {
            text: '',
        },
    },
  ],
  tooltip: {
    shared: true,
    intersect: false,
  },
  };

  var areaChart = new ApexCharts(document.querySelector("#area-chart"), areaChartOptions);
  areaChart.render();