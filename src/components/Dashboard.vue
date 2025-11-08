<template>
  <div :class="['catalogo', isOpen ? 'catalogo--open' : '']">
    <div class="user-profile-container">
      <div class="user-profile-menu">
        <button @click="toggleUserMenu" class="user-icon-button" aria-label="Abrir menú de usuario">
          <!-- Icono de usuario (persona) en SVG -->
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
            <circle cx="12" cy="7" r="4"></circle>
          </svg>
        </button>

        <!-- Menú desplegable -->
        <div v-if="isUserMenuOpen" class="user-dropdown">
          <a @click.prevent="openLogoutConfirm" href="#" class="user-dropdown-item">
            Cerrar sesión
          </a>
        </div>
      </div>
    </div>

    <div v-if="productDetail" class="modal-overlay" @click.self="closeModal">
      <!-- ... (contenido del modal sin cambios) ... -->
      <div class="modal-content">
        <button @click="closeModal" class="modal-close-button" aria-label="Cerrar ventana de detalle">
          &times;
        </button>
        
        <h2 class="modal-title">{{ productDetail.nombre }}</h2>
        <div class="modal-body">
          <p class="text-lg mb-4 text-gray-700">{{ productDetail.descripcion }}</p>
          <div class="price-tag">
            Precio: <span class="text-3xl font-extrabold text-green-600">{{ formatPrice(productDetail.precio) }}</span>
          </div>

          <div class="product-details-section">
            <h4 class="details-subtitle">Detalles del Producto</h4>
            <p v-if="productDetail.detalles" class="details-content">
              {{ productDetail.detalles }}
            </p>
            <p v-else class="text-sm mt-1 text-gray-500">
              No hay detalles adicionales disponibles.
            </p>
          </div>
        </div>
        
        <div class="modal-footer">
          <button @click="closeModal" class="back-to-catalog-button">
            Regresar al Catálogo
          </button>
        </div>
      </div>
    </div>

    <div v-if="showLogoutConfirm" class="modal-overlay" @click.self="closeLogoutConfirm">
      <div class="modal-content">
        <!-- Título del modal de confirmación -->
        <h2 class="modal-title logout-title">
          ¿Está seguro de que desea cerrar sesión?
        </h2>
        
        <!-- Contenedor de botones Sí/No -->
        <div class="logout-confirm-buttons">
          <!-- Botón "No", cierra el modal -->
          <button @click="closeLogoutConfirm" class="logout-button logout-button--no">
            No
          </button>
          <!-- Botón "Sí", no hace nada funcional como pediste -->
          <button @click.prevent="confirmLogout" class="logout-button logout-button--yes">
  Sí
</button>
        </div>
      </div>
    </div>
    <div class="content-wrapper" v-if="selectedBrand">

      <div class="catalog-header">
        <button @click="backToBrands" class="back-button" aria-label="Volver a las marcas">
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="h-6 w-6">
            <line x1="19" y1="12" x2="5" y2="12"></line>
            <polyline points="12 19 5 12 12 5"></polyline>
          </svg>
        </button>
        <h1 class="catalog-title">Catálogo {{ displayBrandName }}</h1>
      </div>

      <div class="products-grid">
        <!-- ... (contenido de la cuadrícula de productos sin cambios) ... -->
        <div v-if="loading" class="product-card">
          Cargando productos...
        </div>

        <div v-else-if="error" class="product-card">
          <div class="product-name">Error</div>
          <div class="product-description">{{ error }}</div>
        </div>

        <div 
          v-else
          v-for="product in filteredProducts" 
          :key="product.id ?? product.id_producto ?? product.nombre" 
          class="product-card"
        >
          <!-- Contenido superior del producto -->
          <div class="card-top">
            <div class="product-name">{{ product.nombre }}</div>
            <div class="product-description">{{ product.descripcion }}</div>
          </div>
          
          <!-- Contenido inferior con botones y precio -->
          <div class="card-bottom">
            
            <!-- 1. Botón de Carrito (Estético) -->
            <div class="cart-button-placeholder">
              <!-- Icono de carrito (usando SVG) -->
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <circle cx="9" cy="21" r="1"></circle>
                <circle cx="20" cy="21" r="1"></circle>
                <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path>
              </svg>
            </div>
            
            <!-- 2. Enlace "Ver más" (Rectángulo Naranja) -->
            <div class="product-price-and-link">
                <!-- Rectángulo Naranja con enlace -->
                <a @click.prevent="openModal(product)" href="#" class="view-more-link">
                    Ver más
                </a>
                
                <div class="product-price">{{ formatPrice(product.precio) }}</div>
            </div>

          </div>
        </div>
        
        <p v-if="!loading && !filteredProducts.length" class="text-gray-500 italic col-span-2">
          No hay productos disponibles para esta marca.
        </p>
      </div>
    </div>

    <div class="content-wrapper" v-else-if="showCatalog">
      <!-- ... (Vista de Catálogo General - Marcas) ... -->
      <div class="catalog-header">
        <button @click="handleCatalogClick" class="back-button" aria-label="Volver a la pantalla inicial">
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="h-6 w-6">
            <line x1="19" y1="12" x2="5" y2="12"></line>
            <polyline points="12 19 5 12 12 5"></polyline>
          </svg>
        </button>
        <h1 class="catalog-title">Catálogo general</h1>
      </div>

      <div class="brands-container">
        <!-- ... (contenido de marcas sin cambios) ... -->
        <div 
          v-for="brand in brands" 
          :key="brand.id ?? brand" 
          class="brand-item" 
          @click="selectBrand(brand)"
        >
          {{ brand.nombre ?? brand }}
        </div>
      </div>
    </div>

    <main class="content-area-empty" v-else>
    </main>

    <div class="footer-button-container">
      <button @click="handleCatalogClick" class="catalog-button">
        {{ showCatalog ? 'Ocultar Catálogo' : 'Catálogo' }}
      </button>
    </div>

  </div>
</template>

<script setup>
import { ref, computed } from 'vue';
import axios from 'axios';
import authProvider from '@/providers/authProvider.js';
import { useRouter } from 'vue-router';

// Estado de la Modal
const productDetail = ref(null);

// NUEVO: Estado para el menú de usuario
const isUserMenuOpen = ref(false);

// NUEVO: Estado para el modal de confirmación de logout
const showLogoutConfirm = ref(false);

const showCatalog = ref(false);
const selectedBrand = ref(null);

const isOpen = computed(() => showCatalog.value || !!selectedBrand.value);

const brands = ref([
  { id: 1, nombre: 'Nike' },
  { id: 2, nombre: 'Adidas' },
  { id: 3, nombre: 'Puma' }
]);

const filteredProducts = ref([]);
const loading = ref(false);
const error = ref(null);

const API_BASE = 'http://localhost:8080';

const displayBrandName = computed(() => {
  if (!selectedBrand.value) return '';
  return selectedBrand.value.nombre ?? selectedBrand.value;
});

function formatPrice(value) {
  if (value == null) return '-';
  const num = typeof value === 'string' ? parseFloat(value) : value;
  if (Number.isNaN(num)) return value;
  return num.toLocaleString('es-CO', { style: 'currency', currency: 'COP' });
}

function openModal(product) {
  productDetail.value = product;
}

function closeModal() {
  productDetail.value = null;
}

function toggleUserMenu() {
  isUserMenuOpen.value = !isUserMenuOpen.value;
}

function openLogoutConfirm() {
  showLogoutConfirm.value = true;
  isUserMenuOpen.value = false; // Cierra el menú desplegable al abrir el modal
}

function closeLogoutConfirm() {
  showLogoutConfirm.value = false;
}

const router = useRouter();


async function confirmLogout() {
  try {
    await authProvider.logout();
  } catch (err) {

  } finally {
    // cerrar UI y redirigir
    showLogoutConfirm.value = false;
    isUserMenuOpen.value = false;

    try {
      await router.replace('/');
    } catch (e) {
      // fallback a push si replace falla
      router.push('/');
    }
  }
}

function handleCatalogClick() {
  if (selectedBrand.value) {
    selectedBrand.value = null;
    filteredProducts.value = [];
  } else {
    showCatalog.value = !showCatalog.value;
  }
}

async function selectBrand(brand) {
  selectedBrand.value = brand;
  loading.value = true;
  error.value = null;
  filteredProducts.value = [];

  try {
    let response;
    if (brand && typeof brand === 'object' && brand.id != null) {
      response = await axios.get(`${API_BASE}/producto/all/marca/${brand.id}`);
    } else {
      const nombre = encodeURIComponent(brand.nombre ?? brand);
      response = await axios.get(`${API_BASE}/producto/all/marca`, {
        params: { nombre }
      });
    }

    filteredProducts.value = Array.isArray(response.data) ? response.data : [];
  } catch (err) {
    console.error('Error al cargar productos:', err);
    if (err.response) {
      error.value = `Error ${err.response.status}: ${err.response.data?.message ?? 'Error del servidor'}`;
    } else if (err.request) {
      error.value = 'No se recibió respuesta del servidor. ¿Está corriendo el backend?';
    } else {
      error.value = 'Error al preparar la petición.';
    }
    filteredProducts.value = [];
  } finally {
    loading.value = false;
  }
}

function backToBrands() {
  selectedBrand.value = null;
  filteredProducts.value = [];
}
</script>
<style scoped>

.user-profile-container {
  position: fixed;
  top: 1rem;
  right: 1rem;
  z-index: 1300; /* Por encima del contenido, debajo del modal (modal z-index:2000) */
  pointer-events: auto;
}

.user-profile-menu {
  position: relative;
  display: inline-block;
}

.user-icon-button {
  background: none;
  border: none;
  padding: 0.5rem;
  cursor: pointer;
  color: #1f2937;
  border-radius: 50%;
  transition: background-color 0.2s, color 0.2s;
}

.user-icon-button svg {
  width: 28px;
  height: 28px;
  stroke: currentColor;
}

.catalogo--open .user-icon-button {
  color: #ffffff;
}

.user-icon-button:hover {
  background-color: rgba(0, 0, 0, 0.05);
}
.catalogo--open .user-icon-button:hover {
  background-color: rgba(255, 255, 255, 0.1);
}

.user-dropdown {
  position: absolute;
  top: calc(100% + 0.5rem);
  right: 0;
  background-color: white;
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  min-width: 160px;
  padding: 0.5rem;
  animation: fadeInScale 0.15s ease-out;
  z-index: 1400;
}

.user-dropdown-item {
  display: block;
  padding: 0.75rem 1rem;
  color: #374151;
  text-decoration: none;
  cursor: pointer;
  border-radius: 6px;
  font-size: 0.95rem;
  font-weight: 500;
}

.user-dropdown-item:hover {
  background-color: #f3f4f6;
  color: #1f2937;
}

.catalogo { 
  width: 100%;
  max-width: 900px; 
  margin: auto; 
  padding: 1rem; 
  padding-bottom: 5rem; 
  min-height: 100vh;
  position: relative; 
  background-color: transparent;
  transition: background-color 0.15s ease;
}

.catalogo--open {
  background-color: var(--catalog-bg, #1f2937);
}

.catalogo--open .catalog-title { color: #fff; }

.products-grid { 
  display:grid; 
  grid-template-columns:repeat(auto-fill,minmax(280px,1fr)); 
  gap:1.5rem; 
  padding:1rem; 
}

.product-card {
  background:#fff; 
  border-radius:10px; 
  padding: 1rem; /* Padding reducido un poco para acomodar el botón inferior */
  display:flex; 
  flex-direction:column;
  border-top:4px solid #4f46e5;
  justify-content: space-between; /* Alinea card-top y card-bottom */
}
.catalogo--open .product-card { 
  background-color: rgba(255,255,255,0.04); 
  border-top-color: rgba(79,70,229,0.9); 
  box-shadow:none; 
}

.card-top {
    /* Contenedor de Nombre y Descripción */
    flex-grow: 1;
    margin-bottom: 1rem;
}

.card-bottom {
    /* Contenedor de Carrito, Enlace y Precio */
    display: flex;
    justify-content: space-between;
    align-items: center;
    gap: 1rem;
    padding-top: 1rem;
    border-top: 1px solid #eee;
}

.catalogo--open .card-bottom {
    border-top-color: rgba(255, 255, 255, 0.1);
}

.cart-button-placeholder {
    padding: 0.5rem;
    border-radius: 8px;
    /* CAMBIO: Color actualizado a #4f46e5 */
    background-color: #4f46e5;
    color: white;
    cursor: default; /* Indicamos que no es funcional aún */
    transition: transform 0.1s ease;
}

.cart-button-placeholder svg {
    display: block;
    width: 24px;
    height: 24px;
}

.catalogo--open .cart-button-placeholder {
    /* CAMBIO: Tono más oscuro para el modo oscuro */
    background-color: #4338ca;
}

/* 2. Contenedor del precio y el enlace */
.product-price-and-link {
    display: flex;
    flex-direction: column;
    align-items: flex-end;
    gap: 0.3rem;
}

.view-more-link {
    /* CAMBIO: Color actualizado a #4f46e5 */
    background-color: #4f46e5;
    color: white;
    font-size: 0.8rem;
    font-weight: 600;
    padding: 0.3rem 0.6rem;
    border-radius: 4px;
    cursor: pointer;
    text-decoration: none;
    transition: background-color 0.2s;
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
}

.view-more-link:hover {
    /* CAMBIO: Tono más oscuro para el hover */
    background-color: #4338ca;
}

.product-price { 
  font-size:1.2rem; 
  font-weight:800; 
  color:#10b981; 
}
.catalogo--open .product-price { color: #34d399; }

.modal-overlay {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: rgba(0, 0, 0, 0.7);
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 2000; /* Asegura que esté por encima de todo */
}

.modal-content {
    background-color: white;
    padding: 2rem;
    border-radius: 12px;
    box-shadow: 0 10px 25px rgba(0, 0, 0, 0.5);
    width: 90%;
    max-width: 500px;
    position: relative;
    animation: fadeInScale 0.3s ease-out;
}

.modal-close-button {
    position: absolute;
    top: 10px;
    right: 15px;
    background: none;
    border: none;
    font-size: 2rem;
    color: #4f46e5;
    cursor: pointer;
    line-height: 1;
}

.modal-title {
    font-size: 1.8rem;
    font-weight: 700;
    color: #1f2937;
    margin-bottom: 1rem;
    padding-bottom: 0.5rem;
    border-bottom: 2px solid #4f46e5;
}

.price-tag {
    font-size: 1.1rem;
    color: #4b5563;
    margin-top: 1rem;
}

.product-details-section {
    margin-top: 1.5rem;
    padding-top: 1rem;
    border-top: 1px solid #e5e7eb; /* Separador sutil */
}
.details-subtitle {
    font-size: 1.1rem;
    font-weight: 600;
    color: #374151; /* gris oscuro */
    margin-bottom: 0.5rem;
}
.details-content {
    font-size: 0.95rem;
    color: #4b5563; /* gris medio */
    line-height: 1.6;
    white-space: pre-wrap; /* Para respetar saltos de línea y espacios de la DB */
}

.modal-footer {
    padding-top: 1rem;
    border-top: 1px solid #eee;
    margin-top: 2rem;
    text-align: right;
}

.back-to-catalog-button {
    background-color: #4f46e5;
    color: white;
    padding: 0.75rem 1.5rem;
    border-radius: 8px;
    font-weight: 600;
    transition: background-color 0.2s;
}

.back-to-catalog-button:hover {
    background-color: #4338ca;
}

@keyframes fadeInScale {
    from {
        opacity: 0;
        transform: scale(0.95);
    }
    to {
        opacity: 1;
        transform: scale(1);
    }
}

.logout-title {
  text-align: center;
  border-bottom: none;
  margin-bottom: 1.5rem;
  font-size: 1.5rem; /* Un poco más pequeño que el de producto */
  padding-bottom: 0;
}

.logout-confirm-buttons {
  display: flex;
  justify-content: center;
  gap: 1rem;
  margin-top: 1rem; /* Espacio sobre los botones */
}

.logout-button {
  padding: 0.75rem 1.5rem;
  border-radius: 8px;
  font-weight: 600;
  font-size: 1rem;
  transition: all 0.2s;
  width: 120px; /* Ancho fijo para botones Sí/No */
  border: none;
}

.logout-button--yes {
  background-color: #ef4444; /* Rojo para la acción */
  color: white;
}
.logout-button--yes:hover {
  background-color: #dc2626;
}

.logout-button--no {
  background-color: #f3f4f6; /* Gris claro */
  color: #374151;
  border: 1px solid #d1d5db;
}
.logout-button--no:hover {
  background-color: #e5e7eb;
}

.content-area-empty { min-height: 80vh; background-color: transparent; }
.catalog-header { display:flex; align-items:center; margin-bottom:1.5rem; padding-left:0.5rem; }
.back-button { background:none; border:none; padding:0.5rem; margin-right:1rem; cursor:pointer; }
.catalogo--open .back-button svg { color: #c5d0db; }
.catalog-title { font-size:2.25rem; font-weight:700; color:#1f2937; margin:0; }
.catalogo--open .catalog-title { color: #fff; }
.brands-container { display:flex; flex-direction:column; gap:1rem; padding:1rem; background-color: rgba(255,255,255,0.95); border-radius:12px; border:1px solid #e5e7eb; box-shadow: 0 4px 6px -1px rgba(0,0,0,0.1); }
.catalogo--open .brands-container { background-color: rgba(255,255,255,0.06); border-color: rgba(255,255,255,0.06); }
.brand-item { padding:15px; background:#f3f4f6; border-radius:8px; font-weight:600; text-align:center; color:#374151; cursor:pointer; border-left:5px solid #4f46e5; }
.catalogo--open .brand-item { background-color: rgba(255,255,255,0.04); color: #e6eef6; border-left-color: rgba(79,70,229,0.9); }
.footer-button-container { position: fixed; bottom: 0; left: 0; right: 0; padding: 1rem; background-color: white; border-top: 1px solid #eee; display: flex; justify-content: center; z-index: 1100; }
button { padding:12px 20px; border-radius:12px; font-size:1.1rem; font-weight:600; cursor:pointer; border:none; box-shadow:0 4px 6px -1px rgba(0,0,0,0.1); }
.catalog-button { width:100%; max-width:400px; background-color:#4f46e5; color:#fff; }
.catalog-button:hover { background-color:#4338ca; transform: translateY(-1px); }
</style>