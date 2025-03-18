import { useState } from 'react';
import DynamicTable from '../../components/Tables/DynamicTable';
import { Column } from '../../types/table';
import Swal from 'sweetalert2';

interface StudentSchedule {
    id: number;
    studentId: string;
    studentName: string;
    courseId: string;
    courseName: string;
    credits: number;
    lecturer: string;
    room: string;
    day: string;
    startTime: string;
    endTime: string;
    department: string;
    batch: string;
    createdAt: string;
}

interface FilterState {
    studentId: string;
    department: string;
    batch: string;
}

const MAX_CREDITS = 24; 

const StudentSchedules = () => {
    const [schedules, setSchedules] = useState<StudentSchedule[]>([
        {
            id: 1,
            studentId: '2024001',
            studentName: 'John Student',
            courseId: 'CS101',
            courseName: 'Algoritma dan Pemrograman',
            credits: 3,
            lecturer: 'Dr. John Doe',
            room: 'Lab Komputer 1',
            day: 'Senin',
            startTime: '08:00',
            endTime: '10:30',
            department: 'Teknik Informatika',
            batch: '2024',
            createdAt: '2024-01-01'
        }
    ]);

    const [filters, setFilters] = useState<FilterState>({
        studentId: '',
        department: '',
        batch: ''
    });

    const [viewMode, setViewMode] = useState<'table' | 'calendar'>('table');
    const [selectedStudent, setSelectedStudent] = useState<string>('');

    const checkScheduleConflict = (newSchedule: Partial<StudentSchedule>, studentId: string, editId?: number): boolean => {
        const studentSchedules = schedules.filter(s => s.studentId === studentId);
        return studentSchedules.some(schedule => {
            if (editId && schedule.id === editId) return false;

            if (schedule.day === newSchedule.day) {
                const newStart = new Date(`2024-01-01T${newSchedule.startTime}`);
                const newEnd = new Date(`2024-01-01T${newSchedule.endTime}`);
                const existingStart = new Date(`2024-01-01T${schedule.startTime}`);
                const existingEnd = new Date(`2024-01-01T${schedule.endTime}`);

                return (
                    (newStart >= existingStart && newStart < existingEnd) ||
                    (newEnd > existingStart && newEnd <= existingEnd) ||
                    (newStart <= existingStart && newEnd >= existingEnd)
                );
            }
            return false;
        });
    };

    const calculateTotalCredits = (studentId: string, newCredits?: number): number => {
        const studentSchedules = schedules.filter(s => s.studentId === studentId);
        const currentCredits = studentSchedules.reduce((sum, schedule) => sum + schedule.credits, 0);
        return newCredits ? currentCredits + newCredits : currentCredits;
    };

    const handleAddSchedule = async () => {
        const { value: formValues } = await Swal.fire({
            title: 'Tambah Jadwal Mahasiswa',
            html: `
                <div class="space-y-4">
                    <div>
                        <label class="block text-sm font-medium text-gray-700 mb-1">NIM</label>
                        <input id="studentId" class="swal2-input" placeholder="NIM Mahasiswa">
                    </div>
                    <div>
                        <label class="block text-sm font-medium text-gray-700 mb-1">Nama Mahasiswa</label>
                        <input id="studentName" class="swal2-input" placeholder="Nama Mahasiswa">
                    </div>
                    <div>
                        <label class="block text-sm font-medium text-gray-700 mb-1">Mata Kuliah</label>
                        <input id="courseName" class="swal2-input" placeholder="Nama Mata Kuliah">
                    </div>
                    <div>
                        <label class="block text-sm font-medium text-gray-700 mb-1">SKS</label>
                        <input id="credits" type="number" class="swal2-input" placeholder="Jumlah SKS">
                    </div>
                    <div>
                        <label class="block text-sm font-medium text-gray-700 mb-1">Dosen</label>
                        <input id="lecturer" class="swal2-input" placeholder="Nama Dosen">
                    </div>
                    <div>
                        <label class="block text-sm font-medium text-gray-700 mb-1">Ruangan</label>
                        <input id="room" class="swal2-input" placeholder="Ruangan">
                    </div>
                    <div>
                        <label class="block text-sm font-medium text-gray-700 mb-1">Hari</label>
                        <select id="day" class="swal2-select">
                            <option value="Senin">Senin</option>
                            <option value="Selasa">Selasa</option>
                            <option value="Rabu">Rabu</option>
                            <option value="Kamis">Kamis</option>
                            <option value="Jumat">Jumat</option>
                        </select>
                    </div>
                    <div>
                        <label class="block text-sm font-medium text-gray-700 mb-1">Waktu Mulai</label>
                        <input id="startTime" type="time" class="swal2-input">
                    </div>
                    <div>
                        <label class="block text-sm font-medium text-gray-700 mb-1">Waktu Selesai</label>
                        <input id="endTime" type="time" class="swal2-input">
                    </div>
                </div>
            `,
            focusConfirm: false,
            showCancelButton: true,
            confirmButtonText: 'Tambah',
            cancelButtonText: 'Batal',
            preConfirm: () => {
                const values = {
                    studentId: (document.getElementById('studentId') as HTMLInputElement).value,
                    studentName: (document.getElementById('studentName') as HTMLInputElement).value,
                    courseName: (document.getElementById('courseName') as HTMLInputElement).value,
                    credits: parseInt((document.getElementById('credits') as HTMLInputElement).value),
                    lecturer: (document.getElementById('lecturer') as HTMLInputElement).value,
                    room: (document.getElementById('room') as HTMLInputElement).value,
                    day: (document.getElementById('day') as HTMLSelectElement).value,
                    startTime: (document.getElementById('startTime') as HTMLInputElement).value,
                    endTime: (document.getElementById('endTime') as HTMLInputElement).value,
                };

                if (!Object.values(values).every(Boolean)) {
                    Swal.showValidationMessage('Semua field harus diisi');
                    return false;
                }

                if (checkScheduleConflict(values, values.studentId)) {
                    Swal.showValidationMessage('Terdapat bentrok jadwal pada waktu yang dipilih');
                    return false;
                }

                if (calculateTotalCredits(values.studentId, values.credits) > MAX_CREDITS) {
                    Swal.showValidationMessage(`Total SKS melebihi batas maksimum (${MAX_CREDITS} SKS)`);
                    return false;
                }

                return values;
            }
        });

        if (formValues) {
            const newSchedule: StudentSchedule = {
                id: schedules.length + 1,
                courseId: `CS${schedules.length + 101}`,
                ...formValues,
                department: 'Teknik Informatika',
                batch: formValues.studentId.substring(0, 4),
                createdAt: new Date().toISOString()
            };

            setSchedules(prev => [...prev, newSchedule]);
            await Swal.fire('Berhasil!', 'Jadwal mahasiswa telah ditambahkan.', 'success');
        }
    };

    const handleExport = async (type: 'excel' | 'pdf') => {
        const selectedStudentData = selectedStudent
            ? schedules.filter(s => s.studentId === selectedStudent)
            : schedules;

        await Swal.fire({
            title: 'Ekspor Data',
            text: `Data ${selectedStudent ? 'mahasiswa terpilih' : 'semua mahasiswa'} akan diekspor ke ${type.toUpperCase()}`,
            icon: 'info',
            showCancelButton: true,
            confirmButtonText: 'Ekspor',
            cancelButtonText: 'Batal'
        });
        // Implement export logic here
    };

    const scheduleColumns: Column[] = [
        {
            header: 'NIM',
            accessor: 'studentId',
            minWidth: '120px',
        },
        {
            header: 'Nama Mahasiswa',
            accessor: 'studentName',
            minWidth: '200px',
        },
        {
            header: 'Mata Kuliah',
            accessor: 'courseName',
            minWidth: '200px',
        },
        {
            header: 'SKS',
            accessor: 'credits',
            minWidth: '80px',
        },
        {
            header: 'Jadwal',
            accessor: 'schedule',
            minWidth: '200px',
            cell: (item: StudentSchedule) => (
                <span>{`${item.day}, ${item.startTime} - ${item.endTime}`}</span>
            ),
        },
        {
            header: 'Program Studi',
            accessor: 'department',
            minWidth: '150px',
        },
        {
            header: 'Dosen',
            accessor: 'lecturer',
            minWidth: '150px',
        },
        {
            header: 'Ruangan',
            accessor: 'room',
            minWidth: '120px',
        },
    ];

    const renderFilters = () => (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
            <input
                type="text"
                className="border rounded-md p-2"
                placeholder="Cari NIM/Nama Mahasiswa"
                value={filters.studentId}
                onChange={(e) => setFilters({ ...filters, studentId: e.target.value })}
            />
            <select
                className="border rounded-md p-2"
                value={filters.department}
                onChange={(e) => setFilters({ ...filters, department: e.target.value })}
            >
                <option value="">Program Studi</option>
                <option value="Teknik Informatika">Teknik Informatika</option>
                <option value="Sistem Informasi">Sistem Informasi</option>
            </select>
            <select
                className="border rounded-md p-2"
                value={filters.batch}
                onChange={(e) => setFilters({ ...filters, batch: e.target.value })}
            >
                <option value="">Angkatan</option>
                <option value="2024">2024</option>
                <option value="2023">2023</option>
                <option value="2022">2022</option>
            </select>
        </div>
    );

    return (
        <div className="space-y-8 p-4">
            <div>
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-xl font-semibold">Jadwal Mahasiswa</h2>
                    <div className="flex space-x-2">
                        <button
                            onClick={() => setViewMode(viewMode === 'table' ? 'calendar' : 'table')}
                            className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
                        >
                            {viewMode === 'table' ? 'Lihat Kalender' : 'Lihat Tabel'}
                        </button>
                        <button
                            onClick={handleAddSchedule}
                            className="px-4 py-2 bg-primary text-white rounded-md hover:bg-opacity-90"
                        >
                            Tambah Jadwal
                        </button>
                        <button
                            onClick={() => handleExport('excel')}
                            className="px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600"
                        >
                            Export Excel
                        </button>
                        <button
                            onClick={() => handleExport('pdf')}
                            className="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600"
                        >
                            Export PDF
                        </button>
                    </div>
                </div>

                {renderFilters()}

                {viewMode === 'table' ? (
                    <DynamicTable
                        columns={scheduleColumns}
                        data={schedules}
                        className="shadow-sm"
                        searchable={true}
                        filterable={true}
                        searchFields={['studentId', 'studentName', 'courseName', 'lecturer', 'room']}
                        renderActions={(schedule: StudentSchedule) => (
                            <div className="flex space-x-2">
                                <button
                                    onClick={() => setSelectedStudent(schedule.studentId)}
                                    className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
                                >
                                    Lihat Detail
                                </button>
                                <button
                                    onClick={() => {/* Implement edit */ }}
                                    className="px-4 py-2 bg-amber-500 text-white rounded-md hover:bg-amber-600"
                                >
                                    Edit
                                </button>
                                <button
                                    onClick={() => {/* Implement delete */ }}
                                    className="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600"
                                >
                                    Hapus
                                </button>
                            </div>
                        )}
                    />
                ) : (
                    <div className="bg-white p-4 rounded-lg shadow">
                        {/* Implement calendar view here */}
                        <p className="text-center text-gray-500">Calendar view coming soon...</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default StudentSchedules;