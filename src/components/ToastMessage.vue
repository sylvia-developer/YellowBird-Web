<script setup>
import { CheckCircle, AlertCircle, Info } from 'lucide-vue-next'

// This component needs 3 things from the parent:
// message = the text to show
// type = 'success', 'error', or 'info'
// show = true or false (controls whether it is visible)
defineProps({
  message: { type: String,  required: true },
  type:    { type: String,  default: 'success' },
  show:    { type: Boolean, default: false },
})
</script>

<template>
  <!-- Transition makes it slide in and fade out smoothly -->
  <Transition name="toast">
    <div
      v-if="show"
      class="fixed top-20 left-1/2 z-50 flex items-center gap-3 px-5 py-3 rounded-full text-sm font-semibold shadow-2xl whitespace-nowrap"
      style="transform: translateX(-50%);"
      :style="
        type === 'success' ? 'background:#1a2a1a; border:1px solid #2d6a2d; color:#7dff7d;' :
        type === 'error'   ? 'background:#2a1a1a; border:1px solid #6a2d2d; color:#ff7d7d;' :
                             'background:#1a1a2a; border:1px solid #2d2d6a; color:#7d7dff;'
      "
    >
      <CheckCircle v-if="type === 'success'" :size="16" />
      <AlertCircle v-else-if="type === 'error'"   :size="16" />
      <Info        v-else                          :size="16" />
      {{ message }}
    </div>
  </Transition>
</template>

<style scoped>
.toast-enter-active,
.toast-leave-active {
  transition: all 0.3s ease;
}
.toast-enter-from,
.toast-leave-to {
  opacity: 0;
  transform: translateX(-50%) translateY(-16px);
}
</style>