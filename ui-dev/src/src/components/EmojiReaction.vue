
  
<script setup lang="ts">
import useStore from '@src/store/store';
import { Ref, ref } from 'vue';

const store = useStore();
const emojis = ["👍", "🎉", "❤️", "😊", "😀", "🥳", "😂", "🤣", "😅", "😉", "😎", "😍", "😘", "🤗"];
const randomEmojis: Ref<string[]> = ref([]);

const props = defineProps<{
    closePanel?: () => void;
    handleCloseEmojiPanel: () => void;
}>();

const generateRandomEmojis = () => {
    const emojiCount = 5;
    const shuffledEmojis = emojis.slice().sort(() => 0.5 - Math.random());
    const selectedEmojis = shuffledEmojis.slice(0, emojiCount);
    randomEmojis.value = selectedEmojis;
};

generateRandomEmojis();

function handleEmoji(emoji: any) {
    store.emojiReaction = emoji;
    props.handleCloseEmojiPanel();
    if (store.singleMsg) {
        store.singleMsg.emoji = store.emojiReaction;
    }
}


</script>

<template>
    <div class=" rounded-lg">
        <div class="panel ">
            <div v-for="emoji in randomEmojis" :key="emoji">
                <p @click="handleEmoji(emoji)" class="emojiStyle"> {{ emoji }} </p>
            </div>
        </div>

    </div>
</template>

  
<style scoped>
.panel {
    display: flex;
    flex-wrap: wrap;
    gap: 15px;
}

.emojiStyle {
    font-size: 20px;
}
</style>
  