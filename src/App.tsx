import { useEffect, useState } from 'react';
import { Route, Routes, useNavigate, useLocation, Navigate } from 'react-router-dom';

import Loader from './common/Loader';
import PageTitle from './components/PageTitle';
import SignIn from './pages/Authentication/SignIn';
import SignUp from './pages/Authentication/SignUp';
import Calendar from './pages/Calendar';
import Chart from './pages/Chart';
import Dashboard from './pages/Dashboard/ECommerce';
import FormElements from './pages/Form/FormElements';
import FormLayout from './pages/Form/FormLayout';
import Profile from './pages/Profile';
import Settings from './pages/Settings';
import Tables from './pages/Tables';
import Alerts from './pages/UiElements/Alerts';
import Buttons from './pages/UiElements/Buttons';
import DefaultLayout from './layout/DefaultLayout';
import StudentRegistration from './pages/User/StudentRegistration';
import StudentList from './pages/User/StudentList';
import MajorSettings from './pages/Academic/MajorAcademic';
import YearSettings from './pages/Academic/YearSettings';
import AttendanceHistory from './pages/Attendance/AttendanceHistory';
import LateReport from './pages/Attendance/LateReport';
import SendNotification from './pages/Notification/SendNotification';
import NotificationHistory from './pages/Notification/NotificationHistory';
import NotificationTemplates from './pages/Notification/NotificationTemplates';
import SystemSettings from './pages/Settings/SystemSettings';
import LocationSettings from './pages/Settings/LocationSettings';
import ProfileSettings from './pages/Settings/ProfileSettings';
import 'sweetalert2/dist/sweetalert2.css';
import StudentDetail from './pages/User/StudentDetail';
import AttendanceReports from './pages/Report/AttendanceReports';
import ClassAcademic from './pages/Academic/ClassAcademic';
import Schedules from './pages/Schedule/Schedules';
import StudentSchedules from './pages/Schedule/StudentSchedules';
import Rooms from './pages/Schedule/Rooms';


function App() {
  const [loading, setLoading] = useState<boolean>(true);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false); // Menentukan apakah user sudah login
  const { pathname } = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  useEffect(() => {
    setTimeout(() => setLoading(false), 1000);
  }, []);

  const handleSignIn = () => {
    setIsAuthenticated(true); // Set user sebagai login
    navigate('/'); // Redirect ke halaman utama
  };

  const handleSignUp = () => {
    setIsAuthenticated(true); // Set user sebagai login
    navigate('/'); // Redirect ke halaman utama
  };

  return loading ? (
    <Loader />
  ) : (
    <Routes>
      {!isAuthenticated ? (
        <>
          {/* Redirect dari root ke signin */}
          <Route path="/" element={<Navigate to="/auth/signin" replace />} />

          <Route
            path="/auth/signin"
            element={
              <>
                <PageTitle title="Signin | Senyum Hadir" />
                <SignIn onSignIn={handleSignIn} />
              </>
            }
          />
          <Route
            path="/auth/signup"
            element={
              <>
                <PageTitle title="Signup | Senyum Hadir" />
                <SignUp onSignUp={handleSignUp} />
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
                    <PageTitle title="Dashboard | Senyum Hadir" />
                    <Dashboard />
                  </>
                }
              />

              {/* Student Routes */}
              <Route
                path='/student/student-list'
                element={
                  <>
                    <PageTitle title="Student List | Senyum Hadir" />
                    <StudentList />
                  </>
                }
              />
              <Route path="/student/student-list/:id" element={<StudentDetail />} />

              <Route
                path='/student/student-registration'
                element={
                  <>
                    <PageTitle title="Student Registration | Senyum Hadir" />
                    <StudentRegistration />
                  </>
                }
              />

              {/* Academic Routes */}
              <Route
                path='/academic/class-academic'
                element={
                  <>
                    <PageTitle title="Class Schedule | Senyum Hadir" />
                    <ClassAcademic />
                  </>
                }
              />
              <Route
                path='/academic/major-settings'
                element={
                  <>
                    <PageTitle title="Major Settings | Senyum Hadir" />
                    <MajorSettings />
                  </>
                }
              />
              <Route
                path='/schedule/year-settings'
                element={
                  <>
                    <PageTitle title="Year Settings | Senyum Hadir" />
                    <YearSettings />
                  </>
                }
              />


              {/* Attendance */}
              <Route
                path='/attendance/attendance-history'
                element={
                  <>
                    <PageTitle title="Attendance History | Senyum Hadir" />
                    <AttendanceHistory />
                  </>
                }
              />
              <Route
                path='/attendance/attendance-reports'
                element={
                  <>
                    <PageTitle title="Face Detection Logs | Senyum Hadir" />
                    <AttendanceReports />
                  </>
                }
              />
              <Route
                path='/attendance/late-reports'
                element={
                  <>
                    <PageTitle title="Late Reports | Senyum Hadir" />
                    <LateReport />
                  </>
                }
              />

              {/* Schedules */}
              <Route
                path='/schedule/schedules'
                element={
                  <>
                    <PageTitle title="Schedules | Senyum Hadir" />
                    <Schedules />
                  </>
                }
              />
              <Route
                path='/schedule/student-schedules'
                element={
                  <>
                    <PageTitle title="Student Schedules | Senyum Hadir" />
                    <StudentSchedules />
                  </>
                }
              />
              <Route
                path='/schedule/rooms'
                element={
                  <>
                    <PageTitle title="Rooms | Senyum Hadir" />
                    <Rooms />
                  </>
                }
              />

              {/* Notification */}
              <Route
                path='/notification/send-notification'
                element={
                  <>
                    <PageTitle title="Send Notification | Senyum Hadir" />
                    <SendNotification />
                  </>
                }
              />
              <Route
                path='/notification/notification-history'
                element={
                  <>
                    <PageTitle title="Notification History | Senyum Hadir" />
                    <NotificationHistory />
                  </>
                }
              />
              <Route
                path='/notification/notification-templates'
                element={
                  <>
                    <PageTitle title="Notification Templates | Senyum Hadir" />
                    <NotificationTemplates />
                  </>
                }
              />


              {/* Settings */}
              <Route
                path='/settings/system-settings'
                element={
                  <>
                    <PageTitle title="System Settings | Senyum Hadir" />
                    <SystemSettings />
                  </>
                }
              />
              <Route
                path='/settings/location-settings'
                element={
                  <>
                    <PageTitle title="Location Settings | Senyum Hadir" />
                    <LocationSettings />
                  </>
                }
              />
              <Route
                path='/settings/profile-settings'
                element={
                  <>
                    <PageTitle title="Profile Settings | Senyum Hadir" />
                    <ProfileSettings />
                  </>
                }
              />


              <Route
                path="/calendar"
                element={
                  <>
                    <PageTitle title="Calendar | Senyum Hadir" />
                    <Calendar />
                  </>
                }
              />
              <Route
                path="/profile"
                element={
                  <>
                    <PageTitle title="Profile | Senyum Hadir" />
                    <Profile />
                  </>
                }
              />
              <Route
                path="/forms/form-elements"
                element={
                  <>
                    <PageTitle title="Form Elements | Senyum Hadir" />
                    <FormElements />
                  </>
                }
              />
              <Route
                path="/forms/form-layout"
                element={
                  <>
                    <PageTitle title="Form Layout | Senyum Hadir" />
                    <FormLayout />
                  </>
                }
              />
              <Route
                path="/tables"
                element={
                  <>
                    <PageTitle title="Tables | Senyum Hadir" />
                    <Tables />
                  </>
                }
              />
              <Route
                path="/settings"
                element={
                  <>
                    <PageTitle title="Settings | Senyum Hadir" />
                    <Settings />
                  </>
                }
              />
              <Route
                path="/chart"
                element={
                  <>
                    <PageTitle title="Basic Chart | Senyum Hadir" />
                    <Chart />
                  </>
                }
              />
              <Route
                path="/ui/alerts"
                element={
                  <>
                    <PageTitle title="Alerts | Senyum Hadir" />
                    <Alerts />
                  </>
                }
              />
              <Route
                path="/ui/buttons"
                element={
                  <>
                    <PageTitle title="Buttons | Senyum Hadir" />
                    <Buttons />
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
