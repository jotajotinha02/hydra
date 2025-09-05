// main.js
// Array para armazenar vendas localmente
let vendas = [];

// Elementos DOM
const form = document.getElementById("venda-form");
const tabela = document.getElementById("tabela-vendas");
const filtroUsuario = document.getElementById("filtro-usuario");
const filtroInicio = document.getElementById("filtro-data-inicio");
const filtroFim = document.getElementById("filtro-data-fim");
const totalQtd = document.getElementById("total-quantidade");
const totalValor = document.getElementById("total-valor");
const msgVazia = document.getElementById("mensagem-vazia");

// Gráfico
let grafico;
function atualizarGrafico(vendasFiltradas) {
  const ctx = document.getElementById("graficoVendas").getContext("2d");

  const dadosPorUsuario = {};
  vendasFiltradas.forEach(v => {
    dadosPorUsuario[v.usuario] = (dadosPorUsuario[v.usuario] || 0) + v.valor;
  });

  const labels = Object.keys(dadosPorUsuario);
  const valores = Object.values(dadosPorUsuario);

  if (grafico) grafico.destroy();

  grafico = new Chart(ctx, {
    type: "bar",
    data: {
      labels,
      datasets: [{
        label: "Vendas (R$)",
        data: valores,
        backgroundColor: "rgba(54, 162, 235, 0.7)"
      }]
    },
    options: {
      responsive: true,
      plugins: { legend: { display: false } }
    }
  });
}

// Renderizar tabela
function renderizarTabela(vendasFiltradas) {
  tabela.innerHTML = "";
  let somaQtd = 0, somaValor = 0;

  vendasFiltradas.forEach(venda => {
    const tr = document.createElement("tr");
    tr.innerHTML = `
      <td class="p-2 border">${venda.usuario}</td>
      <td class="p-2 border">${venda.quantidade}</td>
      <td class="p-2 border">R$ ${venda.valor.toFixed(2)}</td>
      <td class="p-2 border">${new Date(venda.data).toLocaleDateString("pt-BR")}</td>
      <td class="p-2 border text-center">-</td>
    `;
    tabela.appendChild(tr);

    somaQtd += venda.quantidade;
    somaValor += venda.valor;
  });

  totalQtd.textContent = somaQtd;
  totalValor.textContent = "R$ " + somaValor.toFixed(2);
  msgVazia.classList.toggle("hidden", vendasFiltradas.length > 0);

  atualizarGrafico(vendasFiltradas);
}

// Filtro
function aplicarFiltro() {
  const usuario = filtroUsuario.value;
  const inicio = filtroInicio.value ? new Date(filtroInicio.value) : null;
  const fim = filtroFim.value ? new Date(filtroFim.value) : null;

  return vendas.filter(v => {
    const data = new Date(v.data);
    if (usuario && v.usuario !== usuario) return false;
    if (inicio && data < inicio) return false;
    if (fim && data > fim) return false;
    return true;
  });
}

// Atualizar opções de usuário
function atualizarUsuarios() {
  const usuariosSet = new Set(vendas.map(v => v.usuario));
  filtroUsuario.innerHTML = `<option value="">Todos os usuários</option>`;
  usuariosSet.forEach(u => {
    filtroUsuario.innerHTML += `<option value="${u}">${u}</option>`;
  });
}

// Registrar venda
form.addEventListener("submit", e => {
  e.preventDefault();
  const usuario = form.usuario.value;
  const quantidade = parseInt(form.quantidade.value);
  const valor = parseFloat(form.valor.value);

  vendas.push({
    usuario,
    quantidade,
    valor,
    data: new Date().toISOString()
  });

  form.reset();
  atualizarUsuarios();
  renderizarTabela(aplicarFiltro());
});

// Filtros onchange
filtroUsuario.onchange = () => renderizarTabela(aplicarFiltro());
filtroInicio.onchange = () => renderizarTabela(aplicarFiltro());
filtroFim.onchange = () => renderizarTabela(aplicarFiltro());

// Exportar CSV
document.getElementById("exportarCSV").addEventListener("click", () => {
  let csv = "Usuário,Quantidade,Valor,Data\n";
  document.querySelectorAll("#tabela-vendas tr").forEach(tr => {
    const cols = tr.querySelectorAll("td");
    if (cols.length) {
      const row = Array.from(cols).map(td => td.innerText).join(",");
      csv += row + "\n";
    }
  });

  const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = "vendas.csv";
  a.click();
});
