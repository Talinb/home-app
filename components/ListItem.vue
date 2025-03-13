<template>
  <div class="relative overflow-hidden group">
    <!-- Delete button -->
    <div class="absolute right-0 top-0 bottom-0 w-24">
      <button
        @click="$emit('delete')"
        class="w-full h-full bg-red-500 text-white flex items-center justify-center"
      >
        <IconTrash class="text-white h-10 w-10" />
      </button>
    </div>

    <!-- Swipe container -->
    <div
      class="transition-transform duration-300 z-10 relative"
      :style="{ transform: `translateX(${item.swipeOffset}px)` }"
      @touchstart="$emit('swipe-start', $event)"
      @touchmove="$emit('swipe-move', $event)"
      @touchend="$emit('swipe-end')"
    >
      <!-- Content wrapper -->
      <div
        @click="$emit('navigate')"
        class="w-full rounded p-4 bg-yellow flex flex-row items-center gap-4 cursor-pointer z-10"
        :class="{
          ' !bg-light-navy': item.type === 'secret-note',
        }"
      >
        <div class="flex flex-col items-center justify-center flex-shrink-0">
          <IconSquareCheck v-if="item.type === 'todo'" class="text-navy" />
          <IconNote v-if="item.type === 'note'" class="text-navy" />
          <IconLockPassword v-if="item.type === 'secret-note'" class="text-white" />
        </div>
        <div class="flex flex-col flex-1 min-w-0">
          <h3 class="font-bold text-navy font-secondary text-2xl truncate" :class="{
            'text-white': item.type === 'secret-note',
          }">
            {{ item.title || "Untitled" }}
          </h3>
          <span class="text-sm text-navy text-opacity-70 font-secondary" :class="{
            'text-white': item.type === 'secret-note',
          }">
            {{ formatDate(item.id) }}
          </span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { IconTrash, IconSquareCheck, IconNote, IconLockPassword } from "@tabler/icons-vue";
defineProps({
  item: {
    type: Object,
    required: true,
  },
});

defineEmits(["delete", "navigate", "swipe-start", "swipe-move", "swipe-end"]);

const formatDate = (timestamp) => {
  return new Date(timestamp).toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  });
};
</script>
