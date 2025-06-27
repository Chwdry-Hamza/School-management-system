// 'use client';
// import { useState } from 'react';

// // Define TypeScript interfaces
// interface Course {
//   id: number;
//   title: string;
//   description: string;
//   image: string;
// }

// interface Subject {
//   name: string;
// }

// interface Semester {
//   number: number;
//   subjects: Subject[];
// }

// interface CourseCurriculum {
//   [key: number]: Semester[];
// }

// export default function Course() {
//   const courses: Course[] = [
//     {
//       id: 1,
//       title: 'BS Software Engineering',
//       description: 'Master the art of building robust software systems with cutting-edge technologies.',
//       image: 'https://images.unsplash.com/photo-1516321310762-479e93c1e78d?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=60',
//     },
//     {
//       id: 2,
//       title: 'BS Computer Science',
//       description: 'Dive deep into algorithms, data structures, and computer theory.',
//       image: 'https://images.unsplash.com/photo-1516321310762-479e93c1e78d?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=60',
//     },
//     {
//       id: 3,
//       title: 'BS English',
//       description: 'Explore literature, linguistics, and advanced communication skills.',
//       image: 'https://images.unsplash.com/photo-1507842217343-583bb7278c01?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=60',
//     },
//   ];

//   // Course-specific curricula
//   const courseCurricula: CourseCurriculum = {
//     1: [
//       { number: 1, subjects: [{ name: 'Introduction to Programming' }, { name: 'Calculus I' }, { name: 'Software Engineering Fundamentals' }, { name: 'English Composition' }] },
//       { number: 2, subjects: [{ name: 'Object-Oriented Programming' }, { name: 'Calculus II' }, { name: 'Discrete Structures' }, { name: 'Technical Writing' }] },
//       { number: 3, subjects: [{ name: 'Data Structures' }, { name: 'Software Design' }, { name: 'Linear Algebra' }, { name: 'Database Systems' }] },
//       { number: 4, subjects: [{ name: 'Operating Systems' }, { name: 'Software Testing' }, { name: 'Statistics' }, { name: 'Web Development' }] },
//       { number: 5, subjects: [{ name: 'Software Architecture' }, { name: 'Algorithms' }, { name: 'Project Management' }, { name: 'Mobile App Development' }] },
//       { number: 6, subjects: [{ name: 'Cloud Computing' }, { name: 'Software Quality Assurance' }, { name: 'Networking' }, { name: 'Ethics in Computing' }] },
//       { number: 7, subjects: [{ name: 'Capstone Project I' }, { name: 'Artificial Intelligence' }, { name: 'Distributed Systems' }, { name: 'Cybersecurity Basics' }] },
//       { number: 8, subjects: [{ name: 'Capstone Project II' }, { name: 'Machine Learning' }, { name: 'DevOps' }, { name: 'Professional Practices' }] },
//     ],
//     2: [
//       { number: 1, subjects: [{ name: 'Computer Programming' }, { name: 'Calculus I' }, { name: 'Physics I' }, { name: 'Introduction to CS' }] },
//       { number: 2, subjects: [{ name: 'Advanced Programming' }, { name: 'Calculus II' }, { name: 'Physics II' }, { name: 'Logic Design' }] },
//       { number: 3, subjects: [{ name: 'Data Structures' }, { name: 'Algorithms' }, { name: 'Computer Organization' }, { name: 'Probability' }] },
//       { number: 4, subjects: [{ name: 'Operating Systems' }, { name: 'Theory of Computation' }, { name: 'Databases' }, { name: 'Discrete Math' }] },
//       { number: 5, subjects: [{ name: 'Computer Networks' }, { name: 'Software Engineering' }, { name: 'Compilers' }, { name: 'Linear Algebra' }] },
//       { number: 6, subjects: [{ name: 'Artificial Intelligence' }, { name: 'Machine Learning' }, { name: 'Parallel Computing' }, { name: 'Ethics' }] },
//       { number: 7, subjects: [{ name: 'Capstone Project I' }, { name: 'Cryptography' }, { name: 'Distributed Systems' }, { name: 'Data Science' }] },
//       { number: 8, subjects: [{ name: 'Capstone Project II' }, { name: 'Quantum Computing' }, { name: 'Big Data' }, { name: 'Advanced Algorithms' }] },
//     ],
//     3: [
//       { number: 1, subjects: [{ name: 'Introduction to Literature' }, { name: 'English Grammar' }, { name: 'Writing Skills' }, { name: 'World History' }] },
//       { number: 2, subjects: [{ name: 'British Literature' }, { name: 'Creative Writing' }, { name: 'Linguistics' }, { name: 'Communication Skills' }] },
//       { number: 3, subjects: [{ name: 'American Literature' }, { name: 'Phonetics' }, { name: 'Literary Theory' }, { name: 'Public Speaking' }] },
//       { number: 4, subjects: [{ name: 'World Literature' }, { name: 'Sociolinguistics' }, { name: 'Drama Studies' }, { name: 'Technical Writing' }] },
//       { number: 5, subjects: [{ name: 'Postcolonial Literature' }, { name: 'Semantics' }, { name: 'Poetry Analysis' }, { name: 'Media Studies' }] },
//       { number: 6, subjects: [{ name: 'Modern Fiction' }, { name: 'Pragmatics' }, { name: 'Shakespeare' }, { name: 'Journalism' }] },
//       { number: 7, subjects: [{ name: 'Thesis Writing I' }, { name: 'Literary Criticism' }, { name: 'Translation Studies' }, { name: 'Cultural Studies' }] },
//       { number: 8, subjects: [{ name: 'Thesis Writing II' }, { name: 'Advanced Linguistics' }, { name: 'Contemporary Literature' }, { name: 'Professional Editing' }] },
//     ],
//   };

//   // State for modal
//   const [isModalOpen, setIsModalOpen] = useState(false);
//   const [selectedCourse, setSelectedCourse] = useState<Course | null>(null);

//   // Open modal and set selected course
//   const openModal = (course: Course) => {
//     setSelectedCourse(course);
//     setIsModalOpen(true);
//   };

//   // Close modal
//   const closeModal = () => {
//     setIsModalOpen(false);
//     setSelectedCourse(null);
//   };

//   return (
//     <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-200 py-16 px-4 sm:px-6 lg:px-8">
//       {/* Header Section */}
//       <div className="max-w-7xl mx-auto text-center mb-16">
//         <h1 className="text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-purple-600 mb-4">
//           Discover Our Programs
//         </h1>
//         <p className="text-lg text-gray-600 max-w-2xl mx-auto">
//           Unlock your potential with our world-class academic programs designed for future leaders.
//         </p>
//       </div>

//       {/* Courses Grid */}
//       <div className="max-w-7xl mx-auto">
//         <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
//           {courses.map((course) => (
//             <div
//               key={course.id}
//               className="relative bg-white rounded-2xl shadow-xl overflow-hidden transform transition-all duration-500 hover:-translate-y-2 hover:shadow-2xl"
//             >
//               {/* Course Image */}
//               <div className="h-48 w-full overflow-hidden">
//                 <img
//                   src={course.image}
//                   alt={course.title}
//                   className="w-full h-full object-cover transform transition-transform duration-500 hover:scale-110"
//                 />
//               </div>
//               {/* Gradient Overlay */}
//               <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent pointer-events-none"></div>

//               {/* Course Content */}
//               <div className="p-6 relative z-10">
//                 <h2 className="text-2xl font-bold text-gray-900 mb-3">{course.title}</h2>
//                 <p className="text-gray-700 text-sm mb-4 line-clamp-3">{course.description}</p>
//                 <button
//                   onClick={() => openModal(course)}
//                   className="mt-4 px-6 py-2 bg-gradient-to-r from-indigo-500 to-purple-500 text-white font-medium rounded-lg hover:from-indigo-600 hover:to-purple-600 hover:shadow-lg transition-all duration-300"
//                 >
//                   Details
//                 </button>
//               </div>
//               {/* Decorative Element */}
//               <div className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-indigo-500 to-purple-500"></div>
//             </div>
//           ))}
//         </div>
//       </div>

//       {/* Modal */}
//       {isModalOpen && selectedCourse && (
//         <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
//           <div className="bg-white rounded-2xl max-w-4xl w-full mx-4 max-h-[90vh] overflow-y-auto shadow-2xl transform transition-all duration-300 scale-100">
//             {/* Modal Header */}
//             <div className="p-6 border-b border-gray-200 flex justify-between items-center bg-gradient-to-r from-indigo-50 to-purple-50">
//               <h2 className="text-2xl font-bold text-gray-900">{selectedCourse.title} - Curriculum</h2>
//               <button
//                 onClick={closeModal}
//                 className="text-gray-600 hover:text-gray-900 text-2xl font-bold focus:outline-none"
//               >
//                 ×
//               </button>
//             </div>

//             {/* Modal Body */}
//             <div className="p-6">
//               <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//                 {courseCurricula[selectedCourse.id].map((semester) => (
//                   <div
//                     key={semester.number}
//                     className="bg-gray-50 rounded-xl p-4 shadow-md hover:shadow-lg transition-shadow duration-300"
//                   >
//                     <h3 className="text-lg font-semibold text-indigo-600 mb-3">
//                       Semester {semester.number}
//                     </h3>
//                     <ul className="space-y-2">
//                       {semester.subjects.map((subject, index) => (
//                         <li
//                           key={index}
//                           className="flex items-center text-gray-700 text-sm"
//                         >
//                           <span className="w-2 h-2 bg-purple-500 rounded-full mr-2"></span>
//                           {subject.name}
//                         </li>
//                       ))}
//                     </ul>
//                   </div>
//                 ))}
//               </div>
//             </div>

//             {/* Modal Footer */}
//             <div className="p-6 border-t border-gray-200 flex justify-end">
//               <button
//                 onClick={closeModal}
//                 className="px-6 py-2 bg-gray-600 text-white font-medium rounded-lg hover:bg-gray-700 transition-all duration-300"
//               >
//                 Close
//               </button>
//             </div>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// } 
'use client';
import { useState, useEffect } from 'react';
import axios from 'axios';

// Define TypeScript interfaces
interface Subject {
  name: string;
}

interface Semester {
  number: number;
  subjects: Subject[];
}

interface Course {
  _id: string;
  title: string;
  description: string;
  image: string;
  semesters: Semester[];
}

export default function Course() {
  const [courses, setCourses] = useState<Course[]>([]);
  const [isAddCourseModalOpen, setIsAddCourseModalOpen] = useState(false);
  const [isAddSemesterModalOpen, setIsAddSemesterModalOpen] = useState(false);
  const [isAddSubjectModalOpen, setIsAddSubjectModalOpen] = useState(false);
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
  const [selectedCourse, setSelectedCourse] = useState<Course | null>(null);
  const [newCourse, setNewCourse] = useState({ title: '', description: '', image: null as File | null });
  const [newSemester, setNewSemester] = useState({ number: '', courseId: '' });
  const [newSubject, setNewSubject] = useState({ name: '', courseId: '', semesterNumber: '' });
  const [previewImage, setPreviewImage] = useState<string | null>(null);

  // Fetch courses on mount
  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const response = await axios.get('https://backend-sms-chi.vercel.app/course');
        setCourses(response.data.courses);
      } catch (err) {
        console.error('Error fetching courses:', err);
      }
    };
    fetchCourses();
  }, []);

  // Handle image upload
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setNewCourse({ ...newCourse, image: file });
      const reader = new FileReader();
      reader.onloadend = () => setPreviewImage(reader.result as string);
      reader.readAsDataURL(file);
    }
  };

  // Add new course
  const handleAddCourse = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const formData = new FormData();
      formData.append('title', newCourse.title);
      formData.append('description', newCourse.description);
      if (newCourse.image) formData.append('image', newCourse.image);

      const response = await axios.post('https://backend-sms-chi.vercel.app/course', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      setCourses([...courses, response.data.newCourse]);
      setIsAddCourseModalOpen(false);
      setNewCourse({ title: '', description: '', image: null });
      setPreviewImage(null);
    } catch (err) {
      console.error('Error adding course:', err);
    }
  };

  // Delete course
  const handleDeleteCourse = async (courseId: string) => {
    if (confirm('Are you sure you want to delete this course?')) {
      try {
        await axios.delete(`https://backend-sms-chi.vercel.app/course/${courseId}`);
        setCourses(courses.filter((course) => course._id !== courseId));
        if (selectedCourse?._id === courseId) {
          setIsDetailsModalOpen(false);
          setSelectedCourse(null);
        }
      } catch (err) {
        console.error('Error deleting course:', err);
      }
    }
  };

  // Add new semester
  const handleAddSemester = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await axios.post(`https://backend-sms-chi.vercel.app/course/${newSemester.courseId}/semesters`, {
        number: parseInt(newSemester.number),
        subjects: [],
      });
      setCourses(courses.map((course) =>
        course._id === newSemester.courseId ? response.data.updatedCourse : course
      ));
      if (selectedCourse?._id === newSemester.courseId) {
        setSelectedCourse(response.data.updatedCourse);
      }
      setIsAddSemesterModalOpen(false);
      setNewSemester({ number: '', courseId: '' });
    } catch (err) {
      console.error('Error adding semester:', err);
    }
  };

  // Delete semester
  const handleDeleteSemester = async (courseId: string, semesterNumber: number) => {
    if (confirm(`Are you sure you want to delete Semester ${semesterNumber}?`)) {
      try {
        const response = await axios.delete(`https://backend-sms-chi.vercel.app/course/${courseId}/semesters/${semesterNumber}`);
        setCourses(courses.map((course) =>
          course._id === courseId ? response.data.updatedCourse : course
        ));
        if (selectedCourse?._id === courseId) {
          setSelectedCourse(response.data.updatedCourse);
        }
      } catch (err) {
        console.error('Error deleting semester:', err);
      }
    }
  };

  // Add new subject
  const handleAddSubject = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await axios.post(
        `https://backend-sms-chi.vercel.app/course/${newSubject.courseId}/semesters/${newSubject.semesterNumber}/subjects`,
        { name: newSubject.name }
      );
      setCourses(courses.map((course) =>
        course._id === newSubject.courseId ? response.data.updatedCourse : course
      ));
      if (selectedCourse?._id === newSubject.courseId) {
        setSelectedCourse(response.data.updatedCourse);
      }
      setIsAddSubjectModalOpen(false);
      setNewSubject({ name: '', courseId: '', semesterNumber: '' });
    } catch (err) {
      console.error('Error adding subject:', err);
    }
  };

  // Delete subject
  const handleDeleteSubject = async (courseId: string, semesterNumber: number, subjectIndex: number) => {
    if (confirm('Are you sure you want to delete this subject?')) {
      try {
        const response = await axios.delete(
          `https://backend-sms-chi.vercel.app/course/${courseId}/semesters/${semesterNumber}/subjects/${subjectIndex}`
        );
        setCourses(courses.map((course) =>
          course._id === courseId ? response.data.updatedCourse : course
        ));
        if (selectedCourse?._id === courseId) {
          setSelectedCourse(response.data.updatedCourse);
        }
      } catch (err) {
        console.error('Error deleting subject:', err);
      }
    }
  };

  // Open modals
  const openAddCourseModal = () => setIsAddCourseModalOpen(true);
  const openAddSemesterModal = (courseId: string) => {
    setNewSemester({ number: '', courseId });
    setIsAddSemesterModalOpen(true);
  };
  const openAddSubjectModal = (courseId: string, semesterNumber: string) => {
    console.log('Opening Add Subject Modal for', courseId, semesterNumber); // Debugging
    setNewSubject({ name: '', courseId, semesterNumber });
    setIsAddSubjectModalOpen(true);
  };
  const openDetailsModal = (course: Course) => {
    setSelectedCourse(course);
    setIsDetailsModalOpen(true);
  };

  // Close modals
  const closeAddCourseModal = () => {
    setIsAddCourseModalOpen(false);
    setNewCourse({ title: '', description: '', image: null });
    setPreviewImage(null);
  };
  const closeAddSemesterModal = () => {
    setIsAddSemesterModalOpen(false);
    setNewSemester({ number: '', courseId: '' });
  };
  const closeAddSubjectModal = () => {
    setIsAddSubjectModalOpen(false);
    setNewSubject({ name: '', courseId: '', semesterNumber: '' });
  };
  const closeDetailsModal = () => {
    setIsDetailsModalOpen(false);
    setSelectedCourse(null);
  };

  return (
    <div className="h-auto bg-gradient-to-b from-gray-50 to-gray-200 py-16 px-4 sm:px-6 lg:px-8">
      {/* Header Section */}
      <div className="max-w-7xl mx-auto text-center mb-16">
       <h1 className="text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-purple-600 mb-4 leading-tight tracking-tight">
  Discover Our Programs
</h1>
        <p className="text-lg text-gray-600 max-w-2xl mx-auto">
          Unlock your potential with our world-class academic programs designed for future leaders.
        </p>
        <button
          onClick={openAddCourseModal}
          className="mt-4 px-6 py-2 bg-gradient-to-r from-indigo-500 to-purple-500 text-white font-medium rounded-lg hover:from-indigo-600 hover:to-purple-600 hover:shadow-lg transition-all duration-300"
        >
          Add Course
        </button>
      </div>

      {/* Courses Grid */}
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {courses.map((course) => (
            <div
              key={course._id}
              className="relative bg-white rounded-2xl shadow-xl overflow-hidden transform transition-all duration-500 hover:-translate-y-2 hover:shadow-2xl"
            >
              {/* Course Image */}
              <div className="h-48 w-full overflow-hidden">
                <img
                  src={course.image || 'https://via.placeholder.com/500/cccccc/969696?text=No+Image'}
                  alt={course.title}
                  className="w-full h-full object-cover transform transition-transform duration-500 hover:scale-110"
                />
              </div>
              {/* Gradient Overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent pointer-events-none"></div>

              {/* Course Content */}
              <div className="p-6 relative z-10">
                <h2 className="text-2xl font-bold text-gray-900 mb-3">{course.title}</h2>
                <p className="text-gray-700 text-sm mb-4 line-clamp-3">{course.description}</p>
                <div className="flex space-x-2">
                  <button
                    onClick={() => openDetailsModal(course)}
                    className="px-4 py-2 bg-gradient-to-r from-indigo-500 to-purple-500 text-white font-medium rounded-lg hover:from-indigo-600 hover:to-purple-600 hover:shadow-lg transition-all duration-300"
                  >
                    Details
                  </button>
                  <button
                    onClick={() => openAddSemesterModal(course._id)}
                    className="px-4 py-2 bg-green-500 text-white font-medium rounded-lg hover:bg-green-600 transition-all duration-300"
                  >
                    Add Semester
                  </button>
                  <button
                    onClick={() => handleDeleteCourse(course._id)}
                    className="px-4 py-2 bg-red-500 text-white font-medium rounded-lg hover:bg-red-600 transition-all duration-300"
                  >
                    Delete
                  </button>
                </div>
              </div>
              {/* Decorative Element */}
              <div className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-indigo-500 to-purple-500"></div>
            </div>
          ))}
        </div>
      </div>

      {/* Add Course Modal */}
      {isAddCourseModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl max-w-md w-full mx-4 p-6 shadow-2xl">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-2xl font-bold text-gray-900">Add Course</h2>
              <button onClick={closeAddCourseModal} className="text-gray-600 hover:text-gray-900 text-2xl font-bold">
                ×
              </button>
            </div>
            <form onSubmit={handleAddCourse} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Title</label>
                <input
                  type="text"
                  value={newCourse.title}
                  onChange={(e) => setNewCourse({ ...newCourse, title: e.target.value })}
                  className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Description</label>
                <textarea
                  value={newCourse.description}
                  onChange={(e) => setNewCourse({ ...newCourse, description: e.target.value })}
                  className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Image</label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="mt-1 block w-full border-gray-300 rounded-md shadow-sm"
                  required
                />
                {previewImage && (
                  <img
                    src={previewImage}
                    alt="Preview"
                    className="mt-2 w-32 h-32 object-cover rounded-md"
                  />
                )}
              </div>
              <div className="flex justify-end">
                <button
                  type="submit"
                  className="px-6 py-2 bg-indigo-500 text-white font-medium rounded-lg hover:bg-indigo-600 transition-all duration-300"
                >
                  Save
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Add Semester Modal */}
      {isAddSemesterModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl max-w-md w-full mx-4 p-6 shadow-2xl">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-2xl font-bold text-gray-900">Add Semester</h2>
              <button onClick={closeAddSemesterModal} className="text-gray-600 hover:text-gray-900 text-2xl font-bold">
                ×
              </button>
            </div>
            <form onSubmit={handleAddSemester} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Semester Number</label>
                <input
                  type="number"
                  value={newSemester.number}
                  onChange={(e) => setNewSemester({ ...newSemester, number: e.target.value })}
                  className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                  required
                />
              </div>
              <div className="flex justify-end">
                <button
                  type="submit"
                  className="px-6 py-2 bg-green-500 text-white font-medium rounded-lg hover:bg-green-600 transition-all duration-300"
                >
                  Save
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Add Subject Modal */}
      {isAddSubjectModalOpen && (
    <div
    className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[60] pt-10 add-subject-modal"
    onClick={(e) => e.target === e.currentTarget && closeAddSubjectModal()}
  >
    <div className="bg-white rounded-2xl max-w-md w-full mx-4 p-6 shadow-2xl max-h-[80vh] overflow-y-auto">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold text-gray-900">Add Subject</h2>
        <button onClick={closeAddSubjectModal} className="text-gray-600 hover:text-gray-900 text-2xl font-bold">
          ×
        </button>
      </div>
      <form onSubmit={handleAddSubject} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">Subject Name</label>
          <input
            type="text"
            value={newSubject.name}
            onChange={(e) => setNewSubject({ ...newSubject, name: e.target.value })}
            className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
            required
          />
        </div>
        <div className="flex justify-end">
          <button
            type="submit"
            className="px-6 py-2 bg-green-500 text-white font-medium rounded-lg hover:bg-green-600 transition-all duration-300"
          >
            Save
          </button>
        </div>
      </form>
    </div>
  </div>
      )}

      {/* Details Modal */}
      {isDetailsModalOpen && selectedCourse && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl max-w-4xl w-full mx-4 max-h-[90vh] overflow-y-auto shadow-2xl transform transition-all duration-300 scale-100">
            <div className="p-6 border-b border-gray-200 flex justify-between items-center bg-gradient-to-r from-indigo-50 to-purple-50">
              <h2 className="text-2xl font-bold text-gray-900">{selectedCourse.title} - Curriculum</h2>
              <button
                onClick={closeDetailsModal}
                className="text-gray-600 hover:text-gray-900 text-2xl font-bold focus:outline-none"
              >
                ×
              </button>
            </div>
            <div className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                {selectedCourse.semesters.map((semester) => (
                  <div
                    key={semester.number}
                    className="bg-gray-50 rounded-xl p-4 shadow-md hover:shadow-lg transition-shadow duration-300"
                  >
                    <div className="flex justify-between items-center mb-3">
                      <h3 className="text-lg font-semibold text-indigo-600">
                        Semester {semester.number}
                      </h3>
                      <div className="flex space-x-2">
                        <button
                          onClick={() => openAddSubjectModal(selectedCourse._id, semester.number.toString())}
                          className="px-3 py-1 bg-blue-500 text-white font-medium rounded-lg hover:bg-blue-600 transition-all duration-300"
                        >
                          Add Subject
                        </button>
                        <button
                          onClick={() => handleDeleteSemester(selectedCourse._id, semester.number)}
                          className="px-3 py-1 bg-red-500 text-white font-medium rounded-lg hover:bg-red-600 transition-all duration-300"
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                    <ul className="space-y-2">
                      {semester.subjects.map((subject, index) => (
                        <li
                          key={index}
                          className="flex items-center justify-between text-gray-700 text-sm"
                        >
                          <div className="flex items-center">
                            <span className="w-2 h-2 bg-purple-500 rounded-full mr-2"></span>
                            {subject.name}
                          </div>
                          <button
                            onClick={() => handleDeleteSubject(selectedCourse._id, semester.number, index)}
                            className="px-2 py-1 bg-red-500 text-white font-medium rounded-lg hover:bg-red-600 transition-all duration-300 text-xs"
                          >
                            Delete
                          </button>
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </div>
            <div className="p-6 border-t border-gray-200 flex justify-end">
              <button
                onClick={closeDetailsModal}
                className="px-6 py-2 bg-gray-600 text-white font-medium rounded-lg hover:bg-gray-700 transition-all duration-300"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Custom CSS for Modal Positioning */}
      <style jsx global>{`
        .add-subject-modal {
          z-index: 60 !important;
          top: 2.5rem !important; /* Matches pt-10 */
        }
      `}</style>
    </div>
  );
}