# Estrutura de Dados — Trabalho P2
## Tema A — Ordenação Dividir-para-Conquistar: Quick Sort vs. Merge Sort

> 🎥 **Vídeo Explicativo (Apresentação, Simulação e Código):**  
> **[👉 Clique aqui para assistir ao vídeo completo](INSIRA_AQUI_O_LINK_DO_SEU_VIDEO)**

---

### Identificação do Projeto
* **Nome Completo:** Ryan Morais Corato
* **RA:** 2840482521001
* **Disciplina:** Estrutura de Dados
* **Tema:** Tema A — Ordenação Dividir-para-Conquistar: Quick Sort vs. Merge Sort

---

### Estrutura do Repositório

```text
├── README.md               # Documentação teórica, análise assintótica e diário de engenharia
└── src/
    ├── algoritmo.py        # Implementação pura em Python (Quick Sort e Merge Sort + métricas)
    └── demo/               # Simulador Visual Interativo (HTML5, CSS3 e Vanilla JS)
        ├── index.html
        ├── styles.css
        └── app.js
```

#### Como Executar
1. **Testes e Métricas em Python (`src/algoritmo.py`):**
   ```bash
   python src/algoritmo.py
   ```
2. **Simulador Visual Interativo (`src/demo/index.html`):**
   Abra o arquivo `src/demo/index.html` diretamente em qualquer navegador moderno (duplo clique), sem necessidade de servidor ou dependências externas.

---

### Fundamentação Teórica: O Paradigma Dividir-para-Conquistar

O paradigma **Dividir-para-Conquistar** (*Divide and Conquer*) resolve um problema quebrando-o recursivamente em subproblemas menores da mesma natureza até atingir um caso base trivial (vetores de tamanho `0` ou `1`), combinando em seguida as soluções parciais. Embora ambos os algoritmos sigam esse paradigma, eles concentram seu esforço computacional em etapas opostas:

1. **Quick Sort (Trabalho concentrado na Divisão):**
   * **Dividir:** Escolhe um elemento como **pivô** (nesta implementação, o último elemento do subvetor via particionamento de *Lomuto*) e reorganiza o vetor *in-place* para que todos os elementos menores ou iguais ao pivô fiquem à sua esquerda, e os maiores à sua direita. Ao final dessa etapa, o pivô já ocupa sua posição definitiva.
   * **Conquistar:** Ordena recursivamente os subvetores à esquerda e à direita do pivô.
   * **Combinar:** Nenhuma operação é necessária, pois a ordenação ocorre diretamente sobre o vetor original.

2. **Merge Sort (Trabalho concentrado na Combinação):**
   * **Dividir:** Calcula o índice central (`meio = tamanho // 2`) e divide o vetor em duas metades de tamanhos iguais (ou diferindo por no máximo 1 elemento), independentemente dos valores armazenados.
   * **Conquistar:** Ordena recursivamente a sublista esquerda e a sublista direita até atingir sublistas unitárias.
   * **Combinar (Intercalação / *Merge*):** Percorre simultaneamente as duas sublistas já ordenadas, comparando seus menores elementos disponíveis e copiando-os em ordem crescente para um novo vetor resultante, preservando a **estabilidade** (elementos iguais mantêm sua ordem relativa original).

#### Aplicações Reais na Computação
* **Quick Sort:** Amplamente utilizado em bibliotecas padrão de linguagens de sistema para ordenação em memória principal (RAM) devido à excelente **localidade de cache** e baixo consumo de memória auxiliar — por exemplo, a função `qsort()` da biblioteca padrão da linguagem C e como componente base de algoritmos híbridos como o **Introsort** (usado no `std::sort` do C++ e no .NET), que inicia com Quick Sort e alterna para Heap Sort caso a recursão ultrapasse um limite seguro.
* **Merge Sort:** Padrão ouro para **ordenação externa** (*External Sorting*), quando volumes massivos de dados em bancos de dados ou sistemas de arquivos não cabem na memória RAM e precisam ser ordenados em blocos no disco. Também é ideal para ordenar **listas encadeadas** (onde não há acesso aleatório $O(1)$ por índice) e serve de base para o **Timsort** (algoritmo nativo do Python em `sorted()`/`list.sort()` e do Java para objetos), que explora a estabilidade do Merge Sort.

---

### Análise de Complexidade Assintótica (Big-O)

| Métrica / Cenário | Quick Sort (Pivô Fixo) | Merge Sort |
| :--- | :---: | :---: |
| **Tempo — Melhor Caso** | $O(n \log n)$ | $O(n \log n)$ |
| **Tempo — Caso Médio** | $O(n \log n)$ | $O(n \log n)$ |
| **Tempo — Pior Caso** | **$O(n^2)$** | **$O(n \log n)$** |
| **Espaço Auxiliar** | $O(\log n)$ a $O(n)$ *(pilha recursiva)* | $O(n)$ *(vetores auxiliares)* |
| **Estabilidade** | Não estável | Estável |
| **Ordenação *In-Place*** | Sim | Não |

#### Prova Matemática da Divergência no Pior Caso

* **Por que o Quick Sort com pivô fixo degrada para $O(n^2)$?**  
  Quando o algoritmo escolhe deterministicamente o último elemento como pivô (`pivo = arr[fim]`) e recebe um vetor já ordenado em ordem crescente, o pivô é sempre o **maior elemento** do subvetor atual. Como resultado, o particionamento gera duas partições totalmente desbalanceadas: uma sublista à esquerda com $n - 1$ elementos e uma sublista vazia à direita com $0$ elementos.  
  A relação de recorrência torna-se:
  $$T(n) = T(n - 1) + T(0) + \Theta(n) = T(n - 1) + \Theta(n)$$
  Expandindo a somatória de comparações realizadas em cada nível da recursão, obtemos uma Progressão Aritmética:
  $$C(n) = \sum_{k=1}^{n-1} k = (n - 1) + (n - 2) + \dots + 2 + 1 = \frac{n(n - 1)}{2} = \frac{n^2 - n}{2} \in \Theta(n^2)$$
  *(Exemplo empírico comprovado no código para $n = 20$: $\frac{20 \times 19}{2} = 190$ comparações).*

* **Por que o Merge Sort garante $O(n \log n)$ em todos os casos?**  
  A divisão do vetor ocorre estritamente pelo índice central (`meio = len(arr) // 2`), ignorando a ordenação prévia dos elementos. Isso garante uma árvore de recursão perfeitamente balanceada com altura $h = \lceil \log_2 n \rceil$. Em cada nível da árvore, a operação de intercalação (`_intercalar`) percorre todos os $n$ elementos exatamente uma vez, realizando no máximo $n - 1$ comparações por nível.  
  Pelo **Teorema Mestre** ($a = 2, b = 2, f(n) = \Theta(n)$):
  $$T(n) = 2T\left(\frac{n}{2}\right) + \Theta(n) \implies T(n) \in \Theta(n \log n)$$

---

### Diário de Engenharia com IA

Registro transparente do processo de engenharia assistida por Inteligência Artificial (Gemini)  na construção deste projeto:

#### Prompt 1 — Implementação dos Algoritmos Base (`src/algoritmo.py`)
> **Prompt utilizado:**  
> Atue como um Engenheiro de Software Sênior e Professor Universitário de Estrutura de Dados.
Contexto: Estou desenvolvendo o Trabalho P2 da disciplina de Estrutura de Dados. O tema escolhido é: Tema A — Ordenação Dividir-para-Conquistar: Quick Sort vs. Merge Sort.
Tarefa: Crie apenas o código completo e funcional do arquivo src/algoritmo.py.
Requisitos obrigatórios (não omita nada):
1. Implemente ambos os algoritmos (quick_sort e merge_sort) do zero em Python puro, sem usar sort(), sorted() ou bibliotecas externas.
2. No quick_sort, utilize uma estratégia determinística de pivô fixo (ex: último ou primeiro elemento) para que seja possível demonstrar claramente o pior caso O(n²) em arrays já ordenados.
3. Use type hints em todas as funções e escreva docstrings claras em português explicando os parâmetros, retornos e complexidade.
4. Inclua contadores explícitos para número de comparações e número de trocas/movimentações (swaps) em ambos os algoritmos, retornando o array ordenado junto com essas métricas.
5. No bloco íf __name__ == "__main__":, crie 3 cenários de teste comentados:
	• Caso Comum: Lista desordenada aleatória.
	• Caso de Borda: Lista vazia, com 1 elemento ou com elementos repetidos.
	• Pior Caso: Lista já ordenada em ordem crescente (provando o salto de operações no Quick Sort O(n²) frente à estabilidade \(O(n \log n)\) do Merge Sort).
Regra de ouro: Entregue o código 100% completo, sem resumos, sem // ... resto do código e pronto para rodar sem erros de sintaxe.

#### Prompt 2 — Construção do Simulador Visual Interativo (`src/demo/`)
> **Prompt utilizado:**  
> Perfeito. Agora, mantendo exatamente a mesma lógica dos algoritmos que você criou no passo anterior, construa o Simulador Visual Interativo para a pasta src/demo/.
Tarefa: Gere o código completo dos 3 arquivos: index.html, styles.css e app.js.
Requisitos obrigatórios:
1. Autocontido: O index.html deve abrir diretamente no navegador via duplo clique, usando apenas HTML5, CSS3 e JavaScript puro (Vanilla JS), sem frameworks externos ou servidores.
2. Alternância de Algoritmos: Permita ao usuário escolher facilmente entre Quick Sort e Merge Sort (ou visualizar/comparar ambos).
3. Controles de Execução: Inclua botões funcionais para Executar (Play), Próximo Passo (Step), Pausar e Reiniciar (Reset), além de um controle de velocidade da animação.
4. Cenários Pré-configurados: Crie botões para carregar rapidamente:
	• Caso Médio (array aleatório).
	• Cenário Pior Caso (array já ordenado de forma crescente, destacando o comportamento O(n²) do Quick Sort com pivô fixo vs. \(O(n \log n)\) do Merge Sort).
	• Array Invertido ou Customizado (permitindo digitar números separados por vírgula).
5. Visualização Gráfica Clara: Represente os elementos como barras verticais proporcionais (com o número visível em cada barra). Use cores distintas e uma legenda visual clara para destacar: Pivô, Sub-array ativo, Elementos sendo comparados, Troca (Swap) / Sobrescrita e Elementos já ordenados.
6. Painel de Métricas e Log: Exiba em tempo real na tela o log explicativo em português do que está acontecendo no passo atual, além dos contadores acumulados de Comparações e Trocas/Movimentações.
Regra de ouro: Entregue cada arquivo (index.html, styles.css e app.js) em um bloco de código separado e 100% completo, sem pular linhas ou resumir funções.

#### Prompt 3 — Documentação Técnica e Roteirização (`README.md` e Vídeo)
> **Prompt utilizado:**  
> Agora, com base nos códigos Python e JavaScript que construímos, gere dois textos completos:
1. O conteúdo completo do arquivo README.md (em formato Markdown pronto para copiar):
• Cabeçalho com espaços reservados para meu Nome Completo, RA, Tema A (Quick Sort vs. Merge Sort) e Link do Vídeo Explicativo em destaque no topo.
• Resumo teórico explicando como o paradigma Dividir-para-Conquistar funciona em cada um dos dois algoritmos e exemplos reais de uso na computação.
• Tabela comparativa de Complexidade Assintótica (Big-O) de Tempo (Melhor, Médio e Pior Caso) e Espaço Auxiliar para Quick Sort e Merge Sort, explicando matematicamente por que o pior caso O(n²) ocorre no Quick Sort com pivô fixo e por que o Merge Sort mantém \(O(n \log n)\).
• Seção "Diário de Engenharia com IA" já formatada com espaço para os 3 prompts e para o relato de ajuste manual.
2. Um roteiro falado para o meu Vídeo Explicativo (4 a 7 minutos):
• Dividido exatamente conforme a rubrica:
	• Parte 1 — Conceito e Complexidade (~1 min): Apresentação e explicação do Big-O.
	• Parte 2 — Simulação Passo a Passo (~3 min): O que clicar no simulador (mostrando o botão Cenário Pior Caso e o Próximo Passo) para provar a diferença de comparações na tela.
	• Parte 3 — Explicação do Código Python (~1,5 min): Onde apontar no src/algoritmo.py a recursão, a escolha do pivô, a intercalação (merge) e os contadores de operações.

#### Relato de Revisão, Testes e Ajustes Manuais
> Foi necessário registrar melhor refinamento dos prompts, para a IA obter maior entendimento sobre as requisições necessárias e concluir este trabalho.

> Formatação do prompt no Markdown. Ao colar o prompt 1 no README, o trecho __name__== "__main__" foi anexado como negrito e ilegível, sendo necessário ser colocado em crasse.

> Organização da Estrutura de Arquivos e Repositório: Durante a preparação local dos arquivos e o envio ao GitHub, revisei as extensões dos arquivos (removendo sufixos `.txt` gerados na criação inicial) e estruturei manualmente a hierarquia de pastas (`src/algoritmo.py` e `src/demo/`), garantindo que os caminhos relativos entre `index.html`, `styles.css` e `app.js` funcionassem corretamente tanto localmente quanto hospedados no repositório.
