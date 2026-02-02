# Delivery Windows API

Sistema de reserva de ventanas de despacho con cobertura geográfica, control estricto de capacidad y precios diferenciados.  
El proyecto implementa un **API REST en Java (Spring Boot)** y un **frontend opcional en React** para visualización y pruebas de concurrencia.

---

## 🧠 Descripción del Proyecto

El sistema permite a los clientes:

- Consultar fechas disponibles según su dirección.
- Visualizar ventanas horarias con capacidad limitada por zona.
- Reservar una ventana de despacho garantizando **consistencia bajo concurrencia**.

### Principales características

- **Cobertura geográfica**  
  Las direcciones se resuelven a zonas lógicas, las cuales determinan qué ventanas están disponibles.

- **Gestión de capacidad por ventana**  
  Cada ventana tiene una capacidad máxima. El sistema garantiza que **no se vendan más cupos de los disponibles**, incluso con múltiples solicitudes simultáneas.

- **Precios diferenciados**  
  Cada ventana puede tener un costo asociado.

- **Manejo de concurrencia**  
  Se asegura atomicidad en la operación de reserva para evitar over-booking.

---

## ⚙️ Requisitos Previos

- Java 17+
- Maven 3.6+
- Node.js 18+ (solo para el frontend)

---

## ▶️ Ejecución del Proyecto

### Backend (API)

1. Navega a la raíz del proyecto.
2. Ejecuta:

```bash
mvn spring-boot:run
```

La API quedará disponible en:

```
http://localhost:8080
```

### Endpoints principales

* **Consultar fechas disponibles**

```
GET /api/availability/dates?address={direccion}
```

* **Consultar ventanas para una fecha**

```
GET /api/windows?address={direccion}&date={yyyy-MM-dd}
```

* **Reservar una ventana**

```
POST /api/reservations
{
  "address": "Las Condes",
  "windowId": "w-20260128-1"
}
```

Respuestas esperadas:

* `200 OK` → reserva confirmada
* `409 Conflict` → cupo agotado (regla de negocio)

---

## 🖥️ Frontend (Opcional)

El frontend permite visualizar y probar el flujo completo de consulta y reserva, incluyendo escenarios de concurrencia.

### Ejecución

```bash
cd front-end
npm install
npm run dev
```

La aplicación se levanta normalmente en:

```
http://localhost:5173
```

### Comportamiento bajo concurrencia (UX)

* Múltiples usuarios pueden ver el mismo cupo disponible.
* Si dos usuarios intentan reservar simultáneamente:

  * Solo uno obtiene la reserva.
  * El otro recibe un **409 – Cupo agotado**, mostrado como mensaje funcional en la interfaz.
* El frontend refresca el estado tras cada intento, evitando estados inconsistentes.

---

## 🔒 Estrategia de Concurrencia

El objetivo es evitar que dos personas reserven el último cupo al mismo tiempo ("over-booking").
Para lograrlo, el sistema asegura que la revisión de disponibilidad y la confirmación de la reserva sean una sola operación indivisible.

### ¿Cómo funciona?

Cuando un usuario intenta reservar:

1.  **Bloqueo**: El sistema detiene momentáneamente cualquier otra operación sobre esa misma ventana horaria.
2.  **Verificación**: Consulta la capacidad real actualizada en ese preciso instante.
3.  **Acción**:
    *   Si queda espacio: Guarda la reserva y descuenta el cupo.
    *   Si se llenó: Rechaza la operación inmediatamente.
4.  **Desbloqueo**: Libera la ventana para procesar la siguiente solicitud.

Este mecanismo (implementado con `ReentrantLock` por ID de ventana) garantiza que las solicitudes se procesen *una por una* para cada horario, manteniendo los datos siempre consistentes sin afectar el rendimiento de otras ventanas.

### Escalabilidad (Siguientes pasos)

La solución actual es ideal para una instancia centralizada. Si el sistema creciera a múltiples servidores distribuidos, este control se movería a la Base de Datos (usando "Optimistic Locking" o "Pessimistic Locking") para coordinar todas las instancias bajo la misma regla.

---

## 🧪 Pruebas de concurrencia

El proyecto incluye pruebas que simulan múltiples reservas concurrentes sobre la misma ventana, verificando que:

* Nunca se supera la capacidad máxima.
* Las reservas excedentes reciben error de negocio (`409's`).

---
