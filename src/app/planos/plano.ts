import { Responsavel } from './responsaveis/responsavel';
import { TiposPlano } from './tipos-plano/tipos-plano';

export interface Plano {
    id: number;
    titulo: string;
    tipo: number;
    status: string;
    prazo: string;
    responsavel: number;
    interessados: number[];
    subPlanos: number[];
}
