# Especificação da API

Esta especificação detalha a responsabilidade da API descrita em [../spec.md](../spec.md). É um contrato funcional proposto para implementação; nenhum endpoint de negócio existe ainda. O projeto atual usa Java 21, Spring Boot 4.1.1 e Maven. A persistência e seu banco ainda não foram escolhidos no código.

## Recursos do domínio

| Recurso | Dados necessários segundo o PDF | Relações e regras |
| --- | --- | --- |
| Ator | Identificador, nome | Pode participar de vários títulos; não excluir se relacionado a título. |
| Diretor | Identificador, nome | Pode dirigir títulos; não excluir se relacionado a título. |
| Classe | Identificador, nome, valor de locação, prazo em dias | Define valores iniciais da locação; não excluir se relacionada a título. |
| Título | Identificador, nome, atores, diretor, ano, sinopse, categoria, classe | Possui zero ou mais itens; não excluir enquanto possuir itens. |
| Item | Identificador, número de série único, título, data de aquisição, tipo | Tipo: fita, DVD ou Blu-ray; não excluir se possuir qualquer locação. |
| Cliente | Número de inscrição gerado, nome, sexo, data de nascimento, situação ativo/inativo | Sócio acrescenta endereço, telefone e CPF; dependente referencia sócio. |
| Locação | Identificador, item, cliente, data da locação, valor, devolução prevista, devolução efetiva opcional, multa aplicada opcional, situação de pagamento | Um item tem no máximo uma locação vigente; preservar o valor praticado na data da locação. |

`nome original`, `nacionalidades` e `distribuidor` aparecem apenas na consulta de título; sua inclusão no cadastro precisa de confirmação. `Situação de pagamento` é necessária para aplicar o bloqueio de cancelamento, mas o PDF não define o processo que a altera. Reservas são citadas em exclusões, sem dados ou operações suficientes para um contrato próprio.

## Operações previstas

Os caminhos abaixo são uma proposta de interface HTTP, sujeita a ajuste quando o contrato for implementado. Identificadores internos podem ser diferentes do número de inscrição e do número de série, que continuam pesquisáveis.

| Grupo | Operações |
| --- | --- |
| `atores`, `diretores`, `classes` | Listar, obter por identificador, criar, alterar e excluir. |
| `titulos` | Listar e buscar por nome/nome original, categoria ou ator; obter detalhes; criar, alterar e excluir. |
| `itens` | Listar e filtrar por título/tipo/disponibilidade; obter; criar, alterar e excluir; localizar por número de série. |
| `clientes` | Listar/obter, inscrever sócio, incluir dependente, alterar, ativar, desativar e excluir. |
| `locacoes` | Criar, listar/obter, alterar, cancelar e registrar devolução pelo número de série do item. |

## Processamento das regras

### Acervo

- Validar dados obrigatórios e referências antes de gravar; rejeitar identificadores desconhecidos e número de série duplicado.
- Rejeitar exclusão de ator, diretor ou classe ligada a título; título com itens; item com histórico de locações.
- Ao excluir título, remover as reservas relacionadas somente se o módulo de reservas vier a ser definido e implementado. Não criar uma operação de reserva apenas a partir dessa menção.
- Calcular disponibilidade de cada título a partir de itens sem locação vigente.

### Clientes

- Gerar número de inscrição no servidor; nunca aceitá-lo como campo alterável.
- Criar dependente apenas sob sócio existente e ativo, respeitando o máximo de três dependentes ativos.
- Desativar sócio e dependentes na mesma operação. Reativar sócio e no máximo três dependentes, sem ultrapassar o limite.
- Rejeitar exclusão de cliente com locações. Antes de excluir sócio, verificar também locações dos dependentes; se elegível, excluir o conjunto de forma atômica. Reservas associadas são tratadas quando esse módulo existir.

### Locação e devolução

- Ao criar, confirmar cliente elegível, item disponível e inexistência de locação em atraso para o cliente. A verificação de disponibilidade e a gravação devem impedir concorrência que gere duas locações vigentes do mesmo item.
- Usar data corrente como data da locação. Sugerir valor pela classe atual do título e data prevista pela soma do prazo em dias à data corrente. Aceitar substituição de valor e data prevista pelo funcionário, desde que válidos.
- Guardar na locação o valor e o vencimento efetivos; alteração posterior da classe não reescreve locações existentes.
- Exigir devolução prevista posterior à data da locação. Em alteração, preservar a consistência das datas e do vínculo com item/cliente.
- Cancelar somente locação sem pagamento registrado, após confirmação na interface. O cancelamento remove a locação conforme a fonte; antes da implementação, definir se histórico/auditoria exige preservá-la com outro estado.
- Na devolução, encontrar a locação vigente do item informado; rejeitar item sem locação vigente. Usar data corrente como devolução efetiva, nunca anterior à locação. Exibir multa em atraso e total devido; registrar multa aplicada. A fórmula da multa e o modo de registrar pagamentos dependem de decisão de negócio.

## Respostas e integridade

- Responder com erros de validação por campo quando aplicável; para conflito de estado ou vínculo, incluir mensagem legível que permita ao frontend explicar a causa.
- Retornar ausência de recurso como `404`, dados inválidos como `400` e conflito de integridade/estado como `409`. Uma falha não deve deixar cadastro, locação ou devolução parcialmente gravados.
- Evitar expor CPF em listagens e respostas onde ele não é necessário; não registrar dados pessoais em logs de erro.
- Datas representam dias locais de operação da locadora; valor monetário exige tipo decimal, sem cálculo em ponto flutuante binário.

## Condições para considerar a API pronta

- Todas as operações previstas são consumíveis pelo frontend, com representação e erros consistentes.
- As restrições do [spec geral](../spec.md) são aplicadas no servidor, incluindo exclusões, limite de dependentes, elegibilidade e exclusividade de locação vigente.
- Uma devolução atualiza a disponibilidade do item e registra corretamente data e multa definida pelo negócio.
- Regras ainda abertas no spec geral são decididas antes de concluir os fluxos de reserva, pagamento, multa e disponibilidade provável.
