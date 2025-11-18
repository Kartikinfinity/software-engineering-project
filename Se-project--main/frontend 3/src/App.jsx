import Login from "./pages/Login";
import StudentDashboard from "./pages/StudentDashboard";
import ApplyLeave from "./pages/ApplyLeave";
import ApplyOD from "./pages/ApplyOD";
import Profile from "./pages/Profile";
import TeacherDashboard from "./pages/TeacherDashboard";
import TeacherPending from "./pages/TeacherPending";
import TeacherApproved from "./pages/TeacherApproved";
import AdminDashboard from "./pages/admin/AdminDashboard";
import AddSubject from "./pages/admin/AddSubject";
import AddTeacher from "./pages/admin/AddTeacher";
import AssignTeacher from "./pages/admin/AssignTeacher";
import ViewSubjects from "./pages/admin/ViewSubjects";

const routes = {
  "/": <Login />,
  "/login": <Login />,
  "/student-dashboard": <StudentDashboard />,
  "/student/dashboard": <StudentDashboard />,
  "/apply-leave": <ApplyLeave />,
  "/apply-od": <ApplyOD />,
  "/profile": <Profile />,
  "/teacher-dashboard": <TeacherDashboard />,
  "/teacher/pending": <TeacherPending />,
  "/teacher/history": <TeacherApproved />,
  "/admin-dashboard": <AdminDashboard />,
  "/admin/add-subject": <AddSubject />,
  "/admin/add-teacher": <AddTeacher />,
  "/admin/assign-teacher": <AssignTeacher />,
  "/admin/view-subjects": <ViewSubjects />,
};

function App() {
  const path = window.location.pathname;
  return routes[path] || <Login />;
}

export default App;
