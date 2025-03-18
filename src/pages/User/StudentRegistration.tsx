import { useState } from 'react';
import DynamicTable from '../../components/Tables/DynamicTable';
import { Column } from '../../types/table';
import Swal from 'sweetalert2';

interface Student {
    id: number;
    nim: string;
    fullName: string;
    academicYear: string;
    profilePictureUrl: string;
    studyProgram: string;
    status?: 'pending' | 'approved' | 'declined';
}

const StudentRegistration = () => {
    const [students, setStudents] = useState<Student[]>([
        {
            id: 1,
            nim: '20220001',
            fullName: 'John Doe',
            academicYear: '2022/2023',
            profilePictureUrl: 'jhashda12812930',
            studyProgram: 'Teknik Informatika',
            status: 'pending'
        },
        {
            id: 2,
            nim: '20220002',
            fullName: 'Jane Smith',
            academicYear: '2022/2023',
            studyProgram: 'Sistem Informasi',
            profilePictureUrl: 'aksjkasjd18273kjasd',
            status: 'pending'
        },
        {
            id: 3,
            nim: '20220003',
            fullName: 'Mike Johnson',
            academicYear: '2022/2023',
            studyProgram: 'Teknik Informatika',
            profilePictureUrl: 'asdalsd1283asdlk',
            status: 'pending'
        },
    ]);

    const handleApprove = async (student: Student) => {
        const result = await Swal.fire({
            title: 'Konfirmasi Persetujuan',
            text: "Apakah anda yakin ingin menyetujui pendaftaran mahasiswa ini?",
            icon: 'question',
            showCancelButton: true,
            confirmButtonColor: '#4CAF50',
            cancelButtonColor: '#3085d6',
            confirmButtonText: 'Setuju',
            cancelButtonText: 'Batal'
        });

        if (result.isConfirmed) {
            setStudents((prevStudents) =>
                prevStudents.map((s) =>
                    s.id === student.id ? { ...s, status: 'approved' } : s
                )
            );
            await Swal.fire({
                title: 'Disetujui!',
                text: 'Pendaftaran mahasiswa telah disetujui.',
                icon: 'success',
                confirmButtonColor: '#4CAF50'
            });
        }
    };

    const handleDecline = async (student: Student) => {
        const result = await Swal.fire({
            title: 'Konfirmasi Penolakan',
            text: "Apakah anda yakin ingin menolak pendaftaran mahasiswa ini?",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#d33',
            cancelButtonColor: '#3085d6',
            confirmButtonText: 'Tolak',
            cancelButtonText: 'Batal'
        });

        if (result.isConfirmed) {
            setStudents((prevStudents) =>
                prevStudents.map((s) =>
                    s.id === student.id ? { ...s, status: 'declined' } : s
                )
            );
            await Swal.fire({
                title: 'Ditolak!',
                text: 'Pendaftaran mahasiswa telah ditolak.',
                icon: 'error',
                confirmButtonColor: '#4CAF50'
            });
        }
    };

    const studentColumns: Column[] = [
        {
            header: 'NIM',
            accessor: 'nim',
            minWidth: '120px',
        },
        {
            header: 'Nama Lengkap',
            accessor: 'fullName',
            minWidth: '200px',
        },
        {
            header: 'Tahun Ajaran',
            accessor: 'academicYear',
            minWidth: '120px',
        },
        {
            header: 'Profile Picture Url',
            accessor: 'profilePictureUrl',
            minWidth: '150px',
        },
        {
            header: 'Program Studi',
            accessor: 'studyProgram',
            minWidth: '150px',
        }
    ];

    return (
        <div className="space-y-8 p-4">
            <div>
                <h2 className="mb-4 text-xl font-semibold">Registrasi Mahasiswa</h2>
                <DynamicTable
                    columns={studentColumns}
                    data={students}
                    className="shadow-sm"
                    renderActions={(student: Student) => (
                        <div className="flex space-x-2">
                            {student.status === 'pending' ? (
                                <>
                                    <button
                                        onClick={() => handleApprove(student)}
                                        className="px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600"
                                    >
                                        Setuju
                                    </button>
                                    <button
                                        onClick={() => handleDecline(student)}
                                        className="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600"
                                    >
                                        Tolak
                                    </button>
                                </>
                            ) : (
                                <span className={`px-3 py-1 rounded-full text-sm ${student.status === 'approved'
                                    ? 'bg-green-100 text-green-800'
                                    : 'bg-red-100 text-red-800'
                                    }`}>
                                    {student.status === 'approved' ? 'Disetujui' : 'Ditolak'}
                                </span>
                            )}
                        </div>
                    )}
                />
            </div>
        </div>
    );
};

export default StudentRegistration;