'use client'; // Mark as client component for interactivity

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { NextPage } from 'next';

// Interfaces for TypeScript
interface Student {
  id: string;
  firstName: string;
  lastName: string;
  department: string;
  semester: number;
  profilePhoto: string; // Added profilePhoto field
}

interface AttendanceRecord {
  student_id: string;
  status: 'Present' | 'Absent' | 'Late' | 'Excused';
}

const AttendancePage: NextPage = () => {
  // State management
  const [departments, setDepartments] = useState<string[]>([]);
  const [selectedDepartment, setSelectedDepartment] = useState<string>('');
  const [selectedSemester, setSelectedSemester] = useState<string>('');
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [students, setStudents] = useState<Student[]>([]);
  const [attendance, setAttendance] = useState<AttendanceRecord[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [successMessage, setSuccessMessage] = useState<string>('');

  // Fetch departments on component mount
  useEffect(() => {
    const fetchDepartments = async () => {
      try {
        const response = await axios.get('https://backend-sms-chi.vercel.app/course');
        let courseTitles: string[] = [];
        if (Array.isArray(response.data)) {
          courseTitles = response.data.map((course: { title: string }) => course.title);
        } else if (response.data.courses && Array.isArray(response.data.courses)) {
          courseTitles = response.data.courses.map((course: { title: string }) => course.title);
        } else {
          console.error('Unexpected response format:', response.data);
        }
        setDepartments(courseTitles);
      } catch (error) {
        console.error('Error fetching departments:', error);
        setDepartments([]);
      }
    };
    fetchDepartments();
  }, []);

  // Fetch students when department and semester are selected
  useEffect(() => {
    if (selectedDepartment && selectedSemester) {
      const fetchStudents = async () => {
        setLoading(true);
        try {
          const response = await axios.get('https://backend-sms-chi.vercel.app/student');
          if (Array.isArray(response.data.studentData)) {
            const filteredStudents: Student[] = response.data.studentData
              .filter(
                (student: any) =>
                  student.department === selectedDepartment &&
                  student.semester.toString() === selectedSemester
              )
              .map((student: any) => ({
                id: student._id,
                firstName: student.firstName || 'N/A',
                lastName: student.lastName || 'N/A',
                department: student.department || 'N/A',
                semester: student.semester || 0,
                profilePhoto: student.profilePhoto || '', // Added profilePhoto mapping
              }));
            setStudents(filteredStudents);
            // Initialize attendance with "Present" as default
            setAttendance(
              filteredStudents.map((student) => ({
                student_id: student.id,
                status: 'Present' as const,
              }))
            );
          } else {
            console.error('Expected an array in studentData but received:', response.data);
            setStudents([]);
            setAttendance([]);
          }
        } catch (error) {
          console.error('Error fetching students:', error);
          setStudents([]);
          setAttendance([]);
        } finally {
          setLoading(false);
        }
      };
      fetchStudents();
    } else {
      setStudents([]);
      setAttendance([]);
    }
  }, [selectedDepartment, selectedSemester]);

  // Handle status change for a student
  const handleStatusChange = (student_id: string, status: 'Present' | 'Absent' | 'Late' | 'Excused') => {
    setAttendance((prev) =>
      prev.map((record) =>
        record.student_id === student_id ? { ...record, status } : record
      )
    );
  };

  // Handle DatePicker change
  const handleDateChange = (date: Date | null) => {
    if (date) {
      setSelectedDate(date);
    }
  };

  // Save attendance
  const handleSaveAttendance = async () => {
    try {
      await axios.post('https://backend-sms-chi.vercel.app/attendance', {
        department: selectedDepartment,
        semester: selectedSemester,
        date: selectedDate.toISOString().split('T')[0],
        attendance,
      });
      console.log('Saving attendance:', { selectedDepartment, selectedSemester, date: selectedDate, attendance });
      setSuccessMessage('Attendance saved successfully!');
      setTimeout(() => setSuccessMessage(''), 3000);
    } catch (error) {
      console.error('Error saving attendance:', error);
      alert('Failed to save attendance.');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-gray-100 p-6">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <h1 className="text-4xl font-extrabold text-gray-800 mb-8 text-center">
          Mark Attendance
        </h1>

        {/* Card for inputs */}
        <div className="bg-white shadow-2xl rounded-xl p-8 mb-8 border border-gray-200">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Department Selector */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Select Department
              </label>
              <select
                value={selectedDepartment}
                onChange={(e) => setSelectedDepartment(e.target.value)}
                className="block w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition duration-200"
              >
                <option value="">Select a department</option>
                {departments.map((department) => (
                  <option key={department} value={department}>
                    {department}
                  </option>
                ))}
              </select>
            </div>

            {/* Semester Selector */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Select Semester
              </label>
              <select
                value={selectedSemester}
                onChange={(e) => setSelectedSemester(e.target.value)}
                className="block w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition duration-200"
              >
                <option value="">Select a semester</option>
                {[...Array(8)].map((_, index) => (
                  <option key={index + 1} value={index + 1}>
                    Semester {index + 1}
                  </option>
                ))}
              </select>
            </div>

            {/* Date Picker */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Select Date
              </label>
              <DatePicker
                selected={selectedDate}
                onChange={handleDateChange}
                className="block w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition duration-200"
                dateFormat="yyyy-MM-dd"
              />
            </div>
          </div>
        </div>

        {/* Student List */}
        {loading ? (
          <div className="text-center text-gray-600 animate-pulse">
            Loading students...
          </div>
        ) : selectedDepartment && selectedSemester && students.length > 0 ? (
          <div className="bg-white shadow-2xl rounded-xl p-8 border border-gray-200">
            <h2 className="text-2xl font-semibold text-gray-800 mb-6">Students</h2>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-indigo-50">
                  <tr>
                    <th className="px-6 py-4 text-left text-sm font-medium text-gray-700 uppercase tracking-wider">
                      Profile Photo
                    </th>
                    <th className="px-6 py-4 text-left text-sm font-medium text-gray-700 uppercase tracking-wider">
                      Student Name
                    </th>
                    <th className="px-6 py-4 text-left text-sm font-medium text-gray-700 uppercase tracking-wider">
                      Department
                    </th>
                    <th className="px-6 py-4 text-left text-sm font-medium text-gray-700 uppercase tracking-wider">
                      Semester
                    </th>
                    <th className="px-6 py-4 text-left text-sm font-medium text-gray-700 uppercase tracking-wider">
                      Status
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {students.map((student) => (
                    <tr key={student.id} className="hover:bg-gray-50 transition">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <img
                          src={student.profilePhoto || 'https://via.placeholder.com/50/cccccc/969696?text=No+Image'}
                          alt={`${student.firstName} ${student.lastName}`}
                          className="w-12 h-12 rounded-full object-cover border border-gray-300"
                          onError={(e) => {
                            e.currentTarget.src = 'https://via.placeholder.com/50/cccccc/969696?text=No+Image';
                          }}
                        />
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {student.firstName} {student.lastName}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {student.department}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {student.semester}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <select
                          value={attendance.find((a) => a.student_id === student.id)?.status || 'Present'}
                          onChange={(e) =>
                            handleStatusChange(student.id, e.target.value as 'Present' | 'Absent' | 'Late' | 'Excused')
                          }
                          className="p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-sm transition duration-200"
                        >
                          <option value="Present">Present</option>
                          <option value="Absent">Absent</option>
                          <option value="Late">Late</option>
                          <option value="Excused">Excused</option>
                        </select>
                      </td>
                    </tr>
                    ))}
                </tbody>
              </table>
            </div>

            {/* Save Button */}
            <div className="mt-8 flex justify-end">
              <button
                onClick={handleSaveAttendance}
                className="px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition duration-200"
              >
                Save Attendance
              </button>
            </div>
          </div>
        ) : (
          <div className="text-center text-gray-600 bg-white shadow-lg rounded-xl p-6">
            {selectedDepartment && selectedSemester
              ? 'No students found for this department and semester.'
              : 'Please select a department and semester.'}
          </div>
        )}

        {/* Success Message */}
        {successMessage && (
          <div className="fixed bottom-6 right-6 bg-green-500 text-white px-6 py-3 rounded-lg shadow-lg animate-fade-in">
            {successMessage}
          </div>
        )}
      </div>
    </div>
  );
};

export default AttendancePage;