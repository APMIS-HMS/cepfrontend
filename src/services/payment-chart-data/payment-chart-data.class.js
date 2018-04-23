/* eslint-disable no-unused-vars */
const format = require('date-fns/format');
class Service {
  constructor(options) {
    this.options = options || {};
  }

  setup(app) {
    this.app = app;
  }

  find(params) {
    return Promise.resolve([]);
  }

  async get(id, params) {
    const invoicesService = this.app.service('invoices');
    let cParamDt = new Date(params.query.cDate);
    let pParamDt = new Date(params.query.pDate);
    let lineChartData = [];
    let lineChartLabels = [];
    let lineChartColors = [];

    const lineChartLegend = true;
    const lineChartType = 'line';
    const lineChartOptions = {
      responsive: true
    };

    const filterDate = await invoicesService.find({
      query: {
        facilityId: id,
        paymentCompleted: true,
        $and: [{
            updatedAt: {
              $gte: pParamDt
            }
          },
          {
            updatedAt: {
              $lte: cParamDt
            }
          }
        ]
      }
    }); //updatedAt
    filterDate.data.forEach(element => {
      element.payments.forEach(bill => {
        const d = new Date((bill.paymentDate));
        const dt = format(d, 'Do MMM');
        lineChartLabels.push(dt)
      });
    });
    filterDate.data.forEach(element => {
      element.payments.forEach(bill => {
        if (bill.facilityServiceObject !== undefined && bill.facilityServiceObject !== null) {
          const elements = lineChartData.filter(x => x.label.toString() === bill.facilityServiceObject.category.toString());
          if (elements.length > 0) {
            // lineChartLabels.forEach(itemO=>{

            // });
            elements[0].data.push(bill.amountPaid)
          } else {
            lineChartData.push({
              label: bill.facilityServiceObject.category,
              data: []
            })
          }
          const d = new Date((bill.paymentDate));
          const dt = format(d, 'Do MMM');
          lineChartLabels.push(dt)
        }
      });
    });

    

    lineChartColors = [{ // grey
        backgroundColor: 'rgba(148,159,177,0.2)',
        borderColor: 'rgba(148,159,177,1)',
        pointBackgroundColor: 'rgba(148,159,177,1)',
        pointBorderColor: '#fff',
        pointHoverBackgroundColor: '#fff',
        pointHoverBorderColor: 'rgba(148,159,177,0.8)'
      },
      { // dark grey
        backgroundColor: 'rgba(77,83,96,0.2)',
        borderColor: 'rgba(77,83,96,1)',
        pointBackgroundColor: 'rgba(77,83,96,1)',
        pointBorderColor: '#fff',
        pointHoverBackgroundColor: '#fff',
        pointHoverBorderColor: 'rgba(77,83,96,1)'
      },
      { // grey
        backgroundColor: 'rgba(148,159,177,0.2)',
        borderColor: 'rgba(148,159,177,1)',
        pointBackgroundColor: 'rgba(148,159,177,1)',
        pointBorderColor: '#fff',
        pointHoverBackgroundColor: '#fff',
        pointHoverBorderColor: 'rgba(148,159,177,0.8)'
      }
    ];

    let chartData = {
      lineChartData: lineChartData,
      lineChartLabels: lineChartLabels,
      lineChartColors: lineChartColors,
      lineChartLegend: lineChartLegend,
      lineChartType: lineChartType,
      lineChartOptions: lineChartOptions
    }


    return chartData;
  }

  create(data, params) {
    if (Array.isArray(data)) {
      return Promise.all(data.map(current => this.create(current)));
    }

    return Promise.resolve(data);
  }

  update(id, data, params) {
    return Promise.resolve(data);
  }

  patch(id, data, params) {
    return Promise.resolve(data);
  }

  remove(id, params) {
    return Promise.resolve({
      id
    });
  }
}

module.exports = function (options) {
  return new Service(options);
};

module.exports.Service = Service;
