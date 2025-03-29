import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import ClickOutside from '../ClickOutside';
import UserOne from '../../images/user/user-01.png';
import { jwtDecode } from 'jwt-decode';
import { getAdminByUsername, getAdminProfilePicture } from '../../api/adminApi';
import { AdminRead } from '../../types/admin';

interface DecodedToken {
  username?: string;
  [key: string]: any;
}

const DropdownUser: React.FC = () => {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [decodedToken, setDecodedToken] = useState<DecodedToken>({});
  const [profilePicture, setProfilePicture] = useState<string | null>(null);
  const [_, setAdminData] = useState<AdminRead | undefined>(undefined);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      try {
        const decoded = jwtDecode<DecodedToken>(token);
        setDecodedToken(decoded);
      }
      catch (error) {
        console.error("Error decoding token:", error);
        localStorage.removeItem('token');
      }
    } else {
      console.log("Token tidak ditemukan di localStorage");
    }
  }, []);

  useEffect(() => {
    const fetchAdminData = async () => {
      setIsLoading(true);
      setError(null);

      try {
        const token = localStorage.getItem("token");
        if (!token) {
          throw new Error("Token not found in localStorage");
        }

        const decoded = jwtDecode<DecodedToken>(token);
        console.log("Decoded token:", decoded);

        if (!decoded.sub) {
          throw new Error("Username not found in token");
        }

        const fetchedAdminData = await getAdminByUsername(decoded.sub);
        setAdminData(fetchedAdminData);

        // Try to fetch profile picture if we have admin data
        if (fetchedAdminData?.admin_id) {
          try {
            const profileData = await getAdminProfilePicture(fetchedAdminData.admin_id);
            setProfilePicture(profileData.profile_picture_url);
          } catch (profileErr) {
            console.error("Error fetching profile picture:", profileErr);
          }
        }

        setIsLoading(false);

      } catch (err) {
        console.error('Failed to fetch admin data', err);
        setError('Failed to load admin information. Please try logging in again.');
        setIsLoading(false);
      }
    };

    fetchAdminData();

  }, []);

  const userType = localStorage.getItem('userType');

  const handleLogout = () => {
    localStorage.removeItem('token');
    window.location.reload();
  };

  // Function to process image URL
  const getImageUrl = (url: string | null) => {
    if (!url) return UserOne;

    if (url.startsWith('data:')) return url;
    if (url.startsWith('/')) return `http://localhost:8000${url}`;
    return url;
  };

  // Conditionally render based on loading and error states
  if (isLoading) {
    return (
      <div className="flex items-center gap-4">
        <span className="h-12 w-12 rounded-full bg-gray-200 animate-pulse"></span>
        <span className="hidden text-right lg:block">
          <span className="block text-sm font-medium">Loading...</span>
        </span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center gap-4">
        <span className="text-sm text-red-500">{error}</span>
      </div>
    );
  }

  return (
    <ClickOutside onClick={() => setDropdownOpen(false)} className="relative">
      <Link
        onClick={() => setDropdownOpen(!dropdownOpen)}
        className="flex items-center gap-4"
        to="#"
      >
        <span className="hidden text-right lg:block">
          <span className="block text-sm font-medium text-black dark:text-white">
            {decodedToken.sub || 'User'}
          </span>
          <span className="block text-xs">{userType}</span>
        </span>

        <span className="h-12 w-12 rounded-full">
          <img
            src={getImageUrl(profilePicture)}
            alt="User"
            className="h-full w-full object-cover rounded-full"
          />
        </span>

        <svg
          className="hidden fill-current sm:block"
          width="12"
          height="8"
          viewBox="0 0 12 8"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            fillRule="evenodd"
            clipRule="evenodd"
            d="M0.410765 0.910734C0.736202 0.585297 1.26384 0.585297 1.58928 0.910734L6.00002 5.32148L10.4108 0.910734C10.7362 0.585297 11.2638 0.585297 11.5893 0.910734C11.9147 1.23617 11.9147 1.76381 11.5893 2.08924L6.58928 7.08924C6.26384 7.41468 5.7362 7.41468 5.41077 7.08924L0.410765 2.08924C0.0853277 1.76381 0.0853277 1.23617 0.410765 0.910734Z"
            fill=""
          />
        </svg>
      </Link>

      {/* <!-- Dropdown Start --> */}
      {dropdownOpen && (
        <div
          className={`absolute right-0 mt-4 flex w-62.5 flex-col rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark`}
        >
          <ul className="flex flex-col gap-5 border-b border-stroke px-6 py-7.5 dark:border-strokedark">
            <li>
              <Link
                to="/settings"
                className="flex items-center gap-3.5 text-sm font-medium duration-300 ease-in-out hover:text-primary lg:text-base"
              >
                <svg
                  className="fill-current"
                  width="22"
                  height="22"
                  viewBox="0 0 22 22"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  {/* SVG paths */}
                </svg>
                Account Settings
              </Link>
            </li>
          </ul>
          <button
            className="flex items-center gap-3.5 px-6 py-4 text-sm font-medium duration-300 ease-in-out hover:text-primary lg:text-base"
            onClick={handleLogout}
          >
            <svg
              className="fill-current"
              width="22"
              height="22"
              viewBox="0 0 22 22"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              {/* SVG paths */}
            </svg>
            Log Out
          </button>
        </div>
      )}
    </ClickOutside>
  );
};

export default DropdownUser;