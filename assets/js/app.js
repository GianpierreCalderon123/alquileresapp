const API_BASE = "https://alquileresapi.duckdns.org/api";
const $ = id => document.getElementById(id);
const meses = ["Ene","Feb","Mar","Abr","May","Jun","Jul","Ago","Sep","Oct","Nov","Dic"];

let session = JSON.parse(localStorage.getItem("session") || "null");
let chart = null;
let chartIngresos = null;
let modals = {};

const state = {
  monedas: [],
  propietarios: [],
  propiedades: [],
  conceptos: [],
  obligaciones: [],
  matriz: [],
  dashboardMensual: [],
  cargaVariable: []
};

const textos = {
  es: {
    app:"Sistema de Control de Propiedades", login:"Acceso al sistema", user:"Usuario", password:"Contraseña", enter:"Ingresar", logout:"Salir",
    dashboard:"Dashboard", owners:"Propietarios", properties:"Propiedades", concepts:"Conceptos", payments:"Control de Pagos", time:"Temporalidad",
    export:"Exportar todo a Excel", reload:"Recargar", year:"Año", month:"Mes",
    paidDone:"Pagos Realizados", paidPending:"Pagos Pendientes", obligations:"Obligaciones", monthlySummary:"Resumen Mensual de Pagos", lastObligations:"Últimas obligaciones",
    property:"Propiedad", concept:"Concepto", period:"Periodo", amount:"Monto", balance:"Saldo", status:"Estado", actions:"Acciones",
    newOwner:"Nuevo", newProperty:"Nueva", newConcept:"Nuevo", generateObligations:"Generar Obligaciones",
    name:"Nombre", document:"Documento", phone:"Teléfono", code:"Código", type:"Tipo", address:"Dirección", frequency:"Frecuencia",
    addStatus:"Agregar Estado", addOwner:"Agregar Dueño", addConceptAmount:"Agregar Concepto/Monto",
    statusHistory:"Estados", ownerHistory:"Dueños", conceptHistory:"Conceptos/Montos", start:"Inicio", end:"Fin", reason:"Motivo",
    owner:"Propietario", annul:"Anular", edit:"Editar", pay:"Pagar", all:"Todos", allConcepts:"Todos los conceptos", paid:"Pagado", pending:"Pendiente"
  },
  en: {
    app:"Property Control System", login:"System Access", user:"User", password:"Password", enter:"Login", logout:"Logout",
    dashboard:"Dashboard", owners:"Owners", properties:"Properties", concepts:"Concepts", payments:"Payment Control", time:"Temporality",
    export:"Export all to Excel", reload:"Reload", year:"Year", month:"Month",
    paidDone:"Completed Payments", paidPending:"Pending Payments", obligations:"Obligations", monthlySummary:"Monthly Payment Summary", lastObligations:"Latest obligations",
    property:"Property", concept:"Concept", period:"Period", amount:"Amount", balance:"Balance", status:"Status", actions:"Actions",
    newOwner:"New", newProperty:"New", newConcept:"New", generateObligations:"Generate Obligations",
    name:"Name", document:"Document", phone:"Phone", code:"Code", type:"Type", address:"Address", frequency:"Frequency",
    addStatus:"Add Status", addOwner:"Add Owner", addConceptAmount:"Add Concept/Amount",
    statusHistory:"Statuses", ownerHistory:"Owners", conceptHistory:"Concepts/Amounts", start:"Start", end:"End", reason:"Reason",
    owner:"Owner", annul:"Annul", edit:"Edit", pay:"Pay", all:"All", allConcepts:"All concepts", paid:"Paid", pending:"Pending"
  },
  zh: {
    app:"物业管理系统", login:"系统登录", user:"用户", password:"密码", enter:"登录", logout:"退出",
    dashboard:"仪表板", owners:"业主", properties:"物业", concepts:"费用项目", payments:"付款管理", time:"时间记录",
    export:"导出到Excel", reload:"刷新", year:"年份", month:"月份",
    paidDone:"已完成付款", paidPending:"待付款", obligations:"应付款", monthlySummary:"每月付款汇总", lastObligations:"最新应付款",
    property:"物业", concept:"费用项目", period:"期间", amount:"金额", balance:"余额", status:"状态", actions:"操作",
    newOwner:"新增", newProperty:"新增", newConcept:"新增", generateObligations:"生成应付款",
    name:"名称", document:"证件", phone:"电话", code:"编号", type:"类型", address:"地址", frequency:"频率",
    addStatus:"添加状态", addOwner:"添加业主", addConceptAmount:"添加费用/金额",
    statusHistory:"状态记录", ownerHistory:"业主记录", conceptHistory:"费用/金额记录", start:"开始", end:"结束", reason:"原因",
    owner:"业主", annul:"作废", edit:"编辑", pay:"付款", all:"全部", allConcepts:"所有费用项目", paid:"已付款", pending:"待付款"
  }
};

function safeSet(id, value) {
  const el = $(id);
  if (el) el.innerHTML = value;
}

function setLang(lang) {
  localStorage.setItem("lang", lang);
  const t = textos[lang] || textos.es;

  if ($("lang")) $("lang").value = lang;

  safeSet("txtAppTitle", t.app);
  safeSet("txtLoginTitle", t.login);
  safeSet("txtUser", t.user);
  safeSet("txtPassword", t.password);
  safeSet("txtLoginBtn", t.enter);
  safeSet("txtLogout", t.logout);

  safeSet("txtYear", t.year);
  safeSet("txtMonth", t.month);
  safeSet("txtExportAll", t.export);
  safeSet("txtReload", t.reload);

  safeSet("navDashboard", t.dashboard);
  safeSet("navOwners", t.owners);
  safeSet("navProperties", t.properties);
  safeSet("navConcepts", t.concepts);
  safeSet("navPayments", t.payments);
  safeSet("navTime", t.time);

  safeSet("titleDashboard", t.dashboard);
  safeSet("titleOwners", t.owners);
  safeSet("titleProperties", t.properties);
  safeSet("titleConcepts", t.concepts);
  safeSet("titlePayments", t.payments);
  safeSet("titleTime", t.time);

  safeSet("txtPaidDone", t.paidDone);
  safeSet("txtPaidPending", t.paidPending);
  safeSet("txtObligations", t.obligations);
  safeSet("txtMonthlySummary", t.monthlySummary);
  safeSet("txtLastObligations", t.lastObligations);

  safeSet("thLastProperty", t.property);
  safeSet("thLastConcept", t.concept);
  safeSet("thLastPeriod", t.period);
  safeSet("thLastAmount", t.amount);
  safeSet("thLastBalance", t.balance);
  safeSet("thLastStatus", t.status);

  safeSet("btnNewOwner", t.newOwner);
  safeSet("btnNewProperty", t.newProperty);
  safeSet("btnNewConcept", t.newConcept);
  safeSet("btnGenerateObligations", t.generateObligations);

  safeSet("thOwnerName", t.name);
  safeSet("thOwnerDocument", t.document);
  safeSet("thOwnerPhone", t.phone);
  safeSet("thOwnerActions", t.actions);

  safeSet("thPropertyCode", t.code);
  safeSet("thPropertyName", t.name);
  safeSet("thPropertyType", t.type);
  safeSet("thPropertyAddress", t.address);
  safeSet("thPropertyStatus", t.status);
  safeSet("thPropertyActions", t.actions);

  safeSet("thConceptName", t.name);
  safeSet("thConceptFrequency", t.frequency);
  safeSet("thConceptActions", t.actions);

  safeSet("lblTimeProperty", t.property);
  safeSet("btnAddStatus", t.addStatus);
  safeSet("btnAddOwner", t.addOwner);
  safeSet("btnAddConceptAmount", t.addConceptAmount);

  safeSet("titleStatusHistory", t.statusHistory);
  safeSet("titleOwnerHistory", t.ownerHistory);
  safeSet("titleConceptHistory", t.conceptHistory);

  safeSet("thStatusState", t.status);
  safeSet("thStatusStart", t.start);
  safeSet("thStatusEnd", t.end);
  safeSet("thStatusReason", t.reason);
  safeSet("thStatusActions", t.actions);

  safeSet("thOwnerHistOwner", t.owner);
  safeSet("thOwnerHistStart", t.start);
  safeSet("thOwnerHistEnd", t.end);
  safeSet("thOwnerHistActions", t.actions);

  safeSet("thConceptHistConcept", t.concept);
  safeSet("thConceptHistAmount", t.amount);
  safeSet("thConceptHistFrequency", t.frequency);
  safeSet("thConceptHistStart", t.start);
  safeSet("thConceptHistEnd", t.end);
  safeSet("thConceptHistActions", t.actions);

  setup();
  fillConceptos();
  renderChart();
  renderReporteIngresos();
  renderPropietarios();
  renderPropiedades();
  renderConceptos();
  renderUltimasObligaciones();
  renderMatriz();
  renderReporteIngresos();
}

function api(path, opt = {}) {
  return fetch(API_BASE + path, {
    headers: { "Content-Type": "application/json" },
    ...opt
  }).then(async r => {
    if (!r.ok) throw new Error(await r.text());
    if (r.status === 204) return null;
    const text = await r.text();
    return text ? JSON.parse(text) : null;
  });
}

function toast(message, type = "success") {
  if (!$("toastBox")) return;
  $("toastBox").innerHTML = `<div class="alert alert-${type} shadow">${message}</div>`;
  setTimeout(() => $("toastBox").innerHTML = "", 3500);
}

function err(e) {
  console.error(e);
  toast(e.message || "Error", "danger");
}

function empresaId() {
  return session?.empresaId;
}

function anio() {
  return Number($("anioGlobal")?.value || new Date().getFullYear());
}

function mes() {
  return $("mesGlobal")?.value ? Number($("mesGlobal").value) : null;
}

function money(value, symbol = "S/") {
  return `${symbol || "S/"} ${Number(value || 0).toLocaleString("es-PE", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  })}`;
}

function show(id) {
  document.querySelectorAll(".section").forEach(s => s.classList.remove("active"));
  if ($(id)) $(id).classList.add("active");
}

function showApp() {
  if (session) {
    $("loginScreen").style.display = "none";
    $("app").style.display = "block";
    safeSet("empresaActual", session.empresaRazonSocial || "");
    initApp();
  } else {
    $("loginScreen").style.display = "flex";
    $("app").style.display = "none";
  }
}

async function login() {
  try {
    session = await api("/auth/login", {
      method: "POST",
      body: JSON.stringify({
        username: $("loginUsername").value,
        password: $("loginPassword").value
      })
    });

    localStorage.setItem("session", JSON.stringify(session));
    showApp();
  } catch(e) {
    err(e);
  }
}

function logout() {
  localStorage.removeItem("session");
  session = null;
  showApp();
}

async function initApp() {
  try {
    await loadMonedas();
    await Promise.all([loadPropietarios(), loadPropiedades(), loadConceptos()]);
    await refreshMain();
    await loadHistoriales();
  } catch(e) {
    err(e);
  }
}

async function refreshMain() {
  await Promise.all([
    loadDashboard(),
    loadObligaciones(),
    loadMatriz(),
    loadDashboardMensual()
  ]);
  renderReporteIngresos();
}

async function loadMonedas() {
  state.monedas = await api("/monedas");
  fillMonedas();
}

async function loadPropietarios() {
  state.propietarios = await api(`/propietarios?empresaId=${empresaId()}`);
  renderPropietarios();
  fillPropietarios();
}

async function loadPropiedades() {
  state.propiedades = await api(`/propiedades?empresaId=${empresaId()}`);
  renderPropiedades();
  fillPropiedades();
}

async function loadConceptos() {
  state.conceptos = await api(`/conceptos-pago?empresaId=${empresaId()}`);
  renderConceptos();
  fillConceptos();
}

async function loadDashboard() {
  const q = new URLSearchParams({ empresaId: empresaId(), anio: anio() });
  if (mes()) q.set("mes", mes());

  const d = await api(`/dashboard/resumen?${q}`);

  safeSet("totalPagado", money(d.totalPagado || d.total_pagado));
  safeSet("totalPendiente", money(d.totalPendiente || d.total_pendiente));
  safeSet("totalObligaciones", money(d.totalObligaciones || d.total_obligaciones));
  safeSet("cantidadPagadas", `${d.cantidadPagadas || d.cantidad_pagadas || 0} pagos`);
  safeSet("cantidadPendientes", `${d.cantidadPendientes || d.cantidad_pendientes || 0} pendientes`);
  safeSet("cantidadObligaciones", `${d.cantidadObligaciones || d.cantidad_obligaciones || 0} obligaciones`);
}

async function loadDashboardMensual() {
  state.dashboardMensual = await api(`/dashboard/mensual?empresaId=${empresaId()}&anio=${anio()}`);
  renderChart();
}

async function loadObligaciones() {
  const q = new URLSearchParams({ empresaId: empresaId(), anio: anio() });
  if (mes()) q.set("mes", mes());

  state.obligaciones = await api(`/obligaciones?${q}`);
  renderUltimasObligaciones();
}

async function loadMatriz() {
  const q = new URLSearchParams({
    empresaId: empresaId(),
    anio: $("filtroAnio")?.value || anio()
  });

  if ($("filtroConcepto")?.value) q.set("conceptoId", $("filtroConcepto").value);
  if ($("filtroEstado")?.value) q.set("estado", $("filtroEstado").value);

  state.matriz = await api(`/matriz-pagos?${q}`);
  renderMatriz();
  renderReporteIngresos();
}

async function loadHistoriales() {
  const id = Number($("histPropiedad")?.value || state.propiedades[0]?.id || 0);
  if (!id) return;

  $("histPropiedad").value = id;

  const [estados, propietarios, conceptos] = await Promise.all([
    api(`/propiedades/${id}/estados-historial`),
    api(`/propiedades/${id}/propietarios-historial`),
    api(`/propiedades/${id}/conceptos-historial`)
  ]);

  const t = textos[localStorage.getItem("lang") || "es"] || textos.es;

  safeSet("tablaEstadosHist", estados.map(x => `
    <tr>
      <td><span class="badge-soft">${x.estado}</span></td>
      <td>${date(x.fecha_inicio || x.fechaInicio)}</td>
      <td>${date(x.fecha_fin || x.fechaFin) || "-"}</td>
      <td>${x.motivo || "-"}</td>
      <td><button class="btn btn-sm btn-danger" onclick="anularHist('estado',${x.id})">${t.annul}</button></td>
    </tr>
  `).join(""));

  safeSet("tablaPropietariosHist", propietarios.map(x => `
    <tr>
      <td>${x.propietario || "-"}</td>
      <td>${x.porcentaje || 0}%</td>
      <td>${date(x.fecha_inicio || x.fechaInicio)}</td>
      <td>${date(x.fecha_fin || x.fechaFin) || "-"}</td>
      <td><button class="btn btn-sm btn-danger" onclick="anularHist('propietario',${x.id})">${t.annul}</button></td>
    </tr>
  `).join(""));

  safeSet("tablaConceptosHist", conceptos.map(x => `
    <tr>
      <td>${x.concepto || "-"}</td>
      <td>${money(x.monto, x.moneda_codigo)}</td>
      <td>${x.frecuencia || "-"}</td>
      <td>${date(x.fecha_inicio || x.fechaInicio)}</td>
      <td>${date(x.fecha_fin || x.fechaFin) || "-"}</td>
      <td><button class="btn btn-sm btn-danger" onclick="anularHist('concepto',${x.id})">${t.annul}</button></td>
    </tr>
  `).join(""));
}

function date(v) {
  return v ? String(v).substring(0, 10) : "";
}

function renderChart() {
  if (!$("chartMensual")) return;

  const labels = meses;
  const dataPagado = state.dashboardMensual.map(x => x.pagado || 0);
  const dataPendiente = state.dashboardMensual.map(x => x.pendiente || 0);

  if (chart) chart.destroy();

  chart = new Chart($("chartMensual"), {
    type: "bar",
    data: {
      labels,
      datasets: [
        { label: "Pagado", data: dataPagado, backgroundColor: "#28936f" },
        { label: "Pendiente", data: dataPendiente, backgroundColor: "#df4f5f" }
      ]
    },
    options: {
      responsive: true,
      plugins: { legend: { position: "bottom" } },
      scales: {
        x: { stacked: true },
        y: { stacked: true, beginAtZero: true }
      }
    }
  });
}

function renderPropietarios() {
  const t = textos[localStorage.getItem("lang") || "es"] || textos.es;
  safeSet("tablaPropietarios", state.propietarios.map(p => `
    <tr>
      <td>${p.nombre}</td>
      <td>${p.documento || "-"}</td>
      <td>${p.telefono || "-"}</td>
      <td>${p.email || "-"}</td>
      <td>
        <button class="btn btn-sm btn-primary" onclick="openPropietarioModal(${p.id})">${t.edit}</button>
        <button class="btn btn-sm btn-danger" onclick="anular('/propietarios/${p.id}/anular')">${t.annul}</button>
      </td>
    </tr>
  `).join(""));
}

function renderPropiedades() {
  const t = textos[localStorage.getItem("lang") || "es"] || textos.es;
  safeSet("tablaPropiedades", state.propiedades.map(p => `
    <tr>
      <td>${p.codigo}</td>
      <td>${p.nombre}</td>
      <td>${p.tipo}</td>
      <td>${p.direccion || "-"}</td>
      <td>${p.estado_actual || p.estadoActual || "-"}</td>
      <td>
        <button class="btn btn-sm btn-primary" onclick="openPropiedadModal(${p.id})">${t.edit}</button>
        <button class="btn btn-sm btn-secondary" onclick="goTemporalidad(${p.id})">${t.time}</button>
        <button class="btn btn-sm btn-danger" onclick="anular('/propiedades/${p.id}/anular')">${t.annul}</button>
      </td>
    </tr>
  `).join(""));
}

function renderConceptos() {
  const t = textos[localStorage.getItem("lang") || "es"] || textos.es;
  safeSet("tablaConceptos", state.conceptos.map(c => `
    <tr>
      <td>${c.nombre}</td>
      <td>${c.frecuencia}</td>
      <td>
 ${
   c.es_variable
   ? "Variable"
   : "Fijo"
 }
</td>
      <td>
        <button class="btn btn-sm btn-primary" onclick="openConceptoModal(${c.id})">${t.edit}</button>
        <button class="btn btn-sm btn-danger" onclick="anular('/conceptos-pago/${c.id}/anular')">${t.annul}</button>
      </td>
    </tr>
  `).join(""));
}

function renderUltimasObligaciones() {
  const t = textos[localStorage.getItem("lang") || "es"] || textos.es;
  safeSet("tablaUltimasObligaciones", state.obligaciones.slice(0,20).map(o => `
    <tr>
      <td>${o.codigo || ""} - ${o.propiedad || ""}</td>
      <td>${o.concepto || ""}</td>
      <td>${o.mes}/${o.anio}</td>
      <td>${money(o.monto, o.moneda)}</td>
      <td>${money(o.saldo, o.moneda)}</td>
      <td>${o.estado}</td>
      <td>${o.estado !== "PAGADO" ? `<button class="btn btn-sm btn-primary" onclick="openPagoModal(${o.id})">${t.pay}</button>` : ""}</td>
    </tr>
  `).join(""));
}

function renderMatriz() {
  const t = textos[localStorage.getItem("lang") || "es"] || textos.es;
  safeSet("theadMatriz", `
    <tr>
      <th>${t.code}</th>
      <th>${t.property}</th>
      ${meses.map(m => `<th>${m}</th>`).join("")}
    </tr>
  `);

  const grouped = {};

  state.matriz.forEach(r => {
    const id = r.propiedadId || r.propiedad_id;
    if (!grouped[id]) grouped[id] = { codigo: r.codigo, propiedad: r.propiedad, meses: {} };

    if (r.obligacionId || r.obligacion_id) {
      if (!grouped[id].meses[r.mes]) grouped[id].meses[r.mes] = [];
      grouped[id].meses[r.mes].push(r);
    }
  });

  const rows = Object.values(grouped).map(row => {
    let html = `<tr><td>${row.codigo}</td><td>${row.propiedad}</td>`;

    for (let m = 1; m <= 12; m++) {
      const obs = row.meses[m] || [];
      html += `<td>${obs.length ? obs.map(o => {
        const estado = o.estado;
        const cls = estado === "PAGADO" ? "cell-pagado" : estado === "PARCIAL" ? "cell-parcial" : "cell-pendiente";
        const id = o.obligacionId || o.obligacion_id;

        return `
          <div class="payment-cell ${cls}">
            <b>${money(o.monto, o.moneda)}</b><br>
            ${o.concepto}<br>
            ${estado}<br>
            ${t.balance}: ${money(o.saldo, o.moneda)}<br>
            ${estado !== "PAGADO" ? `<button class="btn btn-sm btn-primary mt-1" onclick="openPagoModal(${id})">${t.pay}</button>` : ""}
          </div>
        `;
      }).join("") : "-"}</td>`;
    }

    return html + "</tr>";
  }).join("");

  safeSet("tbodyMatriz", rows);
}


function renderReporteIngresos() {
  const rows = meses.map((nombre, index) => {
    const mesN = index + 1;
    const item = state.dashboardMensual.find(x => Number(x.mes || x.month || mesN) === mesN) || {};
    const pagado = Number(item.pagado || item.totalPagado || item.total_pagado || 0);
    const pendiente = Number(item.pendiente || item.totalPendiente || item.total_pendiente || 0);
    return {
      mes: nombre,
      pagado,
      pendiente,
      total: pagado + pendiente
    };
  });

  const total = rows.reduce((sum, r) => sum + r.pagado, 0);
  safeSet("ingresosTotalAnio", money(total));
  safeSet("ingresosTotalMeses", `${rows.filter(r => r.pagado > 0).length} meses con ingresos`);
  safeSet("tablaReporteIngresos", rows.map(r => `
    <tr>
      <td>${r.mes}</td>
      <td>${money(r.pagado)}</td>
      <td>${money(r.pendiente)}</td>
      <td>${money(r.total)}</td>
    </tr>
  `).join(""));

  if ($("chartIngresos")) {
    if (chartIngresos) chartIngresos.destroy();
    chartIngresos = new Chart($("chartIngresos"), {
      type: "bar",
      data: {
        labels: meses,
        datasets: [{ label: "Ingresos", data: rows.map(r => r.pagado), backgroundColor: "#28936f" }]
      },
      options: {
        responsive: true,
        plugins: { legend: { position: "bottom" } },
        scales: { y: { beginAtZero: true } }
      }
    });
  }
}

function exportarReporteIngresos() {
  const rows = meses.map((nombre, index) => {
    const mesN = index + 1;
    const item = state.dashboardMensual.find(x => Number(x.mes || x.month || mesN) === mesN) || {};
    const pagado = Number(item.pagado || item.totalPagado || item.total_pagado || 0);
    const pendiente = Number(item.pendiente || item.totalPendiente || item.total_pendiente || 0);
    return {
      Mes: nombre,
      "Ingresos pagados": pagado,
      Pendiente: pendiente,
      "Total obligaciones": pagado + pendiente
    };
  });
  const ws = XLSX.utils.json_to_sheet(rows);
  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, "Ingresos");
  XLSX.writeFile(wb, `reporte_ingresos_${empresaId()}_${anio()}.xlsx`);
}

function exportarMatriz() {
  const rows = [];
  const grouped = {};

  state.matriz.forEach(r => {
    const id = r.propiedadId || r.propiedad_id;
    if (!grouped[id]) grouped[id] = { Codigo: r.codigo, Propiedad: r.propiedad };
    const mesNombre = meses[(Number(r.mes) || 1) - 1] || r.mes;
    const concepto = r.concepto || "";
    const estado = r.estado || "";
    const monto = Number(r.monto || 0);
    const saldo = Number(r.saldo || 0);
    grouped[id][mesNombre] = [grouped[id][mesNombre], `${concepto} | ${estado} | Monto: ${monto} | Saldo: ${saldo}`]
      .filter(Boolean)
      .join("\n");
  });

  Object.values(grouped).forEach(row => rows.push(row));
  const ws = XLSX.utils.json_to_sheet(rows);
  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, "Matriz pagos");
  XLSX.writeFile(wb, `matriz_pagos_${empresaId()}_${$("filtroAnio")?.value || anio()}.xlsx`);
}

function openCargaVariableModal() {
  setup();
  fillConceptos();
  if ($("variableAnio")) $("variableAnio").innerHTML = [2024, 2025, 2026, 2027].map(y => `<option ${y === anio() ? "selected" : ""}>${y}</option>`).join("");
  if ($("variableConcepto")) $("variableConcepto").innerHTML = state.conceptos.map(c => `<option value="${c.id}">${c.nombre}</option>`).join("");
  state.cargaVariable = [];
  renderCargaVariable();
  modals.cargaVariable.show();
}

function descargarPlantillaVariable() {
  const ejemplo = state.propiedades.slice(0, 5).map(p => ({
    codigo: p.codigo,
    anio: Number($("variableAnio")?.value || anio()),
    mes: 1,
    concepto: state.conceptos.find(c => String(c.id) === String($("variableConcepto")?.value))?.nombre || "AGUA",
    monto: 0,
    moneda: "PEN"
  }));
  if (!ejemplo.length) ejemplo.push({ codigo: "A-101", anio: anio(), mes: 1, concepto: "AGUA", monto: 0, moneda: "PEN" });
  const ws = XLSX.utils.json_to_sheet(ejemplo);
  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, "Carga variable");
  XLSX.writeFile(wb, `plantilla_carga_variable_${anio()}.xlsx`);
}

function leerCargaVariable(event) {
  const file = event.target.files?.[0];
  if (!file) return;

  const reader = new FileReader();
  reader.onload = e => {
    try {
      const data = new Uint8Array(e.target.result);
      const wb = XLSX.read(data, { type: "array" });
      const ws = wb.Sheets[wb.SheetNames[0]];
      const rows = XLSX.utils.sheet_to_json(ws, { defval: "" });
      state.cargaVariable = rows.map((r, i) => normalizarFilaVariable(r, i + 2));
      renderCargaVariable();
    } catch (e) {
      err(e);
    }
  };
  reader.readAsArrayBuffer(file);
}

function normalizarFilaVariable(r, fila) {
  const get = (...keys) => keys.map(k => r[k]).find(v => v !== undefined && v !== "") ?? "";
  const codigo = String(get("codigo", "Código", "CODIGO", "propiedad", "Propiedad")).trim();
  const conceptoNombre = String(get("concepto", "Concepto")).trim();
  const monto = Number(get("monto", "Monto", "importe", "Importe"));
  const mesValor = Number(get("mes", "Mes"));
  const anioValor = Number(get("anio", "Año", "ANIO")) || Number($("variableAnio")?.value || anio());
  const monedaCodigo = String(get("moneda", "Moneda") || "PEN").trim().toUpperCase();
  const propiedad = state.propiedades.find(p => String(p.codigo).trim().toUpperCase() === codigo.toUpperCase());
  const concepto = conceptoNombre
    ? state.conceptos.find(c => String(c.nombre).trim().toUpperCase() === conceptoNombre.toUpperCase())
    : state.conceptos.find(c => String(c.id) === String($("variableConcepto")?.value));
  const moneda = state.monedas.find(m => String(m.codigo).trim().toUpperCase() === monedaCodigo || String(m.codigo).trim().toUpperCase() === "S/");
  const errores = [];

  if (!propiedad) errores.push("Propiedad no existe");
  if (!concepto) errores.push("Concepto no existe");
  if (!mesValor || mesValor < 1 || mesValor > 12) errores.push("Mes inválido");
  if (!monto || monto <= 0) errores.push("Monto inválido");
  if (!moneda) errores.push("Moneda no existe");

  return {
    fila,
    codigo,
    propiedadId: propiedad?.id || null,
    anio: anioValor,
    mes: mesValor,
    conceptoId: concepto?.id || null,
    concepto: concepto?.nombre || conceptoNombre,
    monto,
    monedaId: moneda?.id || null,
    moneda: moneda?.codigo || monedaCodigo,
    errores
  };
}

function renderCargaVariable() {
  safeSet("tablaCargaVariable", state.cargaVariable.map(r => `
    <tr class="${r.errores.length ? "table-danger" : ""}">
      <td>${r.codigo}</td>
      <td>${r.anio}</td>
      <td>${r.mes}</td>
      <td>${r.concepto}</td>
      <td>${money(r.monto, r.moneda)}</td>
      <td>${r.moneda}</td>
      <td>${r.errores.length ? r.errores.join(", ") : "OK"}</td>
    </tr>
  `).join(""));
}

async function enviarCargaVariable() {
  try {
    const validas = state.cargaVariable.filter(r => !r.errores.length);
    if (!validas.length) throw new Error("No hay filas válidas para cargar.");

    const payload = {
      empresaId: empresaId(),
      usuarioId: session.usuarioId,
      items: validas.map(r => ({
        propiedadId: r.propiedadId,
        conceptoId: r.conceptoId,
        anio: r.anio,
        mes: r.mes,
        monto: r.monto,
        monedaId: r.monedaId
      }))
    };

    await api("/obligaciones/variables/masivo", {
      method: "POST",
      body: JSON.stringify(payload)
    });

    modals.cargaVariable.hide();
    await refreshMain();
    toast(`Carga variable realizada: ${validas.length} obligaciones`);
  } catch(e) {
    err(e);
  }
}

function fillConceptos() {
  const html = state.conceptos.map(c => `<option value="${c.id}">${c.nombre}</option>`).join("");

  const t = textos[localStorage.getItem("lang") || "es"] || textos.es;
  if ($("filtroConcepto")) $("filtroConcepto").innerHTML = `<option value="">${t.allConcepts}</option>${html}`;
  if ($("genConcepto")) $("genConcepto").innerHTML = `<option value="">${t.all}</option>${html}`;
  if ($("conceptoHistId")) $("conceptoHistId").innerHTML = html;
  if ($("variableConcepto")) $("variableConcepto").innerHTML = html;
}

function fillPropiedades() {
  const html = state.propiedades.map(p => `<option value="${p.id}">${p.codigo} - ${p.nombre}</option>`).join("");

  const t = textos[localStorage.getItem("lang") || "es"] || textos.es;
  if ($("genPropiedad")) $("genPropiedad").innerHTML = `<option value="">${t.all}</option>${html}`;
  if ($("histPropiedad")) $("histPropiedad").innerHTML = html;
}

function fillPropietarios() {
  const html = state.propietarios.map(p => `<option value="${p.id}">${p.nombre}</option>`).join("");
  if ($("propietarioHistId")) $("propietarioHistId").innerHTML = html;
}

function fillMonedas() {
  const html = state.monedas.map(m => `<option value="${m.id}">${m.codigo}</option>`).join("");

  if ($("pagoMoneda")) $("pagoMoneda").innerHTML = html;
  if ($("conceptoHistMoneda")) $("conceptoHistMoneda").innerHTML = html;
}

function setup() {
  const years = [2024, 2025, 2026, 2027];

  if ($("filtroAnio")) {
    $("filtroAnio").innerHTML = years.map(y => `<option ${y === anio() ? "selected" : ""}>${y}</option>`).join("");
  }

  if ($("genAnio")) {
    $("genAnio").innerHTML = years.map(y => `<option ${y === anio() ? "selected" : ""}>${y}</option>`).join("");
  }

  const t = textos[localStorage.getItem("lang") || "es"] || textos.es;
  const monthOptions = `<option value="">${t.all}</option>` + meses.map((m, i) => `<option value="${i + 1}">${m}</option>`).join("");

  if ($("mesGlobal")) $("mesGlobal").innerHTML = monthOptions;
  if ($("genMes")) $("genMes").innerHTML = monthOptions;
}

async function anular(path) {
  try {
    const motivo = prompt("Motivo de anulación") || "";
    await api(path, {
      method: "PATCH",
      body: JSON.stringify({ motivo })
    });

    await initApp();
    toast("Anulado");
  } catch(e) {
    err(e);
  }
}

async function anularHist(tipo, id) {
  const map = {
    estado: "/propiedades/estados-historial/",
    propietario: "/propiedades/propietarios-historial/",
    concepto: "/propiedades/conceptos-historial/"
  };

  await anular(map[tipo] + id + "/anular");
}

function goTemporalidad(id) {
  show("historiales");
  setTimeout(() => {
    if ($("histPropiedad")) $("histPropiedad").value = id;
    loadHistoriales();
  }, 50);
}

function openPropiedadModal(id = null) {
  const p = id ? state.propiedades.find(x => x.id === id) : {};

  $("propiedadId").value = id || "";
  $("propCodigo").value = p?.codigo || "";
  $("propNombre").value = p?.nombre || "";
  $("propTipo").value = p?.tipo || "DEPARTAMENTO";
  $("propDireccion").value = p?.direccion || "";

  modals.propiedad.show();
}

async function savePropiedad() {
  try {
    const id = $("propiedadId").value;

    const payload = {
      empresaId: empresaId(),
      codigo: $("propCodigo").value,
      nombre: $("propNombre").value,
      tipo: $("propTipo").value,
      direccion: $("propDireccion").value
    };

    await api(id ? `/propiedades/${id}` : "/propiedades", {
      method: id ? "PUT" : "POST",
      body: JSON.stringify(payload)
    });

    modals.propiedad.hide();
    await loadPropiedades();
  } catch(e) {
    err(e);
  }
}

function openConceptoModal(id = null) {
  const c = id
    ? state.conceptos.find(x => x.id === id)
    : {};

  $("conceptoId").value = id || "";
  $("conceptoNombre").value = c?.nombre || "";

  $("conceptoFrecuencia").value =
    c?.frecuencia || "MENSUAL";

  $("conceptoEsVariable").value =
    (c?.esVariable || c?.es_variable)
      ? "true"
      : "false";

  modals.concepto.show();
}

async function saveConcepto() {
  try {
    const id = $("conceptoId").value;

   const payload = {
  empresaId: empresaId(),

  nombre:
    $("conceptoNombre").value,

  frecuencia:
    $("conceptoFrecuencia").value,

  esVariable:
    $("conceptoEsVariable").value === "true"
};

    await api(id ? `/conceptos-pago/${id}` : "/conceptos-pago", {
      method: id ? "PUT" : "POST",
      body: JSON.stringify(payload)
    });

    modals.concepto.hide();
    await loadConceptos();
  } catch(e) {
    err(e);
  }
}

function openPropietarioModal(id = null) {
  const p = id ? state.propietarios.find(x => x.id === id) : {};

  $("propietarioId").value = id || "";
  $("propietarioNombre").value = p?.nombre || "";
  $("propietarioDocumento").value = p?.documento || "";
  $("propietarioTelefono").value = p?.telefono || "";
  $("propietarioEmail").value = p?.email || "";

  modals.propietario.show();
}

async function savePropietario() {
  try {
    const id = $("propietarioId").value;

    const payload = {
      empresaId: empresaId(),
      nombre: $("propietarioNombre").value,
      documento: $("propietarioDocumento").value,
      telefono: $("propietarioTelefono").value,
      email: $("propietarioEmail").value
    };

    await api(id ? `/propietarios/${id}` : "/propietarios", {
      method: id ? "PUT" : "POST",
      body: JSON.stringify(payload)
    });

    modals.propietario.hide();
    await loadPropietarios();
  } catch(e) {
    err(e);
  }
}

function openGenerarModal() {
  setup();
  fillPropiedades();
  fillConceptos();

  if ($("genAnio")) $("genAnio").value = anio();
  if ($("genMes")) $("genMes").value = mes() || "";

  modals.generar.show();
}

async function generarObligaciones() {
  try {
    const payload = {
      empresaId: empresaId(),
      anio: Number($("genAnio").value),
      mes: $("genMes").value ? Number($("genMes").value) : null,
      propiedadId: $("genPropiedad").value ? Number($("genPropiedad").value) : null,
      conceptoId: $("genConcepto").value ? Number($("genConcepto").value) : null
    };

    const result = await api("/obligaciones/generar", {
      method: "POST",
      body: JSON.stringify(payload)
    });

    modals.generar.hide();
    await refreshMain();

    toast("Creadas: " + (result.obligacionesCreadas ?? result.obligaciones_creadas ?? 0));
  } catch(e) {
    err(e);
  }
}

function openPagoModal(id) {
  const o = state.matriz.find(x => (x.obligacionId || x.obligacion_id) == id)
        || state.obligaciones.find(x => x.id == id);

  $("pagoObligacionId").value = id;
  $("pagoMonto").value = o?.saldo || 0;
  $("pagoFecha").value = new Date().toISOString().substring(0, 10);
  $("pagoTipoCambio").value = "";
  $("pagoObs").value = "";

  safeSet("pagoInfo", `
    ${o?.propiedad || ""}<br>
    ${o?.concepto || ""}<br>
    Saldo: ${money(o?.saldo || 0, o?.moneda || "S/")}
  `);

  modals.pago.show();
}

async function registrarPago() {
  try {
    const payload = {
      empresaId: empresaId(),
      obligacionId: Number($("pagoObligacionId").value),
      usuarioId: session.usuarioId,
      monto: Number($("pagoMonto").value),
      monedaId: Number($("pagoMoneda").value),
      tipoCambioUsado: $("pagoTipoCambio").value ? Number($("pagoTipoCambio").value) : null,
      fechaPago: $("pagoFecha").value,
      observacion: $("pagoObs").value
    };

    await api("/pagos", {
      method: "POST",
      body: JSON.stringify(payload)
    });

    modals.pago.hide();
    await refreshMain();
  } catch(e) {
    err(e);
  }
}

function openEstadoModal() {
  $("estadoHistInicio").value = new Date().toISOString().substring(0, 10);
  $("estadoHistFin").value = "";
  $("estadoHistMotivo").value = "";
  modals.estadoHist.show();
}

async function saveEstadoHist() {
  try {
    const id = $("histPropiedad").value;

    const payload = {
      empresaId: empresaId(),
      estado: $("estadoHistEstado").value,
      fechaInicio: $("estadoHistInicio").value,
      fechaFin: $("estadoHistFin").value || null,
      motivo: $("estadoHistMotivo").value
    };

    await api(`/propiedades/${id}/estados-historial`, {
      method: "POST",
      body: JSON.stringify(payload)
    });

    modals.estadoHist.hide();
    await loadHistoriales();
  } catch(e) {
    err(e);
  }
}

function openPropietarioHistModal() {
  $("propietarioHistInicio").value = new Date().toISOString().substring(0, 10);
  $("propietarioHistFin").value = "";
  $("propietarioHistPorcentaje").value = 100;
  modals.propietarioHist.show();
}

async function savePropietarioHist() {
  try {
    const id = $("histPropiedad").value;

    const payload = {
      empresaId: empresaId(),
      propietarioId: Number($("propietarioHistId").value),
      porcentaje: Number($("propietarioHistPorcentaje").value),
      fechaInicio: $("propietarioHistInicio").value,
      fechaFin: $("propietarioHistFin").value || null
    };

    await api(`/propiedades/${id}/propietarios-historial`, {
      method: "POST",
      body: JSON.stringify(payload)
    });

    modals.propietarioHist.hide();
    await loadHistoriales();
  } catch(e) {
    err(e);
  }
}

function openConceptoHistModal() {
  $("conceptoHistInicio").value = new Date().toISOString().substring(0, 10);
  $("conceptoHistFin").value = "";
  $("conceptoHistMonto").value = "";
  modals.conceptoHist.show();
}

async function saveConceptoHist() {
  try {
    const id = $("histPropiedad").value;

    const payload = {
      empresaId: empresaId(),
      conceptoId: Number($("conceptoHistId").value),
      monto: Number($("conceptoHistMonto").value),
      monedaId: Number($("conceptoHistMoneda").value),
      frecuencia: $("conceptoHistFrecuencia").value,
      fechaInicio: $("conceptoHistInicio").value,
      fechaFin: $("conceptoHistFin").value || null
    };

    await api(`/propiedades/${id}/conceptos-historial`, {
      method: "POST",
      body: JSON.stringify(payload)
    });

    modals.conceptoHist.hide();
    await loadHistoriales();
  } catch(e) {
    err(e);
  }
}

async function exportarTodo() {
  try {
    const tablas = [
      "propiedades",
      "propietarios",
      "conceptos_pago",
      "obligaciones_pago",
      "pagos",
      "propiedad_estado_historial",
      "propiedad_propietario_historial",
      "propiedad_concepto_historial"
    ];

    const wb = XLSX.utils.book_new();

    for (const tabla of tablas) {
      const data = await api(`/exportar/${tabla}?empresaId=${empresaId()}&anio=${anio()}`);
      const ws = XLSX.utils.json_to_sheet(data);
      XLSX.utils.book_append_sheet(wb, ws, tabla.substring(0, 31));
    }

    XLSX.writeFile(wb, `reporte_empresa_${empresaId()}_${anio()}.xlsx`);
  } catch(e) {
    err(e);
  }
}

window.addEventListener("DOMContentLoaded", () => {
  modals = {
    propiedad: new bootstrap.Modal("#modalPropiedad"),
    concepto: new bootstrap.Modal("#modalConcepto"),
    propietario: new bootstrap.Modal("#modalPropietario"),
    generar: new bootstrap.Modal("#modalGenerar"),
    pago: new bootstrap.Modal("#modalPago"),
    estadoHist: new bootstrap.Modal("#modalEstadoHist"),
    propietarioHist: new bootstrap.Modal("#modalPropietarioHist"),
    conceptoHist: new bootstrap.Modal("#modalConceptoHist"),
    cargaVariable: new bootstrap.Modal("#modalCargaVariable")
  };

  setup();
  setLang(localStorage.getItem("lang") || "es");
  showApp();
});
