export interface Bloco {
  bloco_id?: number;
  nome: string;
  descricao?: string;
  andar?: string;
}

export interface Equipamento {
  equipamento_id?: number;
  nome?: string;
  descricao?: string;
  quantidade: number;
}

export interface Sala {
  sala_id?: number;
  nome: string;
  descricao?: string;
  capacidade?: number;
  bloco_id?: number;
}

export interface SalaEquipamento {
  sala_id: number;
  equipamento_id: number;
}

export interface Usuario {
  usuario_id?: number;
  nome: string;
  email: string;
  senha: string;
  data_criacao?: Date;
  data_atualizacao?: Date;
}

export interface Reserva {
  reserva_id?: number;
  status: string;
  data_reserva: Date;
  hora_inicio: Date;
  hora_fim?: Date;
  usuario_id?: number;
  sala_id?: number;
}

export interface SalaWithDetails extends Sala {
  bloco_nome?: string;
  equipamentos?: Equipamento[];
}

export interface ReservaWithDetails extends Reserva {
  usuario_nome?: string;
  sala_nome?: string;
  bloco_nome?: string;
}
