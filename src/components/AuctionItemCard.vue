<script setup lang="ts">
import { AuctionItem } from "@/types/auction-item";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { numberWithComma } from "@/lib/utils";

defineProps<{
  item: AuctionItem;
}>();
</script>

<template>
  <Card
    class="bg-muted/60 dark:bg-card flex flex-col h-full overflow-hidden group/hoverimg"
    style="padding: 10px"
  >
    <CardHeader class="p-0 gap-0">
      <div class="h-full overflow-hidden">
        <img
          :src="item.thumbnailImageUrl"
          :alt="item.name"
          class="w-full aspect-square object-cover transition-all duration-200 ease-linear size-full group-hover/hoverimg:scale-[1.01]"
        />
      </div>
      <CardTitle class="py-2 px-6">{{ item.name }} </CardTitle>
    </CardHeader>

    <CardContent class="pb-0 text-muted-foreground">
      \{{ numberWithComma(item.currentBid) }}
    </CardContent>

    <CardContent class="py-2 flex justify-center">
      <Button>入札</Button>
    </CardContent>
  </Card>
</template>
