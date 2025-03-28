import React, { useState, useEffect, FormEvent } from 'react';
import { AdminRead, AdminUpdate } from '../../types/admin';
import { updateAdmin } from '../../api/adminApi';

interface PersonalInformationProps {
    initialData?: AdminRead;
}

const PersonalInformation: React.FC<PersonalInformationProps> = ({
    initialData = {
        admin_id: 0,
        full_name: '',
        username: '',
        created_at: '',
        updated_at: ''
    }
}) => {
    const [formData, setFormData] = useState<AdminUpdate>({
        full_name: initialData.full_name,
        username: initialData.username,
    });
    const [bio, setBio] = useState('');

    useEffect(() => {
        // Update form data when initial data changes
        setFormData({
            full_name: initialData.full_name,
            username: initialData.username,
        });
    }, [initialData]);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;

        if (name === 'bio') {
            setBio(value);
        } else {
            setFormData(prev => ({
                ...prev,
                [name]: value
            }));
        }
    };

    const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        try {
            // Assuming the admin_id is available in the initial data
            if (initialData.admin_id) {
                await updateAdmin(initialData.admin_id, formData);
                alert('Profile updated successfully!');
            }
        } catch (error) {
            console.error('Error updating profile', error);
            alert('Failed to update profile');
        }
    };

    return (
        <div className="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
            <div className="border-b border-stroke py-4 px-7 dark:border-strokedark">
                <h3 className="font-medium text-black dark:text-white">
                    Personal Information
                </h3>
            </div>
            <div className="p-7">
                <form onSubmit={handleSubmit}>
                    <div className="mb-5.5 flex flex-col gap-5.5 sm:flex-row">
                        <div className="w-full sm:w-1/2">
                            <label
                                className="mb-3 block text-sm font-medium text-black dark:text-white"
                                htmlFor="fullName"
                            >
                                Full Name
                            </label>
                            <div className="relative">
                                <span className="absolute left-4.5 top-4">
                                    <svg
                                        className="fill-current"
                                        width="20"
                                        height="20"
                                        viewBox="0 0 20 20"
                                        fill="none"
                                        xmlns="http://www.w3.org/2000/svg"
                                    >
                                        <g opacity="0.8">
                                            <path
                                                fillRule="evenodd"
                                                clipRule="evenodd"
                                                d="M3.72039 12.887C4.50179 12.1056 5.5616 11.6666 6.66667 11.6666H13.3333C14.4384 11.6666 15.4982 12.1056 16.2796 12.887C17.061 13.6684 17.5 14.7282 17.5 15.8333V17.5C17.5 17.9602 17.1269 18.3333 16.6667 18.3333C16.2064 18.3333 15.8333 17.9602 15.8333 17.5V15.8333C15.8333 15.1703 15.5699 14.5344 15.1011 14.0655C14.6323 13.5967 13.9964 13.3333 13.3333 13.3333H6.66667C6.00363 13.3333 5.36774 13.5967 4.8989 14.0655C4.43006 14.5344 4.16667 15.1703 4.16667 15.8333V17.5C4.16667 17.9602 3.79357 18.3333 3.33333 18.3333C2.8731 18.3333 2.5 17.9602 2.5 17.5V15.8333C2.5 14.7282 2.93899 13.6684 3.72039 12.887Z"
                                                fill=""
                                            />
                                            <path
                                                fillRule="evenodd"
                                                clipRule="evenodd"
                                                d="M9.99967 3.33329C8.61896 3.33329 7.49967 4.45258 7.49967 5.83329C7.49967 7.214 8.61896 8.33329 9.99967 8.33329C11.3804 8.33329 12.4997 7.214 12.4997 5.83329C12.4997 4.45258 11.3804 3.33329 9.99967 3.33329ZM5.83301 5.83329C5.83301 3.53211 7.69849 1.66663 9.99967 1.66663C12.3009 1.66663 14.1663 3.53211 14.1663 5.83329C14.1663 8.13448 12.3009 9.99996 9.99967 9.99996C7.69849 9.99996 5.83301 8.13448 5.83301 5.83329Z"
                                                fill=""
                                            />
                                        </g>
                                    </svg>
                                </span>
                                <input
                                    className="w-full rounded border border-stroke bg-gray py-3 pl-11.5 pr-4.5 text-black focus:border-primary focus-visible:outline-none dark:border-strokedark dark:bg-meta-4 dark:text-white dark:focus:border-primary"
                                    type="text"
                                    name="full_name"
                                    id="fullName"
                                    placeholder="Full Name"
                                    value={formData.full_name || ''}
                                    onChange={handleInputChange}
                                />
                            </div>
                        </div>


                    </div>



                    <div className="mb-5.5">
                        <label
                            className="mb-3 block text-sm font-medium text-black dark:text-white"
                            htmlFor="Username"
                        >
                            Username
                        </label>
                        <input
                            className="w-full rounded border border-stroke bg-gray py-3 px-4.5 text-black focus:border-primary focus-visible:outline-none dark:border-strokedark dark:bg-meta-4 dark:text-white dark:focus:border-primary"
                            type="text"
                            name="username"
                            id="Username"
                            placeholder="Username"
                            value={formData.username || ''}
                            onChange={handleInputChange}
                        />
                    </div>

                    <div className="flex justify-end gap-4.5">
                        <button
                            className="flex justify-center rounded border border-stroke py-2 px-6 font-medium text-black hover:shadow-1 dark:border-strokedark dark:text-white"
                            type="button"
                        >
                            Cancel
                        </button>
                        <button
                            className="flex justify-center rounded bg-primary py-2 px-6 font-medium text-gray hover:bg-opacity-90"
                            type="submit"
                        >
                            Save
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default PersonalInformation;