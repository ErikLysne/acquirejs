import { Navigate, Route, Routes } from "react-router-dom";
import PostsPage from "../pages/PostsPage";
import UsersPage from "../pages/UserPage";

export default function PageRouter() {
  return (
    <Routes>
      <Route path="/posts" element={<PostsPage />} />
      <Route path="/user/:userId" element={<UsersPage />} />
      <Route path="*" element={<Navigate to="/posts" />} />
    </Routes>
  );
}
