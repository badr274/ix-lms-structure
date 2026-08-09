<script setup lang="ts">
import { useModal } from './useModal';
import ConfirmModal from './ConfirmModal.vue';
import SuccessModal from './SuccessModal.vue';

const { _state } = useModal();
</script>

<template>
  <div>
    <!-- Global Programmatic Confirm Modal -->
    <ConfirmModal
      :open="_state.isConfirmOpen.value"
      :title="_state.confirmConfig.value.title"
      :description="_state.confirmConfig.value.description"
      :confirm-text="_state.confirmConfig.value.confirmText"
      :cancel-text="_state.confirmConfig.value.cancelText"
      :variant="_state.confirmConfig.value.variant"
      :loading="_state.isConfirmLoading.value"
      @confirm="_state.handleConfirmAction"
      @cancel="_state.handleCancelAction"
      @update:open="(val) => { if (!val) _state.handleCancelAction(); }"
    />

    <!-- Global Programmatic Success Modal -->
    <SuccessModal
      :open="_state.isSuccessOpen.value"
      :title="_state.successConfig.value.title"
      :description="_state.successConfig.value.description"
      :button-text="_state.successConfig.value.buttonText"
      @confirm="_state.handleSuccessDismiss"
      @update:open="(val) => { if (!val) _state.handleSuccessDismiss(); }"
    />
  </div>
</template>
