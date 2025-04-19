// src/types/schedule.ts
export interface ScheduleCreate {
  course_id: number;
  instructor_id: number;
  room_id: number; // Changed from 'room' to 'room_id'
  chapter?: string;
  start_time: string;
  end_time: string;
  day_of_week: number;
  schedule_date: string; // Added the new field
}

export interface ScheduleRead {
  schedule_id: number;
  room: { // Room is now an object with the updated fields
    room_id: number;
    name: string;
    latitude: number;
    longitude: number;
    radius: number;
  };
  chapter?: string;
  day_of_week: number;
  start_time: string;
  end_time: string;
  schedule_date: string; // Added the new field
  created_at: string;
  course: {
    course_id: number;
    course_name: string;
  };
  instructor: {
    instructor_id: number;
    full_name: string;
  };
}

export interface ScheduleUpdate {
  course_id?: number;
  instructor_id?: number;
  room_id?: number; // Changed from 'room' to 'room_id'
  chapter?: string;
  start_time?: string;
  end_time?: string;
  day_of_week?: number;
  schedule_date?: string; // Added the new field
}

export interface HTTPValidationError {
  detail?: ValidationErrorDetail[];
}

export interface ValidationErrorDetail {
  loc: string[];
  msg: string;
  type: string;
}