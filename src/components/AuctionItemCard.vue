<script setup lang="ts">
import { AuctionItem } from "@/types/auction-item";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardFooter,
} from "@/components/ui/card";

defineProps<{
  item: AuctionItem;
}>();
</script>

<template>
  <Card
    class="bg-muted/40 dark:bg-card flex flex-col h-full overflow-hidden group/hoverimg"
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
      <CardTitle class="py-6 pb-4 px-6">{{ item.name }} </CardTitle>
    </CardHeader>

    <CardContent class="pb-0 text-muted-foreground">
      {{ item.currentBid }}
    </CardContent>

    <CardFooter class="space-x-4 mt-auto">
      <Button variant="outline">Place Bid</Button>
    </CardFooter>
  </Card>
</template>
