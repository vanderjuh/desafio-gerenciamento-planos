import { Responsavel } from './responsaveis/responsavel';
import { TiposPlano } from './tipos-plano/tipos-plano';

export interface Plano {
    id: number;
    titulo: string;
    tipo: number;
    statusAndamento: string;
    dataInicio: string;
    dataTermino: string;
    custo: number;
    responsavel: number;
    interessados: number[];
    pertence: number;
    descricao: string;
}
