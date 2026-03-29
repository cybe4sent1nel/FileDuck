<template>
  <div class="py-20">
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

    <!-- Marquee Container -->
    <style scoped>
      @keyframes marqueeScroll {
        0% { 
          transform: translateX(0); 
        }
        100% { 
          transform: translateX(calc(-288px * 4 - 24px * 3));
        }
      }

      .marquee-row {
        width: 100vw;
        position: relative;
        margin-left: calc(-50vw + 50%);
        overflow: hidden;
      }

      .marquee-inner {
        display: flex;
        gap: 1.5rem;
        padding-top: 2.5rem;
        padding-bottom: 1.25rem;
        width: fit-content;
        min-width: calc(288px * 4 * 2);
        animation: marqueeScroll 45s linear infinite;
        will-change: transform;
        transform: translateZ(0);
        backface-visibility: hidden;
      }

      .marquee-reverse {
        animation-direction: reverse;
      }

      .marquee-inner:hover {
        animation-play-state: paused;
      }

      .gradient-left {
        position: absolute;
        left: 0;
        top: 0;
        height: 100%;
        width: 6rem;
        z-index: 10;
        pointer-events: none;
        background: linear-gradient(to right, white, white, transparent);
      }

      .gradient-right {
        position: absolute;
        right: 0;
        top: 0;
        height: 100%;
        width: 6rem;
        z-index: 10;
        pointer-events: none;
        background: linear-gradient(to left, white, white, transparent);
      }
    </style>

    <!-- First Row -->
    <div class="marquee-row mb-8">
      <div class="gradient-left"></div>
      <div class="marquee-inner">
        <TestimonialCard v-for="(card, index) in cardsData.slice(0, 4)" :key="`row1-${index}`" :card="card" />
        <TestimonialCard v-for="(card, index) in cardsData.slice(0, 4)" :key="`row1-repeat-${index}`" :card="card" />
      </div>
      <div class="gradient-right"></div>
    </div>

    <!-- Second Row (Reverse) -->
    <div class="marquee-row">
      <div class="gradient-left"></div>
      <div class="marquee-inner marquee-reverse">
        <TestimonialCard v-for="(card, index) in cardsData.slice(4, 8)" :key="`row2-${index}`" :card="card" />
        <TestimonialCard v-for="(card, index) in cardsData.slice(4, 8)" :key="`row2-repeat-${index}`" :card="card" />
      </div>
      <div class="gradient-right"></div>
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

