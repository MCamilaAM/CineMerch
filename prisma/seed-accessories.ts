import type { PrismaClient } from "@prisma/client";

export async function seedAccessories(prisma: PrismaClient) {
  const accessories = [
    {
      id: "prod-protectores-steelbook", title: "Pack 10 Protectores PET Steelbooks", price: 28000,
      overview: "Protectores PET para estuches Steelbook.",
      posterUrl: "https://upload.wikimedia.org/wikipedia/commons/d/d4/HD-DVD_and_Blu-Ray_cases_%28crop%29.jpg",
    },
    {
      id: "prod-claqueta-profesional", title: "Claqueta de Cine Acrílica", price: 49000,
      overview: "Claqueta acrílica para coleccionistas.",
      posterUrl: "https://images.unsplash.com/photo-1637248578458-934f03db3ea2?w=500&auto=format&fit=crop&q=80",
    },
  ];
  for (const accessory of accessories) {
    await prisma.product.upsert({
      where: { id: accessory.id }, update: {},
      create: { ...accessory, format: "Merch", category: "Accesorios", director: "CineMerch", year: 2026, stock: 20 },
    });
  }
}
