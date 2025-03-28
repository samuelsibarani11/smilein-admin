import React, { useState, useMemo } from 'react';
import DynamicTable from '../../components/Tables/DynamicTable';
import { Column } from '../../types/table';
import showAttendanceDetails from '../../components/Attendances/DetailAttendanceModal';
import Swal from 'sweetalert2';
import UpdateAttendanceModal from '../../components/Attendances/EditAttendanceModal';

interface Attendance {
    id: number;
    studentId: string;
    studentName: string;
    course: string;
    date: string;
    checkIn: string;
    checkOut: string;
    status: 'Hadir' | 'Terlambat' | 'Tidak Hadir';
    locationData: {
        latitude: number;
        longitude: number;
        accuracy: number;
        timestamp: string;
    }[];
    faceVerification: {
        status: boolean;
        confidence: number;
        timestamp: string;
    };
    major: string;
    lateReason?: string;
}

const sampleAttendances: Attendance[] = [
    {
        id: 1,
        studentId: '2020001',
        studentName: 'John Doe',
        course: 'Algoritma dan Pemrograman',
        date: '2024-01-05',
        checkIn: '08:00:00',
        checkOut: '09:40:00',
        status: 'Hadir',
        locationData: [
            {
                latitude: -6.2088,
                longitude: 106.8456,
                accuracy: 10,
                timestamp: '2024-01-05T08:00:00Z'
            }
        ],
        faceVerification: {
            status: true,
            confidence: 0.98,
            timestamp: '2024-01-05T08:00:00Z'
        },
        major: 'Teknik Informatika'
    },
    {
        id: 2,
        studentId: '2020002',
        studentName: 'Jane Smith',
        course: 'Basis Data',
        date: '2024-01-05',
        checkIn: '10:15:00',
        checkOut: '11:45:00',
        status: 'Terlambat',
        locationData: [
            {
                latitude: -6.2089,
                longitude: 106.8457,
                accuracy: 15,
                timestamp: '2024-01-05T10:15:00Z'
            }
        ],
        faceVerification: {
            status: true,
            confidence: 0.95,
            timestamp: '2024-01-05T10:15:00Z'
        },
        major: 'Sistem Informasi',
        lateReason: 'Kendala transportasi'
    },
    {
        id: 3,
        studentId: '2020003',
        studentName: 'Bob Johnson',
        course: 'Pemrograman Web',
        date: '2024-01-06',
        checkIn: '',
        checkOut: '',
        status: 'Tidak Hadir',
        locationData: [],
        faceVerification: {
            status: false,
            confidence: 0,
            timestamp: ''
        },
        major: 'Teknik Informatika'
    }
];

const courses = [
    'Algoritma dan Pemrograman',
    'Basis Data',
    'Pemrograman Web',
    'Struktur Data',
    'Jaringan Komputer'
];

const AttendanceHistory: React.FC = () => {
    const [attendances, setAttendances] = useState<Attendance[]>(sampleAttendances);
    const [dateRange, setDateRange] = useState({ start: '', end: '' });
    const [selectedCourse, setSelectedCourse] = useState('');
    const [selectedStatus, setSelectedStatus] = useState('');
    const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false);
    const [currentAttendance, setCurrentAttendance] = useState<Attendance | null>(null);

    // Filter attendances based on selected filters
    const filteredAttendances = useMemo(() => {
        return attendances.filter(attendance => {
            const dateInRange = (!dateRange.start || attendance.date >= dateRange.start) &&
                (!dateRange.end || attendance.date <= dateRange.end);
            const matchesCourse = !selectedCourse || attendance.course === selectedCourse;
            const matchesStatus = !selectedStatus || attendance.status === selectedStatus;

            return dateInRange && matchesCourse && matchesStatus;
        });
    }, [attendances, dateRange, selectedCourse, selectedStatus]);

    const handleShowDetails = (attendance: Attendance) => {
        showAttendanceDetails(attendance);
    };

    const handleUpdateAttendance = async (attendanceId: number, attendanceData: Partial<Attendance>): Promise<void> => {
        try {
            // Simulate an API call to update attendance
            const updatedAttendances = attendances.map(item =>
                item.id === attendanceId
                    ? { ...item, ...attendanceData }
                    : item
            );

            setAttendances(updatedAttendances);

            // Show success alert
            await Swal.fire({
                title: 'Berhasil!',
                text: 'Data kehadiran berhasil diperbarui',
                icon: 'success',
                confirmButtonText: 'OK',
                confirmButtonColor: '#3B82F6'
            });
        } catch (error) {
            console.error('Failed to update attendance:', error);
            await Swal.fire({
                title: 'Error!',
                text: 'Gagal memperbarui data kehadiran',
                icon: 'error',
                confirmButtonText: 'OK',
                confirmButtonColor: '#3B82F6'
            });
        }
    };

    const handleEdit = (attendance: Attendance) => {
        setCurrentAttendance(attendance);
        setIsUpdateModalOpen(true);
    };

    const attendanceColumns: Column[] = [
        {
            header: 'ID Kehadiran',
            accessor: 'id',
            minWidth: '100px'
        },
        {
            header: 'NIM',
            accessor: 'studentId',
            minWidth: '120px'
        },
        {
            header: 'Nama',
            accessor: 'studentName',
            minWidth: '200px'
        },
        {
            header: 'Mata Kuliah',
            accessor: 'course',
            minWidth: '200px'
        },
        {
            header: 'Tanggal',
            accessor: 'date',
            minWidth: '120px',
            cell: (item: Attendance) => (
                <span>
                    {new Date(item.date).toLocaleDateString('id-ID')}
                </span>
            )
        },
        {
            header: 'Status',
            accessor: 'status',
            minWidth: '120px',
            cell: (item: Attendance) => (
                <span className={`px-2 py-1 rounded-full text-sm ${item.status === 'Hadir' ? 'bg-green-100 text-green-800' :
                    item.status === 'Terlambat' ? 'bg-yellow-100 text-yellow-800' :
                        'bg-red-100 text-red-800'
                    }`}>
                    {item.status}
                </span>
            )
        },
        {
            header: 'Verifikasi Wajah',
            accessor: 'faceVerification',
            minWidth: '150px',
            cell: (item: Attendance) => (
                <span className={`px-2 py-1 rounded-full text-sm ${item.faceVerification.status ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                    }`}>
                    {item.faceVerification.status ? 'Terverifikasi' : 'Tidak Terverifikasi'}
                </span>
            )
        }
    ];

    return (
        <div className="space-y-8 p-4">
            <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-semibold">Riwayat Kehadiran</h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 mb-6">
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                        Tanggal Mulai
                    </label>
                    <input
                        type="date"
                        value={dateRange.start}
                        onChange={(e) => setDateRange(prev => ({ ...prev, start: e.target.value }))}
                        className="w-full rounded-lg border border-stroke bg-transparent px-4 py-2 outline-none focus:border-primary"
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                        Tanggal Akhir
                    </label>
                    <input
                        type="date"
                        value={dateRange.end}
                        onChange={(e) => setDateRange(prev => ({ ...prev, end: e.target.value }))}
                        className="w-full rounded-lg border border-stroke bg-transparent px-4 py-2 outline-none focus:border-primary"
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                        Mata Kuliah
                    </label>
                    <div className="relative">
                        <select
                            value={selectedCourse}
                            onChange={(e) => setSelectedCourse(e.target.value)}
                            className="w-full rounded-lg border border-stroke bg-transparent px-4 py-2 pr-10 outline-none focus:border-primary appearance-none"
                        >
                            <option value="">Semua Mata Kuliah</option>
                            {courses.map((course, index) => (
                                <option key={index} value={course}>{course}</option>
                            ))}
                        </select>
                        <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2">
                            <svg className="h-4 w-4 text-gray-400" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" stroke="currentColor">
                                <path d="M19 9l-7 7-7-7"></path>
                            </svg>
                        </div>
                    </div>
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                        Status Kehadiran
                    </label>
                    <div className="relative">
                        <select
                            value={selectedStatus}
                            onChange={(e) => setSelectedStatus(e.target.value)}
                            className="w-full rounded-lg border border-stroke bg-transparent px-4 py-2 pr-10 outline-none focus:border-primary appearance-none"
                        >
                            <option value="">Semua Status</option>
                            <option value="Hadir">Hadir</option>
                            <option value="Terlambat">Terlambat</option>
                            <option value="Tidak Hadir">Tidak Hadir</option>
                        </select>
                        <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2">
                            <svg className="h-4 w-4 text-gray-400" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" stroke="currentColor">
                                <path d="M19 9l-7 7-7-7"></path>
                            </svg>
                        </div>
                    </div>
                </div>
            </div>

            <DynamicTable
                columns={attendanceColumns}
                data={filteredAttendances}
                className="shadow-sm"
                searchable={true}
                searchFields={['studentId', 'studentName']}
                renderActions={(attendance: Attendance) => (
                    <div className="flex space-x-2">
                        <button
                            onClick={() => handleShowDetails(attendance)}
                            className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
                        >
                            Detail
                        </button>
                        <button
                            onClick={() => handleEdit(attendance)}
                            className="px-4 py-2 bg-amber-500 text-white rounded-md hover:bg-amber-600"
                        >
                            Edit
                        </button>
                    </div>
                )}
            />

            {/* Update Attendance Modal */}
            <UpdateAttendanceModal
                isOpen={isUpdateModalOpen}
                onClose={() => setIsUpdateModalOpen(false)}
                currentAttendance={currentAttendance}
                onUpdateAttendance={handleUpdateAttendance}
            />
        </div>
    );
};

export default AttendanceHistory;