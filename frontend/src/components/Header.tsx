import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { signOut } from "firebase/auth";
import { auth } from "../firebase";

type HeaderProps = {
  onSearch: (query: string) => void;
};

export const Header = ({ onSearch }: HeaderProps) => {
  const { currentUser } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await signOut(auth);
    navigate("/login");
  };

  return (
    <header className="app-header">
      <Link to="/" className="logo">
        CineSage
      </Link>
      <div className="search-bar">
        <input
          type="text"
          placeholder="Search for a movie..."
          onChange={(e) => onSearch(e.target.value)}
        />
      </div>
      <nav>
        {currentUser ? (
          <>
            {/* This should be visible ONLY when logged in */}
            <button
              onClick={() => navigate("/favorites")}
              className="nav-btn fav-btn"
            >
              My Favorites
            </button>
            <button
              onClick={() => navigate("/recommendations")}
              className="nav-btn foryou-btn"
            >
              For You
            </button>
            <button onClick={handleLogout} className="logout-btn">
              Logout
            </button>
          </>
        ) : (
          <>
            {/* This should be visible ONLY when logged out */}
            <Link to="/login" className="nav-btn foryou-btn">Login</Link>
            <Link to="/signup" className="nav-btn fav-btn">Sign Up</Link>
          </>
        )}
      </nav>
    </header>
  );
};
