import React, { useState, useEffect } from 'react';
import DynamicTable from '../../components/Tables/DynamicTable';
import { Column } from '../../types/table';
import * as scheduleApi from '../../api/scheduleApi';
import { ScheduleRead, ScheduleCreate, ScheduleUpdate } from '../../types/schedule';
import Swal from 'sweetalert2';
import CreateScheduleModal from '../../components/Schedule/CreateScheduleModal';
import UpdateScheduleModal from '../../components/Schedule/UpdateScheduleModal';

const Schedules: React.FC = () => {
    const [schedules, setSchedules] = useState<ScheduleRead[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    const [createModalOpen, setCreateModalOpen] = useState<boolean>(false);
    const [updateModalOpen, setUpdateModalOpen] = useState<boolean>(false);
    const [currentSchedule, setCurrentSchedule] = useState<ScheduleRead | null>(null);

    useEffect(() => {
        fetchSchedules();
    }, []);

    const fetchSchedules = async (): Promise<void> => {
        try {
            setLoading(true);
            const data = await scheduleApi.getSchedules();
            setSchedules(data);
            setError(null);
        } catch (err) {
            console.error('Failed to fetch schedules:', err);
            setError('Failed to load schedules. Please try again later.');
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

    const handleCreateSchedule = async (scheduleData: ScheduleCreate): Promise<void> => {
        try {
            const newSchedule = await scheduleApi.createSchedule(scheduleData);
            setSchedules([...schedules, newSchedule]);
            setCreateModalOpen(false);
            showAlert('Berhasil!', 'Jadwal baru telah ditambahkan', 'success');
        } catch (err) {
            console.error('Failed to create schedule:', err);
            throw err; // Rethrow to be caught by modal component
        }
    };

    const handleUpdateSchedule = async (scheduleId: number, scheduleData: ScheduleUpdate): Promise<void> => {
        try {
            const updatedSchedule = await scheduleApi.updateSchedule(scheduleId, scheduleData);
            setSchedules(schedules.map(s =>
                s.schedule_id === scheduleId ? updatedSchedule : s
            ));
            setUpdateModalOpen(false);
            showAlert('Berhasil!', 'Jadwal telah diperbarui', 'success');
        } catch (err) {
            console.error('Failed to update schedule:', err);
            throw err; // Rethrow to be caught by modal component
        }
    };

    const handleUpdateClick = (schedule: ScheduleRead): void => {
        setCurrentSchedule(schedule);
        setUpdateModalOpen(true);
    };

    const handleDeleteClick = (schedule: ScheduleRead): void => {
        setCurrentSchedule(schedule);
        Swal.fire({
            title: 'Konfirmasi Penghapusan',
            text: `Apakah anda yakin ingin menghapus jadwal "${schedule.course?.course_name || ''}" di ruangan ${schedule.room?.name || ''}?`,
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#EF4444',
            cancelButtonColor: '#9CA3AF',
            confirmButtonText: 'Hapus',
            cancelButtonText: 'Batal'
        }).then((result) => {
            if (result.isConfirmed) {
                handleDeleteConfirm(schedule.schedule_id);
            }
        });
    };

    const handleDeleteConfirm = async (scheduleId: number): Promise<void> => {
        try {
            setLoading(true);
            await scheduleApi.deleteSchedule(scheduleId);
            setSchedules(schedules.filter(s => s.schedule_id !== scheduleId));
            showAlert('Terhapus!', 'Jadwal telah dihapus.', 'success');
        } catch (error: unknown) {
            console.error('Failed to delete schedule:', error);
            let errorMessage = 'Gagal menghapus jadwal.';
            if (error instanceof Error) {
                errorMessage = `Gagal menghapus jadwal sedang digunakan`;
            }
            showAlert('Error!', errorMessage, 'error');
        } finally {
            setLoading(false);
        }
    };

    // Function to format date for display
    const formatDate = (dateString: string): string => {
        if (!dateString) return 'N/A';
        return new Date(dateString).toLocaleDateString('id-ID', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    };


    const scheduleColumns: Column[] = [
        {
            header: 'ID Jadwal',
            accessor: 'schedule_id',
            minWidth: '100px',
        },
        {
            header: 'Mata Kuliah',
            accessor: 'course.course_name',
            minWidth: '200px',
            cell: (item: ScheduleRead) => item.course?.course_name || 'N/A'
        },
        {
            header: 'Dosen',
            accessor: 'instructor.full_name',
            minWidth: '200px',
            cell: (item: ScheduleRead) => item.instructor?.full_name || 'N/A'
        },
        {
            header: 'Bab/Materi',
            accessor: 'chapter',
            minWidth: '150px',
            cell: (item: ScheduleRead) => item.chapter || '-'
        },
        {
            header: 'Waktu',
            accessor: 'time',
            minWidth: '150px',
            cell: (item: ScheduleRead) => `${item.start_time} - ${item.end_time}`
        },
        {
            header: 'Tanggal',
            accessor: 'schedule_date',
            minWidth: '150px',
            cell: (item: ScheduleRead) => formatDate(item.schedule_date)
        },
        {
            header: 'Ruangan',
            accessor: 'room.name',
            minWidth: '120px',
            cell: (item: ScheduleRead) => item.room?.name || 'N/A'
        },
        {
            header: 'Tanggal Dibuat',
            accessor: 'created_at',
            minWidth: '150px',
            cell: (item: ScheduleRead) => (
                <span>
                    {new Date(item.created_at ?? '').toLocaleDateString('id-ID', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric'
                    })}
                </span>
            ),
        }
    ];

    if (loading) {
        return (
            <div className="flex justify-center items-center h-64">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
            </div>
        );
    }

    if (error) {
        return <div className="p-4 bg-red-100 text-red-700 rounded-md">{error}</div>;
    }

    return (
        <div className="space-y-8 p-4">
            <div className="flex justify-between items-center">
                <h2 className="text-xl font-semibold">Daftar Jadwal</h2>
                <button
                    onClick={() => setCreateModalOpen(true)}
                    className="px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600"
                >
                    Tambah Jadwal
                </button>
            </div>

            <DynamicTable
                columns={scheduleColumns}
                data={schedules}
                className="shadow-sm"
                searchable
                filterable
                searchFields={['course.course_name', 'instructor.full_name', 'room.name', 'chapter']}
                renderActions={(schedule: ScheduleRead) => (
                    <div className="flex space-x-2">
                        <button
                            onClick={() => handleUpdateClick(schedule)}
                            className="px-6 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 text-sm font-medium"
                        >
                            Edit
                        </button>
                        <button
                            onClick={() => handleDeleteClick(schedule)}
                            className="px-6 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 text-sm font-medium"
                        >
                            Hapus
                        </button>
                    </div>
                )}
            />

            <CreateScheduleModal
                isOpen={createModalOpen}
                onClose={() => setCreateModalOpen(false)}
                onCreateSchedule={handleCreateSchedule}
            />

            <UpdateScheduleModal
                isOpen={updateModalOpen}
                onClose={() => setUpdateModalOpen(false)}
                currentSchedule={currentSchedule}
                onUpdateSchedule={handleUpdateSchedule}
            />
        </div>
    );
};

export default Schedules;