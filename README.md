# 📊 Auditoria Web - Aegis Neural Quant

Auditoria publica para el sistema de trading automatizado Aegis Neural Quant. El objetivo es ofrecer
transparencia total, trazabilidad y reportes faciles de interpretar para clientes e inversionistas.

**Sitio en produccion:** https://auditoria.criptoinversiones.net/  
**Modulo de reportes:** https://auditoria.criptoinversiones.net/reports

## ✅ Que ofrece el sitio

- **Auditoria publica** con operaciones verificables.
- **Balance historico** con grafico de evolucion diaria.
- **Multi-cuenta** (demo y reales) con reportes separados.
- **Actualizacion automatica** desde el bot Python.
- **Datos estructurados** en JSON, faciles de auditar.

## 🧠 Metodo de auditoria (como funciona)

1. **Captura**: el bot registra operaciones, balance y eventos clave.
2. **Normalizacion**: `audit_exporter.py` convierte los reportes locales en JSON auditado.
3. **Publicacion**: el exportador empuja datos a GitHub cuando la auditoria publica esta habilitada.
4. **Despliegue**: Hostinger detecta el push y actualiza automaticamente el sitio.

## 🤖 Diseno del bot (resumen)

El sistema de trading genera datos en `reports/` y un scheduler publica la auditoria:

- **bot.py**: ejecuta la estrategia y guarda los reportes locales.
- **audit_exporter.py**: transforma reportes a JSON auditables.
- **export_scheduler.py**: automatiza la exportacion cada 24h.
- **account_manager.py**: administra cuentas demo y reales.

## 📈 Como interpretar las metricas

- **Total de operaciones**: cantidad total de trades ejecutados.
- **Ganancias / Perdidas**: conteo de operaciones WIN y LOSE.
- **Win rate**: porcentaje de operaciones ganadoras sobre el total.
- **Profit total**: suma neta de resultados (ganancias - perdidas).
- **Balance historico**: evolucion diaria del capital de la cuenta.
- **Stake**: monto asignado por operacion.
- **Duracion (ticks)**: tiempo operativo por trade.

## 📁 Estructura del proyecto

```
trading-auditoria-web/
├── package.json
├── server.js
├── public/
│   ├── index.html
│   ├── reports/
│   │   └── index.html
│   └── assets/
│       ├── css/styles.css
│       └── js/main.js
├── data/
│   ├── demostrativa/
│   │   ├── metadata.json
│   │   ├── operaciones.json
│   │   └── balance_history.json
│   └── real_1/
│       ├── metadata.json
│       ├── operaciones.json
│       └── balance_history.json
└── README.md
```

## 🔗 API endpoints

- `GET /api/accounts`
- `GET /api/accounts/:accountId/operaciones`
- `GET /api/accounts/:accountId/balance-history`
- `GET /api/accounts/:accountId/metadata`
- `GET /health`

## 🛠️ Instalacion local

```bash
git clone https://github.com/tu-usuario/trading-auditoria-web.git
cd trading-auditoria-web
npm install
npm start
```

La app queda en http://localhost:3000

## 🚀 Desplegar en Hostinger

1. Crear el repo en GitHub.
2. Conectar Hostinger con GitHub.
3. Seleccionar este repo y rama principal.
4. Hostinger detecta `package.json` y ejecuta `npm start`.

Requisitos:
- `package.json` en la raiz.
- Script `start` definido.
- Node.js 18+.

## 🔐 Variables de entorno (Node)

```dotenv
PORT=3000
NODE_ENV=production
```

## ⚙️ Auditoria publica vs privada

- **Publica:** `EXPORT_TO_GITHUB=true` publica datos en GitHub.
- **Privada:** `EXPORT_TO_GITHUB=false` conserva datos locales.

## 📞 Soporte

- Documentacion bot: [telegram_bot/README_TELEGRAM_BOT.md](../telegram_bot/README_TELEGRAM_BOT.md)
- Email: edson@criptoinversiones.org

---

**Desarrollado por Edson Solorzano** | Aegis Neural Quant © 2026
