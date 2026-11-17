/**
 * Módulo: src/demo/app.js
 * Disciplina: Estrutura de Dados — Trabalho P2
 * Tema A: Ordenação Dividir-para-Conquistar (Quick Sort vs. Merge Sort)
 *
 * Implementa a geração determinística de passos (snapshots) com exatamente a
 * mesma lógica, contadores de comparações e trocas/movimentações do módulo
 * Python (src/algoritmo.py), além do motor de visualização interativa.
 */

(function () {
  "use strict";

  // =========================================================================
  // 1. CENÁRIOS PRÉ-CONFIGURADOS
  // =========================================================================
  const SCENARIOS = {
    average: [38, 27, 43, 3, 9, 82, 10, 19, 54, 1, 76, 45, 23, 61, 12],
    worst: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20],
    reversed: [20, 19, 18, 17, 16, 15, 14, 13, 12, 11, 10, 9, 8, 7, 6, 5, 4, 3, 2, 1],
  };

  // =========================================================================
  // 2. ESTADO GLOBAL DA APLICAÇÃO
  // =========================================================================
  const state = {
    mode: "quick", // "quick" | "merge" | "compare"
    baseArray: [...SCENARIOS.average],
    quickSteps: [],
    mergeSteps: [],
    quickCursor: 0,
    mergeCursor: 0,
    isPlaying: false,
    timerId: null,
    delayMs: 280,
  };

  // =========================================================================
  // 3. REFERÊNCIAS DO DOM
  // =========================================================================
  const dom = {
    modeButtons: document.querySelectorAll(".mode-btn"),
    visualizerGrid: document.getElementById("visualizer-grid"),
    cardQuick: document.getElementById("card-quick"),
    cardMerge: document.getElementById("card-merge"),

    btnScenarioAverage: document.getElementById("btn-scenario-average"),
    btnScenarioWorst: document.getElementById("btn-scenario-worst"),
    btnScenarioReversed: document.getElementById("btn-scenario-reversed"),
    customForm: document.getElementById("custom-array-form"),
    customInput: document.getElementById("custom-array-input"),
    validationMsg: document.getElementById("validation-message"),

    btnPlay: document.getElementById("btn-play"),
    btnPause: document.getElementById("btn-pause"),
    btnPrev: document.getElementById("btn-prev"),
    btnStep: document.getElementById("btn-step"),
    btnReset: document.getElementById("btn-reset"),
    speedSlider: document.getElementById("speed-slider"),
    speedLabel: document.getElementById("speed-label"),

    // Elementos do Card Quick Sort
    statusQuick: document.getElementById("status-quick"),
    compQuick: document.getElementById("comp-quick"),
    swapQuick: document.getElementById("swap-quick"),
    stepQuick: document.getElementById("step-quick"),
    barsQuick: document.getElementById("bars-quick"),
    currentLogQuick: document.getElementById("current-log-quick"),
    historyCountQuick: document.getElementById("history-count-quick"),
    historyListQuick: document.getElementById("history-list-quick"),

    // Elementos do Card Merge Sort
    statusMerge: document.getElementById("status-merge"),
    compMerge: document.getElementById("comp-merge"),
    swapMerge: document.getElementById("swap-merge"),
    stepMerge: document.getElementById("step-merge"),
    barsMerge: document.getElementById("bars-merge"),
    currentLogMerge: document.getElementById("current-log-merge"),
    historyCountMerge: document.getElementById("history-count-merge"),
    historyListMerge: document.getElementById("history-list-merge"),
  };

  // =========================================================================
  // 4. GERADOR DE PASSOS DO QUICK SORT (PIVÔ FIXO — LOMUTO)
  // =========================================================================
  /**
   * Gera a sequência completa de estados (snapshots) do Quick Sort com pivô fixo
   * no último elemento, espelhando exatamente src/algoritmo.py.
   *
   * @param {number[]} inputArray
   * @returns {Array<Object>}
   */
  function generateQuickSortSteps(inputArray) {
    const arr = [...inputArray];
    const n = arr.length;
    const steps = [];
    const sortedSet = new Set();
    const metricas = { comparacoes: 0, trocas: 0 };

    function pushStep(config) {
      steps.push({
        array: [...arr],
        activeRange: config.activeRange || null,
        pivotIndex: config.pivotIndex !== undefined ? config.pivotIndex : null,
        comparing: config.comparing || [],
        swapping: config.swapping || [],
        sortedIndices: Array.from(sortedSet),
        comparacoes: metricas.comparacoes,
        trocas: metricas.trocas,
        log: config.log,
        done: Boolean(config.done),
      });
    }

    pushStep({
      log: `Vetor inicial carregado com ${n} elemento(s). Estratégia: pivô fixo no último elemento (particionamento de Lomuto).`,
    });

    function particionar(inicio, fim) {
      const pivo = arr[fim];
      let i = inicio - 1;

      pushStep({
        activeRange: [inicio, fim],
        pivotIndex: fim,
        log: `Particionando sub-array [${inicio}..${fim}]: pivô fixo escolhido é arr[${fim}] = ${pivo}.`,
      });

      for (let j = inicio; j < fim; j++) {
        metricas.comparacoes += 1;
        const menorOuIgual = arr[j] <= pivo;

        pushStep({
          activeRange: [inicio, fim],
          pivotIndex: fim,
          comparing: [j, fim],
          log: `Comparando arr[${j}] (${arr[j]}) <= pivô (${pivo}): ${
            menorOuIgual ? "Verdadeiro" : "Falso"
          }.`,
        });

        if (menorOuIgual) {
          i += 1;
          const temp = arr[i];
          arr[i] = arr[j];
          arr[j] = temp;
          metricas.trocas += 1;

          pushStep({
            activeRange: [inicio, fim],
            pivotIndex: fim,
            swapping: i === j ? [i] : [i, j],
            log:
              i === j
                ? `Incrementa i=${i}: elemento arr[${j}] (${arr[i]}) permanece na posição ${i} (troca contabilizada no particionamento).`
                : `Incrementa i=${i} e troca arr[${i}] (${arr[j]}) com arr[${j}] (${arr[i]}).`,
          });
        }
      }

      const indiceFinalPivo = i + 1;
      const tempPivo = arr[indiceFinalPivo];
      arr[indiceFinalPivo] = arr[fim];
      arr[fim] = tempPivo;
      metricas.trocas += 1;

      pushStep({
        activeRange: [inicio, fim],
        swapping: indiceFinalPivo === fim ? [fim] : [indiceFinalPivo, fim],
        log: `Reposicionando pivô (${pivo}) para seu índice definitivo ${indiceFinalPivo} (troca entre índices ${indiceFinalPivo} e ${fim}).`,
      });

      sortedSet.add(indiceFinalPivo);

      pushStep({
        activeRange: [inicio, fim],
        log: `Pivô ${pivo} fixado na posição definitiva ${indiceFinalPivo}.`,
      });

      return indiceFinalPivo;
    }

    function quickSortRecursivo(inicio, fim) {
      if (inicio < fim) {
        const indicePivo = particionar(inicio, fim);
        quickSortRecursivo(inicio, indicePivo - 1);
        quickSortRecursivo(indicePivo + 1, fim);
      } else if (inicio === fim && inicio >= 0 && inicio < n) {
        sortedSet.add(inicio);
        pushStep({
          activeRange: [inicio, fim],
          log: `Sub-array unitário no índice ${inicio} (valor ${arr[inicio]}) já está ordenado.`,
        });
      }
    }

    if (n > 1) {
      quickSortRecursivo(0, n - 1);
    } else if (n === 1) {
      sortedSet.add(0);
    }

    for (let k = 0; k < n; k++) {
      sortedSet.add(k);
    }

    pushStep({
      done: true,
      log: `Quick Sort concluído! Total: ${metricas.comparacoes} comparações e ${metricas.trocas} trocas.`,
    });

    return steps;
  }

  // =========================================================================
  // 5. GERADOR DE PASSOS DO MERGE SORT
  // =========================================================================
  /**
   * Gera a sequência completa de estados (snapshots) do Merge Sort,
   * contabilizando comparações e movimentações de escrita exatamente como
   * em src/algoritmo.py.
   *
   * @param {number[]} inputArray
   * @returns {Array<Object>}
   */
  function generateMergeSortSteps(inputArray) {
    const arr = [...inputArray];
    const n = arr.length;
    const steps = [];
    const sortedSet = new Set();
    const metricas = { comparacoes: 0, trocas: 0 };

    function pushStep(config) {
      steps.push({
        array: [...arr],
        activeRange: config.activeRange || null,
        pivotIndex: null,
        comparing: config.comparing || [],
        swapping: config.swapping || [],
        sortedIndices: Array.from(sortedSet),
        comparacoes: metricas.comparacoes,
        trocas: metricas.trocas,
        log: config.log,
        done: Boolean(config.done),
      });
    }

    pushStep({
      log: `Vetor inicial carregado com ${n} elemento(s). Estratégia: divisão recursiva ao meio e intercalação estável.`,
    });

    function intercalar(inicio, meio, fim) {
      const esquerda = arr.slice(inicio, meio);
      const direita = arr.slice(meio, fim + 1);
      const tamEsquerda = esquerda.length;
      const tamDireita = direita.length;
      const isFinalMerge = inicio === 0 && fim === n - 1;

      pushStep({
        activeRange: [inicio, fim],
        log: `Intercalando subvetores [${inicio}..${meio - 1}] (${esquerda.join(
          ", "
        )}) e [${meio}..${fim}] (${direita.join(", ")}).`,
      });

      let i = 0;
      let j = 0;
      let k = inicio;

      while (i < tamEsquerda && j < tamDireita) {
        metricas.comparacoes += 1;
        const valEsq = esquerda[i];
        const valDir = direita[j];
        const idxVisualEsq = Math.min(inicio + i, fim);
        const idxVisualDir = Math.min(meio + j, fim);

        pushStep({
          activeRange: [inicio, fim],
          comparing: [idxVisualEsq, idxVisualDir],
          log: `Comparando esquerda[${i}] (${valEsq}) <= direita[${j}] (${valDir}): ${
            valEsq <= valDir ? `seleciona ${valEsq}` : `seleciona ${valDir}`
          }.`,
        });

        if (valEsq <= valDir) {
          arr[k] = valEsq;
          metricas.trocas += 1;
          if (isFinalMerge) {
            sortedSet.add(k);
          }
          pushStep({
            activeRange: [inicio, fim],
            swapping: [k],
            log: `Escrevendo ${valEsq} (da metade esquerda) na posição ${k}.`,
          });
          i += 1;
        } else {
          arr[k] = valDir;
          metricas.trocas += 1;
          if (isFinalMerge) {
            sortedSet.add(k);
          }
          pushStep({
            activeRange: [inicio, fim],
            swapping: [k],
            log: `Escrevendo ${valDir} (da metade direita) na posição ${k}.`,
          });
          j += 1;
        }
        k += 1;
      }

      while (i < tamEsquerda) {
        const valEsq = esquerda[i];
        arr[k] = valEsq;
        metricas.trocas += 1;
        if (isFinalMerge) {
          sortedSet.add(k);
        }
        pushStep({
          activeRange: [inicio, fim],
          swapping: [k],
          log: `Copiando elemento restante ${valEsq} da metade esquerda para a posição ${k}.`,
        });
        i += 1;
        k += 1;
      }

      while (j < tamDireita) {
        const valDir = direita[j];
        arr[k] = valDir;
        metricas.trocas += 1;
        if (isFinalMerge) {
          sortedSet.add(k);
        }
        pushStep({
          activeRange: [inicio, fim],
          swapping: [k],
          log: `Copiando elemento restante ${valDir} da metade direita para a posição ${k}.`,
        });
        j += 1;
        k += 1;
      }

      pushStep({
        activeRange: [inicio, fim],
        log: `Subvetor [${inicio}..${fim}] intercalado com sucesso: [${arr
          .slice(inicio, fim + 1)
          .join(", ")}].`,
      });
    }

    function mergeSortRecursivo(inicio, fim) {
      const tamanho = fim - inicio + 1;
      if (tamanho <= 1) {
        return;
      }

      const meioRelativo = Math.floor(tamanho / 2);
      const meioAbsoluto = inicio + meioRelativo;

      pushStep({
        activeRange: [inicio, fim],
        log: `Dividindo subvetor [${inicio}..${fim}] ao meio em [${inicio}..${
          meioAbsoluto - 1
        }] e [${meioAbsoluto}..${fim}].`,
      });

      mergeSortRecursivo(inicio, meioAbsoluto - 1);
      mergeSortRecursivo(meioAbsoluto, fim);
      intercalar(inicio, meioAbsoluto, fim);
    }

    if (n > 1) {
      mergeSortRecursivo(0, n - 1);
    }

    for (let idx = 0; idx < n; idx++) {
      sortedSet.add(idx);
    }

    pushStep({
      done: true,
      log: `Merge Sort concluído! Total: ${metricas.comparacoes} comparações e ${metricas.trocas} movimentações.`,
    });

    return steps;
  }

  // =========================================================================
  // 6. RENDERIZAÇÃO VISUAL E ATUALIZAÇÃO DE INTERFACE
  // =========================================================================
  function renderAlgorithmCard(algoKey) {
    const isQuick = algoKey === "quick";
    const steps = isQuick ? state.quickSteps : state.mergeSteps;
    const cursor = isQuick ? state.quickCursor : state.mergeCursor;
    const step = steps[cursor];

    if (!step) return;

    const barsContainer = isQuick ? dom.barsQuick : dom.barsMerge;
    const compEl = isQuick ? dom.compQuick : dom.compMerge;
    const swapEl = isQuick ? dom.swapQuick : dom.swapMerge;
    const stepEl = isQuick ? dom.stepQuick : dom.stepMerge;
    const statusEl = isQuick ? dom.statusQuick : dom.statusMerge;
    const currentLogEl = isQuick ? dom.currentLogQuick : dom.currentLogMerge;
    const historyCountEl = isQuick ? dom.historyCountQuick : dom.historyCountMerge;
    const historyListEl = isQuick ? dom.historyListQuick : dom.historyListMerge;

    // Atualiza métricas numéricas
    compEl.textContent = String(step.comparacoes);
    swapEl.textContent = String(step.trocas);
    stepEl.textContent = `${cursor} / ${steps.length - 1}`;
    currentLogEl.textContent = step.log;

    // Atualiza badge de status
    if (step.done) {
      statusEl.textContent = "Concluído";
      statusEl.className = "status-pill status-done";
    } else if (state.isPlaying) {
      statusEl.textContent = "Executando";
      statusEl.className = "status-pill status-running";
    } else if (cursor > 0) {
      statusEl.textContent = "Pausado";
      statusEl.className = "status-pill status-running";
    } else {
      statusEl.textContent = "Pronto";
      statusEl.className = "status-pill status-ready";
    }

    // Cálculo de altura proporcional das barras (suporta positivos, zero e negativos)
    const values = step.array;
    const minVal = Math.min(...values);
    const maxVal = Math.max(...values);
    const offset = minVal < 1 ? 1 - minVal : 0;
    const adjustedMax = maxVal + offset;

    const sortedSet = new Set(step.sortedIndices);
    const comparingSet = new Set(step.comparing);
    const swappingSet = new Set(step.swapping);

    barsContainer.innerHTML = "";
    const compactFont = values.length > 22;

    values.forEach((val, idx) => {
      const slot = document.createElement("div");
      slot.className = "bar-slot";

      if (
        step.activeRange &&
        idx >= step.activeRange[0] &&
        idx <= step.activeRange[1] &&
        !step.done
      ) {
        slot.classList.add("in-active-range");
      }

      const bar = document.createElement("div");
      bar.className = "bar";

      // Prioridade visual dos estados
      if (swappingSet.has(idx)) {
        bar.classList.add("state-swapping");
      } else if (comparingSet.has(idx)) {
        bar.classList.add("state-comparing");
      } else if (step.pivotIndex === idx) {
        bar.classList.add("state-pivot");
      } else if (sortedSet.has(idx)) {
        bar.classList.add("state-sorted");
      } else if (
        step.activeRange &&
        idx >= step.activeRange[0] &&
        idx <= step.activeRange[1]
      ) {
        bar.classList.add("state-active");
      }

      const normalized = adjustedMax > 0 ? (val + offset) / adjustedMax : 1;
      const heightPercent = Math.max(12, Math.round(normalized * 92));
      bar.style.height = `${heightPercent}%`;

      const valueLabel = document.createElement("span");
      valueLabel.className = "bar-value";
      if (compactFont) {
        valueLabel.style.fontSize = "0.66rem";
      }
      valueLabel.textContent = String(val);

      const indexLabel = document.createElement("span");
      indexLabel.className = "bar-index";
      indexLabel.textContent = `[${idx}]`;

      bar.appendChild(valueLabel);
      slot.appendChild(bar);
      slot.appendChild(indexLabel);
      barsContainer.appendChild(slot);
    });

    // Atualiza histórico de operações até o cursor atual
    historyCountEl.textContent = String(cursor + 1);
    historyListEl.innerHTML = "";
    const startHistory = Math.max(0, cursor - 25);
    for (let i = cursor; i >= startHistory; i--) {
      const li = document.createElement("li");
      if (i === cursor) {
        li.className = "active-history-item";
      }
      li.textContent = `#${i}: ${steps[i].log}`;
      historyListEl.appendChild(li);
    }
  }

  function isCurrentModeFinished() {
    const quickDone = state.quickCursor >= state.quickSteps.length - 1;
    const mergeDone = state.mergeCursor >= state.mergeSteps.length - 1;

    if (state.mode === "quick") return quickDone;
    if (state.mode === "merge") return mergeDone;
    return quickDone && mergeDone;
  }

  function isCurrentModeAtStart() {
    if (state.mode === "quick") return state.quickCursor === 0;
    if (state.mode === "merge") return state.mergeCursor === 0;
    return state.quickCursor === 0 && state.mergeCursor === 0;
  }

  function updatePlaybackButtons() {
    const finished = isCurrentModeFinished();
    const atStart = isCurrentModeAtStart();

    dom.btnPlay.disabled = state.isPlaying || finished;
    dom.btnPause.disabled = !state.isPlaying;
    dom.btnStep.disabled = state.isPlaying || finished;
    dom.btnPrev.disabled = state.isPlaying || atStart;
  }

  function renderAll() {
    if (state.mode === "quick" || state.mode === "compare") {
      renderAlgorithmCard("quick");
    }
    if (state.mode === "merge" || state.mode === "compare") {
      renderAlgorithmCard("merge");
    }
    updatePlaybackButtons();
  }

  // =========================================================================
  // 7. CONTROLE DE REPRODUÇÃO (PLAY, PAUSE, STEP, RESET)
  // =========================================================================
  function pauseSimulation() {
    state.isPlaying = false;
    if (state.timerId !== null) {
      clearInterval(state.timerId);
      state.timerId = null;
    }
    renderAll();
  }

  function stepForward() {
    let advanced = false;

    if (
      (state.mode === "quick" || state.mode === "compare") &&
      state.quickCursor < state.quickSteps.length - 1
    ) {
      state.quickCursor += 1;
      advanced = true;
    }

    if (
      (state.mode === "merge" || state.mode === "compare") &&
      state.mergeCursor < state.mergeSteps.length - 1
    ) {
      state.mergeCursor += 1;
      advanced = true;
    }

    if (!advanced || isCurrentModeFinished()) {
      pauseSimulation();
    } else {
      renderAll();
    }
  }

  function stepBackward() {
    if (state.isPlaying) return;

    if ((state.mode === "quick" || state.mode === "compare") && state.quickCursor > 0) {
      state.quickCursor -= 1;
    }
    if ((state.mode === "merge" || state.mode === "compare") && state.mergeCursor > 0) {
      state.mergeCursor -= 1;
    }

    renderAll();
  }

  function playSimulation() {
    if (state.isPlaying || isCurrentModeFinished()) return;

    state.isPlaying = true;
    renderAll();

    state.timerId = setInterval(() => {
      stepForward();
    }, state.delayMs);
  }

  function resetSimulation() {
    pauseSimulation();
    state.quickCursor = 0;
    state.mergeCursor = 0;
    renderAll();
  }

  function loadArray(newArray) {
    pauseSimulation();
    hideValidationError();
    state.baseArray = [...newArray];
    state.quickSteps = generateQuickSortSteps(state.baseArray);
    state.mergeSteps = generateMergeSortSteps(state.baseArray);
    state.quickCursor = 0;
    state.mergeCursor = 0;
    renderAll();
  }

  // =========================================================================
  // 8. ALTERNÂNCIA DE MODO E CENÁRIOS
  // =========================================================================
  function setMode(newMode) {
    pauseSimulation();
    state.mode = newMode;

    dom.modeButtons.forEach((btn) => {
      btn.classList.toggle("active", btn.dataset.mode === newMode);
    });

    if (newMode === "quick") {
      dom.visualizerGrid.className = "visualizer-grid single-mode";
      dom.cardQuick.hidden = false;
      dom.cardMerge.hidden = true;
    } else if (newMode === "merge") {
      dom.visualizerGrid.className = "visualizer-grid single-mode";
      dom.cardQuick.hidden = true;
      dom.cardMerge.hidden = false;
    } else {
      dom.visualizerGrid.className = "visualizer-grid compare-mode";
      dom.cardQuick.hidden = false;
      dom.cardMerge.hidden = false;
    }

    renderAll();
  }

  function setActiveScenarioButton(activeBtn) {
    [
      dom.btnScenarioAverage,
      dom.btnScenarioWorst,
      dom.btnScenarioReversed,
    ].forEach((btn) => btn.classList.remove("active-scenario"));

    if (activeBtn) {
      activeBtn.classList.add("active-scenario");
    }
  }

  function showValidationError(msg) {
    dom.validationMsg.textContent = msg;
    dom.validationMsg.hidden = false;
  }

  function hideValidationError() {
    dom.validationMsg.textContent = "";
    dom.validationMsg.hidden = true;
  }

  function updateSpeedFromSlider() {
    const sliderVal = Number(dom.speedSlider.value); // 1 (lento) .. 100 (rápido)
    // Mapeia 1..100 para 950ms..30ms
    state.delayMs = Math.round(950 - ((sliderVal - 1) / 99) * 920);
    dom.speedLabel.textContent = `${state.delayMs} ms`;

    if (state.isPlaying) {
      clearInterval(state.timerId);
      state.timerId = setInterval(() => {
        stepForward();
      }, state.delayMs);
    }
  }

  // =========================================================================
  // 9. EVENT LISTENERS E INICIALIZAÇÃO
  // =========================================================================
  dom.modeButtons.forEach((btn) => {
    btn.addEventListener("click", () => setMode(btn.dataset.mode));
  });

  dom.btnScenarioAverage.addEventListener("click", () => {
    setActiveScenarioButton(dom.btnScenarioAverage);
    loadArray(SCENARIOS.average);
  });

  dom.btnScenarioWorst.addEventListener("click", () => {
    setActiveScenarioButton(dom.btnScenarioWorst);
    loadArray(SCENARIOS.worst);
  });

  dom.btnScenarioReversed.addEventListener("click", () => {
    setActiveScenarioButton(dom.btnScenarioReversed);
    loadArray(SCENARIOS.reversed);
  });

  dom.customForm.addEventListener("submit", (event) => {
    event.preventDefault();
    const raw = dom.customInput.value.trim();

    if (!raw) {
      showValidationError(
        "Digite uma lista de números inteiros separados por vírgula (ex: 15, 4, 22, 8, 11)."
      );
      return;
    }

    const parts = raw
      .split(",")
      .map((item) => item.trim())
      .filter((item) => item.length > 0);

    if (parts.length < 2 || parts.length > 40) {
      showValidationError(
        "Informe entre 2 e 40 números inteiros para uma visualização clara."
      );
      return;
    }

    const parsed = [];
    for (const part of parts) {
      if (!/^-?\d+$/.test(part)) {
        showValidationError(
          `Valor inválido encontrado: "${part}". Utilize apenas números inteiros separados por vírgula.`
        );
        return;
      }
      parsed.push(Number.parseInt(part, 10));
    }

    setActiveScenarioButton(null);
    loadArray(parsed);
  });

  dom.btnPlay.addEventListener("click", playSimulation);
  dom.btnPause.addEventListener("click", pauseSimulation);
  dom.btnStep.addEventListener("click", stepForward);
  dom.btnPrev.addEventListener("click", stepBackward);
  dom.btnReset.addEventListener("click", resetSimulation);
  dom.speedSlider.addEventListener("input", updateSpeedFromSlider);

  // Inicialização padrão com o Caso Médio
  updateSpeedFromSlider();
  loadArray(SCENARIOS.average);
})();
