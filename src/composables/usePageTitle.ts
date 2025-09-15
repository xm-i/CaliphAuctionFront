import { watchEffect, ref } from "vue";

const BASE_TITLE = "カリフオークション";

/**
 * usePageTitle
 * Dynamically sets document.title reactively.
 * If you pass a falsy value, it falls back to BASE_TITLE.
 */
export function usePageTitle(initial?: string | (() => string | undefined)) {
  const titleRef = ref<string | undefined>(
    typeof initial === "function" ? initial() : initial
  );

  watchEffect(() => {
    const t = titleRef.value;
    if (t && t.trim().length > 0) {
      document.title = `${t} | ${BASE_TITLE}`;
    } else {
      document.title = BASE_TITLE;
    }
  });

  function setTitle(newTitle?: string) {
    titleRef.value = newTitle;
  }

  return { setTitle, titleRef };
}
