// src/api/attendanceApi.ts

import apiClient from './client';
import { 
  AttendanceRead, 
  AttendanceUpdate, 
  AttendanceWithScheduleRead,
  CheckInRequest
} from '../types/attendance';


// Get all attendances with pagination
export const getAttendances = async (skip = 0, limit = 100): Promise<AttendanceWithScheduleRead[]> => {
  const response = await apiClient.get<AttendanceWithScheduleRead[]>('/attendances/', {
    params: { skip, limit }
  });
  return response.data;
};

// Get a specific attendance record by ID
export const getAttendance = async (attendanceId: number): Promise<AttendanceRead> => {
  const response = await apiClient.get<AttendanceRead>(`/attendances/${attendanceId}`);
  return response.data;
};

// Update an attendance record
export const updateAttendance = async (attendanceId: number, data: AttendanceUpdate): Promise<AttendanceRead> => {
  const response = await apiClient.patch<AttendanceRead>(`/attendances/${attendanceId}`, data);
  return response.data;
};

// Delete an attendance record
export const deleteAttendance = async (attendanceId: number): Promise<void> => {
  await apiClient.delete(`/attendances/${attendanceId}`);
};

// Get student's attendance records
export const getStudentAttendances = async (
  studentId: number, 
  scheduleId?: number
): Promise<AttendanceRead[]> => {
  const params: Record<string, any> = {};
  if (scheduleId) params.schedule_id = scheduleId;
  
  const response = await apiClient.get<AttendanceRead[]>(`/attendances/student/${studentId}`, {
    params
  });
  return response.data;
};

// Check-in endpoint
export const checkIn = async (
  scheduleId: number, 
  data: CheckInRequest, 
  smileDetected = false
): Promise<AttendanceRead> => {
  const response = await apiClient.post<AttendanceRead>('/attendances/check-in', data, {
    params: {
      schedule_id: scheduleId,
      smile_detected: smileDetected
    }
  });
  return response.data;
};

// Check-out endpoint
export const checkOut = async (
  scheduleId: number, 
  locationData: Record<string, any>
): Promise<AttendanceRead> => {
  const response = await apiClient.post<AttendanceRead>('/attendances/check-out', locationData, {
    params: {
      schedule_id: scheduleId
    }
  });
  return response.data;
};