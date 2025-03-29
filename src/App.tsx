import { useEffect, useState } from 'react';
import { Route, Routes, useNavigate, useLocation, Navigate } from 'react-router-dom';
import Loader from './common/Loader';
import PageTitle from './components/PageTitle';
import SignIn from './pages/Authentication/SignIn';
import Dashboard from './pages/Dashboard/ECommerce';
import Profile from './pages/Profile';
import Settings from './pages/Settings';
import DefaultLayout from './layout/DefaultLayout';
import StudentList from './pages/User/StudentList';
import AttendanceHistory from './pages/Attendance/Attendances';
import SendNotification from './pages/Notification/SendNotification';
import NotificationHistory from './pages/Notification/NotificationHistory';
import NotificationTemplates from './pages/Notification/NotificationTemplates';
import SystemSettings from './pages/Settings/SystemSettings';
import LocationSettings from './pages/Settings/LocationSettings';
import ProfileSettings from './pages/Settings/ProfileSettings';
import 'sweetalert2/dist/sweetalert2.css';
import StudentDetail from './pages/User/StudentDetail';
import CourseList from './pages/Academic/CourseList';
import Schedules from './pages/Schedule/Schedules';
import InstructorList from './pages/Instructor/InstructorList';
import InstructorDetail from './pages/Instructor/InstructorDetail';
import Swal from 'sweetalert2'; // Make sure to import Swal


function App() {
  const [loading, setLoading] = useState<boolean>(true);
  const [_, setIsAuthenticated] = useState<boolean>(false);
  const { pathname } = useLocation();
  const navigate = useNavigate();

  const isTokenExpired = () => {
    const token = localStorage.getItem('token');
    if (!token) return true;

    try {
      const payload = token.split('.')[1];
      const decodedPayload = JSON.parse(atob(payload));
      if (decodedPayload.exp) {
        const expirationTime = decodedPayload.exp * 1000;
        return Date.now() >= expirationTime;
      }
      return false;
    } catch (error) {
      console.error('Error checking token expiration:', error);
      return true;
    }
  };

  useEffect(() => {
    const token = localStorage.getItem('token');

    if (token && isTokenExpired() && pathname !== '/auth/signin') {
      Swal.fire({
        icon: 'warning',
        title: 'Session Expired',
        text: 'Your session has expired. Please sign in again.',
        confirmButtonText: 'Sign In',
        confirmButtonColor: '#3085d6', // Blue color for the button
        allowOutsideClick: false,
      }).then(() => {
        localStorage.removeItem('token');
        setIsAuthenticated(false);
        navigate('/auth/signin', { replace: true });
      });
    }
  }, [pathname, navigate]);


  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  useEffect(() => {
    setTimeout(() => setLoading(false), 1000);
  }, []);

  const handleSignIn = () => {
    setIsAuthenticated(true);
    navigate('/');
  };



  const aktif = !!localStorage.getItem('token')
  console.log(localStorage.getItem('userType'))

  return loading ? (
    <Loader />
  ) : (
    <Routes>
      {!aktif ? (
        <>
          {/* Redirect dari root ke signin */}
          <Route path="/" element={<Navigate to="/auth/signin" replace />} />

          <Route
            path="/auth/signin"
            element={
              <>
                <PageTitle title="Signin | SmileIn" />
                <SignIn onSignIn={handleSignIn} />
              </>
            }
          />
          {/* Redirect semua route unknown ke signin saat belum auth */}
          <Route path="*" element={<Navigate to="/auth/signin" replace />} />
        </>
      ) : (
        <Route
          path="/*"
          element={<DefaultLayout>
            <Routes>

              {/* Dashboard Routes  */}
              <Route
                index
                element={
                  <>
                    <PageTitle title="Dasbor | SmileIn" />
                    <Dashboard />
                  </>
                }
              />

              {/* Student Routes */}
              <Route
                path='/student/student-list'
                element={
                  <>
                    <PageTitle title="Daftar Mahasiswa | SmileIn" />
                    <StudentList />
                  </>
                }
              />
              <Route path="/student/student-list/:id" element={
                <>
                  <PageTitle title="Detail Mahasiswa | SmileIn" />
                  <StudentDetail />
                </>
              } />

              {/* Course Routes */}
              <Route
                path='/instructor/instructor-list'
                element={
                  <>
                    <PageTitle title="Daftar Dosen | SmileIn" />
                    <InstructorList />
                  </>
                }
              />
              <Route path="/instructor/instructor-list/:id" element={
                <>
                  <InstructorDetail />
                  <PageTitle title="Detail Dosen | SmileIn" />
                </>
              } />

              {/* Academic Routes */}
              <Route
                path='/course/course-list'
                element={
                  <>
                    <PageTitle title="Mata Kuliah | SmileIn" />
                    <CourseList />
                  </>
                }
              />


              {/* Schedules */}
              <Route
                path='/schedule/schedules'
                element={
                  <>
                    <PageTitle title="Jadwal | SmileIn" />
                    <Schedules />
                  </>
                }
              />


              {/* Attendance */}
              <Route
                path='/attendance/attendance-list'
                element={
                  <>
                    <PageTitle title="Attendance History | SmileIn" />
                    <AttendanceHistory />
                  </>
                }
              />


              {/* Notification */}
              <Route
                path='/notification/send-notification'
                element={
                  <>
                    <PageTitle title="Send Notification | SmileIn" />
                    <SendNotification />
                  </>
                }
              />
              <Route
                path='/notification/notification-history'
                element={
                  <>
                    <PageTitle title="Notification History | SmileIn" />
                    <NotificationHistory />
                  </>
                }
              />
              <Route
                path='/notification/notification-templates'
                element={
                  <>
                    <PageTitle title="Notification Templates | SmileIn" />
                    <NotificationTemplates />
                  </>
                }
              />


              {/* Settings */}
              <Route
                path='/settings/system-settings'
                element={
                  <>
                    <PageTitle title="System Settings | SmileIn" />
                    <SystemSettings />
                  </>
                }
              />
              <Route
                path='/settings/location-settings'
                element={
                  <>
                    <PageTitle title="Location Settings | SmileIn" />
                    <LocationSettings />
                  </>
                }
              />
              <Route
                path='/settings/profile-settings'
                element={
                  <>
                    <PageTitle title="Profile Settings | SmileIn" />
                    <ProfileSettings />
                  </>
                }
              />



              <Route
                path="/profile"
                element={
                  <>
                    <PageTitle title="Profile | SmileIn" />
                    <Profile />
                  </>
                }
              />

              <Route
                path="/settings"
                element={
                  <>
                    <PageTitle title="Settings | SmileIn" />
                    <Settings />
                  </>
                }
              />
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </DefaultLayout>
          }
        />
      )}
    </Routes>
  );
}

export default App;
