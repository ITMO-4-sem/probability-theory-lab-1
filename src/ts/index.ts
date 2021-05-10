import '@scss/index.scss'; // is necessary for connecting styles to index.html
import { InputsSequence } from '@/components/InputsSequence/InputsSequence';
import { FileInput } from '@/components/FileInput/FileInput';
import { CalculationResult, Core } from '@ts/core/Core';

import Chart from 'chart.js/auto';
import { ToggleSwitch } from '@/components/ToggleSwitch/ToggleSwitch';
import { Mode } from '@/components/InputsSequence/ts/Mode';


const inputsSequence = new InputsSequence({initInputsNumber: 1});
const fileInput = new FileInput();
const toggleSwitch = new ToggleSwitch();

const core = new Core();

const COLOR_OLIVE_YELLOW =  '#C19434';



toggleSwitch.onSwitchToggled( {

    onToggled(isChecked: boolean) {
        if ( isChecked ) {
            inputsSequence.setMode( Mode.DELETE );
        } else  {
            inputsSequence.setMode( Mode.ADD );
        }
    }
});

fileInput.onFileChosen( {
    onChosen: (file) => {
        console.log('got file:', file.name);
}});



const sample = new Array<number>(
    1, 4, 7, 1, 9, 11, 2, 11, 11, 4, 5
    //   1, 1, 2, 4, 4, 7, 9, 11, 11, 11,
);


const result = core.calculate(sample);

console.warn('result = ', result);

const distributionFreqPolygonCTX = (document.querySelector('.distribution-freq-polygon') as HTMLCanvasElement ).getContext('2d');
const intervalDistributionHistogramCTX = (document.querySelector('.interval-distribution-histogram') as HTMLCanvasElement ).getContext('2d');
const distributionFuncPlotCTX = (document.querySelector('.distribution-func-plot') as HTMLCanvasElement ).getContext('2d');

if ( distributionFreqPolygonCTX === null || intervalDistributionHistogramCTX === null || distributionFuncPlotCTX === null ) {
    throw new Error('There is no proper html canvas elements.');
}

drawDistributionFreqPolygon(result, distributionFreqPolygonCTX);
drawIntervalDistributionHistogram(result, intervalDistributionHistogramCTX);
drawDistributionFuncPlot(result, distributionFuncPlotCTX);



function drawDistributionFreqPolygon(result: CalculationResult, ctx:  CanvasRenderingContext2D) {
    const distributionFreqPolygon = new Chart( ctx, {
        type: 'bar',
        data: {
            labels: result.distributionFreq.x,
            datasets: [{
                type: 'line',
                label: 'Line Dataset',
                data: result.distributionFreq.y,
                borderColor: COLOR_OLIVE_YELLOW,
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
    } );
}


function drawIntervalDistributionHistogram(result: CalculationResult, ctx:  CanvasRenderingContext2D ) {

    const intervalDistribution = result.intervalDistribution;
    const intervalsMiddles = [];
    const values = [];
    for ( const elem of intervalDistribution ) {
        intervalsMiddles.push( elem.interval.end.toFixed( 2 ) );
        values.push( elem.value );
    }
    const intervalDistributionHistogram = new Chart( ctx, {
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
                }, {
                    type: 'line',
                    label: 'Line Dataset',
                    data: values,
                    borderColor: COLOR_OLIVE_YELLOW,
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
    } );
}


function drawDistributionFuncPlot(result: CalculationResult, ctx:  CanvasRenderingContext2D) {
    const distributionFuncPlotXValues = [0];
    const distributionFuncPlotYValues = [0];
    for ( let i = 1; i < result.distributionFunction.length; i++ ) {
        distributionFuncPlotXValues.push( result.distributionFunction[i].interval.start );

        distributionFuncPlotYValues.push( result.distributionFunction[i].value );
    }

    distributionFuncPlotXValues.push( result.distributionFunction[result.distributionFunction.length - 1].interval.end + 1 );
    distributionFuncPlotYValues.push( 1 );

    const distributionFuncPlot = new Chart( ctx, {
        type: 'bar',
        data: {
            labels: distributionFuncPlotXValues,
            datasets: [
                {
                    type: 'line',
                    label: 'Line Dataset',
                    data: distributionFuncPlotYValues,
                    borderColor: COLOR_OLIVE_YELLOW,
                    tension: 0,
                    stepped: true,

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
    } );
}























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
