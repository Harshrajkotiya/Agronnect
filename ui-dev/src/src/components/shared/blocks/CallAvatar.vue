<!-- path: Call, usage: avatar -->

<script setup lang="ts">
import type { IContact } from "@src/types";

const props = defineProps<{
  member: IContact;
  index: number;
  membersLength: number;
  large?: Boolean;
}>();
</script>

<template>
  <div
    v-if="index === 0"
    :style="{ backgroundImage: `url(${member.avatar})` }"
    class="rounded-full bg-cover bg-center w-[50px] h-[50px]"
    :class="props.large ? ['w-[100px]', 'h-[100px]'] : ['w-7', 'h-7']"
  ></div>
</template>
