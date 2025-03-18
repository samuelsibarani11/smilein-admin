import { useState } from 'react';
import DynamicTable from '../../components/Tables/DynamicTable';
import { Column } from '../../types/table';
import Swal from 'sweetalert2';

interface Room {
    id: number;
    name: string;
    building: string;
    capacity: number;
    status: 'available' | 'in-use' | 'inactive';
    schedule: RoomSchedule[];
    createdAt: string;
}

interface RoomSchedule {
    id: number;
    day: string;
    startTime: string;
    endTime: string;
    purpose: string;
    user: string;
}

interface FilterState {
    building: string;
    status: string;
    minCapacity: string;
}

const Rooms = () => {
    const [rooms, setRooms] = useState<Room[]>([
        {
            id: 1,
            name: 'Lab Komputer 1',
            building: 'Gedung A',
            capacity: 40,
            status: 'available',
            schedule: [
                {
                    id: 1,
                    day: 'Senin',
                    startTime: '08:00',
                    endTime: '10:30',
                    purpose: 'Kuliah Algoritma',
                    user: 'Dr. John Doe'
                }
            ],
            createdAt: '2024-01-01'
        }
    ]);

    const [filters, setFilters] = useState<FilterState>({
        building: '',
        status: '',
        minCapacity: ''
    });

    const [viewMode, setViewMode] = useState<'table' | 'calendar'>('table');
    const [selectedRoom, setSelectedRoom] = useState<string>('');

    const handleAddRoom = async () => {
        const { value: formValues } = await Swal.fire({
            title: 'Tambah Ruangan Baru',
            html: `
                <div class="space-y-4">
                    <div>
                        <label class="block text-sm font-medium text-gray-700 mb-1">Nama Ruangan</label>
                        <input id="roomName" class="swal2-input" placeholder="Nama Ruangan">
                    </div>
                    <div>
                        <label class="block text-sm font-medium text-gray-700 mb-1">Gedung</label>
                        <select id="building" class="swal2-select">
                            <option value="Gedung A">Gedung A</option>
                            <option value="Gedung B">Gedung B</option>
                            <option value="Gedung C">Gedung C</option>
                        </select>
                    </div>
                    <div>
                        <label class="block text-sm font-medium text-gray-700 mb-1">Kapasitas</label>
                        <input id="capacity" type="number" class="swal2-input" placeholder="Jumlah Kapasitas">
                    </div>
                </div>
            `,
            focusConfirm: false,
            showCancelButton: true,
            confirmButtonText: 'Tambah',
            cancelButtonText: 'Batal',
            preConfirm: () => {
                const values = {
                    name: (document.getElementById('roomName') as HTMLInputElement).value,
                    building: (document.getElementById('building') as HTMLSelectElement).value,
                    capacity: parseInt((document.getElementById('capacity') as HTMLInputElement).value),
                };

                if (!Object.values(values).every(Boolean)) {
                    Swal.showValidationMessage('Semua field harus diisi');
                    return false;
                }

                return values;
            }
        });

        if (formValues) {
            const newRoom: Room = {
                id: rooms.length + 1,
                ...formValues,
                status: 'available',
                schedule: [],
                createdAt: new Date().toISOString()
            };

            setRooms(prev => [...prev, newRoom]);
            await Swal.fire('Berhasil!', 'Ruangan baru telah ditambahkan.', 'success');
        }
    };

    const handleEditRoom = async (room: Room) => {
        const { value: formValues } = await Swal.fire({
            title: 'Edit Informasi Ruangan',
            html: `
                <div class="space-y-4">
                    <div>
                        <label class="block text-sm font-medium text-gray-700 mb-1">Nama Ruangan</label>
                        <input id="roomName" class="swal2-input" value="${room.name}" placeholder="Nama Ruangan">
                    </div>
                    <div>
                        <label class="block text-sm font-medium text-gray-700 mb-1">Gedung</label>
                        <select id="building" class="swal2-select">
                            <option value="Gedung A" ${room.building === 'Gedung A' ? 'selected' : ''}>Gedung A</option>
                            <option value="Gedung B" ${room.building === 'Gedung B' ? 'selected' : ''}>Gedung B</option>
                            <option value="Gedung C" ${room.building === 'Gedung C' ? 'selected' : ''}>Gedung C</option>
                        </select>
                    </div>
                    <div>
                        <label class="block text-sm font-medium text-gray-700 mb-1">Kapasitas</label>
                        <input id="capacity" type="number" class="swal2-input" value="${room.capacity}" placeholder="Jumlah Kapasitas">
                    </div>
                    <div>
                        <label class="block text-sm font-medium text-gray-700 mb-1">Status</label>
                        <select id="status" class="swal2-select">
                            <option value="available" ${room.status === 'available' ? 'selected' : ''}>Tersedia</option>
                            <option value="in-use" ${room.status === 'in-use' ? 'selected' : ''}>Digunakan</option>
                            <option value="inactive" ${room.status === 'inactive' ? 'selected' : ''}>Nonaktif</option>
                        </select>
                    </div>
                </div>
            `,
            focusConfirm: false,
            showCancelButton: true,
            confirmButtonText: 'Simpan',
            cancelButtonText: 'Batal',
            preConfirm: () => {
                const values = {
                    name: (document.getElementById('roomName') as HTMLInputElement).value,
                    building: (document.getElementById('building') as HTMLSelectElement).value,
                    capacity: parseInt((document.getElementById('capacity') as HTMLInputElement).value),
                    status: (document.getElementById('status') as HTMLSelectElement).value as Room['status'],
                };

                if (!Object.values(values).every(Boolean)) {
                    Swal.showValidationMessage('Semua field harus diisi');
                    return false;
                }

                return values;
            }
        });

        if (formValues) {
            setRooms(prev => prev.map(r =>
                r.id === room.id ? { ...r, ...formValues } : r
            ));
            await Swal.fire('Berhasil!', 'Informasi ruangan telah diperbarui.', 'success');
        }
    };

    const handleExportReport = async (type: 'excel' | 'pdf') => {
        await Swal.fire({
            title: 'Laporan Penggunaan Ruangan',
            text: `Laporan akan diekspor ke ${type.toUpperCase()}`,
            icon: 'info',
            showCancelButton: true,
            confirmButtonText: 'Ekspor',
            cancelButtonText: 'Batal'
        });
        // Implement export logic here
    };

    const getStatusBadge = (status: Room['status']) => {
        const styles = {
            'available': 'bg-green-100 text-green-800',
            'in-use': 'bg-blue-100 text-blue-800',
            'inactive': 'bg-gray-100 text-gray-800'
        };

        const labels = {
            'available': 'Tersedia',
            'in-use': 'Digunakan',
            'inactive': 'Nonaktif'
        };

        return (
            <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${styles[status]}`}>
                {labels[status]}
            </span>
        );
    };

    const roomColumns: Column[] = [
        {
            header: 'Nama Ruangan',
            accessor: 'name',
            minWidth: '200px',
        },
        {
            header: 'Gedung',
            accessor: 'building',
            minWidth: '150px',
        },
        {
            header: 'Kapasitas',
            accessor: 'capacity',
            minWidth: '120px',
            cell: (item: Room) => (
                <span>{item.capacity} orang</span>
            ),
        },
        {
            header: 'Status',
            accessor: 'status',
            minWidth: '120px',
            cell: (item: Room) => getStatusBadge(item.status),
        },
        {
            header: 'Jadwal Penggunaan',
            accessor: 'schedule',
            minWidth: '250px',
            cell: (item: Room) => (
                <div className="text-sm">
                    {item.schedule.length > 0 ? (
                        item.schedule.map((s, idx) => (
                            <div key={idx} className="mb-1">
                                {`${s.day}, ${s.startTime}-${s.endTime}`}
                            </div>
                        ))
                    ) : (
                        <span className="text-gray-500">Tidak ada jadwal</span>
                    )}
                </div>
            ),
        },
    ];

    const renderFilters = () => (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
            <select
                className="border rounded-md p-2"
                value={filters.building}
                onChange={(e) => setFilters({ ...filters, building: e.target.value })}
            >
                <option value="">Semua Gedung</option>
                <option value="Gedung A">Gedung A</option>
                <option value="Gedung B">Gedung B</option>
                <option value="Gedung C">Gedung C</option>
            </select>
            <select
                className="border rounded-md p-2"
                value={filters.status}
                onChange={(e) => setFilters({ ...filters, status: e.target.value })}
            >
                <option value="">Semua Status</option>
                <option value="available">Tersedia</option>
                <option value="in-use">Digunakan</option>
                <option value="inactive">Nonaktif</option>
            </select>
            <input
                type="number"
                className="border rounded-md p-2"
                placeholder="Kapasitas Minimum"
                value={filters.minCapacity}
                onChange={(e) => setFilters({ ...filters, minCapacity: e.target.value })}
            />
        </div>
    );

    return (
        <div className="space-y-8 p-4">
            <div>
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-xl font-semibold">Manajemen Ruangan</h2>
                    <div className="flex space-x-2">
                        <button
                            onClick={() => setViewMode(viewMode === 'table' ? 'calendar' : 'table')}
                            className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
                        >
                            {viewMode === 'table' ? 'Lihat Kalender' : 'Lihat Tabel'}
                        </button>
                        <button
                            onClick={handleAddRoom}
                            className="px-4 py-2 bg-primary text-white rounded-md hover:bg-opacity-90"
                        >
                            Tambah Ruangan
                        </button>
                        <button
                            onClick={() => handleExportReport('excel')}
                            className="px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600"
                        >
                            Laporan Excel
                        </button>
                        <button
                            onClick={() => handleExportReport('pdf')}
                            className="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600"
                        >
                            Laporan PDF
                        </button>
                    </div>
                </div>

                {renderFilters()}

                {viewMode === 'table' ? (
                    <DynamicTable
                        columns={roomColumns}
                        data={rooms}
                        className="shadow-sm"
                        searchable={true}
                        filterable={true}
                        searchFields={['name', 'building']}
                        renderActions={(room: Room) => (
                            <div className="flex space-x-2">
                                <button
                                    onClick={() => setSelectedRoom(room.name)}
                                    className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
                                >
                                    Detail
                                </button>
                                <button
                                    onClick={() => handleEditRoom(room)}
                                    className="px-4 py-2 bg-amber-500 text-white rounded-md hover:bg-amber-600"
                                >
                                    Edit
                                </button>
                                <button
                                    onClick={() => {
                                        // Toggle room status to inactive
                                        setRooms(prev => prev.map(r =>
                                            r.id === room.id ? { ...r, status: 'inactive' } : r
                                        ));
                                    }}
                                    className="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600"
                                >
                                    Nonaktifkan
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

export default Rooms;