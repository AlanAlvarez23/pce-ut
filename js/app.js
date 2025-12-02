// Archivo js/app.js
// Lógica principal de la Plataforma Comunicativa Estudiantil (PCE-UT)

// URLs SIMULADAS para la API central 
const API_BASE_URL = 'https://tu-backend-pceut.com/api';
const ENDPOINT_CASOS = `${API_BASE_URL}/casos`;
const ENDPOINT_VALORES = `${API_BASE_URL}/valores`;

document.addEventListener('DOMContentLoaded', () => {
    console.log("Aplicación PCE-UT: Dashboard Iniciado. Intentando registrar SW...");
    //1. Registro del Service Worker (Se llama y se ejecuta inmediatamente)
    registerServiceWorker();

    // 2. Carga Inicial de Datos del Dashboard (Comienza después del registro)
    loadDashboardData();

    // 3. Configuración de Filtros
    setupFilters();
});


// ------------------------------------
// REGISTRO Y CONFIGURACIÓN PWA 
// ------------------------------------

/**
 * Función para registrar el Service Worker.
 * La ruta ha sido ajustada para funcionar correctamente desde cualquier ubicación.
 */
function registerServiceWorker() {
    if ('serviceWorker' in navigator) {
        // Registrar el SW en la raíz para tener alcance '/'
        navigator.serviceWorker.register('serviceworker.js')
            .then(registration => {
                console.log('ÉXITO: SW Registrado correctamente. Alcance:', registration.scope);

                // Verificar actualizaciones periódicamente
                setInterval(() => {
                    registration.update();
                }, 60000); // Actualizar cada minuto
            })
            .catch(error => {
                console.error('FALLO CRÍTICO: El Service Worker no pudo registrarse. Causa:', error);
            });
    } else {
        console.warn('Advertencia: Service Workers no soportados por este navegador.');
    }
}

// ------------------------------------
// LÓGICA DE CARGA Y FETCH DE DATOS (Mantenida sin cambios)
// ------------------------------------

/**
 * Carga los datos esenciales para el Dashboard (Casos y Métricas) desde la API.
 */
function loadDashboardData() {
    console.log("Cargando datos principales desde la API...");
    // Cargar métricas de valores (del Videojuego)
    fetchData(ENDPOINT_VALORES)
        .then(data => {
            // Datos SIMULADOS
            const simulatedMetrics = { paz: '75%', inclusion: '82%', respeto: '68%' };
            displayMetrics(simulatedMetrics);
        })
        .catch(error => console.error('Error al cargar métricas de valores:', error));

    // Cargar casos reportados (de la App Móvil)
    fetchData(ENDPOINT_CASOS)
        .then(data => {
            // Datos SIMULADOS
            const simulatedCasos = [
                { id: 101, fecha: '2025-10-20', tipo: 'Conflicto Verbal', estado: 'Resuelto' },
                { id: 102, fecha: '2025-10-21', tipo: 'Ausencia de Inclusión', estado: 'Pendiente' },
                { id: 103, fecha: '2025-10-22', tipo: 'Acto de Respeto', estado: 'Cerrado' }
            ];
            displayCasosList(simulatedCasos);
        })
        .catch(error => console.error('Error al cargar lista de casos:', error));
}

/**
 * Función genérica para hacer peticiones a la API. (Mantenida sin cambios)
 */
async function fetchData(url) {
    try {
        showLoading(true);
        await new Promise(resolve => setTimeout(resolve, 500));
        showLoading(false);
        return {};
    } catch (error) {
        console.error(`Error al hacer fetch a ${url}:`, error);
        showLoading(false);
        return null;
    }
}

function showLoading(isLoading) {
    if (isLoading) {
        console.log("Cargando datos...");
    } else {
        console.log("Carga completa.");
    }
}

function displayMetrics(metrics) {
    const pazValue = document.getElementById('paz-value');
    const pazBar = document.getElementById('paz-bar');
    const inclusionValue = document.getElementById('inclusion-value');
    const inclusionBar = document.getElementById('inclusion-bar');
    const respetoValue = document.getElementById('respeto-value');
    const respetoBar = document.getElementById('respeto-bar');

    if (!pazValue || !pazBar || !inclusionValue || !inclusionBar || !respetoValue || !respetoBar) {
        console.warn("Elementos de métricas no encontrados en el DOM. ¿Se modificó la estructura del dashboard?");
        return;
    }

    pazValue.textContent = metrics.paz;
    pazBar.style.width = metrics.paz;
    inclusionValue.textContent = metrics.inclusion;
    inclusionBar.style.width = metrics.inclusion;
    respetoValue.textContent = metrics.respeto;
    respetoBar.style.width = metrics.respeto;

    console.log(`Métricas actualizadas: Paz=${metrics.paz}, Inclusión=${metrics.inclusion}, Respeto=${metrics.respeto}`);
}

function displayCasosList(casos) {
    const casosListDiv = document.getElementById('casos-reportados-list');
    if (casosListDiv) {
        if (casos.length === 0) {
            casosListDiv.innerHTML = '<p class="text-info">No hay casos reportados que cumplan con el filtro.</p>';
            return;
        }
        let html = '<table><thead><tr><th>ID</th><th>Fecha</th><th>Tipo</th><th>Estatus</th></tr></thead><tbody>';
        casos.forEach(caso => {
            const statusClass = (caso.estado || 'Pendiente').toLowerCase().replace(' ', '-');
            html += `
                <tr>
                    <td>#${caso.id}</td>
                    <td>${caso.fecha}</td>
                    <td>${caso.tipo}</td>
                    <td><span class="status-badge status-${statusClass}">${caso.estado}</span></td>
                </tr>
            `;
        });
        html += '</tbody></table>';
        casosListDiv.innerHTML = html;
        console.log(`Renderizado exitoso de ${casos.length} casos.`);
    } else {
        console.warn("Elemento con ID 'casos-reportados-list' no encontrado en el DOM.");
    }
}

function setupFilters() {
    const filterButton = document.getElementById('aplicar-filtro');
    if (filterButton) {
        filterButton.addEventListener('click', handleFilterChange);
    }
}

function handleFilterChange() {
    console.log("Filtros aplicados. Recargando datos...");
    const filteredUrl = `${ENDPOINT_CASOS}?tipo=incidente&estado=pendiente`;
    fetchData(filteredUrl)
        .then(data => {
            const simulatedFilteredCasos = [{ id: 104, fecha: '2025-10-25', tipo: 'Conflicto Físico', estado: 'Pendiente' }];
            displayCasosList(simulatedFilteredCasos);
        })
        .catch(error => console.error('Error al recargar casos filtrados:', error));
}
