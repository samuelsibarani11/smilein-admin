// src/types/schedule.ts

export interface ScheduleCreate {
  course_id: number;
  instructor_id: number;
  room: string;
  start_time: string;
  end_time: string;
  day_of_week: number;
  student_id: number;
}

export interface ScheduleRead {
  student_id: any;
  schedule_id: number;
  course_id: number;
  instructor_id: number;
  room: string;
  start_time: string;
  end_time: string;
  day_of_week: number;
  course?: any; // Based on the OpenAPI spec, this appears to be an optional field
  created_at?: string;
  updated_at?: string;
}

export interface ScheduleUpdate {
  course_id?: number | null;
  instructor_id?: number | null;
  room?: string | null;
  start_time?: string | null;
  end_time?: string | null;
  day_of_week?: number | null;
  student_id: number;
}

export interface HTTPValidationError {
  detail?: ValidationErrorDetail[];
}

export interface ValidationErrorDetail {
  loc: string[];
  msg: string;
  type: string;
}