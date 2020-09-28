import {Component, ElementRef, ViewChild} from '@angular/core';
import Chart from 'chart.js';
import * as chartJsPluginErrorBars from 'chartjs-plugin-error-bars';

import {GRAPH_DATA} from './graph-data';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'canvas';

  @ViewChild('mycanvas', { static: true })
  canvas: ElementRef<HTMLCanvasElement>;

  private ctx: CanvasRenderingContext2D;

  ngOnInit(): void {
    this.ctx = this.canvas.nativeElement.getContext('2d');

    this.draw(this.canvas.nativeElement);
  }

  draw(nativeElement) {
    var config = {
      type: 'line',
      data: {
        labels: ['08:00', '09:00', '10:00', '11:00', '12:00', '13:00', '14:00', '15:00', '16:00', '17:00'],
        datasets: [
          {
            borderWidth: 3,
            label: 'values', //'# top_range',
            data: [9, 14, null, 4, 1, 2, undefined, 7, 11, 6],
            errorBars: {
              '08:00': {plus: 15, minus: 7},
              '09:00': {plus: 20, minus: 9},
              //'10:00': {plus: 4, minus: 2},
              '11:00': {plus: 6, minus: 0},
              '12:00': {plus: 2, minus: 1},
              '13:00': {plus: 3.5, minus: 1},
              //'14:00': {plus: 5.5, minus: 2.3},
              '15:00': {plus: 9, minus: 6},
              '16:00': {plus: 14, minus: 8},
              '17:00': {plus: 9, minus: 4},
            },
            borderColor: 'rgba(111, 111, 255, 1)',
            backgroundColor: 'rgba(111, 111, 255, 1)',
            fill: false
          },
          {
            label: '', //'# bottom_range',
            ignoreEmptyValues: 1, // don't add dashed-lines where values are missing
            data: [7, 13, 3, 1, 0, 2, 1, , 5, 10],
            borderColor: 'rgba(0, 255, 0, 0.8)',
            fill: false,
            pointRadius: 0,
            radius: 0


          },
          {
            label: '', //'# top range',
            ignoreEmptyValues: 1, // don't add dashed-lines where values are missing
            data: [12, 19, 3, 5, 2, 3, 6, , 16, 12],
            fill: '-1',
            borderColor: 'rgba(0, 255, 0, 0.8)',
            backgroundColor: 'rgba(0, 255, 0, 0.8)',
            pointRadius: 0,
            radius: 0,
            borderWidth: 1
        }
        ]
      },

      options: {
        animation: {
          duration: 0
        },
        onClick: function(value, index, values) {
          console.log('value: ', value, ' index: ', index, 'values: ', values);
          if (index && index.length) {
            console.log(index[0]._index);
          }
        },
        responsive: true,
        scales: {
          yAxes: [{
            ticks: {
              beginAtZero: true
            },
          }],
          xAxes: [{
           // ticks: {
           //   autoSkip: true,
           //   maxTicksLimit: 3
           //  }
            ticks: {
              // Include a dollar sign in the ticks
              callback: function(value, index, values) {
                if (value && value.length && value[0]=='0') {
                  return '';
                } else {
                  return value;
                }
              }
            }
          }]
        },
        legend: {
          labels: {
            boxWidth: 10,
            filter: function(item, chart) {
              // Logic to remove a particular legend item goes here
              return !!item.text;
            }
          },

        },
        tooltips: {
          callbacks: {
            label: function(tooltipItem, data) {
              var label = data.datasets[tooltipItem.datasetIndex].label || '';

              if (label) {
                label += ': ';
              }
              label += Math.round(tooltipItem.yLabel * 100) / 100;
              return label;
            }
          }
        },
        plugins: {
          // chartJsPluginErrorBars: {
          //   width: '60%',
          //   //color: 'darkgray'
          // }

          chartJsPluginErrorBars: {
            /**
             * stroke color, or array of colors
             * @default: derived from borderColor
             */
            //color: 'green',

            /**
             * bar width in pixel as number or string or bar width in percent based on the barchart bars width (max 100%), or array of such definition
             * @default 10
             */
            width: 10 ,

            /**
             * lineWidth as number, or as string with pixel (px) ending
             */
            lineWidth: 1 ,

            /**
             * whether to interpet the plus/minus values, relative to the value itself (default) or absolute
             * @default false
             */
            absoluteValues: true
          }
        }


      },

      kuku: chartJsPluginErrorBars,
      plugins: [
                {
                  // solution for dashed-line where there are missing points
                  // Based on: https://stackoverflow.com/questions/41600813/dashed-line-for-missing-data-in-chart-js-spangaps-style
                  // Drawing dashed-lines where values are missing
                  afterDraw: chart => {
                    var ctx = chart.chart.ctx;
                    ctx.save();
                    var xAxis = chart.scales['x-axis-0'];
                    var yAxis = chart.scales['y-axis-0'];
                    ctx.setLineDash([7, 3]);

                    for (var dataset of chart.data.datasets) {
                      if (dataset.ignoreEmptyValues) {
                        continue;
                      }
                      var valueFrom = null;
                      var valueFromIndex = 0;
                      var xFrom = null;
                      var yFrom = null;
                      ctx.strokeStyle = dataset.borderColor;
                      ctx.lineWidth = dataset.borderWidth;
                      dataset.data.forEach((value, index) => {
                        if (value != null) {
                          var x = xAxis.getPixelForTick(index);
                          var y = yAxis.getPixelForValue(value);
                          if (valueFrom != null) {
                            if (index - valueFromIndex > 1) {
                              ctx.beginPath();
                              ctx.moveTo(xFrom, yFrom);
                              ctx.lineTo(x, y);
                              ctx.stroke();
                            }
                          }
                          valueFrom = value;
                          valueFromIndex = index;
                          xFrom = x;
                          yFrom = y;
                        }
                      });
                    }
                    ctx.restore();
                  }
                }],
    };

    var myChart = new Chart(this.ctx, config);

    // nativeElement.onclick = function (evt) {
    //   var activePoint = myChart.lastActive[0];
    //   if (activePoint !== undefined) {
    //     var datasetIndex = activePoint._datasetIndex;
    //     var index = activePoint._index;
    //     var datasetName = myChart.data.datasets[datasetIndex].label;
    //     var title = myChart.data.labels[index];
    //     var dataValue = myChart.data.datasets[datasetIndex].data[index];
    //     alert("Dataset Name: [" + datasetName + "] title: [" + title + "] value: [" + dataValue + "]");
    //     console.log('activePoint' , activePoint );
    //
    //   }
    // };
  }

}

/*
 let gradient = (<any>this.chart).element.nativeElement.getContext('2d').createLinearGradient(0, 0, this.graphWidth-30, 0);
 gradient.addColorStop(0, '#dddddd');
 let actualColor = line.color;
 if (isComplementaryLine) {
 actualColor = this.getAverageColor(actualColor, '#777777'); //grayish
 actualColor = this.getAverageColor(actualColor, '#777777'); //even more grayish
 }

 gradient.addColorStop(1, actualColor);

 let lineChartColor: Color = {
 backgroundColor: actualColor,
 borderColor    : gradient
 };

 *** and can use the gradient as normal color fort the background (green range)
 */
