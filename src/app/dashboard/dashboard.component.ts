import { Component, ViewChild } from '@angular/core';
import { BaseChartDirective } from 'ng2-charts';
import * as moment from 'moment';
import { UtilsServiceService } from './../shared/services/utils-service.service';
import { DashboardService } from './dashboard.service';
import { DecimalPipe } from '@angular/common';

@Component({
    selector: 'app-dashboard',
    templateUrl: './dashboard.component.html',
    styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent {
    totalAmount = {
        customerToday: 0,
        totalOrders: 0,
        customerAvg: 0,
        newUser: 0
    };
    topSelling = {
        cannabis: [],
        cannabis_accessories: [],
        others: []
    }
    typeFilter: string = 'TODAY';
    orderFilter: string = 'TODAY';
    soldProductFilter: string = 'TODAY';
    salesPerEmployeeFilter: string = 'TODAY';
    avgSalesPerEmployeeFilter: string = 'TODAY';

    // Shared chart options
    globalChartOptions: any = {
        responsive: true,
        legend: {
            display: true,
            position: 'left'
        }
    };

    // Line Chart Configurations
    @ViewChild("lineChart") lineChart: BaseChartDirective;
    @ViewChild("piesChart") piesChart: BaseChartDirective;
    @ViewChild("salesPayment") salesPayment: BaseChartDirective;
    @ViewChild("salesOrder") salesOrder: BaseChartDirective;

    constructor(public dashboardService: DashboardService, public utils: UtilsServiceService, public decimalPipe: DecimalPipe) {
        this.getDashboard();
        this.paymentTypeChartFilter(this.typeFilter);
        this.orderChartFilter(this.orderFilter);
        this.soldProductChartChartFilter(this.soldProductFilter);
        this.salesPerEmployeeChartFilter(this.salesPerEmployeeFilter);
        this.avgSalesPerEmployeeChartFilter(this.avgSalesPerEmployeeFilter);
    }

    getDashboard() {
        let today = moment().format('YYYY-MM-DD') + '00:00:00'; 
        let current_date = this.utils.get_utc_from_to_date(today);
        var TZ = this.utils.getTimeZone(); //timezone
        let params = 'date=' + current_date + '&tz=' + encodeURIComponent(TZ); 
        this.dashboardService.getDashboard(params.trim()).subscribe((response: any) => {
            if (response.success) {
                let { data, data: { totalData: totalData } } = response;
                if (totalData.totalOrders.length) {
                    this.totalAmount.totalOrders = totalData.totalOrders[0].vvalue || 0;
                }
                if (totalData.newUser.length) {
                    this.totalAmount.newUser = totalData.newUser[0].vvalue || 0;
                }
                if (totalData.customerToday.length) {
                    this.totalAmount.customerToday = totalData.customerToday[0].vvalue || 0;
                }
                if (totalData.customerAvg.length) {
                    this.totalAmount.customerAvg = totalData.customerAvg[0].vvalue || 0;
                }

                this.topSelling.cannabis = data.cannabis;
                this.topSelling.cannabis_accessories = data.cannabis_accessories;
                this.topSelling.others = data.others;

                //Sales chart data bind
                this.linesChart(data);
            }
        });
    }

    //#region --------------------------------  Top Selling Products chart start --------------------------------
    // Pie
    pieChartLabels: any[] = [];
    pieChartData: number[] = [];
    pieChartColors: any[] = [{
        backgroundColor: ['#5899DA', '#E8743B',
            '#19A979', '#ED4A7B',
            '#945ECF', '#13A4B4',
            '#525DF4', '#BF399E',
            '#6C8893', '#EE6868',
            '#2F6497'
        ]
    }];
    pieStatus = { cannabis: 0, accessories: 0, others: 0 };
    pieChartType = 'pie';
    soldProductData: any;
    pieOptions: any = Object.assign({
        cutoutPercentage: 0,
        borderWidth: 0,
        tooltips: {
            callbacks: {
                label: (tooltipItem: any, data: any) => {
                    let label = data.labels[tooltipItem.index];
                    let datasetLabel = data.datasets[tooltipItem.datasetIndex].data[tooltipItem.index];
                    return label + ': ' + datasetLabel + this.soldProductData[tooltipItem.index].product_unit;
                }
            }
        },
    }, this.globalChartOptions);

    soldProductChart(data) {
        let d = [], l = [];
        let other = 0, limit = 5;
        let counter = { cannabis: 0, accessories: 0, others: 0 };
        for (let i = 0; i < data.soldProduct.length; i++) {
            switch (data.soldProduct[i].product_type_slug) {
                case "cannabis":
                    counter.cannabis++;
                    break;
                case "cannabis accessories":
                    counter.accessories++;
                    break;
                default:
                    counter.others++;
            }
            if (i >= limit) other += +data.soldProduct[i].vvalue;
        }

        for (let i = 0; i < data.soldProduct.length && i < limit; i++) {
            d.push(data.soldProduct[i].vvalue);
            l.push((data.soldProduct[i].product_name).substr(0, 20));
        }

        if (other > 0) {
            d.push(other);
            l.push('Others');
        }

        this.pieChartData = d;
        setTimeout(() => this.pieChartLabels = l);

        this.pieStatus = {
            cannabis: Boolean(counter.cannabis) ? +(counter.cannabis * 100 / data.soldProduct.length).toFixed(2) : 0,
            accessories: Boolean(counter.accessories) ? +(counter.accessories * 100 / data.soldProduct.length).toFixed(2) : 0,
            others: Boolean(counter.others) ? +(counter.others * 100 / data.soldProduct.length).toFixed(2) : 0
        };
    }

    soldProductChartChartFilter(filter) {
        this.dashboardService.getSoldProductData(this.getFilterStartEndDate(filter))
            .subscribe((response: any) => {
                if (response.success) {
                    this.soldProductData = response.data;
                    this.soldProductChart({ 'soldProduct': response.data });
                }
            });
    }
    //#endregion --------------------------------  Top Selling Products chart end --------------------------------

    //#region --------------------------------  Sales By Payment Type --------------------------------
    salesdoughnutChartColors: any[] = [{
        backgroundColor: ['#5899DA', '#E8743B', '#19A979', '#ED4A7B', '#945ECF']
    }];
    salesdoughnutOptions: any = Object.assign({
        elements: {
            arc: {
                borderWidth: 0
            }
        },
        tooltips: {
            callbacks: {
                label: (tooltipItem, data) => {
                    var label = data.labels[tooltipItem.index];
                    var datasetLabel = data.datasets[tooltipItem.datasetIndex].data[tooltipItem.index];
                    return label + ': $' + this.decimalPipe.transform(datasetLabel, '1.2-2');
                }
            }
        },
    }, this.globalChartOptions);
    paymentType: any = [];
    paymentTypeChartData: any = [];
    paymentTypeChartLabels: string[] = [];
    paymentTypeChartFilter(filter) {
        this.dashboardService.getPayementTypeData(this.getFilterStartEndDate(filter)).subscribe((response: any) => {
            if (response.success) {
                this.paymentTypechart(response.data);
            }
        });
    }

    paymentTypechart(typeData) {
        this.paymentType = []
        this.paymentTypeChartData = [];
        this.paymentTypeChartLabels = [];
        let label = []
        if (typeData.length != 0) {
            var total_amt = typeData.map(item => item.vvalue).reduce((prev, next) => +prev + +next);
            if (total_amt) {
                for (let i = 0; i < typeData.length; i++) {
                    let data = typeData[i];
                    typeData[i].percent = +((data.vvalue * 100) / total_amt).toFixed(2);
                    this.paymentType.push(typeData[i])
                    this.paymentTypeChartData.push(+data.vvalue);
                    label.push(data.txn_mode);
                }

            }
        }
        setTimeout(() => this.paymentTypeChartLabels = label);
    }
    //#endregion --------------------------------  Sales By Payment Type end --------------------------------

    //#region --------------------------------  Doughchart Used for order type start --------------------------------
    orderChartFilter(filter) {
        this.dashboardService.getOrdersData(this.getFilterStartEndDate(filter))
            .subscribe((response: any) => {
                if (response.success) {
                    this.doughchart(response.data);
                }
            });
    }

    doughnutChartColors: any[] = [{
        backgroundColor: ['#5899DA', '#E8743B', '#19A979', '#ED4A7B', '#945ECF']
    }];
    doughnutChartLabels: string[] = [];
    doughnutChartData: any[] = [];
    doughnutChartType = 'doughnut';
    order: any = [];
    doughnutOptions: any = {
        responsive: true,
        legend: {
            display: true,
            position: 'left'
        },
        tooltips: {
            callbacks: {
                label: (tooltipItem: any, data: any) => this.updateTooltip(tooltipItem, data)
            }
        },
        cutoutPercentage: 50,
        arc: {
            borderWidth: 0
        }
    };

    doughchart(typeData) {
        this.doughnutChartData = [];
        this.doughnutChartLabels = [];
        let label = []
        this.order = [];
        if (typeData.length != 0) {
            let total_orders = typeData.map(item => item.amount).reduce((prev, next) => +prev + +next);
            if (total_orders) {

                for (let i = 0; i < typeData.length; i++) {
                    let data = typeData[i];
                    typeData[i].percent = +((data.amount * 100) / total_orders).toFixed(2);
                    this.order.push(typeData[i])
                    this.doughnutChartData.push(+data.amount);
                    label.push(data.kkey);
                }

            }
        }
        setTimeout(() => this.doughnutChartLabels = label);
    }
    //#endregion --------------------------------  Doughchart Used for order type end --------------------------------

    //#region -------------------------------- Sales chart start --------------------------------
    lineChartOptions: any = Object.assign({
        responsive: true,
        legend: {
            display: true,
            position: 'top',
            onClick: function (e: any, legendItem) {
                let index = legendItem.datasetIndex;
                let ci = this.chart;
                let alreadyHidden = (ci.getDatasetMeta(index).hidden === null) ? false : ci.getDatasetMeta(index).hidden;
                ci.data.datasets.forEach(function (e, i) {
                    let meta = ci.getDatasetMeta(i);
                    if (i !== index) {
                        if (!alreadyHidden) {
                            meta.hidden = meta.hidden === null ? !meta.hidden : null;
                        } else if (meta.hidden === null) {
                            meta.hidden = true;
                        }
                    } else if (i === index) {
                        meta.hidden = null;
                    }
                });
                ci.update();
            },
        },
        scales: {
            yAxes: [{
                ticks: {
                    beginAtZero: true,
                    callback: (originalValue: any) => {
                        return '$' + this.decimalPipe.transform(originalValue, '1.0-2');
                    }
                },
            }]
        },
        tooltips: {
            callbacks: {
                label: (tooltipItem: any, data: any) => this.updateTooltip(tooltipItem, data)
            }
        }
    });

    updateTooltip(tooltipItem: any, data: any) {
        let label = data.labels[tooltipItem.index];
        let datasetLabel = data.datasets[tooltipItem.datasetIndex].data[tooltipItem.index];
        return label + ': $' + this.decimalPipe.transform(datasetLabel, '1.2-2');
    }
    lineChartLabels: Array<any> = [];
    lineChartColors: Array<any> = [{
        backgroundColor: 'rgba(40,177,39,0.2)',
        borderColor: 'rgba(40,177,39,1)',
        pointBackgroundColor: 'rgba(40,177,39,1)',
        pointBorderColor: '#fff',
        pointHoverBackgroundColor: '#fff',
        pointHoverBorderColor: 'rgba(40,177,39,0.8)'
    }, {
        backgroundColor: 'rgba(1,60,1,0.2)',
        borderColor: 'rgba(1,60,1,1)',
        pointBackgroundColor: 'rgba(1,60,1,1)',
        pointBorderColor: '#fff',
        pointHoverBackgroundColor: '#fff',
        pointHoverBorderColor: 'rgba(1,60,1,1)'
    }];

    lineChartSteppedData: Array<any> = [];
    lineChartPointsData: Array<any> = [];

    lineChartData: any = [{
        data: [],
        label: 'Sales($)',
        borderWidth: 1,
        bezierCurve: false
    }, {
        data: [],
        label: 'Refund($)',
        borderWidth: 1,
        bezierCurve: false
    }];
    // lINE CHART
    linesChart(data) {
        if (Boolean(data) && data.salesChart.length) {
            this.lineChartLabels = [];
            this.lineChartData = [
                { data: [], label: 'Sales($)' },
                { data: [], label: 'Refund($)' },
            ];
            data.salesChart.forEach((element: any) => {
                this.lineChartLabels.push(moment(this.utils.convertLocalDateToUTCDate(element.ddate, false)).format('MMM DD'));
                this.lineChartData[0].data.push(element.vvalue);
                this.lineChartData[1].data.push(element.refund_value)
            });
            this.reloadChart(this.lineChart, this.lineChartData, this.lineChartLabels);
        }
    }
    //#endregion -------------------------------- Sales chart end --------------------------------

    //#region -------------------------------- Sales per employee chart start --------------------------------
    @ViewChild("salesEmp") salesEmp: BaseChartDirective;
    barChartLabels: any[] = [];
    barChartData: any[] = [{
        data: [],
        label: 'Cash',
        borderWidth: 0
    }, {
        data: [],
        label: 'Card+',
        borderWidth: 0
    }];
    empSalesChartOptions: any = Object.assign({
        scaleShowVerticalLines: false,
        tooltips: {
            mode: 'index',
            intersect: false,
            callbacks: {
                label: (tooltipItem: any, data: any) => {
                    var label = data.datasets[tooltipItem.datasetIndex].label;
                    var datasetLabel = data.datasets[tooltipItem.datasetIndex].data[tooltipItem.index];
                    return label + ': $' + this.decimalPipe.transform(datasetLabel, '1.2-2');
                }
            }
        },
        responsive: true,
        scales: {
            xAxes: [{
                gridLines: {
                    color: 'rgba(0,0,0,0.02)',
                    defaultFontColor: 'rgba(0,0,0,0.02)',
                    zeroLineColor: 'rgba(0,0,0,0.02)'
                },
                stacked: true,
                ticks: {
                    beginAtZero: true,

                }
            }],
            yAxes: [{
                gridLines: {
                    color: 'rgba(0,0,0,0.02)',
                    defaultFontColor: 'rgba(0,0,0,0.02)',
                    zeroLineColor: 'rgba(0,0,0,0.02)'
                },
                stacked: true,
                ticks: {
                    beginAtZero: true,
                    callback: (originalValue: any) => {
                        return '$' + this.decimalPipe.transform(originalValue, '1.0-2');
                    }
                }
            }]
        },
    }, this.globalChartOptions);

    //Get filter data from API
    salesPerEmployeeChartFilter(filter) {
        this.dashboardService.getSalesEmployee(this.getFilterStartEndDate(filter)).subscribe((result: any) => {
            if (result.success) {
                //if(result.data.length>0){
                this.salesEmployeeChart(result.data);
                //}
            }
        })
    }

    salesEmployeeChart(data) {
        this.barChartData = [];
        this.barChartLabels = [];
        let label = [];
        if (Boolean(data)) {
            let salesCash: Array<number> = [];
            let salesCard: Array<number> = [];
            data.forEach(element => {
                label.push(element.emp_name);
                salesCash.push(element.cash_sales);
                salesCard.push(element.card_sales);
            });
            this.barChartData = [{
                data: salesCash,
                label: 'Cash',
                borderWidth: 0
            }, {
                data: salesCard,
                label: 'Card+',
                borderWidth: 0
            }];
        }
        setTimeout(() => this.barChartLabels = label);
    }


    //#endregion -------------------------------- Sales per employee chart end --------------------------------

    //#region -------------------------------- Sales employee avg chart --------------------------------
    @ViewChild("salesAvgEmp") salesAvgEmp: BaseChartDirective;
    empAvgChartLabels: any = [];
    empAvgChartData: any[] = [{
        data: [],
        label: 'Average Sales',
        borderWidth: 0
    }];

    empAvgChartOptions: any = {
        scaleShowVerticalLines: false,
        tooltips: {
            mode: 'index',
            intersect: false,
            callbacks: {
                label: (tooltipItem: any, data: any) => {
                    let label = data.datasets[tooltipItem.datasetIndex].label;
                    let datasetLabel = data.datasets[tooltipItem.datasetIndex].data[tooltipItem.index];
                    return label + ': $' + this.decimalPipe.transform(datasetLabel, '1.2-2');
                }
            }
        },

        responsive: true,
        scales: {
            xAxes: [{
                gridLines: {
                    color: 'rgba(0,0,0,0.02)',
                    defaultFontColor: 'rgba(0,0,0,0.02)',
                    zeroLineColor: 'rgba(0,0,0,0.02)'
                },
                stacked: true,
                ticks: {
                    beginAtZero: true,
                }
            }],
            yAxes: [{
                gridLines: {
                    color: 'rgba(0,0,0,0.02)',
                    defaultFontColor: 'rgba(0,0,0,0.02)',
                    zeroLineColor: 'rgba(0,0,0,0.02)'
                },
                stacked: true,
                ticks: {
                    beginAtZero: true,
                    callback: (originalValue) => {
                        return '$' + this.decimalPipe.transform(originalValue, '1.0-2');
                    }
                }
            }]
        },
        legend: {
            display: false,
            position: 'left'
        }
    };
    //Get filter data from API
    avgSalesPerEmployeeChartFilter(filter: any) {
        this.dashboardService.getAvgSalesEmployee(this.getFilterStartEndDate(filter)).subscribe((result: any) => {
            if (result.success) {
                this.salesAvgEmployeeChart(result.data);
            }
        })
    }
    //Set data to chart
    salesAvgEmployeeChart(data) {
        this.empAvgChartLabels = [];
        this.empAvgChartData = [];
        let label = [];
        if (Boolean(data)) {
            let sales: Array<number> = [];
            data.forEach(element => {
                label.push(element.emp_name);
                sales.push(element.avg_sales);
            });
            this.empAvgChartData = [{
                data: sales,
                label: 'Average Sales',
                borderWidth: 0
            }];
        }
        setTimeout(() => this.empAvgChartLabels = label);
    }
    //#endregion -------------------- Sales employee avg chart end ------------------------------

    //Get filter start date and end date from type
    getFilterStartEndDate(type: any) {
        let dateObject = { from: '', to: '' };
        switch (type) {
            case 'TODAY':
                dateObject.from = moment().format('YYYY-MM-DD') + ' 00:00:00';
                dateObject.to = moment().format('YYYY-MM-DD') + ' 23:59:59'
                break;
            case 'LAST_WEEK':
                dateObject.from = moment().subtract(1, 'weeks').startOf('isoWeek').format('YYYY-MM-DD') + ' 00:00:00';
                dateObject.to = moment().subtract(1, 'weeks').endOf('isoWeek').format('YYYY-MM-DD') + ' 23:59:59'
                break;
            case 'CURRENT_MONTH':
                dateObject.from = moment().startOf('month').format('YYYY-MM-DD') + ' 00:00:00';
                dateObject.to = moment().endOf('month').format('YYYY-MM-DD') + ' 23:59:59'
                break;
            case 'CURRENT_YEAR':
                dateObject.from = moment().startOf('year').format('YYYY-MM-DD') + ' 00:00:00';
                dateObject.to = moment().endOf('year').format('YYYY-MM-DD') + ' 23:59:59'
                break;
            default:
                break;
        }
        return dateObject
    }

    reloadChart(chart: any, datasets: any, labels: any) {
        if (chart !== undefined) {
            chart.chart.destroy();
            chart.chart = 0;
            chart.datasets = datasets;
            chart.labels = labels;
            chart.ngOnInit();
        }
    }

    // chart color
    chartColors: Array<any> = [{
        backgroundColor: '#28b127',
    }, {
        backgroundColor: '#e0f3e0',
    }];
}
