<script setup lang="ts">
import Typography from "@src/components/ui/data-display/Typography.vue";

const props = defineProps<{
  vertical?: boolean;
}>();
</script>

<template>
  <div
    class="w-full p-5 flex items-center justify-center"
    :class="
      props.vertical
        ? ['flex-col', 'justify-center', 'items-center']
        : ['flex-row']
    "
  >
    <!--content-->
    <div class="flex flex-col items-center">
      <Typography class="mb-3 font-bold text-[20px]">No Calls Yet</Typography>

      <Typography class="text-[16px] text-[#7B809A] text-center">
        Your call history will display here.
      </Typography>
    </div>
  </div>
</template>
