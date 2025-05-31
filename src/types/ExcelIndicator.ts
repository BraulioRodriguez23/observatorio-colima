// src/types/ExcelIndicator.ts

export interface ExcelIndicator {
  id: number;
  year: number;
  municipio?: string;
  mes?: string;
  temporada?: string;
  puente?: string;
  ocupacion?: number;
}
export interface MonthlyStats {
  year: number;
  month: string;
  municipality: string;
  occupancyRate: number;
  touristFlow: number;
  economicImpact: number;
}
export interface SeasonStats {
  year: number;
  season: string;
  municipality: string;
  occupancyRate: number;
  roomOffer: number;
  occupiedRooms: number;
  availableRooms: number;
  stay: number;
  density: number;
  touristsPerNight: number;
  avgSpending: number;
  economicImpact: number;
  touristFlow: number;
}
export interface BridgeStats {
  year: number;
  bridgeName: string;
  municipality: string;
  occupancyRate: number;
}
export interface ExcelRecord {
  id: number | string;
  year: number;
  municipality: string;
  month?: string;
  season?: string;
  bridgeName?: string;
  occupancyRate: number;
}
export interface ExcelRecordMap {
  [key: string]: ExcelIndicator;
}
export interface ExcelUploadResponse {
  message: string;
  success: boolean;
  data?: ExcelIndicator[];
  error?: string;
}
export interface ExcelUploadParams {
  file: File;
  type: 'mensual' | 'temporada' | 'puentes';
  token: string;
}
export interface ExcelUploadResult {
  success: boolean;
  message: string;
  data?: ExcelIndicator[];
  error?: string;
}
export interface ExcelUploadError {
  success: false;
  message: string;
  error: string;
}
export interface ExcelUploadSuccess {
  success: true;
  message: string;
  data: ExcelIndicator[];
}
export type ExcelUploadResponseType = ExcelUploadError | ExcelUploadSuccess;
export interface ExcelUploadState {
  loading: boolean;
  error: string | null;
  data: ExcelIndicator[];
  trigger: number;
  reload: () => void;
}
export interface UseExcelUploadParams {
  file: File;
  type: 'mensual' | 'temporada' | 'puentes';
  token: string;
}
export interface UseExcelUpload {
  data: ExcelIndicator[];
  loading: boolean;
  error: string | null;
  reload: () => void;
}
export interface UseExcelUploadResult {
  data: ExcelIndicator[];
  loading: boolean;
  error: string | null;
  reload: () => void;
}
export interface UseExcelUploadError {
  error: string;
  message: string;
}
export interface UseExcelUploadSuccess {
  data: ExcelIndicator[];
  message: string;
}
export interface UseExcelUploadResponse {
  success: boolean;
  data?: ExcelIndicator[];
  error?: string;
}
export interface UseExcelUploadResponseType {
  success: boolean;
  message: string;
  data?: ExcelIndicator[];
  error?: string;
}
export interface UseExcelUploadParams {
  file: File;
  type: 'mensual' | 'temporada' | 'puentes';
  token: string;
}
export interface UseExcelUploadResult {
  data: ExcelIndicator[];
  loading: boolean;
  error: string | null;
  reload: () => void;
}
export interface UseExcelUploadError {
  error: string;
  message: string;
}
export interface UseExcelUploadSuccess {
  data: ExcelIndicator[];
  message: string;
}
export interface UseExcelUploadResponse {
  success: boolean;
  data?: ExcelIndicator[];
  error?: string;
}
export interface UseExcelUploadResponseType {
  success: boolean;
  message: string;
  data?: ExcelIndicator[];
  error?: string;
}
export interface ExcelUploadHook {
  data: ExcelIndicator[];
  loading: boolean;
  error: string | null;
  reload: () => void;
}
export interface ExcelUploadHookParams {
  file: File;
  type: 'mensual' | 'temporada' | 'puentes';
  token: string;
}

export interface ExcelUploadHookResult {
  data: ExcelIndicator[];
  loading: boolean;
  error: string | null;
  reload: () => void;
}