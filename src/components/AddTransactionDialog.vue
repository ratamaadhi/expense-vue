<script setup lang="ts">
import { ref, watch, computed } from "vue";
import { useAppStore } from "@/stores/app";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
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
import { Plus } from "lucide-vue-next";
import type { Transaction } from "@/types";

const appStore = useAppStore();

const open = defineModel<boolean>("open", { default: false });

const props = defineProps<{
  transaction?: Transaction;
}>();

const isEdit = computed(() => !!props.transaction?.id);

const newTransaction = ref({
  type: "expense" as "income" | "expense",
  amount: "",
  description: "",
  categoryId: "",
  occurredAt: new Date().toISOString().slice(0, 16),
});

watch(() => props.transaction, (tx) => {
  if (tx?.id) {
    newTransaction.value = {
      type: tx.type,
      amount: tx.amount,
      description: tx.description || "",
      categoryId: tx.categoryId,
      occurredAt: new Date(tx.occurredAt).toISOString().slice(0, 16),
    };
  }
}, { immediate: true });

watch(open, (isOpen) => {
  if (!isOpen && !isEdit.value) {
    newTransaction.value = {
      type: "expense",
      amount: "",
      description: "",
      categoryId: "",
      occurredAt: new Date().toISOString().slice(0, 16),
    };
  }
});

async function handleSubmit() {
  try {
    if (isEdit.value && props.transaction?.id) {
      await appStore.updateTransaction(props.transaction.id, {
        type: newTransaction.value.type,
        amount: Number(newTransaction.value.amount),
        description: newTransaction.value.description || undefined,
        categoryId: newTransaction.value.categoryId,
        occurredAt: new Date(newTransaction.value.occurredAt).toISOString(),
      });
    } else {
      await appStore.createTransaction({
        type: newTransaction.value.type,
        amount: Number(newTransaction.value.amount),
        description: newTransaction.value.description || undefined,
        categoryId: newTransaction.value.categoryId,
        occurredAt: new Date(newTransaction.value.occurredAt).toISOString(),
      });
    }
    open.value = false;
  } catch (e) {
    console.error(e);
  }
}

const dialogTitle = computed(() => isEdit.value ? "Edit Transaction" : "Add Transaction");
const dialogDescription = computed(() =>
  isEdit.value ? "Update the transaction details" : "Create a new income or expense record"
);
const buttonText = computed(() => isEdit.value ? "Update Transaction" : "Add Transaction");
</script>

<template>
  <Dialog v-model:open="open">
    <DialogTrigger v-if="!isEdit" as-child>
      <Button :size="$attrs.size || 'default'">
        <Plus class="w-4 h-4 mr-2" />
        Add Transaction
      </Button>
    </DialogTrigger>
    <DialogContent class="sm:max-w-md">
      <DialogHeader>
        <DialogTitle>{{ dialogTitle }}</DialogTitle>
        <DialogDescription>{{ dialogDescription }}</DialogDescription>
      </DialogHeader>
      <form @submit.prevent="handleSubmit" class="space-y-4">
        <div class="grid gap-2">
          <Label for="type">Type</Label>
          <Select v-model="newTransaction.type">
            <SelectTrigger id="type">
              <SelectValue placeholder="Select type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="income">Income</SelectItem>
              <SelectItem value="expense">Expense</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div class="grid gap-2">
          <Label for="amount">Amount</Label>
          <Input
            id="amount"
            v-model.number="newTransaction.amount"
            type="number"
            step="0.01"
            required
            placeholder="0.00"
          />
        </div>
        <div class="grid gap-2">
          <Label for="category">Category</Label>
          <Select v-model="newTransaction.categoryId" required>
            <SelectTrigger id="category">
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
          <Label for="description">Description</Label>
          <Input
            id="description"
            v-model="newTransaction.description"
            type="text"
            placeholder="Optional description"
          />
        </div>
        <div class="grid gap-2">
          <Label for="date">Date</Label>
          <Input id="date" v-model="newTransaction.occurredAt" type="datetime-local" required />
        </div>
        <DialogFooter>
          <Button type="button" variant="outline" @click="open = false">
            Cancel
          </Button>
          <Button type="submit">{{ buttonText }}</Button>
        </DialogFooter>
      </form>
    </DialogContent>
  </Dialog>
</template>
