import React, { useState } from 'react';

// Sample course attendance data - replace with your actual data
const courseData = [
  {
    code: 'CS101',
    name: 'Introduction to Computer Science',
    totalStudents: 120,
    attendedStudents: 115,
    attendance: 95.8,
  },
  {
    code: 'MTH201',
    name: 'Calculus II',
    totalStudents: 85,
    attendedStudents: 79,
    attendance: 92.9,
  },
  {
    code: 'ENG104',
    name: 'Academic Writing',
    totalStudents: 95,
    attendedStudents: 87,
    attendance: 91.6,
  },
  {
    code: 'PHY102',
    name: 'Physics for Engineers',
    totalStudents: 75,
    attendedStudents: 68,
    attendance: 90.7,
  },
  {
    code: 'CHM101',
    name: 'General Chemistry',
    totalStudents: 110,
    attendedStudents: 98,
    attendance: 89.1,
  },
  {
    code: 'BIO130',
    name: 'Molecular Biology',
    totalStudents: 65,
    attendedStudents: 57,
    attendance: 87.7,
  },
  {
    code: 'ECO201',
    name: 'Microeconomics',
    totalStudents: 100,
    attendedStudents: 86,
    attendance: 86.0,
  },
  {
    code: 'SOC101',
    name: 'Introduction to Sociology',
    totalStudents: 130,
    attendedStudents: 111,
    attendance: 85.4,
  },
  {
    code: 'PSY102',
    name: 'Developmental Psychology',
    totalStudents: 80,
    attendedStudents: 67,
    attendance: 83.8,
  },
  {
    code: 'HIS110',
    name: 'World History',
    totalStudents: 70,
    attendedStudents: 58,
    attendance: 82.9,
  },
  {
    code: 'ART105',
    name: 'Visual Arts',
    totalStudents: 60,
    attendedStudents: 49,
    attendance: 81.7,
  },
  {
    code: 'GEO120',
    name: 'Human Geography',
    totalStudents: 75,
    attendedStudents: 60,
    attendance: 80.0,
  },
];

// Sort data by attendance percentage (highest to lowest)
const sortedCourseData = [...courseData].sort((a, b) => b.attendance - a.attendance);

const TableOne = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  // Calculate the current items to display
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = sortedCourseData.slice(indexOfFirstItem, indexOfLastItem);

  // Calculate total pages
  const totalPages = Math.ceil(sortedCourseData.length / itemsPerPage);

  // Handle pagination navigation
  const goToNextPage = () => {
    setCurrentPage(prev => Math.min(prev + 1, totalPages));
  };

  const goToPreviousPage = () => {
    setCurrentPage(prev => Math.max(prev - 1, 1));
  };

  return (
    <div className="rounded-sm border border-stroke bg-white px-5 pt-6 pb-2.5 shadow-default dark:border-strokedark dark:bg-boxdark sm:px-7.5 xl:pb-1 h-full flex flex-col">
      <h4 className="mb-6 text-xl font-semibold text-black dark:text-white">
        Kehadiran Mata Kuliah
      </h4>

      <div className="flex flex-col flex-grow">
        <div className="grid grid-cols-5 rounded-sm bg-gray-2 dark:bg-meta-4">
          <div className="p-2.5 xl:p-5">
            <h5 className="text-sm font-medium uppercase xsm:text-base">
              Kode
            </h5>
          </div>
          <div className="p-2.5 xl:p-5">
            <h5 className="text-sm font-medium uppercase xsm:text-base">
              Mata Kuliah
            </h5>
          </div>
          <div className="p-2.5 text-center xl:p-5">
            <h5 className="text-sm font-medium uppercase xsm:text-base">
              Total Mahasiswa
            </h5>
          </div>
          <div className="p-2.5 text-center xl:p-5">
            <h5 className="text-sm font-medium uppercase xsm:text-base">
              Mahasiswa Hadir
            </h5>
          </div>
          <div className="p-2.5 text-center xl:p-5">
            <h5 className="text-sm font-medium uppercase xsm:text-base">
              Presentasi Kehadiran
            </h5>
          </div>
        </div>

        <div className="flex-grow">
          {currentItems.map((course, key) => (
            <div
              className={`grid grid-cols-5 ${key === currentItems.length - 1
                ? ''
                : 'border-b border-stroke dark:border-strokedark'
                }`}
              key={key}
            >
              <div className="flex items-center p-2.5 xl:p-5">
                <p className="text-black dark:text-white">
                  {course.code}
                </p>
              </div>

              <div className="flex items-center p-2.5 xl:p-5">
                <p className="text-black dark:text-white">{course.name}</p>
              </div>

              <div className="flex items-center justify-center p-2.5 xl:p-5">
                <p className="text-black dark:text-white">{course.totalStudents}</p>
              </div>

              <div className="flex items-center justify-center p-2.5 xl:p-5">
                <p className="text-black dark:text-white">{course.attendedStudents}</p>
              </div>

              <div className="flex items-center justify-center p-2.5 xl:p-5">
                <p className={`${course.attendance >= 90 ? 'text-meta-3' :
                  course.attendance >= 80 ? 'text-meta-5' : 'text-meta-1'}`}>
                  {course.attendance.toFixed(1)}%
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Pagination */}
        <div className="flex justify-between items-center mt-4 mb-4">
          <div className="text-sm text-gray-500 dark:text-gray-400">
            Menampilkan {indexOfFirstItem + 1}-{Math.min(indexOfLastItem, sortedCourseData.length)} dari {sortedCourseData.length} mata kuliah
          </div>
          <div className="flex space-x-2">
            <button
              onClick={goToPreviousPage}
              disabled={currentPage === 1}
              className={`px-3 py-1 rounded ${currentPage === 1
                  ? 'bg-gray-200 text-gray-500 cursor-not-allowed'
                  : 'bg-primary text-white hover:bg-opacity-90'
                }`}
            >
              Sebelumnya
            </button>
            <span className="px-3 py-1 bg-gray-100 dark:bg-meta-4 rounded">
              {currentPage} / {totalPages}
            </span>
            <button
              onClick={goToNextPage}
              disabled={currentPage === totalPages}
              className={`px-3 py-1 rounded ${currentPage === totalPages
                  ? 'bg-gray-200 text-gray-500 cursor-not-allowed'
                  : 'bg-primary text-white hover:bg-opacity-90'
                }`}
            >
              Selanjutnya
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TableOne;