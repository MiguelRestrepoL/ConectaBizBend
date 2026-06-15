import {
  getKPIsPedidos,
  getKPIsClientes,
  getVentasPorDia,
  getTopProductos,
  getPedidosRecientes
} from '../repository/estadisticas.repository.js';
 
export const getEstadisticasService = async (userId, { fechaInicio, fechaFin } = {}) => {
  // Calcular período anterior para comparativas (mismo rango de días, hacia atrás)
  let fechaInicioAnterior, fechaFinAnterior;
  if (fechaInicio && fechaFin) {
    const dias = Math.ceil(
      (new Date(fechaFin) - new Date(fechaInicio)) / (1000 * 60 * 60 * 24)
    );
    fechaFinAnterior = new Date(fechaInicio);
    fechaFinAnterior.setDate(fechaFinAnterior.getDate() - 1);
    fechaInicioAnterior = new Date(fechaFinAnterior);
    fechaInicioAnterior.setDate(fechaInicioAnterior.getDate() - dias);
  }
 
  const [kpisPedidos, kpisClientes, ventasPorDia, topProductos, pedidosRecientes, kpisPedidosAnterior] =
    await Promise.all([
      getKPIsPedidos(userId, fechaInicio, fechaFin),
      getKPIsClientes(userId, fechaInicio, fechaFin),
      getVentasPorDia(userId, fechaInicio, fechaFin),
      getTopProductos(userId, fechaInicio, fechaFin, 5),
      getPedidosRecientes(userId, 8),
      fechaInicioAnterior
        ? getKPIsPedidos(userId, fechaInicioAnterior.toISOString(), fechaFinAnterior.toISOString())
        : Promise.resolve(null)
    ]);
 
  // Calcular variaciones vs período anterior
  const calcVariacion = (actual, anterior) => {
    if (!anterior || parseFloat(anterior) === 0) return null;
    return (((parseFloat(actual) - parseFloat(anterior)) / parseFloat(anterior)) * 100).toFixed(1);
  };
 
  return {
    kpis: {
      total_pedidos: parseInt(kpisPedidos?.total_pedidos || 0),
      ingresos_totales: parseFloat(kpisPedidos?.ingresos_totales || 0),
      ticket_promedio: parseFloat(kpisPedidos?.ticket_promedio || 0),
      total_clientes: kpisClientes.total_clientes,
      clientes_nuevos: kpisClientes.clientes_nuevos,
      pedidos_preparando: parseInt(kpisPedidos?.pedidos_preparando || 0),
      pedidos_enviados: parseInt(kpisPedidos?.pedidos_enviados || 0),
      pedidos_entregados: parseInt(kpisPedidos?.pedidos_entregados || 0),
      // Variaciones
      variacion_pedidos: calcVariacion(kpisPedidos?.total_pedidos, kpisPedidosAnterior?.total_pedidos),
      variacion_ingresos: calcVariacion(kpisPedidos?.ingresos_totales, kpisPedidosAnterior?.ingresos_totales),
    },
    ventas_por_dia: ventasPorDia,
    top_productos: topProductos,
    pedidos_recientes: pedidosRecientes
  };
};