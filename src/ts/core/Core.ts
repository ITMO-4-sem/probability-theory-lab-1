
export class Core {

    public calculate( sample: Array<number> ): CalculationResult {

        if ( sample.length < 1 ) {
            throw new Error('Invalid sample. Sample length must be not less then 1.');
        }

        sample.sort( (a, b) => a - b);

        const minValue = sample[0];
        const maxValue = sample[sample.length - 1];
        const scope = maxValue - minValue;

        const statisticalDistributionRelativeFreq: Range = {
            x: [],
            y: []
        };
        const statisticalDistributionFreq: Range = {
            x: [],
            y: []
        };

        const sampleSize = sample.length;

        const sampleSet = new Set(sample);
        
        for ( const elem of sampleSet ) {
            const numOfOccurrences = this.countOccurrences(sample, elem);
            statisticalDistributionRelativeFreq.x.push( elem );
            statisticalDistributionRelativeFreq.y.push( numOfOccurrences / sampleSize );

            statisticalDistributionFreq.x.push( elem );
            statisticalDistributionFreq.y.push( numOfOccurrences );
        }

        // console.log('i : ', statisticalDistributionRelativeFreq[0]);

        // console.warn('statisticalDistributionRelativeFreq = ', statisticalDistributionRelativeFreq);

        let expectation = 0;

        for ( let i = 0; i < statisticalDistributionRelativeFreq.x.length; i++ ) {
            expectation += statisticalDistributionRelativeFreq.x[i] * statisticalDistributionRelativeFreq.y[i];
        }

        // console.warn('expected value:', expectation);

        let dispersion = 0;

        for ( let i = 0; i < statisticalDistributionRelativeFreq.x.length; i++ ) {
            dispersion += Math.pow(statisticalDistributionRelativeFreq.x[i] - expectation, 2) * statisticalDistributionRelativeFreq.y[i];
        }

        // console.warn('Dispesion is : ', dispersion);

        const standardDeviation = Math.sqrt( dispersion); // СКО
        // console.warn('cko = ', standardDeviation);

        // const distributionFunction = JSON.parse(JSON.stringify(statisticalDistributionRelativeFreq));


        // distributionFunction.unshift( new Array(-Infinity, 0) );
        // for ( let i = 1; i < distributionFunction.length ; i++ ) {
        //     distributionFunction[i][1] += distributionFunction[i - 1][1];
        // }



        const distributionFunction = this.getDistributionFunction(statisticalDistributionRelativeFreq);

        // console.warn('distributionFunction = ', distributionFunction);



        const h = (maxValue - minValue) / (1 + Math.log2(sampleSize));

        let xStart = minValue - h / 2;

        const intervalDistribution = new Array<DistributionIntervalDataset>();

        while ( xStart < maxValue ) {
            const interval = {
                start: xStart,
                end: xStart + h
            };

            intervalDistribution.push(
                {
                    interval: interval,
                    value: this.getNumOfIntervalOccurrencies( interval, statisticalDistributionFreq ) / h
                }
            );

            xStart += h;
        }

        // console.warn('Histogram: ', intervalDistribution);

        return {
            variationalSample: sample, // вариационный ряд
            minValue: minValue,
            maxValue: maxValue,
            scope: scope, // Размах
            expectation: expectation,
            standardDeviation: standardDeviation, // СКО
            distributionFreq: statisticalDistributionFreq, // статистическое распределение с частотами,
            distributionFunction: distributionFunction, // функция распределения
            intervalDistribution: intervalDistribution// интервальное статистическое распределение с
            // частотами - гистограмма строится по нему
        };
    }





    private countOccurrences<T>(array: Array<T>, elem: T): number {
        let counter: number = 0;
        for ( let i = 0; i < array.length; i ++ ) {
            if ( array[i] === elem ) {
                counter++;
            }
        }
        return counter;
    }


    private getDistributionFunction(statisticalDistribution: Range): Array<DistributionIntervalDataset> {

        const distributionFunction = new Array<DistributionIntervalDataset>();
        let probabilityCounter = statisticalDistribution.y[0];

        distributionFunction.push(
            {
                interval: {
                    start: -Infinity,
                    end: statisticalDistribution.x[0]
                },
                value: 0
            }
        );

        for ( let i = 0; i < statisticalDistribution.x.length - 1; i++ ) {
            distributionFunction.push(
                {
                    interval: {
                        start: statisticalDistribution.x[i],
                        end: statisticalDistribution.x[i + 1]
                    },
                    value: probabilityCounter
                }
            );
            probabilityCounter += statisticalDistribution.y[i + 1];
        }

        distributionFunction.push(
            {
                interval: {
                    start: statisticalDistribution.x[statisticalDistribution.x.length - 1],
                    end: +Infinity
                },
                value: 1
            }
        );
        return distributionFunction;
    }


    private getNumOfIntervalOccurrencies(interval: Interval, range: Range) {
        let counter = 0;

        for ( let i = 0; i < range.x.length; i++ ) {
            if ( range.x[i] >= interval.start && range.x[i] <= interval.end ) {
                counter += range.y[i];
            }
        }

        return counter;
    }
}


export interface DistributionIntervalDataset {
    interval: Interval,
    value: number
}

export interface Range {
    x: Array<number>,
    y: Array<number>
}

export interface Interval {
    start: number,
    end: number
}

export interface CalculationResult {
    variationalSample: Array<number>, // вариационный ряд
    minValue: number,
    maxValue: number,
    scope: number, // Размах
    expectation: number, // мат ожидание
    standardDeviation: number, // СКО
    distributionFreq: Range, // статистическое распределение с частотами,
    distributionFunction: Array<DistributionIntervalDataset>, // функция распределения
    intervalDistribution: Array<DistributionIntervalDataset>// интервальное статистическое распределение с частотами
}