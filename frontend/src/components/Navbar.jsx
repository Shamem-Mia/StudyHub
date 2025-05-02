import { useState, useEffect } from "react";
import {
  Menu,
  X,
  Home,
  RefreshCw,
  User,
  LogIn,
  Settings,
  LogOut,
  Info,
  Phone,
  ChevronDown,
  ChevronUp,
  BookOpen,
  GraduationCap,
  Notebook,
  Bookmark,
  FlaskConical,
  FileText,
  LibraryBig,
  UserPlus,
} from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { useAuthStore } from "../stores/useAuthStore";

const Navbar = () => {
  const { authUser, logout } = useAuthStore();
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
  const [isDesktopMenuOpen, setIsDesktopMenuOpen] = useState(false);
  const navigate = useNavigate();

  // Close sidebar when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      const sidebar = document.querySelector(".mobile-sidebar");
      const desktopMenu = document.querySelector(".desktop-menu");

      if (sidebar && !sidebar.contains(event.target)) {
        setIsMobileSidebarOpen(false);
      }

      if (desktopMenu && !desktopMenu.contains(event.target)) {
        // Check if we're clicking on the menu button
        const menuButton = document.querySelector(".desktop-menu-button");
        if (!menuButton?.contains(event.target)) {
          setIsDesktopMenuOpen(false);
        }
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isMobileSidebarOpen, isDesktopMenuOpen]);

  // Handle refresh button click
  const handleRefresh = () => {
    window.location.reload();
  };

  const NavLink = ({ to, icon, text, onClick, closeSidebar = false }) => (
    <Link
      to={to}
      className="text-gray-800 hover:text-blue-600 flex items-center p-2 rounded hover:bg-blue-50 transition-colors duration-200"
      onClick={() => {
        if (closeSidebar) {
          setIsMobileSidebarOpen(false);
        }
        onClick?.();
      }}
    >
      <span className="mr-3 text-blue-600">{icon}</span>
      <span className="font-medium">{text}</span>
    </Link>
  );

  return (
    <nav className="bg-slate-800 text-white shadow-lg sticky top-0 z-40">
      {/* Top Section - Logo and Main Navigation (visible on all screens) */}
      <div className="container mx-auto px-4 pt-3">
        <div className="flex justify-between items-start">
          {/* Left side - Logo and Name */}
          <div className="flex flex-row gap-5">
            <button
              onClick={handleRefresh}
              className="hidden sm:inline-block hover:text-blue-200 transition"
            >
              <RefreshCw className="h-6 w-6" />
            </button>

            <Link to="/" className="flex items-center space-x-2">
              <GraduationCap className="h-8 w-8 text-white" />
              <span className="text-2xl font-bold">StudyHub</span>
            </Link>
          </div>

          {/* Right side - Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-6 pt-1">
            <Link
              to="/profile"
              className="hover:text-blue-200 transition-colors duration-200"
            >
              Profile
            </Link>
            <Link
              to="/register"
              className="hover:text-blue-200 transition-colors duration-200"
            >
              Signup
            </Link>
            <button
              onClick={() => setIsDesktopMenuOpen(!isDesktopMenuOpen)}
              className="text-white hover:text-blue-200 transition-colors duration-200 flex items-center space-x-1 desktop-menu-button"
            >
              <span>Menu</span>
              {isDesktopMenuOpen ? (
                <ChevronDown className="h-5 w-5" />
              ) : (
                <ChevronUp className="h-5 w-5" />
              )}
            </button>
          </div>

          {/* Mobile Navigation (Icons only) */}
          <div className="flex md:hidden items-center space-x-4 pt-1">
            <Link
              to="/profile"
              className="hover:text-blue-200 transition-colors duration-200"
            >
              <User className="h-6 w-6" />
            </Link>
            <button
              onClick={handleRefresh}
              className="hover:text-blue-200 transition"
            >
              <RefreshCw className="h-6 w-6" />
            </button>
            <button
              onClick={() => setIsMobileSidebarOpen(true)}
              className="text-white focus:outline-none"
            >
              <Menu className="h-6 w-6" />
            </button>
          </div>
        </div>
      </div>

      {/* Middle Section - Lab Report, Note, Chowtha (different layout based on screen size) */}
      <div className="flex justify-center border-t border-blue-700 py-2">
        <div className="flex flex-col md:flex-row items-center space-y-2 md:space-y-0 md:space-x-8">
          {/* Mobile - Stack vertically */}
          <div className="md:hidden flex flex-col items-center space-y-2 w-full py-2">
            <div className="flex space-x-4">
              <Link
                to="/lab-reports"
                className="flex flex-col items-center hover:text-blue-200 transition-colors duration-200"
                onClick={() => setIsMobileSidebarOpen(false)}
              >
                <FlaskConical className="h-6 w-6" />
                <span className="text-sm mt-1">Lab Report</span>
              </Link>
              <Link
                to="/notes"
                className="flex flex-col items-center hover:text-blue-200 transition-colors duration-200"
                onClick={() => setIsMobileSidebarOpen(false)}
              >
                <FileText className="h-6 w-6" />
                <span className="text-sm mt-1">Note</span>
              </Link>
              <Link
                to="/chowtha"
                className="flex flex-col items-center hover:text-blue-200 transition-colors duration-200"
                onClick={() => setIsMobileSidebarOpen(false)}
              >
                <LibraryBig className="h-6 w-6" />
                <span className="text-sm mt-1">Chowtha</span>
              </Link>
            </div>
          </div>

          {/* Desktop - Show inline */}
          <div className="hidden md:flex items-center space-x-8">
            <Link
              to="/lab-reports"
              className="flex items-center hover:text-blue-200 transition-colors duration-200"
            >
              <FlaskConical className="h-5 w-5 mr-2" />
              <span>Lab Report</span>
            </Link>
            <Link
              to="/notes"
              className="flex items-center hover:text-blue-200 transition-colors duration-200"
            >
              <FileText className="h-5 w-5 mr-2" />
              <span>Note</span>
            </Link>
            <Link
              to="/chowtha"
              className="flex items-center hover:text-blue-200 transition-colors duration-200"
            >
              <LibraryBig className="h-5 w-5 mr-2" />
              <span>Chowtha</span>
            </Link>
          </div>
        </div>
      </div>

      {/* Desktop Menu Dropdown */}
      <div
        className={`hidden md:block absolute right-4 mt-1 w-56 bg-white rounded-md shadow-xl z-50 desktop-menu transition-all duration-300 ease-out ${
          isDesktopMenuOpen
            ? "opacity-100 translate-y-0"
            : "opacity-0 -translate-y-2 pointer-events-none"
        }`}
      >
        <div className="py-2">
          <div className="px-3 py-2 text-xs font-semibold text-gray-500 uppercase tracking-wider">
            Navigation
          </div>
          <NavLink
            to="/"
            icon={<Home size={18} />}
            text="Home"
            onClick={() => setIsDesktopMenuOpen(false)}
          />
          <NavLink
            to="/lab-reports"
            icon={<FlaskConical size={18} />}
            text="Lab Report"
            onClick={() => setIsDesktopMenuOpen(false)}
          />
          <NavLink
            to="/notes"
            icon={<FileText size={18} />}
            text="Note"
            onClick={() => setIsDesktopMenuOpen(false)}
          />
          <NavLink
            to="/chowtha"
            icon={<LibraryBig size={18} />}
            text="Chowtha"
            onClick={() => setIsDesktopMenuOpen(false)}
          />
          {authUser && authUser.role === "admin" ? (
            <NavLink
              to="/admin"
              icon={<LibraryBig size={18} />}
              text="Admin Deshboard"
              onClick={() => setIsDesktopMenuOpen(false)}
            />
          ) : (
            ""
          )}
          <button
            onClick={() => {
              handleRefresh();
              setIsDesktopMenuOpen(false);
            }}
            className="w-full text-gray-800 hover:text-blue-600 flex items-center p-2 rounded hover:bg-blue-50 transition-colors duration-200"
          >
            <RefreshCw size={18} className="mr-3 text-blue-600" />
            <span className="font-medium">Refresh</span>
          </button>

          <div className="border-t border-gray-100 my-2"></div>

          <div className="px-3 py-2 text-xs font-semibold text-gray-500 uppercase tracking-wider">
            Account
          </div>
          {authUser ? (
            <>
              <NavLink
                to="/profile"
                icon={<User size={18} />}
                text="Profile"
                onClick={() => setIsDesktopMenuOpen(false)}
              />
              <NavLink
                to="/settings"
                icon={<Settings size={18} />}
                text="Settings"
                onClick={() => setIsDesktopMenuOpen(false)}
              />
              <NavLink
                to="/register"
                icon={<UserPlus size={18} />}
                text="Sign up"
                onClick={() => setIsDesktopMenuOpen(false)}
              />
              <button
                onClick={() => {
                  logout(navigate);
                }}
                className="w-full text-gray-800 hover:text-blue-600 flex items-center p-2 rounded hover:bg-blue-50 transition-colors duration-200"
              >
                <LogOut size={18} className="mr-3 text-blue-600" />
                <span className="font-medium">Logout</span>
              </button>
            </>
          ) : (
            <>
              <NavLink
                to="/login"
                icon={<LogIn size={18} />}
                text="Login"
                onClick={() => setIsDesktopMenuOpen(false)}
              />
              <NavLink
                to="/register"
                icon={<UserPlus size={18} />}
                text="Signup"
                onClick={() => setIsDesktopMenuOpen(false)}
              />
            </>
          )}
        </div>
      </div>

      {/* Mobile Sidebar with transition */}
      <div
        className={`fixed inset-0 z-50 overflow-y-auto md:hidden transition-transform duration-300 ease-in-out ${
          isMobileSidebarOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        {isMobileSidebarOpen && (
          <>
            <div
              className="fixed inset-0 bg-black bg-opacity-50"
              onClick={() => setIsMobileSidebarOpen(false)}
            />
            <div className="fixed inset-y-0 right-0 w-64 bg-white shadow-xl mobile-sidebar">
              <div className="flex justify-between items-center p-4 border-b">
                <Link
                  to="/"
                  className="flex items-center space-x-2"
                  onClick={() => setIsMobileSidebarOpen(false)}
                >
                  <GraduationCap className="h-8 w-8 text-blue-800" />
                  <span className="text-xl font-bold text-gray-800">
                    StudyHub
                  </span>
                </Link>
                <button
                  onClick={() => setIsMobileSidebarOpen(false)}
                  className="text-gray-500 hover:text-gray-700"
                >
                  <X className="h-6 w-6" />
                </button>
              </div>

              <div className="p-4">
                <nav className="flex flex-col space-y-1">
                  <div className="px-2 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                    Navigation
                  </div>
                  <NavLink
                    to="/"
                    icon={<Home size={18} />}
                    text="Home"
                    closeSidebar={true}
                  />
                  <NavLink
                    to="/lab-reports"
                    icon={<FlaskConical size={18} />}
                    text="Lab Report"
                    closeSidebar={true}
                  />
                  <NavLink
                    to="/notes"
                    icon={<FileText size={18} />}
                    text="Note"
                    closeSidebar={true}
                  />
                  <NavLink
                    to="/chowtha"
                    icon={<LibraryBig size={18} />}
                    text="Chowtha"
                    closeSidebar={true}
                  />

                  {authUser && authUser.role === "admin" ? (
                    <NavLink
                      to="/admin"
                      icon={<LibraryBig size={18} />}
                      text="Admin Deshboard"
                      closeSidebar={true}
                    />
                  ) : (
                    ""
                  )}

                  <button
                    onClick={() => {
                      handleRefresh();
                      setIsMobileSidebarOpen(false);
                    }}
                    className="text-gray-800 hover:text-blue-600 flex items-center p-2 rounded hover:bg-blue-50 transition-colors duration-200"
                  >
                    <RefreshCw size={18} className="mr-3 text-blue-600" />
                    <span className="font-medium">Refresh</span>
                  </button>

                  <div className="border-t border-gray-100 my-2"></div>

                  <div className="px-2 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                    Account
                  </div>
                  {authUser ? (
                    <>
                      <NavLink
                        to="/profile"
                        icon={<User size={18} />}
                        text="Profile"
                        closeSidebar={true}
                      />
                      <NavLink
                        to="/settings"
                        icon={<Settings size={18} />}
                        text="Settings"
                        closeSidebar={true}
                      />
                      <button
                        onClick={() => {
                          logout(navigate);
                          setIsMobileSidebarOpen(false);
                        }}
                        className="text-gray-800 hover:text-blue-600 flex items-center p-2 rounded hover:bg-blue-50 transition-colors duration-200"
                      >
                        <LogOut size={18} className="mr-3 text-blue-600" />
                        <span className="font-medium">Logout</span>
                      </button>
                    </>
                  ) : (
                    <>
                      <NavLink
                        to="/login"
                        icon={<LogIn size={18} />}
                        text="Login"
                        closeSidebar={true}
                      />
                      <NavLink
                        to="/register"
                        icon={<LogIn size={18} />}
                        text="Signup"
                        closeSidebar={true}
                      />
                    </>
                  )}
                </nav>
              </div>
            </div>
          </>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
