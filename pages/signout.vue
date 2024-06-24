<template>
  <UDropdown
    :items="items"
    :ui="{ item: { disabled: 'cursor-text select-text' }, width: 'w-64' }"
    v-if="user"
  >
    <UAvatar
      src="https://avatars.githubusercontent.com/u/739984?v=4"
      alt="Avatar"
    />

    <template #account="{ item }">
      <div class="text-left">
        <p>Signed in as</p>
        <p class="font-medium text-gray-900 dark:text-white">
          {{ item.label }}
        </p>
      </div>
    </template>

    <template #item="{ item }">
      <span class="truncate">{{ item.label }}</span>
      <UIcon
        :name="item.icon"
        class="flex-shrink-0 h-4 w-4 text-gray-400 dark:text-gray-500 ms-auto"
      />
    </template>
  </UDropdown>
</template>

<script setup>
import { ref } from "vue";
import { useRouter } from "vue-router";

// Get the current user and supabase client
const user = useSupabaseUser();
const supabase = useSupabaseClient();
const router = useRouter();

// Define the dropdown items
const items = ref([
  [
    {
      label: user.value?.email,
      slot: "account",
      disabled: true,
    },
  ],
  [
    {
      label: "Settings",
      icon: "i-heroicons-cog-8-tooth",
      onClick: () => console.log("Link to settings in the future"),
    },
    {
      label: "Sign out",
      icon: "i-heroicons-arrow-left-on-rectangle",
      onClick: async () => {
        await supabase.auth.signOut();
        router.push("/login");
      },
    },
  ],
]);
</script>
