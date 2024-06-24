import { watch } from "vue";

export const useIsUserLoggedIn = (url = "/") => {
  const user = useSupabaseUser();
  watch(
    user,
    (user) => {
      if (user) {
        router.push(url);
      }
    },
    { immediate: true }
  );
  return { user };
};
