import classes from "./NewManga.module.css";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation } from "swiper/modules";

import { fetchManga } from "../api/shikimori";
import { useQuery } from "@tanstack/react-query";
import MangaCard from "./MangaCard";

function NewManga() {
  const {
    data: mangaList,
    isLoading,
    error,
  } = useQuery({
    queryKey: [
      "mangaList",
      { limit: 20, order: "aired_on", status: "ongoing" },
    ],
    queryFn: () =>
      fetchManga({ limit: 20, order: "aired_on", status: "ongoing" }),
    refetchOnWindowFocus: false,
  });

  return (
    <div className={classes.container}>
      <h2>Новинки</h2>
      {isLoading && <p>Загрузка...</p>}
      {error && <p>Ошибка загрузки манги.</p>}
      {!isLoading && !error && mangaList && (
        <div>
          <Swiper
            modules={[Navigation]}
            resizeObserver={false}
            slidesPerView={5}
            spaceBetween={5}
            navigation
            onSlideChange={() => console.log("slide change")}
            onSwiper={(swiper) => console.log(swiper)}
          >
            {mangaList.map((manga) => (
              <SwiperSlide>
                <MangaCard manga={manga} variant="small" key={manga.id} />
              </SwiperSlide>
            ))}
          </Swiper>
        </div>
      )}
    </div>
  );
}

export default NewManga;
