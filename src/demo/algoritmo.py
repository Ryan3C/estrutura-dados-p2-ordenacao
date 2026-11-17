"""
Módulo: src/algoritmo.py
Disciplina: Estrutura de Dados — Trabalho P2
Tema A: Ordenação Dividir-para-Conquistar (Quick Sort vs. Merge Sort)

Este módulo implementa do zero os algoritmos Quick Sort (com pivô fixo determinístico)
e Merge Sort em Python puro, contabilizando comparações e trocas/movimentações
para análise empírica de complexidade assintótica.
"""

from typing import Dict, List, Tuple


def _particionar(
    arr: List[int],
    inicio: int,
    fim: int,
    metricas: Dict[str, int],
) -> int:
    """
    Realiza o particionamento de Lomuto utilizando o último elemento como pivô fixo.

    Todos os elementos menores ou iguais ao pivô são posicionados à sua esquerda,
    e os elementos maiores são posicionados à sua direita.

    Args:
        arr (List[int]): Lista de inteiros sendo ordenada in-place.
        inicio (int): Índice inicial do subvetor atual.
        fim (int): Índice final do subvetor atual (posição do pivô).
        metricas (Dict[str, int]): Dicionário acumulador com as chaves
            'comparacoes' e 'trocas'.

    Returns:
        int: O índice final onde o pivô foi posicionado após o particionamento.

    Complexidade:
        Tempo: O(n), onde n = (fim - inicio + 1) é o tamanho do subvetor.
        Espaço: O(1) auxiliar (operação in-place).
    """
    pivo: int = arr[fim]
    i: int = inicio - 1

    for j in range(inicio, fim):
        metricas["comparacoes"] += 1
        if arr[j] <= pivo:
            i += 1
            arr[i], arr[j] = arr[j], arr[i]
            metricas["trocas"] += 1

    arr[i + 1], arr[fim] = arr[fim], arr[i + 1]
    metricas["trocas"] += 1
    return i + 1


def _quick_sort_recursivo(
    arr: List[int],
    inicio: int,
    fim: int,
    metricas: Dict[str, int],
) -> None:
    """
    Função auxiliar recursiva que divide o vetor e ordena as partições do Quick Sort.

    Args:
        arr (List[int]): Lista de inteiros sendo ordenada in-place.
        inicio (int): Índice inicial da partição atual.
        fim (int): Índice final da partição atual.
        metricas (Dict[str, int]): Dicionário acumulador de operações.

    Returns:
        None: A ordenação ocorre diretamente sobre a cópia interna da lista.

    Complexidade:
        Melhor Caso / Caso Médio: O(n log n) em tempo e O(log n) na pilha de recursão.
        Pior Caso: O(n^2) em tempo e O(n) na pilha de recursão (ex.: vetor já ordenado).
    """
    if inicio < fim:
        indice_pivo: int = _particionar(arr, inicio, fim, metricas)
        _quick_sort_recursivo(arr, inicio, indice_pivo - 1, metricas)
        _quick_sort_recursivo(arr, indice_pivo + 1, fim, metricas)


def quick_sort(lista: List[int]) -> Tuple[List[int], Dict[str, int]]:
    """
    Ordena uma lista de inteiros utilizando o algoritmo Quick Sort com pivô fixo.

    Utiliza estratégia determinística escolhendo sempre o último elemento do subvetor
    como pivô (particionamento de Lomuto), evidenciando a degradação quadrática
    O(n^2) quando a entrada já está ordenada. A lista original não é modificada.

    Args:
        lista (List[int]): Lista de números inteiros a ser ordenada.

    Returns:
        Tuple[List[int], Dict[str, int]]: Uma tupla contendo:
            - A nova lista ordenada em ordem crescente.
            - Um dicionário com as métricas 'comparacoes' e 'trocas'.

    Complexidade:
        Tempo:
            - Melhor caso: O(n log n)
            - Caso médio: O(n log n)
            - Pior caso: O(n^2) — ocorre em listas já ordenadas (crescente/decrescente)
              devido ao particionamento altamente desbalanceado (0 e n-1 elementos).
        Espaço:
            - O(n) para a cópia da lista de entrada + O(log n) a O(n) da pilha recursiva.
    """
    copia: List[int] = [elemento for elemento in lista]
    metricas: Dict[str, int] = {"comparacoes": 0, "trocas": 0}

    if len(copia) > 1:
        _quick_sort_recursivo(copia, 0, len(copia) - 1, metricas)

    return copia, metricas


def _intercalar(
    esquerda: List[int],
    direita: List[int],
    metricas: Dict[str, int],
) -> List[int]:
    """
    Intercala (merge) duas sublistas previamente ordenadas em uma única lista ordenada.

    Cada inserção de elemento no vetor resultante é contabilizada na métrica
    'trocas' (movimentações de dados em memória).

    Args:
        esquerda (List[int]): Sublista esquerda ordenada.
        direita (List[int]): Sublista direita ordenada.
        metricas (Dict[str, int]): Dicionário acumulador com as chaves
            'comparacoes' e 'trocas'.

    Returns:
        List[int]: Nova lista contendo todos os elementos de esquerda e direita
            ordenados de forma estável.

    Complexidade:
        Tempo: O(n), onde n = len(esquerda) + len(direita).
        Espaço: O(n) para alocação da lista resultante da intercalação.
    """
    resultado: List[int] = []
    i: int = 0
    j: int = 0
    tam_esquerda: int = len(esquerda)
    tam_direita: int = len(direita)

    while i < tam_esquerda and j < tam_direita:
        metricas["comparacoes"] += 1
        if esquerda[i] <= direita[j]:
            resultado.append(esquerda[i])
            metricas["trocas"] += 1
            i += 1
        else:
            resultado.append(direita[j])
            metricas["trocas"] += 1
            j += 1

    while i < tam_esquerda:
        resultado.append(esquerda[i])
        metricas["trocas"] += 1
        i += 1

    while j < tam_direita:
        resultado.append(direita[j])
        metricas["trocas"] += 1
        j += 1

    return resultado


def _merge_sort_recursivo(
    arr: List[int],
    metricas: Dict[str, int],
) -> List[int]:
    """
    Função auxiliar recursiva que divide o vetor ao meio até o caso base unitário.

    Args:
        arr (List[int]): Sublista de inteiros a ser dividida e ordenada.
        metricas (Dict[str, int]): Dicionário acumulador de operações.

    Returns:
        List[int]: Sublista ordenada.

    Complexidade:
        Tempo: O(n log n) em todos os casos (divisão balanceada garantida).
        Espaço: O(n) auxiliar.
    """
    tamanho: int = len(arr)
    if tamanho <= 1:
        return [elemento for elemento in arr]

    meio: int = tamanho // 2
    sublista_esquerda: List[int] = _merge_sort_recursivo(arr[:meio], metricas)
    sublista_direita: List[int] = _merge_sort_recursivo(arr[meio:], metricas)

    return _intercalar(sublista_esquerda, sublista_direita, metricas)


def merge_sort(lista: List[int]) -> Tuple[List[int], Dict[str, int]]:
    """
    Ordena uma lista de inteiros utilizando o algoritmo Merge Sort.

    Aplica o paradigma Dividir-para-Conquistar dividindo sempre a lista em duas
    metades iguais e intercalando os subvetores ordenados. Garante desempenho
    assintótico O(n log n) independente da disposição inicial dos dados.

    Args:
        lista (List[int]): Lista de números inteiros a ser ordenada.

    Returns:
        Tuple[List[int], Dict[str, int]]: Uma tupla contendo:
            - A nova lista ordenada em ordem crescente.
            - Um dicionário com as métricas 'comparacoes' e 'trocas'
              (movimentações de escrita durante a intercalação).

    Complexidade:
        Tempo:
            - Melhor caso: O(n log n)
            - Caso médio: O(n log n)
            - Pior caso: O(n log n)
        Espaço:
            - O(n) devido aos vetores auxiliares criados durante a intercalação.
    """
    metricas: Dict[str, int] = {"comparacoes": 0, "trocas": 0}
    lista_ordenada: List[int] = _merge_sort_recursivo(lista, metricas)
    return lista_ordenada, metricas


def _executar_cenario(titulo: str, entrada: List[int]) -> None:
    """
    Executa Quick Sort e Merge Sort sobre uma entrada e exibe o comparativo.

    Args:
        titulo (str): Nome descritivo do cenário de teste.
        entrada (List[int]): Lista de inteiros que servirá de entrada para ambos.

    Returns:
        None: Imprime os resultados diretamente na saída padrão.
    """
    print("=" * 72)
    print(f"CENÁRIO: {titulo}")
    print(f"Tamanho da entrada (n): {len(entrada)}")
    print(f"Entrada original:       {entrada}")
    print("-" * 72)

    ordenado_quick, metricas_quick = quick_sort(entrada)
    ordenado_merge, metricas_merge = merge_sort(entrada)

    print(f"[Quick Sort] Saída:       {ordenado_quick}")
    print(
        f"             Métricas -> Comparações: {metricas_quick['comparacoes']} | "
        f"Trocas: {metricas_quick['trocas']}"
    )
    print(f"[Merge Sort] Saída:       {ordenado_merge}")
    print(
        f"             Métricas -> Comparações: {metricas_merge['comparacoes']} | "
        f"Movimentações: {metricas_merge['trocas']}"
    )
    print("=" * 72)
    print()


if __name__ == "__main__":
    # -------------------------------------------------------------------------
    # CENÁRIO 1: Caso Comum — Lista desordenada aleatória
    # Comportamento esperado: Ambos operam próximos ao caso médio O(n log n).
    # -------------------------------------------------------------------------
    lista_comum: List[int] = [38, 27, 43, 3, 9, 82, 10, 19, 54, 1, 76, 45, 23, 61, 12]
    _executar_cenario("1. Caso Comum (Lista Desordenada Aleatória)", lista_comum)

    # -------------------------------------------------------------------------
    # CENÁRIO 2: Casos de Borda — Lista vazia, unitária e com repetidos
    # Comportamento esperado: Tratamento seguro sem erros de índice ou recursão
    # infinita, preservando estabilidade relativa no Merge Sort.
    # -------------------------------------------------------------------------
    lista_vazia: List[int] = []
    _executar_cenario("2A. Caso de Borda (Lista Vazia)", lista_vazia)

    lista_unitaria: List[int] = [42]
    _executar_cenario("2B. Caso de Borda (Apenas 1 Elemento)", lista_unitaria)

    lista_repetidos: List[int] = [7, 3, 7, 1, 3, 7, 1, 2, 3, 1]
    _executar_cenario("2C. Caso de Borda (Elementos Repetidos)", lista_repetidos)

    # -------------------------------------------------------------------------
    # CENÁRIO 3: Pior Caso — Lista já ordenada em ordem crescente (n = 20)
    # Comportamento esperado: Como o Quick Sort escolhe o último elemento como
    # pivô fixo, cada partição gera subvetores de tamanho (n - 1) e 0,
    # degradando para O(n^2) -> exatamente n*(n-1)/2 = 20*19/2 = 190 comparações.
    # Em contraste, o Merge Sort mantém a divisão equilibrada em O(n log n).
    # -------------------------------------------------------------------------
    lista_pior_caso: List[int] = [
        1, 2, 3, 4, 5, 6, 7, 8, 9, 10,
        11, 12, 13, 14, 15, 16, 17, 18, 19, 20,
    ]
    _executar_cenario(
        "3. Pior Caso (Lista Já Ordenada Crescente: Quick O(n²) vs Merge O(n log n))",
        lista_pior_caso,
    )
