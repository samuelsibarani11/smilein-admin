import React, { useState, useEffect } from 'react';
import Breadcrumb from '../components/Breadcrumbs/Breadcrumb';
import PersonalInformation from '../components/Profile/PersonalInformation';
import UserPhoto from '../components/Profile/UserPhoto';
import { getAdmin } from '../api/adminApi'; // Assuming this is the method to fetch admin details
import { AdminRead } from '../types/admin';

const Settings: React.FC = () => {
  const [adminData, setAdminData] = useState<AdminRead | undefined>(undefined);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchAdminData = async () => {
      try {
        // Assuming you have a way to get the current admin's ID 
        // This might come from a context, local storage, or an authentication service
        const currentAdminId = 1; // Replace with actual method to get current admin ID
        
        const fetchedAdminData = await getAdmin(currentAdminId);
        setAdminData(fetchedAdminData);
        setIsLoading(false);
      } catch (err) {
        console.error('Failed to fetch admin data', err);
        setError('Failed to load admin information');
        setIsLoading(false);
      }
    };

    fetchAdminData();
  }, []);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  return (
    <>
      <div className="mx-auto max-w-270">
        <Breadcrumb pageName="Settings" />

        <div className="grid grid-cols-5 gap-8">
          <div className="col-span-5 xl:col-span-3">
            <PersonalInformation initialData={adminData} />
          </div>

          <div className="col-span-5 xl:col-span-2">
            <UserPhoto 
              adminId={adminData?.admin_id} 
              currentProfilePicture={adminData?.profile_picture_url} 
            />
          </div>
        </div>
      </div>
    </>
  );
};

export default Settings;