# Informe de Auditoría Matemática y Financiera

Este documento detalla la auditoría realizada sobre los motores de cálculo de la aplicación, las fórmulas utilizadas y las correcciones implementadas para garantizar la máxima precisión financiera.

## 1. Metodología de Cálculo

La aplicación utiliza el **Sistema de Amortización Francés**, caracterizado por cuotas constantes (siempre que el tipo de interés sea fijo).

### 1.1 Fórmulas Base

#### Cálculo de la Cuota Mensual (PMT)
La fórmula utilizada para determinar la cuota mensual $a$ es:

$$a = P \cdot \frac{i \cdot (1 + i)^n}{(1 + i)^n - 1}$$

Donde:
- $P$: Principal (capital prestado).
- $i$: Tipo de interés mensual (TIN anual / 12).
- $n$: Número total de pagos (años * 12).

#### Cálculo del TAE (Tasa Anual Equivalente)
El TAE se calcula mediante el método de **Newton-Raphson** para encontrar la raíz de la ecuación del Valor Actual Neto (VAN):

$$\sum_{k=1}^n \frac{C_k}{(1 + i_{eff})^k} - P_{neto} = 0$$

Donde $i_{eff}$ es el tipo de interés efectivo mensual, que luego se anualiza:
$$TAE = (1 + i_{eff})^{12} - 1$$

## 2. Hallazgos de la Auditoría

### 2.1 Gestión de Redondeos y Punto Flotante
Se identificó un problema clásico de precisión en JavaScript al multiplicar importes por 100 para redondear a dos decimales. Por ejemplo, `1.005 * 100` resultaba en `100.49999999999999`, lo que provocaba que `Math.round()` devolviera `100` en lugar de `101`, resultando en un redondeo a `1.00` en lugar de `1.01`.

**Corrección:** Se implementó una lógica de redondeo con un épsilon de seguridad:
```javascript
Math.round(valor * 100 + 1e-9) / 100
```

### 2.2 Deriva de Saldo (Drift)
En simulaciones a muy largo plazo (40 años), la acumulación de decimales internos (utilizamos precisión de 12 decimales para cálculos intermedios) podía provocar que el saldo final fuera ligeramente negativo o un "cero negativo" en el último mes.

**Corrección:** Se refactorizó el motor de amortización para forzar el saldo a cero si el cálculo resulta en un valor negativo o extremadamente pequeño ($< 10^{-10}$).

### 2.3 Consistencia Gráfico-Tabla
Se verificó que los datos transformados para los componentes de Recharts coinciden exactamente con los valores de la tabla de amortización, utilizando la misma fuente de verdad (`schedule`).

## 3. Pruebas de Estrés
Se han superado con éxito las siguientes pruebas:
- **Plazos Extremos:** Hipotecas de hasta 100 años (límite del motor de 1200 meses).
- **Tipos de Interés:** Desde 0.01% hasta 25%.
- **Casos de Borde:** Redondeo exacto de .005 y amortizaciones anticipadas en el primer y último mes.

## 4. Conclusión
La auditoría confirma que los cálculos de la aplicación son matemáticamente sólidos y financieramente precisos para propósitos educativos y de simulación. Se recomienda mantener la precisión de 12 decimales para cálculos internos y redondear únicamente en la capa de presentación y en la asignación final de saldos mensuales.
