<template>
  <header class="header navbar navbar-expand-lg navbar-dark bg-primary">
    <div class="container-fluid">
      <a class="navbar-brand" href="#">Gestion Apprenants</a>
      <button
        class="navbar-toggler"
        type="button"
        data-bs-toggle="collapse"
        data-bs-target="#navbarNav"
        aria-controls="navbarNav"
        aria-expanded="false"
        aria-label="Toggle navigation"
      >
        <span class="navbar-toggler-icon"></span>
      </button>
      <div class="collapse navbar-collapse" id="navbarNav">
        <ul class="navbar-nav ms-auto">
          <li class="nav-item">
            <router-link class="nav-link" to="/" exact-active-class="active">Accueil</router-link>
          </li>
          <li class="nav-item">
            <router-link class="nav-link" to="/modules" exact-active-class="active">Modules</router-link>
          </li>
          <li class="nav-item">
            <router-link class="nav-link" to="/students" exact-active-class="active">Apprenants</router-link>
          </li>
          <li class="nav-item">
            <router-link class="nav-link" to="/registrations" exact-active-class="active">Inscriptions</router-link>
          </li>
          <li class="nav-item">
            <router-link class="nav-link" to="/payments" exact-active-class="active">Paiement</router-link>
          </li>
        </ul>
      </div>
    </div>
  </header>

  <div class="payment-list container mt-5">
    <h1 class="text-center mb-4">Liste des Paiements</h1>

    <div class="text-end mb-3">
      <button class="btn btn-success" @click="openAddModal">Ajouter un Paiement</button>
    </div>

    <table class="table table-hover table-bordered">
      <thead>
        <tr>
          <th scope="col">Nom de l'Apprenant</th>
          <th scope="col">Module</th>
          <th scope="col">Date de Paiement</th>
          <th scope="col">Montant (€)</th>
          <th scope="col">Payeur</th>
          <th scope="col">Mode de Paiement</th>
          <th scope="col">Actions</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="payment in payments" :key="payment.id">
          <td>{{ getStudentName(payment.studentId) }}</td>
          <td>{{ payment.module.name }}</td>
          <td>{{ formatDate(payment.paymentDate) }}</td>
          <td>{{ payment.amount }} €</td>
          <td>{{ payment.payer }}</td>
          <td>{{ payment.paymentMode }}</td>
          <td>
            <button
              class="btn btn-outline-warning me-2"
              @click="openEditModal(payment)"
            >
              <i class="fas fa-edit"></i>
            </button>
            <button
              class="btn btn-outline-info me-2"
              @click="openViewModal(payment)"
            >
              <i class="fas fa-eye"></i>
            </button>
            <button
              class="btn btn-outline-danger"
              @click="confirmDelete(payment.id)"
            >
              <i class="fas fa-trash"></i>
            </button>
          </td>
        </tr>
      </tbody>
    </table>

    <div v-if="payments.length === 0" class="text-center text-muted">
      Aucun paiement disponible.
    </div>

    <!-- Modal Ajouter/Modifier -->
    <div
      class="modal fade"
      :class="{ show: showModal }"
      tabindex="-1"
      aria-labelledby="paymentFormModalLabel"
      aria-hidden="true"
      style="display: block"
      v-if="showModal"
    >
      <div class="modal-dialog">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title" id="paymentFormModalLabel">
              {{ isEdit ? "Modifier le Paiement" : "Ajouter un Paiement" }}
            </h5>
            <button
              type="button"
              class="btn-close"
              @click="closeModal"
              aria-label="Close"
            ></button>
          </div>
          <div class="modal-body">
            <form @submit.prevent="savePayment">
              <div class="mb-3">
                <label for="studentName" class="form-label">Nom de l'Apprenant</label>
                <select
                  id="studentName"
                  v-model="currentPayment.studentId"
                  class="form-select"
                  required
                >
                  <option
                    v-for="student in students"
                    :key="student.id"
                    :value="student.id"
                  >
                    {{ student.fullName }}
                  </option>
                </select>
              </div>
              <div class="mb-3">
                <label for="moduleName" class="form-label">Module</label>
                <select
                  id="moduleName"
                  v-model="currentPayment.moduleId"
                  class="form-select"
                  required
                >
                  <option
                    v-for="module in modules"
                    :key="module.id"
                    :value="module.id"
                  >
                    {{ module.name }}
                  </option>
                </select>
              </div>
              <div class="mb-3">
                <label for="registrationId" class="form-label">ID d'Inscription</label>
                <select
                  id="registrationId"
                  v-model="currentPayment.registrationId"
                  class="form-select"
                  required
                >
                  <option
                    v-for="registration in registrations"
                    :key="registration.id"
                    :value="registration.id"
                  >
                    {{ registration.registrationName }}
                  </option>
                </select>
              </div>
              <div class="mb-3">
                <label for="paymentDate" class="form-label">Date de Paiement</label>
                <input
                  type="date"
                  id="paymentDate"
                  v-model="currentPayment.paymentDate"
                  class="form-control"
                  required
                />
              </div>
              <div class="mb-3">
                <label for="amount" class="form-label">Montant (€)</label>
                <input
                  type="number"
                  id="amount"
                  v-model="currentPayment.amount"
                  class="form-control"
                  required
                />
              </div>
              <div class="mb-3">
                <label for="payer" class="form-label">Payeur</label>
                <input
                  type="text"
                  id="payer"
                  v-model="currentPayment.payer"
                  class="form-control"
                  required
                />
              </div>
              <div class="mb-3">
                <label for="payerNumber" class="form-label">Numéro du Payeur</label>
                <input
                  type="text"
                  id="payerNumber"
                  v-model="currentPayment.payerNumber"
                  class="form-control"
                />
              </div>
              <div class="mb-3">
                <label for="paymentMode" class="form-label">Mode de Paiement</label>
                <input
                  type="text"
                  id="paymentMode"
                  v-model="currentPayment.paymentMode"
                  class="form-control"
                  required
                />
              </div>
              <button type="submit" class="btn btn-primary">
                {{ isEdit ? "Modifier" : "Ajouter" }}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>

    <!-- Modal Voir les Détails -->
    <div
      class="modal fade"
      :class="{ show: showDetailsModal }"
      tabindex="-1"
      aria-labelledby="paymentDetailsModalLabel"
      aria-hidden="true"
      style="display: block"
      v-if="showDetailsModal"
    >
      <div class="modal-dialog">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title" id="paymentDetailsModalLabel">
              Détails du Paiement
            </h5>
            <button
              type="button"
              class="btn-close"
              @click="closeDetailsModal"
              aria-label="Close"
            ></button>
          </div>
          <div class="modal-body">
            <p><strong>Apprenant :</strong> {{ getStudentName(details.studentId) }}</p>
            <p><strong>Module :</strong> {{ details.module.name }}</p>
            <p><strong>Date :</strong> {{ formatDate(details.paymentDate) }}</p>
            <p><strong>Montant :</strong> {{ details.amount }} €</p>
            <p><strong>Payeur :</strong> {{ details.payer }}</p>
            <p><strong>Numéro du Payeur :</strong> {{ details.payerNumber }}</p>
            <p><strong>Mode de Paiement :</strong> {{ details.paymentMode }}</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { reactive, ref, onMounted } from "vue";
import Swal from "sweetalert2";
import { usePaymentStore } from "../../stores/paymentStore";
import { useStudentStore } from "../../stores/studentStore";
import { useModuleStore } from "../../stores/moduleStore";
import { useRegistrationStore } from "../../stores/registrationStore";

const paymentStore = usePaymentStore();
const studentStore = useStudentStore();
const moduleStore = useModuleStore();
const registrationStore = useRegistrationStore();

const { payments, fetchPayments, createPayment, updatePayment, deletePayment } = paymentStore;
const { students, fetchStudents } = studentStore;
const { modules, fetchModules } = moduleStore;
const { registrations, fetchRegistrations } = registrationStore;

const showModal = ref(false);
const showDetailsModal = ref(false);
const isEdit = ref(false);
const currentPayment = reactive({
  id: null,
  studentId: null,
  moduleId: null,
  registrationId: null,
  paymentDate: "",
  amount: 0,
  payer: "",
  payerNumber: "",
  paymentMode: "",
});

const details = reactive({
  studentId: null,
  module: {},
  paymentDate: "",
  amount: 0,
  payer: "",
  payerNumber: "",
  paymentMode: "",
});

const openAddModal = () => {
  currentPayment.id = null;
  currentPayment.studentId = null;
  currentPayment.moduleId = null;
  currentPayment.registrationId = null;
  currentPayment.paymentDate = "";
  currentPayment.amount = 0;
  currentPayment.payer = "";
  currentPayment.payerNumber = "";
  currentPayment.paymentMode = "";
  isEdit.value = false;
  showModal.value = true;
};

const openEditModal = (payment) => {
  currentPayment.id = payment.id;
  currentPayment.studentId = payment.studentId;
  currentPayment.moduleId = payment.moduleId;
  currentPayment.registrationId = payment.registrationId;
  currentPayment.paymentDate = payment.paymentDate;
  currentPayment.amount = payment.amount;
  currentPayment.payer = payment.payer;
  currentPayment.payerNumber = payment.payerNumber;
  currentPayment.paymentMode = payment.paymentMode;
  isEdit.value = true;
  showModal.value = true;
};

const openViewModal = (payment) => {
  details.studentId = payment.studentId;
  details.module = payment.module;
  details.paymentDate = payment.paymentDate;
  details.amount = payment.amount;
  details.payer = payment.payer;
  details.payerNumber = payment.payerNumber;
  details.paymentMode = payment.paymentMode;
  showDetailsModal.value = true;
};

const closeModal = () => {
  showModal.value = false;
};

const closeDetailsModal = () => {
  showDetailsModal.value = false;
};

const savePayment = () => {
  if (isEdit.value) {
    updatePayment(currentPayment);
  } else {
    createPayment(currentPayment);
  }
  closeModal();
};

const confirmDelete = (id) => {
  Swal.fire({
    title: "Êtes-vous sûr?",
    text: "Cette action ne peut pas être annulée!",
    icon: "warning",
    showCancelButton: true,
    confirmButtonText: "Oui, supprimer",
    cancelButtonText: "Annuler",
  }).then((result) => {
    if (result.isConfirmed) {
      deletePayment(id);
    }
  });
};

const getStudentName = (studentId) => {
  const student = students.find((student) => student.id === studentId);
  return student ? student.fullName : "Non trouvé";
};

const formatDate = (date) => {
  const d = new Date(date);
  return d.toLocaleDateString();
};

onMounted(async () => {
  await fetchPayments();
  await fetchStudents();
  await fetchModules();
  await fetchRegistrations();
});
</script>

<style scoped>
/* Custom styles for your component */
</style>
