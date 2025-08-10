export const formatPrice = (price: string) => {
    const rupiah = Number(price).toLocaleString("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    });
    return rupiah;
  };