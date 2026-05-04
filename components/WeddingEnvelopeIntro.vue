<template>
  <div v-if="showIntro" class="intro-screen" :class="{ leaving: isLeaving }">
    <div class="intro-content" @click="openInvitation">
      <div class="envelope" :class="{ open: isOpening, second: showSecondPaper }">
        <div class="paper paper-first">
          <p>Andrea & Williams</p>
          <small>Nuestra boda</small>

          <div v-if="props.guestName" class="guest-to">
            Para: {{ guestName }}
          </div>
        </div>


        <div class="envelope-back"></div>
        <div class="envelope-body"></div>
        <div class="envelope-flap"></div>

        <div class="seal">AW</div>
      </div>

      <p class="intro-text">
        Presiona para abrir la invitación
      </p>
    </div>
  </div>
</template>

<script setup lang="ts">
import confetti from 'canvas-confetti'
import { ref } from 'vue'

const props = defineProps<{
  guestName?: string
}>()

const showIntro = ref(true)
const isOpening = ref(false)
const showSecondPaper = ref(false)
const isLeaving = ref(false)

const openInvitation = () => {
  if (isOpening.value) return

  isOpening.value = true

  setTimeout(() => {
    showSecondPaper.value = true
  }, 3000)

  setTimeout(() => {
    confetti({
      particleCount: 240,
      spread: 120,
      origin: { y: 0.58 }
    })
  }, 4500)

  setTimeout(() => {
    isLeaving.value = true
  }, 5000)

  setTimeout(() => {
    showIntro.value = false
  }, 5900)
}

</script>

<style scoped>
.intro-screen {
  position: fixed;
  inset: 0;
  z-index: 9999;
  background: radial-gradient(circle at center, #f8fcff, #e7f4fb);
  display: flex;
  align-items: center;
  justify-content: center;
  transition: opacity 0.9s ease, transform 0.9s ease;
}

.intro-screen.leaving {
  opacity: 0;
  transform: scale(1.06);
  pointer-events: none;
}

.intro-content {
  text-align: center;
  cursor: pointer;
}

.envelope {
  width: 560px;
  height: 350px;
  position: relative;
  animation: floatEnvelope 2.5s ease-in-out infinite;
  perspective: 1200px;
}

.envelope-back {
  position: absolute;
  inset: 0;
  background: linear-gradient(145deg, #b9dff3, #8fc8e6);
  border-radius: 26px;
  box-shadow: 0 35px 100px rgba(85, 128, 160, 0.28);
  z-index: 1;
}

.envelope-body {
  position: absolute;
  inset: 0;
  background:
      linear-gradient(32deg, transparent 50%, rgba(255,255,255,0.35) 50%),
      linear-gradient(-32deg, transparent 50%, rgba(94, 155, 190, 0.20) 50%),
      linear-gradient(145deg, #b9dff3, #8fc8e6);
  border-radius: 26px;
  z-index: 5;
}

.envelope-flap {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 225px;
  background: linear-gradient(145deg, #d1eefb, #9ed4ee);
  clip-path: polygon(0 0, 100% 0, 50% 100%);
  transform-origin: top;
  transition: transform 1s ease;
  z-index: 8;
}

.seal {
  position: absolute;
  top: 120px;
  left: 50%;
  transform: translateX(-50%);
  width: 82px;
  height: 82px;
  background: #fff8f1;
  color: #6faed0;
  border: 1px solid rgba(111, 174, 208, 0.35);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-family: "Brush Script MT", "Segoe Script", cursive;
  font-size: 34px;
  z-index: 9;
  box-shadow: 0 12px 28px rgba(85, 128, 160, 0.22);
  transition: all 0.45s ease;
}

.paper {
  position: absolute;
  left: 55px;
  right: 55px;
  bottom: 35px;
  height: 250px;
  border-radius: 22px;
  z-index: 3;
  opacity: 0;
  box-shadow: 0 22px 60px rgba(85, 128, 160, 0.20);
}

.paper-first {
  background: #fff8f1;
  border: 1px solid rgba(138, 100, 61, 0.20);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  transform: translateY(45px) scale(0.9);
  transition: transform 1.15s cubic-bezier(.2,.9,.2,1), opacity 0.8s ease;
}

.paper-first p {
  font-family: "Brush Script MT", "Segoe Script", cursive;
  font-size: 50px;
  color: #000000;
  margin-bottom: 8px;
}

.paper-first small {
  text-transform: uppercase;
  letter-spacing: 4px;
  color: #000000;
}

.guest-to {
  margin-top: 18px;
  color: #000000;
  font-size: 15px;
  letter-spacing: 2px;
  text-transform: uppercase;
  border-top: 1px solid rgba(138, 100, 61, 0.25);
  padding-top: 14px;
  max-width: 82%;
  line-height: 1.4;
}

.paper-photo {
  overflow: hidden;
  background: #fff8f1;
  transform: translateY(70px) scale(0.82);
  transition: transform 1.25s cubic-bezier(.2,.9,.2,1), opacity 0.8s ease;
}

.paper-photo img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.photo-text {
  position: absolute;
  inset: 0;
  background: linear-gradient(
      to top,
      rgba(47, 41, 35, 0.62),
      rgba(47, 41, 35, 0.05)
  );
  color: #fff8f1;
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
  align-items: center;
  padding: 24px;
}

.photo-text span {
  font-family: "Brush Script MT", "Segoe Script", cursive;
  font-size: 42px;
}

.photo-text small {
  letter-spacing: 3px;
  text-transform: uppercase;
}

.photo-guest {
  margin-top: 10px;
  font-size: 13px;
  letter-spacing: 2px;
  text-transform: uppercase;
}

.envelope.open {
  animation: none;
}

.envelope.open .envelope-flap {
  transform: rotateX(180deg);
  z-index: 2;
}

.envelope.open .seal {
  opacity: 0;
  transform: translateX(-50%) scale(0.55);
}

.envelope.open .paper-first {
  opacity: 1;
  transform: translateY(-255px) scale(1.08);
  z-index: 7;
}

.envelope.second .paper-first {
  transform: translateY(-330px) scale(0.92);
  opacity: 0.45;
  z-index: 6;
}

.envelope.second .paper-photo {
  opacity: 1;
  transform: translateY(-260px) scale(1.18);
  z-index: 10;
}

.intro-text {
  margin-top: 72px;
  font-size: 16px;
  letter-spacing: 3px;
  text-transform: uppercase;
  color: #6faed0;
  transition: opacity 0.4s ease;
}

.envelope.open + .intro-text {
  opacity: 0;
}

@keyframes floatEnvelope {
  0%, 100% {
    transform: translateY(0);
  }

  50% {
    transform: translateY(-20px);
  }
}

@media (max-width: 768px) {
  .envelope {
    width: 330px;
    height: 220px;
  }

  .envelope-flap {
    height: 140px;
  }

  .seal {
    width: 58px;
    height: 58px;
    top: 78px;
    font-size: 25px;
  }

  .paper {
    left: 30px;
    right: 30px;
    bottom: 24px;
    height: 160px;
    border-radius: 18px;
  }

  .paper-first p {
    font-size: 32px;
  }

  .paper-first small {
    font-size: 11px;
  }

  .guest-to {
    margin-top: 10px;
    padding-top: 9px;
    font-size: 10px;
    letter-spacing: 1.3px;
  }

  .photo-text span {
    font-size: 29px;
  }

  .photo-text small {
    font-size: 10px;
  }

  .photo-guest {
    font-size: 10px;
  }

  .envelope.open .paper-first {
    transform: translateY(-170px) scale(1.06);
  }

  .envelope.second .paper-first {
    transform: translateY(-220px) scale(0.88);
  }

  .envelope.second .paper-photo {
    transform: translateY(-175px) scale(1.12);
  }

  .intro-text {
    margin-top: 52px;
    font-size: 13px;
  }
}
</style>
