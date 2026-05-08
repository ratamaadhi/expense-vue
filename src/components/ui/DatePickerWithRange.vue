<script setup lang="ts">
import { ref, computed } from "vue";
import { CalendarIcon, X } from "lucide-vue-next";
import { Button } from "@/components/ui/button";
import { RangeCalendar } from "@/components/ui/range-calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { today, getLocalTimeZone } from "@internationalized/date";
import type { DateRange, DateValue } from "reka-ui";

interface Props {
  modelValue?: DateRange;
  placeholder?: string;
  className?: string;
}

interface Emits {
  (e: "update:modelValue", value: DateRange | undefined): void;
}

const props = withDefaults(defineProps<Props>(), {
  placeholder: "Pick a date range",
  className: "",
});

const emit = defineEmits<Emits>();

const open = ref(false);

// Get today's date to disable future dates
const todayDate = today(getLocalTimeZone());

// Function to disable future dates
function isDateUnavailable(date: DateValue): boolean {
  return date.compare(todayDate) > 0;
}

const dateRange = computed({
  get: () => props.modelValue,
  set: (value) => emit("update:modelValue", value),
});

function formatDateRange(): string {
  if (!dateRange.value) return props.placeholder;

  const { start, end } = dateRange.value;

  if (!start && !end) return props.placeholder;

  if (start && !end) {
    return format(start.toDate(getLocalTimeZone()), "dd MMM yyyy");
  }

  if (!start && end) {
    return format(end.toDate(getLocalTimeZone()), "dd MMM yyyy");
  }

  // Both dates are present
  return `${format(start!.toDate(getLocalTimeZone()), "dd MMM yyyy")} - ${format(
    end!.toDate(getLocalTimeZone()),
    "dd MMM yyyy"
  )}`;
}

function handleClear(e: MouseEvent) {
  e.stopPropagation();
  dateRange.value = undefined;
}
</script>

<template>
  <div :class="cn('grid gap-2', className)">
    <Popover v-model:open="open">
      <PopoverTrigger as-child>
        <Button
          id="date"
          variant="outline"
          :class="cn(
            'w-[300px] justify-start text-left font-normal',
            !dateRange && 'text-muted-foreground'
          )"
        >
          <CalendarIcon class="mr-2 h-4 w-4" />
          <span class="flex-1">{{ formatDateRange() }}</span>
          <X
            v-if="dateRange"
            class="h-4 w-4 opacity-50 hover:opacity-100"
            @click="handleClear"
          />
        </Button>
      </PopoverTrigger>
      <PopoverContent class="w-auto p-0" align="start">
        <RangeCalendar
          v-model="dateRange"
          :number-of-months="2"
          :initial-focus="true"
          :is-date-unavailable="isDateUnavailable"
        />
      </PopoverContent>
    </Popover>
  </div>
</template>
