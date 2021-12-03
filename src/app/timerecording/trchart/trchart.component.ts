
import { TrService } from '../tr.service';
import * as echarts from 'echarts';
import { tap } from 'rxjs';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-trchart',
  templateUrl: './trchart.component.html',
  styleUrls: ['./trchart.component.css']
})
export class TrchartComponent implements OnInit {
  chartOptions: any = {};
  selectedDate: any;
  selectedDateStart: any;
  selectedDateEnd: any;
  lineChart: any;
  lineoption: any = {};
  lineChartMoreDays: any;
  lineChartMoreDaysOption: any = {};
  constructor(private trService: TrService) { }

  ngOnInit(): void {
    this.chartOptions = this.getChartOptions();
  }

  showLast7DaysDiagramInterval() {
    this.showLastDaysDiagramInterval(8);
  }

  showLast14DaysDiagramInterval() {
    this.showLastDaysDiagramInterval(15);
  }

  showLast31DaysDiagramInterval() {
    this.showLastDaysDiagramInterval(32);
  }

  showLastDaysDiagramInterval(days: number) {
    if (this.checkValid()) {
      let dateArrayTmp = "";
      let nowDateTmp = new Date();
      for (let i = 1; i < days; i++) {
        nowDateTmp.setDate(nowDateTmp.getDate() - 1);
        dateArrayTmp += this.getFormatDate(nowDateTmp);
        if (i !== days - 1) {
          dateArrayTmp += ", ";
        }
      }
      this.loadAllEntriesForLastDays(dateArrayTmp, days);
    }
  }

  checkValid() {
    let startDate: number = new Date(this.selectedDateStart).getTime();
    let endDate: number = new Date(this.selectedDateEnd).getTime();
    let daysTmp = Math.floor((startDate - endDate) / 60 / 60 / 1000 / 24);
    if (daysTmp > 31) {
      return false;
    } else {
      return true;
    }
  }

  getFormatDate(dateF: Date) {
    return dateF.getFullYear() + "-" + this.getTimeText(dateF.getMonth() + 1) + "-" + this.getTimeText(dateF.getDate());
  }

  showChart(timerecords: any, dateStr: any) {
    let xList = ['00:00-23:59'];
    let yList = ['all'];
    for (let i = 0; i < timerecords.length; i++) {
      let tTmp = (timerecords[i]['duration'] / 60 / 60).toFixed(2);
      yList.push(tTmp);
      let xTmp = this.getTimeFormat(timerecords[i]['start']) + " - " + this.getTimeFormat(timerecords[i]['end']);
      xList.push(xTmp);
    }
    let sumTmp = this.getSum(yList);
    yList[0] = sumTmp.toString();
    this.loadDataTestLinechart(xList, yList, dateStr);
  }

  loadDataTestLinechart(xList: any, yList: any, dateStr: string) {
    this.lineChart = echarts.init(document.getElementById('lineChart') as HTMLDivElement);
    // let titleText= this.translate.instant("timerecording.showchart_charttitle");
    let titleText = "show time recording from last 7 days";
    this.lineoption = {
      title: {
        text: dateStr + " " + titleText,
      },
      tooltip: {
        trigger: 'axis',
        axisPointer: {
          type: 'shadow'
        }
      },
      grid: {
        left: '3%',
        right: '4%',
        bottom: '3%',
        containLabel: true
      },
      xAxis: {
        type: 'category',
        splitLine: { show: false },
        data: xList
      },
      yAxis: {
        type: 'value'
      },
      series: [
        {
          name: 'Time interval',
          type: 'bar',
          stack: 'all',
          label: {
            show: true,
            position: 'inside'
          },
          data: yList
        }
      ]

    };
    this.lineChart.setOption(this.lineoption);
  }

  getSum(yList: any) {
    let t: number = 0.0;
    for (let i = 1; i < yList.length; i++) {
      t += +yList[i];
    }
    return t;
  }

  getTimeFormat(value: number) {
    let timeTmp = new Date(value);
    let hour = timeTmp.getHours();
    let min = timeTmp.getMinutes();
    return hour + ":" + min;
  }

  getRecordSum(timerecordsOneDay: any) {
    let t: number = 0.0;
    for (let i = 0; i < timerecordsOneDay.length; i++) {
      let tTmp = (timerecordsOneDay[i]['duration'] / 60 / 60).toFixed(2);
      t += +tTmp;
    }
    return t.toFixed(2);;
  }

  getTimeText(timeNumber: number) {
    let timeText;
    if (Number(timeNumber) < 10) {
      timeText = '0' + timeNumber;
    } else {
      timeText = '' + timeNumber;
    }
    return timeText;
  }

  loadAllEntriesForLastDays(dateStrArray: string, days: number) {
    this.trService.getAllTimeEntriesLast7Days(dateStrArray).pipe(
      tap(rMsg => {
      })
    ).subscribe(timerecordsMoreDays => {
      var sourceTmp = [['time', 'ist', 'soll']];
      for (let i = 0; i < timerecordsMoreDays.length; i++) {
        const element = timerecordsMoreDays[i];
        let dayRecordingtmp: any = [];
        let keyTmp = Object.keys(element)[0];
        dayRecordingtmp.push(keyTmp)
        dayRecordingtmp.push(this.getRecordSum(element[keyTmp]));
        dayRecordingtmp.push(8);
        sourceTmp.push(dayRecordingtmp);
      }
      this.showChartMoreDays(sourceTmp);
    });
  }

  showChartMoreDays(sourceTmp: any) {
    this.lineChartMoreDays = echarts.init(document.getElementById('lineChartMoreDays') as HTMLDivElement);
    this.lineChartMoreDaysOption = {
      legend: {},
      tooltip: {},
      dataset: {
        source: sourceTmp
      },
      xAxis: {
        type: 'category',
        axisLabel: { interval: 0, rotate: 30 }
      },
      yAxis: {},
      // Declare several bar series, each will be mapped
      // to a column of dataset.source by default.
      series: [
        { type: 'bar' },
        { type: 'bar' }
      ]

    };
    this.lineChartMoreDays.setOption(this.lineChartMoreDaysOption);
  }

  getChartOptions() {
    const strokeColor = '#D13647';
    return {
      series: [74],
      chart: {
        type: 'radialBar',
        height: 200,
      },
      plotOptions: {
        radialBar: {
          hollow: {
            margin: 0,
            size: '65%',
          },
          dataLabels: {
            showOn: 'always',
            name: {
              show: false,
              fontWeight: '700',
            },
            value: {
              color: '#333cff',
              fontSize: '30px',
              fontWeight: '700',
              offsetY: 12,
              show: true,
            },
          },
          track: {
            background: '#fff',
            strokeWidth: '100%',
          },
        },
      },
      colors: ['#897e82'],
      stroke: {
        lineCap: 'round',
      },
      labels: ['Progress'],
      legend: {},
      dataLabels: {},
      fill: {},
      xaxis: {},
      yaxis: {},
      states: {},
      tooltip: {},
      markers: {},
    };
  }
}
