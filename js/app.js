/**
 * Traduções para os diferentes idiomas suportados
 */
const translations = {
    pt: {
        title: "Cable Extrusion Pro: Calculadora DDR/DRB & Insights Técnicos",
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

let ddrChart = null;
let drbChart = null;


let materialLimits = {};
async function loadMaterialLimits() {
    try {
        const response = await fetch('js/materials.json');
        materialLimits = await response.json();
    } catch (error) {
        console.error("Erro ao carregar materials.json:", error);
    }
}


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
                    if (Object.keys(materialLimits).length > 0) {
                        calculateValues();
                    } else {
                        console.warn("Material limits não carregados ainda.");
                    }
                }

            }

            showTemporaryMessage(translations[state.lang].configLoaded);
            updateLastLoaded(Date.now());

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
        updateLastLoaded(Date.now());

    } catch (error) {
        console.error("Erro ao salvar preferências:", error);
    }
}

function saveToHistory(record) {
    let history = JSON.parse(localStorage.getItem('ddrCalculatorHistory') || '[]');

    // Adiciona no topo
    history.unshift(record);

    // Mantém apenas os 5 últimos registros
    if (history.length > 5) {
        history = history.slice(0, 5);
    }

    localStorage.setItem('ddrCalculatorHistory', JSON.stringify(history));

    renderHistory();
}

function renderHistory() {
    const historyList = document.getElementById("historyList");
    let history = JSON.parse(localStorage.getItem('ddrCalculatorHistory') || '[]');

    if (history.length === 0) {
        historyList.innerHTML = `<p>-- Nenhum cálculo registrado ainda --</p>`;
        return;
    }

    // Monta os itens
    historyList.innerHTML = history.map(item => {
        const dateStr = new Date(item.timestamp).toLocaleString(state.lang === "pt" ? 'pt-BR' : 'en-US', {
            dateStyle: 'short',
            timeStyle: 'short'
        });

        return `
            <div class="history-item">
                <strong>🛠️ ${state.lang === "pt" ? "Material" : "Material"}: ${item.material}</strong>
                <span>${state.lang === "pt" ? "DDR" : "DDR"}: ${item.ddr} | ${state.lang === "pt" ? "DRB" : "DRB"}: ${item.drb}</span>
                <span class="small">
                    ${state.lang === "pt" ? "Matriz" : "Die"}: ${item.matrixDiameter} mm,
                    ${state.lang === "pt" ? "Guia" : "Tip"}: ${item.guideOuterDiameter} mm,
                    ${state.lang === "pt" ? "Cabo" : "Cable"}: ${item.cableDiameter} mm
                </span>
                <span class="small">🕒 ${state.lang === "pt" ? "Calculado em" : "Calculated on"}: ${dateStr}</span>
            </div>
        `;
    }).join('');
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

function updateLastLoaded(timestamp) {
    const lastLoadedDiv = document.getElementById("lastLoaded");
    const dateStr = new Date(timestamp).toLocaleString(state.lang === "pt" ? 'pt-BR' : 'en-US', {
        dateStyle: 'short',
        timeStyle: 'short'
    });
    lastLoadedDiv.innerText = state.lang === "pt"
        ? `⚙️ Última configuração carregada em: ${dateStr}`
        : `⚙️ Last configuration loaded on: ${dateStr}`;
}

function renderApexChart(id, value, scaleMax, faixaMin, faixaMax, faixaAcceptMin, faixaAcceptMax, title) {
    const options = {
        chart: {
            type: 'scatter',  // mantemos scatter como você quis
            height: 120,
            toolbar: { show: false },
            animations: { enabled: false }
        },
        series: [{
            name: title,
            data: [[parseFloat(value), 0]]  // formato correto: [[x, y]]
        }],
        markers: {
            size: 8,  // 👈 diminui o tamanho padrão
            colors: ['#00ccff'],
            strokeColors: '#fff',
            strokeWidth: 2,
            hover: {
                size: 10  // 👈 diminui também o tamanho no hover
            }
        },

        xaxis: {
            min: 0,
            max: scaleMax,
            rangePadding: 0.05,  // 🔥 adiciona ~5% de folga em cada ponta
            tickAmount: Math.ceil(scaleMax * 2),
            decimalsInFloat: 2,
            title: {
                text: title,
                style: { color: '#e0e0e0', fontSize: '14px' }
            },
            labels: {
                style: { colors: '#e0e0e0', fontSize: '14px' },
                formatter: function (val) {
                    return parseFloat(val).toFixed(2);
                }
            }
        },

        yaxis: {
            min: -1,
            max: 1,
            show: false
        },
        annotations: {
            xaxis: [
                {
                    x: faixaAcceptMin,
                    x2: faixaAcceptMax,
                    borderColor: '#FFA500',
                    fillColor: 'rgba(255, 165, 0, 0.3)',

                },
                {
                    x: faixaMin,
                    x2: faixaMax,
                    borderColor: '#00FF00',
                    fillColor: 'rgba(0, 200, 83, 0.4)',

                }
            ]
        },
        tooltip: {
            enabled: false // remove o tooltip duplicado de vez
        },
        dataLabels: {
            enabled: true,
            formatter: function (val, { w, seriesIndex, dataPointIndex }) {
                const v = w.config.series[seriesIndex].data[dataPointIndex][0];
                return v.toFixed(2);
            },
            offsetY: -10,
            style: {
                fontSize: '12px',
                colors: ['#fff']
            },
            background: {
                enabled: true,
                foreColor: '#333',
                padding: 4,
                borderRadius: 2,
                borderWidth: 1,
                borderColor: '#999',
                opacity: 0.9,
            }
        },



    };

    const chart = new ApexCharts(document.querySelector(`#${id}`), options);
    chart.render();
    return chart;
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
    document.getElementById("idealLabel").innerText = t.obsTitle.includes("Smart") ? "Ideal" : "Ideal";
    document.getElementById("acceptableLabel").innerText = t.obsTitle.includes("Smart") ? "Acceptable" : "Aceitável";


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

    // Se houver uma configuração recente, atualiza a data
    const lastLoadedDiv = document.getElementById("lastLoaded");
    if (lastLoadedDiv && lastLoadedDiv.innerText.trim() !== "") {
        const now = Date.now();
        updateLastLoaded(now);
    }

    renderHistory();


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

    // Atualiza as observações baseadas nos valores calculados
    updateObservations(ddr, drb, material);

    // Limpar gráficos antigos (se existirem)
    if (ddrChart) { ddrChart.destroy(); }
    if (drbChart) { drbChart.destroy(); }

    // Obter limites para escala e faixa ideal
    const limits = materialLimits[material];
    console.log("Limites carregados para material:", material, limits);


    // Calcula a escala máxima (20% acima do maior valor)
    const ddrScale = Math.max(parseFloat(ddr), limits.ddrMax) * 1.2;
    const drbScale = Math.max(parseFloat(drb), limits.drbMax) * 1.2;

    // Renderiza gráficos atualizados
    ddrChart = renderApexChart(
        'ddrChart',
        ddr,
        ddrScale,
        limits.ddrMin,
        limits.ddrMax,
        limits.ddrAcceptMin,
        limits.ddrAcceptMax,
        'DDR'
    );


    drbChart = renderApexChart(
        'drbChart',
        drb,
        drbScale,
        limits.drbMin,
        limits.drbMax,
        limits.drbAcceptMin,
        limits.drbAcceptMax,
        'DRB'
    );


    // Salva no histórico
    saveToHistory({
        timestamp: Date.now(),
        material: material,
        ddr: ddr,
        drb: drb,
        matrixDiameter: dMatrix,
        guideOuterDiameter: dGuideOuter,
        cableDiameter: dCable
    });

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

    const limits = materialLimits[material];
    if (!limits) {
        console.warn("Limites não encontrados para o material:", material);
        return;
    }


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
document.addEventListener("DOMContentLoaded", async function () {

    await loadMaterialLimits();

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

    // Renderiza histórico ao carregar
    renderHistory();

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
        // Esconde o tooltip ao perder o foco (melhor controle)
        container.addEventListener('blur', function () {
            const tooltipText = this.querySelector('.tooltip-text');
            tooltipText.style.visibility = 'hidden';
            tooltipText.style.opacity = '0';
        });

    });
}