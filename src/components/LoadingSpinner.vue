<script setup>
// This component accepts a message prop
// If you pass message="Loading products..." it shows that text
// If you pass nothing it shows "Loading..."
defineProps({
  message: {
    type: String,
    default: 'Loading...'
  }
})
</script>

<template>
  <div class="flex flex-col items-center justify-center py-24 gap-4">

    <!-- The spinning circle -->
    <div
      class="w-12 h-12 rounded-full border-4 animate-spin"
      style="border-color: rgba(245,192,0,0.2); border-top-color: #f5c000;"
    ></div>

    <!-- The message below the spinner -->
    <p class="text-sm" style="color: #888898;">{{ message }}</p>

  </div>
</template>