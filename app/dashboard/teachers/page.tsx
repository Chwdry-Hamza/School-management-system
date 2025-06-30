'use client';
import { useEffect, useState } from 'react';
import { DataGrid, GridColDef, GridRenderCellParams } from '@mui/x-data-grid';
import { Modal, Box, TextField, Button, Typography, Card, CardContent, IconButton, MenuItem } from '@mui/material';
import { Edit, Delete, AddAPhoto } from '@mui/icons-material';
import axios from 'axios';

// Define the type for a teacher object
interface Teacher {
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
  department: string;
  employeeId: string;
  hireDate: string;
  qualifications: string[];
  subjectSpecialization: string[];
  emergencyContact: string;
  profilePhoto: string; // Cloudinary URL
}

export default function Teachers() {
  const [search, setSearch] = useState('');
  const [teachers, setTeachers] = useState<Teacher[]>([]);
  const [openModal, setOpenModal] = useState(false);
  const [openDeleteModal, setOpenDeleteModal] = useState(false);
  const [editTeacherId, setEditTeacherId] = useState<string | null>(null);
  const [isViewMode, setIsViewMode] = useState(false);
  const [deleteTeacherId, setDeleteTeacherId] = useState<string | null>(null);
  const [newTeacher, setNewTeacher] = useState({
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
    employeeId: '',
    hireDate: '',
    qualifications: '',
    subjectSpecialization: '',
    emergencyContact: '',
    profilePhoto: '',
  });
  const [selectedFile, setSelectedFile] = useState<File | null>(null); // Store file object
  const [previewImage, setPreviewImage] = useState<string | null>(null); // For image preview

  const filteredTeachers = teachers.filter((teacher) =>
    teacher.username.toLowerCase().includes(search.toLowerCase())
  );

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get('https://backend-sms-chi.vercel.app/teacher');
        console.log('Teacher Data:', response.data);
        if (Array.isArray(response.data.teacherData)) {
          const mappedData: Teacher[] = response.data.teacherData.map((item: any) => ({
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
            department: item.department || 'N/A',
            employeeId: item.employeeId || 'N/A',
            hireDate: item.hireDate ? new Date(item.hireDate).toISOString().split('T')[0] : 'N/A',
            qualifications: item.qualifications || [],
            subjectSpecialization: item.subjectSpecialization || [],
            emergencyContact: item.emergencyContact || 'N/A',
            profilePhoto: item.profilePhoto || '',
          }));
          setTeachers(mappedData);
        } else {
          console.error('Expected an array in teacherData but received:', response.data);
          setTeachers([]);
        }
      } catch (error) {
        console.error('Error fetching teacher data:', error);
        setTeachers([]);
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
          onClick={() => handleViewTeacher(params.row.id)}
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
    { field: 'department', headerName: 'Department', width: 150 },
    {
      field: 'edit',
      headerName: 'Edit',
      width: 100,
      renderCell: (params: GridRenderCellParams) => (
        <IconButton
          color="primary"
          onClick={() => handleEditTeacher(params.row.id)}
          aria-label="edit teacher"
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
          aria-label="delete teacher"
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
    setEditTeacherId(null);
    setIsViewMode(false);
    setSelectedFile(null);
    setPreviewImage(null);
    setNewTeacher({
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
      employeeId: '',
      hireDate: '',
      qualifications: '',
      subjectSpecialization: '',
      emergencyContact: '',
      profilePhoto: '',
    });
  };

  const handleOpenDeleteModal = (id: string) => {
    setDeleteTeacherId(id);
    setOpenDeleteModal(true);
  };

  const handleCloseDeleteModal = () => {
    setOpenDeleteModal(false);
    setDeleteTeacherId(null);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setNewTeacher((prev) => ({ ...prev, [name]: value }));
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile(file); // Store the file object
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewImage(reader.result as string); // For preview only
      };
      reader.readAsDataURL(file);
    }
  };

  const handleAddTeacher = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const formData = new FormData();
      // Append all teacher fields to FormData
      Object.entries(newTeacher).forEach(([key, value]) => {
        if (key === 'qualifications' || key === 'subjectSpecialization') {
          // Convert comma-separated string to array and stringify
          const arrayValue = value ? value.split(',').map((item) => item.trim()) : [];
          formData.append(key, JSON.stringify(arrayValue));
        } else if (key !== 'profilePhoto') {
          formData.append(key, value);
        }
      });
      // Append the file if it exists
      if (selectedFile) {
        formData.append('profilePhoto', selectedFile);
      }

      const response = await axios.post('https://backend-sms-chi.vercel.app/teacher', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      const newTeacherFromAPI = response.data.newTeacher;
      const teacherToAdd: Teacher = {
        id: newTeacherFromAPI._id || `temp-${Date.now()}`,
        username: newTeacherFromAPI.username || 'N/A',
        email: newTeacherFromAPI.email || 'N/A',
        phone: newTeacherFromAPI.phone || 'N/A',
        firstName: newTeacherFromAPI.firstName || 'N/A',
        lastName: newTeacherFromAPI.lastName || 'N/A',
        dateOfBirth: newTeacherFromAPI.dateOfBirth
          ? new Date(newTeacherFromAPI.dateOfBirth).toISOString().split('T')[0]
          : 'N/A',
        gender: newTeacherFromAPI.gender || 'N/A',
        city: newTeacherFromAPI.city || 'N/A',
        homeAddress: newTeacherFromAPI.homeAddress || 'N/A',
        department: newTeacherFromAPI.department || 'N/A',
        employeeId: newTeacherFromAPI.employeeId || 'N/A',
        hireDate: newTeacherFromAPI.hireDate
          ? new Date(newTeacherFromAPI.hireDate).toISOString().split('T')[0]
          : 'N/A',
        qualifications: newTeacherFromAPI.qualifications || [],
        subjectSpecialization: newTeacherFromAPI.subjectSpecialization || [],
        emergencyContact: newTeacherFromAPI.emergencyContact || 'N/A',
        profilePhoto: newTeacherFromAPI.profilePhoto || '',
      };
      setTeachers([...teachers, teacherToAdd]);
      handleCloseModal();
    } catch (error) {
      console.error('Error adding teacher:', error);
    }
  };

  const handleViewTeacher = (id: string) => {
    const teacherToView = teachers.find((teacher) => teacher.id === id);
    if (teacherToView) {
      setNewTeacher({
        username: teacherToView.username === 'N/A' ? '' : teacherToView.username,
        email: teacherToView.email === 'N/A' ? '' : teacherToView.email,
        phone: teacherToView.phone === 'N/A' ? '' : teacherToView.phone,
        firstName: teacherToView.firstName === 'N/A' ? '' : teacherToView.firstName,
        lastName: teacherToView.lastName === 'N/A' ? '' : teacherToView.lastName,
        dateOfBirth: teacherToView.dateOfBirth === 'N/A' ? '' : teacherToView.dateOfBirth,
        gender: teacherToView.gender === 'N/A' ? '' : teacherToView.gender,
        city: teacherToView.city === 'N/A' ? '' : teacherToView.city,
        homeAddress: teacherToView.homeAddress === 'N/A' ? '' : teacherToView.homeAddress,
        department: teacherToView.department === 'N/A' ? '' : teacherToView.department,
        employeeId: teacherToView.employeeId === 'N/A' ? '' : teacherToView.employeeId,
        hireDate: teacherToView.hireDate === 'N/A' ? '' : teacherToView.hireDate,
        qualifications: teacherToView.qualifications.join(', ') || '',
        subjectSpecialization: teacherToView.subjectSpecialization.join(', ') || '',
        emergencyContact: teacherToView.emergencyContact === 'N/A' ? '' : teacherToView.emergencyContact,
        profilePhoto: teacherToView.profilePhoto || '',
      });
      setPreviewImage(teacherToView.profilePhoto || null);
      setSelectedFile(null);
      setEditTeacherId(id);
      setIsViewMode(true);
      setOpenModal(true);
    }
  };

  const handleEditTeacher = (id: string) => {
    const teacherToEdit = teachers.find((teacher) => teacher.id === id);
    if (teacherToEdit) {
      setNewTeacher({
        username: teacherToEdit.username === 'N/A' ? '' : teacherToEdit.username,
        email: teacherToEdit.email === 'N/A' ? '' : teacherToEdit.email,
        phone: teacherToEdit.phone === 'N/A' ? '' : teacherToEdit.phone,
        firstName: teacherToEdit.firstName === 'N/A' ? '' : teacherToEdit.firstName,
        lastName: teacherToEdit.lastName === 'N/A' ? '' : teacherToEdit.lastName,
        dateOfBirth: teacherToEdit.dateOfBirth === 'N/A' ? '' : teacherToEdit.dateOfBirth,
        gender: teacherToEdit.gender === 'N/A' ? '' : teacherToEdit.gender,
        city: teacherToEdit.city === 'N/A' ? '' : teacherToEdit.city,
        homeAddress: teacherToEdit.homeAddress === 'N/A' ? '' : teacherToEdit.homeAddress,
        department: teacherToEdit.department === 'N/A' ? '' : teacherToEdit.department,
        employeeId: teacherToEdit.employeeId === 'N/A' ? '' : teacherToEdit.employeeId,
        hireDate: teacherToEdit.hireDate === 'N/A' ? '' : teacherToEdit.hireDate,
        qualifications: teacherToEdit.qualifications.join(', ') || '',
        subjectSpecialization: teacherToEdit.subjectSpecialization.join(', ') || '',
        emergencyContact: teacherToEdit.emergencyContact === 'N/A' ? '' : teacherToEdit.emergencyContact,
        profilePhoto: teacherToEdit.profilePhoto || '',
      });
      setPreviewImage(teacherToEdit.profilePhoto || null);
      setSelectedFile(null);
      setEditTeacherId(id);
      setIsViewMode(false);
      setOpenModal(true);
    }
  };

  const handleUpdateTeacher = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editTeacherId) return;
    try {
      const formData = new FormData();
      // Append all teacher fields to FormData
      Object.entries(newTeacher).forEach(([key, value]) => {
        if (key === 'qualifications' || key === 'subjectSpecialization') {
          // Convert comma-separated string to array and stringify
          const arrayValue = value ? value.split(',').map((item) => item.trim()) : [];
          formData.append(key, JSON.stringify(arrayValue));
        } else if (key !== 'profilePhoto') {
          formData.append(key, value);
        }
      });
      // Append the file if it exists
      if (selectedFile) {
        formData.append('profilePhoto', selectedFile);
      } else {
        // If no new file is selected, send the existing profilePhoto URL
        formData.append('profilePhoto', newTeacher.profilePhoto);
      }

      const response = await axios.put(`https://backend-sms-chi.vercel.app/teacher/${editTeacherId}`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      const updatedTeacherFromAPI = response.data.updated_teacher;
      const updatedTeacher: Teacher = {
        id: editTeacherId,
        username: updatedTeacherFromAPI.username || newTeacher.username || 'N/A',
        email: updatedTeacherFromAPI.email || newTeacher.email || 'N/A',
        phone: updatedTeacherFromAPI.phone || newTeacher.phone || 'N/A',
        firstName: updatedTeacherFromAPI.firstName || newTeacher.firstName || 'N/A',
        lastName: updatedTeacherFromAPI.lastName || newTeacher.lastName || 'N/A',
        dateOfBirth: updatedTeacherFromAPI.dateOfBirth
          ? new Date(updatedTeacherFromAPI.dateOfBirth).toISOString().split('T')[0]
          : newTeacher.dateOfBirth || 'N/A',
        gender: updatedTeacherFromAPI.gender || newTeacher.gender || 'N/A',
        city: updatedTeacherFromAPI.city || newTeacher.city || 'N/A',
        homeAddress: updatedTeacherFromAPI.homeAddress || newTeacher.homeAddress || 'N/A',
        department: updatedTeacherFromAPI.department || newTeacher.department || 'N/A',
        employeeId: updatedTeacherFromAPI.employeeId || newTeacher.employeeId || 'N/A',
        hireDate: updatedTeacherFromAPI.hireDate
          ? new Date(updatedTeacherFromAPI.hireDate).toISOString().split('T')[0]
          : newTeacher.hireDate || 'N/A',
        qualifications: updatedTeacherFromAPI.qualifications || (newTeacher.qualifications ? newTeacher.qualifications.split(',').map((item: string) => item.trim()) : []) || [],
        subjectSpecialization: updatedTeacherFromAPI.subjectSpecialization || (newTeacher.subjectSpecialization ? newTeacher.subjectSpecialization.split(',').map((item: string) => item.trim()) : []) || [],
        emergencyContact: updatedTeacherFromAPI.emergencyContact || newTeacher.emergencyContact || 'N/A',
        profilePhoto: updatedTeacherFromAPI.profilePhoto || newTeacher.profilePhoto || '',
      };
      setTeachers(teachers.map((teacher) => (teacher.id === editTeacherId ? updatedTeacher : teacher)));
      handleCloseModal();
    } catch (error) {
      console.error('Error updating teacher:', error);
    }
  };

  const handleDeleteTeacher = async () => {
    if (!deleteTeacherId) return;
    try {
      await axios.delete(`https://backend-sms-chi.vercel.app/teacher/${deleteTeacherId}`);
      setTeachers(teachers.filter((teacher) => teacher.id !== deleteTeacherId));
      handleCloseDeleteModal();
    } catch (error) {
      console.error('Error deleting teacher:', error);
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
      <Card>
        <CardContent>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
            <Typography variant="h6">Teachers</Typography>
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
                Add Teacher
              </Button>
            </Box>
          </Box>

          {/* Teacher Form Modal */}
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
                {isViewMode ? 'View Teacher' : editTeacherId ? 'Edit Teacher' : 'Add New Teacher'}
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
                  ? 'View the details of the teacher.'
                  : editTeacherId
                  ? 'Update the details for the teacher.'
                  : 'Fill in the details to add a new teacher to the system.'}
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
                    src={previewImage || newTeacher.profilePhoto || placeholderImage}
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
                      label="Username"
                      value={newTeacher.username}
                      variant="outlined"
                      InputProps={{ readOnly: true }}
                      sx={{ backgroundColor: '#f5f5f5' }}
                    />
                    <TextField
                      fullWidth
                      label="Email"
                      value={newTeacher.email}
                      variant="outlined"
                      InputProps={{ readOnly: true }}
                      sx={{ backgroundColor: '#f5f5f5' }}
                    />
                    <TextField
                      fullWidth
                      label="Phone"
                      value={newTeacher.phone}
                      variant="outlined"
                      InputProps={{ readOnly: true }}
                      sx={{ backgroundColor: '#f5f5f5' }}
                    />
                    <TextField
                      fullWidth
                      label="First Name"
                      value={newTeacher.firstName}
                      InputProps={{ readOnly: true }}
                      sx={{ backgroundColor: '#f5f5f5' }}
                    />
                    <TextField
                      fullWidth
                      label="Last Name"
                      value={newTeacher.lastName}
                      variant="outlined"
                      InputProps={{ readOnly: true }}
                      sx={{ backgroundColor: '#f5f5f5' }}
                    />
                    <TextField
                      fullWidth
                      label="Date of Birth"
                      value={newTeacher.dateOfBirth}
                      variant="outlined"
                      InputProps={{ readOnly: true }}
                      sx={{ backgroundColor: '#f5f5f5' }}
                    />
                    <TextField
                      fullWidth
                      label="Gender"
                      value={newTeacher.gender}
                      variant="outlined"
                      InputProps={{ readOnly: true }}
                      sx={{ backgroundColor: '#f5f5f5' }}
                    />
                    <TextField
                      fullWidth
                      label="City"
                      value={newTeacher.city}
                      variant="outlined"
                      InputProps={{ readOnly: true }}
                      sx={{ backgroundColor: '#f5f5f5' }}
                    />
                    <TextField
                      fullWidth
                      label="Home Address"
                      value={newTeacher.homeAddress}
                      variant="outlined"
                      InputProps={{ readOnly: true }}
                      sx={{ backgroundColor: '#f5f5f5' }}
                    />
                    <TextField
                      fullWidth
                      label="Department"
                      value={newTeacher.department}
                      variant="outlined"
                      InputProps={{ readOnly: true }}
                      sx={{ backgroundColor: '#f5f5f5' }}
                    />
                    <TextField
                      fullWidth
                      label="Employee ID"
                      value={newTeacher.employeeId}
                      variant="outlined"
                      InputProps={{ readOnly: true }}
                      sx={{ backgroundColor: '#f5f5f5' }}
                    />
                    <TextField
                      fullWidth
                      label="Hire Date"
                      value={newTeacher.hireDate}
                      variant="outlined"
                      InputProps={{ readOnly: true }}
                      sx={{ backgroundColor: '#f5f5f5' }}
                    />
                    <TextField
                      fullWidth
                      label="Qualifications"
                      value={newTeacher.qualifications}
                      variant="outlined"
                      InputProps={{ readOnly: true }}
                      sx={{ backgroundColor: '#f5f5f5' }}
                    />
                    <TextField
                      fullWidth
                      label="Subject Specialization"
                      value={newTeacher.subjectSpecialization}
                      variant="outlined"
                      InputProps={{ readOnly: true }}
                      sx={{ backgroundColor: '#f5f5f5' }}
                    />
                    <TextField
                      fullWidth
                      label="Emergency Contact"
                      value={newTeacher.emergencyContact}
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
                    onSubmit={editTeacherId ? handleUpdateTeacher : handleAddTeacher}
                    sx={{ display: 'contents' }}
                  >
                    {/* Fields start from Row 2 */}
                    <TextField
                      fullWidth
                      label="Username"
                      name="username"
                      value={newTeacher.username}
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
                      helperText="e.g., JohnDoe"
                      FormHelperTextProps={{
                        sx: { fontSize: { xs: '0.7rem', sm: '0.75rem' } },
                      }}
                    />
                    <TextField
                      fullWidth
                      label="Email"
                      name="email"
                      type="email"
                      value={newTeacher.email}
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
                      helperText="e.g., teacher@example.com"
                      FormHelperTextProps={{
                        sx: { fontSize: { xs: '0.7rem', sm: '0.75rem' } },
                      }}
                    />
                    <TextField
                      fullWidth
                      label="Phone"
                      name="phone"
                      value={newTeacher.phone}
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
                      value={newTeacher.firstName}
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
                      value={newTeacher.lastName}
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
                      value={newTeacher.dateOfBirth}
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
                      value={newTeacher.gender}
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
                      value={newTeacher.city}
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
                      value={newTeacher.homeAddress}
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
                      fullWidth
                      label="Department"
                      name="department"
                      value={newTeacher.department}
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
                      helperText="e.g., Mathematics"
                      FormHelperTextProps={{
                        sx: { fontSize: { xs: '0.7rem', sm: '0.75rem' } },
                      }}
                    />
                    <TextField
                      fullWidth
                      label="Employee ID"
                      name="employeeId"
                      value={newTeacher.employeeId}
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
                      helperText="e.g., T12345"
                      FormHelperTextProps={{
                        sx: { fontSize: { xs: '0.7rem', sm: '0.75rem' } },
                      }}
                    />
                    <TextField
                      fullWidth
                      label="Hire Date"
                      name="hireDate"
                      type="date"
                      value={newTeacher.hireDate}
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
                      label="Qualifications"
                      name="qualifications"
                      value={newTeacher.qualifications}
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
                      helperText="e.g., M.Ed, B.Sc"
                      FormHelperTextProps={{
                        sx: { fontSize: { xs: '0.7rem', sm: '0.75rem' } },
                      }}
                    />
                    <TextField
                      fullWidth
                      label="Subject Specialization"
                      name="subjectSpecialization"
                      value={newTeacher.subjectSpecialization}
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
                      helperText="e.g., Physics, Chemistry"
                      FormHelperTextProps={{
                        sx: { fontSize: { xs: '0.7rem', sm: '0.75rem' } },
                      }}
                    />
                    <TextField
                      fullWidth
                      label="Emergency Contact"
                      name="emergencyContact"
                      type="tel"
                      value={newTeacher.emergencyContact}
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
                        {editTeacherId ? 'Update' : 'Save'}
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
                Are you sure you want to delete this teacher?
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
                  onClick={handleDeleteTeacher}
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
              rows={filteredTeachers}
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