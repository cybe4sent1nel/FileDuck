<template>
  <div class="py-20 w-full bg-white">
    <div class="container mx-auto px-4 mb-16">
      <div class="text-center">
        <!-- Duck Love Animation -->
        <div class="flex justify-center mb-6">
          <Vue3Lottie
            :animationData="DuckLoveAnimation"
            :height="120"
            :width="120"
            :loop="true"
          />
        </div>
        
        <h2 class="text-5xl font-bold mb-4 text-indigo-950 font-display tracking-tight leading-tight pb-2">
          What Our Users Say
        </h2>
        <p class="text-xl text-gray-600">
          Trusted by 500K+ users worldwide
        </p>
      </div>
    </div>

    <style scoped>
      @keyframes scrollLeft {
        0% {
          left: 0;
        }
        100% {
          left: -100%;
        }
      }

      @keyframes scrollRight {
        0% {
          right: 0;
        }
        100% {
          right: -100%;
        }
      }

      .carousel-wrapper {
        width: 100%;
        overflow: hidden;
        position: relative;
        margin: 0;
      }

      .carousel-track {
        display: flex;
        gap: 1.5rem;
        animation: scrollLeft 50s linear infinite;
        padding: 2rem 0;
      }

      .carousel-track.reverse {
        animation: scrollRight 50s linear infinite;
      }

      .carousel-track:hover {
        animation-play-state: paused;
      }

      .carousel-fade {
        position: absolute;
        top: 0;
        height: 100%;
        width: 10%;
        pointer-events: none;
        z-index: 20;
      }

      .carousel-fade.left {
        left: 0;
        background: linear-gradient(to right, rgba(255,255,255,1), rgba(255,255,255,0));
      }

      .carousel-fade.right {
        right: 0;
        background: linear-gradient(to left, rgba(255,255,255,1), rgba(255,255,255,0));
      }
    </style>

    <!-- First Row - Left to Right -->
    <div class="carousel-wrapper mb-12">
      <div class="carousel-fade left"></div>
      <div class="carousel-track">
        <TestimonialCard v-for="(card, index) in [...cardsData.slice(0, 4), ...cardsData.slice(0, 4)]" :key="`row1-${index}`" :card="card" />
      </div>
      <div class="carousel-fade right"></div>
    </div>

    <!-- Second Row - Right to Left -->
    <div class="carousel-wrapper">
      <div class="carousel-fade left"></div>
      <div class="carousel-track reverse">
        <TestimonialCard v-for="(card, index) in [...cardsData.slice(4, 8), ...cardsData.slice(4, 8)]" :key="`row2-${index}`" :card="card" />
      </div>
      <div class="carousel-fade right"></div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { Vue3Lottie } from 'vue3-lottie';
import { ref } from 'vue';
import TestimonialCard from './TestimonialCard.vue';
import DuckLoveAnimation from '../../../../animations/Duck love.json';

interface Testimonial {
  image: string;
  name: string;
  handle: string;
  review: string;
  profession: string;
}

const cardsData = ref<Testimonial[]>([
  {
    image: 'https://images.unsplash.com/photo-1633332755192-727a05c4013d?q=80&w=200&h=200&fit=crop',
    name: 'Marcus Chen',
    handle: '@marcuschen_dev',
    profession: 'Software Engineer',
    review: 'FileDuck transformed how our team shares large project files. The security features give us confidence, and the speed is unmatched in the industry.'
  },
  {
    image: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?q=80&w=200&h=200&fit=crop',
    name: 'Elena Rodriguez',
    handle: '@elenards',
    profession: 'Product Manager',
    review: 'The intuitive interface and reliable delivery make file sharing effortless. Our clients love the virus scanning feature for peace of mind.'
  },
  {
    image: 'https://images.unsplash.com/photo-1527980965255-d3b416303d12?w=200&h=200&fit=crop&q=60',
    name: 'Jasper Williams',
    handle: '@jasperwdev',
    profession: 'Freelance Designer',
    review: 'Best file sharing platform Ive used. Fast uploads, reliable downloads, and the checksum verification is a game changer for delivery confirmations.'
  },
  {
    image: 'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?w=200&h=200&fit=crop&q=60',
    name: 'Sophia Adams',
    handle: '@sophiawrites',
    profession: 'Content Creator',
    review: 'Simple, secure, and incredibly fast. FileDuck is the only file sharing service my production team recommends. Worth every second of setup time.'
  },
  {
    image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&h=200&fit=crop&q=60',
    name: 'David Thompson',
    handle: '@david_tech',
    profession: 'IT Security Specialist',
    review: 'The encryption implementation is solid and the zero-knowledge architecture is exactly what enterprises need. Finally a secure alternative to legacy systems.'
  },
  {
    image: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200&h=200&fit=crop&q=60',
    name: 'Olivia Martinez',
    handle: '@oliviam_pro',
    profession: 'Graphic Designer',
    review: 'Professional clients require professional tools. FileDuck delivers on every front. The password protection and expiration features are exactly what we needed.'
  },
  {
    image: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=200&h=200&fit=crop&q=60',
    name: 'Benjamin Park',
    handle: '@ben_park_dev',
    profession: 'Full Stack Developer',
    review: 'The API integration was seamless. Were sharing terabytes of data monthly with zero issues. Outstanding performance and reliability metrics.'
  },
  {
    image: 'https://images.unsplash.com/photo-1517841905240-a2efqf664519?w=200&h=200&fit=crop&q=60',
    name: 'Isabella Santos',
    handle: '@isabellas_art',
    profession: 'Creative Director',
    review: 'In a world of bloated file sharing apps, FileDuck is refreshingly minimal yet powerful. Our entire creative team switched last month and hasnt looked back.'
  }
]);
</script>

