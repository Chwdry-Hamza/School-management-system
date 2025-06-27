// app/exams/page.tsx
'use client';
import React, { useState, useEffect } from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

// Define interfaces for type safety
interface Course {
  course_id: string;
  course_name: string;
}

interface Exam {
  exam_id: string;
  exam_name: string;
  course_id: string;
  date: string;
  max_marks: number;
}

interface Result {
  result_id: string;
  exam_id: string;
  student_id: string;
  marks: number;
  grade: string;
}

interface NewExam {
  exam_name: string;
  course_id: string;
  date: Date;
  max_marks: number;
}

export default function ExamPage() {
  // Initialize state with proper types
  const [exams, setExams] = useState<Exam[]>([]);
  const [courses, setCourses] = useState<Course[]>([]);
  const [results, setResults] = useState<Result[]>([]);
  const [selectedExamId, setSelectedExamId] = useState<string>('');
  const [newExam, setNewExam] = useState<NewExam>({
    exam_name: '',
    course_id: '',
    date: new Date(),
    max_marks: 100,
  });
  const [editExam, setEditExam] = useState<Exam | null>(null);
  const [showForm, setShowForm] = useState<boolean>(false);
  const [successMessage, setSuccessMessage] = useState<string>('');

  // Dummy data
  useEffect(() => {
    // Simulate API response for courses
    const dummyCourses: Course[] = [
      { course_id: 'C1', course_name: 'Mathematics' },
      { course_id: 'C2', course_name: 'Physics' },
      { course_id: 'C3', course_name: 'Computer Science' },
    ];
    setCourses(dummyCourses);

    // Simulate API response for exams
    const dummyExams: Exam[] = [
      {
        exam_id: 'E1',
        exam_name: 'Midterm Math',
        course_id: 'C1',
        date: '2025-06-20',
        max_marks: 100,
      },
      {
        exam_id: 'E2',
        exam_name: 'Physics Final',
        course_id: 'C2',
        date: '2025-06-25',
        max_marks: 200,
      },
    ];
    setExams(dummyExams);
  }, []);

  // Simulate fetching results when an exam is selected
  useEffect(() => {
    if (selectedExamId) {
      // Simulate API response for results
      const dummyResults: Result[] = [
        {
          result_id: 'R1',
          exam_id: selectedExamId,
          student_id: 'S001',
          marks: 85,
          grade: 'A',
        },
        {
          result_id: 'R2',
          exam_id: selectedExamId,
          student_id: 'S002',
          marks: 70,
          grade: 'B',
        },
      ];
      setResults(dummyResults);
    } else {
      setResults([]);
    }
  }, [selectedExamId]);

  // Create or update exam
  const handleSaveExam = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editExam) {
        // Simulate updating exam
        setExams(
          exams.map((exam) =>
            exam.exam_id === editExam.exam_id
              ? { ...exam, ...newExam, date: newExam.date.toISOString().split('T')[0] }
              : exam,
          ),
        );
        setSuccessMessage('Exam updated successfully!');
      } else {
        // Simulate creating exam
        const newExamData: Exam = {
          exam_id: `E${Math.random().toString(36).substr(2, 9)}`, // Temporary ID for dummy data
          ...newExam,
          date: newExam.date.toISOString().split('T')[0],
        };
        setExams([...exams, newExamData]);
        setSuccessMessage('Exam created successfully!');
      }
      setShowForm(false);
      setEditExam(null);
      setNewExam({ exam_name: '', course_id: '', date: new Date(), max_marks: 100 });
      setTimeout(() => setSuccessMessage(''), 3000);
    } catch (error) {
      console.error('Error saving exam:', error);
      alert('Failed to save exam.');
    }
  };

  // Delete exam
  const handleDeleteExam = async (exam_id: string) => {
    try {
      setExams(exams.filter((exam) => exam.exam_id !== exam_id));
      setSuccessMessage('Exam deleted successfully!');
      setTimeout(() => setSuccessMessage(''), 3000);
    } catch (error) {
      console.error('Error deleting exam:', error);
      alert('Failed to delete exam.');
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-5xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-800 mb-6">Exam Management</h1>
        <button
          onClick={() => {
            setShowForm(!showForm);
            setEditExam(null);
            setNewExam({ exam_name: '', course_id: '', date: new Date(), max_marks: 100 });
          }}
          className="mb-6 px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700"
        >
          {showForm ? 'Cancel' : 'Create New Exam'}
        </button>

        {/* Exam Form */}
        {showForm && (
          <div className="bg-white shadow-lg rounded-lg p-6 mb-6">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">{editExam ? 'Edit Exam' : 'Create Exam'}</h2>
            <form onSubmit={handleSaveExam} className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Exam Name</label>
                <input
                  type="text"
                  value={newExam.exam_name}
                  onChange={(e) => setNewExam({ ...newExam, exam_name: e.target.value })}
                  className="mt-1 w-full p-2 border border-gray-300 rounded-md focus:ring-indigo-500"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Course</label>
                <select
                  value={newExam.course_id}
                  onChange={(e) => setNewExam({ ...newExam, course_id: e.target.value })}
                  className="mt-1 w-full p-2 border border-gray-300 rounded-md focus:ring-indigo-500"
                  required
                >
                  <option value="">Select a course</option>
                  {courses.map((course) => (
                    <option key={course.course_id} value={course.course_id}>
                      {course.course_name}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Date</label>
                <DatePicker
                  selected={newExam.date}
                  onChange={(date: Date | null) =>
                    date && setNewExam({ ...newExam, date })
                  }
                  className="mt-1 w-full p-2 border border-gray-300 rounded-md focus:ring-indigo-500"
                  dateFormat="yyyy-MM-dd"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Max Marks</label>
                <input
                  type="number"
                  value={newExam.max_marks}
                  onChange={(e) =>
                    setNewExam({ ...newExam, max_marks: parseInt(e.target.value) || 100 })
                  }
                  className="mt-1 w-full p-2 border border-gray-300 rounded-md focus:ring-indigo-500"
                  required
                />
              </div>
              <div className="md:col-span-2">
                <button
                  type="submit"
                  className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700"
                >
                  {editExam ? 'Update Exam' : 'Save Exam'}
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Exam List */}
        <div className="bg-white shadow-lg rounded-lg p-6">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">Exams</h2>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Name</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Course</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Date</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Max Marks</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {exams.map((exam) => (
                  <tr key={exam.exam_id}>
                    <td className="px-6 py-4 text-sm">{exam.exam_name}</td>
                    <td className="px-6 py-4 text-sm">
                      {courses.find((c) => c.course_id === exam.course_id)?.course_name || 'N/A'}
                    </td>
                    <td className="px-6 py-4 text-sm">{exam.date}</td>
                    <td className="px-6 py-4 text-sm">{exam.max_marks}</td>
                    <td className="px-6 py-4 text-sm">
                      <button
                        onClick={() => {
                          setEditExam(exam);
                          setNewExam({ ...exam, date: new Date(exam.date) });
                          setShowForm(true);
                        }}
                        className="text-indigo-600 hover:text-indigo-900 mr-2"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDeleteExam(exam.exam_id)}
                        className="text-red-600 hover:text-red-900 mr-2"
                      >
                        Delete
                      </button>
                      <button
                        onClick={() => setSelectedExamId(exam.exam_id)}
                        className="text-indigo-600 hover:text-indigo-900"
                      >
                        View Results
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Results */}
        {selectedExamId && results.length > 0 && (
          <div className="bg-white shadow-lg rounded-lg p-6 mt-6">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">Exam Results</h2>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Student</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Marks</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Grade</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {results.map((result) => (
                    <tr key={result.result_id}>
                      <td className="px-6 py-4 text-sm">{result.student_id}</td>
                      <td className="px-6 py-4 text-sm">{result.marks}</td>
                      <td className="px-6 py-4 text-sm">{result.grade}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {successMessage && (
          <div className="fixed bottom-4 right-4 bg-green-500 text-white px-4 py-2 rounded-md shadow-lg">
            {successMessage}
          </div>
        )}
      </div>
    </div>
  );
}