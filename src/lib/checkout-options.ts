export const paymentMethods = {
  WOMPI_CARD: "Tarjeta",
  WOMPI_NEQUI: "Nequi",
  WOMPI_PSE: "PSE",
  WOMPI_BANCOLOMBIA: "Bancolombia",
  WOMPI_BRE_B: "Bre-B",
  CONTRAENTREGA: "Contraentrega",
};

export function isLocalDelivery(city: string, department: string) {
  const normalize = (value: string) => value.trim().toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
  return normalize(city) === "cartagena" && normalize(department) === "bolivar";
}

export const publicCoupons = ["CINE10", "CINEMERCH10", "PREVENTA10"];
