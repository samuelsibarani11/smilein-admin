import React from 'react';
import Modal from '../../components/Modal';
import { AttendanceWithScheduleRead } from '../../types/attendance';
import { format, parseISO } from 'date-fns';

interface AttendanceDetailModalProps {
    isOpen: boolean;
    onClose: () => void;
    attendance: AttendanceWithScheduleRead;
}

const AttendanceDetailModal: React.FC<AttendanceDetailModalProps> = ({
    isOpen,
    onClose,
    attendance
}) => {
    // Format date
    const formatDate = (dateString: string | null) => {
        if (!dateString) return '-';
        try {
            return format(new Date(dateString), 'dd/MM/yyyy');
        } catch (error) {
            return dateString;
        }
    };

    // Format time with proper datetime formatting
    const formatTime = (timeString: string | null) => {
        if (!timeString) return '-';
        try {
            // Parse ISO timestamp and format it as dd/MM/yyyy HH:mm:ss
            return format(parseISO(timeString), 'dd/MM/yyyy HH:mm:ss');
        } catch (error) {
            return timeString;
        }
    };

    // Format datetime
    const formatDateTime = (dateTimeString: string | null) => {
        if (!dateTimeString) return '-';
        try {
            return format(new Date(dateTimeString), 'dd/MM/yyyy HH:mm:ss');
        } catch (error) {
            return dateTimeString;
        }
    };

    // Get status display
    const getStatusDisplay = (status: string) => {
        switch (status.toUpperCase()) {
            case 'PRESENT':
                return {
                    text: 'Hadir',
                    className: 'bg-green-100 text-green-800 dark:bg-green-900/50 dark:text-green-300'
                };
            case 'LATE':
                return {
                    text: 'Terlambat',
                    className: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/50 dark:text-yellow-300'
                };
            case 'ABSENT':
                return {
                    text: 'Tidak Hadir',
                    className: 'bg-red-100 text-red-800 dark:bg-red-900/50 dark:text-red-300'
                };
            default:
                return {
                    text: status,
                    className: 'bg-gray-100 text-gray-800 dark:bg-gray-700/50 dark:text-gray-300'
                };
        }
    };

    const status = getStatusDisplay(attendance.status);

    // Generate full image URL with backend URL
    const getFullImageUrl = (imagePath: string | null): string => {
        if (!imagePath) return ''; // Return empty string instead of null

        // If the path already starts with http:// or https://, return it as is
        if (imagePath.startsWith('http://') || imagePath.startsWith('https://')) {
            return imagePath;
        }

        // Extract filename from the path
        const filename = imagePath.split('/').pop();

        // Backend URL - change this to your environment variable if available
        const BACKEND_URL = 'http://localhost:8000';

        // Return the complete path to the attendance images folder with backend URL
        return `${BACKEND_URL}/uploads/attendance_images/${filename}`;
    };

    return (
        <Modal
            isOpen={isOpen}
            onClose={onClose}
            title="Detail Kehadiran"
            showConfirmButton={false}
            size="lg"
        >
            <div className="space-y-6">
                <div>
                    <h3 className="text-lg font-semibold mb-2 dark:text-white text-gray-900">Informasi Mahasiswa</h3>
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <p className="text-sm text-gray-500 dark:text-gray-400">NIM</p>
                            <p className="font-medium dark:text-gray-100">{attendance.student?.nim || '-'}</p>
                        </div>
                        <div>
                            <p className="text-sm text-gray-500 dark:text-gray-400">Nama</p>
                            <p className="font-medium dark:text-gray-100">{attendance.student?.full_name || '-'}</p>
                        </div>
                        <div>
                            <p className="text-sm text-gray-500 dark:text-gray-400">Program Studi</p>
                            <p className="font-medium dark:text-gray-100">{attendance.student?.major_name || '-'}</p>
                        </div>
                        <div>
                            <p className="text-sm text-gray-500 dark:text-gray-400">Tahun Masuk</p>
                            <p className="font-medium dark:text-gray-100">{attendance.student?.year || '-'}</p>
                        </div>
                    </div>
                </div>

                <div>
                    <h3 className="text-lg font-semibold mb-2 dark:text-white text-gray-900">Informasi Mata Kuliah</h3>
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <p className="text-sm text-gray-500 dark:text-gray-400">Mata Kuliah</p>
                            <p className="font-medium dark:text-gray-100">{attendance.schedule?.course?.course_name || '-'}</p>
                        </div>
                        <div>
                            <p className="text-sm text-gray-500 dark:text-gray-400">Pengajar</p>
                            <p className="font-medium dark:text-gray-100">{attendance.schedule?.instructor?.full_name || '-'}</p>
                        </div>
                        <div>
                            <p className="text-sm text-gray-500 dark:text-gray-400">Ruangan</p>
                            <p className="font-medium dark:text-gray-100">{attendance.schedule?.room?.name || '-'}</p>
                        </div>
                        <div>
                            <p className="text-sm text-gray-500 dark:text-gray-400">Jadwal</p>
                            <p className="font-medium dark:text-gray-100">
                                {attendance.schedule?.start_time} - {attendance.schedule?.end_time}
                            </p>
                        </div>
                    </div>
                </div>

                <div>
                    <h3 className="text-lg font-semibold mb-2 dark:text-white text-gray-900">Informasi Kehadiran</h3>
                    <div className="grid grid-cols-2 gap-4 bg-gray-50 dark:bg-gray-700/30 p-4 rounded-lg">
                        <div>
                            <p className="text-sm text-gray-500 dark:text-gray-400">ID Kehadiran</p>
                            <p className="font-medium dark:text-gray-100">{attendance.attendance_id}</p>
                        </div>
                        <div>
                            <p className="text-sm text-gray-500 dark:text-gray-400">Tanggal</p>
                            <p className="font-medium dark:text-gray-100">{formatDate(attendance.date)}</p>
                        </div>
                        <div>
                            <p className="text-sm text-gray-500 dark:text-gray-400">Check-in</p>
                            <p className="font-medium dark:text-gray-100">{formatTime(attendance.check_in_time) || 'Tidak Check-in'}</p>
                        </div>
                        <div>
                            <p className="text-sm text-gray-500 dark:text-gray-400">Status</p>
                            <p className="font-medium">
                                <span className={`px-2 py-1 rounded-full text-sm ${status.className}`}>
                                    {status.text}
                                </span>
                            </p>
                        </div>
                        <div>
                            <p className="text-sm text-gray-500 dark:text-gray-400">Dibuat pada</p>
                            <p className="font-medium dark:text-gray-100">{formatDateTime(attendance.created_at)}</p>
                        </div>
                        <div>
                            <p className="text-sm text-gray-500 dark:text-gray-400">Diperbarui pada</p>
                            <p className="font-medium dark:text-gray-100">{formatDateTime(attendance.updated_at) || '-'}</p>
                        </div>
                    </div>
                </div>

                {/* Captured Image Section */}
                {attendance.image_captured_url && (
                    <div>
                        <h3 className="text-lg font-semibold mb-2 dark:text-white text-gray-900">Foto Kehadiran</h3>
                        <div className="bg-gray-50 dark:bg-gray-700/30 p-4 rounded-lg flex justify-center">
                            <div className="max-w-md">
                                <img
                                    src={getFullImageUrl(attendance.image_captured_url)}
                                    alt="Foto Kehadiran"
                                    className="rounded-lg shadow-md max-h-96 object-contain"
                                />
                                <p className="text-sm text-gray-500 dark:text-gray-400 text-center mt-2">
                                    Foto diambil saat check-in
                                </p>
                            </div>
                        </div>
                    </div>
                )}

                {attendance.face_verification_data && (
                    <div>
                        <h3 className="text-lg font-semibold mb-2 dark:text-white text-gray-900">Verifikasi Wajah</h3>
                        <div className="bg-gray-50 dark:bg-gray-700/30 p-4 rounded-lg">
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <p className="text-sm text-gray-500 dark:text-gray-400">Status Verifikasi</p>
                                    <p className="font-medium dark:text-gray-100">
                                        {attendance.face_verification_data ? 'Terverifikasi' : 'Tidak Terverifikasi'}
                                    </p>
                                </div>
                                <div>
                                    <p className="text-sm text-gray-500 dark:text-gray-400">Senyum Terdeteksi</p>
                                    <p className="font-medium dark:text-gray-100">
                                        {attendance.smile_detected ? 'Ya' : 'Tidak'}
                                    </p>
                                </div>
                            </div>
                            {typeof attendance.face_verification_data === 'object' && (
                                <div className="mt-4">
                                    <p className="text-sm text-gray-500 dark:text-gray-400">Detail Verifikasi</p>
                                    <pre className="mt-2 bg-gray-100 dark:bg-gray-800 p-2 rounded-md text-xs overflow-auto">
                                        {JSON.stringify(attendance.face_verification_data, null, 2)}
                                    </pre>
                                </div>
                            )}
                        </div>
                    </div>
                )}

                {attendance.location_data && (
                    <div>
                        <h3 className="text-lg font-semibold mb-2 dark:text-white text-gray-900">Data Lokasi</h3>
                        <div className="bg-gray-50 dark:bg-gray-700/30 p-4 rounded-lg">
                            {typeof attendance.location_data === 'object' && (
                                <pre className="bg-gray-100 dark:bg-gray-800 p-2 rounded-md text-xs overflow-auto">
                                    {JSON.stringify(attendance.location_data, null, 2)}
                                </pre>
                            )}
                        </div>
                    </div>
                )}
            </div>
        </Modal>
    );
};

export default AttendanceDetailModal;