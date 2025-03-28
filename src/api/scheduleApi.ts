import apiClient from './client';
import { ScheduleCreate, ScheduleRead, ScheduleUpdate } from '../types/schedule'; 

// Create a new schedule
export const createSchedule = async (schedule: ScheduleCreate): Promise<ScheduleRead> => {
  const response = await apiClient.post<ScheduleRead>('/schedules/', schedule);
  return response.data;
};

// Get all schedules with optional filters
export const getSchedules = async (
  skip = 0, 
  limit = 100, 
  filters?: {
    course_id?: number | null;
    instructor_id?: number | null;
    room?: string | null;
    day_of_week?: number | null;
  }
): Promise<ScheduleRead[]> => {
  const response = await apiClient.get<ScheduleRead[]>('/schedules/', {
    params: { skip, limit, ...filters }
  });
  return response.data;
};

// Get a specific schedule by ID
export const getSchedule = async (scheduleId: number): Promise<ScheduleRead> => {
  const response = await apiClient.get<ScheduleRead>(`/schedules/${scheduleId}`);
  return response.data;
};

// Update a schedule
export const updateSchedule = async (
  scheduleId: number, 
  scheduleData: ScheduleUpdate
): Promise<ScheduleRead> => {
  const response = await apiClient.patch<ScheduleRead>(`/schedules/${scheduleId}`, scheduleData);
  return response.data;
};

// Delete a schedule
export const deleteSchedule = async (scheduleId: number): Promise<void> => {
  await apiClient.delete(`/schedules/${scheduleId}`);
};

// Get schedules for a specific student
export const getStudentSchedules = async (
  studentId: number, 
  skip = 0, 
  limit = 100
): Promise<ScheduleRead[]> => {
  const response = await apiClient.get<ScheduleRead[]>(`/schedules/student/${studentId}/schedules`, {
    params: { skip, limit }
  });
  return response.data;
};

// Create a schedule for a specific student (admin only)
export const createStudentSchedule = async (
  studentId: number, 
  schedule: ScheduleCreate
): Promise<ScheduleRead> => {
  const response = await apiClient.post<ScheduleRead>(`/schedules/student/${studentId}/schedules`, schedule);
  return response.data;
};

// Update a student's schedule (admin only)
export const updateStudentSchedule = async (
  studentId: number, 
  scheduleId: number, 
  scheduleData: ScheduleUpdate
): Promise<ScheduleRead> => {
  const response = await apiClient.patch<ScheduleRead>(
    `/schedules/student/${studentId}/schedules/${scheduleId}`, 
    scheduleData
  );
  return response.data;
};

// Delete a student's schedule (admin only)
export const deleteStudentSchedule = async (
  studentId: number, 
  scheduleId: number
): Promise<void> => {
  await apiClient.delete(`/schedules/student/${studentId}/schedules/${scheduleId}`);
};