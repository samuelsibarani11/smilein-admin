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

export const showAttendanceDetails = async (attendance: Attendance) => {
    await Swal.fire({
        customClass: {
            popup: 'rounded-xl shadow-2xl dark:bg-gray-800 dark:text-gray-200 bg-white text-gray-900',
            title: 'dark:text-white text-gray-900'
        },
        title: 'Detail Kehadiran',
        html: `
            <div class="space-y-6 text-left dark:text-gray-300 text-gray-800">
                <div>
                    <h3 class="text-lg font-semibold mb-2 dark:text-white text-gray-900">Informasi Mahasiswa</h3>
                    <div class="grid grid-cols-2 gap-4">
                        <div>
                            <p class="text-sm text-gray-500 dark:text-gray-400">NIM</p>
                            <p class="font-medium dark:text-gray-100">${attendance.studentId}</p>
                        </div>
                        <div>
                            <p class="text-sm text-gray-500 dark:text-gray-400">Nama</p>
                            <p class="font-medium dark:text-gray-100">${attendance.studentName}</p>
                        </div>
                    </div>
                </div>

                <div>
                    <h3 class="text-lg font-semibold mb-2 dark:text-white text-gray-900">Informasi Kehadiran</h3>
                    <div class="grid grid-cols-2 gap-4 bg-gray-50 dark:bg-gray-700/30 p-4 rounded-lg">
                        <div>
                            <p class="text-sm text-gray-500 dark:text-gray-400">Check-in</p>
                            <p class="font-medium ${!attendance.checkIn ? 'text-red-600 dark:text-red-400' : 'dark:text-gray-100'}">
                                ${attendance.checkIn || 'Tidak Check-in'}
                            </p>
                        </div>
                        <div>
                            <p class="text-sm text-gray-500 dark:text-gray-400">Check-out</p>
                            <p class="font-medium ${!attendance.checkOut ? 'text-red-600 dark:text-red-400' : 'dark:text-gray-100'}">
                                ${attendance.checkOut || 'Tidak Check-out'}
                            </p>
                        </div>
                        <div>
                            <p class="text-sm text-gray-500 dark:text-gray-400">Status</p>
                            <p class="font-medium">
                                <span class="px-2 py-1 rounded-full text-sm ${attendance.status === 'Hadir'
                ? 'bg-green-100 text-green-800 dark:bg-green-900/50 dark:text-green-300' :
                attendance.status === 'Terlambat'
                    ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/50 dark:text-yellow-300' :
                    'bg-red-100 text-red-800 dark:bg-red-900/50 dark:text-red-300'
            }">
                                    ${attendance.status}
                                </span>
                            </p>
                        </div>
                        <div>
                            <p class="text-sm text-gray-500 dark:text-gray-400">Tanggal</p>
                            <p class="font-medium dark:text-gray-100">
                                ${new Date(attendance.date).toLocaleDateString('id-ID')}
                            </p>
                        </div>
                    </div>
                </div>

                <div>
                    <h3 class="text-lg font-semibold mb-2 dark:text-white text-gray-900">Verifikasi Wajah</h3>
                    <div class="bg-gray-50 dark:bg-gray-700/30 p-4 rounded-lg">
                        <div class="grid grid-cols-2 gap-4">
                            <div>
                                <p class="text-sm text-gray-500 dark:text-gray-400">Status</p>
                                <p class="font-medium ${attendance.faceVerification.status
                ? 'text-green-600 dark:text-green-400'
                : 'text-red-600 dark:text-red-400'}">
                                    ${attendance.faceVerification.status ? 'Terverifikasi' : 'Tidak Terverifikasi'}
                                </p>
                            </div>
                            <div>
                                <p class="text-sm text-gray-500 dark:text-gray-400">Confidence</p>
                                <p class="font-medium dark:text-gray-100">${(attendance.faceVerification.confidence * 100).toFixed(2)}%</p>
                            </div>
                        </div>
                    </div>
                </div>

                <div>
                    <h3 class="text-lg font-semibold mb-2 dark:text-white text-gray-900">Riwayat Lokasi</h3>
                    <div class="max-h-60 overflow-y-auto">
                        <table class="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                            <thead class="bg-gray-50 dark:bg-gray-700/30">
                                <tr>
                                    <th class="px-4 py-2 text-left text-xs font-medium text-gray-500 dark:text-gray-400">Waktu</th>
                                    <th class="px-4 py-2 text-left text-xs font-medium text-gray-500 dark:text-gray-400">Koordinat</th>
                                    <th class="px-4 py-2 text-left text-xs font-medium text-gray-500 dark:text-gray-400">Akurasi</th>
                                </tr>
                            </thead>
                            <tbody class="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                                ${attendance.locationData.map(location => `
                                    <tr>
                                        <td class="px-4 py-2 text-sm dark:text-gray-300">
                                            ${new Date(location.timestamp).toLocaleString()}
                                        </td>
                                        <td class="px-4 py-2 text-sm dark:text-gray-300">
                                            ${location.latitude}, ${location.longitude}
                                        </td>
                                        <td class="px-4 py-2 text-sm dark:text-gray-300">
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
                        <h3 class="text-lg font-semibold mb-2 dark:text-white text-gray-900">Alasan Keterlambatan</h3>
                        <p class="text-sm bg-yellow-50 dark:bg-yellow-900/20 p-4 rounded-lg dark:text-yellow-100">
                            ${attendance.lateReason}
                        </p>
                    </div>
                ` : ''}
            </div>
        `,
        width: '800px',
        showCloseButton: true,
        showConfirmButton: false
    });
};

export default showAttendanceDetails;