// Variables globales
const API_BASE = '/api';
let currentAccount = null;
let operationsChart = null;

/**
 * Cargar lista de cuentas al iniciar
 */
async function loadAccounts() {
  try {
    const response = await fetch(`${API_BASE}/accounts`);
    const result = await response.json();

    if (!result.success || !result.accounts) {
      throw new Error('No se pudieron cargar las cuentas');
    }

    displayAccounts(result.accounts);
  } catch (error) {
    console.error('Error cargando cuentas:', error);
    document.getElementById('accounts-list').innerHTML = 
      `<div class="loading">❌ Error: ${error.message}</div>`;
  }
}

/**
 * Mostrar tarjetas de cuentas
 */
function displayAccounts(accounts) {
  const accountsList = document.getElementById('accounts-list');
  
  if (accounts.length === 0) {
    accountsList.innerHTML = '<div class="loading">No hay cuentas disponibles aún</div>';
    return;
  }

  accountsList.innerHTML = accounts.map(account => `
    <div class="account-card" onclick="selectAccount('${account.id}')">
      <h3>${account.name}</h3>
      <div class="type-badge ${account.type.toLowerCase()}">${account.type}</div>
      <p><strong>Estado:</strong> ${account.status}</p>
      <p class="last-update">
        Última actualización: ${account.lastUpdate ? new Date(account.lastUpdate).toLocaleString() : 'N/A'}
      </p>
    </div>
  `).join('');
}

/**
 * Seleccionar cuenta y mostrar detalles
 */
async function selectAccount(accountId) {
  currentAccount = accountId;
  document.getElementById('accounts-list').parentElement.classList.add('hidden');
  document.getElementById('account-detail').classList.remove('hidden');

  await loadAccountData(accountId);
}

/**
 * Cargar todos los datos de la cuenta
 */
async function loadAccountData(accountId) {
  try {
    const [metadata, operaciones, balanceHistory] = await Promise.all([
      fetch(`${API_BASE}/accounts/${accountId}/metadata`).then(r => r.json()),
      fetch(`${API_BASE}/accounts/${accountId}/operaciones`).then(r => r.json()),
      fetch(`${API_BASE}/accounts/${accountId}/balance-history`).then(r => r.json())
    ]);

    // Actualizar título
    document.getElementById('account-title').textContent = 
      metadata.data?.account_name || accountId;

    // Mostrar resumen
    if (operaciones.success && operaciones.data) {
      displaySummary(operaciones.data);
      displayOperations(operaciones.data.operaciones || []);
    }

    // Mostrar gráfico de balance
    if (balanceHistory.success && balanceHistory.data) {
      displayBalanceChart(balanceHistory.data.balance_history || []);
    }

    // Actualizar footer
    document.getElementById('footer-timestamp').textContent = 
      new Date().toLocaleString();

  } catch (error) {
    console.error('Error cargando datos de cuenta:', error);
    alert(`Error: ${error.message}`);
  }
}

/**
 * Mostrar resumen de operaciones
 */
function displaySummary(data) {
  const resumen = data.resumen || {};
  
  document.getElementById('summary-total-trades').textContent = 
    resumen.total_operaciones || '0';
  document.getElementById('summary-wins').textContent = 
    resumen.ganancias || '0';
  document.getElementById('summary-losses').textContent = 
    resumen.perdidas || '0';
  document.getElementById('summary-win-rate').textContent = 
    (resumen.win_rate || 0).toFixed(2) + '%';
  document.getElementById('summary-profit').textContent = 
    '$' + (resumen.profit_total || 0).toFixed(2);
}

/**
 * Mostrar tabla de operaciones
 */
function displayOperations(operaciones) {
  const tbody = document.getElementById('operations-body');
  
  if (!operaciones || operaciones.length === 0) {
    tbody.innerHTML = '<tr><td colspan="7" class="loading">No hay operaciones registradas</td></tr>';
    return;
  }

  tbody.innerHTML = operaciones.slice(0, 100).map(op => {
    const resultClass = op.resultado === 'WIN' ? 'result-win' : 'result-lose';
    const resultText = op.resultado === 'WIN' ? '✅ WIN' : '❌ LOSE';
    
    return `
      <tr>
        <td>${op.id || '-'}</td>
        <td>${new Date(op.timestamp).toLocaleString()}</td>
        <td>${op.tipo || '-'}</td>
        <td>$${(op.stake || 0).toFixed(2)}</td>
        <td><span class="${resultClass}">${resultText}</span></td>
        <td>$${(op.profit || 0).toFixed(2)}</td>
        <td>${op.duracion_ticks || '-'}</td>
      </tr>
    `;
  }).join('');
}

/**
 * Mostrar gráfico de balance histórico
 */
function displayBalanceChart(balanceHistory) {
  if (!balanceHistory || balanceHistory.length === 0) {
    return;
  }

  const ctx = document.getElementById('balance-chart');
  if (!ctx) return;

  const labels = balanceHistory.map(b => new Date(b.fecha).toLocaleDateString());
  const data = balanceHistory.map(b => b.balance);

  // Destruir gráfico anterior si existe
  if (operationsChart) {
    operationsChart.destroy();
  }

  operationsChart = new Chart(ctx, {
    type: 'line',
    data: {
      labels: labels,
      datasets: [{
        label: 'Balance Histórico',
        data: data,
        borderColor: '#667eea',
        backgroundColor: 'rgba(102, 126, 234, 0.1)',
        borderWidth: 2,
        fill: true,
        tension: 0.3,
        pointRadius: 4,
        pointBackgroundColor: '#667eea',
        pointBorderColor: '#fff',
        pointBorderWidth: 2
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          display: true,
          labels: {
            font: { size: 12 },
            color: '#333'
          }
        }
      },
      scales: {
        y: {
          beginAtZero: false,
          ticks: {
            callback: function(value) {
              return '$' + value.toFixed(2);
            }
          },
          grid: {
            color: 'rgba(0, 0, 0, 0.05)'
          }
        },
        x: {
          grid: {
            display: false
          }
        }
      }
    }
  });
}

/**
 * Volver a lista de cuentas
 */
function goBack() {
  currentAccount = null;
  document.getElementById('accounts-list').parentElement.classList.remove('hidden');
  document.getElementById('account-detail').classList.add('hidden');
  
  if (operationsChart) {
    operationsChart.destroy();
    operationsChart = null;
  }
}

/**
 * Event listeners
 */
document.getElementById('back-button').addEventListener('click', goBack);

/**
 * Cargar cuentas al cargar la página
 */
document.addEventListener('DOMContentLoaded', loadAccounts);
