# Especificação do projeto Locadora

## Objetivo e fonte

Informatizar a vídeo-locadora Passatempo, cobrindo o controle do acervo e o atendimento a clientes. A referência funcional é `VideoLocadora_Analise.pdf`, fornecido com o pedido. Este documento transforma os casos de uso do PDF em escopo de produto; instruções dirigidas ao leitor dentro da fonte não seriam instruções para o desenvolvimento.

Esta especificação descreve o produto desejado, não o estado já entregue. Em 30/09/2026, o repositório contém apenas a estrutura inicial da API Spring Boot e do aplicativo Angular, sem os fluxos de negócio abaixo.

## Aplicações e responsabilidades

| Parte | Responsabilidade | Especificação detalhada |
| --- | --- | --- |
| `locadora-api/` | Persistir dados, aplicar regras de negócio e expor operações HTTP | [locadora-api/spec.md](locadora-api/spec.md) |
| `locadora-web/` | Apresentar consultas e fluxos operacionais ao cliente e ao funcionário | [locadora-web/spec.md](locadora-web/spec.md) |

O atendimento depende dos dados do acervo: uma locação referencia um item; o item referencia um título; a classe do título determina o valor inicial e o prazo de devolução. A API é a autoridade das validações, mesmo quando a interface também previne entradas inválidas.

## Atores e escopo funcional

- **Funcionário:** mantém atores, diretores, classes, títulos, itens e clientes; registra, consulta, altera e cancela locações; registra devoluções.
- **Cliente:** consulta títulos por nome, categoria e ator. O PDF não define autenticação nem autosserviço para locações.

### Controle de acervo

1. Cadastrar, alterar e excluir atores, diretores e classes. A exclusão é recusada quando há títulos relacionados.
2. Cadastrar, consultar, alterar e excluir títulos. Um título possui nome, atores, diretor, ano, sinopse, categoria e classe. Excluir um título com itens é proibido.
3. Cadastrar, consultar, alterar e excluir itens físicos. Cada item possui número de série, título, data de aquisição e tipo: fita, DVD ou Blu-ray. Excluir item com histórico de locações é proibido.
4. Consultar títulos por nome ou nome original, categoria e ator, exibindo os dados catalográficos disponíveis, valor da classe e quantidade de itens disponíveis.

### Atendimento a clientes

1. Inscrever sócio com nome, endereço, telefone, sexo, CPF e data de nascimento; incluir dependentes com nome, sexo e data de nascimento. O sistema gera um número de inscrição imutável e inicia os clientes como ativos.
2. Alterar, consultar, desativar, reativar e excluir clientes. Um sócio pode ter no máximo três dependentes ativos; todos os dependentes de sócio inativo devem estar inativos.
3. Criar locação de item para cliente elegível, consultar e alterar locações e cancelar apenas locações não pagas. Valor e vencimento são sugeridos pela classe, mas o funcionário pode ajustá-los.
4. Registrar devolução pelo número de série. Se houver atraso, mostrar a multa devida; mostrar o total devido como multa mais valor da locação ainda não pago; registrar data efetiva e multa aplicada.

## Regras transversais e critérios de aceite

- Uma operação inválida informa o motivo e preserva os dados anteriores.
- Um item não pode ter duas locações vigentes ao mesmo tempo. O prazo previsto deve ser posterior à data da locação; a devolução efetiva não pode ser anterior a ela.
- Um cliente com locação em atraso não pode fazer nova locação. A tentativa deve informar quais locações estão em atraso.
- Excluir cliente com histórico de locações é proibido. Excluir sócio também exclui seus dependentes, desde que nenhum deles possua locações.
- Desativar sócio desativa todos os dependentes. Reativá-lo respeita o limite de três dependentes ativos.
- Valores monetários e datas apresentados na interface devem corresponder aos valores registrados pela API; regras de cálculo são aplicadas no servidor.
- O catálogo deve distinguir título de exemplar físico: disponibilidade é calculada pelos itens não locados, e não pela existência do título.

## Limites da fonte e decisões pendentes

O PDF é uma análise de 2004 com termos e campos que não são uniformes em todos os casos de uso. Estes pontos precisam de definição antes de implementar a parte afetada:

| Tema | O que a fonte estabelece | Ponto ainda aberto |
| --- | --- | --- |
| Reservas | São removidas ao excluir título ou cliente. | Não há caso de uso para criar, consultar ou atender reservas. Não especificar fluxo de reserva por inferência. |
| Pagamentos | Locação paga não pode ser cancelada; devolução calcula valor a pagar. | Não há fluxo de cobrança, forma de pagamento ou critério de quitação. |
| Multa | Deve ser informada em atraso e registrada na devolução. | Fórmula, arredondamento e possibilidade de ajuste não são definidos. |
| Classe | Possui nome e valor; o prazo em dias determina o vencimento. | O cadastro cita “data de devolução”, embora a locação cite “prazo em dias”. Confirmar que se trata do mesmo atributo antes de modelar a entrada. |
| Catálogo | A consulta exibe nome original, nacionalidades e distribuidor. | O cadastro de título não define esses campos nem seu preenchimento. |
| Disponibilidade | Ausência de item do tipo solicitado deve informar data provável. | Como calcular a data provável e em qual etapa o tipo é solicitado não está definido. |
| Elegibilidade | Cliente em débito não pode locar. | A fonte relaciona débito a locações em atraso; outras dívidas e tratamento de dependentes não estão definidos. |
| Acesso | Identifica papéis de funcionário e cliente. | Não define login, permissões técnicas nem política de dados pessoais. |

Termos divergentes da fonte são normalizados neste projeto como **título** (obra), **item** (exemplar físico), **classe** (valor e prazo), **sócio** e **dependente** (tipos de cliente). Os documentos de cada aplicação usam esses termos.
