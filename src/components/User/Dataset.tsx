import React, { useState, useEffect } from 'react';
import Swal from 'sweetalert2';
import { Dataset } from '../../types/dataset';
import { getStudentDatasets, createDataset, updateDataset, deleteDataset } from '../../api/datasetApi';
import { StudentRead } from '../../types/student';

interface DatasetProps {
    studentData: StudentRead | null;
}
const DatasetComponent: React.FC<DatasetProps> = ({ studentData }) => {
    const studentId = studentData?.student_id;

    const [datasets, setDatasets] = useState<Dataset[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    const [showModal, setShowModal] = useState<boolean>(false);
    const [currentDataset, setCurrentDataset] = useState<Dataset | null>(null);
    const [formData, setFormData] = useState({
        image_url: '',
        label: 'SMILE'
    });

    // Fetch student datasets
    useEffect(() => {
        const fetchData = async () => {
            try {
                if (studentId) {
                    setLoading(true);
                    const data = await getStudentDatasets(studentId);
                    setDatasets(data);
                    setError(null);
                }
            } catch (err) {
                setError('Failed to fetch datasets');
                console.error(err);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [studentId]);

    // Handle form input changes
    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value
        });
    };

    // Open modal for creating new dataset
    const handleAddNew = () => {
        setCurrentDataset(null);
        setFormData({
            image_url: '',
            label: 'SMILE'
        });
        setShowModal(true);
    };

    // Open modal for editing dataset
    const handleEdit = (dataset: Dataset) => {
        setCurrentDataset(dataset);
        setFormData({
            image_url: dataset.image_url,
            label: dataset.label
        });
        setShowModal(true);
    };

    // Handle form submission
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            if (currentDataset) {
                // Update existing dataset
                const updated = await updateDataset(currentDataset.dataset_id, formData);
                setDatasets(datasets.map(d => d.dataset_id === updated.dataset_id ? updated : d));

                // Show success alert for update
                Swal.fire({
                    icon: 'success',
                    title: 'Dataset Updated',
                    text: 'Your dataset has been successfully updated.',
                    timer: 2000,
                    timerProgressBar: true,
                    showConfirmButton: false
                });
            } else {
                // Create new dataset
                const created = await createDataset({
                    student_id: Number(studentId),
                    ...formData
                });
                setDatasets([...datasets, created]);

                // Show success alert for creation
                Swal.fire({
                    icon: 'success',
                    title: 'Dataset Created',
                    text: 'A new dataset has been successfully added.',
                    timer: 2000,
                    timerProgressBar: true,
                    showConfirmButton: false
                });
            }
            setShowModal(false);
        } catch (err) {
            setError('Failed to save dataset');
            console.error(err);

            // Show error alert
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: 'Failed to save the dataset.',
                confirmButtonText: 'OK'
            });
        }
    };

    // Handle dataset deletion with SweetAlert
    const handleDelete = async (datasetId: number) => {
        const result = await Swal.fire({
            title: 'Are you sure?',
            text: "You won't be able to revert this!",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#d33',
            cancelButtonColor: '#3085d6',
            confirmButtonText: 'Yes, delete it!',
            cancelButtonText: 'Cancel'
        });

        if (result.isConfirmed) {
            try {
                await deleteDataset(datasetId);
                setDatasets(datasets.filter(d => d.dataset_id !== datasetId));

                await Swal.fire({
                    title: 'Deleted!',
                    text: 'Your dataset has been deleted.',
                    icon: 'success',
                    confirmButtonColor: '#4CAF50'
                });
            } catch (err) {
                setError('Failed to delete dataset');
                console.error(err);

                await Swal.fire({
                    title: 'Error!',
                    text: 'Failed to delete the dataset.',
                    icon: 'error',
                    confirmButtonColor: '#d33'
                });
            }
        }
    };

    return (
        <div className="mt-6 p-4 md:p-6 border dark:border-gray-700 rounded-lg dark:bg-gray-800">
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-lg font-semibold dark:text-white">Dataset Information</h2>
                <button
                    onClick={handleAddNew}
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                    Add New Dataset
                </button>
            </div>

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
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Label</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Image URL</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200 dark:bg-gray-800 dark:divide-gray-700">
                            {datasets.length === 0 ? (
                                <tr>
                                    <td colSpan={4} className="px-6 py-4 text-center text-gray-500 dark:text-gray-400">
                                        No datasets found for this student
                                    </td>
                                </tr>
                            ) : (
                                datasets.map((dataset) => (
                                    <tr key={dataset.dataset_id}>
                                        <td className="px-6 py-4 whitespace-nowrap text-gray-900 dark:text-gray-200">{dataset.dataset_id}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-gray-900 dark:text-gray-200">{dataset.label}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-gray-500 dark:text-gray-400 truncate max-w-xs">{dataset.image_url}</td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="flex items-center space-x-2">
                                                <button
                                                    onClick={() => handleEdit(dataset)}
                                                    className="px-3 py-1 bg-yellow-500 text-white rounded hover:bg-yellow-600"
                                                >
                                                    Edit
                                                </button>
                                                <button
                                                    onClick={() => handleDelete(dataset.dataset_id)}
                                                    className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600"
                                                >
                                                    Delete
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            )}

            {/* Modal for adding/editing datasets remains the same */}
            {showModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
                    <div className="bg-white dark:bg-gray-800 p-6 rounded-lg w-full max-w-md">
                        <h3 className="text-lg font-medium mb-4 dark:text-white">
                            {currentDataset ? 'Edit Dataset' : 'Add New Dataset'}
                        </h3>

                        <form onSubmit={handleSubmit}>
                            <div className="mb-4">
                                <label className="block text-gray-700 dark:text-gray-300 mb-2" htmlFor="image_url">
                                    Image URL
                                </label>
                                <input
                                    type="text"
                                    id="image_url"
                                    name="image_url"
                                    value={formData.image_url}
                                    onChange={handleInputChange}
                                    className="w-full p-2 border rounded dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                                    required
                                />
                            </div>

                            <div className="mb-4">
                                <label className="block text-gray-700 dark:text-gray-300 mb-2" htmlFor="label">
                                    Label
                                </label>
                                <select
                                    id="label"
                                    name="label"
                                    value={formData.label}
                                    onChange={handleInputChange}
                                    className="w-full p-2 border rounded dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                                    required
                                >
                                    <option value="SMILE">SMILE</option>
                                    <option value="NEUTRAL">NEUTRAL</option>
                                    <option value="SAD">SAD</option>
                                    <option value="ANGRY">ANGRY</option>
                                    <option value="SURPRISE">SURPRISE</option>
                                </select>
                            </div>

                            <div className="flex justify-end gap-3">
                                <button
                                    type="button"
                                    onClick={() => setShowModal(false)}
                                    className="px-4 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 dark:bg-gray-700 dark:text-gray-200 dark:hover:bg-gray-600"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                                >
                                    Save
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default DatasetComponent;