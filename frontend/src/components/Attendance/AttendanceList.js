import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getAttendance } from '../../redux/slices/attendanceSlice';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Typography,
  CircularProgress,
} from '@material-ui/core';

const AttendanceList = ({ studentId, subjectId }) => {
  const dispatch = useDispatch();
  const { attendanceList, loading, error } = useSelector((state) => state.attendance);

  useEffect(() => {
    const query = {};
    if (studentId) query.student = studentId;
    if (subjectId) query.subject = subjectId;
    dispatch(getAttendance(query));
  }, [dispatch, studentId, subjectId]);

  if (loading) return <CircularProgress />;
  if (error) return <Typography color="error">{error}</Typography>;

  return (
    <TableContainer component={Paper}>
      <Typography variant="h6" gutterBottom style={{ padding: 16 }}>
        Attendance Records
      </Typography>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Student</TableCell>
            <TableCell>Subject</TableCell>
            <TableCell>Date</TableCell>
            <TableCell>Status</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {attendanceList.map((record) => (
            <TableRow key={record._id}>
              <TableCell>{record.student.name}</TableCell>
              <TableCell>{record.subject.name}</TableCell>
              <TableCell>{new Date(record.date).toLocaleDateString()}</TableCell>
              <TableCell>{record.status}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default AttendanceList; 