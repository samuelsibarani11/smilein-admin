import { ApexOptions } from 'apexcharts';
import React, { useState } from 'react';
import ReactApexChart from 'react-apexcharts';

const AttendanceChart: React.FC = () => {
  // Data interval options
  const [activeFilter, setActiveFilter] = useState<'day' | 'week' | 'month'>('day');

  // Sample data for student attendance percentages
  const dailyData = [85, 78, 82, 88, 76, 80, 79, 83, 90, 87, 84, 81, 78, 82];
  const weeklyData = [82, 80, 84, 87, 81, 83, 85, 88, 86, 83, 81, 82];
  const monthlyData = [80, 82, 85, 83, 81, 84, 86];

  // Categories/labels for each time period
  const dailyCategories = [
    "Senin", "Selasa", "Rabu", "Kamis", "Jumat", "Senin", "Selasa", 
    "Rabu", "Kamis", "Jumat", "Senin", "Selasa", "Rabu", "Kamis"
  ];
  
  const weeklyCategories = [
    "Minggu 1", "Minggu 2", "Minggu 3", "Minggu 4", 
    "Minggu 5", "Minggu 6", "Minggu 7", "Minggu 8", 
    "Minggu 9", "Minggu 10", "Minggu 11", "Minggu 12"
  ];
  
  const monthlyCategories = [
    "Jan", "Feb", "Mar", "Apr", "Mei", "Jun", "Jul"
  ];

  // Get appropriate data based on active filter
  const getActiveData = () => {
    switch (activeFilter) {
      case 'day':
        return {
          categories: dailyCategories,
          data: dailyData,
          title: 'Presensi Harian'
        };
      case 'week':
        return {
          categories: weeklyCategories,
          data: weeklyData,
          title: 'Presensi Mingguan'
        };
      case 'month':
        return {
          categories: monthlyCategories,
          data: monthlyData,
          title: 'Presensi Bulanan'
        };
    }
  };

  const activeData = getActiveData();

  // Chart options
  const options: ApexOptions = {
    chart: {
      fontFamily: 'Satoshi, sans-serif',
      height: 335,
      type: 'area',
      dropShadow: {
        enabled: true,
        color: '#623CEA14',
        top: 10,
        blur: 4,
        left: 0,
        opacity: 0.1,
      },
      toolbar: {
        show: false,
      },
    },
    colors: ['#3C50E0'],
    stroke: {
      width: 2,
      curve: 'smooth',
    },
    grid: {
      xaxis: {
        lines: {
          show: true,
        },
      },
      yaxis: {
        lines: {
          show: true,
        },
      },
    },
    dataLabels: {
      enabled: false,
    },
    markers: {
      size: 4,
      colors: '#fff',
      strokeColors: ['#3C50E0'],
      strokeWidth: 3,
      strokeOpacity: 0.9,
      fillOpacity: 1,
      hover: {
        size: 6,
      },
    },
    xaxis: {
      type: 'category',
      categories: activeData.categories,
      axisBorder: {
        show: false,
      },
      axisTicks: {
        show: false,
      },
    },
    yaxis: {
      title: {
        text: 'Persentase Kehadiran (%)',
        style: {
          fontSize: '12px',
          fontWeight: 500,
        },
      },
      min: 0,
      max: 100,
    },
    tooltip: {
      y: {
        formatter: function (val) {
          return val + '%';
        }
      }
    },
    title: {
      text: activeData.title,
      align: 'left',
      style: {
        fontSize: '16px',
        fontWeight: 'bold',
      }
    },
  };

  const series = [
    {
      name: 'Persentase Kehadiran',
      data: activeData.data,
    },
  ];

  // Handle filter change
  const handleFilterChange = (filter: 'day' | 'week' | 'month') => {
    setActiveFilter(filter);
  };

  return (
    <div className="col-span-12 rounded-sm border border-stroke bg-white px-5 pt-7.5 pb-5 shadow-default dark:border-strokedark dark:bg-boxdark sm:px-7.5 xl:col-span-8">
      <div className="flex flex-wrap items-start justify-between gap-3 sm:flex-nowrap mb-8">
        <div className="flex w-full flex-wrap gap-3 sm:gap-5">
          <div className="flex min-w-47.5">
            <span className="mt-1 mr-2 flex h-4 w-full max-w-4 items-center justify-center rounded-full border border-primary">
              <span className="block h-2.5 w-full max-w-2.5 rounded-full bg-primary"></span>
            </span>
            <div className="w-full">
              <p className="font-semibold text-primary">Presensi Mahasiswa</p>
              <p className="text-sm font-medium">Semester Genap 2024/2025</p>
            </div>
          </div>
        </div>
        <div className="flex w-full max-w-45 justify-end">
          <div className="inline-flex items-center rounded-md bg-whiter p-1.5 dark:bg-meta-4">
            <button 
              className={`rounded py-1 px-3 text-xs font-medium ${
                activeFilter === 'day' 
                  ? 'bg-white text-black shadow-card dark:bg-boxdark dark:text-white' 
                  : 'text-black hover:bg-white hover:shadow-card dark:text-white dark:hover:bg-boxdark'
              }`}
              onClick={() => handleFilterChange('day')}
            >
              Hari
            </button>
            <button 
              className={`rounded py-1 px-3 text-xs font-medium ${
                activeFilter === 'week' 
                  ? 'bg-white text-black shadow-card dark:bg-boxdark dark:text-white' 
                  : 'text-black hover:bg-white hover:shadow-card dark:text-white dark:hover:bg-boxdark'
              }`}
              onClick={() => handleFilterChange('week')}
            >
              Minggu
            </button>
            <button 
              className={`rounded py-1 px-3 text-xs font-medium ${
                activeFilter === 'month' 
                  ? 'bg-white text-black shadow-card dark:bg-boxdark dark:text-white' 
                  : 'text-black hover:bg-white hover:shadow-card dark:text-white dark:hover:bg-boxdark'
              }`}
              onClick={() => handleFilterChange('month')}
            >
              Bulan
            </button>
          </div>
        </div>
      </div>

      <div className="mb-2">
        <div id="attendanceChart">
          <ReactApexChart
            options={options}
            series={series}
            type="area"
            height={350}
          />
        </div>
      </div>
      
      <div className="flex justify-between items-center mt-4">
        <div>
          <p className="text-sm font-medium">
            Rata-rata: <span className="font-bold">{Math.round(activeData.data.reduce((a, b) => a + b, 0) / activeData.data.length)}%</span>
          </p>
        </div>
        <div>
          <p className="text-sm font-medium">
            Kehadiran Tertinggi: <span className="font-bold">{Math.max(...activeData.data)}%</span>
          </p>
        </div>
        <div>
          <p className="text-sm font-medium">
            Kehadiran Terendah: <span className="font-bold">{Math.min(...activeData.data)}%</span>
          </p>
        </div>
      </div>
    </div>
  );
};

export default AttendanceChart;