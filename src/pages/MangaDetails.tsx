import { useEffect } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";

import classes from "./MangaDetails.module.css";
import { fetchManga } from "../api/shikimori";
import {
  formatMangaDate,
  getMangaAwards,
  getValidDate,
  stripHtml,
} from "../utils/utils";
import { mangaAwards } from "../data/awardsData";

import StarRoundedIcon from "@mui/icons-material/StarRounded";
import EmojiEventsRoundedIcon from "@mui/icons-material/EmojiEventsRounded";

function MangaDetails() {
  const navigate = useNavigate();
  const { mangaId } = useParams();

  const {
    data: mangas,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["manga", mangaId],
    queryFn: () =>
      fetchManga(mangaId === "random" ? { order: "random" } : { ids: mangaId }),
    enabled: !!mangaId,
    refetchOnWindowFocus: false,
  });

  const manga = mangas?.[0];

  useEffect(() => {
    if (mangaId === "random" && mangas?.[0]?.id) {
      navigate(`/mangas/${mangas[0].id}`);
    }
  }, [mangaId, mangas, navigate]);

  const startDate = getValidDate(manga?.airedOn);
  const endDate = getValidDate(manga?.releasedOn);

  return (
    <article className={classes.container}>
      {isLoading && <p>Загрузка...</p>}
      {error && <p>Ошибка загрузки манги.</p>}
      {!isLoading && !error && manga && (
        <>
          <header className={classes.header}>
            <h2>
              {manga.originalTitle !== manga.title
                ? `${manga.title} / ${manga.originalTitle}`
                : manga.title}
            </h2>
            <h2 className={classes.score}>
              {manga.score} <StarRoundedIcon />
            </h2>
          </header>
          <div className={classes.body}>
            <div className={classes.poster}>
              <img src={manga.poster} alt={manga.title} loading="lazy" />
            </div>
            <div className={classes.about}>
              <section className={classes.info}>
                <h3>Информация</h3>
                {getMangaAwards(manga.id.toString(), mangaAwards) && (
                  <div className={classes.award}>
                    {getMangaAwards(manga.id.toString(), mangaAwards)?.map(
                      (award) => (
                        <Link to={`/awards/${award.key}`} key={award.key}>
                          <EmojiEventsRoundedIcon /> {award.title}
                        </Link>
                      )
                    )}
                  </div>
                )}
                <p>
                  <strong>Статус:</strong> {formatMangaDate(startDate, endDate)}
                </p>
                {manga.volumes > 0 && (
                  <p>
                    <strong>Тома:</strong> {manga.volumes}
                  </p>
                )}
                {manga.chapters > 0 && (
                  <p>
                    <strong>Главы:</strong> {manga.chapters}
                  </p>
                )}
                <div>
                  <p>
                    <strong>Жанры:</strong>
                  </p>
                  <ul className={classes.list}>
                    {manga.genres.map((genre: string, index: number) => (
                      <li key={index}>{genre}</li>
                    ))}
                  </ul>
                </div>
                <div>
                  <p>
                    <strong>Издатель:</strong>
                  </p>
                  <ul className={classes.list}>
                    {manga.publishers.map(
                      (publisher: string, index: number) => (
                        <li key={index}>{publisher}</li>
                      )
                    )}
                  </ul>
                </div>
                {manga.licensors.length > 0 && (
                  <div>
                    <p>
                      <strong>Лицензировано:</strong>{" "}
                    </p>
                    <ul className={classes.list}>
                      {manga.licensors.map(
                        (licensor: string, index: number) => (
                          <li key={index}>{licensor}</li>
                        )
                      )}
                    </ul>
                  </div>
                )}
                {manga.licenseNameRu && (
                  <p>
                    <strong>Лицензировано в РФ под названием:</strong>{" "}
                    {manga.licenseNameRu}
                  </p>
                )}
              </section>
              <section className={classes.description}>
                <h3>Описание</h3>
                <p>{stripHtml(manga.description) || "Отсутвует."}</p>
              </section>
              <section className={classes.authors}>
                <h3>Авторы</h3>
                {manga.authors.map((author) => (
                  <p key={author.name}>
                    {author.name}: {author.role}
                  </p>
                ))}
              </section>
            </div>
          </div>
        </>
      )}
    </article>
  );
}

export default MangaDetails;
