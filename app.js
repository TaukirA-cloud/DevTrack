const STORAGE_KEY = 'devtrack_applications_v1';

const elements = {
  rows: document.getElementById('applicationRows'),
  empty: document.getElementById('emptyState'),
  dialog: document.getElementById('applicationDialog'),
  form: document.getElementById('applicationForm'),
  search: document.getElementById('searchInput'),
  statusFilter: document.getElementById('statusFilter'),
  sortFilter: document.getElementById('sortFilter'),
  toast: document.getElementById('toast'),
};

let applications = loadApplications();
let toastTimer;

function loadApplications() {
  try {
    const saved = JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');
    return Array.isArray(saved) ? saved : [];
  } catch (error) {
    console.error('Could not read saved applications:', error);
    return [];
  }
}

function saveApplications() {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(applications));
    return true;
  } catch (error) {
    showToast("Couldn't save data. Check your browser storage.");
    console.error('Could not save applications:', error);
    return false;
  }
}

function escapeHTML(value = '') {
  return String(value).replace(
    /[&<>"']/g,
    (character) =>
      ({
        '&': '&amp;',
        '<': '&lt;',
        '>': '&gt;',
        '"': '&quot;',
        "'": '&#039;',
      })[character],
  );
}

function formatDate(dateString) {
  if (!dateString) return '—';
  const date = new Date(`${dateString}T00:00:00`);
  if (Number.isNaN(date.getTime())) return '—';
  return date.toLocaleDateString(undefined, {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
}

function initials(company) {
  return company
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((word) => word[0])
    .join('')
    .toUpperCase();
}

function updateStats() {
  document.getElementById('totalStat').textContent = applications.length;
  document.getElementById('progressStat').textContent = applications.filter(
    (item) => item.status === 'Applied' || item.status === 'Interview',
  ).length;
  document.getElementById('interviewStat').textContent = applications.filter(
    (item) => item.status === 'Interview',
  ).length;
  document.getElementById('offerStat').textContent = applications.filter(
    (item) => item.status === 'Offer',
  ).length;
  document.getElementById('applicationCount').textContent = applications.length;
}

function getVisibleApplications() {
  const term = elements.search.value.trim().toLowerCase();
  const status = elements.statusFilter.value;
  const sort = elements.sortFilter.value;

  const visible = applications.filter((item) => {
    const matchesText = `${item.company} ${item.role} ${item.notes || ''}`
      .toLowerCase()
      .includes(term);
    return matchesText && (status === 'All' || item.status === status);
  });

  visible.sort((a, b) => {
    if (sort === 'company') return a.company.localeCompare(b.company);
    const difference =
      new Date(`${a.date}T00:00:00`) - new Date(`${b.date}T00:00:00`);
    return sort === 'oldest' ? difference : -difference;
  });
  return visible;
}

function renderApplications() {
  const visible = getVisibleApplications();
  elements.rows.innerHTML = visible
    .map((item) => {
      const safeUrl =
        item.url && /^https?:\/\//i.test(item.url) ? item.url : '';
      return `<tr>
      <td><div class="company-cell"><div class="company-logo">${escapeHTML(initials(item.company))}</div>
        <div><div class="company-name">${escapeHTML(item.company)}</div><div class="role-name">${escapeHTML(item.role)}</div></div></div></td>
      <td>${formatDate(item.date)}</td>
      <td><span class="status status-${item.status.toLowerCase()}">${escapeHTML(item.status)}</span></td>
      <td class="${item.followup ? 'follow-date' : 'follow-none'}">${formatDate(item.followup)}</td>
      <td><div class="row-actions">${safeUrl ? `<a class="small-action" href="${escapeHTML(safeUrl)}" target="_blank" rel="noopener noreferrer">Link ↗</a>` : ''}
        <button class="small-action" data-action="edit" data-id="${escapeHTML(item.id)}">Edit</button>
        <button class="small-action delete" data-action="delete" data-id="${escapeHTML(item.id)}" aria-label="Delete ${escapeHTML(item.company)}">Delete</button></div></td>
    </tr>`;
    })
    .join('');

  const isEmpty = visible.length === 0;
  elements.empty.classList.toggle('visible', isEmpty);
  elements.empty.querySelector('h3').textContent = applications.length
    ? 'No matching applications'
    : 'No applications yet';
  elements.empty.querySelector('p').textContent = applications.length
    ? 'Try changing your search or status filter.'
    : 'Add your first opportunity to start building your pipeline.';
  document.getElementById('resultsLabel').textContent =
    `Showing ${visible.length} of ${applications.length} application${applications.length === 1 ? '' : 's'}`;
  updateStats();
}

function showToast(message) {
  elements.toast.textContent = message;
  elements.toast.classList.add('show');
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => elements.toast.classList.remove('show'), 2600);
}

function openDialog(application = null) {
  elements.form.reset();
  document.getElementById('formError').textContent = '';
  document.getElementById('applicationId').value = application?.id || '';
  document.getElementById('dialogTitle').textContent = application
    ? 'Edit application'
    : 'Add application';
  document.getElementById('saveButton').textContent = application
    ? 'Save changes'
    : 'Save application';
  document.getElementById('companyInput').value = application?.company || '';
  document.getElementById('roleInput').value = application?.role || '';
  document.getElementById('dateInput').value =
    application?.date || new Date().toISOString().slice(0, 10);
  document.getElementById('statusInput').value =
    application?.status || 'Applied';
  document.getElementById('followupInput').value = application?.followup || '';
  document.getElementById('urlInput').value = application?.url || '';
  document.getElementById('notesInput').value = application?.notes || '';
  elements.dialog.showModal();
  document.getElementById('companyInput').focus();
}

function closeDialog() {
  elements.dialog.close();
}

function handleFormSubmit(event) {
  event.preventDefault();
  const id = document.getElementById('applicationId').value;
  const company = document.getElementById('companyInput').value.trim();
  const role = document.getElementById('roleInput').value.trim();
  const date = document.getElementById('dateInput').value;
  const url = document.getElementById('urlInput').value.trim();

  if (!company || !role || !date) {
    document.getElementById('formError').textContent =
      'Please complete all required fields.';
    return;
  }
  if (url && !/^https?:\/\//i.test(url)) {
    document.getElementById('formError').textContent =
      'Please enter a complete URL beginning with http:// or https://.';
    return;
  }

  const application = {
    id: id || (crypto.randomUUID ? crypto.randomUUID() : String(Date.now())),
    company,
    role,
    date,
    status: document.getElementById('statusInput').value,
    followup: document.getElementById('followupInput').value,
    url,
    notes: document.getElementById('notesInput').value.trim(),
  };

  if (id) {
    applications = applications.map((item) =>
      item.id === id ? application : item,
    );
  } else {
    applications.push(application);
  }

  if (saveApplications()) {
    closeDialog();
    renderApplications();
    showToast(id ? 'Application updated.' : 'Application added.');
  }
}

function handleTableAction(event) {
  const button = event.target.closest('button[data-action]');
  if (!button) return;
  const { action, id } = button.dataset;
  const application = applications.find((item) => item.id === id);
  if (!application) return;

  if (action === 'edit') {
    openDialog(application);
  } else if (action === 'delete') {
    const confirmed = window.confirm(
      `Delete the application for ${application.company}?`,
    );
    if (!confirmed) return;
    applications = applications.filter((item) => item.id !== id);
    if (saveApplications()) {
      renderApplications();
      showToast('Application deleted.');
    }
  }
}

function exportCSV() {
  if (!applications.length) {
    showToast('Add an application before exporting.');
    return;
  }
  const columns = [
    'Company',
    'Role',
    'Date Applied',
    'Status',
    'Follow-up',
    'Job URL',
    'Notes',
  ];
  const rows = applications.map((item) => [
    item.company,
    item.role,
    item.date,
    item.status,
    item.followup,
    item.url,
    item.notes,
  ]);
  const csv = [columns, ...rows]
    .map((row) =>
      row
        .map((value) => `"${String(value || '').replace(/"/g, '""')}"`)
        .join(','),
    )
    .join('\r\n');
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  link.href = URL.createObjectURL(blob);
  link.download = 'devtrack-applications.csv';
  link.click();
  URL.revokeObjectURL(link.href);
  showToast('CSV export downloaded.');
}

document.getElementById('todayLabel').textContent =
  new Date().toLocaleDateString(undefined, {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
  });
document
  .getElementById('openAdd')
  .addEventListener('click', () => openDialog());
document.getElementById('exportButton').addEventListener('click', exportCSV);
document
  .getElementById('openAddTop')
  .addEventListener('click', () => openDialog());
document
  .getElementById('emptyAdd')
  .addEventListener('click', () => openDialog());
document.getElementById('closeDialog').addEventListener('click', closeDialog);
document.getElementById('cancelDialog').addEventListener('click', closeDialog);
elements.form.addEventListener('submit', handleFormSubmit);
elements.rows.addEventListener('click', handleTableAction);
[elements.search, elements.statusFilter, elements.sortFilter].forEach(
  (control) => control.addEventListener('input', renderApplications),
);

document.addEventListener('keydown', (event) => {
  if ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === 'n') {
    event.preventDefault();
    if (!elements.dialog.open) openDialog();
  }
});

renderApplications();
