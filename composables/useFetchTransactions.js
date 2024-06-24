import { watch } from "vue";

export const useFetchTransactions = (period) => {
  const transactions = ref([]); //make data array
  const pending = ref(false);
  const supabase = useSupabaseClient(); //to query from supabase
  const income = computed(() =>
    // filter icome type only
    transactions.value.filter((t) => t.type === "Income")
  );
  const expense = computed(() =>
    //filter expense type only
    transactions.value.filter((t) => t.type === "Expense")
  );
  const investment = computed(() =>
    // filter icome type only
    transactions.value.filter((t) => t.type === "Investment")
  );
  const saving = computed(() =>
    // filter icome type only
    transactions.value.filter((t) => t.type === "Saving")
  );
  const incomeCount = computed(() => income.value.length);
  const expenseCount = computed(() => expense.value.length);
  const investmentCount = computed(() => investment.value.length);
  const savingCount = computed(() => saving.value.length);

  const incomeTotal = computed(() =>
    income.value.reduce((sum, transaction) => sum + transaction.amount, 0)
  );
  const expenseTotal = computed(() =>
    expense.value.reduce((sum, transaction) => sum + transaction.amount, 0)
  );
  const investmentTotal = computed(() =>
    investment.value.reduce((sum, transaction) => sum + transaction.amount, 0)
  );
  const savingTotal = computed(() =>
    saving.value.reduce((sum, transaction) => sum + transaction.amount, 0)
  );

  const fetchTransactions = async () => {
    pending.value = true;
    try {
      const { data } = await useAsyncData(
        `transactions-${period.value.from.toDateString()}-${period.value.to.toDateString()}`,
        async () => {
          const { data, error } = await supabase
            .from("transactions")
            .select()
            .gte("created_at", period.value.from.toISOString())
            .lte("created_at", period.value.to.toISOString())
            .order("created_at", { ascending: false });
          if (error) return [];
          return data;
        }
      );
      return data.value;
    } finally {
      pending.value = false;
    }
  };
  const refresh = async () => (transactions.value = await fetchTransactions());
  watch(period, async () => await refresh()); // to refresh data when perio data change

  const transactionsGroupedByDate = computed(() => {
    let grouped = {};
    for (const transaction of transactions.value) {
      const date = transaction.created_at.split("T")[0];
      if (!grouped[date]) {
        grouped[date] = [];
      }
      grouped[date].push(transaction);
    }
    return grouped;
  });

  return {
    transactions: {
      all: transactions,
      grouped: {
        byDate: transactionsGroupedByDate,
      },
      income,
      expense,
      incomeTotal,
      expenseTotal,
      incomeCount,
      expenseCount,
      investment,
      saving,
      investmentTotal,
      savingTotal,
    },
    refresh,
    pending,
  };
};
