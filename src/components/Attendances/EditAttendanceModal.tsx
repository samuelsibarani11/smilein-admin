import React, { useRef } from 'react';
import Modal from '../../components/Modal';
import Swal from 'sweetalert2';

interface Attendance {
    id: number;
    studentId: string;
    studentName: string;
    course: string;
    date: string;
    checkIn: string;
    checkOut: string;
    status: 'Hadir' | 'Terlambat' | 'Tidak Hadir';
}

interface UpdateAttendanceModalProps {
    isOpen: boolean;
    onClose: () => void;
    currentAttendance: Attendance | null;
    onUpdateAttendance: (attendanceId: number, attendanceData: Partial<Attendance>) => Promise<void>;
}

const ATTENDANCE_STATUS = ['Hadir', 'Terlambat', 'Tidak Hadir'];

const UpdateAttendanceModal: React.FC<UpdateAttendanceModalProps> = ({
    isOpen,
    onClose,
    currentAttendance,
    onUpdateAttendance
}) => {
    const statusRef = useRef<HTMLSelectElement>(null);
    const checkInRef = useRef<HTMLInputElement>(null);
    const checkOutRef = useRef<HTMLInputElement>(null);

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
        if (!currentAttendance) {
            showAlert('Error', 'Tidak ada data kehadiran yang dipilih', 'error');
            return;
        }

        const status = statusRef.current?.value;
        const checkIn = checkInRef.current?.value;
        const checkOut = checkOutRef.current?.value;

        const updateData: Partial<Attendance> = {};

        if (status && status !== currentAttendance.status) {
            updateData.status = status as 'Hadir' | 'Terlambat' | 'Tidak Hadir';
        }
        if (checkIn && checkIn !== currentAttendance.checkIn) {
            updateData.checkIn = checkIn;
        }
        if (checkOut && checkOut !== currentAttendance.checkOut) {
            updateData.checkOut = checkOut;
        }

        if (Object.keys(updateData).length === 0) {
            showAlert('Info', 'Tidak ada perubahan yang dilakukan', 'warning');
            return;
        }

        try {
            await onUpdateAttendance(currentAttendance.id, updateData);
            onClose();
        } catch (err) {
            console.error('Failed to update attendance:', err);
            showAlert('Error!', 'Gagal memperbarui data kehadiran', 'error');
        }
    };

    if (!currentAttendance) return null;

    return (
        <Modal
            isOpen={isOpen}
            onClose={onClose}
            title="Perbarui Kehadiran"
            onConfirm={handleSubmit}
        >
            <div className="grid grid-cols-1 gap-6">
                <div>
                    <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                        Nama Mahasiswa
                    </label>
                    <input
                        type="text"
                        value={currentAttendance.studentName}
                        disabled
                        className="w-full px-4 py-3 bg-gray-100 dark:bg-gray-800 border border-gray-200 dark:border-gray-600 rounded-lg text-gray-900 dark:text-gray-100"
                    />
                </div>
                <div>
                    <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                        Mata Kuliah
                    </label>
                    <input
                        type="text"
                        value={currentAttendance.course}
                        disabled
                        className="w-full px-4 py-3 bg-gray-100 dark:bg-gray-800 border border-gray-200 dark:border-gray-600 rounded-lg text-gray-900 dark:text-gray-100"
                    />
                </div>
                <div>
                    <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                        Tanggal
                    </label>
                    <input
                        type="text"
                        value={currentAttendance.date}
                        disabled
                        className="w-full px-4 py-3 bg-gray-100 dark:bg-gray-800 border border-gray-200 dark:border-gray-600 rounded-lg text-gray-900 dark:text-gray-100"
                    />
                </div>
                <div>
                    <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                        Status
                    </label>
                    <select
                        ref={statusRef}
                        defaultValue={currentAttendance.status}
                        className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-transparent text-gray-900 dark:text-gray-100"
                        required
                    >
                        {ATTENDANCE_STATUS.map((status) => (
                            <option key={status} value={status}>
                                {status}
                            </option>
                        ))}
                    </select>
                </div>
                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                            Waktu Check-in
                        </label>
                        <input
                            ref={checkInRef}
                            type="time"
                            defaultValue={currentAttendance.checkIn}
                            className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-transparent text-gray-900 dark:text-gray-100"
                            required
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                            Waktu Check-out
                        </label>
                        <input
                            ref={checkOutRef}
                            type="time"
                            defaultValue={currentAttendance.checkOut}
                            className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-transparent text-gray-900 dark:text-gray-100"
                            required
                        />
                    </div>
                </div>
            </div>
        </Modal>
    );
};

export default UpdateAttendanceModal;