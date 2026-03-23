const form = document.getElementById('eligibilityForm');
const resultBox = document.getElementById('resultBox');
const resetBtn = document.getElementById('resetBtn');

function renderResult(type, title, message, reasons = []) {
  let className = 'result-box ';
  let icon = '?';

  if (type === 'success') {
    className += 'result-success';
    icon = '✓';
  } else if (type === 'warning') {
    className += 'result-warning';
    icon = '!';
  } else if (type === 'danger') {
    className += 'result-danger';
    icon = '✕';
  } else {
    className += 'result-neutral';
  }

  let reasonsHTML = '';
  if (reasons.length) {
    reasonsHTML = `
      <div>
        <strong>O que chamou atenção:</strong>
        <ul class="reason-list">
          ${reasons.map(item => `<li>${item}</li>`).join('')}
        </ul>
      </div>
    `;
  }

  resultBox.className = className;
  resultBox.innerHTML = `
    <div class="result-icon">${icon}</div>
    <p class="result-title">${title}</p>
    <p>${message}</p>
    ${reasonsHTML}
    <div style="margin-top:10px;">
      <button class="btn btn-secondary" type="button" id="scrollBackBtn">
        Revisar respostas
      </button>
    </div>
  `;

  const scrollBackBtn = document.getElementById('scrollBackBtn');
  if (scrollBackBtn) {
    scrollBackBtn.addEventListener('click', () => {
      document.getElementById('eligibilityForm').scrollIntoView({
        behavior: 'smooth',
        block: 'start'
      });
    });
  }
}

form.addEventListener('submit', function (e) {
  e.preventDefault();

  const data = {
    idade: form.idade.value,
    peso: form.peso.value,
    saude: form.saude.value,
    sintomas: form.sintomas.value,
    alimentado: form.alimentado.value,
    sono: form.sono.value,
    alcool: form.alcool.value,
    tatuagem: form.tatuagem.value,
    procedimento: form.procedimento.value,
    medicamentos: form.medicamentos.value,
    vacina: form.vacina.value,
    gestacao: form.gestacao.value,
    condicao: form.condicao.value,
    doacaoRecente: form.doacaoRecente.value
  };

  const hasEmpty = Object.values(data).some(v => !v);

  if (hasEmpty) {
    renderResult(
      'warning',
      'Faltam algumas respostas',
      'Preencha todos os campos para ver uma orientação mais completa.'
    );
    return;
  }

  const dangerReasons = [];
  const warningReasons = [];

  if (data.idade === 'nao') dangerReasons.push('idade fora da faixa básica considerada');
  if (data.peso === 'nao') dangerReasons.push('peso abaixo do mínimo sugerido');
  if (data.saude === 'nao') dangerReasons.push('você informou que não está se sentindo bem hoje');
  if (data.sintomas === 'sim') dangerReasons.push('houve sintomas recentes, como gripe, febre ou infecção');
  if (data.alcool === 'sim') dangerReasons.push('houve consumo recente de álcool');
  if (data.gestacao === 'gravida') dangerReasons.push('gestação em andamento');
  if (data.condicao === 'sim') dangerReasons.push('foi informada uma condição de saúde possivelmente impeditiva');

  if (data.alimentado === 'nao') warningReasons.push('pode ser melhor se alimentar adequadamente antes da doação');
  if (data.sono === 'nao') warningReasons.push('o descanso nas últimas 24 horas pode não ter sido suficiente');
  if (data.tatuagem === 'sim') warningReasons.push('houve tatuagem, piercing ou micropigmentação recente');
  if (data.procedimento === 'sim') warningReasons.push('houve procedimento médico ou tratamento recente');
  if (data.medicamentos === 'sim') warningReasons.push('há uso atual de medicamentos');
  if (data.vacina === 'sim') warningReasons.push('houve vacinação recente');
  if (data.gestacao === 'amamentando') warningReasons.push('você informou estar em período de amamentação');
  if (data.doacaoRecente === 'sim') warningReasons.push('pode ser necessário aguardar o intervalo entre doações');

  if (dangerReasons.length > 0) {
    renderResult(
      'danger',
      'Pode ser melhor esperar um pouco',
      'Pelas suas respostas, você pode não estar apto para doar neste momento. Isso não significa um impedimento definitivo. Em muitos casos, basta aguardar o período indicado ou confirmar a situação no hemocentro.',
      dangerReasons
    );
    return;
  }

  if (warningReasons.length > 0) {
    renderResult(
      'warning',
      'Melhor confirmar antes',
      'Algumas respostas podem exigir uma avaliação adicional. Se puder, confirme sua situação com um hemocentro antes de doar.',
      warningReasons
    );
    return;
  }

  renderResult(
    'success',
    'Você provavelmente pode doar',
    'Pelas suas respostas, você parece atender aos critérios básicos. Mesmo assim, a confirmação final sempre acontece no hemocentro.'
  );
});

resetBtn.addEventListener('click', function () {
  form.reset();
  renderResult(
    'neutral',
    'Preencha as respostas',
    'Depois disso, mostramos uma orientação inicial sobre sua aptidão para doar.'
  );
});