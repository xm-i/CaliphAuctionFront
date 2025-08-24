<script setup lang="ts">
import type { SearchItemDto } from "@/api/auction";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { numberWithComma } from "@/lib/utils";

defineProps<{
  item: SearchItemDto;
}>();
</script>

<template>
  <Card
    class="bg-muted/60 dark:bg-card flex flex-col h-full overflow-hidden group/hoverimg"
    style="padding: 10px"
  >
    <CardHeader class="p-0 pb-2 gap-0">
      <CardTitle class="py-2 px-1">
        <router-link :to="`/auction/${item.id}`">{{ item.name }}</router-link>
      </CardTitle>
      <div class="h-full overflow-hidden">
        <img
          :src="item.thumbnailImageUrl"
          :alt="item.name"
          class="w-full aspect-square object-cover transition-all duration-200 ease-linear size-full group-hover/hoverimg:scale-[1.01]"
        />
      </div>
    </CardHeader>

    <CardContent class="pb-0 text-muted-foreground text-center">
      <span class="current-bid">
        \{{ numberWithComma(item.currentPrice) }}
      </span>
      <span v-if="item.currentUserName" class="current-bid-username">{{
        item.currentUserName
      }}</span>
    </CardContent>

    <CardContent class="py-2 flex justify-center">
      <Button>入札</Button>
    </CardContent>
  </Card>
</template>

<style scoped>
.current-bid {
  font-size: 1.5rem;
  font-weight: bold;
  display: block;
}

.current-bid-username {
  color: var(--muted-foreground);
  display: block;
}
</style>
