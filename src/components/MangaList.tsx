import { useQuery } from "@tanstack/react-query";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation } from "swiper/modules";

import { fetchManga } from "../api/shikimori";
import classes from "./MangaList.module.css";
import MangaCard from "./MangaCard";

interface MangaListProps {
  title: string;
  queryKey: string;
  queryParams: { limit: number; order: string; status?: string };
}

function MangaList({ title, queryKey, queryParams }: MangaListProps) {
  const {
    data: mangaList,
    isLoading,
    error,
  } = useQuery({
    queryKey: [queryKey, queryParams],
    queryFn: () => fetchManga(queryParams),
    refetchOnWindowFocus: false,
  });

  return (
    <div className={classes.container}>
      <h2>{title}</h2>
      {isLoading && <p>Загрузка...</p>}
      {error && <p>Ошибка загрузки манги.</p>}
      {!isLoading && !error && mangaList && (
        <div>
          <Swiper
            modules={[Navigation]}
            resizeObserver={false}
            slidesPerView={1}
            spaceBetween={5}
            navigation
            breakpoints={{
                768: {
                  slidesPerView: 5,
                },
              }}
          >
            {mangaList.map((manga) => (
              <SwiperSlide key={`${manga.id}`}>
                <MangaCard manga={manga} variant="small" />
              </SwiperSlide>
            ))}
          </Swiper>
        </div>
      )}
    </div>
  );
}

export default MangaList;
