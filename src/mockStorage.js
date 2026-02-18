// Simulación del sistema de almacenamiento compartido para pruebas locales
class MockStorage {
  constructor() {
    this.data = new Map();
    this.listeners = new Set();
    
    // Cargar datos existentes de localStorage
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      const value = localStorage.getItem(key);
      if (key && value) {
        this.data.set(key, value);
      }
    }
    
    // Escuchar cambios de otras pestañas
    window.addEventListener('storage', (e) => {
      if (e.key && e.newValue) {
        this.data.set(e.key, e.newValue);
        // Notificar a los listeners sin recargar
        this.notifyListeners(e.key, e.newValue);
      }
    });
  }

  async get(key, shared = false) {
    const value = this.data.get(key);
    if (!value) {
      throw new Error('Key not found');
    }
    return { key, value, shared };
  }

  async set(key, value, shared = false) {
    this.data.set(key, value);
    // Guardar en localStorage para persistencia entre pestañas
    localStorage.setItem(key, value);
    
    // Disparar evento personalizado para sincronización en la misma pestaña
    window.dispatchEvent(new CustomEvent('storage-update', { 
      detail: { key, value, shared } 
    }));
    
    return { key, value, shared };
  }

  async delete(key, shared = false) {
    this.data.delete(key);
    localStorage.removeItem(key);
    return { key, deleted: true, shared };
  }

  async list(prefix = '', shared = false) {
    const keys = Array.from(this.data.keys()).filter(k => k.startsWith(prefix));
    return { keys, prefix, shared };
  }

  // Método para suscribirse a cambios
  subscribe(callback) {
    this.listeners.add(callback);
    return () => this.listeners.delete(callback);
  }

  // Notificar a todos los listeners
  notifyListeners(key, value) {
    this.listeners.forEach(callback => {
      callback(key, value);
    });
  }
}

// Inicializar el mock storage
if (!window.storage) {
  window.storage = new MockStorage();
}

export default window.storage;