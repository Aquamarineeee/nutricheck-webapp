import { Routes, Route, useLocation } from "react-router-dom";
import Home from "./pages/Home";
import Signup from "./pages/auth/Signup";
import Signin from "./pages/auth/Signin";
import Blogs from "./pages/Blogs/Blogs";
import Reports from "./pages/Reports";
import Nutrients from "./pages/FoodScan/Nutrients";
import Dashboard from "./pages/Dashboard";
import BottomNavBar from "./Components/BottomNavBar";
import FoodScan from "./pages/FoodScan";
import UserInitialForm from "./pages/UserInitialForm";
import UserSignup  from "./pages/UserInitialForm/signin-test"
import Profile from "./pages/profile/Profile";
import Blog02 from "./pages/Blogs/Blog02";
import Blog01 from "./pages/Blogs/Blog01";
import Blog055 from "./pages/Blogs/Blog055";
import Blog10 from "./pages/Blogs/Blog10";
import Blog16 from "./pages/Blogs/Blog16";
import Quiz from "./pages/Quiz";
const bottomNavbarPaths = [
  "/dashboard",
  "/reports",
  "/blogs",
  "/profile",
  "/blog/healthyliving",
  "/blog/diet",
  "/blog/suggest",
  "/blog/quest",
  "/blog/excercice",
  "/quiz"
];
function App() {
  const location = useLocation();

  return (
    <>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/signin" element={<Signin />} />
        <Route path="/blogs" element={<Blogs />} />
        <Route path="/blog/healthyliving" element={<Blog01 />} />
        <Route path="/blog/diet" element={<Blog02 />} />
        <Route path="/blog/suggest" element={<Blog055 />} />
        <Route path="/blog/quest" element={<Blog10 />} />
        <Route path="/blog/excercise" element={<Blog16 />} />

        <Route path="/UserSignup" element={<UserSignup />} />
        <Route path="/userInitialForm" element={<UserInitialForm />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/reports" element={<Reports />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/foodScan" element={<FoodScan />} />
        <Route path="/nutrients" element={<Nutrients />} />
        <Route path="/quiz" element={<Quiz />} />
      </Routes>
      {bottomNavbarPaths.includes(location.pathname) && <BottomNavBar />}
    </>
  );
}

export default App;
