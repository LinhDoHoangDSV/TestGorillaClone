import { Request } from 'express';
export const DATASOURCE = 'DATA_SOURCE';

export enum Roles {
  ADMIN = 'ADMIN',
  HR = 'HR',
}

export enum QUESTION_TYPE {
  MULTIPLE_CHOICE = 'multiple_choice',
  ESSAY = 'essay',
  CODING = 'coding',
}

export enum TestAssignmentStatus {
  NOT_STARTED = 'not_started',
  IN_PROGRESS = 'in_progress',
  COMPLETED = 'completed',
}

export interface GoogleUserInfo {
  given_name: string;
  family_name: string;
  email: string;
}

export const userInfoUrl = ' https://www.googleapis.com/oauth2/v3/userinfo';

export interface TokenPayload {
  userId: number;
  role: string;
}

export interface RequestWithUserDto extends Request {
  user: {
    userId: number;
    gid?: string;
    role: string;
  };
}
