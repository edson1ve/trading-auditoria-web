const express = require('express');
const cors = require('cors');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.static('public'));
app.use(express.json());

/**
 * API: Obtener lista de cuentas disponibles
 */
app.get('/api/accounts', (req, res) => {
  try {
    const dataDir = path.join(__dirname, 'data');
    const accounts = [];

    if (fs.existsSync(dataDir)) {
      const folders = fs.readdirSync(dataDir);
      
      folders.forEach(folder => {
        const metadataPath = path.join(dataDir, folder, 'metadata.json');
        if (fs.existsSync(metadataPath)) {
          const metadata = JSON.parse(fs.readFileSync(metadataPath, 'utf-8'));
          accounts.push({
            id: folder,
            name: metadata.account_name || folder,
            type: metadata.account_type || 'UNKNOWN',
            status: metadata.status || 'ACTIVE',
            lastUpdate: metadata.last_update || null
          });
        }
      });
    }

    res.json({
      success: true,
      accounts: accounts.sort((a, b) => a.name.localeCompare(b.name))
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

/**
 * API: Obtener operaciones de una cuenta
 */
app.get('/api/accounts/:accountId/operaciones', (req, res) => {
  try {
    const accountId = req.params.accountId;
    const operacionesPath = path.join(__dirname, 'data', accountId, 'operaciones.json');

    if (!fs.existsSync(operacionesPath)) {
      return res.status(404).json({
        success: false,
        error: `Operaciones no encontradas para cuenta: ${accountId}`
      });
    }

    const operaciones = JSON.parse(fs.readFileSync(operacionesPath, 'utf-8'));
    res.json({
      success: true,
      data: operaciones
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

/**
 * API: Obtener balance histórico de una cuenta
 */
app.get('/api/accounts/:accountId/balance-history', (req, res) => {
  try {
    const accountId = req.params.accountId;
    const balancePath = path.join(__dirname, 'data', accountId, 'balance_history.json');

    if (!fs.existsSync(balancePath)) {
      return res.status(404).json({
        success: false,
        error: `Balance no encontrado para cuenta: ${accountId}`
      });
    }

    const balanceHistory = JSON.parse(fs.readFileSync(balancePath, 'utf-8'));
    res.json({
      success: true,
      data: balanceHistory
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

/**
 * API: Obtener metadata de una cuenta
 */
app.get('/api/accounts/:accountId/metadata', (req, res) => {
  try {
    const accountId = req.params.accountId;
    const metadataPath = path.join(__dirname, 'data', accountId, 'metadata.json');

    if (!fs.existsSync(metadataPath)) {
      return res.status(404).json({
        success: false,
        error: `Metadata no encontrada para cuenta: ${accountId}`
      });
    }

    const metadata = JSON.parse(fs.readFileSync(metadataPath, 'utf-8'));
    res.json({
      success: true,
      data: metadata
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

/**
 * Health Check
 */
app.get('/health', (req, res) => {
  res.json({
    status: 'ok',
    message: 'Trading Auditoría Web está en línea',
    timestamp: new Date().toISOString()
  });
});

/**
 * 404 Handler
 */
app.use((req, res) => {
  res.status(404).json({
    success: false,
    error: 'Ruta no encontrada',
    path: req.path
  });
});

/**
 * Error Handler
 */
app.use((err, req, res, next) => {
  console.error('Error:', err);
  res.status(500).json({
    success: false,
    error: err.message || 'Error interno del servidor'
  });
});

// Iniciar servidor
app.listen(PORT, () => {
  console.log(`🚀 Servidor en puerto ${PORT}`);
  console.log(`📍 http://localhost:${PORT}`);
  console.log(`🏥 Health: http://localhost:${PORT}/health`);
  console.log(`📊 API: http://localhost:${PORT}/api/accounts`);
});
