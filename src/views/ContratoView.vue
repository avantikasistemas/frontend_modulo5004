<template>
  <LayoutView>
    <h3>Actualizar Contrato y Documento</h3>

    <div class="container">
        <div class="form-container">
            <form @submit.prevent="cargarRegistros" class="form-flex">
                <div class="form-group">
                    <input type="number" class="input-field" v-model="num_pedido" placeholder="Número de pedido"/>
                    <button type="submit" class="submit-button">Consultar</button>
                </div>
            </form>
        </div>
    </div>

    <div class="form-container" v-if="cabecera != null && Object.keys(cabecera).length > 0">
        <div class="row-valores">
            <div class="right">
                <input type="text" class="input-field" v-model="contrato" placeholder="Digite Contrato">
                <input type="number" class="input-field" v-model="documento" placeholder="Digite Documento">
                <select v-model="direccion" class="input-field">
                    <option :value=null>Seleccione Dirección</option>
                    <option v-for="dir in direcciones" :key="dir.codigo_direccion" :value="dir.codigo_direccion">
                        {{ dir.codigo_direccion }} - {{ dir.direccion }}
                    </option>
                </select>
                <button class="btn btn-guardar" @click="actualizarInformacion">Actualizar</button>
            </div>
        </div>
        <hr>
        <div class="row-3-cols">
            <div class="col">
                <label><strong>Tercero:</strong></label>
                <p>{{ cabecera.nombres }}</p>
            </div>
            <div class="col">
                <label><strong>Nit:</strong></label>
                <p>{{ cabecera.nit }}</p>
            </div>
            <div class="col">
                <label><strong>Contrato:</strong></label>
                <p>{{ cabecera.adicional }}</p>
            </div>
            <div class="col">
                <label><strong>Documento:</strong></label>
                <p>{{ cabecera.documento }}</p>
            </div>
            <div class="col">
                <label><strong>Valor Total:</strong></label>
                <p>{{ cabecera.valor_total }}</p>
            </div>
            <div class="col">
                <label><strong>Vendedor:</strong></label>
                <p>{{ cabecera.vendedor_nombre }}</p>
            </div>
            <div class="col">
                <label><strong>Usuario:</strong></label>
                <p>{{ cabecera.usuario }}</p>
            </div>
            <div class="col">
                <label><strong>Código Dirección:</strong></label>
                <p>{{ cabecera.codigo_direccion }}</p>
            </div>
            <div class="col">
                <label><strong>Dirección:</strong></label>
                <p>{{ cabecera.direccion }}</p>
            </div>
        </div>
    </div>

    <!-- Modal de éxito -->
    <div class="modal fade" id="exitoModal" tabindex="-1" aria-labelledby="exitoModalLabel" aria-hidden="true" data-bs-backdrop="static" ref="exitoModal">
        <div class="modal-dialog modal-dialog-centered">
            <div class="modal-content">
                <div class="modal-header bg-success text-white">
                    <div class="d-flex align-items-center w-100">
                        <span class="me-2" style="font-size:2.5rem;line-height:1;">&#10004;</span>
                        <h5 class="modal-title flex-grow-1" id="exitoModalLabel">{{ modalTitle }}</h5>
                        <button type="button" class="btn-close btn-close-white" data-bs-dismiss="modal" aria-label="Close"></button>
                    </div>
                </div>
                <div class="modal-body text-success text-center">
                    <p>{{ msg }}</p>                    
                </div>
                <div class="modal-footer">
                    <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Cerrar</button>
                </div>
            </div>
        </div>
    </div>

    <!-- Modal de error -->
    <div class="modal fade" id="errorModal" tabindex="-1" aria-labelledby="errorModalLabel" aria-hidden="true" data-bs-backdrop="static" ref="errorModal">
        <div class="modal-dialog modal-dialog-centered">
            <div class="modal-content">
                <div class="modal-header bg-danger text-white">
                    <div class="d-flex align-items-center w-100">
                        <span class="me-2" style="font-size:2.5rem;line-height:1;">&#10006;</span>
                        <h5 class="modal-title flex-grow-1" id="errorModalLabel">Error</h5>
                        <button type="button" class="btn-close btn-close-white" data-bs-dismiss="modal" aria-label="Close"></button>
                    </div>
                </div>
                <div class="modal-body text-danger text-center">
                    <strong>{{ errorMsg }}</strong>
                </div>
                <div class="modal-footer">
                    <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Cerrar</button>
                </div>
            </div>
        </div>
    </div>

    <!-- Overlay de carga -->
    <div v-if="loading" class="loading-overlay">
        <div class="spinner-border text-light" role="status">
            <span class="visually-hidden"></span>
        </div>
        <p class="mt-2 text-light">{{ loading_msg }}</p>
    </div>
      
  </LayoutView>
</template>

<script setup>
import apiUrl from "../../config.js";
import LayoutView from '../views/Layouts/LayoutView.vue';
import { ref, onMounted } from "vue";
import axios from "axios";
import { Modal } from 'bootstrap';

const num_pedido = ref("");
const contrato = ref("");
const documento = ref("");
const direccion = ref(null);
const direcciones = ref([]);

const modalInstance = ref(null);
const modalErrorInstance = ref(null);

const msg = ref("");
const modalTitle = ref("");
const errorMsg = ref("");

const cabecera = ref({});

const loading = ref(false);
const loading_msg = ref('');

// ✅ Función para cargar la información
const cargarRegistros = async () => {

    try {

        loading.value = true;
        loading_msg.value = "Cargando datos, por favor espera...";

        const response = await axios.post(
            `${apiUrl}/consultar_pedido_cabecera`, 
        {
            numero_pedido: parseInt(num_pedido.value)
        },
        {
            headers: {
                Accept: "application/json"
            }
        }
        );

        if (response.status === 200) {
            cabecera.value = response.data.data;
            direcciones.value = cabecera.value.direcciones || [];
        }
    } catch (error) {
        console.error("Error al consultar los datos:", error);
        errorMsg.value = error.response?.data?.message || "Error al consultar los datos.";
        modalErrorInstance.value.show();
    } finally {
        loading.value = false;
        loading_msg.value = "";
    }
};

// ✅ Función para actualizar el documento
const actualizarInformacion = async () => {

  const confirmado = window.confirm('¿Está seguro que desea realizar el actualizado del documento?');
  if (!confirmado) return;

  try {
    loading.value = true;
    loading_msg.value = 'Actualizando datos, por favor espere...';
    const response = await axios.post(
      `${apiUrl}/actualizar_documento`,
      {
        numero_pedido: parseInt(num_pedido.value),
        adicional: contrato.value,
        documento: documento.value,
        direccion: direccion.value
      },
      {
        headers: {
          Accept: "application/json"
        }
      }
    );
    if (response.status === 200) {
      msg.value = response.data.message;
      modalTitle.value = "Actualización Exitosa";
      modalInstance.value.show();
      await cargarRegistros();
    }
  } catch (error) {
    errorMsg.value = error.response?.data?.message || "Error al actualizar el documento.";
    modalErrorInstance.value.show();
    console.error(error);
  } finally {
    loading.value = false;
    loading_msg.value = '';
  }
}

// ✅ Función mounted que carga información ANTES de que la página renderice
onMounted(() => {
  modalInstance.value = new Modal(exitoModal);
  modalErrorInstance.value = new Modal(errorModal);
});

</script>

<style scoped>
.container {
    max-width: 100%;
    margin: 0 auto;
    padding: 0;
}
.header, .form-container {
    background-color: #ffffff;
    padding: 24px;
    border-radius: 8px;
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
    margin-top: 24px;
}
.header h1 {
    font-size: 24px;
    font-weight: bold;
    margin-bottom: 16px;
}
.form-container h2 {
    font-size: 20px;
    font-weight: bold;
    margin-bottom: 16px;
}
.form-flex {
    display: flex;
    gap: 16px; /* Espaciado entre elementos */
    align-items: flex-start;
}
.form-group {
    display: flex;
    gap: 12px
}
.form-group label {
    display: block;
    color: #4b5563;
    margin-bottom: 4px;
    font-weight: bold;
}
.full-width {
  flex: 0 0 100%;
  max-width: 100%;
  margin-top: 20px;
}
.input-field {
    height: 40px;
    margin-top: 10px;
    padding: 10px;
    border: 1px solid #d1d5db;
    border-radius: 4px;
}

/* Reducir el ancho del select de dirección en el formulario superior */
select.input-field {
    width: 220px;
    min-width: 120px;
    max-width: 260px;
    padding-right: 24px;
}
.submit-button {
    width: 100%;
    margin-top: 10px;
    padding: 10px;
    background: #679b3a;
    color: white;
    border: none;
    border-radius: 5px;
    cursor: pointer;
    transition: background 0.3s;
    font-size: 0.9em;
}
.submit-button:hover {
    background: #487223;
}

.row-valores {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 12px;
}

.right {
  display: flex;
  align-items: flex-end;
  gap: 12px
}

.btn-guardar {
  background-color: #679b3a;
  color: white;
  padding: 6px 12px;
  font-size: 12px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

.btn-guardar:hover {
  background-color: #4cae4c;
}

/* Tabla */
.table-container {
    flex-grow: 1; /* Permite que la tabla ocupe todo el espacio restante */
    overflow-y: auto; /* Activa el scroll interno en la tabla */
    max-height: 100%; /* Se ajusta a la altura disponible */
}
table {
    width: 100%;
    border-collapse: collapse;

    position: relative;
}
/* Dejar fija la cabecera */
thead {
    position: sticky;
    top: 0;
    background-color: #e5e7eb; /* Fijar color de fondo para que no sea transparente */
    z-index: 10; /* Asegurar que esté sobre el contenido */
}
th, td {
    border: 1px solid #e5e7eb;
    padding: 8px;
    text-align: left;
    font-size: 0.875rem;
}
th {
    background-color: #679b3a;
    color: white;
}

.btn-icono {
  background: none;
  border: none;
  padding: 4px 8px;
  font-size: 18px;
  cursor: pointer;
  transition: color 0.2s, transform 0.2s;
  color: #ffd95e;
  outline: none;
}

.btn-icono:hover {
  color: #ffb300;
  transform: scale(1.2) rotate(-10deg);
  background: none;
  box-shadow: none;
}

/* Reducir el tamaño de los select dentro de la tabla */
.table-container table select {
    width: 80px; /* Ajusta el ancho */
    padding: 4px; /* Reduce el padding interno */
    font-size: 0.875rem; /* Hace el texto un poco más pequeño */
}

.table-container table input {
    width: 150px; /* Ajusta el ancho */
    padding: 4px; /* Reduce el padding interno */
    font-size: 0.875rem; /* Hace el texto un poco más pequeño */
}

/* Ajustar el tamaño del textarea dentro de la tabla */
.table-container table textarea {
    width: 100%; /* Ocupar todo el ancho de la celda */
    min-width: 200px; /* Asegurar un tamaño mínimo */
    height: 50px; /* Un poco más alto */
    resize: vertical; /* Permitir que el usuario lo ajuste en altura */
    font-size: 0.875rem;
}

.no-registros {
    text-align: center;
    font-weight: bold;
    color: #888;
    padding: 16px;
    font-size: 1rem;
}

.update-button {
    background-color: #679b3a;
    color: white;
    border: none;
    border-radius: 5px;
    padding: 10px 20px;
    cursor: pointer;
    transition: background 0.3s;
}
.update-button:hover {
    background-color: #487223;
}

@media (max-width: 768px) {
    .form-group {
        flex: 1 1 calc(50% - 16px); /* 2 columnas en pantallas medianas */
    }
}
@media (max-width: 480px) {
    .form-group {
        flex: 1 1 100%; /* 1 columna en pantallas pequeñas */
    }
} 

.row-3-cols {
    display: flex;
    flex-wrap: wrap;
    gap: 16px;
    margin-bottom: 12px;
}
.row-3-cols .col {
    flex: 1 1 calc(33.333% - 16px);
    min-width: 220px;
    box-sizing: border-box;
    margin-bottom: 8px;
}
/* Overlay de carga */
.loading-overlay {
    position: fixed;
    top: 0;
    left: 0;
    width: 100vw;
    height: 100vh;
    background: rgba(44, 62, 80, 0.45);
    z-index: 9999;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
}

.loading-overlay .spinner-border {
    width: 3rem;
    height: 3rem;
    border-width: 0.35em;
}

.loading-overlay p {
    color: #fff;
    font-size: 1.15rem;
    margin-top: 1.2rem;
    text-align: center;
    text-shadow: 0 1px 4px rgba(0,0,0,0.18);
}
</style>