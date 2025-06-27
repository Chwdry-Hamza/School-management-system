'use client';
import { students, teachers } from '@/data/mockData';
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
  const [students, setStudents] = useState<Student[]>([]); // State for students
  const [teachers, setTeachers] = useState<Teacher[]>([]); // State for Teacher

  useEffect(() => {
    // Function to fetch student data
    const fetchData = async () => {
      try {
        const response = await axios.get('https://backend-sms-chi.vercel.app/student');
        console.log('Student Data:', response.data);
        if (Array.isArray(response.data.studentData)) {
          const mappedData: Student[] = response.data.studentData.map((item: any) => ({
            id: item._id,
            name: item.name,
            email: item.email,
            gender: item.gender || 'N/A',
            phone: item.phone || 'N/A',
          }));
          setStudents(mappedData);
          console.log('Students Length:', mappedData.length); // Log length for debugging
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
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get('https://backend-sms-chi.vercel.app/teacher');
        console.log('Teacher Data:', response.data);
        if (Array.isArray(response.data.teacherData)) {
          const mappedData: Teacher[] = response.data.teacherData.map((item: any) => ({
            id: item._id,
            name: item.name,
            email: item.email,
            gender: item.gender || 'N/A',
            phone: item.phone || 'N/A',
          }));
          setTeachers(mappedData);
          console.log('Teachers Length:', mappedData.length); // Log length for debugging
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
  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Admin Dashboard</h1>
      <div className="grid grid-cols-2 gap-4">
        <div className="bg-white p-4 rounded shadow">
          <h2 className="text-lg font-semibold">Total Students</h2>
          <p className="text-2xl">{students.length}</p>
        </div>
        <div className="bg-white p-4 rounded shadow">
          <h2 className="text-lg font-semibold">Total Teachers</h2>
          <p className="text-2xl">{teachers.length}</p>
        </div>
      </div>
    </div>
  );
}