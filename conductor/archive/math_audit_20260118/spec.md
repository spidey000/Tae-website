# Specification: Auditoría Matemática y Financiera

## Overview
Realizar una auditoría exhaustiva de la precisión matemática y financiera de la aplicación. Esto incluye verificar las fórmulas de hipotecas, el motor de amortización, la gestión de redondeos y la acumulación de errores (drift) en simulaciones a largo plazo. El objetivo final es garantizar que los cálculos sean sólidos, precisos y coherentes entre la interfaz de usuario, las tablas y los gráficos.

## Functional Requirements
- **Auditoría de Fórmulas:** Verificar la corrección teórica de las fórmulas en `src/utils/mortgageCalculations.js` y `src/utils/amortizationEngine.js`.
- **Análisis de Redondeo y Deriva:** Identificar posibles errores de precisión decimal y errores acumulados en planes de amortización de hasta 40 años.
- **Validación de UI e Inputs:** Asegurar que los datos introducidos por el usuario se procesen y pasen a los cálculos sin pérdida de integridad.
- **Consistencia Visual:** Verificar que los datos representados en los gráficos (Recharts) coincidan exactamente con los valores de las tablas de amortización.
- **Resumen Educativo:** El informe debe incluir un resumen y explicación detallada de la matemática utilizada en cada método (incluso si son correctos), con un enfoque educativo.
- **Corrección de Errores:** Implementar soluciones para cualquier discrepancia o error matemático identificado.
- **Refuerzo de Tests:** Añadir o mejorar los tests unitarios para cubrir casos críticos de redondeo y condiciones de borde.

## Non-Functional Requirements
- **Idioma del Informe:** El informe final de auditoría debe estar escrito íntegramente en español de España.
- **Ubicación del Informe:** El informe se guardará en `docs/auditoria_matematica.md`.
- **Precisión:** Los cálculos deben seguir los estándares financieros habituales (redondeo a dos decimales cuando sea necesario, pero manteniendo la precisión en cálculos intermedios).

## Acceptance Criteria
- [ ] Informe detallado en `docs/auditoria_matematica.md` (en español), incluyendo explicaciones educativas de las fórmulas.
- [ ] Corrección de cualquier error de cálculo identificado en el código.
- [ ] Creación/Mejora de tests unitarios que validen la precisión financiera.
- [ ] Coherencia total confirmada entre tablas y gráficos.
- [ ] Todos los tests (existentes y nuevos) pasan correctamente.

## Out of Scope
- Rediseño visual de la interfaz (a menos que sea necesario para corregir un error de visualización de datos).
- Adición de nuevas funcionalidades financieras no relacionadas con la precisión de los cálculos actuales.
