<script setup lang="ts">
import Loading3 from "@src/components/states/loading-states/Loading3.vue";
import Typography from "@src/components/ui/data-display/Typography.vue";
import { LinkData } from "@src/types";
import { formatDateTime } from "@src/utils";
import { onMounted, ref } from 'vue';

const props = defineProps(['linkFiles']);
// For link title
const dataLoading = ref(true);
const getTitle = async (url: string): Promise<{ titleElement: string; faviconElement: string }> => {
    try {
        const response = await fetch(`https://api.allorigins.win/get?url=${encodeURIComponent(url)}`);

        if (!response.ok) {
            throw new Error('Network response was not ok.');
        }

        const data = await response.json();
        const parser = new DOMParser();
        const doc = parser.parseFromString(data.contents, 'text/html');

        return {
            titleElement: doc.querySelector('title')?.textContent || '',
            faviconElement: doc.querySelector('link[rel="icon"]')?.getAttribute('href') || '',
        };
    } catch (error) {
        console.error('Error fetching data:', error);
        return {
            titleElement: '',
            faviconElement: '',
        };
    }
};

const fetchLinkDetails = async (link: LinkData) => {
    const data = await getTitle(link.content);
    link.titleElement = data.titleElement;
    link.faviconElement = data.faviconElement;
};
onMounted(async () => {
    try {
        await Promise.all(props.linkFiles.map((item: LinkData) => fetchLinkDetails(item)));
    } catch (error) {
        console.error('Error fetching data:', error);
    } finally {
        dataLoading.value = false;
    }
});
</script>
  
<template>
    <div v-if="dataLoading" class="h-[60vh]">
        <span class="text-[20px] flex justify-center"> Loading...</span>
        <span class="flex justify-center">
            <Loading3 />
        </span>
    </div>

    <div v-else-if="dataLoading == false && linkFiles.length > 0" class="h-[75vh] overflow-y-scroll min-[1000px]:h-[52vh]" style="overflow-x: hidden;">
        <div class="select-none " v-for="m in linkFiles" >
            <a :aria-label="'conversation with'" tabindex="0"
                class="w-full h-auto px-5 mt-5 my-4 flex transition duration-500 ease-out flex items-center"
                :href="m.content" target="_blank">

                <div class="mr-4 border rounded-md border-[#E9ECEF] p-5">

                    <img v-if="m.faviconElement" :src="m.faviconElement" alt="Network Error" class="w-[30px] h-[25px] " />
                    <img v-else src="https://img.icons8.com/?size=50&id=53372&format=png" alt="Network Error"
                        class="w-[30px] h-[25px]" />
                </div>


                <div class="w-[100%] grid grid-cols-3 mt-3">
                    <div class="grow text-start col-span-2 w-[90%]">
                        <Typography variant="heading-2" v-if="m" class="w-[40px] lg:w-full"> 
                            {{ m.titleElement }}
                        </Typography>

                        <p class='text-[#7B809A] py-1 text-[15px]'>{{ m.content?.length > 50 ?
                            m.content.slice(0, 50) + `…`
                            :
                            m.content }}</p>
                    </div>

                    <Typography variant="body-1" class='text-[#7B809A]'>
                        <p class="text-[14px] ml-[-4px] lg:ml-0"> {{ formatDateTime(m.message_time) }}</p>
                    </Typography>

                </div>
            </a>
            <hr />
        </div>
    </div>
    <div v-else-if="linkFiles.length <= 0" class="font-bold text-center h-[60vh]">
        No links appear in this chat
    </div>
</template>

<style scoped>
.custom-fill {
    fill: #7b809a;
}

a:focus .custom-fill {
    fill: #00ab89;
}
</style>