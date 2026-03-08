<script lang="ts">
  import { Button as ShadcnButton, buttonVariants } from './button';
  import { type ButtonProps } from 'bits-ui';
  
  export let variant: ButtonProps['variant'] = 'default';
  export let size: ButtonProps['size'] = 'default';
  export let class: className = '';
  export let disabled: boolean = false;
</script>

<ShadcnButton
  variant={variant}
  size={size}
  class={className}
  disabled={disabled}
>
  <slot />
</ShadcnButton>
