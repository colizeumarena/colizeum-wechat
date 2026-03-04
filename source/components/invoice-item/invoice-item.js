Component({
  properties: {
    item: {
      type: Object,
      value: {},
      observer: "updateData",
    },
    labels: {
      type: Object,
      value: {
        status_paid: "Paid",
        status_unpaid: "Unpaid",
        date: "Date",
        period: "Period",
        amount: "Amount",
        download: "Download",
      },
    },
    titlePrefix: {
      type: String,
      value: "Invoice",
    },
  },

  data: {
    title: "",
    status: "",
    statusText: "",
    date: "",
    period: "",
    amount: "",
    currency: "",
  },

  methods: {
    updateData(item) {
      if (!item) return;

      const statusText =
        item.status === "paid"
          ? this.data.labels.status_paid
          : this.data.labels.status_unpaid;

      let formattedAmount = item.amount;
      if (typeof item.amount === "number") {
        formattedAmount = item.amount.toFixed(2).replace(".", ",");
      } else if (typeof item.amount === "string") {
        if (item.amount.includes(".")) {
          const num = parseFloat(item.amount);
          if (!isNaN(num)) {
            formattedAmount = num.toFixed(2).replace(".", ",");
          }
        }
      }

      let displayPeriod = item.period || "";
      if (!displayPeriod && item.period_start && item.period_end) {
        displayPeriod = `${item.period_start} - ${item.period_end}`;
      }

      const currencySymbol = item.currency || "€";

      this.setData({
        title: `${this.data.titlePrefix} ${item.id}`,
        status: item.status,
        statusText: statusText,
        date: item.date,
        period: displayPeriod,
        amount: formattedAmount,
        currency: currencySymbol,
      });
    },

    handleTap() {
      this.triggerEvent("tap", {
        item: this.data.item,
      });
    },

    handleDownload() {
      this.triggerEvent("download", {
        item: this.data.item,
      });
    },
  },
});
