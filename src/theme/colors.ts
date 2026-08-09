export interface ThemeColors {
  background: string;
  surface: string;
  surfaceElevated: string;
  border: string;
  text: string;
  textSecondary: string;
  tint: string;
  danger: string;
}

export const lightTheme: ThemeColors = {
  background: '#FFFFFF',
  surface: '#F7F8FA',
  surfaceElevated: '#FFFFFF',
  border: '#E5E7EB',
  text: '#111827',
  textSecondary: '#6B7280',
  tint: '#2563EB',
  danger: '#DC2626',
};

export const darkTheme: ThemeColors = {
  background: '#0B0F19',
  surface: '#161B26',
  surfaceElevated: '#1F2430',
  border: '#2A3140',
  text: '#F3F4F6',
  textSecondary: '#9CA3AF',
  tint: '#60A5FA',
  danger: '#F87171',
};
