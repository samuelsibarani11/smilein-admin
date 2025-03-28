import React, { useRef, useState, useEffect } from 'react';
import Modal from '../../components/Modal';
import { ScheduleRead, ScheduleUpdate } from '../../types/schedule';
import Swal from 'sweetalert2';
import * as courseApi from '../../api/courseApi';
import * as instructorApi from '../../api/instructorApi';
import * as studentApi from '../../api/studentApi';

const DAYS_OF_WEEK = [
    'Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu', 'Minggu'
];

interface UpdateScheduleModalProps {
    isOpen: boolean;
    onClose: () => void;
    currentSchedule: ScheduleRead | null;
    onUpdateSchedule: (scheduleId: number, scheduleData: ScheduleUpdate) => Promise<void>;
}

interface Course {
    course_id: number;
    course_name: string;
}

interface Instructor {
    instructor_id: number;
    full_name: string;
}

interface Student {
    student_id: number;
    full_name: string;
}

const UpdateScheduleModal: React.FC<UpdateScheduleModalProps> = ({
    isOpen,
    onClose,
    currentSchedule,
    onUpdateSchedule
}) => {
    const [courses, setCourses] = useState<Course[]>([]);
    const [instructors, setInstructors] = useState<Instructor[]>([]);
    const [students, setStudents] = useState<Student[]>([]);

    const courseIdRef = useRef<HTMLSelectElement>(null);
    const instructorIdRef = useRef<HTMLSelectElement>(null);
    const studentIdRef = useRef<HTMLSelectElement>(null);
    const roomRef = useRef<HTMLInputElement>(null);
    const startTimeRef = useRef<HTMLInputElement>(null);
    const endTimeRef = useRef<HTMLInputElement>(null);
    const dayOfWeekRef = useRef<HTMLSelectElement>(null);

    useEffect(() => {
        if (isOpen) {
            fetchCourses();
            fetchInstructors();
            fetchStudents();
        }
    }, [isOpen]);

    useEffect(() => {
        // Add comprehensive null checks
        if (currentSchedule && isOpen) {
            const safeSetValue = (
                ref: React.RefObject<HTMLSelectElement | HTMLInputElement>,
                value: string | number | undefined
            ) => {
                if (ref.current && value !== undefined) {
                    ref.current.value = value.toString();
                }
            };

            safeSetValue(courseIdRef, currentSchedule.course_id);
            safeSetValue(instructorIdRef, currentSchedule.instructor_id);
            safeSetValue(studentIdRef, currentSchedule.student_id);
            safeSetValue(roomRef, currentSchedule.room);
            safeSetValue(startTimeRef, currentSchedule.start_time);
            safeSetValue(endTimeRef, currentSchedule.end_time);
            safeSetValue(dayOfWeekRef, currentSchedule.day_of_week);
        }
    }, [currentSchedule, isOpen]);

    const fetchCourses = async () => {
        try {
            const fetchedCourses = await courseApi.getCourses();
            setCourses(fetchedCourses);
        } catch (error) {
            console.error('Failed to fetch courses:', error);
            Swal.fire({
                title: 'Error',
                text: 'Gagal memuat daftar mata kuliah',
                icon: 'error'
            });
        }
    };

    const fetchInstructors = async () => {
        try {
            const fetchedInstructors = await instructorApi.getInstructors();
            setInstructors(fetchedInstructors);
        } catch (error) {
            console.error('Failed to fetch instructors:', error);
            Swal.fire({
                title: 'Error',
                text: 'Gagal memuat daftar dosen',
                icon: 'error'
            });
        }
    };

    const fetchStudents = async () => {
        try {
            const fetchedStudents = await studentApi.getStudents();
            setStudents(fetchedStudents);
        } catch (error) {
            console.error('Failed to fetch students:', error);
            Swal.fire({
                title: 'Error',
                text: 'Gagal memuat daftar mahasiswa',
                icon: 'error'
            });
        }
    };

    const showAlert = (title: string, message: string, icon: 'success' | 'error' | 'warning'): void => {
        Swal.fire({
            title: title,
            text: message,
            icon: icon,
            confirmButtonText: 'OK',
            confirmButtonColor: '#3B82F6',
            customClass: {
                container: 'font-sans'
            }
        });
    };

    const handleSubmit = async (): Promise<void> => {
        if (!currentSchedule) {
            showAlert('Error', 'Tidak ada jadwal yang dipilih', 'error');
            return;
        }

        const courseId = courseIdRef.current?.value;
        const instructorId = instructorIdRef.current?.value;
        const studentId = studentIdRef.current?.value;
        const room = roomRef.current?.value;
        const startTime = startTimeRef.current?.value;
        const endTime = endTimeRef.current?.value;
        const dayOfWeek = dayOfWeekRef.current?.value;

        const updateData: ScheduleUpdate = {
            student_id: 0
        };

        // Only add fields that have changed
        if (courseId && parseInt(courseId) !== currentSchedule.course_id) {
            updateData.course_id = parseInt(courseId);
        }
        if (instructorId && parseInt(instructorId) !== currentSchedule.instructor_id) {
            updateData.instructor_id = parseInt(instructorId);
        }
        if (studentId && parseInt(studentId) !== currentSchedule.student_id) {
            updateData.student_id = parseInt(studentId);
        }
        if (room && room !== currentSchedule.room) {
            updateData.room = room;
        }
        if (startTime && startTime !== currentSchedule.start_time) {
            updateData.start_time = startTime;
        }
        if (endTime && endTime !== currentSchedule.end_time) {
            updateData.end_time = endTime;
        }
        if (dayOfWeek !== undefined && parseInt(dayOfWeek) !== currentSchedule.day_of_week) {
            updateData.day_of_week = parseInt(dayOfWeek);
        }

        // If no changes, show an alert
        if (Object.keys(updateData).length === 0) {
            showAlert('Info', 'Tidak ada perubahan yang dilakukan', 'warning');
            return;
        }

        try {
            await onUpdateSchedule(currentSchedule.schedule_id, updateData);
            onClose();
        } catch (err) {
            console.error('Failed to update schedule:', err);
            showAlert('Error!', 'Gagal memperbarui jadwal', 'error');
        }
    };

    if (!currentSchedule) return null;

    return (
        <Modal
            isOpen={isOpen}
            onClose={onClose}
            title="Perbarui Jadwal"
            onConfirm={handleSubmit}
        >
            <div className="grid grid-cols-2 gap-6">
                <div className="col-span-2">
                    <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Mata Kuliah</label>
                    <select
                        ref={courseIdRef}
                        className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-transparent text-gray-900 dark:text-gray-100"
                        required
                    >
                        <option value="">Pilih Mata Kuliah</option>
                        {courses.map((course) => (
                            <option key={course.course_id} value={course.course_id}>
                                {course.course_name}
                            </option>
                        ))}
                    </select>
                </div>
                <div className="col-span-2">
                    <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Dosen</label>
                    <select
                        ref={instructorIdRef}
                        className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-transparent text-gray-900 dark:text-gray-100"
                        required
                    >
                        <option value="">Pilih Dosen</option>
                        {instructors.map((instructor) => (
                            <option key={instructor.instructor_id} value={instructor.instructor_id}>
                                {instructor.full_name}
                            </option>
                        ))}
                    </select>
                </div>
                <div className="col-span-2">
                    <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Mahasiswa</label>
                    <select
                        ref={studentIdRef}
                        className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-transparent text-gray-900 dark:text-gray-100"
                        required
                    >
                        <option value="">Pilih Mahasiswa</option>
                        {students.map((student) => (
                            <option key={student.student_id} value={student.student_id}>
                                {student.full_name}
                            </option>
                        ))}
                    </select>
                </div>
                <div className="col-span-2">
                    <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Ruangan</label>
                    <input
                        ref={roomRef}
                        className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-transparent text-gray-900 dark:text-gray-100"
                        placeholder="Masukkan ruangan"
                        required
                    />
                </div>
                <div className="col-span-1">
                    <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Waktu Mulai</label>
                    <input
                        ref={startTimeRef}
                        type="time"
                        className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-transparent text-gray-900 dark:text-gray-100"
                        required
                    />
                </div>
                <div className="col-span-1">
                    <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Waktu Selesai</label>
                    <input
                        ref={endTimeRef}
                        type="time"
                        className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-transparent text-gray-900 dark:text-gray-100"
                        required
                    />
                </div>
                <div className="col-span-2">
                    <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Hari</label>
                    <select
                        ref={dayOfWeekRef}
                        className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-transparent text-gray-900 dark:text-gray-100"
                        required
                    >
                        {DAYS_OF_WEEK.map((day, index) => (
                            <option key={index} value={index}>{day}</option>
                        ))}
                    </select>
                </div>
            </div>
        </Modal>
    );
};

export default UpdateScheduleModal;