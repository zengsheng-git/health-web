<template>
  <Card class="w-[95%] mx-auto">
    <template #content>
      <div>
        <Toolbar class="mb-6">
          <template #start>
            <Button
              label="Refresh"
              icon="pi pi-refresh"
              class="mr-2"
              @click="loadUsers"
            />
          </template>

          <template #end>
            <Button
              label="Export"
              icon="pi pi-upload"
              severity="danger"
              @click="exportCSV($event)"
            />
          </template>
        </Toolbar>

        <DataTable
          ref="dt"
          v-model:selection="selectedUsers"
          :value="users"
          dataKey="uid"
          size="small"
          :paginator="true"
          :rows="2"
          :filters="filters"
          paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
          :rowsPerPageOptions="[2, 5, 10, 25]"
          currentPageReportTemplate="Showing {first} to {last} of {totalRecords} users"
          :loading="loading"
        >
          <template #header>
            <div class="flex flex-wrap gap-2 items-center justify-between">
              <h4 class="m-0">User management</h4>
              <IconField>
                <InputIcon>
                  <i class="pi pi-search" />
                </InputIcon>
                <InputText
                  v-model="filters['global'].value"
                  placeholder="Search for users..."
                />
              </IconField>
            </div>
          </template>

        
          <Column
            field="email"
            header="Email"
            sortable
            style="min-width: 16rem"
          ></Column>
          <Column
            field="displayName"
            header="Name"
            sortable
            style="min-width: 12rem"
          ></Column>
         
          <Column
            field="disabled"
            header="State"
            sortable
            style="min-width: 10rem"
          >
            <template #body="slotProps">
              <Tag
                :value="slotProps.data.disabled ? 'Disable' : 'Enable'"
                :severity="slotProps.data.disabled ? 'danger' : 'success'"
              />
            </template>
          </Column>
          <Column
            field="formattedCreationTime"
            header="Creation time"
            sortable
            style="min-width: 14rem"
          ></Column>
          <Column
            field="formattedLastSignInTime"
            header="Last login time"
            sortable
            style="min-width: 14rem"
          ></Column>
        
        </DataTable>
      </div>
    </template>
  </Card>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { FilterMatchMode } from "@primevue/core/api";
import { useToast } from "primevue/usetoast";

const API_URL = "https://us-central1-cxre-423d7.cloudfunctions.net/getAllAuthUsers";

const toast = useToast();
const dt = ref();
const users = ref([]);
const selectedUsers = ref();
const filters = ref({
  global: { value: null, matchMode: FilterMatchMode.CONTAINS },
});
const loading = ref(false);

onMounted(() => {
  loadUsers();
});

const loadUsers = async () => {
  loading.value = true;
  try {
    const response = await fetch(API_URL);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data = await response.json();
    
    // Format time field
    users.value = (data.users || []).map(user => ({
      ...user,
      formattedCreationTime: formatDate(user.metadata?.creationTime),
      formattedLastSignInTime: formatDate(user.metadata?.lastSignInTime)
    }));
    

  } catch (error) {
    console.error("Failed to obtain user data:", error);
    toast.add({
      severity: "Error",
      summary: "Error",
      detail: "Failed to obtain user data",
      life: 3000,
    });
  } finally {
    loading.value = false;
  }
};

const editUser = (user) => {
  toast.add({
    severity: "info",
    summary: "Info",
    detail: "Edit user feature in development",
    life: 3000,
  });
};

const confirmDeleteUser = (user) => {
  toast.add({
    severity: "info",
    summary: "Info",
    detail: "Delete user feature in development",
    life: 3000,
  });
};

const formatDate = (dateString) => {
  if (!dateString) return '-';
  try {
    const date = new Date(dateString);
    // Check if the date is valid
    if (!isNaN(date.getTime())) {
      // Format date to 'YYYY-MM-DD HH:mm:ss' in local timezone
      const formattedDate = date.toLocaleString('zh-CN', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: false
      }).replace(/\//g, '-');
      
      return formattedDate;
    }
    return dateString;
  } catch (error) {
    console.error('Date formatting error:', error);
    return dateString;
  }
};

const exportCSV = () => {
  // Generate CSV content
  const csvContent = [];
  
  // Add header
  csvContent.push(['Email', 'Name', 'Status', 'Creation Time', 'Last Login Time'].join(','));
  
  // Add user data
  users.value.forEach(user => {
    csvContent.push([
     
      `"${user.email}"`,
      `"${user.displayName || '-'}"`,
      user.disabled ? 'Disable' : 'Enable',
      `"${user.formattedCreationTime}"`,
      `"${user.formattedLastSignInTime}"`
    ].join(','));
  });
  
  // Create a blob and trigger download
  const blob = new Blob([csvContent.join('\n')], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  const url = URL.createObjectURL(blob);
  link.setAttribute('href', url);
  link.setAttribute('download', `users_${new Date().toISOString().split('T')[0]}.csv`);
  link.style.visibility = 'hidden';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};
</script>
