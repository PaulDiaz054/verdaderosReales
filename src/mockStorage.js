// src/mockStorage.js
// En producción (Vercel) usa rutas relativas /api/storage
// En desarrollo local usa la variable de entorno VITE_SERVER_URL

const BASE_URL = import.meta.env.VITE_SERVER_URL
  ? `${import.meta.env.VITE_SERVER_URL}/api/storage`
  : "/api/storage";

class SharedStorage {
  async get(key, shared = false) {
    const response = await fetch(`${BASE_URL}/${encodeURIComponent(key)}`);

    if (response.status === 404) {
      throw new Error("Key not found");
    }

    if (!response.ok) {
      throw new Error(`Error al obtener clave: ${response.statusText}`);
    }

    const data = await response.json();
    return { key: data.key, value: data.value, shared };
  }

  async set(key, value, shared = false) {
    const response = await fetch(`${BASE_URL}/${encodeURIComponent(key)}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ value }),
    });

    if (!response.ok) {
      throw new Error(`Error al guardar clave: ${response.statusText}`);
    }

    const data = await response.json();
    return { key: data.key, value: data.value, shared };
  }

  async delete(key, shared = false) {
    const response = await fetch(`${BASE_URL}/${encodeURIComponent(key)}`, {
      method: "DELETE",
    });

    if (!response.ok) {
      throw new Error(`Error al eliminar clave: ${response.statusText}`);
    }

    const data = await response.json();
    return { key: data.key, deleted: data.deleted, shared };
  }

  async list(prefix = "", shared = false) {
    const response = await fetch(
      `${BASE_URL}?prefix=${encodeURIComponent(prefix)}`
    );

    if (!response.ok) {
      throw new Error(`Error al listar claves: ${response.statusText}`);
    }

    const data = await response.json();
    return { keys: data.keys, prefix, shared };
  }
}

if (!window.storage) {
  window.storage = new SharedStorage();
}

export default window.storage;
