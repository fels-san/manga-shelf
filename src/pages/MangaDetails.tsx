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
    <div className={classes.container}>
      {isLoading && <p>Загрузка...</p>}
      {error && <p>Ошибка загрузки манги.</p>}
      {!isLoading && !error && manga && (
        <>
          <div className={classes.header}>
            <h2>
              {manga.originalTitle !== manga.title
                ? `${manga.title} / ${manga.originalTitle}`
                : manga.title}
            </h2>
            <h2 className={classes.score}>
              {manga.score} <StarRoundedIcon />
            </h2>
          </div>
          <div className={classes.body}>
            <div className={classes.poster}>
              <img src={manga.poster} alt={manga.title} />
            </div>
            <div className={classes.about}>
              <div className={classes.info}>
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
                <div>
                  <p>
                    <strong>Статус:</strong>
                  </p>
                  <p>{formatMangaDate(startDate, endDate)}</p>
                </div>
                {manga.volumes > 0 && (
                  <div>
                    <p>
                      <strong>Тома:</strong> {manga.volumes}
                    </p>
                  </div>
                )}
                {manga.chapters > 0 && (
                  <div>
                    <p>
                      <strong>Главы:</strong> {manga.chapters}
                    </p>
                  </div>
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
                    <>
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
                    </>
                  </div>
                )}
                {manga.licenseNameRu && (
                  <div>
                    <p>
                      <strong>Лицензировано в РФ под названием:</strong>{" "}
                      {manga.licenseNameRu}
                    </p>
                  </div>
                )}
              </div>
              <div className={classes.description}>
                <h3>Описание</h3>
                <p>{stripHtml(manga.description) || "Отсутвует."}</p>
              </div>
              <div className={classes.authors}>
                <h3>Авторы</h3>
                {manga.authors.map((author) => (
                  <p key={author.name}>
                    {author.name}: {author.role}
                  </p>
                ))}
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}

export default MangaDetails;
