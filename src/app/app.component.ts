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
    this.draw();
  }

  draw() {
    var myChart = new Chart(this.ctx, {
      type: 'line',
      plugins: [chartJsPluginErrorBars],
      data: {
        labels: ['08:00', '09:00', '10:00', '11:00', '12:00', '13:00'],
        datasets: [
          {
            label: 'values', //'# top_range',
            data: [9, 14, , 4, 1, 2],
            errorBars: {
              '08:00': {plus: 15, minus: 7},
              '09:00': {plus: 20, minus: 9},
              //'10:00': {plus: 4, minus: 2},
              '11:00': {plus: 6, minus: 0},
              '12:00': {plus: 2, minus: 1},
              '13:00': {plus: 3.5, minus: 1},
           },
            borderColor: 'rgba(111, 111, 255, 1)',
            fill: false
          },
          {
            label: '', //'# bottom_range',
            data: [7, 13, 3, 1, 0, 2],
            borderColor: 'rgba(0, 255, 0, 1)',
            fill: false,
            pointRadius: 0,
            radius: 0


          },
          {
            label: '', //'# top range',
            data: [12, 19, 3, 5, 2, 3],
            fill: '-1',
            borderColor: 'rgba(255, 99, 132, 1)',
            backgroundColor: 'rgba(0, 255, 0, 0.5)',
            pointRadius: 0,
            radius: 0,
            borderWidth: 1
        }]
      },
      options: {
        responsive: true,
        scales: {
          yAxes: [{
            ticks: {
              beginAtZero: true
            },
          }],
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
            color: 'green',

            /**
             * bar width in pixel as number or string or bar width in percent based on the barchart bars width (max 100%), or array of such definition
             * @default 10
             */
            width: 20 ,

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


      }
    });
  }

}
