/**
 * Traduções para os diferentes idiomas suportados
 */
const translations = {
    pt: {
        title: "Cable Extrusion Pro: Calculadora DDR/DRB & Insights Técnicos",
        matrixLabel: "Tipo da Matriz",
        matrixTooltip: "Parte externa do cabeçote que define a espessura final.",
        toolLabel: "Tipo da Guia",
        toolTooltip: "Mandril (ou Tip) que centraliza o núcleo e define a zona de extrusão.",
        materialLabel: "Tipo de Material",
        cableLabel: "Diâmetro Final do Cabo (mm)",
        matrixDiameterLabel: "Diâmetro Interno da Matriz (mm)",
        guideOuterLabel: "Diâmetro Externo da Guia (mm)",
        calculateBtn: "Calcular",
        resetBtn: "Reiniciar",
        saveBtn: "Salvar Configuração",
        areaMatrixLabel: "Área da Matriz",
        areaFlowLabel: "Área de Fluxo",
        areaCableLabel: "Área Final do Cabo",
        obsTitle: "Observações Inteligentes",
        options: ["Tubular", "Semi-pressão", "Pressão"],
        errorMsg: "Por favor, insira um valor válido maior que zero.",
        ddrLow: "DDR baixo: risco de rugas.",
        ddrHigh: "DDR alto: risco de tensão excessiva.",
        ddrOk: "DDR dentro da faixa ideal.",
        drbLow: "DRB baixo: fluxo insuficiente.",
        drbHigh: "DRB alto: possível formação de bolhas.",
        drbOk: "DRB dentro da faixa ideal.",
        configSaved: "Configuração salva com sucesso!",
        configLoaded: "Configuração carregada!",
        validateError: "Por favor, corrija os erros antes de calcular.",
        // Novas dicas detalhadas
        ddrLowTip: "Possível risco de rugas na superfície da capa e acúmulo de material na saída. Recomenda-se aumentar levemente o diâmetro da matriz ou reduzir o diâmetro do cabo.",
        ddrHighTip: "Risco de tensão excessiva no material, podendo gerar defeitos como afinamento excessivo ou quebras. Verifique se a combinação está dentro das especificações do material.",
        ddrOkTip: "Relação adequada para estabilidade dimensional e bom acabamento superficial.",
        drbLowTip: "Fluxo insuficiente entre matriz e guia; pode dificultar a extrusão contínua. Ajuste necessário para evitar pontos de estrangulamento.",
        drbHighTip: "Excesso de espaço de fluxo pode gerar bolhas ou instabilidade no derretimento, além de afetar a pressão interna do cabeçote.",
        drbOkTip: "Fluxo equilibrado entre matriz e guia, garantindo estabilidade durante a extrusão."
    },
    en: {
        title: "Cable Extrusion Pro: DDR/DRB Calculator & Process Insights",
        matrixLabel: "Die Type",
        matrixTooltip: "External part of the head that defines the final thickness.",
        toolLabel: "Tip Type",
        toolTooltip: "Mandrel (or Tip) that centers the core and defines the extrusion zone.",
        materialLabel: "Material Type",
        cableLabel: "Final Cable Diameter (mm)",
        matrixDiameterLabel: "Die Inner Diameter (mm)",
        guideOuterLabel: "Tip Outer Diameter (mm)",
        calculateBtn: "Calculate",
        resetBtn: "Reset",
        saveBtn: "Save Configuration",
        areaMatrixLabel: "Die Area",
        areaFlowLabel: "Flow Area",
        areaCableLabel: "Final Cable Area",
        obsTitle: "Smart Observations",
        options: ["Tubular", "Semi-pressure", "Pressure"],
        errorMsg: "Please enter a valid value greater than zero.",
        ddrLow: "Low DDR: risk of wrinkles.",
        ddrHigh: "High DDR: risk of high tension.",
        ddrOk: "DDR within ideal range.",
        drbLow: "Low DRB: insufficient flow.",
        drbHigh: "High DRB: possible bubbles.",
        drbOk: "DRB within ideal range.",
        configSaved: "Configuration saved successfully!",
        configLoaded: "Configuration loaded!",
        validateError: "Please correct the errors before calculating.",
        // New detailed tips
        ddrLowTip: "Potential risk of wrinkles on the sheath surface and material buildup at the exit. It is recommended to slightly increase the die diameter or reduce the cable diameter.",
        ddrHighTip: "Risk of excessive tension in the material, possibly causing thinning or breaks. Check if the combination is within the material specifications.",
        ddrOkTip: "Adequate ratio for dimensional stability and smooth surface finish.",
        drbLowTip: "Insufficient flow between die and tip; may hinder continuous extrusion. Adjustment needed to avoid choking points.",
        drbHighTip: "Excessive flow space may cause bubbles or melting instability and affect the internal head pressure.",
        drbOkTip: "Balanced flow between die and tip, ensuring stability during extrusion."
    }
};


// Estado atual da aplicação
let state = {
    lang: "pt",
    lastCalculated: null
};

/**
 * Carrega as preferências salvas do usuário
 */
function loadPreferences() {
    try {
        const savedState = localStorage.getItem('ddrCalculatorState');
        if (savedState) {
            const parsedState = JSON.parse(savedState);

            // Atualiza o idioma primeiro
            if (parsedState.lang) {
                state.lang = parsedState.lang;
                document.getElementById("languageSelector").value = state.lang;
                switchLanguage();
            }

            // Preenche os campos do formulário
            if (parsedState.formData) {
                const formData = parsedState.formData;

                if (formData.matrixType) {
                    document.getElementById("matrixType").value = formData.matrixType;
                }

                if (formData.toolType) {
                    document.getElementById("toolType").value = formData.toolType;
                }

                if (formData.materialType) {
                    document.getElementById("materialType").value = formData.materialType;
                }

                if (formData.cableDiameter) {
                    document.getElementById("cableDiameter").value = formData.cableDiameter;
                }

                if (formData.matrixDiameter) {
                    document.getElementById("matrixDiameter").value = formData.matrixDiameter;
                }

                if (formData.guideOuterDiameter) {
                    document.getElementById("guideOuterDiameter").value = formData.guideOuterDiameter;
                }

                // Se todos os campos numéricos têm valores, recalcula
                if (formData.cableDiameter && formData.matrixDiameter && formData.guideOuterDiameter) {
                    calculateValues();
                }
            }

            showTemporaryMessage(translations[state.lang].configLoaded);
        }
    } catch (error) {
        console.error("Erro ao carregar preferências:", error);
    }
}

/**
 * Salva as preferências do usuário
 */
function savePreferences() {
    try {
        const formData = {
            matrixType: document.getElementById("matrixType").value,
            toolType: document.getElementById("toolType").value,
            materialType: document.getElementById("materialType").value,
            cableDiameter: document.getElementById("cableDiameter").value,
            matrixDiameter: document.getElementById("matrixDiameter").value,
            guideOuterDiameter: document.getElementById("guideOuterDiameter").value
        };

        const stateToSave = {
            lang: state.lang,
            formData: formData
        };

        localStorage.setItem('ddrCalculatorState', JSON.stringify(stateToSave));
        showTemporaryMessage(translations[state.lang].configSaved);
    } catch (error) {
        console.error("Erro ao salvar preferências:", error);
    }
}

/**
 * Mostra uma mensagem temporária ao usuário
 * @param {string} message - Mensagem a ser exibida
 */
function showTemporaryMessage(message) {
    const observations = document.getElementById("observations");
    const originalContent = observations.innerHTML;

    observations.innerHTML = `<div class="observation-item"><span class="observation-icon success-color">✓</span> ${message}</div>`;

    setTimeout(() => {
        observations.innerHTML = originalContent;
    }, 2000);
}

/**
 * Muda o idioma da interface
 */
function switchLanguage() {
    state.lang = document.getElementById("languageSelector").value;
    const t = translations[state.lang];

    // Atualiza textos da interface
    document.getElementById("title").innerText = t.title;
    document.getElementById("matrixLabel").childNodes[0].textContent = t.matrixLabel + " ";
    document.getElementById("matrixTooltip").innerText = t.matrixTooltip;
    document.getElementById("toolLabel").childNodes[0].textContent = t.toolLabel + " ";
    document.getElementById("toolTooltip").innerText = t.toolTooltip;
    document.getElementById("materialLabel").innerText = t.materialLabel;
    document.getElementById("cableLabel").innerText = t.cableLabel;
    document.getElementById("matrixDiameterLabel").innerText = t.matrixDiameterLabel;
    document.getElementById("guideOuterLabel").innerText = t.guideOuterLabel;
    document.getElementById("calculateBtn").innerText = t.calculateBtn;
    document.getElementById("resetBtn").innerText = t.resetBtn;
    document.getElementById("saveBtn").innerText = t.saveBtn;
    document.getElementById("areaMatrixLabel").innerText = t.areaMatrixLabel;
    document.getElementById("areaFlowLabel").innerText = t.areaFlowLabel;
    document.getElementById("areaCableLabel").innerText = t.areaCableLabel;
    document.getElementById("obsTitle").innerText = t.obsTitle;

    // Atualiza opções dos selects
    const opt = t.options;
    ['matrixType', 'toolType'].forEach(id => {
        const select = document.getElementById(id);
        select.options[0].text = opt[0];
        select.options[1].text = opt[1];
        select.options[2].text = opt[2];
    });

    // Atualiza mensagens de erro
    document.getElementById("cableDiameterError").innerText = t.errorMsg;
    document.getElementById("matrixDiameterError").innerText = t.errorMsg;
    document.getElementById("guideOuterDiameterError").innerText = t.errorMsg;

    // Se houver um cálculo recente, atualiza as observações
    if (state.lastCalculated) {
        updateObservations(
            state.lastCalculated.ddr,
            state.lastCalculated.drb,
            state.lastCalculated.material
        );
    }
}

/**
 * Valida os valores de entrada
 * @returns {boolean} Se todos os valores são válidos
 */
function validateInputs() {
    const inputs = [
        { id: "cableDiameter", errorId: "cableDiameterError" },
        { id: "matrixDiameter", errorId: "matrixDiameterError" },
        { id: "guideOuterDiameter", errorId: "guideOuterDiameterError" }
    ];

    let isValid = true;

    inputs.forEach(input => {
        const inputElement = document.getElementById(input.id);
        const errorElement = document.getElementById(input.errorId);
        const value = parseFloat(inputElement.value);

        if (isNaN(value) || value <= 0) {
            inputElement.classList.add("invalid");
            errorElement.style.display = "block";
            isValid = false;
        } else {
            inputElement.classList.remove("invalid");
            errorElement.style.display = "none";
        }
    });

    // Verificação adicional: a guia deve ser menor que a matriz
    const matrixDiameter = parseFloat(document.getElementById("matrixDiameter").value);
    const guideDiameter = parseFloat(document.getElementById("guideOuterDiameter").value);

    if (!isNaN(matrixDiameter) && !isNaN(guideDiameter) && guideDiameter >= matrixDiameter) {
        document.getElementById("guideOuterDiameter").classList.add("invalid");
        document.getElementById("guideOuterDiameterError").innerText =
            state.lang === "pt" ?
                "O diâmetro da guia deve ser menor que o da matriz." :
                "The guide diameter must be smaller than the matrix diameter.";
        document.getElementById("guideOuterDiameterError").style.display = "block";
        isValid = false;
    }

    return isValid;
}

/**
 * Calcula os valores de DDR e DRB
 */
function calculateValues() {
    if (!validateInputs()) {
        showTemporaryMessage(translations[state.lang].validateError);
        return;
    }

    const dCable = parseFloat(document.getElementById("cableDiameter").value);
    const dMatrix = parseFloat(document.getElementById("matrixDiameter").value);
    const dGuideOuter = parseFloat(document.getElementById("guideOuterDiameter").value);
    const material = document.getElementById("materialType").value;

    // Cálculo das áreas
    const areaCable = Math.PI * Math.pow(dCable / 2, 2);
    const areaMatrix = Math.PI * Math.pow(dMatrix / 2, 2);
    const areaFlow = areaMatrix - Math.PI * Math.pow(dGuideOuter / 2, 2);

    // Cálculo dos índices DDR e DRB
    const ddr = (areaMatrix / areaCable).toFixed(3);
    const drb = (areaMatrix / areaFlow).toFixed(3);

    // Atualiza os resultados na interface
    document.getElementById("matrixArea").innerText = areaMatrix.toFixed(2) + " mm²";
    document.getElementById("flowArea").innerText = areaFlow.toFixed(2) + " mm²";
    document.getElementById("cableArea").innerText = areaCable.toFixed(2) + " mm²";
    document.getElementById("ddrValue").innerText = ddr;
    document.getElementById("drbValue").innerText = drb;

    // Salva o último cálculo no estado
    state.lastCalculated = {
        ddr: ddr,
        drb: drb,
        material: material
    };

    // Atualiza os marcadores visuais nas réguas
    updateRulers(ddr, drb, material);

    // Atualiza as observações baseadas nos valores calculados
    updateObservations(ddr, drb, material);
}

/**
 * Atualiza os marcadores visuais nas réguas
 * @param {number} ddr - Valor DDR calculado
 * @param {number} drb - Valor DRB calculado
 * @param {string} material - Material selecionado
 */
function updateRulers(ddr, drb, material) {
    // Faixas recomendadas para cada material
    const recommendations = {
        PVC: {
            ddrMin: 1.1,
            ddrMax: 1.3,
            drbMin: 0.9,
            drbMax: 1.1,
            ddrAcceptMin: 1.0,
            ddrAcceptMax: 1.4,
            drbAcceptMin: 0.8,
            drbAcceptMax: 1.2
        },
        LSZH: {
            ddrMin: 1.2,
            ddrMax: 1.4,
            drbMin: 0.95,
            drbMax: 1.2,
            ddrAcceptMin: 1.1,
            ddrAcceptMax: 1.5,
            drbAcceptMin: 0.85,
            drbAcceptMax: 1.3
        },
        HDPE: {
            ddrMin: 1.3,
            ddrMax: 1.5,
            drbMin: 1.0,
            drbMax: 1.3,
            ddrAcceptMin: 1.2,
            ddrAcceptMax: 1.6,
            drbAcceptMin: 0.9,
            drbAcceptMax: 1.4
        },
        PBT: {
            ddrMin: 1.15,
            ddrMax: 1.35,
            drbMin: 0.95,
            drbMax: 1.25,
            ddrAcceptMin: 1.05,
            ddrAcceptMax: 1.45,
            drbAcceptMin: 0.85,
            drbAcceptMax: 1.35
        }
    };


    const limits = recommendations[material];

    // Escala máxima dinâmica para as réguas
    const ddrScale = Math.max(2.0, parseFloat(ddr) * 1.2);
    const drbScale = Math.max(2.0, parseFloat(drb) * 1.2);

    // Atualiza os marcadores
    updateRuler(
        "ddrRuler",
        "ddrFill",
        "ddrMarker",
        "ddrLabels",
        "ddrAcceptable",
        ddr,
        limits.ddrMin,
        limits.ddrMax,
        limits.ddrAcceptMin,
        limits.ddrAcceptMax,
        ddrScale
    );

    updateRuler(
        "drbRuler",
        "drbFill",
        "drbMarker",
        "drbLabels",
        "drbAcceptable",
        drb,
        limits.drbMin,
        limits.drbMax,
        limits.drbAcceptMin,
        limits.drbAcceptMax,
        drbScale
    );
}
/**
 * Atualiza uma régua específica
 * @param {string} rulerId - ID do elemento da régua
 * @param {string} fillId - ID do elemento de preenchimento
 * @param {string} markerId - ID do elemento marcador
 * @param {string} labelsId - ID do elemento de rótulos
 * @param {number} value - Valor a ser marcado
 * @param {number} min - Valor mínimo recomendado
 * @param {number} max - Valor máximo recomendado
 * @param {number} scale - Escala máxima da régua
 */
function updateRuler(
    rulerId,
    fillId,
    markerId,
    labelsId,
    acceptableId,
    value,
    min,
    max,
    acceptMin,
    acceptMax,
    scale
) {
    const ruler = document.getElementById(rulerId);
    const fill = document.getElementById(fillId);
    const marker = document.getElementById(markerId);
    const labels = document.getElementById(labelsId);
    const acceptable = document.getElementById(acceptableId);

    const rulerWidth = Math.max(ruler.clientWidth, 50);

    // Calcula faixa aceitável
    const acceptMinPos = (acceptMin / scale) * rulerWidth;
    const acceptMaxPos = (acceptMax / scale) * rulerWidth;

    const acceptableWidth = Math.max(5, (acceptMaxPos - acceptMinPos)); // pelo menos 5px
    acceptable.style.left = acceptMinPos + "px";
    acceptable.style.width = acceptableWidth + "px";


    // Ajusta a posição da zona recomendada
    const minPos = (min / scale) * rulerWidth;
    const maxPos = (max / scale) * rulerWidth;

    const fillWidth = Math.max(6, (maxPos - minPos));
    fill.style.left = minPos + "px";
    fill.style.width = fillWidth + "px";


    // Posiciona o marcador atual
    let markerPos = (value / scale) * rulerWidth;
    markerPos = Math.max(0, Math.min(rulerWidth, markerPos));
    marker.style.left = markerPos + "px";

    // Atualiza os TOOLTIPs:
    fill.setAttribute('data-tooltip', `Faixa ideal: ${min.toFixed(2)} – ${max.toFixed(2)}`);
    acceptable.setAttribute('data-tooltip', `Faixa aceitável: ${acceptMin.toFixed(2)} – ${acceptMax.toFixed(2)}`);

    // Atualiza os rótulos da escala
    updateRulerLabels(labels, scale);
}

/**
 * Atualiza os rótulos da escala de uma régua
 * @param {HTMLElement} labelsElement - Elemento DOM com os rótulos
 * @param {number} scale - Escala máxima da régua
 */
function updateRulerLabels(labelsElement, scale) {
    // Cria pontos intermediários para a escala
    const divisions = 5;
    labelsElement.innerHTML = '';

    for (let i = 0; i < divisions; i++) {
        const value = (scale * i / (divisions - 1)).toFixed(1);
        const span = document.createElement('span');
        span.innerText = value;
        labelsElement.appendChild(span);
    }
}

/**
 * Atualiza as observações baseadas nos valores calculados
 * @param {number} ddr - Valor DDR calculado
 * @param {number} drb - Valor DRB calculado
 * @param {string} material - Material selecionado
 */
function updateObservations(ddr, drb, material) {
    const t = translations[state.lang];
    const observationsDiv = document.getElementById("observations");

    const recommendations = {
        PVC: {
            ddrMin: 1.1,
            ddrMax: 1.3,
            drbMin: 0.9,
            drbMax: 1.1,
            ddrAcceptMin: 1.0,
            ddrAcceptMax: 1.4,
            drbAcceptMin: 0.8,
            drbAcceptMax: 1.2
        },
        LSZH: {
            ddrMin: 1.2,
            ddrMax: 1.4,
            drbMin: 0.95,
            drbMax: 1.2,
            ddrAcceptMin: 1.1,
            ddrAcceptMax: 1.5,
            drbAcceptMin: 0.85,
            drbAcceptMax: 1.3
        },
        HDPE: {
            ddrMin: 1.3,
            ddrMax: 1.5,
            drbMin: 1.0,
            drbMax: 1.3,
            ddrAcceptMin: 1.2,
            ddrAcceptMax: 1.6,
            drbAcceptMin: 0.9,
            drbAcceptMax: 1.4
        },
        PBT: {
            ddrMin: 1.15,
            ddrMax: 1.35,
            drbMin: 0.95,
            drbMax: 1.25,
            ddrAcceptMin: 1.05,
            ddrAcceptMax: 1.45,
            drbAcceptMin: 0.85,
            drbAcceptMax: 1.35
        }
    };


    const limits = recommendations[material];

    // Mensagens para DDR
    let ddrStatusMsg, ddrTipMsg, ddrIcon, ddrClass;
    if (parseFloat(ddr) < limits.ddrMin) {
        ddrStatusMsg = t.ddrLow;
        ddrTipMsg = t.ddrLowTip;
        ddrIcon = "⚠️";
        ddrClass = "warning-color";
    } else if (parseFloat(ddr) > limits.ddrMax) {
        ddrStatusMsg = t.ddrHigh;
        ddrTipMsg = t.ddrHighTip;
        ddrIcon = "❌";
        ddrClass = "error-color";
    } else {
        ddrStatusMsg = t.ddrOk;
        ddrTipMsg = t.ddrOkTip;
        ddrIcon = "✓";
        ddrClass = "success-color";
    }



    // Mensagens para DRB
    let drbStatusMsg, drbTipMsg, drbIcon, drbClass;
    if (parseFloat(drb) < limits.drbMin) {
        drbStatusMsg = t.drbLow;
        drbTipMsg = t.drbLowTip;
        drbIcon = "⚠️";
        drbClass = "warning-color";
    } else if (parseFloat(drb) > limits.drbMax) {
        drbStatusMsg = t.drbHigh;
        drbTipMsg = t.drbHighTip;
        drbIcon = "❌";
        drbClass = "error-color";
    } else {
        drbStatusMsg = t.drbOk;
        drbTipMsg = t.drbOkTip;
        drbIcon = "✓";
        drbClass = "success-color";
    }



    // Atualiza as observações na interface
    observationsDiv.innerHTML = `
<div class="observation-wrapper">
<div class="observation-card">
    <h4>DDR (${material}: ${limits.ddrMin.toFixed(2)} ~ ${limits.ddrMax.toFixed(2)})</h4>
    <div class="status">
        <span class="observation-icon ${ddrClass}">${ddrIcon}</span>
        <span>${ddrStatusMsg}</span>
    </div>
    <div class="tip">
        <span class="observation-icon">💡</span>
        <span>${ddrTipMsg}</span>
    </div>
</div>

<div class="observation-card">
    <h4>DRB (${material}: ${limits.drbMin.toFixed(2)} ~ ${limits.drbMax.toFixed(2)})</h4>
    <div class="status">
        <span class="observation-icon ${drbClass}">${drbIcon}</span>
        <span>${drbStatusMsg}</span>
    </div>
    <div class="tip">
        <span class="observation-icon">💡</span>
        <span>${drbTipMsg}</span>
    </div>
</div>
</div>
`;


}

/**
 * Reinicia o formulário
 */
function resetForm() {
    // Limpa os campos de entrada
    const inputs = ["cableDiameter", "matrixDiameter", "guideOuterDiameter"];
    inputs.forEach(id => {
        const input = document.getElementById(id);
        input.value = "";
        input.classList.remove("invalid");

        // Esconde mensagens de erro
        const errorId = id + "Error";
        document.getElementById(errorId).style.display = "none";
    });

    // Reinicia os valores exibidos
    const resultFields = ["matrixArea", "flowArea", "cableArea", "ddrValue", "drbValue"];
    resultFields.forEach(id => {
        document.getElementById(id).innerText = "--";
    });

    // Limpa observações
    document.getElementById("observations").innerHTML = "--";

    // Reinicia os marcadores visuais
    ["ddrFill", "drbFill"].forEach(id => {
        document.getElementById(id).style.width = "0";
        document.getElementById(id).style.left = "0";
    });

    ["ddrMarker", "drbMarker"].forEach(id => {
        document.getElementById(id).style.left = "0";
    });

    // Limpa o último cálculo
    state.lastCalculated = null;
}

// Inicialização da aplicação
document.addEventListener("DOMContentLoaded", function () {
    // Registra eventos
    document.getElementById("languageSelector").addEventListener("change", switchLanguage);
    document.getElementById("calculateBtn").addEventListener("click", calculateValues);
    document.getElementById("resetBtn").addEventListener("click", resetForm);
    document.getElementById("saveBtn").addEventListener("click", savePreferences);

    // Campos numéricos: atualizar ao mudar valores (opcional)
    ["cableDiameter", "matrixDiameter", "guideOuterDiameter"].forEach(id => {
        document.getElementById(id).addEventListener("input", function () {
            // Remove mensagens de erro quando o usuário começa a corrigir
            document.getElementById(id + "Error").style.display = "none";
            document.getElementById(id).classList.remove("invalid");
        });
    });

    // Carrega preferências salvas
    loadPreferences();

    // Configura os tooltips para acessibilidade
    setupTooltipAccessibility();
});

/**
 * Configura a acessibilidade para os tooltips
 */
function setupTooltipAccessibility() {
    const tooltipContainers = document.querySelectorAll('.tooltip-container');

    tooltipContainers.forEach(container => {
        container.setAttribute('tabindex', '0');
        container.setAttribute('role', 'button');
        container.setAttribute('aria-label', container.querySelector('.tooltip-text').textContent);

        // Suporte para teclado
        container.addEventListener('keydown', function (e) {
            if (e.key === 'Enter' || e.key === ' ') {
                const tooltipText = this.querySelector('.tooltip-text');
                const isVisible = tooltipText.style.visibility === 'visible';

                tooltipText.style.visibility = isVisible ? 'hidden' : 'visible';
                tooltipText.style.opacity = isVisible ? '0' : '1';
            }
        });
    });
}