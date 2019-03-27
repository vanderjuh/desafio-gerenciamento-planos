export interface Plano {
    id: number;
    titulo: string;
    tipo: number;
    statusAndamento: number;
    dataInicio: string;
    dataTermino: string;
    custo: number;
    responsavel: number;
    interessados: number[];
    pertence: number;
    descricao: string;
    ordemSubPlanos: number[];
}
