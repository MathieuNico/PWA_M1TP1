<template>
  <div class="home-page">

    <main class="home-content">
      <button class="cta-button" @click="goToReception">
        Commencer →
      </button>
    </main>

    <footer class="home-footer">
      <p>PWA Chat & Gallery © 2025 - Projet M1 TP1</p>
    </footer>
  </div>
</template>

<script setup lang="ts">
const emit = defineEmits<{
  navigate: [to: string];
}>();

function goToReception() {
  emit('navigate', 'reception');
}
</script>

<style scoped>
.home-page {
  min-height: 100vh;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  display: flex;
  flex-direction: column;
}

.home-header {
  text-align: center;
  padding: 3rem 1rem 2rem;
  color: #fff;
}

.home-header h1 {
  font-size: 3rem;
  margin-bottom: 0.5rem;
  text-shadow: 2px 2px 8px rgba(0,0,0,0.2);
}

.subtitle {
  font-size: 1.3rem;
  opacity: 0.95;
}

.home-content {
  flex: 1;
  max-width: 1100px;
  width: 100%;
  margin: 0 auto;
  padding: 2rem;
}

.intro-section, .tech-section, .features-section {
  background: #fff;
  border-radius: 1.2rem;
  padding: 2rem;
  margin-bottom: 2rem;
  box-shadow: 0 4px 24px rgba(0,0,0,0.1);
}

.intro-section h2, .tech-section h2, .features-section h2 {
  color: #667eea;
  margin-bottom: 1rem;
  font-size: 1.8rem;
}

.intro-section p {
  line-height: 1.7;
  color: #374151;
  font-size: 1.1rem;
}

.tech-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
  gap: 1.5rem;
  margin-top: 1.5rem;
}

.tech-card {
  background: linear-gradient(135deg, #f3f4f6 0%, #e5e7eb 100%);
  border-radius: 0.8rem;
  padding: 1.5rem;
  text-align: center;
  transition: transform 0.2s, box-shadow 0.2s;
}

.tech-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 8px 16px rgba(0,0,0,0.1);
}

.tech-icon {
  font-size: 2.5rem;
  display: block;
  margin-bottom: 0.5rem;
}

.tech-card h3 {
  color: #667eea;
  margin-bottom: 0.5rem;
  font-size: 1.2rem;
}

.tech-card p {
  color: #6b7280;
  font-size: 0.95rem;
  line-height: 1.4;
}

.features-list {
  list-style: none;
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 1rem;
  margin-top: 1rem;
}

.features-list li {
  background: #f9fafb;
  padding: 1rem;
  border-radius: 0.6rem;
  color: #374151;
  font-size: 1.05rem;
  border-left: 4px solid #667eea;
}

.cta-button {
  display: block;
  margin: 2rem auto;
  padding: 1rem 3rem;
  font-size: 1.3rem;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: #fff;
  border: none;
  border-radius: 0.8rem;
  cursor: pointer;
  font-weight: 600;
  box-shadow: 0 4px 16px rgba(102, 126, 234, 0.4);
  transition: transform 0.2s, box-shadow 0.2s;
}

.cta-button:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 24px rgba(102, 126, 234, 0.5);
}

.home-footer {
  text-align: center;
  padding: 2rem;
  color: #fff;
  opacity: 0.9;
  font-size: 0.95rem;
}

@media (max-width: 768px) {
  .home-header h1 {
    font-size: 2rem;
  }
  
  .tech-grid {
    grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
  }
}
</style>
