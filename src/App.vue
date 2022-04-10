<template>
  <router-view />
</template>

<style lang="scss">
$enable-ltr: true;
$enable-rtl: true;

@import '~@coreui/coreui/scss/coreui';
@import '~@coreui/chartjs/scss/tooltips';

.wrapper {
  width: 100%;
  @include ltr-rtl('padding-left', var(--cui-sidebar-occupy-start, 0));
  will-change: auto;
}
</style>
