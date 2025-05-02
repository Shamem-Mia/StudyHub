import { Link } from "react-router-dom";
import {
  Notebook,
  Presentation,
  BookOpenText,
  FlaskConical,
  CalendarCheck,
  Book,
} from "lucide-react";
import toast from "react-hot-toast";
import Advertisements from "./Advertisements";
import DateTimeDisplay from "./DateTimeDisplay";

const HomePageCards = () => {
  // Function to handle click with notification
  const handleCardClick = (cardName) => {
    toast.success(`Navigating to ${cardName}`, {
      position: "bottom-center",
      style: {
        background: "#3b82f6",
        color: "#fff",
      },
    });
  };

  const cards = [
    {
      name: "All Notes",
      icon: <Notebook className="w-6 h-6 text-blue-600" />,
      path: "/notes",
    },
    {
      name: "All Slides",
      icon: <Presentation className="w-6 h-6 text-blue-600" />,
      path: "/slides",
    },
    {
      name: "All Chowtha",
      icon: <BookOpenText className="w-6 h-6 text-blue-600" />,
      path: "/chowtha",
    },
    {
      name: "All Lab Reports",
      icon: <FlaskConical className="w-6 h-6 text-blue-600" />,
      path: "/lab-reports",
    },
    {
      name: "Previous Year Questions",
      icon: <CalendarCheck className="w-6 h-6 text-blue-600" />,
      path: "/pyq",
    },
    {
      name: "Books",
      icon: <Book className="w-6 h-6 text-blue-600" />,
      path: "/books",
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="flex flex-col lg:flex-row gap-6">
        {/* Cards Section - Takes 2/3 width on large screens */}
        <div className="w-full lg:w-2/3">
          <h1 className="text-2xl font-bold text-center mb-6 text-blue-800">
            Study Resources
          </h1>

          <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {cards.map((card, index) => (
              <Link
                to={card.path}
                key={index}
                onClick={() => handleCardClick(card.name)}
                className="block"
              >
                <div className="bg-white p-4 rounded-lg shadow-sm hover:shadow-md transition-shadow duration-200 border border-gray-200 hover:border-blue-300 flex flex-col items-center text-center h-full">
                  <div className="mb-3 p-2 bg-blue-50 rounded-full">
                    {card.icon}
                  </div>
                  <h2 className="text-lg font-semibold text-gray-800 mb-1">
                    {card.name}
                  </h2>
                  <p className="text-sm text-gray-500">
                    View {card.name.toLowerCase()}
                  </p>
                </div>
              </Link>
            ))}
          </div>
        </div>

        {/* Right Sidebar - Takes 1/3 width on large screens */}
        <div className="w-full lg:w-1/3 space-y-4">
          <DateTimeDisplay />
          <Advertisements />
        </div>
      </div>
    </div>
  );
};

export default HomePageCards;
