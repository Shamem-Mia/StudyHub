import React, { useState } from "react";
import { Plus, Trash2 } from "lucide-react";

const CGPACalculator = () => {
  const [courses, setCourses] = useState([
    { id: 1, name: "", credit: 3, grade: "A+" },
  ]);
  const [cgpa, setCgpa] = useState(null);
  const [error, setError] = useState(null);

  const gradePoints = {
    "A+": 4.0,
    A: 3.75,
    "A-": 3.5,
    "B+": 3.25,
    B: 3.0,
    "B-": 2.75,
    "C+": 2.5,
    C: 2.25,
    D: 2.0,
    F: 0.0,
  };

  const addCourse = () => {
    setCourses([
      ...courses,
      {
        id: courses.length + 1,
        name: "",
        credit: 3,
        grade: "A+",
      },
    ]);
  };

  const removeCourse = (id) => {
    if (courses.length > 1) {
      setCourses(courses.filter((course) => course.id !== id));
    }
  };

  const updateCourse = (id, field, value) => {
    setCourses(
      courses.map((course) =>
        course.id === id ? { ...course, [field]: value } : course
      )
    );
  };

  const calculateCGPA = () => {
    let totalCredits = 0;
    let totalGradePoints = 0;
    let hasFailed = false;

    // Reset error state
    setError(null);

    courses.forEach((course) => {
      const credit = parseFloat(course.credit);
      const grade = course.grade.toUpperCase();

      // Check if grade is valid
      if (!(grade in gradePoints)) {
        setError("Invalid grade! Please use A+/A/A-/B+/B/B-/C+/C/D/F");
        return;
      }

      totalCredits += credit;

      // Special case for F grade (failed)
      if (grade === "F") {
        hasFailed = true;
      } else {
        totalGradePoints += credit * gradePoints[grade];
      }
    });

    // If there was an error, stop calculation
    if (error) return;

    if (hasFailed) {
      setCgpa(0.0);
    } else {
      const calculatedCGPA = totalGradePoints / totalCredits;
      setCgpa(calculatedCGPA.toFixed(3)); // 3 decimal places like your C version
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-center mb-8">CGPA Calculator</h1>

      {error && (
        <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-4">
          <p>{error}</p>
        </div>
      )}

      <div className="max-w-3xl mx-auto bg-white rounded-lg shadow-md p-6">
        <div className="space-y-4">
          {courses.map((course) => (
            <div
              key={course.id}
              className="grid grid-cols-12 gap-4 items-center"
            >
              <div className="col-span-5">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Course Name
                </label>
                <input
                  type="text"
                  value={course.name}
                  onChange={(e) =>
                    updateCourse(course.id, "name", e.target.value)
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                  placeholder="e.g. Computer Science"
                />
              </div>

              <div className="col-span-3">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Credit Hours
                </label>
                <select
                  value={course.credit}
                  onChange={(e) =>
                    updateCourse(course.id, "credit", e.target.value)
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                >
                  {[0.75, 1, 1.5, 2, 3, 4, 5].map((num) => (
                    <option key={num} value={num}>
                      {num}
                    </option>
                  ))}
                </select>
              </div>

              <div className="col-span-3">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Grade
                </label>
                <select
                  value={course.grade}
                  onChange={(e) =>
                    updateCourse(course.id, "grade", e.target.value)
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                >
                  {Object.keys(gradePoints).map((grade) => (
                    <option key={grade} value={grade}>
                      {grade}
                    </option>
                  ))}
                </select>
              </div>

              <div className="col-span-1 flex items-end">
                <button
                  onClick={() => removeCourse(course.id)}
                  className="text-red-500 hover:text-red-700 p-2"
                  disabled={courses.length <= 1}
                >
                  <Trash2 size={20} />
                </button>
              </div>
            </div>
          ))}

          <div className="flex justify-between mt-6">
            <button
              onClick={addCourse}
              className="flex items-center px-4 py-2 bg-blue-100 text-blue-700 rounded-md hover:bg-blue-200"
            >
              <Plus size={16} className="mr-2" />
              Add Course
            </button>

            <button
              onClick={calculateCGPA}
              className="px-6 py-2 bg-green-600 text-white rounded-md hover:bg-green-700"
            >
              Calculate CGPA
            </button>
          </div>

          {cgpa !== null && (
            <div className="mt-8 p-4 bg-gray-50 rounded-lg">
              <h2 className="text-xl font-semibold mb-2">Result</h2>
              {parseFloat(cgpa) === 0.0 ? (
                <>
                  <p className="text-2xl font-bold text-red-600">
                    Your CGPA: <span className="text-3xl">0.000</span>
                  </p>
                  <p className="mt-2 text-red-600">You have failed!</p>
                </>
              ) : (
                <>
                  <p className="text-2xl font-bold text-blue-600">
                    Congratulations!
                  </p>
                  <p className="text-2xl font-bold text-blue-600">
                    Your CGPA: <span className="text-3xl">{cgpa}</span>
                  </p>
                </>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CGPACalculator;
