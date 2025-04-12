// src/types/schedule.ts

export interface ScheduleCreate {
  course_id: number;
  instructor_id: number;
  chapter: string;
  room: string;
  start_time: string;
  end_time: string;
  day_of_week: number;
}

export interface ScheduleRead {
  schedule_id: number;
  room: string;
  chapter: string;
  day_of_week: number;
  start_time: string;
  end_time: string;
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
  room?: string;
  chapter?: string;
  start_time?: string;
  end_time?: string;
  day_of_week?: number;
}

export interface HTTPValidationError {
  detail?: ValidationErrorDetail[];
}

export interface ValidationErrorDetail {
  loc: string[];
  msg: string;
  type: string;
}