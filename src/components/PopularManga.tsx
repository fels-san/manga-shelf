import { useQuery } from "@tanstack/react-query";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Pagination } from "swiper/modules";

import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/navigation";

import classes from "./PopularManga.module.css";
import { fetchManga } from "../api/shikimori";
import MangaCard from "./MangaCard";

function PopularManga() {
  const {
    data: mangaList,
    isLoading,
    error,
  } = useQuery({
    queryKey: [
      "mangaList",
      {
        limit: 20,
        order: "popularity",
        status: "ongoing",
        season: "2020_2025",
      },
    ],
    queryFn: () =>
      fetchManga({
        limit: 20,
        order: "popularity",
        status: "ongoing",
        season: "2020_2025",
      }),
    refetchOnWindowFocus: false,
  });

  return (
    <div className={classes.container}>
      {isLoading && <p>Загрузка...</p>}
      {error && <p>Ошибка загрузки манги.</p>}
      {!isLoading && !error && mangaList && (
        <Swiper
          modules={[Pagination, Autoplay]}
          direction={"vertical"}
          spaceBetween={50}
          slidesPerView={1}
          pagination={{
            dynamicBullets: true,
          }}
          autoplay={{
            delay: 6500,
            disableOnInteraction: false,
          }}
        >
          {mangaList.map((manga) => (
            <SwiperSlide key={`${manga.id}_popular`}>
              <MangaCard manga={manga} />
            </SwiperSlide>
          ))}
        </Swiper>
      )}
    </div>
  );
}

export default PopularManga;
