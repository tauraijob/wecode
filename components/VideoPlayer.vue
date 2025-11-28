<template>
  <div class="w-full h-full">
    <!-- YouTube Embed -->
    <iframe
      v-if="videoInfo.type === 'youtube' && videoInfo.embedUrl"
      :src="videoInfo.embedUrl"
      frameborder="0"
      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
      allowfullscreen
      class="w-full h-full"
      @load="handleVideoLoad"
    ></iframe>
    
    <!-- Vimeo Embed -->
    <iframe
      v-else-if="videoInfo.type === 'vimeo' && videoInfo.embedUrl"
      :src="videoInfo.embedUrl"
      frameborder="0"
      allow="autoplay; fullscreen; picture-in-picture"
      allowfullscreen
      class="w-full h-full"
      @load="handleVideoLoad"
    ></iframe>
    
    <!-- Direct Video -->
    <video
      v-else-if="videoInfo.type === 'direct' && videoInfo.embedUrl"
      ref="videoPlayer"
      :src="videoInfo.embedUrl"
      controls
      class="w-full h-full"
      @ended="handleVideoEnd"
      @loadedmetadata="handleVideoLoad"
      @canplay="handleVideoLoad"
    ></video>
    
    <!-- Unknown/Invalid URL -->
    <div
      v-else
      class="flex h-full items-center justify-center bg-navy-800 text-navy-400"
    >
      <div class="text-center">
        <svg class="mx-auto h-12 w-12 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
        </svg>
        <p class="text-sm">Invalid video URL</p>
        <p class="text-xs mt-1">Please provide a valid YouTube, Vimeo, or direct video URL</p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import { parseVideoUrl } from '~/composables/useVideoUrl'

const props = defineProps<{
  videoUrl: string
}>()

const emit = defineEmits<{
  ended: []
  loaded: []
}>()

const videoPlayer = ref<HTMLVideoElement | null>(null)

const videoInfo = computed(() => parseVideoUrl(props.videoUrl))

const handleVideoEnd = () => {
  emit('ended')
}

const handleVideoLoad = () => {
  emit('loaded')
}
</script>

