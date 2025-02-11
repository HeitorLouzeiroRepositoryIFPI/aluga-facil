import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:8080/api',
});

export interface UploadResponse {
  url: string;
  success: boolean;
  message?: string;
}

export const UploadService = {
  async uploadFoto(file: File): Promise<UploadResponse> {
    try {
      const formData = new FormData();
      formData.append('file', file);

      const response = await api.post<UploadResponse>('/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      return response.data;
    } catch (error) {
      console.error('Erro ao fazer upload da foto:', error);
      return {
        url: '',
        success: false,
        message: 'Erro ao fazer upload da foto',
      };
    }
  },

  async uploadMultiplasFotos(files: File[]): Promise<UploadResponse[]> {
    try {
      const uploadPromises = files.map((file) => this.uploadFoto(file));
      const results = await Promise.all(uploadPromises);
      return results;
    } catch (error) {
      console.error('Erro ao fazer upload das fotos:', error);
      return files.map(() => ({
        url: '',
        success: false,
        message: 'Erro ao fazer upload das fotos',
      }));
    }
  },
};
