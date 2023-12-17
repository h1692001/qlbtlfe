import React, { useEffect, useState } from "react";
import LogApi from "../../api/LogApi";
import { DatePicker } from "antd";
import dayjs from "dayjs";
import {
  Chart as ChartJS, ArcElement, Tooltip, Legend, CategoryScale,
  LinearScale,
  BarElement,
  Title,
  PointElement,
  LineElement,
} from 'chart.js';
import { Doughnut, Bar, Line } from 'react-chartjs-2';

ChartJS.register(ArcElement, Tooltip, Legend, CategoryScale,
  LinearScale, BarElement, Title, PointElement,
  LineElement,);

const Statistic = () => {
  function getDaysInMonth(startDate, endDate) {

    const daysArray = [];
    const lb = [];
    let currentDate = startDate;
    let i = 1;
    while (currentDate.isBefore(endDate) || currentDate.isSame(endDate, 'day')) {
      daysArray.push(currentDate);
      lb.push(i + "");
      i++;
      currentDate = currentDate.add(1, 'day');
    }

    setLabelDay(lb);
    return daysArray;
  }
  const labels = ['Số bài nộp', 'Số bài duyệt', 'Số bài hủy'];
  const labelsMon = ["Tháng 1", "Tháng 2", "Tháng 3", "Tháng 4", "Tháng 5", "Tháng 6", "Tháng 7", "Tháng 8", "Tháng 9", "Tháng 10", "Tháng 11", "Tháng 12"];
  const [labelDay, setLabelDay] = useState([]);

  const [selectedDate, setSelectedDate] = useState(dayjs());
  const [selectedYear, setSelectedYear] = useState(dayjs());
  const [selectedMonth, setSelectedMonth] = useState(dayjs());

  const [dateBar, setDataBar] = useState({
    labels: labelsMon,
    datasets: [
      {
        label: 'Số bài nộp',
        data: Array(12).fill(0),
        backgroundColor: 'rgba(255, 159, 64, 0.2)',
      },
      {
        label: 'Số bài duyệt',
        data: Array(12).fill(0),
        backgroundColor: 'rgba(53, 162, 235, 0.5)',
      },
      {
        label: 'Số bài hủy',
        data: Array(12).fill(0),
        backgroundColor: 'rgba(255, 99, 132, 0.5)',
      }
    ]
  })
  const [dataDoughnut, setDataDoughnut] = useState({
    labels: labels,
    datasets: [
      {
        data: [0, 0, 0],
        backgroundColor: [
          'rgba(255, 206, 86, 0.2)',

          'rgba(54, 162, 235, 0.2)',
          'rgba(255, 99, 132, 0.2)',
        ],
        borderColor: [
          'rgba(255, 206, 86, 1)',
          'rgba(54, 162, 235, 1)',
          'rgba(255, 99, 132, 1)',
        ],
        borderWidth: 1,
      }
    ]
  });
  const [dataline, setDataline] = useState({
    labels: labelDay,
    datasets: [
      {
        label: 'Số bài nộp',
        data: [0],
        borderColor: 'rgba(255, 206, 86, 1)',
        backgroundColor: 'rgba(255, 159, 64, 0.2)',
      },
      {
        label: 'Số bài duyệt',
        data: [0],
        borderColor: 'rgba(54, 162, 235, 1)',
        backgroundColor: 'rgba(53, 162, 235, 0.5)',
      },
      {
        label: 'Số bài hủy',
        data: [0],
        borderColor: 'rgba(255, 99, 132, 1)',
        backgroundColor: 'rgba(255, 99, 132, 0.5)',
      },
    ]
  })


  const fetchDataDoughnut = async (startDate, endDate) => {
    try {
      const res1 = await LogApi.getLog({ startDate, endDate, type: "UPLOAD" });
      const res2 = await LogApi.getLog({ startDate, endDate, type: "APPROVE" });
      const res3 = await LogApi.getLog({ startDate, endDate, type: "CANCEL" });
      setDataDoughnut({
        labels: labels,
        datasets: [
          {
            data: [res1.length, res2.length, res3.length],
            backgroundColor: [
              'rgba(255, 206, 86, 0.2)',
              'rgba(54, 162, 235, 0.2)',
              'rgba(255, 99, 132, 0.2)',
            ],
            borderColor: [
              'rgba(255, 206, 86, 1)',
              'rgba(54, 162, 235, 1)',
              'rgba(255, 99, 132, 1)',
            ],
            borderWidth: 1,
          }
        ]
      });
    } catch (e) {

    }
  };

  const fetchDataLine = async (startDate, endDate) => {
    try {
      const dt = [];
      const dat1 = Array(labelDay.length).fill(0);
      const dat2 = Array(labelDay.length).fill(0)
      const dat3 = Array(labelDay.length).fill(0)
      let i2 = 0;

      await Promise.all(
        getDaysInMonth(startDate, endDate).map(async (date, i) => {
          const stDate = dayjs(date).startOf('day');
          const edDate = dayjs(date).endOf('day');
          const res1 = await LogApi.getLog({ startDate: stDate, endDate: edDate, type: "UPLOAD" });
          const res2 = await LogApi.getLog({ startDate: stDate, endDate: edDate, type: "APPROVE" });
          const res3 = await LogApi.getLog({ startDate: stDate, endDate: edDate, type: "CANCEL" });

          dat1[i] = res1.length;
          dat2[i] = res2.length;
          dat3[i] = res3.length;

          dt.push(i2 + 1);
          i2++;

        })
      );

      setDataline({
        labels: dt,
        datasets: [
          {
            label: 'Số bài nộp',
            data: dat1,
            borderColor: 'rgba(255, 206, 86, 1)',
            backgroundColor: 'rgba(255, 159, 64, 0.2)',
          },
          {
            label: 'Số bài duyệt',
            data: dat2,
            borderColor: 'rgba(54, 162, 235, 1)',
            backgroundColor: 'rgba(53, 162, 235, 0.5)',
          },
          {
            label: 'Số bài hủy',
            data: dat3,
            borderColor: 'rgba(255, 99, 132, 1)',
            backgroundColor: 'rgba(255, 99, 132, 0.5)',
          },
        ],
      });
    } catch (e) {
     
    }
  };


  const fetchDataBar = async (startDate, endDate) => {
    try {
      const monthlyData1 = Array(12).fill(0);
      const monthlyData2 = Array(12).fill(0);
      const monthlyData3 = Array(12).fill(0);


      for (let i = 0; i < 12; i++) {
        const startOfMonth = startDate.month(i).startOf('month');
        const endOfMonth = startDate.month(i).endOf('month');

        const res1 = await LogApi.getLog({ startDate: startOfMonth, endDate: endOfMonth, type: "UPLOAD" });
        const res2 = await LogApi.getLog({ startDate: startOfMonth, endDate: endOfMonth, type: "APPROVE" });
        const res3 = await LogApi.getLog({ startDate: startOfMonth, endDate: endOfMonth, type: "CANCEL" });

        monthlyData1[i] = res1.length
        monthlyData2[i] = res2.length
        monthlyData3[i] = res3.length
      }
      setDataBar({
        labels: labelsMon,
        datasets: [
          {
            label: 'Số bài nộp',
            data: monthlyData1,
            backgroundColor: 'rgba(255, 159, 64, 0.2)',
          },
          {
            label: 'Số bài duyệt',
            data: monthlyData2,
            backgroundColor: 'rgba(53, 162, 235, 0.5)',
          },
          {
            label: 'Số bài hủy',
            data: monthlyData3,
            backgroundColor: 'rgba(255, 99, 132, 0.5)',
          }
        ]
      });
    } catch (e) {

    }
  };

  const [userLog, setUserLog] = useState([]);

  const handleDateChange = (date, dateString) => {
    const startDate = dayjs(date).startOf('day');
    const endDate = dayjs(date).endOf('day');
    setSelectedDate(dayjs(date));

    fetchDataDoughnut(startDate, endDate);
  };

  const handleYearChange = (date, dateString) => {
    const startDate = dayjs(date).startOf('year');
    const endDate = dayjs(date).endOf('year');
    setSelectedYear(dayjs(date));
    fetchDataBar(startDate, endDate);
  };

  useEffect(() => {
    fetchDataDoughnut(selectedDate.startOf('day'), selectedDate.endOf('day'));
  }, [selectedDate]);

  useEffect(() => {
    fetchDataBar(selectedYear.startOf('year'), selectedYear.endOf('year'));
  }, [selectedYear]);
  const getUserLog = async () => {
    try {
      const res = await LogApi.getUserLog();
      setUserLog({students:res.students,teachers:res.teachers})
    }
    catch (e) {

    }
  }
  useEffect(() => {
    getUserLog();
  }, [])
  useEffect(() => {
    getDaysInMonth(dayjs().startOf("month"), dayjs().endOf("month"))
    fetchDataLine(selectedMonth.startOf("month"), selectedMonth.endOf("month"));
  }, [])
  return (
    <div>
      <div className="flex gap-[20px] items-start">
        <div className="flex flex-col gap-[20px] w-[21%] bg-white px-[20px] py-[20px] rounded-[20px]">
          <p className=" text-[20px] font-[600]">Lượng nộp trong ngày</p>
          <DatePicker
            onChange={handleDateChange}
            defaultValue={selectedDate}
          />
          <Doughnut data={dataDoughnut} />
        </div>

        <div className="flex flex-col gap-[20px] w-[40%] bg-white px-[20px] py-[20px] rounded-[20px]">
          <p className=" text-[20px] font-[600]">Lượng nộp trong năm</p>
          <DatePicker
            onChange={handleYearChange}
            picker="year"
            defaultValue={selectedYear}
          />
          <Bar data={dateBar} options={{ responsive: true, }} />
        </div>
        <div className="flex flex-col gap-[20px]  bg-white px-[20px] py-[20px] rounded-[20px]">
          <p className=" text-[20px] font-[600]">Lượng người dùng</p>
          <p className=" text-[20px] font-[600]">Số học sinh: {userLog?.students}</p>
          <p className=" text-[20px] font-[600]">Số giáo viên: {userLog?.teachers}</p>

        </div>
      </div>
      <div className="mt-[30px]">
        <div className="flex flex-col gap-[20px] w-[62%] bg-white px-[20px] py-[20px] rounded-[20px]">
          <p className=" text-[20px] font-[600]">Lượng nộp trong tháng</p>
          <DatePicker
            onChange={(date) => {
              const startDate = dayjs(date).startOf('month');
              const endDate = dayjs(date).endOf('month');
              setSelectedMonth(dayjs(date));
              console.log(startDate, endDate);
              fetchDataLine(startDate, endDate)
            }}
            picker="month"
            defaultValue={selectedMonth}
          />
          <Line data={dataline} options={{ responsive: true, }} />
        </div>
      </div>
    </div>
  );
};

export default Statistic;
