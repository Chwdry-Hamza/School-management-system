// app/parent-portal/page.tsx
'use client';
import React, { useState, useEffect } from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

// Define interfaces for type safety
interface Student {
  student_id: string;
  first_name: string;
  last_name: string;
}

interface Attendance {
  attendance_id: string;
  student_id: string;
  date: string;
  status: 'Present' | 'Absent' | 'Late';
}

interface ExamResult {
  result_id: string;
  student_id: string;
  exam_id: string;
  exam_name: string;
  marks: number;
  grade: string;
  date: string;
}

interface Fee {
  fee_id: string;
  student_id: string;
  amount: number;
  due_date: string;
  status: 'Paid' | 'Pending';
  payment_date?: string;
}

interface Message {
  message_id: string;
  sender: string;
  recipient: string;
  content: string;
  timestamp: string;
}

interface Teacher {
  teacher_id: string;
  name: string;
}

export default function ParentPortal() {
  // Initialize state with proper types
  const [student, setStudent] = useState<Student | null>(null);
  const [attendance, setAttendance] = useState<Attendance[]>([]);
  const [results, setResults] = useState<ExamResult[]>([]);
  const [fees, setFees] = useState<Fee[]>([]);
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState<string>('');
  const [teachers, setTeachers] = useState<Teacher[]>([]);
  const [selectedTeacher, setSelectedTeacher] = useState<string>('');
  const [startDate, setStartDate] = useState<Date>(new Date('2025-06-01'));
  const [endDate, setEndDate] = useState<Date>(new Date('2025-06-19'));
  const [activeTab, setActiveTab] = useState<'progress' | 'messages'>('progress');
  const [successMessage, setSuccessMessage] = useState<string>('');

  // Load dummy data
  useEffect(() => {
    // Simulate API response for student
    const dummyStudent: Student = {
      student_id: 'S001',
      first_name: 'John',
      last_name: 'Doe',
    };
    setStudent(dummyStudent);

    // Simulate API response for attendance
    const dummyAttendance: Attendance[] = [
      { attendance_id: 'A001', student_id: 'S001', date: '2025-06-01', status: 'Present' },
      { attendance_id: 'A002', student_id: 'S001', date: '2025-06-02', status: 'Absent' },
      { attendance_id: 'A003', student_id: 'S001', date: '2025-06-03', status: 'Present' },
    ];
    setAttendance(dummyAttendance);

    // Simulate API response for exam results
    const dummyResults: ExamResult[] = [
      {
        result_id: 'R001',
        student_id: 'S001',
        exam_id: 'E001',
        exam_name: 'Midterm Math',
        marks: 85,
        grade: 'A',
        date: '2025-06-10',
      },
      {
        result_id: 'R002',
        student_id: 'S001',
        exam_id: 'E002',
        exam_name: 'Physics Final',
        marks: 70,
        grade: 'B',
        date: '2025-06-15',
      },
    ];
    setResults(dummyResults);

    // Simulate API response for fees
    const dummyFees: Fee[] = [
      {
        fee_id: 'F001',
        student_id: 'S001',
        amount: 500,
        due_date: '2025-06-15',
        status: 'Paid',
        payment_date: '2025-06-10',
      },
      {
        fee_id: 'F002',
        student_id: 'S001',
        amount: 600,
        due_date: '2025-06-20',
        status: 'Pending',
      },
    ];
    setFees(dummyFees);

    // Simulate API response for messages
    const dummyMessages: Message[] = [
      {
        message_id: 'M001',
        sender: 'Parent (S001)',
        recipient: 'T001',
        content: 'Can we discuss John’s math progress?',
        timestamp: '2025-06-01T10:00:00Z',
      },
      {
        message_id: 'M002',
        sender: 'T001',
        recipient: 'Parent (S001)',
        content: 'Sure, let’s schedule a meeting.',
        timestamp: '2025-06-02T12:00:00Z',
      },
    ];
    setMessages(dummyMessages);

    // Simulate API response for teachers
    const dummyTeachers: Teacher[] = [
      { teacher_id: 'T001', name: 'Ms. Smith' },
      { teacher_id: 'T002', name: 'Mr. Johnson' },
    ];
    setTeachers(dummyTeachers);
  }, []);

  // Send message
  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedTeacher) {
      alert('Please select a teacher.');
      return;
    }
    if (!newMessage.trim()) {
      alert('Message cannot be empty.');
      return;
    }
    try {
      // Simulate sending message
      const newMessageData: Message = {
        message_id: `M${Math.random().toString(36).substr(2, 9)}`, // Temporary ID
        sender: 'Parent (S001)', // Mock parent ID
        recipient: selectedTeacher,
        content: newMessage,
        timestamp: new Date().toISOString(),
      };
      setMessages([...messages, newMessageData]);
      setNewMessage('');
      setSelectedTeacher('');
      setSuccessMessage('Message sent successfully!');
      setTimeout(() => setSuccessMessage(''), 3000);
    } catch (error) {
      console.error('Error sending message:', error);
      alert('Failed to send message.');
    }
  };

  // Filter data by date range
  const filteredAttendance = attendance.filter(
    (record) =>
      new Date(record.date) >= startDate && new Date(record.date) <= endDate,
  );
  const filteredResults = results.filter(
    (result) => new Date(result.date) >= startDate && new Date(result.date) <= endDate,
  );
  const filteredFees = fees.filter(
    (fee) => new Date(fee.due_date) >= startDate && new Date(fee.due_date) <= endDate,
  );

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-5xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-800 mb-6">Parent Portal</h1>
        {student && (
          <p className="text-lg text-gray-600 mb-4">
            Student: {student.first_name} {student.last_name}
          </p>
        )}

        {/* Tabs */}
        <div className="mb-6">
          <button
            onClick={() => setActiveTab('progress')}
            className={`px-4 py-2 mr-2 rounded-md ${
              activeTab === 'progress' ? 'bg-indigo-600 text-white' : 'bg-gray-200 text-gray-800'
            }`}
          >
            Progress
          </button>
          <button
            onClick={() => setActiveTab('messages')}
            className={`px-4 py-2 rounded-md ${
              activeTab === 'messages' ? 'bg-indigo-600 text-white' : 'bg-gray-200 text-gray-800'
            }`}
          >
            Messages
          </button>
        </div>

        {/* Progress Tab */}
        {activeTab === 'progress' && (
          <div className="bg-white shadow-lg rounded-lg p-6">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">Student Progress</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Start Date</label>
                <DatePicker
                  selected={startDate}
                  onChange={(date: Date | null) => date && setStartDate(date)}
                  className="mt-1 w-full p-2 border border-gray-300 rounded-md focus:ring-indigo-500"
                  dateFormat="yyyy-MM-dd"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">End Date</label>
                <DatePicker
                  selected={endDate}
                  onChange={(date: Date | null) => date && setEndDate(date)}
                  className="mt-1 w-full p-2 border border-gray-300 rounded-md focus:ring-indigo-500"
                  dateFormat="yyyy-MM-dd"
                />
              </div>
            </div>

            {/* Attendance */}
            <h3 className="text-lg font-semibold text-gray-800 mb-2">Attendance</h3>
            <div className="overflow-x-auto mb-6">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                      Date
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                      Status
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredAttendance.map((record) => (
                    <tr key={record.attendance_id}>
                      <td className="px-6 py-4 text-sm">{record.date}</td>
                      <td className="px-6 py-4 text-sm">{record.status}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Exam Results */}
            <h3 className="text-lg font-semibold text-gray-800 mb-2">Exam Results</h3>
            <div className="overflow-x-auto mb-6">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                      Exam
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                      Marks
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                      Grade
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredResults.map((result) => (
                    <tr key={result.result_id}>
                      <td className="px-6 py-4 text-sm">{result.exam_name}</td>
                      <td className="px-6 py-4 text-sm">{result.marks}</td>
                      <td className="px-6 py-4 text-sm">{result.grade}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Fees */}
            <h3 className="text-lg font-semibold text-gray-800 mb-2">Fees</h3>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                      Amount
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                      Due Date
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                      Status
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredFees.map((fee) => (
                    <tr key={fee.fee_id}>
                      <td className="px-6 py-4 text-sm">{fee.amount}</td>
                      <td className="px-6 py-4 text-sm">{fee.due_date}</td>
                      <td className="px-6 py-4 text-sm">{fee.status}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Messages Tab */}
        {activeTab === 'messages' && (
          <div className="bg-white shadow-lg rounded-lg p-6">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">Messages</h2>
            <div className="mb-4">
              <h3 className="text-lg font-semibold text-gray-800 mb-2">Send Message</h3>
              <form onSubmit={handleSendMessage} className="grid gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">To Teacher</label>
                  <select
                    value={selectedTeacher}
                    onChange={(e) => setSelectedTeacher(e.target.value)}
                    className="mt-1 w-full p-2 border border-gray-300 rounded-md focus:ring-indigo-500"
                    required
                  >
                    <option value="">Select a teacher</option>
                    {teachers.map((teacher) => (
                      <option key={teacher.teacher_id} value={teacher.teacher_id}>
                        {teacher.name}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Message</label>
                  <textarea
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    className="mt-1 w-full p-2 border border-gray-300 rounded-md focus:ring-indigo-500"
                    rows={4}
                    required
                  />
                </div>
                <button
                  type="submit"
                  className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700"
                >
                  Send
                </button>
              </form>
            </div>
            <h3 className="text-lg font-semibold text-gray-800 mb-2">Message History</h3>
            <div className="space-y-4">
              {messages.map((msg) => (
                <div key={msg.message_id} className="p-4 bg-gray-50 rounded-md">
                  <p className="text-sm text-gray-600">
                    {msg.sender} to{' '}
                    {teachers.find((t) => t.teacher_id === msg.recipient)?.name || msg.recipient} on{' '}
                    {new Date(msg.timestamp).toLocaleString()}
                  </p>
                  <p className="text-sm text-gray-800">{msg.content}</p>
                </div>
              ))}
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