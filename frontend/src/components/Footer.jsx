import React from "react";
import { Link } from "react-router-dom";
import {
  Facebook,
  Twitter,
  Instagram,
  Linkedin,
  Youtube,
  Mail,
  Phone,
  MapPin,
} from "lucide-react";

const Footer = () => {
  return (
    <footer className="bg-gray-900 text-white pt-12 pb-6">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {/* Company Info */}
          <div className="space-y-4">
            <div className=" flex flex-row gap-3">
              <img
                src="/studyhub.png"
                alt="StudyHub"
                className="h-10 w-10 rounded-full"
              />
              <h3 className="text-2xl font-bold text-orange-500">StudyHub</h3>
            </div>
            <p className="text-gray-300">
              Get help from StudyHub.A study helpline platform.
            </p>
            <div className="flex space-x-4">
              <a
                href="https://www.facebook.com/sa.shamem.7"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-300 hover:text-orange-500 transition"
              >
                <Facebook size={20} />
              </a>
              <a
                href="https://www.facebook.com/sa.shamem.7"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-300 hover:text-orange-500 transition"
              >
                <Twitter size={20} />
              </a>
              <a
                href="https://www.facebook.com/sa.shamem.7"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-300 hover:text-orange-500 transition"
              >
                <Instagram size={20} />
              </a>
              <a
                href="https://www.facebook.com/sa.shamem.7"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-300 hover:text-orange-500 transition"
              >
                <Linkedin size={20} />
              </a>
              <a
                href="https://youtube.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-300 hover:text-orange-500 transition"
              >
                <Youtube size={20} />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-lg font-semibold mb-4 border-b border-orange-500 pb-2">
              Quick Links
            </h4>
            <ul className="space-y-2">
              <li>
                <Link
                  to="/"
                  className="text-gray-300 hover:text-orange-500 transition"
                >
                  Home
                </Link>
              </li>
              <li>
                <Link
                  to="/about"
                  className="text-gray-300 hover:text-orange-500 transition"
                >
                  About Us
                </Link>
              </li>
              <li>
                <Link
                  to="/note"
                  className="text-gray-300 hover:text-orange-500 transition"
                >
                  Note
                </Link>
              </li>
              <li>
                <Link
                  to="/about"
                  className="text-gray-300 hover:text-orange-500 transition"
                >
                  How It Works
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h4 className="text-lg font-semibold mb-4 border-b border-orange-500 pb-2">
              Contact Us
            </h4>
            <ul className="space-y-3">
              <li className="flex items-start space-x-2">
                <MapPin className="text-orange-500 mt-1" size={18} />
                <span className="text-gray-300">
                  Chittagong University of Engineering and Technology (CUET)
                  campus
                </span>
              </li>
              <li className="flex items-center space-x-2">
                <Mail className="text-orange-500" size={18} />
                <a
                  href="mailto:contact@hut.com"
                  className="text-gray-300 hover:text-orange-500 transition"
                >
                  shamemmiah2@gmail.com
                </a>
              </li>
              <li className="flex items-center space-x-2">
                <Phone className="text-orange-500" size={18} />
                <a
                  href="tel:01833123456"
                  className="text-gray-300 hover:text-orange-500 transition"
                >
                  01833*******
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-8 pt-6 border-t border-gray-700 flex flex-col md:flex-row justify-between items-center">
          <p className="text-gray-400 text-sm mb-2 md:mb-0">
            &copy; {new Date().getFullYear()} StudyHub. get all in one.
          </p>
          <div className="flex space-x-4">
            <Link
              to="/privacy-policy"
              className="text-gray-400 hover:text-orange-500 text-sm transition"
            >
              Privacy Policy
            </Link>
            <Link
              to="/terms-of-service"
              className="text-gray-400 hover:text-orange-500 text-sm transition"
            >
              Terms of Service
            </Link>
            <Link
              to="/sitemap"
              className="text-gray-400 hover:text-orange-500 text-sm transition"
            >
              Sitemap
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
