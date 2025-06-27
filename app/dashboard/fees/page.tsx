// app/fees/page.tsx
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

interface Fee {
  fee_id: string;
  student_id: string;
  amount: number;
  due_date: string;
  status: 'Paid' | 'Pending';
  payment_date?: string;
}

interface NewFee {
  student_id: string;
  amount: number;
  due_date: Date;
}

export default function FeePage() {
  // Initialize state with proper types
  const [fees, setFees] = useState<Fee[]>([]);
  const [students, setStudents] = useState<Student[]>([]);
  const [newFee, setNewFee] = useState<NewFee>({
    student_id: '',
    amount: 0,
    due_date: new Date(),
  });
  const [filterStatus, setFilterStatus] = useState<'All' | 'Paid' | 'Pending'>('All');
  const [showForm, setShowForm] = useState<boolean>(false);
  const [successMessage, setSuccessMessage] = useState<string>('');

  // Load dummy data
  useEffect(() => {
    // Simulate API response for students
    const dummyStudents: Student[] = [
      { student_id: 'S001', first_name: 'John', last_name: 'Doe' },
      { student_id: 'S002', first_name: 'Jane', last_name: 'Smith' },
      { student_id: 'S003', first_name: 'Alice', last_name: 'Johnson' },
    ];
    setStudents(dummyStudents);

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
        student_id: 'S002',
        amount: 600,
        due_date: '2025-06-20',
        status: 'Pending',
      },
      {
        fee_id: 'F003',
        student_id: 'S003',
        amount: 450,
        due_date: '2025-06-25',
        status: 'Pending',
      },
    ];
    setFees(dummyFees);
  }, []);

  // Add new fee
  const handleSaveFee = async (e: React.FormEvent) => {
    e.preventDefault();
    if (newFee.amount <= 0) {
      alert('Amount must be greater than zero.');
      return;
    }
    try {
      // Simulate creating fee
      const newFeeData: Fee = {
        fee_id: `F${Math.random().toString(36).substr(2, 9)}`, // Temporary ID for dummy data
        ...newFee,
        due_date: newFee.due_date.toISOString().split('T')[0],
        status: 'Pending',
      };
      setFees([...fees, newFeeData]);
      setShowForm(false);
      setNewFee({ student_id: '', amount: 0, due_date: new Date() });
      setSuccessMessage('Fee added successfully!');
      setTimeout(() => setSuccessMessage(''), 3000);
    } catch (error) {
      console.error('Error saving fee:', error);
      alert('Failed to save fee.');
    }
  };

  // Mark fee as paid
  const handleMarkPaid = async (fee_id: string) => {
    try {
      setFees(
        fees.map((fee) =>
          fee.fee_id === fee_id
            ? { ...fee, status: 'Paid', payment_date: new Date().toISOString().split('T')[0] }
            : fee,
        ),
      );
      setSuccessMessage('Fee marked as paid!');
      setTimeout(() => setSuccessMessage(''), 3000);
    } catch (error) {
      console.error('Error marking fee as paid:', error);
      alert('Failed to mark fee as paid.');
    }
  };

  // Generate receipt (mock)
  const handleGenerateReceipt = (fee: Fee) => {
    alert(`Receipt generated for ${fee.fee_id} (Mock: Download PDF)`);
  };

  const filteredFees = fees.filter(
    (fee) => filterStatus === 'All' || fee.status === filterStatus,
  );

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-5xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-800 mb-6">Fee Management</h1>
        <button
          onClick={() => {
            setShowForm(!showForm);
            setNewFee({ student_id: '', amount: 0, due_date: new Date() });
          }}
          className="mb-6 px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700"
        >
          {showForm ? 'Cancel' : 'Add New Fee'}
        </button>

        {/* Fee Form */}
        {showForm && (
          <div className="bg-white shadow-lg rounded-lg p-6 mb-6">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">Add Fee</h2>
            <form onSubmit={handleSaveFee} className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Student</label>
                <select
                  value={newFee.student_id}
                  onChange={(e) => setNewFee({ ...newFee, student_id: e.target.value })}
                  className="mt-1 w-full p-2 border border-gray-300 rounded-md focus:ring-indigo-500"
                  required
                >
                  <option value="">Select a student</option>
                  {students.map((student) => (
                    <option key={student.student_id} value={student.student_id}>
                      {student.first_name} {student.last_name}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Amount</label>
                <input
                  type="number"
                  value={newFee.amount || ''} // Show empty string if 0 to improve UX
                  onChange={(e) =>
                    setNewFee({ ...newFee, amount: parseInt(e.target.value) || 0 })
                  }
                  min="1"
                  className="mt-1 w-full p-2 border border-gray-300 rounded-md focus:ring-indigo-500"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Due Date</label>
                <DatePicker
                  selected={newFee.due_date}
                  onChange={(date: Date | null) =>
                    date && setNewFee({ ...newFee, due_date: date })
                  }
                  className="mt-1 w-full p-2 border border-gray-300 rounded-md focus:ring-indigo-500"
                  dateFormat="yyyy-MM-dd"
                />
              </div>
              <div className="md:col-span-2">
                <button
                  type="submit"
                  className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700"
                >
                  Save Fee
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Fee List */}
        <div className="bg-white shadow-lg rounded-lg p-6">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">Fees</h2>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">Filter by Status</label>
            <select
              value={filterStatus}
              onChange={(e) =>
                setFilterStatus(e.target.value as 'All' | 'Paid' | 'Pending')
              }
              className="mt-1 w-40 p-2 border border-gray-300 rounded-md focus:ring-indigo-500"
            >
              <option value="All">All</option>
              <option value="Paid">Paid</option>
              <option value="Pending">Pending</option>
            </select>
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
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
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredFees.map((fee) => {
                  const student = students.find((s) => s.student_id === fee.student_id);
                  return (
                    <tr key={fee.fee_id}>
                      <td className="px-6 py-4 text-sm">
                        {student ? `${student.first_name} ${student.last_name}` : 'N/A'}
                      </td>
                      <td className="px-6 py-4 text-sm">{fee.amount}</td>
                      <td className="px-6 py-4 text-sm">{fee.due_date}</td>
                      <td className="px-6 py-4 text-sm">{fee.status}</td>
                      <td className="px-6 py-4 text-sm">
                        {fee.status === 'Pending' && (
                          <button
                            onClick={() => handleMarkPaid(fee.fee_id)}
                            className="text-indigo-600 hover:text-indigo-900 mr-2"
                          >
                            Mark Paid
                          </button>
                        )}
                        {fee.status === 'Paid' && (
                          <button
                            onClick={() => handleGenerateReceipt(fee)}
                            className="text-indigo-600 hover:text-indigo-900"
                          >
                            Generate Receipt
                          </button>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        {successMessage && (
          <div className="fixed bottom-4 right-4 bg-green-500 text-white px-4 py-2 rounded-md shadow-lg">
            {successMessage}
          </div>
        )}
      </div>
    </div>
  );
}