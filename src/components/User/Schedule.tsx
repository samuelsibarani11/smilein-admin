import React, { useState, useEffect } from 'react';
import { ScheduleRead } from '../../types/schedule';
import { getSchedules } from '../../api/scheduleApi';
import { StudentRead } from '../../types/student';

interface ScheduleProps {
    studentData: StudentRead | null;
}

const ScheduleComponent: React.FC<ScheduleProps> = ({ studentData }) => {
    const studentId = studentData?.student_id;

    const [schedules, setSchedules] = useState<ScheduleRead[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    const daysOfWeek = [
        'Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'
    ];

    useEffect(() => {
        const fetchData = async () => {
            try {
                if (studentId) {
                    setLoading(true);
                    const data = await getSchedules(0, 100, { instructor_id: studentId });
                    setSchedules(data);
                    setError(null);
                }
            } catch (err) {
                setError('Failed to fetch schedules');
                console.error(err);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [studentId]);

    return (
        <div className="mt-6 p-4 md:p-6 border dark:border-gray-700 rounded-lg dark:bg-gray-800">
            <h2 className="text-lg font-semibold dark:text-white mb-6">Schedule Information</h2>

            {error && (
                <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
                    {error}
                </div>
            )}

            {loading ? (
                <div className="flex justify-center py-8">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                </div>
            ) : (
                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                        <thead className="bg-gray-50 dark:bg-gray-700">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">ID</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Course</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Room</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Day</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Time</th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200 dark:bg-gray-800 dark:divide-gray-700">
                            {schedules.length === 0 ? (
                                <tr>
                                    <td colSpan={5} className="px-6 py-4 text-center text-gray-500 dark:text-gray-400">
                                        No schedules found for this student
                                    </td>
                                </tr>
                            ) : (
                                schedules.map((schedule) => (
                                    <tr key={schedule.schedule_id}>
                                        <td className="px-6 py-4 whitespace-nowrap text-gray-900 dark:text-gray-200">{schedule.schedule_id}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-gray-900 dark:text-gray-200">{schedule.course.course_name}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-gray-500 dark:text-gray-400">{schedule.room}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-gray-500 dark:text-gray-400">
                                            {daysOfWeek[schedule.day_of_week]}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-gray-500 dark:text-gray-400">
                                            {schedule.start_time} - {schedule.end_time}
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
};

export default ScheduleComponent;