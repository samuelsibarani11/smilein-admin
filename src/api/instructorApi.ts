// src/api/instructorApi.ts
import apiClient from './client';
import { InstructorCreate, InstructorRead, InstructorUpdate } from '../types/instructor';

export const createInstructor = async (instructor: InstructorCreate): Promise<InstructorRead> => {
  const response = await apiClient.post('/instructors/', instructor);
  return response.data;
};

export const getInstructors = async (skip = 0, limit = 100): Promise<InstructorRead[]> => {
  const response = await apiClient.get('/instructors/', {
    params: { skip, limit }
  });
  return response.data;
};


export const getNextInstructor = async (instructorId: number): Promise<InstructorRead> => {
  try {
    console.log(instructorId)
    const response = await apiClient.get(`/instructors/${instructorId}/next`);
    console.log(response.data)
    return response.data;
  } catch (error) {
    console.error('Failed to fetch next instructor', error);
    throw error;
  }
};

export const getInstructor = async (instructorId: number): Promise<InstructorRead> => {
  const response = await apiClient.get(`/instructors/${instructorId}`);
  return response.data;
};

export const updateInstructor = async (instructorId: number, instructorData: InstructorUpdate): Promise<InstructorRead> => {
  try {
    const currentInstructor = await getInstructor(instructorId);
    console.log(currentInstructor);
    
    const mergedData = { ...currentInstructor, ...instructorData };
    
    const response = await apiClient.patch(`/instructors/${instructorId}`, mergedData);
    console.log(response.data)
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const deleteInstructor = async (instructorId: number): Promise<void> => {
  await apiClient.delete(`/instructors/${instructorId}`);
};

export const uploadProfilePicture = async (instructorId: number, file: File): Promise<InstructorRead> => {
  const formData = new FormData();
  formData.append('file', file);
  
  const response = await apiClient.post(`/instructors/${instructorId}/profile-picture`, formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
  
  return response.data;
};
