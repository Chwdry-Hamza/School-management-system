'use client';
import { useEffect, useState } from 'react';
import { DataGrid, GridColDef, GridRenderCellParams } from '@mui/x-data-grid';
import { Modal, Box, TextField, Button, Typography, Card, CardContent, IconButton, MenuItem } from '@mui/material';
import { Edit, Delete, AddAPhoto } from '@mui/icons-material';
import axios from 'axios';

// Define the type for a student object
interface Student {
  id: string;
  username: string;
  email: string;
  phone: string;
  firstName: string;
  lastName: string;
  dateOfBirth: string;
  gender: string;
  city: string;
  homeAddress: string;
  department: string; // Replaced class
  semester: number; // New field
  parentGuardianName: string;
  parentGuardianContact: string;
  enrollmentDate: string;
  emergencyContact: string;
  profilePhoto: string; // Cloudinary URL
}

export default function Students() {
  const [search, setSearch] = useState('');
  const [students, setStudents] = useState<Student[]>([]);
  const [openModal, setOpenModal] = useState(false);
  const [openDeleteModal, setOpenDeleteModal] = useState(false);
  const [editStudentId, setEditStudentId] = useState<string | null>(null);
  const [isViewMode, setIsViewMode] = useState(false);
  const [deleteStudentId, setDeleteStudentId] = useState<string | null>(null);
  const [newStudent, setNewStudent] = useState({
    username: '',
    email: '',
    phone: '',
    firstName: '',
    lastName: '',
    dateOfBirth: '',
    gender: '',
    city: '',
    homeAddress: '',
    department: '', // Replaced class
    semester: '', // New field
    parentGuardianName: '',
    parentGuardianContact: '',
    enrollmentDate: '',
    emergencyContact: '',
    profilePhoto: '',
  });
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewImage, setPreviewImage] = useState<string | null>(null);

  const filteredStudents = students.filter((student) =>
    student.username.toLowerCase().includes(search.toLowerCase())
  );

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get('https://backend-sms-chi.vercel.app/student');
        console.log('Student Data:', response.data);
        if (Array.isArray(response.data.studentData)) {
          const mappedData: Student[] = response.data.studentData.map((item: any) => ({
            id: item._id,
            username: item.username || 'N/A',
            email: item.email || 'N/A',
            phone: item.phone || 'N/A',
            firstName: item.firstName || 'N/A',
            lastName: item.lastName || 'N/A',
            dateOfBirth: item.dateOfBirth ? new Date(item.dateOfBirth).toISOString().split('T')[0] : 'N/A',
            gender: item.gender || 'N/A',
            city: item.city || 'N/A',
            homeAddress: item.homeAddress || 'N/A',
            department: item.department || 'N/A', // Replaced class
            semester: item.semester || 0, // New field
            parentGuardianName: item.parentGuardianName || 'N/A',
            parentGuardianContact: item.parentGuardianContact || 'N/A',
            enrollmentDate: item.enrollmentDate ? new Date(item.enrollmentDate).toISOString().split('T')[0] : 'N/A',
            emergencyContact: item.emergencyContact || 'N/A',
            profilePhoto: item.profilePhoto || '',
          }));
          setStudents(mappedData);
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

  const columns: GridColDef[] = [
    {
      field: 'profilePhoto',
      headerName: 'Profile Photo',
      width: 100,
      renderCell: (params: GridRenderCellParams) => (
        <img
          src={params.row.profilePhoto || 'https://via.placeholder.com/50/cccccc/969696?text=No+Image'}
          alt="Profile"
          style={{
            width: '50px',
            height: '50px',
            borderRadius: '50%',
            objectFit: 'cover',
            border: '1px solid #ddd',
          }}
          onError={(e) => {
            e.currentTarget.src = 'https://via.placeholder.com/50/cccccc/969696?text=No+Image';
          }}
        />
      ),
    },
    {
      field: 'username',
      headerName: 'Username',
      width: 200,
      renderCell: (params: GridRenderCellParams) => (
        <Button
          variant="text"
          onClick={() => handleViewStudent(params.row.id)}
          sx={{ textTransform: 'none', justifyContent: 'flex-start', padding: 0 }}
        >
          {params.value}
        </Button>
      ),
    },
    { field: 'email', headerName: 'Email', width: 200 },
    { field: 'phone', headerName: 'Phone', width: 150 },
    { field: 'firstName', headerName: 'First Name', width: 150 },
    { field: 'lastName', headerName: 'Last Name', width: 150 },
    { field: 'gender', headerName: 'Gender', width: 100 },
    { field: 'city', headerName: 'City', width: 150 },
    { field: 'department', headerName: 'Department', width: 150 }, // Replaced class
    { field: 'semester', headerName: 'Semester', width: 100 }, // New field
    {
      field: 'edit',
      headerName: 'Edit',
      width: 100,
      renderCell: (params: GridRenderCellParams) => (
        <IconButton
          color="primary"
          onClick={() => handleEditStudent(params.row.id)}
          aria-label="edit student"
        >
          <Edit />
        </IconButton>
      ),
    },
    {
      field: 'delete',
      headerName: 'Delete',
      width: 100,
      renderCell: (params: GridRenderCellParams) => (
        <IconButton
          color="error"
          onClick={() => handleOpenDeleteModal(params.row.id)}
          aria-label="delete student"
        >
          <Delete />
        </IconButton>
      ),
    },
  ];

  const handleOpenModal = () => {
    setIsViewMode(false);
    setOpenModal(true);
    setSelectedFile(null);
    setPreviewImage(null);
  };

  const handleCloseModal = () => {
    setOpenModal(false);
    setEditStudentId(null);
    setIsViewMode(false);
    setSelectedFile(null);
    setPreviewImage(null);
    setNewStudent({
      username: '',
      email: '',
      phone: '',
      firstName: '',
      lastName: '',
      dateOfBirth: '',
      gender: '',
      city: '',
      homeAddress: '',
      department: '',
      semester: '',
      parentGuardianName: '',
      parentGuardianContact: '',
      enrollmentDate: '',
      emergencyContact: '',
      profilePhoto: '',
    });
  };

  const handleOpenDeleteModal = (id: string) => {
    setDeleteStudentId(id);
    setOpenDeleteModal(true);
  };

  const handleCloseDeleteModal = () => {
    setOpenDeleteModal(false);
    setDeleteStudentId(null);
  };
  const [courses, setCourses] = useState<string[]>([]);
  console.log("courses____________", courses);
  
  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const response = await axios.get('https://backend-sms-chi.vercel.app/course');
        // Log the response to inspect its structure
        console.log("API response:", response.data);
        
        // Check if response.data is an array
        let courseTitles: string[] = [];
        if (Array.isArray(response.data)) {
          courseTitles = response.data.map((course: { title: string }) => course.title);
        } else if (response.data.courses && Array.isArray(response.data.courses)) {
          // Handle case where data is wrapped in a 'courses' property
          courseTitles = response.data.courses.map((course: { title: string }) => course.title);
        } else {
          console.error("Unexpected response format:", response.data);
        }
        
        setCourses(courseTitles);
      } catch (err) {
        console.error('Error fetching courses:', err);
      }
    };
    fetchCourses();
  }, []);
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setNewStudent((prev) => ({ ...prev, [name]: value }));
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleAddStudent = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const formData = new FormData();
      Object.entries(newStudent).forEach(([key, value]) => {
        if (key !== 'profilePhoto') {
          formData.append(key, value);
        }
      });
      if (selectedFile) {
        formData.append('profilePhoto', selectedFile);
      }

      const response = await axios.post('https://backend-sms-chi.vercel.app/student', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      const newStudentFromAPI = response.data.newStudent;
      const studentToAdd: Student = {
        id: newStudentFromAPI._id || `temp-${Date.now()}`,
        username: newStudentFromAPI.username || 'N/A',
        email: newStudentFromAPI.email || 'N/A',
        phone: newStudentFromAPI.phone || 'N/A',
        firstName: newStudentFromAPI.firstName || 'N/A',
        lastName: newStudentFromAPI.lastName || 'N/A',
        dateOfBirth: newStudentFromAPI.dateOfBirth
          ? new Date(newStudentFromAPI.dateOfBirth).toISOString().split('T')[0]
          : 'N/A',
        gender: newStudentFromAPI.gender || 'N/A',
        city: newStudentFromAPI.city || 'N/A',
        homeAddress: newStudentFromAPI.homeAddress || 'N/A',
        department: newStudentFromAPI.department || 'N/A',
        semester: newStudentFromAPI.semester || 0,
        parentGuardianName: newStudentFromAPI.parentGuardianName || 'N/A',
        parentGuardianContact: newStudentFromAPI.parentGuardianContact || 'N/A',
        enrollmentDate: newStudentFromAPI.enrollmentDate
          ? new Date(newStudentFromAPI.enrollmentDate).toISOString().split('T')[0]
          : 'N/A',
        emergencyContact: newStudentFromAPI.emergencyContact || 'N/A',
        profilePhoto: newStudentFromAPI.profilePhoto || '',
      };
      setStudents([...students, studentToAdd]);
      handleCloseModal();
    } catch (error) {
      console.error('Error adding student:', error);
    }
  };

  const handleViewStudent = (id: string) => {
    const studentToView = students.find((student) => student.id === id);
    if (studentToView) {
      setNewStudent({
        username: studentToView.username === 'N/A' ? '' : studentToView.username,
        email: studentToView.email === 'N/A' ? '' : studentToView.email,
        phone: studentToView.phone === 'N/A' ? '' : studentToView.phone,
        firstName: studentToView.firstName === 'N/A' ? '' : studentToView.firstName,
        lastName: studentToView.lastName === 'N/A' ? '' : studentToView.lastName,
        dateOfBirth: studentToView.dateOfBirth === 'N/A' ? '' : studentToView.dateOfBirth,
        gender: studentToView.gender === 'N/A' ? '' : studentToView.gender,
        city: studentToView.city === 'N/A' ? '' : studentToView.city,
        homeAddress: studentToView.homeAddress === 'N/A' ? '' : studentToView.homeAddress,
        department: studentToView.department === 'N/A' ? '' : studentToView.department,
        semester: studentToView.semester === 0 ? '' : studentToView.semester.toString(),
        parentGuardianName: studentToView.parentGuardianName === 'N/A' ? '' : studentToView.parentGuardianName,
        parentGuardianContact: studentToView.parentGuardianContact === 'N/A' ? '' : studentToView.parentGuardianContact,
        enrollmentDate: studentToView.enrollmentDate === 'N/A' ? '' : studentToView.enrollmentDate,
        emergencyContact: studentToView.emergencyContact === 'N/A' ? '' : studentToView.emergencyContact,
        profilePhoto: studentToView.profilePhoto || '',
      });
      setPreviewImage(studentToView.profilePhoto || null);
      setSelectedFile(null);
      setEditStudentId(id);
      setIsViewMode(true);
      setOpenModal(true);
    }
  };

  const handleEditStudent = (id: string) => {
    const studentToEdit = students.find((student) => student.id === id);
    if (studentToEdit) {
      setNewStudent({
        username: studentToEdit.username === 'N/A' ? '' : studentToEdit.username,
        email: studentToEdit.email === 'N/A' ? '' : studentToEdit.email,
        phone: studentToEdit.phone === 'N/A' ? '' : studentToEdit.phone,
        firstName: studentToEdit.firstName === 'N/A' ? '' : studentToEdit.firstName,
        lastName: studentToEdit.lastName === 'N/A' ? '' : studentToEdit.lastName,
        dateOfBirth: studentToEdit.dateOfBirth === 'N/A' ? '' : studentToEdit.dateOfBirth,
        gender: studentToEdit.gender === 'N/A' ? '' : studentToEdit.gender,
        city: studentToEdit.city === 'N/A' ? '' : studentToEdit.city,
        homeAddress: studentToEdit.homeAddress === 'N/A' ? '' : studentToEdit.homeAddress,
        department: studentToEdit.department === 'N/A' ? '' : studentToEdit.department,
        semester: studentToEdit.semester === 0 ? '' : studentToEdit.semester.toString(),
        parentGuardianName: studentToEdit.parentGuardianName === 'N/A' ? '' : studentToEdit.parentGuardianName,
        parentGuardianContact: studentToEdit.parentGuardianContact === 'N/A' ? '' : studentToEdit.parentGuardianContact,
        enrollmentDate: studentToEdit.enrollmentDate === 'N/A' ? '' : studentToEdit.enrollmentDate,
        emergencyContact: studentToEdit.emergencyContact === 'N/A' ? '' : studentToEdit.emergencyContact,
        profilePhoto: studentToEdit.profilePhoto || '',
      });
      setPreviewImage(studentToEdit.profilePhoto || null);
      setSelectedFile(null);
      setEditStudentId(id);
      setIsViewMode(false);
      setOpenModal(true);
    }
  };

  const handleUpdateStudent = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editStudentId) return;
    try {
      const formData = new FormData();
      Object.entries(newStudent).forEach(([key, value]) => {
        if (key !== 'profilePhoto') {
          formData.append(key, value);
        }
      });
      if (selectedFile) {
        formData.append('profilePhoto', selectedFile);
      } else {
        formData.append('profilePhoto', newStudent.profilePhoto);
      }

      const response = await axios.put(`https://backend-sms-chi.vercel.app/student/${editStudentId}`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      const updatedStudentFromAPI = response.data.updated_student;
      const updatedStudent: Student = {
        id: editStudentId,
        username: updatedStudentFromAPI.username || newStudent.username || 'N/A',
        email: updatedStudentFromAPI.email || newStudent.email || 'N/A',
        phone: updatedStudentFromAPI.phone || newStudent.phone || 'N/A',
        firstName: updatedStudentFromAPI.firstName || newStudent.firstName || 'N/A',
        lastName: updatedStudentFromAPI.lastName || newStudent.lastName || 'N/A',
        dateOfBirth: updatedStudentFromAPI.dateOfBirth
          ? new Date(updatedStudentFromAPI.dateOfBirth).toISOString().split('T')[0]
          : newStudent.dateOfBirth || 'N/A',
        gender: updatedStudentFromAPI.gender || newStudent.gender || 'N/A',
        city: updatedStudentFromAPI.city || newStudent.city || 'N/A',
        homeAddress: updatedStudentFromAPI.homeAddress || newStudent.homeAddress || 'N/A',
        department: updatedStudentFromAPI.department || newStudent.department || 'N/A',
        semester: updatedStudentFromAPI.semester || parseInt(newStudent.semester) || 0,
        parentGuardianName: updatedStudentFromAPI.parentGuardianName || newStudent.parentGuardianName || 'N/A',
        parentGuardianContact: updatedStudentFromAPI.parentGuardianContact || newStudent.parentGuardianContact || 'N/A',
        enrollmentDate: updatedStudentFromAPI.enrollmentDate
          ? new Date(updatedStudentFromAPI.enrollmentDate).toISOString().split('T')[0]
          : newStudent.enrollmentDate || 'N/A',
        emergencyContact: updatedStudentFromAPI.emergencyContact || newStudent.emergencyContact || 'N/A',
        profilePhoto: updatedStudentFromAPI.profilePhoto || newStudent.profilePhoto || '',
      };
      setStudents(students.map((student) => (student.id === editStudentId ? updatedStudent : student)));
      handleCloseModal();
    } catch (error) {
      console.error('Error updating student:', error);
    }
  };

  const handleDeleteStudent = async () => {
    if (!deleteStudentId) return;
    try {
      await axios.delete(`https://backend-sms-chi.vercel.app/student/${deleteStudentId}`);
      setStudents(students.filter((student) => student.id !== deleteStudentId));
      handleCloseDeleteModal();
    } catch (error) {
      console.error('Error deleting student:', error);
    }
  };

  const modalStyle = {
    position: 'absolute' as 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: { xs: '95%', sm: 600, md: 800 },
    maxWidth: '100%',
    maxHeight: '90vh',
    overflowY: 'auto',
    bgcolor: 'background.paper',
    boxShadow: '0 12px 40px rgba(0, 0, 0, 0.25)',
    p: { xs: 2.5, sm: 4, md: 5 },
    borderRadius: { xs: '12px', sm: '16px' },
    border: '1px solid rgba(255, 255, 255, 0.15)',
    background: 'linear-gradient(145deg, #ffffff 0%, #f4f7fc 100%)',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  };

  const deleteModalStyle = {
    position: 'absolute' as 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: { xs: '95%', sm: 350 },
    bgcolor: 'background.paper',
    boxShadow: '0 12px 40px rgba(0, 0, 0, 0.25)',
    p: 3,
    borderRadius: '12px',
    background: 'linear-gradient(145deg, #ffffff 0%, #f4f7fc 100%)',
    textAlign: 'center',
  };

  const placeholderImage = 'https://via.placeholder.com/150/cccccc/969696?text=Profile+Photo';

  return (
    <Box sx={{ p: 0, mt: -1, mr: -2, ml: -2 }}>
      <Card >
        <CardContent>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
            <Typography variant="h6">Students</Typography>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                 <Typography
                variant="h6"
                sx={{ display: { xs: 'none', sm: 'block' } }}
              >
                Search
              </Typography>
              <TextField
                variant="outlined"
                size="small"
                placeholder="Search by name"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                sx={{
                  width: { xs: '150px', sm: 300 },
                  display: { xs: 'none', sm: 'block' }
                }}
                InputProps={{
                  'aria-label': 'Search students',
                }}
              />
              <Button
                variant="contained"
                sx={{
                  background: 'linear-gradient(45deg, #3f51b5 30%, #7986cb 90%)',
                  color: '#fff',
                  textTransform: 'none',
                  fontWeight: 600,
                  padding: { xs: '6px 16px', sm: '8px 20px' },
                  borderRadius: '10px',
                  boxShadow: '0 4px 12px rgba(63, 81, 181, 0.3)',
                  fontSize: { xs: '0.8rem', sm: '0.875rem' },
                  '&:hover': {
                    background: 'linear-gradient(45deg, #303f9f 30%, #5c6bc0 90%)',
                    transform: 'scale(1.05)',
                    boxShadow: '0 6px 16px rgba(63, 81, 181, 0.4)',
                    transition: 'all 0.2s ease-in-out',
                  },
                }}
                onClick={handleOpenModal}
              >
                Add Student
              </Button>
            </Box>
          </Box>

          {/* Student Form Modal */}
          <Modal
            open={openModal}
            onClose={handleCloseModal}
            closeAfterTransition
            slots={{ backdrop: 'div' }}
            slotProps={{
              backdrop: {
                sx: { backdropFilter: 'blur(8px)', backgroundColor: 'rgba(0, 0, 0, 0.6)' },
              },
            }}
          >
            <Box sx={modalStyle}>
              <Typography
                variant="h5"
                component="h2"
                sx={{
                  fontWeight: 700,
                  color: '#1a237e',
                  mb: 1,
                  textAlign: 'center',
                  fontSize: { xs: '1.25rem', sm: '1.5rem' },
                }}
              >
                {isViewMode ? 'View Student' : editStudentId ? 'Edit Student' : 'Add New Student'}
              </Typography>
              <Typography
                variant="body2"
                sx={{
                  color: '#546e7a',
                  mb: 3,
                  textAlign: 'center',
                  fontSize: { xs: '0.75rem', sm: '0.875rem' },
                  maxWidth: '80%',
                }}
              >
                {isViewMode
                  ? 'View the details of the student.'
                  : editStudentId
                  ? 'Update the details for the student.'
                  : 'Fill in the details to add a new student to the system.'}
              </Typography>
              <Box
                sx={{
                  width: '100%',
                  display: 'grid',
                  gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' },
                  gap: '18px',
                }}
              >
                {/* Row 1: Image */}
                <Box
                  sx={{
                    gridColumn: { xs: '1', md: '1 / 3' },
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    mb: 2,
                  }}
                >
                  <img
                    src={previewImage || newStudent.profilePhoto || placeholderImage}
                    alt="Profile"
                    style={{
                      width: '150px',
                      height: '150px',
                      borderRadius: '50%',
                      objectFit: 'cover',
                      border: '2px solid #3f51b5',
                      boxShadow: '0 4px 12px rgba(63, 81, 181, 0.3)',
                    }}
                  />
                  {!isViewMode && (
                    <Button
                      component="label"
                      startIcon={<AddAPhoto />}
                      sx={{
                        mt: 2,
                        background: 'linear-gradient(45deg, #3f51b5 30%, #7986cb 90%)',
                        color: '#fff',
                        textTransform: 'none',
                        fontWeight: 600,
                        padding: { xs: '6px 16px', sm: '8px 20px' },
                        borderRadius: '10px',
                        boxShadow: '0 4px 12px rgba(63, 81, 181, 0.3)',
                        fontSize: { xs: '0.8rem', sm: '0.875rem' },
                        '&:hover': {
                          background: 'linear-gradient(45deg, #303f9f 30%, #5c6bc0 90%)',
                          transform: 'scale(1.05)',
                          boxShadow: '0 6px 16px rgba(63, 81, 181, 0.4)',
                          transition: 'all 0.2s ease-in-out',
                        },
                      }}
                    >
                      Upload Image
                      <input
                        type="file"
                        accept="image/*"
                        hidden
                        onChange={handleImageUpload}
                      />
                    </Button>
                  )}
                </Box>

                {isViewMode ? (
                  <>
                    {/* Fields start from Row 2 */}
                    <TextField
                      fullWidth
                      label="Name"
                      value={newStudent.username}
                      variant="outlined"
                      InputProps={{ readOnly: true }}
                      sx={{ backgroundColor: '#f5f5f5' }}
                    />
                    <TextField
                      fullWidth
                      label="Email"
                      value={newStudent.email}
                      variant="outlined"
                      InputProps={{ readOnly: true }}
                      sx={{ backgroundColor: '#f5f5f5' }}
                    />
                    <TextField
                      fullWidth
                      label="Phone"
                      value={newStudent.phone}
                      variant="outlined"
                      InputProps={{ readOnly: true }}
                      sx={{ backgroundColor: '#f5f5f5' }}
                    />
                    <TextField
                      fullWidth
                      label="First Name"
                      value={newStudent.firstName}
                      variant="outlined"
                      InputProps={{ readOnly: true }}
                      sx={{ backgroundColor: '#f5f5f5' }}
                    />
                    <TextField
                      fullWidth
                      label="Last Name"
                      value={newStudent.lastName}
                      variant="outlined"
                      InputProps={{ readOnly: true }}
                      sx={{ backgroundColor: '#f5f5f5' }}
                    />
                    <TextField
                      fullWidth
                      label="Date of Birth"
                      value={newStudent.dateOfBirth}
                      variant="outlined"
                      InputProps={{ readOnly: true }}
                      sx={{ backgroundColor: '#f5f5f5' }}
                    />
                    <TextField
                      fullWidth
                      label="Gender"
                      value={newStudent.gender}
                      variant="outlined"
                      InputProps={{ readOnly: true }}
                      sx={{ backgroundColor: '#f5f5f5' }}
                    />
                    <TextField
                      fullWidth
                      label="City"
                      value={newStudent.city}
                      variant="outlined"
                      InputProps={{ readOnly: true }}
                      sx={{ backgroundColor: '#f5f5f5' }}
                    />
                    <TextField
                      fullWidth
                      label="Home Address"
                      value={newStudent.homeAddress}
                      variant="outlined"
                      InputProps={{ readOnly: true }}
                      sx={{ backgroundColor: '#f5f5f5' }}
                    />
                    <TextField
                      fullWidth
                      label="Department"
                      value={newStudent.department}
                      variant="outlined"
                      InputProps={{ readOnly: true }}
                      sx={{ backgroundColor: '#f5f5f5' }}
                    />
                    <TextField
                      fullWidth
                      label="Semester"
                      value={newStudent.semester}
                      variant="outlined"
                      InputProps={{ readOnly: true }}
                      sx={{ backgroundColor: '#f5f5f5' }}
                    />
                    <TextField
                      fullWidth
                      label="Parent/Guardian Name"
                      value={newStudent.parentGuardianName}
                      variant="outlined"
                      InputProps={{ readOnly: true }}
                      sx={{ backgroundColor: '#f5f5f5' }}
                    />
                    <TextField
                      fullWidth
                      label="Parent/Guardian Contact"
                      value={newStudent.parentGuardianContact}
                      variant="outlined"
                      InputProps={{ readOnly: true }}
                      sx={{ backgroundColor: '#f5f5f5' }}
                    />
                    <TextField
                      fullWidth
                      label="Enrollment Date"
                      value={newStudent.enrollmentDate}
                      variant="outlined"
                      InputProps={{ readOnly: true }}
                      sx={{ backgroundColor: '#f5f5f5' }}
                    />
                    <TextField
                      fullWidth
                      label="Emergency Contact"
                      value={newStudent.emergencyContact}
                      variant="outlined"
                      InputProps={{ readOnly: true }}
                      sx={{ backgroundColor: '#f5f5f5' }}
                    />
                    <Box
                      sx={{
                        gridColumn: { xs: '1', md: '1 / 3' },
                        display: 'flex',
                        justifyContent: 'flex-end',
                        mt: 2,
                      }}
                    >
                      <Button
                        onClick={handleCloseModal}
                        sx={{
                          color: '#546e7a',
                          textTransform: 'none',
                          fontWeight: 500,
                          padding: { xs: '6px 16px', sm: '8px 20px' },
                          borderRadius: '10px',
                          fontSize: { xs: '0.8rem', sm: '0.875rem' },
                          '&:hover': {
                            backgroundColor: '#eceff1',
                            transform: 'scale(1.05)',
                            transition: 'all 0.2s ease-in-out',
                          },
                        }}
                      >
                        Close
                      </Button>
                    </Box>
                  </>
                ) : (
                  <Box
                    component="form"
                    onSubmit={editStudentId ? handleUpdateStudent : handleAddStudent}
                    sx={{ display: 'contents' }}
                  >
                    {/* Fields start from Row 2 */}
                    <TextField
                      fullWidth
                      label="Name"
                      name="username"
                      value={newStudent.username}
                      onChange={handleInputChange}
                      required
                      variant="outlined"
                      InputProps={{
                        sx: {
                          borderRadius: '10px',
                          backgroundColor: '#fff',
                          '&:hover .MuiOutlinedInput-notchedOutline': {
                            borderColor: '#3f51b5',
                          },
                          '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                            borderColor: '#3f51b5',
                            boxShadow: '0 0 10px rgba(63, 81, 181, 0.4)',
                          },
                        },
                      }}
                      InputLabelProps={{
                        sx: { fontSize: { xs: '0.85rem', sm: '1rem' } },
                      }}
                      helperText="e.g., John Doe"
                      FormHelperTextProps={{
                        sx: { fontSize: { xs: '0.7rem', sm: '0.75rem' } },
                      }}
                    />
                    <TextField
                      fullWidth
                      label="Email"
                      name="email"
                      type="email"
                      value={newStudent.email}
                      onChange={handleInputChange}
                      required
                      variant="outlined"
                      InputProps={{
                        sx: {
                          borderRadius: '10px',
                          backgroundColor: '#fff',
                          '&:hover .MuiOutlinedInput-notchedOutline': {
                            borderColor: '#3f51b5',
                          },
                          '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                            borderColor: '#3f51b5',
                            boxShadow: '0 0 10px rgba(63, 81, 181, 0.4)',
                          },
                        },
                      }}
                      InputLabelProps={{
                        sx: { fontSize: { xs: '0.85rem', sm: '1rem' } },
                      }}
                      helperText="e.g., student@example.com"
                      FormHelperTextProps={{
                        sx: { fontSize: { xs: '0.7rem', sm: '0.75rem' } },
                      }}
                    />
                    <TextField
                      fullWidth
                      label="Phone"
                      name="phone"
                      value={newStudent.phone}
                      onChange={handleInputChange}
                      required
                      variant="outlined"
                      InputProps={{
                        sx: {
                          borderRadius: '10px',
                          backgroundColor: '#fff',
                          '&:hover .MuiOutlinedInput-notchedOutline': {
                            borderColor: '#3f51b5',
                          },
                          '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                            borderColor: '#3f51b5',
                            boxShadow: '0 0 10px rgba(63, 81, 181, 0.4)',
                          },
                        },
                      }}
                      InputLabelProps={{
                        sx: { fontSize: { xs: '0.85rem', sm: '1rem' } },
                      }}
                      helperText="e.g., +1234567890"
                      FormHelperTextProps={{
                        sx: { fontSize: { xs: '0.7rem', sm: '0.75rem' } },
                      }}
                    />
                    <TextField
                      fullWidth
                      label="First Name"
                      name="firstName"
                      value={newStudent.firstName}
                      onChange={handleInputChange}
                      variant="outlined"
                      InputProps={{
                        sx: {
                          borderRadius: '10px',
                          backgroundColor: '#fff',
                          '&:hover .MuiOutlinedInput-notchedOutline': {
                            borderColor: '#3f51b5',
                          },
                          '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                            borderColor: '#3f51b5',
                            boxShadow: '0 0 10px rgba(63, 81, 181, 0.4)',
                          },
                        },
                      }}
                      InputLabelProps={{
                        sx: { fontSize: { xs: '0.85rem', sm: '1rem' } },
                      }}
                      helperText="e.g., John"
                      FormHelperTextProps={{
                        sx: { fontSize: { xs: '0.7rem', sm: '0.75rem' } },
                      }}
                    />
                    <TextField
                      fullWidth
                      label="Last Name"
                      name="lastName"
                      value={newStudent.lastName}
                      onChange={handleInputChange}
                      variant="outlined"
                      InputProps={{
                        sx: {
                          borderRadius: '10px',
                          backgroundColor: '#fff',
                          '&:hover .MuiOutlinedInput-notchedOutline': {
                            borderColor: '#3f51b5',
                          },
                          '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                            borderColor: '#3f51b5',
                            boxShadow: '0 0 10px rgba(63, 81, 181, 0.4)',
                          },
                        },
                      }}
                      InputLabelProps={{
                        sx: { fontSize: { xs: '0.85rem', sm: '1rem' } },
                      }}
                      helperText="e.g., Doe"
                      FormHelperTextProps={{
                        sx: { fontSize: { xs: '0.7rem', sm: '0.75rem' } },
                      }}
                    />
                    <TextField
                      fullWidth
                      label="Date of Birth"
                      name="dateOfBirth"
                      type="date"
                      value={newStudent.dateOfBirth}
                      onChange={handleInputChange}
                      variant="outlined"
                      InputProps={{
                        sx: {
                          borderRadius: '10px',
                          backgroundColor: '#fff',
                          '&:hover .MuiOutlinedInput-notchedOutline': {
                            borderColor: '#3f51b5',
                          },
                          '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                            borderColor: '#3f51b5',
                            boxShadow: '0 0 10px rgba(63, 81, 181, 0.4)',
                          },
                        },
                      }}
                      InputLabelProps={{
                        sx: { fontSize: { xs: '0.85rem', sm: '1rem' } },
                        shrink: true,
                      }}
                    />
                    <TextField
                      fullWidth
                      label="Gender"
                      name="gender"
                      select
                      value={newStudent.gender}
                      onChange={handleInputChange}
                      variant="outlined"
                      InputProps={{
                        sx: {
                          borderRadius: '10px',
                          backgroundColor: '#fff',
                          '&:hover .MuiOutlinedInput-notchedOutline': {
                            borderColor: '#3f51b5',
                          },
                          '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                            borderColor: '#3f51b5',
                            boxShadow: '0 0 10px rgba(63, 81, 181, 0.4)',
                          },
                        },
                      }}
                      InputLabelProps={{
                        sx: { fontSize: { xs: '0.85rem', sm: '1rem' } },
                      }}
                      helperText="Select gender"
                      FormHelperTextProps={{
                        sx: { fontSize: { xs: '0.7rem', sm: '0.75rem' } },
                      }}
                    >
                      <MenuItem value="Male">Male</MenuItem>
                      <MenuItem value="Female">Female</MenuItem>
                      <MenuItem value="Other">Other</MenuItem>
                    </TextField>
                    <TextField
                      fullWidth
                      label="City"
                      name="city"
                      value={newStudent.city}
                      onChange={handleInputChange}
                      variant="outlined"
                      InputProps={{
                        sx: {
                          borderRadius: '10px',
                          backgroundColor: '#fff',
                          '&:hover .MuiOutlinedInput-notchedOutline': {
                            borderColor: '#3f51b5',
                          },
                          '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                            borderColor: '#3f51b5',
                            boxShadow: '0 0 10px rgba(63, 81, 181, 0.4)',
                          },
                        },
                      }}
                      InputLabelProps={{
                        sx: { fontSize: { xs: '0.85rem', sm: '1rem' } },
                      }}
                      helperText="e.g., New York"
                      FormHelperTextProps={{
                        sx: { fontSize: { xs: '0.7rem', sm: '0.75rem' } },
                      }}
                    />
                    <TextField
                      fullWidth
                      label="Home Address"
                      name="homeAddress"
                      value={newStudent.homeAddress}
                      onChange={handleInputChange}
                      variant="outlined"
                      InputProps={{
                        sx: {
                          borderRadius: '10px',
                          backgroundColor: '#fff',
                          '&:hover .MuiOutlinedInput-notchedOutline': {
                            borderColor: '#3f51b5',
                          },
                          '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                            borderColor: '#3f51b5',
                            boxShadow: '0 0 10px rgba(63, 81, 181, 0.4)',
                          },
                        },
                      }}
                      InputLabelProps={{
                        sx: { fontSize: { xs: '0.85rem', sm: '1rem' } },
                      }}
                      helperText="e.g., 123 Main St"
                      FormHelperTextProps={{
                        sx: { fontSize: { xs: '0.7rem', sm: '0.75rem' } },
                      }}
                    />
                   <TextField
      select
      fullWidth
      label="Department"
      name="department"
      value={newStudent.department}
      onChange={handleInputChange}
      variant="outlined"
      InputProps={{
        sx: {
          borderRadius: '10px',
          backgroundColor: '#fff',
          '&:hover .MuiOutlinedInput-notchedOutline': {
            borderColor: '#3f51b5',
          },
          '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
            borderColor: '#3f51b5',
            boxShadow: '0 0 10px rgba(63, 81, 181, 0.4)',
          },
        },
      }}
      InputLabelProps={{
        sx: { fontSize: { xs: '0.85rem', sm: '1rem' } },
      }}
      helperText="e.g., Computer Science"
      FormHelperTextProps={{
        sx: { fontSize: { xs: '0.7rem', sm: '0.75rem' } },
      }}
    >
      {courses.length > 0 ? (
        courses.map((course) => (
          <MenuItem key={course} value={course}>
            {course}
          </MenuItem>
        ))
      ) : (
        <MenuItem value="" disabled>
          No departments available
        </MenuItem>
      )}
    </TextField>
    <TextField
  select
  fullWidth
  label="Semester"
  name="semester"
  value={newStudent.semester}
  onChange={handleInputChange}
  variant="outlined"
  InputProps={{
    sx: {
      borderRadius: '10px',
      backgroundColor: '#fff',
      '&:hover .MuiOutlinedInput-notchedOutline': {
        borderColor: '#3f51b5',
      },
      '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
        borderColor: '#3f51b5',
        boxShadow: '0 0 10px rgba(63, 81, 181, 0.4)',
      },
    },
  }}
  InputLabelProps={{
    sx: { fontSize: { xs: '0.85rem', sm: '1rem' } },
  }}
  helperText="e.g., 3"
  FormHelperTextProps={{
    sx: { fontSize: { xs: '0.7rem', sm: '0.75rem' } },
  }}
>
  {[...Array(8)].map((_, index) => (
    <MenuItem key={index + 1} value={index + 1}>
      {index + 1}
    </MenuItem>
  ))}
</TextField>
                    <TextField
                      fullWidth
                      label="Parent/Guardian Name"
                      name="parentGuardianName"
                      value={newStudent.parentGuardianName}
                      onChange={handleInputChange}
                      variant="outlined"
                      InputProps={{
                        sx: {
                          borderRadius: '10px',
                          backgroundColor: '#fff',
                          '&:hover .MuiOutlinedInput-notchedOutline': {
                            borderColor: '#3f51b5',
                          },
                          '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                            borderColor: '#3f51b5',
                            boxShadow: '0 0 10px rgba(63, 81, 181, 0.4)',
                          },
                        },
                      }}
                      InputLabelProps={{
                        sx: { fontSize: { xs: '0.85rem', sm: '1rem' } },
                      }}
                      helperText="e.g., Jane Doe"
                      FormHelperTextProps={{
                        sx: { fontSize: { xs: '0.7rem', sm: '0.75rem' } },
                      }}
                    />
                    <TextField
                      fullWidth
                      label="Parent/Guardian Contact"
                      name="parentGuardianContact"
                      type="tel"
                      value={newStudent.parentGuardianContact}
                      onChange={handleInputChange}
                      variant="outlined"
                      InputProps={{
                        sx: {
                          borderRadius: '10px',
                          backgroundColor: '#fff',
                          '&:hover .MuiOutlinedInput-notchedOutline': {
                            borderColor: '#3f51b5',
                          },
                          '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                            borderColor: '#3f51b5',
                            boxShadow: '0 0 10px rgba(63, 81, 181, 0.4)',
                          },
                        },
                      }}
                      InputLabelProps={{
                        sx: { fontSize: { xs: '0.85rem', sm: '1rem' } },
                      }}
                      helperText="e.g., +1234567890"
                      FormHelperTextProps={{
                        sx: { fontSize: { xs: '0.7rem', sm: '0.75rem' } },
                      }}
                    />
                    <TextField
                      fullWidth
                      label="Enrollment Date"
                      name="enrollmentDate"
                      type="date"
                      value={newStudent.enrollmentDate}
                      onChange={handleInputChange}
                      variant="outlined"
                      InputProps={{
                        sx: {
                          borderRadius: '10px',
                          backgroundColor: '#fff',
                          '&:hover .MuiOutlinedInput-notchedOutline': {
                            borderColor: '#3f51b5',
                          },
                          '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                            borderColor: '#3f51b5',
                            boxShadow: '0 0 10px rgba(63, 81, 181, 0.4)',
                          },
                        },
                      }}
                      InputLabelProps={{
                        sx: { fontSize: { xs: '0.85rem', sm: '1rem' } },
                        shrink: true,
                      }}
                    />
                    <TextField
                      fullWidth
                      label="Emergency Contact"
                      name="emergencyContact"
                      type="tel"
                      value={newStudent.emergencyContact}
                      onChange={handleInputChange}
                      variant="outlined"
                      InputProps={{
                        sx: {
                          borderRadius: '10px',
                          backgroundColor: '#fff',
                          '&:hover .MuiOutlinedInput-notchedOutline': {
                            borderColor: '#3f51b5',
                          },
                          '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                            borderColor: '#3f51b5',
                            boxShadow: '0 0 10px rgba(63, 81, 181, 0.4)',
                          },
                        },
                      }}
                      InputLabelProps={{
                        sx: { fontSize: { xs: '0.85rem', sm: '1rem' } },
                      }}
                      helperText="e.g., +1234567890"
                      FormHelperTextProps={{
                        sx: { fontSize: { xs: '0.7rem', sm: '0.75rem' } },
                      }}
                    />
                    <Box
                      sx={{
                        gridColumn: { xs: '1', md: '1 / 3' },
                        display: 'flex',
                        justifyContent: 'flex-end',
                        gap: 2,
                        mt: 2,
                      }}
                    >
                      <Button
                        onClick={handleCloseModal}
                        sx={{
                          color: '#546e7a',
                          textTransform: 'none',
                          fontWeight: 500,
                          padding: { xs: '6px 16px', sm: '8px 20px' },
                          borderRadius: '10px',
                          fontSize: { xs: '0.8rem', sm: '0.875rem' },
                          '&:hover': {
                            backgroundColor: '#eceff1',
                            transform: 'scale(1.05)',
                            transition: 'all 0.2s ease-in-out',
                          },
                        }}
                      >
                        Cancel
                      </Button>
                      <Button
                        type="submit"
                        variant="contained"
                        sx={{
                          background: 'linear-gradient(45deg, #3f51b5 30%, #7986cb 90%)',
                          color: '#fff',
                          textTransform: 'none',
                          fontWeight: 600,
                          padding: { xs: '6px 16px', sm: '8px 20px' },
                          borderRadius: '10px',
                          boxShadow: '0 4px 12px rgba(63, 81, 181, 0.3)',
                          fontSize: { xs: '0.8rem', sm: '0.875rem' },
                          '&:hover': {
                            background: 'linear-gradient(45deg, #303f9f 30%, #5c6bc0 90%)',
                            transform: 'scale(1.05)',
                            boxShadow: '0 6px 16px rgba(63, 81, 181, 0.4)',
                            transition: 'all 0.2s ease-in-out',
                          },
                        }}
                      >
                        {editStudentId ? 'Update' : 'Save'}
                      </Button>
                    </Box>
                  </Box>
                )}
              </Box>
            </Box>
          </Modal>

          {/* Delete Confirmation Modal */}
          <Modal
            open={openDeleteModal}
            onClose={handleCloseDeleteModal}
            closeAfterTransition
            slots={{ backdrop: 'div' }}
            slotProps={{
              backdrop: {
                sx: { backdropFilter: 'blur(8px)', backgroundColor: 'rgba(0, 0, 0, 0.6)' },
              },
            }}
          >
            <Box sx={deleteModalStyle}>
              <Typography variant="h6" sx={{ fontWeight: 700, color: '#1a237e', mb: 2 }}>
                Confirm Deletion
              </Typography>
              <Typography variant="body1" sx={{ color: '#546e7a', mb: 3 }}>
                Are you sure you want to delete this student?
              </Typography>
              <Box sx={{ display: 'flex', justifyContent: 'center', gap: 2 }}>
                <Button
                  onClick={handleCloseDeleteModal}
                  sx={{
                    color: '#546e7a',
                    textTransform: 'none',
                    fontWeight: 500,
                    padding: '6px 16px',
                    borderRadius: '10px',
                    '&:hover': {
                      backgroundColor: '#eceff1',
                      transform: 'scale(1.05)',
                      transition: 'all 0.2s ease-in-out',
                    },
                  }}
                >
                  Cancel
                </Button>
                <Button
                  onClick={handleDeleteStudent}
                  variant="contained"
                  color="error"
                  sx={{
                    textTransform: 'none',
                    fontWeight: 600,
                    padding: '6px 16px',
                    borderRadius: '10px',
                    '&:hover': {
                      transform: 'scale(1.05)',
                      boxShadow: '0 6px 16px rgba(211, 47, 47, 0.4)',
                      transition: 'all 0.2s ease-in-out',
                    },
                  }}
                >
                  OK
                </Button>
              </Box>
            </Box>
          </Modal>

          <Box
            sx={{
              height: 400,
              width: '100%',
              '& .super-app-theme--header': {
                backgroundColor: '#a7b61b23',
              },
            }}
          >
            <DataGrid
              rows={filteredStudents}
              columns={columns}
              initialState={{
                pagination: {
                  paginationModel: {
                    pageSize: 5,
                  },
                },
              }}
              pageSizeOptions={[5]}
              checkboxSelection
              disableRowSelectionOnClick
            />
          </Box>
        </CardContent>
      </Card>
    </Box>
  );
}