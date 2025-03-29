import { useState, useEffect } from 'react';
import { getStudents, deleteStudent } from '../../api/studentApi';
import { StudentRead } from '../../types/student';
import Swal from 'sweetalert2';
import ProfileCard from '../../components/List/List';
import AddStudentModal from '../../components/User/AddStudentModal';

const StudentList = () => {
    const [students, setStudents] = useState<StudentRead[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const [isModalOpen, setIsModalOpen] = useState<boolean>(false);

    useEffect(() => {
        loadStudents();
    }, []);

    const loadStudents = async () => {
        try {
            setLoading(true);
            setError(null);
            const data = await getStudents();
            setStudents(data);
        } catch (err) {
            setError('Failed to load students');
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (studentId: number) => {
        const result = await Swal.fire({
            title: 'Are you sure?',
            text: "You won't be able to revert this!",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#d33',
            cancelButtonColor: '#3085d6',
            confirmButtonText: 'Delete',
            cancelButtonText: 'Cancel'
        });

        if (result.isConfirmed) {
            try {
                await deleteStudent(studentId);
                await Swal.fire({
                    title: 'Deleted!',
                    text: 'Student data has been deleted.',
                    icon: 'success',
                    confirmButtonColor: '#4CAF50'
                });
                loadStudents();
            } catch (err) {
                setError('Failed to delete student');
                console.error(err);
                await Swal.fire({
                    title: 'Error!',
                    text: 'Failed to delete student.',
                    icon: 'error',
                    confirmButtonColor: '#d33'
                });
            }
        }
    };

    // Helper function to convert student.is_approved to a status string
    const getStatusText = (isApproved: boolean): 'Approved' | 'Pending' => {
        return isApproved ? 'Approved' : 'Pending';
    };

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
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold">Students</h2>
                <button
                    onClick={() => setIsModalOpen(true)}
                    className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded"
                >
                    Add New Student
                </button>
            </div>

            {/* Add Student Modal */}
            <AddStudentModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onSuccess={loadStudents} 
            />

            {students.length === 0 ? (
                <p>No students found.</p>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {students.map((student) => (
                        <ProfileCard
                            key={student.student_id}
                            id={student.student_id}
                            name={student.full_name}
                            email={student.username}
                            description={`${student.major_name} - Year ${student.year}`}
                            status={getStatusText(student.is_approved)}
                            onDelete={() => handleDelete(student.student_id)}
                            type='student'
                        />
                    ))}
                </div>
            )}
        </div>
    );
};

export default StudentList;