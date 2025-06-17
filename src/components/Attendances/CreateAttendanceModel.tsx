import React, { useState, useEffect } from 'react';
import Modal from '../../components/Modal';
import { getStudents } from '../../api/studentApi';
import { StudentRead } from '../../types/student';
import Swal from 'sweetalert2';
import apiClient from '../../api/client';

interface Schedule {
  schedule_id: number;
  course: {
    course_id: number;
    course_name: string;
  };
  room: {
    name: string;
  };
  day_of_week: number;
  schedule_date: string;
  start_time: string;
  end_time: string;
  instructor: {
    full_name: string;
  };
}

interface CreateAttendanceModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

const CreateAttendanceModal: React.FC<CreateAttendanceModalProps> = ({
  isOpen,
  onClose,
  onSuccess
}) => {
  const [students, setStudents] = useState<StudentRead[]>([]);
  const [schedules, setSchedules] = useState<Schedule[]>([]);
  const [filteredSchedules, setFilteredSchedules] = useState<Schedule[]>([]);
  const [loading, setLoading] = useState(true);
  const [filteringSchedules, setFilteringSchedules] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState<number | ''>('');
  const [selectedSchedule, setSelectedSchedule] = useState<number | ''>('');
  const [validating, setValidating] = useState(false);

  // Get current date in YYYY-MM-DD format
  const getCurrentDate = (): string => {
    const today = new Date();
    return new Intl.DateTimeFormat('en-CA', {
      timeZone: 'Asia/Jakarta'
    }).format(today);
  };
  // Load students and schedules when modal opens
  useEffect(() => {
    if (isOpen) {
      fetchData();
      // Reset form when modal opens
      setSelectedStudent('');
      setSelectedSchedule('');
      setFilteredSchedules([]);
    }
  }, [isOpen]);

  // Filter schedules when schedules data changes or when selectedStudent changes
  useEffect(() => {
    const currentDate = getCurrentDate();
    const todaySchedules = schedules.filter(schedule => schedule.schedule_date === currentDate);

    if (selectedStudent && todaySchedules.length > 0) {
      // If a student is selected, filter out schedules that already have attendance records
      filterSchedulesWithExistingAttendance(todaySchedules, Number(selectedStudent));
    } else {
      // If no student selected or no schedules, just show today's schedules
      setFilteredSchedules(todaySchedules);
    }
  }, [schedules, selectedStudent]);

  const fetchData = async () => {
    setLoading(true);
    try {
      // Fetch students
      const studentsData = await getStudents();
      setStudents(studentsData);

      // Fetch schedules
      const response = await apiClient.get<Schedule[]>('/schedules/');
      setSchedules(response.data);
    } catch (error) {
      console.error('Failed to fetch data:', error);
      Swal.fire({
        title: 'Error!',
        text: 'Gagal memuat data mahasiswa dan jadwal',
        icon: 'error',
        confirmButtonText: 'OK',
        confirmButtonColor: '#3B82F6'
      });
    } finally {
      setLoading(false);
    }
  };

  // Filter schedules that don't have existing attendance records for the selected student
  const filterSchedulesWithExistingAttendance = async (schedulesToFilter: Schedule[], studentId: number) => {
    setFilteringSchedules(true);
    try {
      const availableSchedules: Schedule[] = [];

      // Check each schedule to see if attendance already exists
      for (const schedule of schedulesToFilter) {
        const exists = await checkAttendanceExists(studentId, schedule.schedule_id);
        if (!exists) {
          availableSchedules.push(schedule);
        }
      }

      setFilteredSchedules(availableSchedules);
    } catch (error) {
      console.error('Error filtering schedules:', error);
      // On error, show all schedules for the current date
      setFilteredSchedules(schedulesToFilter);
    } finally {
      setFilteringSchedules(false);
    }
  };

  // Check if attendance record already exists
  const checkAttendanceExists = async (studentId: number, scheduleId: number): Promise<boolean> => {
    try {
      const response = await apiClient.get('/attendances/', {
        params: {
          student_id: studentId,
          schedule_id: scheduleId
        }
      });

      // If the response contains any data, the attendance record already exists
      return response.data && response.data.length > 0;
    } catch (error) {
      console.error('Error checking attendance existence:', error);
      return false;
    }
  };

  const handleStudentChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const studentId = Number(e.target.value) || '';
    setSelectedStudent(studentId);
    setSelectedSchedule(''); // Reset schedule selection when student changes
  };

  const handleSubmit = async () => {
    if (!selectedStudent) {
      Swal.fire({
        title: 'Peringatan',
        text: 'Silakan pilih mahasiswa',
        icon: 'warning',
        confirmButtonText: 'OK',
        confirmButtonColor: '#3B82F6'
      });
      return;
    }

    if (!selectedSchedule) {
      Swal.fire({
        title: 'Peringatan',
        text: 'Silakan pilih jadwal',
        icon: 'warning',
        confirmButtonText: 'OK',
        confirmButtonColor: '#3B82F6'
      });
      return;
    }

    setValidating(true);
    try {
      // Double check if the attendance record already exists before creating
      const exists = await checkAttendanceExists(Number(selectedStudent), Number(selectedSchedule));

      if (exists) {
        Swal.fire({
          title: 'Peringatan',
          text: 'Data kehadiran untuk mahasiswa dan jadwal ini sudah ada',
          icon: 'warning',
          confirmButtonText: 'OK',
          confirmButtonColor: '#3B82F6'
        });
        setValidating(false);
        return;
      }

      // If it doesn't exist, proceed with creating the attendance record
      await apiClient.post('/attendances/', {
        student_id: selectedStudent,
        schedule_id: selectedSchedule
      });

      Swal.fire({
        title: 'Berhasil!',
        text: 'Data kehadiran berhasil ditambahkan',
        icon: 'success',
        confirmButtonText: 'OK',
        confirmButtonColor: '#3B82F6'
      });

      // Reset form and close modal
      setSelectedStudent('');
      setSelectedSchedule('');
      onClose();
      onSuccess(); // Refresh attendance list
    } catch (error) {
      console.error('Failed to create attendance:', error);
      Swal.fire({
        title: 'Error!',
        text: 'Gagal menambahkan data kehadiran',
        icon: 'error',
        confirmButtonText: 'OK',
        confirmButtonColor: '#3B82F6'
      });
    } finally {
      setValidating(false);
    }
  };

  // Format schedule display text to avoid undefined issues
  const formatScheduleOption = (schedule: Schedule): string => {
    const courseName = schedule.course?.course_name || 'Unknown Course';
    const roomName = schedule.room?.name || '';
    const startTime = schedule.start_time || '';
    const endTime = schedule.end_time || '';

    // Only include the time information, removing day references
    return `${courseName}, ${startTime}-${endTime} (${roomName})`;
  };

  // Format date for display
  const formatDate = (dateString: string): string => {
    const options: Intl.DateTimeFormatOptions = {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    };
    return new Date(dateString).toLocaleDateString('id-ID', options);
  };

  const currentDate = getCurrentDate();
  const currentDateFormatted = formatDate(currentDate);
  const todaySchedulesCount = schedules.filter(s => s.schedule_date === currentDate).length;

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Tambah Kehadiran Baru"
      onConfirm={handleSubmit}
      confirmDisabled={validating}
    >
      {loading ? (
        <div className="flex justify-center items-center h-40">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-6">
          {/* Info about current date */}
          <div className="bg-green-50 dark:bg-green-900/20 p-3 rounded-lg border-l-4 border-green-400">
            <p className="text-sm text-green-700 dark:text-green-300">
              <span className="font-semibold">Tanggal hari ini:</span> {currentDateFormatted}
            </p>
            <p className="text-xs text-green-600 dark:text-green-400 mt-1">
              Hanya jadwal untuk tanggal hari ini yang ditampilkan
            </p>
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
              Mahasiswa
            </label>
            <select
              value={selectedStudent}
              onChange={handleStudentChange}
              className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-transparent text-gray-900 dark:text-gray-100"
              disabled={validating}
            >
              <option value="">Pilih Mahasiswa</option>
              {students.map((student) => (
                <option key={student.student_id} value={student.student_id}>
                  {student.nim} - {student.full_name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
              Jadwal (Hari Ini)
            </label>
            <select
              value={selectedSchedule}
              onChange={(e) => setSelectedSchedule(Number(e.target.value) || '')}
              className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-transparent text-gray-900 dark:text-gray-100"
              disabled={validating || filteringSchedules || !selectedStudent}
            >
              <option value="">
                {filteringSchedules
                  ? 'Memuat jadwal...'
                  : !selectedStudent
                    ? 'Pilih mahasiswa terlebih dahulu'
                    : 'Pilih Jadwal'
                }
              </option>
              {!filteringSchedules && selectedStudent && filteredSchedules.map((schedule) => (
                <option key={schedule.schedule_id} value={schedule.schedule_id}>
                  {formatScheduleOption(schedule)}
                </option>
              ))}
            </select>

            {/* Helper messages */}
            {!selectedStudent && (
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                Pilih mahasiswa untuk melihat jadwal yang tersedia
              </p>
            )}

            {selectedStudent && !filteringSchedules && filteredSchedules.length === 0 && todaySchedulesCount === 0 && (
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                Tidak ada jadwal yang tersedia untuk tanggal {currentDate}
              </p>
            )}

            {selectedStudent && !filteringSchedules && filteredSchedules.length === 0 && todaySchedulesCount > 0 && (
              <p className="text-sm text-yellow-600 dark:text-yellow-400 mt-1">
                Semua jadwal hari ini sudah memiliki data kehadiran untuk mahasiswa ini
              </p>
            )}

            {filteringSchedules && (
              <p className="text-sm text-blue-500 dark:text-blue-400 mt-1">
                <span className="inline-block animate-spin rounded-full h-3 w-3 border-t-2 border-b-2 border-blue-500 mr-2"></span>
                Memeriksa jadwal yang tersedia...
              </p>
            )}
          </div>

          {selectedStudent && selectedSchedule && (
            <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg">
              <p className="text-sm text-blue-700 dark:text-blue-300">
                Anda akan menambahkan kehadiran untuk data berikut:
              </p>
              <ul className="mt-2 space-y-1 text-sm">
                <li>
                  <span className="font-semibold">Mahasiswa:</span>{' '}
                  {students.find(s => s.student_id === Number(selectedStudent))?.full_name || ''}
                </li>
                <li>
                  <span className="font-semibold">Mata Kuliah:</span>{' '}
                  {filteredSchedules.find(s => s.schedule_id === Number(selectedSchedule))?.course.course_name || ''}
                </li>
                <li>
                  <span className="font-semibold">Pengajar:</span>{' '}
                  {filteredSchedules.find(s => s.schedule_id === Number(selectedSchedule))?.instructor.full_name || ''}
                </li>
                <li>
                  <span className="font-semibold">Waktu:</span>{' '}
                  {filteredSchedules.find(s => s.schedule_id === Number(selectedSchedule))?.start_time || ''} - {filteredSchedules.find(s => s.schedule_id === Number(selectedSchedule))?.end_time || ''}
                </li>
                <li>
                  <span className="font-semibold">Tanggal:</span> {formatDate(currentDate)}
                </li>
              </ul>
            </div>
          )}

          {validating && (
            <div className="flex justify-center mt-2">
              <div className="animate-spin rounded-full h-6 w-6 border-t-2 border-b-2 border-blue-500"></div>
              <span className="ml-2 text-blue-500">Validasi data...</span>
            </div>
          )}
        </div>
      )}
    </Modal>
  );
};

export default CreateAttendanceModal;