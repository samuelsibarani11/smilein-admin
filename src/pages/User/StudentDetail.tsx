import { useState } from 'react';
import { useLocation } from 'react-router-dom';

const StudentDetail = () => {
    const { state } = useLocation();
    const [activeTab, setActiveTab] = useState('About');

    const tabs = [
        'About',
        'Lectures',
        'Notification'
    ];

    const renderTabContent = () => {
        switch (activeTab) {
            case 'About':
                return (
                    <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
                        <div className="border dark:border-gray-700 rounded-lg p-4 md:p-6 dark:bg-gray-800">
                            <h2 className="text-lg font-semibold mb-4 dark:text-white">Personal Information</h2>
                            <div className="space-y-4">
                                <div>
                                    <label className="text-sm text-gray-500 dark:text-gray-400">Username</label>
                                    <p className="mt-1 dark:text-gray-300">{state?.username || 'None'}</p>
                                </div>
                                <div>
                                    <label className="text-sm text-gray-500 dark:text-gray-400">Date of Birth</label>
                                    <p className="mt-1 dark:text-gray-300">{state?.dob || 'None'}</p>
                                </div>
                                <div>
                                    <label className="text-sm text-gray-500 dark:text-gray-400">Gender</label>
                                    <p className="mt-1 dark:text-gray-300">{state?.gender || 'None'}</p>
                                </div>
                                <div>
                                    <label className="text-sm text-gray-500 dark:text-gray-400">Address</label>
                                    <p className="mt-1 dark:text-gray-300">{state?.address || 'None'}</p>
                                </div>
                                <div>
                                    <label className="text-sm text-gray-500 dark:text-gray-400">Country</label>
                                    <p className="mt-1 dark:text-gray-300">{state?.country || 'None'}</p>
                                </div>

                            </div>
                        </div>

                        <div className="border dark:border-gray-700 rounded-lg p-4 md:p-6 dark:bg-gray-800">
                            <h2 className="text-lg font-semibold mb-4 dark:text-white">Academic Information</h2>
                            <div className="space-y-4">
                                <div>
                                    <label className="text-sm text-gray-500 dark:text-gray-400">Major</label>
                                    <p className="mt-1 dark:text-gray-300">{state?.major || 'None'}</p>
                                </div>
                                <div>
                                    <label className="text-sm text-gray-500 dark:text-gray-400">Batch</label>
                                    <p className="mt-1 dark:text-gray-300">{state?.batch || 'None'}</p>
                                </div>
                                <div>
                                    <label className="text-sm text-gray-500 dark:text-gray-400">Student ID</label>
                                    <p className="mt-1 dark:text-gray-300">{state?.studentId || 'None'}</p>
                                </div>
                                <div>
                                    <label className="text-sm text-gray-500 dark:text-gray-400">Semester</label>
                                    <p className="mt-1 dark:text-gray-300">{state?.semester || 'None'}</p>
                                </div>
                                <div>
                                    <label className="text-sm text-gray-500 dark:text-gray-400">Academic Advisor</label>
                                    <p className="mt-1 dark:text-gray-300">{state?.academicAdvisor || 'None'}</p>
                                </div>
                            </div>
                        </div>
                    </div>
                );
            case 'Lectures':
                return (
                    <div className="mt-6 p-4 md:p-6 border dark:border-gray-700 rounded-lg dark:bg-gray-800">
                        <h2 className="text-lg font-semibold mb-4 dark:text-white">Lectures Information</h2>
                        <div className="mb-6">
                            <label className="text-sm text-gray-500 dark:text-gray-400">Academic Year</label>
                            <div className="mt-2 flex gap-4">
                                <select className="p-2 border rounded dark:bg-gray-700 dark:text-gray-300">
                                    <option>2024/2025</option>
                                </select>
                                <select className="p-2 border rounded dark:bg-gray-700 dark:text-gray-300">
                                    <option>Gasal</option>
                                </select>
                                <button className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600">
                                    Search
                                </button>
                            </div>
                        </div>
                        <div className="overflow-x-auto">
                            <table className="min-w-full border-collapse border border-gray-300 dark:border-gray-700">
                                <thead className="bg-gray-100 dark:bg-gray-700">
                                    <tr>
                                        <th className="border border-gray-300 dark:border-gray-700 px-4 py-2 text-left">#</th>
                                        <th className="border border-gray-300 dark:border-gray-700 px-4 py-2 text-left">Course Code</th>
                                        <th className="border border-gray-300 dark:border-gray-700 px-4 py-2 text-left">Course</th>
                                        <th className="border border-gray-300 dark:border-gray-700 px-4 py-2 text-left">Credit (SKS)</th>
                                        <th className="border border-gray-300 dark:border-gray-700 px-4 py-2 text-left">Attendance (%)</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr>
                                        <td className="border border-gray-300 dark:border-gray-700 px-4 py-2">1</td>
                                        <td className="border border-gray-300 dark:border-gray-700 px-4 py-2">4233101</td>
                                        <td className="border border-gray-300 dark:border-gray-700 px-4 py-2">Magang</td>
                                        <td className="border border-gray-300 dark:border-gray-700 px-4 py-2">20</td>
                                        <td className="border border-gray-300 dark:border-gray-700 px-4 py-2">0.00</td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    </div>
                );

            case 'Notification':
                return (
                    <div className="mt-6 p-4 md:p-6 border dark:border-gray-700 rounded-lg dark:bg-gray-800">
                        <h2 className="text-lg font-semibold mb-4 dark:text-white">Notification</h2>
                        <p className="text-gray-600 dark:text-gray-400">Notification responses will be displayed here.</p>
                    </div>
                );
            default:
                return (
                    <div className="mt-6 p-4 md:p-6 border dark:border-gray-700 rounded-lg dark:bg-gray-800">
                        <h2 className="text-lg font-semibold mb-4 dark:text-white">{activeTab}</h2>
                        <p className="text-gray-600 dark:text-gray-400">{activeTab} content will be displayed here.</p>
                    </div>
                );
        }
    };

    return (
        <div className="p-4 md:p-6 bg-white dark:bg-gray-900">
            <div className="flex flex-col md:flex-row items-start md:items-center gap-4 md:gap-6 mb-6 md:mb-8">
                <div className="w-16 h-16 md:w-20 md:h-20 bg-blue-600 rounded-lg flex items-center justify-center">
                    <span className="text-xl md:text-2xl text-white">
                        {state?.name?.split(' ').map((n: string) => n[0]).join('')}
                    </span>
                </div>
                <div className="flex-1 min-w-0">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                        <div>
                            <h1 className="text-xl md:text-2xl font-semibold dark:text-white truncate">{state?.name}</h1>
                            <p className="text-gray-600 dark:text-gray-400">{state?.position || 'Student'}</p>
                        </div>
                        <div className="flex gap-2">
                            {/* Edit Icon */}
                            <button className="p-2 rounded hover:bg-gray-100 dark:hover:bg-gray-700">
                                <svg className="w-5 h-5 dark:text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                                </svg>
                            </button>

                            {/* Next Icon (coming soon) */}
                            <button className="p-2 rounded hover:bg-gray-100 dark:hover:bg-gray-700">
                                <svg className="w-5 h-5 dark:text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                </svg>
                            </button>
                        </div>
                    </div>
                    <div className="mt-2 flex flex-col md:flex-row gap-4 md:gap-8">
                        <div className="flex items-center gap-2">
                            <svg className="w-4 h-4 text-gray-500 dark:text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                            </svg>
                            <span className="text-gray-600 dark:text-gray-400 truncate">{state?.email}</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <svg className="w-4 h-4 text-gray-500 dark:text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                            </svg>
                            <span className="text-gray-600 dark:text-gray-400">{state?.phone || 'Not provided'}</span>
                        </div>
                    </div>
                </div>
            </div>

            <div className="border-b dark:border-gray-700 overflow-x-auto">
                <nav className="flex gap-4 md:gap-6 min-w-max">
                    {tabs.map((tab) => (
                        <button
                            key={tab}
                            onClick={() => setActiveTab(tab)}
                            className={`px-3 md:px-4 py-2 text-sm md:text-base text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200 border-b-2 ${tab === activeTab
                                ? 'border-blue-500 text-blue-500 dark:border-blue-400 dark:text-blue-400'
                                : 'border-transparent'
                                }`}
                        >
                            {tab}
                        </button>
                    ))}
                </nav>
            </div>

            {renderTabContent()}
        </div>
    );
};

export default StudentDetail;
