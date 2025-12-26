/* ========================================
   CALCULADORA ECOTRIP
   Simulador de Impacto Ambiental para Viagens
   ======================================== */

// ========================================
// CONSTANTES E CONFIGURAÇÕES
// ========================================

const EMISSIONS_DATA = {
    plane: 0.255,
    planeFirst: 0.350,
    carGas: 0.120,
    carElectric: 0.050,
    bus: 0.068,
    train: 0.041,
    bike: 0.011
};

const CO2_PER_TREE_YEAR = 21; // kg de CO2 absorvido por árvore por ano
const CO2_PER_HOME_DAY = 10; // kg de CO2 por dia de consumo doméstico
const CO2_PER_CAR_KM = 0.12; // kg de CO2 por km em carro médio

// ========================================
// DICAS POR TIPO DE TRANSPORTE
// ========================================

const tips = {
    plane: [
        "Escolha voos diretos sempre que possível - decolagens e pousos consomem mais combustível",
        "Considere compensar suas emissões através de programas de créditos de carbono",
        "Viaje com bagagem leve - menos peso significa menos combustível",
        "Prefira classe econômica - ocupa menos espaço e emite menos CO₂ por passageiro"
    ],
    car: [
        "Compartilhe a viagem com outras pessoas para dividir as emissões",
        "Mantenha a velocidade constante e moderada para economizar combustível",
        "Verifique a pressão dos pneus regularmente",
        "Considere alugar um veículo híbrido ou elétrico para viagens longas"
    ],
    bus: [
        "Ônibus já é uma opção sustentável! Continue priorizando transporte coletivo",
        "Prefira empresas que investem em frotas modernas e eficientes",
        "Combine ônibus com outros meios de transporte público no destino"
    ],
    train: [
        "Excelente escolha! Trens são um dos meios mais sustentáveis",
        "Aproveite a viagem de trem para trabalhar ou relaxar",
        "Incentive outras pessoas a considerar viagens de trem"
    ],
    bike: [
        "Parabéns! Você escolheu o meio mais sustentável",
        "Planeje rotas seguras e agradáveis para incentivar outros ciclistas",
        "Lembre-se de usar equipamentos de segurança adequados"
    ]
};

// ========================================
// ELEMENTOS DO DOM
// ========================================

const form = document.getElementById('travelForm');
const resultsContainer = document.getElementById('results');
const co2ValueElement = document.getElementById('co2Value');
const treesValueElement = document.getElementById('treesValue');
const energyValueElement = document.getElementById('energyValue');
const carValueElement = document.getElementById('carValue');
const impactLevelElement = document.getElementById('impactLevel');
const tipsListElement = document.getElementById('tipsList');

// ========================================
// EVENT LISTENERS
// ========================================

form.addEventListener('submit', handleFormSubmit);

// ========================================
// FUNÇÕES PRINCIPAIS
// ========================================

/**
 * Manipula o envio do formulário
 * @param {Event} event - Evento de submit do formulário
 */
function handleFormSubmit(event) {
    event.preventDefault();
    calculateAndDisplayImpact();
}

/**
 * Calcula e exibe o impacto ambiental da viagem
 */
function calculateAndDisplayImpact() {
    const formData = getFormData();
    
    if (!validateFormData(formData)) {
        return;
    }

    const calculationResults = calculateEmissions(formData);
    displayResults(calculationResults, formData.transportType);
    scrollToResults();
}

/**
 * Obtém os dados do formulário
 * @returns {Object} Dados do formulário
 */
function getFormData() {
    return {
        transportType: parseFloat(document.getElementById('transportType').value),
        distance: parseFloat(document.getElementById('distance').value),
        passengers: parseInt(document.getElementById('passengers').value)
    };
}

/**
 * Valida os dados do formulário
 * @param {Object} data - Dados do formulário
 * @returns {boolean} True se válido, false caso contrário
 */
function validateFormData(data) {
    if (isNaN(data.transportType) || isNaN(data.distance) || isNaN(data.passengers)) {
        alert('Por favor, preencha todos os campos corretamente.');
        return false;
    }

    if (data.distance <= 0 || data.passengers <= 0) {
        alert('Distância e número de passageiros devem ser maiores que zero.');
        return false;
    }

    return true;
}

/**
 * Calcula as emissões de CO2 e comparações
 * @param {Object} data - Dados do formulário
 * @returns {Object} Resultados dos cálculos
 */
function calculateEmissions(data) {
    const totalCO2 = (data.transportType * data.distance * data.passengers);
    
    return {
        totalCO2: totalCO2.toFixed(2),
        trees: Math.ceil(totalCO2 / CO2_PER_TREE_YEAR),
        energyDays: (totalCO2 / CO2_PER_HOME_DAY).toFixed(1),
        carEquivalent: Math.round(totalCO2 / CO2_PER_CAR_KM)
    };
}

/**
 * Exibe os resultados na interface
 * @param {Object} results - Resultados dos cálculos
 * @param {number} transportType - Tipo de transporte usado
 */
function displayResults(results, transportType) {
    co2ValueElement.textContent = `${results.totalCO2} kg`;
    treesValueElement.textContent = results.trees;
    energyValueElement.textContent = results.energyDays;
    carValueElement.textContent = results.carEquivalent;

    updateImpactLevel(parseFloat(results.totalCO2));
    displayTips(transportType);
    
    resultsContainer.classList.add('show');
}

/**
 * Atualiza o nível de impacto ambiental
 * @param {number} co2Amount - Quantidade de CO2 em kg
 */
function updateImpactLevel(co2Amount) {
    let levelText, levelClass;

    if (co2Amount < 50) {
        levelText = 'Baixo Impacto';
        levelClass = 'impact-low';
    } else if (co2Amount < 150) {
        levelText = 'Impacto Moderado';
        levelClass = 'impact-medium';
    } else {
        levelText = 'Alto Impacto';
        levelClass = 'impact-high';
    }

    impactLevelElement.textContent = levelText;
    impactLevelElement.className = `impact-level ${levelClass}`;
}

/**
 * Exibe dicas baseadas no tipo de transporte
 * @param {number} transportType - Tipo de transporte usado
 */
function displayTips(transportType) {
    const selectedTips = getTipsByTransportType(transportType);
    renderTipsList(selectedTips);
}

/**
 * Obtém as dicas apropriadas para o tipo de transporte
 * @param {number} transportType - Tipo de transporte usado
 * @returns {Array} Array de dicas
 */
function getTipsByTransportType(transportType) {
    if (transportType >= 0.255) {
        return tips.plane;
    } else if (transportType >= 0.050 && transportType <= 0.120) {
        return tips.car;
    } else if (transportType === 0.068) {
        return tips.bus;
    } else if (transportType === 0.041) {
        return tips.train;
    } else {
        return tips.bike;
    }
}

/**
 * Renderiza a lista de dicas no DOM
 * @param {Array} tipsArray - Array de dicas para exibir
 */
function renderTipsList(tipsArray) {
    tipsListElement.innerHTML = '';
    
    tipsArray.forEach(tip => {
        const listItem = document.createElement('li');
        listItem.textContent = tip;
        tipsListElement.appendChild(listItem);
    });
}

/**
 * Rola a página até a seção de resultados
 */
function scrollToResults() {
    resultsContainer.scrollIntoView({ 
        behavior: 'smooth', 
        block: 'nearest' 
    });
}