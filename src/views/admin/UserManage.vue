<template>
  <Card class="w-full mx-auto">
    <template #content>
      <div>
        <Toolbar class="mb-6">
          <template #start>
            <Button
              label="刷新"
              icon="pi pi-refresh"
              class="mr-2"
              @click="loadUsers"
            />
          </template>

          <template #end>
            <Button
              label="导出"
              icon="pi pi-upload"
              severity="secondary"
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
          currentPageReportTemplate="显示第 {first} 到 {last} 条，共 {totalRecords} 个用户"
          :loading="loading"
        >
          <template #header>
            <div class="flex flex-wrap gap-2 items-center justify-between">
              <h4 class="m-0">用户管理</h4>
              <IconField>
                <InputIcon>
                  <i class="pi pi-search" />
                </InputIcon>
                <InputText
                  v-model="filters['global'].value"
                  placeholder="搜索用户..."
                />
              </IconField>
            </div>
          </template>

          <Column
            field="uid"
            header="用户ID"
            sortable
            style="min-width: 12rem"
          ></Column>
          <Column
            field="email"
            header="邮箱"
            sortable
            style="min-width: 16rem"
          ></Column>
          <Column
            field="displayName"
            header="姓名"
            sortable
            style="min-width: 12rem"
          ></Column>
          <Column
            field="emailVerified"
            header="邮箱验证"
            sortable
            style="min-width: 10rem"
          >
            <template #body="slotProps">
              <Tag
                :value="slotProps.data.emailVerified ? '已验证' : '未验证'"
                :severity="slotProps.data.emailVerified ? 'success' : 'warning'"
              />
            </template>
          </Column>
          <Column
            field="disabled"
            header="状态"
            sortable
            style="min-width: 10rem"
          >
            <template #body="slotProps">
              <Tag
                :value="slotProps.data.disabled ? '禁用' : '启用'"
                :severity="slotProps.data.disabled ? 'danger' : 'success'"
              />
            </template>
          </Column>
          <Column
            field="formattedCreationTime"
            header="创建时间"
            sortable
            style="min-width: 14rem"
          ></Column>
          <Column
            field="formattedLastSignInTime"
            header="最近登录时间"
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
    
    // 在数据加载时立即格式化时间
    users.value = (data.users || []).map(user => ({
      ...user,
      formattedCreationTime: formatDate(user.metadata?.creationTime),
      formattedLastSignInTime: formatDate(user.metadata?.lastSignInTime)
    }));
    
    toast.add({
      severity: "success",
      summary: "成功",
      detail: `已加载 ${users.value.length} 个用户`,
      life: 3000,
    });
  } catch (error) {
    console.error("获取用户数据失败:", error);
    toast.add({
      severity: "error",
      summary: "错误",
      detail: "获取用户数据失败",
      life: 3000,
    });
  } finally {
    loading.value = false;
  }
};

const editUser = (user) => {
  toast.add({
    severity: "info",
    summary: "提示",
    detail: "编辑用户功能开发中",
    life: 3000,
  });
};

const confirmDeleteUser = (user) => {
  toast.add({
    severity: "info",
    summary: "提示",
    detail: "删除用户功能开发中",
    life: 3000,
  });
};

const formatDate = (dateString) => {
  if (!dateString) return '-';
  try {
    const date = new Date(dateString);
    // 确保时间包含秒数 - 使用更可靠的方法
    if (!isNaN(date.getTime())) {
      // 使用toLocaleString确保正确的时区处理
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
    console.error('日期格式化错误:', error);
    return dateString;
  }
};

const exportCSV = () => {
  // 使用自定义导出确保时间格式正确
  const csvContent = [];
  
  // 添加表头
  csvContent.push(['用户ID', '邮箱', '姓名', '邮箱验证', '状态', '创建时间', '最近登录时间'].join(','));
  
  // 添加数据行
  users.value.forEach(user => {
    csvContent.push([
      user.uid,
      `"${user.email}"`,
      `"${user.displayName || '-'}"`,
      user.emailVerified ? '已验证' : '未验证',
      user.disabled ? '禁用' : '启用',
      `"${user.formattedCreationTime}"`,
      `"${user.formattedLastSignInTime}"`
    ].join(','));
  });
  
  // 创建下载链接
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
