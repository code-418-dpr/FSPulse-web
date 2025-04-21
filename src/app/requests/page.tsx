"use client";

import FooterElement from "@/components/footer";
import NavbarElement from "@/components/navbar";
import { Card, CardBody, Chip, Image, Pagination } from "@heroui/react";
import { useState } from "react";

// Заглушка данных (13 элементов для демонстрации пагинации)
const competitions = Array(13).fill({
  title: "Кубок НР",
  region: "ДНР",
  startDate: "23.05.2025",
  endDate: "25.05.2025",
  applicationDate: "17.04.2025",
  status: "На рассмотрении",
  format: "Онлайн",
  discipline: "Продуктовое программирование",
  image: "https://heroui.com/images/hero-card-complete.jpeg"
});

export default function RequestsPage() {
  const [page, setPage] = useState(1);
  const itemsPerPage = 12;

  const paginatedData = competitions.slice(
    (page - 1) * itemsPerPage,
    page * itemsPerPage
  );

  return (
    <>
      <NavbarElement />
      <div className="w-full min-h-[100vh] flex flex-col">
        <div className="flex-1 container mx-auto px-4 py-8 w-[70%]">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {paginatedData.map((competition, index) => (
                  <Card key={index} className="hover:shadow-lg transition-shadow">
                    <CardBody className="space-y-4">
                      <Image
                        alt={competition.title}
                        className="w-full object-cover rounded-xl"
                        src={competition.image}
                      />
                      <div className="space-y-2">
                        <h3 className="text-2xl font-bold">{competition.title}</h3>
                        <div className="pt-2 grid grid-cols-2">
                        <Chip color="warning" variant="solid">{competition.status}</Chip>
                          <p className="text-sm text-right pt-1">
                            {competition.applicationDate}
                          </p>
                        </div>
                      </div>
                    </CardBody>
                  </Card>
                ))}
              </div>
              
              {competitions.length > itemsPerPage && (
                <div className="mt-8 flex justify-center">
                  <Pagination
                    showControls
                    page={page}
                    total={Math.ceil(competitions.length / itemsPerPage)}
                    onChange={setPage}
                  />
                </div>
              )}
        </div>
        <FooterElement />
      </div>
    </>
  );
}