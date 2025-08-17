<script lang="ts" setup>
import AuctionItemCard from "@/components/AuctionItemCard.vue";
import { AuctionItem } from "@/types/auction-item";
import { ref } from "vue";
import thumbnailSample from "@/assets/thumbnail-sample.png";
import imageSample from "@/assets/image-sample.png";

const items = ref<AuctionItem[]>([
  {
    id: 1,
    name: "Item 1",
    description: "Description 1",
    currentBid: 100,
    thumbnailImageUrl: thumbnailSample,
    imageUrl: imageSample,
    startingBid: 100,
    currentBidUserId: "user1",
    currentBidUserName: "User One",
    endTime: new Date(Date.now() + 3600 * 1000),
    status: "active",
    bidHistory: [],
  },
  {
    id: 2,
    name: "Item 2",
    description: "Description 2",
    currentBid: 200,
    thumbnailImageUrl: thumbnailSample,
    imageUrl: imageSample,
    startingBid: 200,
    currentBidUserId: "user2",
    currentBidUserName: "User Two",
    endTime: new Date(Date.now() + 7200 * 1000),
    status: "active",
    bidHistory: [],
  },
  {
    id: 3,
    name: "Item 3",
    description: "Description 3",
    currentBid: 300,
    thumbnailImageUrl: thumbnailSample,
    imageUrl: imageSample,
    startingBid: 300,
    currentBidUserId: "user3",
    currentBidUserName: "User Three",
    endTime: new Date(Date.now() + 10800 * 1000),
    status: "active",
    bidHistory: [],
  },
  {
    id: 1,
    name: "Item 1",
    description: "Description 1",
    currentBid: 100,
    thumbnailImageUrl: thumbnailSample,
    imageUrl: imageSample,
    startingBid: 100,
    currentBidUserId: "user1",
    currentBidUserName: "User One",
    endTime: new Date(Date.now() + 3600 * 1000),
    status: "active",
    bidHistory: [],
  },
  {
    id: 2,
    name: "Item 2",
    description: "Description 2",
    currentBid: 200,
    thumbnailImageUrl: thumbnailSample,
    imageUrl: imageSample,
    startingBid: 200,
    currentBidUserId: "user2",
    currentBidUserName: "User Two",
    endTime: new Date(Date.now() + 7200 * 1000),
    status: "active",
    bidHistory: [],
  },
  {
    id: 3,
    name: "Item 3",
    description: "Description 3",
    currentBid: 300,
    thumbnailImageUrl: thumbnailSample,
    imageUrl: imageSample,
    startingBid: 300,
    currentBidUserId: "user3",
    currentBidUserName: "User Three",
    endTime: new Date(Date.now() + 10800 * 1000),
    status: "active",
    bidHistory: [],
  },
  {
    id: 1,
    name: "Item 1",
    description: "Description 1",
    currentBid: 1100,
    thumbnailImageUrl: thumbnailSample,
    imageUrl: imageSample,
    startingBid: 100,
    currentBidUserId: "user1",
    currentBidUserName: "User One",
    endTime: new Date(Date.now() + 3600 * 1000),
    status: "active",
    bidHistory: [],
  },
  {
    id: 2,
    name: "Item 2",
    description: "Description 2",
    currentBid: 2200,
    thumbnailImageUrl: thumbnailSample,
    imageUrl: imageSample,
    startingBid: 200,
    currentBidUserId: "user2",
    currentBidUserName: "User Two",
    endTime: new Date(Date.now() + 7200 * 1000),
    status: "active",
    bidHistory: [],
  },
  {
    id: 3,
    name: "Item 3",
    description: "Description 3",
    currentBid: 3300,
    thumbnailImageUrl: thumbnailSample,
    imageUrl: imageSample,
    startingBid: 300,
    currentBidUserId: "user3",
    currentBidUserName: "User Three",
    endTime: new Date(Date.now() + 10800 * 1000),
    status: "active",
    bidHistory: [],
  },
]);
</script>

<template>
  <div class="home">
    <section class="container lg:w-[90%]">
      <div
        class="grid grid-cols-3 sm:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-6"
      >
        <AuctionItemCard v-for="item in items" :key="item.id" :item="item" />
      </div>
    </section>
  </div>
</template>
