<script setup>
import NavBar         from './components/NavBar.vue'
import FooterBar      from './components/FooterBar.vue'
import WhatsAppButton from './components/WhatsAppButton.vue'
import ChatBot        from './components/ChatBot.vue'
</script>

<template>
  <div class="min-h-screen flex flex-col bg-canvas">

    <!-- Navigation bar — fixed at the top -->
    <NavBar />

    <!-- This spacer pushes the page content below the fixed navbar -->
    <div style="height:65px;"></div>

    <!-- RouterView shows whichever page matches the current URL -->
    <main class="flex-1">
      <RouterView />
    </main>

    <!-- Footer at the bottom -->
    <FooterBar />

    <!-- These float above everything else -->
    <WhatsAppButton />
    <ChatBot />

  </div>
</template>