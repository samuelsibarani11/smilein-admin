import { useState } from 'react';
import DynamicTable from '../../components/Tables/DynamicTable';
import { Column } from '../../types/table';
import Swal from 'sweetalert2';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';
import ReactDOM from 'react-dom';

interface CourseStatistics {
    attendanceRate: number;
    passingRate: number;
    averageGrade: number;
    monthlyAttendance: Array<{
        month: string;
        attendance: number;
    }>;
}

interface Course {
    id: string;
    name: string;
    studyProgram: string;
    academicYear: string;
    credits: number;
    createdAt: string;
    schedule?: Array<{
        day: string;
        time: string;
        room: string;
    }>;
    lecturers?: string[];
    enrolledStudents?: number;
    statistics?: CourseStatistics;
}

function hasStatistics(course: Course): course is Course & { statistics: CourseStatistics } {
    return course.statistics !== undefined;
}

const ClassAcademic = () => {
    const [courses, setCourses] = useState<Course[]>([
        {
            id: 'CS101',
            name: 'Introduction to Programming',
            studyProgram: 'Teknik Informatika',
            academicYear: '2023/2024',
            credits: 3,
            createdAt: '2024-01-01',
            schedule: [
                { day: 'Monday', time: '08:00-10:30', room: 'Lab 301' },
                { day: 'Wednesday', time: '13:00-14:40', room: 'Lab 302' }
            ],
            lecturers: ['Dr. John Doe', 'Prof. Jane Smith'],
            enrolledStudents: 45,
            statistics: {
                attendanceRate: 92.5,
                passingRate: 88.2,
                averageGrade: 3.45,
                monthlyAttendance: [
                    { month: 'Sep', attendance: 95 },
                    { month: 'Oct', attendance: 92 },
                    { month: 'Nov', attendance: 90 },
                    { month: 'Dec', attendance: 93 }
                ]
            }
        },
        {
            id: 'CS102',
            name: 'Data Structures',
            studyProgram: 'Sistem Informasi',
            academicYear: '2023/2024',
            credits: 4,
            createdAt: '2024-01-02',
            schedule: [
                { day: 'Tuesday', time: '10:00-11:40', room: 'Room 401' }
            ],
            lecturers: ['Dr. Mike Johnson'],
            enrolledStudents: 38,
            statistics: {
                attendanceRate: 89.8,
                passingRate: 85.5,
                averageGrade: 3.28,
                monthlyAttendance: [
                    { month: 'Sep', attendance: 91 },
                    { month: 'Oct', attendance: 89 },
                    { month: 'Nov', attendance: 88 },
                    { month: 'Dec', attendance: 91 }
                ]
            }
        }
    ]);

    const renderStatisticsSection = (statistics: CourseStatistics) => {
        return `
            <div>
                <h3 class="text-lg font-semibold mb-2">Statistik Mata Kuliah</h3>
                <div class="grid grid-cols-3 gap-4">
                    <div class="bg-blue-50 p-4 rounded-lg">
                        <div class="text-sm text-blue-600">Tingkat Kehadiran</div>
                        <div class="text-xl font-bold">${statistics.attendanceRate}%</div>
                    </div>
                    <div class="bg-green-50 p-4 rounded-lg">
                        <div class="text-sm text-green-600">Tingkat Kelulusan</div>
                        <div class="text-xl font-bold">${statistics.passingRate}%</div>
                    </div>
                    <div class="bg-purple-50 p-4 rounded-lg">
                        <div class="text-sm text-purple-600">Rata-rata Nilai</div>
                        <div class="text-xl font-bold">${statistics.averageGrade}</div>
                    </div>
                </div>
            </div>
        `;
    };

    const handleDelete = async (course: Course) => {
        const result = await Swal.fire({
            title: 'Konfirmasi Penghapusan',
            text: 'Apakah anda yakin ingin menghapus mata kuliah ini?',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#d33',
            cancelButtonColor: '#3085d6',
            confirmButtonText: 'Hapus',
            cancelButtonText: 'Batal'
        });

        if (result.isConfirmed) {
            setCourses(courses.filter(c => c.id !== course.id));
            await Swal.fire({
                title: 'Terhapus!',
                text: 'Mata kuliah telah dihapus.',
                icon: 'success',
                confirmButtonColor: '#4CAF50'
            });
        }
    };

    const handleShowDetails = async (course: Course) => {
        if (!hasStatistics(course)) {
            await Swal.fire({
                title: 'Informasi',
                text: 'Data statistik tidak tersedia untuk mata kuliah ini',
                icon: 'info'
            });
            return;
        }

        const statisticsSection = renderStatisticsSection(course.statistics);

        await Swal.fire({
            title: `Detail Mata Kuliah - ${course.name}`,
            html: `
                <div class="space-y-6 text-left">
                    ${statisticsSection}
                    <div>
                        <h3 class="text-lg font-semibold mb-2">Jadwal Perkuliahan</h3>
                        <table class="min-w-full divide-y divide-gray-200">
                            <thead class="bg-gray-50">
                                <tr>
                                    <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Hari</th>
                                    <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Waktu</th>
                                    <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Ruangan</th>
                                </tr>
                            </thead>
                            <tbody class="bg-white divide-y divide-gray-200">
                                ${course.schedule?.map(s => `
                                    <tr>
                                        <td class="px-6 py-4 whitespace-nowrap text-sm">${s.day}</td>
                                        <td class="px-6 py-4 whitespace-nowrap text-sm">${s.time}</td>
                                        <td class="px-6 py-4 whitespace-nowrap text-sm">${s.room}</td>
                                    </tr>
                                `).join('') || '<tr><td colspan="3" class="px-6 py-4 text-center">Jadwal tidak tersedia</td></tr>'}
                            </tbody>
                        </table>
                    </div>
                    <div>
                        <h3 class="text-lg font-semibold mb-2">Dosen Pengajar</h3>
                        <ul class="list-disc pl-4 space-y-1">
                            ${course.lecturers?.map(lecturer => `
                                <li class="text-sm">${lecturer}</li>
                            `).join('') || '<li class="text-sm">Belum ada dosen yang ditugaskan</li>'}
                        </ul>
                    </div>
                    <div>
                        <h3 class="text-lg font-semibold mb-2">Tren Kehadiran Mahasiswa</h3>
                        <div class="w-full" style="height: 300px;">
                            <div id="attendanceChart"></div>
                        </div>
                    </div>
                </div>
            `,
            width: '800px',
            showCloseButton: true,
            showConfirmButton: false,
            didRender: () => {
                const chartContainer = document.getElementById('attendanceChart');
                if (chartContainer) {
                    const ChartComponent = () => (
                        <LineChart width={700} height={300} data={course.statistics.monthlyAttendance}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="month" />
                            <YAxis />
                            <Tooltip />
                            <Legend />
                            <Line
                                type="monotone"
                                dataKey="attendance"
                                name="Tingkat Kehadiran (%)"
                                stroke="#8884d8"
                                activeDot={{ r: 8 }}
                            />
                        </LineChart>
                    );
                    ReactDOM.render(<ChartComponent />, chartContainer);
                }
            },
            willClose: () => {
                const chartContainer = document.getElementById('attendanceChart');
                if (chartContainer) {
                    ReactDOM.unmountComponentAtNode(chartContainer);
                }
            }
        });
    };

    const courseColumns: Column[] = [
        {
            header: 'ID Mata Kuliah',
            accessor: 'id',
            minWidth: '120px',
        },
        {
            header: 'Nama Mata Kuliah',
            accessor: 'name',
            minWidth: '200px',
        },
        {
            header: 'Program Studi',
            accessor: 'studyProgram',
            minWidth: '150px',
        },
        {
            header: 'Tahun Akademik',
            accessor: 'academicYear',
            minWidth: '120px',
        },
        {
            header: 'SKS',
            accessor: 'credits',
            minWidth: '80px',
        },
        {
            header: 'Tanggal Dibuat',
            accessor: 'createdAt',
            minWidth: '120px',
            cell: (item: Course) => (
                <span>
                    {new Date(item.createdAt).toLocaleDateString('id-ID', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric'
                    })}
                </span>
            ),
        }
    ];

    return (
        <div className="space-y-8 p-4">
            <div className="flex justify-between items-center">
                <h2 className="text-xl font-semibold">Mata Kuliah</h2>
                <button
                    onClick={() => {/* Handle add new course */ }}
                    className="px-4 py-2 bg-primary text-white rounded-md hover:bg-opacity-90"
                >
                    Tambah Mata Kuliah
                </button>
            </div>

            <DynamicTable
                columns={courseColumns}
                data={courses}
                className="shadow-sm"
                searchable
                filterable
                searchFields={['name']}
                renderActions={(course: Course) => (
                    <div className="flex space-x-2">
                        <button
                            onClick={() => handleShowDetails(course)}
                            className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
                        >
                            Detail
                        </button>
                        <button
                            onClick={() => {/* Handle edit */ }}
                            className="px-4 py-2 bg-amber-500 text-white rounded-md hover:bg-amber-600"
                        >
                            Edit
                        </button>
                        <button
                            onClick={() => handleDelete(course)}
                            className="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600"
                        >
                            Hapus
                        </button>
                    </div>
                )}
            />
        </div>
    );
};

export default ClassAcademic;