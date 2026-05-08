<script setup lang="ts">
import { ref, computed } from "vue";
import { CalendarIcon } from "lucide-vue-next";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { today, getLocalTimeZone, type CalendarDate } from "@internationalized/date";
import type { DateValue as RekaDateValue } from "reka-ui";

interface Props {
  modelValue?: CalendarDate;
  placeholder?: string;
  className?: string;
}

interface Emits {
  (e: "update:modelValue", value: CalendarDate | undefined): void;
}

const props = withDefaults(defineProps<Props>(), {
  placeholder: "Pick a date",
  className: "",
});

const emit = defineEmits<Emits>();

const open = ref(false);

// Get today's date to disable future dates
const todayDate = today(getLocalTimeZone());

// Function to disable future dates
function isDateUnavailable(date: RekaDateValue): boolean {
  return date.compare(todayDate) > 0;
}

const date = computed({
  get: () => props.modelValue,
  set: (value) => emit("update:modelValue", value),
});

function formatDate(): string {
  if (!date.value) return props.placeholder;
  return format(date.value.toDate(getLocalTimeZone()), "dd MMM yyyy");
}
</script>

<template>
  <div :class="cn('grid gap-2', className)">
    <Popover v-model:open="open">
      <PopoverTrigger as-child>
        <Button
          variant="outline"
          :class="cn(
            'w-full justify-start text-left font-normal',
            !date && 'text-muted-foreground'
          )"
        >
          <CalendarIcon class="mr-2 h-4 w-4" />
          {{ formatDate() }}
        </Button>
      </PopoverTrigger>
      <PopoverContent class="w-auto p-0" align="start">
        <Calendar
          v-model="date"
          :initial-focus="true"
          :is-date-unavailable="isDateUnavailable"
        />
      </PopoverContent>
    </Popover>
  </div>
</template>
