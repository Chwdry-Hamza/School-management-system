'use client';
import { useState, useEffect } from 'react';
import axios from 'axios';

interface Student {
  id: string;
  name: string;
  email: string;
  gender: string;
  phone: string;
}

interface Teacher {
  id: string;
  name: string;
  email: string;
  gender: string;
  phone: string;
}

export default function AdminDashboard() {
  const [students, setStudents] = useState<Student[]>([]);
  const [teachers, setTeachers] = useState<Teacher[]>([]);
  const [isStudentModalOpen, setIsStudentModalOpen] = useState(false);
  const [isTeacherModalOpen, setIsTeacherModalOpen] = useState(false);

  // Fetch student data
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get('https://backend-sms-chi.vercel.app/student');
        console.log('Student Data:', response.data);
        if (Array.isArray(response.data.studentData)) {
          const mappedData: Student[] = response.data.studentData.map((item: any) => ({
            id: item._id,
            name: item.firstName,
            email: item.email,
            gender: item.gender || 'N/A',
            phone: item.phone || 'N/A',
          }));
          setStudents(mappedData);
          console.log('Students Length:', mappedData.length);
        } else {
          console.error('Expected an array in studentData but received:', response.data);
          setStudents([]);
        }
      } catch (error) {
        console.error('Error fetching student data:', error);
        setStudents([]);
      }
    };
    fetchData();
  }, []);

  // Fetch teacher data
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get('https://backend-sms-chi.vercel.app/teacher');
        console.log('Teacher Data:', response.data);
        if (Array.isArray(response.data.teacherData)) {
          const mappedData: Teacher[] = response.data.teacherData.map((item: any) => ({
            id: item._id,
            name: item.firstName,
            email: item.email,
            gender: item.gender || 'N/A',
            phone: item.phone || 'N/A',
          }));
          setTeachers(mappedData);
          console.log('Teachers Length:', mappedData.length);
        } else {
          console.error('Expected an array in TeacherData but received:', response.data);
          setTeachers([]);
        }
      } catch (error) {
        console.error('Error fetching Teacher data:', error);
        setTeachers([]);
      }
    };
    fetchData();
  }, []);

  // Open modals
  const openStudentModal = () => setIsStudentModalOpen(true);
  const openTeacherModal = () => setIsTeacherModalOpen(true);

  // Close modals
  const closeStudentModal = () => setIsStudentModalOpen(false);
  const closeTeacherModal = () => setIsTeacherModalOpen(false);

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-200 py-16 px-4 sm:px-6 lg:px-8">
      {/* Header Section */}
      <div className="max-w-7xl mx-auto text-center mb-16">
        <h1 className="text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-purple-600 mb-4">
          Admin Dashboard
        </h1>
        <p className="text-lg text-gray-600 max-w-2xl mx-auto">
          Manage and monitor the students and teachers in your institution with ease.
        </p>
      </div>

      {/* Dashboard Cards */}
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-8">
          {/* Students Card */}
          <div
            className="relative bg-white rounded-2xl shadow-xl overflow-hidden transform transition-all duration-500 hover:-translate-y-2 hover:shadow-2xl"
          >
            <div className="h-48 w-full overflow-hidden">
              <img
                src="https://images.unsplash.com/photo-1523240795612-9a054b0db644?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=60"
                alt="Students"
                className="w-full h-full object-cover transform transition-transform duration-500 hover:scale-110"
              />
            </div>
            <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent pointer-events-none"></div>
            <div className="p-6 relative z-10">
              <h2 className="text-2xl font-bold text-gray-900 mb-3">Total Students</h2>
              <p className="text-3xl font-semibold text-indigo-600">{students.length}</p>
              <button
                onClick={openStudentModal}
                className="mt-4 px-6 py-2 bg-gradient-to-r from-indigo-500 to-purple-500 text-white font-medium rounded-lg hover:from-indigo-600 hover:to-purple-600 hover:shadow-lg transition-all duration-300"
              >
                View Details
              </button>
            </div>
            <div className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-indigo-500 to-purple-500"></div>
          </div>

          {/* Teachers Card */}
          <div
            className="relative bg-white rounded-2xl shadow-xl overflow-hidden transform transition-all duration-500 hover:-translate-y-2 hover:shadow-2xl"
          >
            <div className="h-48 w-full overflow-hidden">
              <img
                src="https://images.unsplash.com/photo-1577896851231-70ef18881754?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=60"
                alt="Teachers"
                className="w-full h-full object-cover transform transition-transform duration-500 hover:scale-110"
              />
            </div>
            <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent pointer-events-none"></div>
            <div className="p-6 relative z-10">
              <h2 className="text-2xl font-bold text-gray-900 mb-3">Total Teachers</h2>
              <p className="text-3xl font-semibold text-indigo-600">{teachers.length}</p>
              <button
                onClick={openTeacherModal}
                className="mt-4 px-6 py-2 bg-gradient-to-r from-indigo-500 to-purple-500 text-white font-medium rounded-lg hover:from-indigo-600 hover:to-purple-600 hover:shadow-lg transition-all duration-300"
              >
                View Details
              </button>
            </div>
            <div className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-indigo-500 to-purple-500"></div>
          </div>
        </div>
      </div>

      {/* Student Details Modal */}
      {isStudentModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl max-w-4xl w-full mx-4 max-h-[90vh] overflow-y-auto shadow-2xl transform transition-all duration-300 scale-100">
            <div className="p-6 border-b border-gray-200 flex justify-between items-center bg-gradient-to-r from-indigo-50 to-purple-50">
              <h2 className="text-2xl font-bold text-gray-900">Student List</h2>
              <button
                onClick={closeStudentModal}
                className="text-gray-600 hover:text-gray-900 text-2xl font-bold focus:outline-none"
              >
                ×
              </button>
            </div>
            <div className="p-6">
              {students.length > 0 ? (
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Gender</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Phone</th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {students.map((student) => (
                        <tr key={student.id}>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{student.name}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{student.email}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{student.gender}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{student.phone}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <p className="text-gray-600">No students found.</p>
              )}
            </div>
            <div className="p-6 border-t border-gray-200 flex justify-end">
              <button
                onClick={closeStudentModal}
                className="px-6 py-2 bg-gray-600 text-white font-medium rounded-lg hover:bg-gray-700 transition-all duration-300"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Teacher Details Modal */}
      {isTeacherModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl max-w-4xl w-full mx-4 max-h-[90vh] overflow-y-auto shadow-2xl transform transition-all duration-300 scale-100">
            <div className="p-6 border-b border-gray-200 flex justify-between items-center bg-gradient-to-r from-indigo-50 to-purple-50">
              <h2 className="text-2xl font-bold text-gray-900">Teacher List</h2>
              <button
                onClick={closeTeacherModal}
                className="text-gray-600 hover:text-gray-900 text-2xl font-bold focus:outline-none"
              >
                ×
              </button>
            </div>
            <div className="p-6">
              {teachers.length > 0 ? (
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Gender</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Phone</th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {teachers.map((teacher) => (
                        <tr key={teacher.id}>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{teacher.name}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{teacher.email}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{teacher.gender}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{teacher.phone}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <p className="text-gray-600">No teachers found.</p>
              )}
            </div>
            <div className="p-6 border-t border-gray-200 flex justify-end">
              <button
                onClick={closeTeacherModal}
                className="px-6 py-2 bg-gray-600 text-white font-medium rounded-lg hover:bg-gray-700 transition-all duration-300"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}