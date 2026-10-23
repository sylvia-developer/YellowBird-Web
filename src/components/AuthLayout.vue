<script setup>
defineProps({
  title: { type: String, required: true },
  subtitle: { type: String, default: '' },
})
</script>

<template>
  <div class="yb-auth-shell min-h-screen flex items-center justify-center px-4 py-12">
    <div class="w-full max-w-md">
      <div class="text-center mb-8">
        <p class="text-3xl font-black text-white yb-display">
          YellowBird<span class="text-brand">.</span>
        </p>
        <p class="mt-2 text-sm text-muted">{{ subtitle }}</p>
      </div>

      <div class="yb-card p-8">
        <h1 class="sr-only">{{ title }}</h1>
        <slot />
      </div>
    </div>
  </div>
</template>
