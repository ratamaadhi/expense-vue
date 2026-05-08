<script setup lang="ts">
import { ref, watch } from "vue";
import { useAppStore } from "@/stores/app";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import DatePicker from "@/components/ui/DatePicker.vue";
import type { Transaction } from "@/types";
import { getLocalTimeZone } from "@internationalized/date";
import { parseDate } from "@internationalized/date";

const appStore = useAppStore();

const open = defineModel<boolean>("open", { default: false });

const props = defineProps<{
  transaction?: Transaction;
}>();

const newTransaction = ref({
  type: "expense" as "income" | "expense",
  amount: "",
  description: "",
  categoryId: "",
  occurredAt: undefined as any,
});

watch(() => props.transaction, (tx) => {
  if (tx?.id) {
    const dateStr = new Date(tx.occurredAt).toISOString().slice(0, 10);
    newTransaction.value = {
      type: tx.type,
      amount: tx.amount,
      description: tx.description || "",
      categoryId: tx.categoryId,
      occurredAt: parseDate(dateStr),
    };
  }
}, { immediate: true });

async function handleSubmit() {
  try {
    if (props.transaction?.id) {
      const occurredAt = newTransaction.value.occurredAt
        ? new Date(newTransaction.value.occurredAt.toDate(getLocalTimeZone())).toISOString()
        : new Date().toISOString();

      await appStore.updateTransaction(props.transaction.id, {
        type: newTransaction.value.type,
        amount: Number(newTransaction.value.amount),
        description: newTransaction.value.description || undefined,
        categoryId: newTransaction.value.categoryId,
        occurredAt,
      });
      open.value = false;
    }
  } catch (e) {
    console.error(e);
  }
}
</script>

<template>
  <Dialog v-model:open="open">
    <DialogContent class="sm:max-w-md">
      <DialogHeader>
        <DialogTitle>Edit Transaction</DialogTitle>
        <DialogDescription>Update the transaction details</DialogDescription>
      </DialogHeader>
      <form @submit.prevent="handleSubmit" class="space-y-4">
        <div class="grid gap-2">
          <Label for="edit-type">Type</Label>
          <Select v-model="newTransaction.type">
            <SelectTrigger id="edit-type">
              <SelectValue placeholder="Select type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="income">Income</SelectItem>
              <SelectItem value="expense">Expense</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div class="grid gap-2">
          <Label for="edit-amount">Amount</Label>
          <Input
            id="edit-amount"
            v-model.number="newTransaction.amount"
            type="number"
            step="0.01"
            required
            placeholder="0.00"
          />
        </div>
        <div class="grid gap-2">
          <Label for="edit-category">Category</Label>
          <Select v-model="newTransaction.categoryId" required>
            <SelectTrigger id="edit-category">
              <SelectValue placeholder="Select category" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem v-for="cat in appStore.categories" :key="cat.id" :value="cat.id">
                {{ cat.name }}
              </SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div class="grid gap-2">
          <Label for="edit-description">Description</Label>
          <Input
            id="edit-description"
            v-model="newTransaction.description"
            type="text"
            placeholder="Optional description"
          />
        </div>
        <div class="grid gap-2">
          <Label for="edit-date">Date</Label>
          <DatePicker
            id="edit-date"
            v-model="newTransaction.occurredAt"
            placeholder="Select date"
          />
        </div>
        <DialogFooter>
          <Button type="button" variant="outline" @click="open = false">
            Cancel
          </Button>
          <Button type="submit">Update Transaction</Button>
        </DialogFooter>
      </form>
    </DialogContent>
  </Dialog>
</template>
