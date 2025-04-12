import React, { useState, useEffect } from 'react';
import Breadcrumb from '../components/Breadcrumbs/Breadcrumb';
import PersonalInformation from '../components/Profile/PersonalInformation';
import UserPhoto from '../components/Profile/UserPhoto';
import { getAdminByUsername } from '../api/adminApi';
import { AdminRead } from '../types/admin';
import { jwtDecode } from 'jwt-decode';

interface DecodedToken {
  sub?: string;
  user_type?: string;
  exp?: number;
}

const Settings: React.FC = () => {
  const [adminData, setAdminData] = useState<AdminRead | undefined>(undefined);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  useEffect(() => {
    const fetchAdminData = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          throw new Error("Token not found in localStorage");
        }

        // Decode the token right here in the fetchAdminData function
        const decoded = jwtDecode<DecodedToken>(token);
        console.log("Decoded token:", decoded);

        if (!decoded.sub) {
          throw new Error("Username not found in token");
        }

        // First try to get admin using the /me endpoint
        const fetchedAdminData = await getAdminByUsername(decoded.sub);
        setAdminData(fetchedAdminData);
        setIsLoading(false);

      } catch (err) {
        console.error('Failed to fetch admin data', err);
        setError('Failed to load admin information. Please try logging in again.');
        setIsLoading(false);
      }
    };

    fetchAdminData();
  }, []);



  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (error) {
    return <div className="text-red-500 p-4">{error}</div>;
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