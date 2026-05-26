# Cambios agregados

## 1. Reporte de ingresos
Se agregó una nueva sección en el menú: **Reporte de Ingresos**.
Usa los datos de `/dashboard/mensual?empresaId=...&anio=...` para mostrar ingresos pagados por mes, tabla y gráfico.

## 2. Exportar matriz
En **Control de Pagos** se agregó el botón **Exportar matriz**.
Exporta la matriz actual filtrada a Excel usando XLSX en el navegador.

## 3. Carga variable masiva
En **Control de Pagos** se agregó el botón **Carga variable**.
Sirve para conceptos como Agua, donde el monto cambia por propiedad y mes.

Formato del Excel:

| codigo | anio | mes | concepto | monto | moneda |
|---|---:|---:|---|---:|---|
| A-101 | 2026 | 1 | AGUA | 45.50 | PEN |

También hay un botón para descargar una plantilla.

## Endpoint pendiente en backend
La carga masiva llama a este endpoint:

POST /obligaciones/variables/masivo

Payload esperado:

```json
{
  "empresaId": 1,
  "usuarioId": 1,
  "items": [
    {
      "propiedadId": 1,
      "conceptoId": 2,
      "anio": 2026,
      "mes": 1,
      "monto": 45.5,
      "monedaId": 1
    }
  ]
}
```

Si ese endpoint aún no existe en tu API, la pantalla valida y prepara el Excel, pero al presionar cargar dará error hasta implementar el backend.
