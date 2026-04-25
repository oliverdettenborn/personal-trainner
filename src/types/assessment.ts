export interface Student {
  id: string;
  name: string;
  createdAt: number;
}

export interface Assessment {
  id: string;
  studentId: string;
  createdAt: number;
  
  // Medidas Frente - Antes
  frente_antes_data?: string;
  frente_antes_peso?: string;
  frente_antes_ombros?: string;
  frente_antes_cintura?: string;
  
  // Medidas Frente - Depois
  frente_depois_data?: string;
  frente_depois_peso?: string;
  frente_depois_ombros?: string;
  frente_depois_cintura?: string;
  
  // Medidas Costas - Antes
  costas_antes_data?: string;
  costas_antes_peso?: string;
  costas_antes_ombros?: string;
  costas_antes_coxas?: string;
  
  // Medidas Costas - Depois
  costas_depois_data?: string;
  costas_depois_peso?: string;
  costas_depois_ombros?: string;
  costas_depois_coxas?: string;
  
  // Feedback Panels
  positivo_1?: string;
  positivo_2?: string;
  positivo_3?: string;
  positivo_4?: string;
  
  melhorar_1?: string;
  melhorar_2?: string;
  melhorar_3?: string;
  melhorar_4?: string;
  
  ajuste_1?: string;
  ajuste_2?: string;
  ajuste_3?: string;
  ajuste_4?: string;
  
  // Observações e Metas
  observacoes?: string;
  proxima_meta?: string;
  
  // Fotos
  photo_frente_antes?: string;
  photo_frente_depois?: string;
  photo_costas_antes?: string;
  photo_costas_depois?: string;
}

export interface AssessmentDB {
  students: Record<string, Student>;
  assessments: Record<string, Assessment>;
}
