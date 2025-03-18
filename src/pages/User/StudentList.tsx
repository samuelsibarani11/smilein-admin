import { useState } from 'react';
import Swal from 'sweetalert2';
import ProfileCard from '../../components/List/List';

interface Employee {
    id: number;
    name: string;
    email: string;
    department: string;
    status: 'Converted' | 'Hired' | 'Not-Hired' | 'Canceled';
    dob?: string;
}

const StudentList = () => {
    const [employees, setEmployees] = useState<Employee[]>([
        {
            id: 1,
            name: 'Liam Bennett',
            email: 'liam.bennett@horilla.com',
            department: 'Odoo Dev - (S/W Dept)',
            status: 'Converted',
            dob: '11 November 2024'
        },
        {
            id: 2,
            name: 'Noah Anderson',
            email: 'noah.anderson@horilla.com',
            department: 'Odoo Dev - (S/W Dept)',
            status: 'Hired',
            dob: '11 November 2024'

        },
        {
            id: 3,
            name: 'Mia Reed',
            email: 'mia.reed@horilla.com',
            department: 'Odoo Dev - (S/W Dept)',
            status: 'Not-Hired',
            dob: '11 November 2024'

        },
    ]);

    const handleDelete = async (employee: Employee) => {
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
            setEmployees((prevEmployees) => prevEmployees.filter((e) => e.id !== employee.id));
            await Swal.fire({
                title: 'Deleted!',
                text: 'Employee data has been deleted.',
                icon: 'success',
                confirmButtonColor: '#4CAF50'
            });
        }
    };


    return (
        <div className="space-y-8 p-4">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {employees.map((employee) => (
                    <ProfileCard
                        key={employee.id}
                        id={employee.id}
                        name={employee.name}
                        email={employee.email}
                        description={employee.department}
                        status={employee.status}
                        dob={employee.dob}
                        onDelete={() => handleDelete(employee)}
                    />
                ))}
            </div>

        </div>
    );
};

export default StudentList;