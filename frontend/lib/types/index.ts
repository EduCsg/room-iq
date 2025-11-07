export interface Bloco {
  bloco_id: number;
  nome: string;
  descricao?: string;
  andar?: string;
}

export interface Equipamento {
  equipamento_id: number;
  nome: string;
  descricao?: string;
  quantidade: number;
}

export interface Sala {
  sala_id: number;
  nome: string;
  descricao?: string;
  capacidade: number;
  bloco_id?: number;
  bloco_nome?: string;
  equipamentos?: Equipamento[];
}

export interface Usuario {
  usuario_id: number;
  nome: string;
  email: string;
  data_criacao?: string;
  data_atualizacao?: string;
}

export interface Reserva {
  reserva_id: number;
  status: "pendente" | "confirmada" | "cancelada";
  data_reserva: string;
  hora_inicio: string;
  hora_fim?: string;
  usuario_id?: number;
  sala_id?: number;
  usuario_nome?: string;
  sala_nome?: string;
  bloco_nome?: string;
}
