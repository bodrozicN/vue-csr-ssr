<script setup>
import { onMounted, shallowRef } from 'vue'

const todoList = shallowRef([])


onMounted(async () => {
  const res = await fetch('https://jsonplaceholder.typicode.com/todos')
  const data = await res.json()
  todoList.value = data
})
</script>

<template>
  <main>
    <ul>
      <li v-for="todo in todoList" :key="todo.id">{{ todo.title }}</li>
    </ul>
  </main>
</template>
