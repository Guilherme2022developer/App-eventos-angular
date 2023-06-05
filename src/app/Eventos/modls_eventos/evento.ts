export class Evento {
    id: string;
    nome: string;
    decricaoCurta: string;
    descricaoConga: string;
    dataInicio: Date;
    dataFim: Date;
    gratuito: Boolean;
    valor: string;
    online: Boolean;
    nomeEmpresa: string;
    endereco: Endereco;
    categoriaId: string;
    organizadorId: string;
}

export class Endereco{
    id: string;
    logradouro: string;
    numero: string;
    complemento: string;
    bairro: string;
    cep: string;
    cidade: string;
    estado: string;
    eventoId: string;
}

export interface Categoria{
    id: string;
    nome: string;
}