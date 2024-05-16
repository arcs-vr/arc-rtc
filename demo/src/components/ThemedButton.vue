<template>
  <Component
    :is="href ? 'button' : 'a'"
    :href="href"
    class="ThemedButton"
  >
    <slot/>
  </Component>
</template>

<script
  lang="ts"
  setup
>
defineProps<{
  href?: string
}>()

</script>

<style
  lang="scss"
  scoped
>
.ThemedButton {
  background-color: var(--color-primary);
  border: 0;
  color: var(--color-light);
  cursor: pointer;
  font-size: 2rem;
  font-style: var(--font-paragraph-style);
  padding: 1rem;
  text-decoration: none;
}
</style>
