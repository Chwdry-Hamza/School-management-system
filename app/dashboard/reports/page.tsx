// app/reports/page.tsx
'use client';
import React, { useState, useEffect } from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

// Define interfaces for type safety
interface Schedule {
  schedule_id: string;
  class_name: string;
  period: string;
}

interface Student {
  student_id: string;
  first_name: string;
  last_name: string;
}

interface AttendanceReport {
  date: string;
  student_name: string;
  status: 'Present' | 'Absent' | 'Late';
}

interface ExamReport {
  exam_name: string;
  student_name: string;
  marks: number;
  grade: string;
}

interface FeeReport {
  student_name: string;
  amount: number;
  due_date: string;
  status: 'Paid' | 'Pending';
}

interface SavedReport {
  report_id: string;
  type: 'Attendance' | 'Exam' | 'Fees';
  start_date: string;
  end_date: string;
  data: AttendanceReport[] | ExamReport[] | FeeReport[];
}

export default function ReportsPage() {
  // Initialize state with proper types
  const [reportType, setReportType] = useState<'Attendance' | 'Exam' | 'Fees'>('Attendance');
  const [schedules, setSchedules] = useState<Schedule[]>([]);
  const [students, setStudents] = useState<Student[]>([]);
  const [selectedSchedule, setSelectedSchedule] = useState<string>('');
  const [selectedStudent, setSelectedStudent] = useState<string>('');
  const [startDate, setStartDate] = useState<Date>(new Date('2025-06-01'));
  const [endDate, setEndDate] = useState<Date>(new Date('2025-06-19'));
  const [reportData, setReportData] = useState<
    AttendanceReport[] | ExamReport[] | FeeReport[]
  >([]);
  const [savedReports, setSavedReports] = useState<SavedReport[]>([]);
  const [successMessage, setSuccessMessage] = useState<string>('');

  // Load dummy data
  useEffect(() => {
    // Simulate API response for schedules
    const dummySchedules: Schedule[] = [
      { schedule_id: 'SCH001', class_name: 'Mathematics', period: '2025 Semester 1' },
      { schedule_id: 'SCH002', class_name: 'Physics', period: '2025 Semester 1' },
    ];
    setSchedules(dummySchedules);

    // Simulate API response for students
    const dummyStudents: Student[] = [
      { student_id: 'S001', first_name: 'John', last_name: 'Doe' },
      { student_id: 'S002', first_name: 'Jane', last_name: 'Smith' },
    ];
    setStudents(dummyStudents);

    // Simulate API response for saved reports
    const dummySavedReports: SavedReport[] = [
      {
        report_id: 'RPT001',
        type: 'Attendance',
        start_date: '2025-06-01',
        end_date: '2025-06-10',
        data: [
          {
            date: '2025-06-01',
            student_name: 'John Doe',
            status: 'Present',
          },
          {
            date: '2025-06-02',
            student_name: 'John Doe',
            status: 'Absent',
          },
        ],
      },
      {
        report_id: 'RPT002',
        type: 'Exam',
        start_date: '2025-06-01',
        end_date: '2025-06-15',
        data: [
          {
            exam_name: 'Midterm Math',
            student_name: 'John Doe',
            marks: 85,
            grade: 'A',
          },
        ],
      },
    ];
    setSavedReports(dummySavedReports);
  }, []);

  // Generate report
  const handleGenerateReport = async (e: React.FormEvent) => {
    e.preventDefault();
    if (startDate > endDate) {
      alert('Start date must be before end date.');
      return;
    }
    try {
      // Simulate report generation based on report type
      let generatedData: AttendanceReport[] | ExamReport[] | FeeReport[] = [];
      const reportId = `RPT${Math.random().toString(36).substr(2, 9)}`; // Temporary ID

      if (reportType === 'Attendance') {
        generatedData = [
          {
            date: '2025-06-01',
            student_name: selectedStudent
              ? students.find((s) => s.student_id === selectedStudent)?.first_name +
                ' ' +
                students.find((s) => s.student_id === selectedStudent)?.last_name
              : 'All Students',
            status: 'Present',
          },
          {
            date: '2025-06-02',
            student_name: selectedStudent
              ? students.find((s) => s.student_id === selectedStudent)?.first_name +
                ' ' +
                students.find((s) => s.student_id === selectedStudent)?.last_name
              : 'All Students',
            status: 'Absent',
          },
        ];
      } else if (reportType === 'Exam') {
        generatedData = [
          {
            exam_name: 'Midterm Math',
            student_name: selectedStudent
              ? students.find((s) => s.student_id === selectedStudent)?.first_name +
                ' ' +
                students.find((s) => s.student_id === selectedStudent)?.last_name
              : 'All Students',
            marks: 85,
            grade: 'A',
          },
          {
            exam_name: 'Physics Final',
            student_name: selectedStudent
              ? students.find((s) => s.student_id === selectedStudent)?.first_name +
                ' ' +
                students.find((s) => s.student_id === selectedStudent)?.last_name
              : 'All Students',
            marks: 70,
            grade: 'B',
          },
        ];
      } else if (reportType === 'Fees') {
        generatedData = [
          {
            student_name: selectedStudent
              ? students.find((s) => s.student_id === selectedStudent)?.first_name +
                ' ' +
                students.find((s) => s.student_id === selectedStudent)?.last_name
              : 'All Students',
            amount: 500,
            due_date: '2025-06-15',
            status: 'Paid',
          },
          {
            student_name: selectedStudent
              ? students.find((s) => s.student_id === selectedStudent)?.first_name +
                ' ' +
                students.find((s) => s.student_id === selectedStudent)?.last_name
              : 'All Students',
            amount: 600,
            due_date: '2025-06-20',
            status: 'Pending',
          },
        ];
      }

      const newReport: SavedReport = {
        report_id: reportId,
        type: reportType,
        start_date: startDate.toISOString().split('T')[0],
        end_date: endDate.toISOString().split('T')[0],
        data: generatedData,
      };

      setReportData(generatedData);
      setSavedReports([...savedReports, newReport]);
      setSuccessMessage('Report generated successfully!');
      setTimeout(() => setSuccessMessage(''), 3000);
    } catch (error) {
      console.error('Error generating report:', error);
      alert('Failed to generate report.');
    }
  };

  // Export report (mock)
  const handleExportReport = () => {
    alert('Report exported (Mock: Download CSV)');
  };

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-5xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-800 mb-6">Reports</h1>

        {/* Report Form */}
        <div className="bg-white shadow-lg rounded-lg p-6 mb-6">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">Generate Report</h2>
          <form onSubmit={handleGenerateReport} className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Report Type</label>
              <select
                value={reportType}
                onChange={(e) =>
                  setReportType(e.target.value as 'Attendance' | 'Exam' | 'Fees')
                }
                className="mt-1 w-full p-2 border border-gray-300 rounded-md focus:ring-indigo-500"
                required
              >
                <option value="Attendance">Attendance</option>
                <option value="Exam">Exam Performance</option>
                <option value="Fees">Fee Collection</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Class</label>
              <select
                value={selectedSchedule}
                onChange={(e) => setSelectedSchedule(e.target.value)}
                className="mt-1 w-full p-2 border border-gray-300 rounded-md focus:ring-indigo-500"
              >
                <option value="">All Classes</option>
                {schedules.map((schedule) => (
                  <option key={schedule.schedule_id} value={schedule.schedule_id}>
                    {schedule.class_name} - {schedule.period}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Student</label>
              <select
                value={selectedStudent}
                onChange={(e) => setSelectedStudent(e.target.value)}
                className="mt-1 w-full p-2 border border-gray-300 rounded-md focus:ring-indigo-500"
              >
                <option value="">All Students</option>
                {students.map((student) => (
                  <option key={student.student_id} value={student.student_id}>
                    {student.first_name} {student.last_name}
                  </option>
                ))}
              </select>
            </div>
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
            <div className="md:col-span-2">
              <button
                type="submit"
                className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700"
              >
                Generate Report
              </button>
            </div>
          </form>
        </div>

        {/* Report Data */}
        {reportData.length > 0 && (
          <div className="bg-white shadow-lg rounded-lg p-6 mb-6">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">{reportType} Report</h2>
            <button
              onClick={handleExportReport}
              className="mb-4 px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700"
            >
              Export Report
            </button>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    {reportType === 'Attendance' && (
                      <>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                          Date
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                          Student
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                          Status
                        </th>
                      </>
                    )}
                    {reportType === 'Exam' && (
                      <>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                          Exam
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                          Student
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                          Marks
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                          Grade
                        </th>
                      </>
                    )}
                    {reportType === 'Fees' && (
                      <>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                          Student
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                          Amount
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                          Due Date
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                          Status
                        </th>
                      </>
                    )}
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {reportData.map((row, idx) => (
                    <tr key={idx}>
                      {reportType === 'Attendance' && (
                        <>
                          <td className="px-6 py-4 text-sm">
                            {(row as AttendanceReport).date}
                          </td>
                          <td className="px-6 py-4 text-sm">
                            {(row as AttendanceReport).student_name}
                          </td>
                          <td className="px-6 py-4 text-sm">
                            {(row as AttendanceReport).status}
                          </td>
                        </>
                      )}
                      {reportType === 'Exam' && (
                        <>
                          <td className="px-6 py-4 text-sm">
                            {(row as ExamReport).exam_name}
                          </td>
                          <td className="px-6 py-4 text-sm">
                            {(row as ExamReport).student_name}
                          </td>
                          <td className="px-6 py-4 text-sm">
                            {(row as ExamReport).marks}
                          </td>
                          <td className="px-6 py-4 text-sm">
                            {(row as ExamReport).grade}
                          </td>
                        </>
                      )}
                      {reportType === 'Fees' && (
                        <>
                          <td className="px-6 py-4 text-sm">
                            {(row as FeeReport).student_name}
                          </td>
                          <td className="px-6 py-4 text-sm">
                            {(row as FeeReport).amount}
                          </td>
                          <td className="px-6 py-4 text-sm">
                            {(row as FeeReport).due_date}
                          </td>
                          <td className="px-6 py-4 text-sm">
                            {(row as FeeReport).status}
                          </td>
                        </>
                      )}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Saved Reports */}
        {savedReports.length > 0 && (
          <div className="bg-white shadow-lg rounded-lg p-6">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">Saved Reports</h2>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                      Type
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                      Date Range
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {savedReports.map((report) => (
                    <tr key={report.report_id}>
                      <td className="px-6 py-4 text-sm">{report.type}</td>
                      <td className="px-6 py-4 text-sm">
                        {report.start_date} to {report.end_date}
                      </td>
                      <td className="px-6 py-4 text-sm">
                        <button
                          onClick={() => setReportData(report.data)}
                          className="text-indigo-600 hover:text-indigo-900"
                        >
                          View
                        </button>
                      </td>
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