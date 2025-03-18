import { useState, useMemo } from 'react';
import DynamicTable from '../../components/Tables/DynamicTable';
import { Column } from '../../types/table';
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
    },
    // Add more sample data here...
];

const courses = [
    'Algoritma dan Pemrograman',
    'Basis Data',
    'Pemrograman Web',
    'Struktur Data',
    'Jaringan Komputer'
];

const majors = [
    { value: 'Teknik Informatika', label: 'Teknik Informatika' },
    { value: 'Sistem Informasi', label: 'Sistem Informasi' }
];

const AttendanceHistory = () => {
    const [attendances] = useState<Attendance[]>(sampleAttendances);
    const [dateRange, setDateRange] = useState({ start: '', end: '' });
    const [selectedMajor, setSelectedMajor] = useState('');
    const [selectedCourse, setSelectedCourse] = useState('');
    const [selectedStatus, setSelectedStatus] = useState('');

    // Filter attendances based on selected filters
    const filteredAttendances = useMemo(() => {
        return attendances.filter(attendance => {
            const dateInRange = (!dateRange.start || attendance.date >= dateRange.start) &&
                (!dateRange.end || attendance.date <= dateRange.end);
            const matchesMajor = !selectedMajor || attendance.major === selectedMajor;
            const matchesCourse = !selectedCourse || attendance.course === selectedCourse;
            const matchesStatus = !selectedStatus || attendance.status === selectedStatus;

            return dateInRange && matchesMajor && matchesCourse && matchesStatus;
        });
    }, [attendances, dateRange, selectedMajor, selectedCourse, selectedStatus]);

    const showDetails = async (attendance: Attendance) => {
        await Swal.fire({
            title: 'Detail Kehadiran',
            html: `
                <div class="space-y-6 text-left">
                    <div>
                        <h3 class="text-lg font-semibold mb-2">Informasi Mahasiswa</h3>
                        <div class="grid grid-cols-2 gap-4">
                            <div>
                                <p class="text-sm text-gray-600">NIM</p>
                                <p class="font-medium">${attendance.studentId}</p>
                            </div>
                            <div>
                                <p class="text-sm text-gray-600">Nama</p>
                                <p class="font-medium">${attendance.studentName}</p>
                            </div>
                        </div>
                    </div>
    
                    <div>
                        <h3 class="text-lg font-semibold mb-2">Informasi Kehadiran</h3>
                        <div class="grid grid-cols-2 gap-4 bg-gray-50 p-4 rounded-lg">
                            <div>
                                <p class="text-sm text-gray-600">Check-in</p>
                                <p class="font-medium ${!attendance.checkIn ? 'text-red-600' : ''}">
                                    ${attendance.checkIn || 'Tidak Check-in'}
                                </p>
                            </div>
                            <div>
                                <p class="text-sm text-gray-600">Check-out</p>
                                <p class="font-medium ${!attendance.checkOut ? 'text-red-600' : ''}">
                                    ${attendance.checkOut || 'Tidak Check-out'}
                                </p>
                            </div>
                            <div>
                                <p class="text-sm text-gray-600">Status</p>
                                <p class="font-medium">
                                    <span class="px-2 py-1 rounded-full text-sm ${attendance.status === 'Hadir' ? 'bg-green-100 text-green-800' :
                    attendance.status === 'Terlambat' ? 'bg-yellow-100 text-yellow-800' :
                        'bg-red-100 text-red-800'
                }">
                                        ${attendance.status}
                                    </span>
                                </p>
                            </div>
                            <div>
                                <p class="text-sm text-gray-600">Tanggal</p>
                                <p class="font-medium">
                                    ${new Date(attendance.date).toLocaleDateString('id-ID')}
                                </p>
                            </div>
                        </div>
                    </div>
    
                    <div>
                        <h3 class="text-lg font-semibold mb-2">Verifikasi Wajah</h3>
                        <div class="bg-gray-50 p-4 rounded-lg">
                            <div class="grid grid-cols-2 gap-4">
                                <div>
                                    <p class="text-sm text-gray-600">Status</p>
                                    <p class="font-medium ${attendance.faceVerification.status ? 'text-green-600' : 'text-red-600'}">
                                        ${attendance.faceVerification.status ? 'Terverifikasi' : 'Tidak Terverifikasi'}
                                    </p>
                                </div>
                                <div>
                                    <p class="text-sm text-gray-600">Confidence</p>
                                    <p class="font-medium">${(attendance.faceVerification.confidence * 100).toFixed(2)}%</p>
                                </div>
                            </div>
                        </div>
                    </div>
    
                    <div>
                        <h3 class="text-lg font-semibold mb-2">Riwayat Lokasi</h3>
                        <div class="max-h-60 overflow-y-auto">
                            <table class="min-w-full divide-y divide-gray-200">
                                <thead class="bg-gray-50">
                                    <tr>
                                        <th class="px-4 py-2 text-left text-xs font-medium text-gray-500">Waktu</th>
                                        <th class="px-4 py-2 text-left text-xs font-medium text-gray-500">Koordinat</th>
                                        <th class="px-4 py-2 text-left text-xs font-medium text-gray-500">Akurasi</th>
                                    </tr>
                                </thead>
                                <tbody class="bg-white divide-y divide-gray-200">
                                    ${attendance.locationData.map(location => `
                                        <tr>
                                            <td class="px-4 py-2 text-sm">
                                                ${new Date(location.timestamp).toLocaleString()}
                                            </td>
                                            <td class="px-4 py-2 text-sm">
                                                ${location.latitude}, ${location.longitude}
                                            </td>
                                            <td class="px-4 py-2 text-sm">
                                                ${location.accuracy}m
                                            </td>
                                        </tr>
                                    `).join('')}
                                </tbody>
                            </table>
                        </div>
                    </div>
    
                    ${attendance.status === 'Terlambat' && attendance.lateReason ? `
                        <div>
                            <h3 class="text-lg font-semibold mb-2">Alasan Keterlambatan</h3>
                            <p class="text-sm bg-yellow-50 p-4 rounded-lg">${attendance.lateReason}</p>
                        </div>
                    ` : ''}
                </div>
            `,
            width: '800px',
            showCloseButton: true,
            showConfirmButton: false
        });
    };

    const handleEdit = async (attendance: Attendance) => {
        const { value: formValues } = await Swal.fire({
            title: 'Edit Kehadiran',
            html: `
                <div class="space-y-4">
                    <div>
                        <label class="block text-sm font-medium text-gray-700 mb-1">Status</label>
                        <select id="status" class="swal2-input">
                            <option value="Hadir" ${attendance.status === 'Hadir' ? 'selected' : ''}>Hadir</option>
                            <option value="Terlambat" ${attendance.status === 'Terlambat' ? 'selected' : ''}>Terlambat</option>
                            <option value="Tidak Hadir" ${attendance.status === 'Tidak Hadir' ? 'selected' : ''}>Tidak Hadir</option>
                        </select>
                    </div>
                    <div>
                        <label class="block text-sm font-medium text-gray-700 mb-1">Waktu Check-in</label>
                        <input id="checkIn" type="time" class="swal2-input" value="${attendance.checkIn}">
                    </div>
                    <div>
                        <label class="block text-sm font-medium text-gray-700 mb-1">Waktu Check-out</label>
                        <input id="checkOut" type="time" class="swal2-input" value="${attendance.checkOut}">
                    </div>
                </div>
            `,
            focusConfirm: false,
            showCancelButton: true,
            confirmButtonText: 'Simpan',
            cancelButtonText: 'Batal'
        });

        if (formValues) {
            await Swal.fire('Berhasil!', 'Data kehadiran telah diperbarui.', 'success');
        }
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
                        Program Studi
                    </label>
                    <div className="relative">
                        <select
                            value={selectedMajor}
                            onChange={(e) => setSelectedMajor(e.target.value)}
                            className="w-full rounded-lg border border-stroke bg-transparent px-4 py-2 pr-10 outline-none focus:border-primary appearance-none"
                        >
                            <option value="">Semua Program Studi</option>
                            {majors.map((major, index) => (
                                <option key={index} value={major.value}>{major.label}</option>
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
                            onClick={() => showDetails(attendance)}
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
        </div>
    );
};

export default AttendanceHistory;