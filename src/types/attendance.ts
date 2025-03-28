// src/types/attendance.ts

export interface AttendanceCreate {
    location_data?: Record<string, any> | string | null;
    face_verification_data?: Record<string, any> | string | null;
    smile_detected?: boolean | null;
  }
  
  export interface AttendanceRead {
    attendance_id: number;
    student_id: number;
    schedule_id: number;
    date: string;
    check_in_time: string | null;
    check_out_time: string | null;
    status: string;
    location_data: Record<string, any> | null;
    face_verification_data: Record<string, any> | null;
    smile_detected: boolean;
    created_at: string;
    updated_at: string | null;
  }
  
  export interface AttendanceUpdate {
    check_out_time?: string | null;
    status?: string | null;
    updated_at?: string | null;
    location_data?: Record<string, any> | null;
    face_verification_data?: Record<string, any> | null;
  }
  
  export interface AttendanceWithScheduleRead extends AttendanceRead {
    student_name?: string | null;
    course_name?: string | null;
    schedule_day?: string | null;
    schedule_time?: string | null;
  }
  
  export interface CheckInRequest {
    location_data: Record<string, any>;
    face_verification_data: Record<string, any>;
  }