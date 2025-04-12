import React, { useRef, useState, useEffect } from 'react';
import Modal from '../../components/Modal';
import { ScheduleCreate } from '../../types/schedule';
import Swal from 'sweetalert2';
import * as courseApi from '../../api/courseApi';
import * as instructorApi from '../../api/instructorApi';

// Perbaikan: Sesuaikan nilai hari untuk dimulai dari 1 bukan 0
const DAYS_OF_WEEK = [
    { value: 1, label: 'Senin' },
    { value: 2, label: 'Selasa' },
    { value: 3, label: 'Rabu' },
    { value: 4, label: 'Kamis' },
    { value: 5, label: 'Jumat' },
    { value: 6, label: 'Sabtu' },
    { value: 7, label: 'Minggu' }
];

interface CreateScheduleModalProps {
    isOpen: boolean;
    onClose: () => void;
    onCreateSchedule: (scheduleData: ScheduleCreate) => Promise<void>;
}

interface Course {
    course_id: number;
    course_name: string;
}

interface Instructor {
    instructor_id: number;
    full_name: string;
}

const CreateScheduleModal: React.FC<CreateScheduleModalProps> = ({
    isOpen,
    onClose,
    onCreateSchedule
}) => {
    const [courses, setCourses] = useState<Course[]>([]);
    const [instructors, setInstructors] = useState<Instructor[]>([]);
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);

    const courseIdRef = useRef<HTMLSelectElement>(null);
    const instructorIdRef = useRef<HTMLSelectElement>(null);
    const roomRef = useRef<HTMLInputElement>(null);
    const chapterRef = useRef<HTMLInputElement>(null);
    const startTimeRef = useRef<HTMLInputElement>(null);
    const endTimeRef = useRef<HTMLInputElement>(null);
    const dayOfWeekRef = useRef<HTMLSelectElement>(null);

    useEffect(() => {
        if (isOpen) {
            fetchCourses();
            fetchInstructors();
        }
    }, [isOpen]);

    const fetchCourses = async () => {
        try {
            setLoading(true);
            const fetchedCourses = await courseApi.getCourses();
            setCourses(fetchedCourses);
        } catch (error) {
            console.error('Failed to fetch courses:', error);
            setError('Failed to load courses');
            Swal.fire({
                title: 'Error',
                text: 'Gagal memuat daftar mata kuliah',
                icon: 'error'
            });
        } finally {
            setLoading(false);
        }
    };

    const fetchInstructors = async () => {
        try {
            setLoading(true);
            const fetchedInstructors = await instructorApi.getInstructors();
            setInstructors(fetchedInstructors);
        } catch (error) {
            console.error('Failed to fetch instructors:', error);
            setError('Failed to load instructors');
            Swal.fire({
                title: 'Error',
                text: 'Gagal memuat daftar dosen',
                icon: 'error'
            });
        } finally {
            setLoading(false);
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

    const validateInputs = (): boolean => {
        const courseId = courseIdRef.current?.value;
        const instructorId = instructorIdRef.current?.value;
        const room = roomRef.current?.value;
        const startTime = startTimeRef.current?.value;
        const endTime = endTimeRef.current?.value;
        const dayOfWeek = dayOfWeekRef.current?.value;

        if (!courseId || courseId === '') {
            showAlert('Validasi Error', 'Pilih mata kuliah', 'error');
            return false;
        }
        if (!instructorId || instructorId === '') {
            showAlert('Validasi Error', 'Pilih dosen', 'error');
            return false;
        }
        if (!room || room.trim() === '') {
            showAlert('Validasi Error', 'Masukkan ruangan', 'error');
            return false;
        }
        if (!startTime) {
            showAlert('Validasi Error', 'Masukkan waktu mulai', 'error');
            return false;
        }
        if (!endTime) {
            showAlert('Validasi Error', 'Masukkan waktu selesai', 'error');
            return false;
        }
        if (dayOfWeek === undefined || dayOfWeek === null) {
            showAlert('Validasi Error', 'Pilih hari', 'error');
            return false;
        }

        // Validasi tambahan untuk day_of_week
        const dayValue = parseInt(dayOfWeek, 10);
        if (isNaN(dayValue) || dayValue < 0 || dayValue > 6) {
            showAlert('Validasi Error', 'Nilai hari tidak valid (harus 0-6)', 'error');
            return false;
        }

        return true;
    };

    // Perbaikan pada handleSubmit di CreateScheduleModal.tsx
    const handleSubmit = async (): Promise<void> => {
        try {
            if (!validateInputs()) {
                return;
            }

            setLoading(true);
            setError(null);

            // Pastikan parsing ke number dilakukan dengan benar
            const courseId = parseInt(courseIdRef.current?.value || '0', 10);
            const instructorId = parseInt(instructorIdRef.current?.value || '0', 10);
            const room = roomRef.current?.value?.trim() || '';
            const chapter = chapterRef.current?.value?.trim() || '';
            const startTime = startTimeRef.current?.value || '';
            const endTime = endTimeRef.current?.value || '';

            // Pastikan nilai day_of_week dikonversi dengan benar (nilai >= 1)
            let dayOfWeek = parseInt(dayOfWeekRef.current?.value || '0', 10);

            // Validasi nilai day_of_week sesuai yang diharapkan API
            if (isNaN(dayOfWeek) || dayOfWeek < 1 || dayOfWeek > 7) {
                showAlert('Validasi Error', 'Hari tidak valid (harus 1-7)', 'error');
                return;
            }

            console.log('Submitting schedule data:', {
                course_id: courseId,
                instructor_id: instructorId,
                room,
                chapter,
                start_time: startTime,
                end_time: endTime,
                day_of_week: dayOfWeek
            });

            await onCreateSchedule({
                course_id: courseId,
                instructor_id: instructorId,
                room,
                chapter,
                start_time: startTime,
                end_time: endTime,
                day_of_week: dayOfWeek
            });

            onClose();
        } catch (error: unknown) {
            // Error handling code tetap sama
        } finally {
            setLoading(false);
        }
    };

    return (
        <Modal
            isOpen={isOpen}
            onClose={onClose}
            title="Tambah Jadwal Baru"
            onConfirm={handleSubmit}
            loading={loading}
        >
            {error && (
                <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-md">
                    {error}
                </div>
            )}
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
                    <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Ruangan</label>
                    <input
                        ref={roomRef}
                        className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-transparent text-gray-900 dark:text-gray-100"
                        placeholder="Masukkan ruangan"
                        required
                    />
                </div>
                <div className="col-span-2">
                    <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Bab/Materi</label>
                    <input
                        ref={chapterRef}
                        className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-transparent text-gray-900 dark:text-gray-100"
                        placeholder="Masukkan bab/materi (opsional)"
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
                        <option value="">Pilih Hari</option>
                        {DAYS_OF_WEEK.map((day) => (
                            <option key={day.value} value={day.value}>
                                {day.label}
                            </option>
                        ))}
                    </select>
                </div>
            </div>
        </Modal>
    );
};

export default CreateScheduleModal;