import '@scss/index.scss'; // is necessary for connecting styles to index.html

import { InputsSequenceComponent } from '@/components/InputsSequenceComponent/InputsSequenceComponent';
import { Core } from '@ts/core/Core';

import Chart from 'chart.js/auto';

const inputsSequenceComponent = new InputsSequenceComponent({initInputsNumber: 1});



// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
window.inputsSequenceComponent = inputsSequenceComponent;




const sample = new Array<number>(
    1, 4, 7, 1, 9, 11, 2, 11, 11, 4, 5
    //   1, 1, 2, 4, 4, 7, 9, 11, 11, 11,
);

const core = new Core();

const result = core.calculate(sample);

console.warn('result = ', result);

const ctx = (document.querySelector('.distribution-freq-polygon') as HTMLCanvasElement ).getContext('2d');
const myChart = new Chart(ctx, {
    type: 'bar',
    data: {
        labels: result.distributionFreq.x,
        datasets: [{
                type: 'line',
                label: 'Line Dataset',
                data: result.distributionFreq.y,
                borderColor: 'rgb(75, 192, 192)',
            },

        ],
    },
    options: {
        responsive: true,
        maintainAspectRatio: false,
        scales: {
            x: {
               offset: true
            }
            // offset: true
        }
    }
});

const ctx2 = (document.querySelector('.interval-distribution-histogram') as HTMLCanvasElement ).getContext('2d');
const intervalDistribution = result.intervalDistribution;
const intervalsMiddles = [];
const values = [];
for ( const elem of intervalDistribution ) {
    intervalsMiddles.push( elem.interval.end.toFixed(2) );
    values.push( elem.value );
}
const myChart2 = new Chart(ctx2, {
    type: 'bar',
    data: {
        labels: intervalsMiddles,
        datasets: [
            {
            type: 'bar',
            label: 'Line Dataset',
            data: values,
            borderColor: 'rgb(75, 192, 192)',
            barPercentage: 1,
            categoryPercentage: 1.0,
            },  {
                type: 'line',
                label: 'Line Dataset',
                data: values,
                borderColor: 'rgb(75, 192, 192)',
                tension: 0.4
            },

        ],
    },
    options: {
        responsive: true,
        maintainAspectRatio: false,
        scales: {
            x: {
                offset: true
            }
            // offset: true
        }
    }
});

// const ctx = (document.querySelector('.distribution-freq-polygon') as HTMLCanvasElement ).getContext('2d');
// const myChart = new Chart(ctx, {
//     type: 'bar',
//     data: {
//         labels: ['...', '150', '160', '180', 'Green', 'Purple', 'Orange'],
//         datasets: [
//             {
//                 type: 'bar',
//                 label: '# of Votes',
//                 data: [0, 12, 19, 3, 5, 2, 3],
//                 barPercentage: 1,
//                 categoryPercentage: 1.0,
//
//             }, {
//                 type: 'line',
//                 label: 'Line Dataset',
//                 data: [12, 12, 19, 3, 5, 2, 3],
//                 borderColor: 'rgb(75, 192, 192)',
//             },
//             // {
//             //     type: 'line',
//             //     label: 'Line Dataset',
//             //     data: [
//             //         {x:50, y:40}, {x:28, y:2}],
//             // }, {
//             //     type: 'line',
//             //     label: 'Line Dataset',
//             //     data: [50, 50],
//             //     borderColor: 'rgb(75, 192, 192)',
//             // }, {
//             //     type: 'line',
//             //     label: 'Line Dataset',
//             //     data: [40, 40],
//             //     borderColor: 'rgb(75, 192, 192)',
//             //     borderDash: [10,1]
//             // },
//
//
//         ],
//     },
//     options: {
//         responsive: true,
//         maintainAspectRatio: false,
//         scales: {
//             x: {
//                offset: true
//             }
//             // offset: true
//         }
//     }
// });
