<template>
  <div class="flex flex-col h-full p-4">
    <h1 class="text-2xl font-bold mb-4">Dự án - Demo Table</h1>
    
    <div class="overflow-x-auto flex-1">
      <table class="min-w-full bg-white dark:bg-slate-800 shadow-md rounded-lg overflow-hidden">
        <thead class="bg-gray-200 dark:bg-slate-700">
          <tr>
            <th class="w-1/3 py-3 px-4 text-left text-gray-600 dark:text-slate-300 font-semibold">Tên Dự án</th>
            <th class="w-1/3 py-3 px-4 text-left text-gray-600 dark:text-slate-300 font-semibold">Trạng thái</th>
            <th class="w-1/3 py-3 px-4 text-left text-gray-600 dark:text-slate-300 font-semibold">Ngày bắt đầu</th>
          </tr>
        </thead>
        <tbody class="text-gray-700 dark:text-slate-400">
          <tr v-for="project in projects" :key="project.id" class="border-b border-gray-200 dark:border-slate-700">
            <td class="py-3 px-4">{{ project.name }}</td>
            <td class="py-3 px-4">{{ project.status }}</td>
            <td class="py-3 px-4">{{ project.startDate }}</td>
          </tr>
        </tbody>
      </table>
    </div>

  </div>
</template>

<script setup>
import { ref } from 'vue';

// Demo data
const projects = ref([
  { id: 1, name: 'Dự án Alpha', status: 'Đang tiến hành', startDate: '2023-01-15' },
  { id: 2, name: 'Dự án Beta', status: 'Hoàn thành', startDate: '2022-11-01' },
  { id: 3, name: 'Dự án Gamma', status: 'Kế hoạch', startDate: '2024-03-10' },
  { id: 4, name: 'Dự án Delta', status: 'Đang tiến hành', startDate: '2023-07-20' },
]);

</script>

<style scoped>
/* Scoped styles for ProjectTableView.vue */
/* Add any custom styles here if needed, but Tailwind should cover most basics */
</style> 