<template>
  <Component
    :is="href ? 'button' : 'a'"
    :data-secondary="secondary || undefined"
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
  href?: string,
  secondary?: boolean
}>()

</script>

<style
  lang="scss"
  scoped
>
.ThemedButton {
  align-items: center;
  background-color: var(--color-primary);
  border: 0;
  color: var(--color-light);
  cursor: pointer;
  display: flex;
  font-size: 1.5rem;
  font-style: var(--font-paragraph-style);
  gap: var(--spacer-2);
  padding: 1rem;
  text-decoration: none;

  &[data-secondary] {
    background-color: var(--color-secondary);
    color: var(--color-dark);

    :deep(img) {
      filter: brightness(0.2);
    }
  }
}
</style>
