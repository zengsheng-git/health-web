<template>
  <Card class="w-[95%] mx-auto pt-[60px]">
    <template #content>
      <div>
        <Toolbar class="mb-6">
          

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
          :rows="5"
          :filters="filters"
          paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
          :rowsPerPageOptions="[2, 5, 10, 25]"
          currentPageReportTemplate="Showing {first} to {last} of {totalRecords} users"
          :loading="loading"
        >
          <template #header>
            <div class="flex flex-wrap gap-2 items-center justify-between">
              <h4 class="m-0">Food nutrition information table</h4>
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
            field="foodname"
            header="Food name"
            sortable
            style="min-width: 12rem"
          ></Column>
          <Column
            field="category"
            header="Category"
            sortable
            style="min-width: 16rem"
          ></Column>
          <Column
            field="calories"
            header="Calories (kcal)"
            sortable
            style="min-width: 12rem"
          ></Column>
          <Column
            field="protein"
            header="Protein  (g)"
            sortable
            style="min-width: 10rem"
          >
          </Column>
          <Column
            field="fat"
            header="Fat  (g)"
            sortable
            style="min-width: 10rem"
          >
          </Column>
          <Column
            field="carbohydrates"
            header="Carbohydrates  (g)"
            sortable
            style="min-width: 14rem"
          ></Column>
          <Column
            field="sugar"
            header="Sugar  (g)"
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
    // Format time field
    users.value = [
      {
        foodname: "Banana",
        category: "Fruit",
        calories: 89,
        protein: 1.1,
        fat: 0.3,
        carbohydrates: 22.8,
        sugar: 12.2,
      },
      {
        foodname: "Apple",
        category: "Fruit",
        calories: 52,
        protein: 0.3,
        fat: 0.2,
        carbohydrates: 14,
        sugar: 10.4,
      },
      {
        foodname: "Avocado",
        category: "Fruit",
        calories: 160,
        protein: 2.0,
        fat: 15,
        carbohydrates: 9,
        sugar: 0.7,
      },
      {
        foodname: "Orange",
        category: "Fruit",
        calories: 47,
        protein: 0.9,
        fat: 0.1,
        carbohydrates: 12,
        sugar: 9.0,
      },
      {
        foodname: "Chicken breast",
        category: "Meat",
        calories: 165,
        protein: 31,
        fat: 3.6,
        carbohydrates: 0,
        sugar: 0,
      },
      {
        foodname: "Salmon",
        category: "Fish",
        calories: 208,
        protein: 20,
        fat: 13,
        carbohydrates: 0,
        sugar: 0,
      },
      {
        foodname: "Steak",
        category: "Meat",
        calories: 271,
        protein: 25,
        fat: 19,
        carbohydrates: 0,
        sugar: 0,
      },
      {
        foodname: "Tofu",
        category: "Proteins",
        calories: 76,
        protein: 8,
        fat: 4.8,
        carbohydrates: 2,
        sugar: 0.3,
      },
    ];

  } catch (error) {
  } finally {
    loading.value = false;
  }
};


const exportCSV = () => {
  // Generate CSV content
  const csvContent = [];

  // Add header
  csvContent.push(
    [
      "Food name",
      "Category",
      "Calories (kcal)",
      "Protein (g)",
      "Fat (g)",
      "Carbohydrates (g)",
      "Sugar (g)",
    ].join(",")
  );

  // Add user data
  users.value.forEach((user) => {
    csvContent.push(
      [
        `"${user.foodname}"`,
        `"${user.category || "-"}"`,
        user.calories,
        user.protein,
        `"${user.fat}"`,
        `"${user.carbohydrates}"`,
        `"${user.sugar}"`,
      ].join(",")
    );
  });

  // Create a blob and trigger download
  const blob = new Blob([csvContent.join("\n")], {
    type: "text/csv;charset=utf-8;",
  });
  const link = document.createElement("a");
  const url = URL.createObjectURL(blob);
  link.setAttribute("href", url);
  link.setAttribute(
    "download",
    `users_${new Date().toISOString().split("T")[0]}.csv`
  );
  link.style.visibility = "hidden";
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};
</script>
