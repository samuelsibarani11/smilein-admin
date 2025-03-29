import { useState, useEffect } from 'react';
import { getInstructors, deleteInstructor } from '../../api/instructorApi';
import Swal from 'sweetalert2';
import ProfileCard from '../../components/List/List';
import AddInstructorModal from '../../components/Instructor/AddInstructorModal';
import { InstructorRead } from '../../types/instructor';

const InstructorList = () => {
    const [instructors, setInstructors] = useState<InstructorRead[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const [isModalOpen, setIsModalOpen] = useState<boolean>(false);

    useEffect(() => {
        loadInstructors();
    }, []);

    const loadInstructors = async () => {
        try {
            setLoading(true);
            setError(null);
            const data = await getInstructors();
            setInstructors(data);
        } catch (err) {
            setError('Failed to load instructors');
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (instructorId: number) => {
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
                await deleteInstructor(instructorId);
                await Swal.fire({
                    title: 'Deleted!',
                    text: 'Instructor data has been deleted.',
                    icon: 'success',
                    confirmButtonColor: '#4CAF50'
                });
                loadInstructors();
            } catch (err) {
                setError('Failed to delete instructor');
                console.error(err);
                await Swal.fire({
                    title: 'Error!',
                    text: 'Failed to delete instructor.',
                    icon: 'error',
                    confirmButtonColor: '#d33'
                });
            }
        }
    };

    // Helper function to convert instructor.is_active to a status string
    const getStatusText = (isActive: boolean): 'Active' | 'Inactive' => {
        return isActive ? 'Active' : 'Inactive';
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center h-64">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
            </div>
        );
    }

    if (error) {
        return <div className="p-4 text-red-500">{error}</div>;
    }

    return (
        <div className="space-y-8 p-4">
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold">Instructors</h2>
                <button
                    onClick={() => setIsModalOpen(true)}
                    className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded"
                >
                    Add New Instructor
                </button>
            </div>

            {/* Add Instructor Modal */}
            <AddInstructorModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onSuccess={loadInstructors}
            />

            {instructors.length === 0 ? (
                <p>No instructors found.</p>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {instructors.map((instructor) => (
                        <ProfileCard
                            key={instructor.instructor_id}
                            id={instructor.instructor_id}
                            name={instructor.full_name}
                            email={instructor.email}
                            description={`NIDN: ${instructor.nidn}`}
                            status={getStatusText(instructor.is_active)}
                            onDelete={() => handleDelete(instructor.instructor_id)}
                            type='instructor'
                        />
                    ))}
                </div>
            )}
        </div>
    );
};

export default InstructorList;