import { useState } from 'react';
import DynamicTable from '../../components/Tables/DynamicTable';
import { Column } from '../../types/table';
import Swal from 'sweetalert2';

interface Schedule {
    id: number;
    courseId: string;
    courseName: string;
    lecturer: string;
    room: string;
    day: string;
    startTime: string;
    endTime: string;
    material: string;
    academicYear: string;
    semester: string;
    department: string;
    createdAt: string;
}

interface FilterState {
    academicYear: string;
    semester: string;
    department: string;
    lecturer: string;
    room: string;
}

const Schedules = () => {
    const [schedules, setSchedules] = useState<Schedule[]>([
        {
            id: 1,
            courseId: 'CS101',
            courseName: 'Algoritma dan Pemrograman',
            lecturer: 'Dr. John Doe',
            room: 'Lab Komputer 1',
            day: 'Senin',
            startTime: '08:00',
            endTime: '10:30',
            material: 'Pengenalan Algoritma',
            academicYear: '2024/2025',
            semester: 'Ganjil',
            department: 'Teknik Informatika',
            createdAt: '2024-01-01'
        },
    ]);

    const [filters, setFilters] = useState<FilterState>({
        academicYear: '',
        semester: '',
        department: '',
        lecturer: '',
        room: ''
    });

    const [viewMode, setViewMode] = useState<'table' | 'calendar'>('table');

    const checkScheduleConflict = (newSchedule: Partial<Schedule>, editId?: number): boolean => {
        return schedules.some(schedule => {
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

    const handleAddSchedule = async () => {
        const { value: formValues } = await Swal.fire({
            title: 'Tambah Jadwal Kuliah',
            html: `
                <div class="space-y-4">
                    <div>
                        <label class="block text-sm font-medium text-gray-700 mb-1">Mata Kuliah</label>
                        <input id="courseName" class="swal2-input" placeholder="Nama Mata Kuliah">
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
                    <div>
                        <label class="block text-sm font-medium text-gray-700 mb-1">Materi/Bab</label>
                        <input id="material" class="swal2-input" placeholder="Materi Pembelajaran">
                    </div>
                </div>
            `,
            focusConfirm: false,
            showCancelButton: true,
            confirmButtonText: 'Tambah',
            cancelButtonText: 'Batal',
            preConfirm: () => {
                const values = {
                    courseName: (document.getElementById('courseName') as HTMLInputElement).value,
                    lecturer: (document.getElementById('lecturer') as HTMLInputElement).value,
                    room: (document.getElementById('room') as HTMLInputElement).value,
                    day: (document.getElementById('day') as HTMLSelectElement).value,
                    startTime: (document.getElementById('startTime') as HTMLInputElement).value,
                    endTime: (document.getElementById('endTime') as HTMLInputElement).value,
                    material: (document.getElementById('material') as HTMLInputElement).value,
                };

                if (!values.courseName || !values.lecturer || !values.room || !values.startTime || !values.endTime) {
                    Swal.showValidationMessage('Semua field harus diisi');
                    return false;
                }

                if (checkScheduleConflict(values)) {
                    Swal.showValidationMessage('Terdapat bentrok jadwal pada waktu yang dipilih');
                    return false;
                }

                return values;
            }
        });

        if (formValues) {
            const newSchedule: Schedule = {
                id: schedules.length + 1,
                courseId: `CS${schedules.length + 101}`,
                ...formValues,
                academicYear: '2024/2025',
                semester: 'Ganjil',
                department: 'Teknik Informatika',
                createdAt: new Date().toISOString()
            };

            setSchedules(prev => [...prev, newSchedule]);
            await Swal.fire('Berhasil!', 'Jadwal baru telah ditambahkan.', 'success');
        }
    };

    const handleExport = async (type: 'excel' | 'pdf') => {
        await Swal.fire({
            title: 'Ekspor Data',
            text: `Data akan diekspor ke ${type.toUpperCase()}`,
            icon: 'info',
            showCancelButton: true,
            confirmButtonText: 'Ekspor',
            cancelButtonText: 'Batal'
        });
        // Implement export logic here
    };

    const scheduleColumns: Column[] = [
        {
            header: 'Mata Kuliah',
            accessor: 'courseName',
            minWidth: '200px',
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
        {
            header: 'Hari',
            accessor: 'day',
            minWidth: '100px',
        },
        {
            header: 'Waktu',
            accessor: 'time',
            minWidth: '150px',
            cell: (item: Schedule) => (
                <span>{`${item.startTime} - ${item.endTime}`}</span>
            ),
        },
        {
            header: 'Materi/Bab',
            accessor: 'material',
            minWidth: '200px',
        },
    ];

    const renderFilters = () => (
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-4">
            <select
                className="border rounded-md p-2"
                value={filters.academicYear}
                onChange={(e) => setFilters({ ...filters, academicYear: e.target.value })}
            >
                <option value="">Tahun Akademik</option>
                <option value="2024/2025">2024/2025</option>
                <option value="2023/2024">2023/2024</option>
            </select>
            <select
                className="border rounded-md p-2"
                value={filters.semester}
                onChange={(e) => setFilters({ ...filters, semester: e.target.value })}
            >
                <option value="">Semester</option>
                <option value="Ganjil">Ganjil</option>
                <option value="Genap">Genap</option>
            </select>
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
                value={filters.lecturer}
                onChange={(e) => setFilters({ ...filters, lecturer: e.target.value })}
            >
                <option value="">Dosen</option>
                <option value="Dr. John Doe">Dr. John Doe</option>
                <option value="Dr. Jane Smith">Dr. Jane Smith</option>
            </select>
            <select
                className="border rounded-md p-2"
                value={filters.room}
                onChange={(e) => setFilters({ ...filters, room: e.target.value })}
            >
                <option value="">Ruangan</option>
                <option value="Lab Komputer 1">Lab Komputer 1</option>
                <option value="Lab Komputer 2">Lab Komputer 2</option>
            </select>
        </div>
    );

    return (
        <div className="space-y-8 p-4">
            <div>
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-xl font-semibold">Jadwal Kuliah</h2>
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
                        searchFields={['courseName', 'lecturer', 'room', 'material']}
                        renderActions={(_schedule: Schedule) => (
                            <div className="flex space-x-2">
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

export default Schedules;