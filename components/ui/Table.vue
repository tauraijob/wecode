<template>
  <div class="overflow-hidden rounded-xl border border-navy-800">
    <table class="min-w-full divide-y divide-navy-800">
      <thead class="bg-navy-900/40">
        <tr>
          <slot name="head" />
        </tr>
      </thead>
      <tbody class="divide-y divide-navy-800 bg-navy-950/40">
        <slot />
      </tbody>
    </table>
  </div>
</template>

<script setup lang="ts"></script>

