import classes from "./Awards.module.css";
import { mangaAwards } from "../data/awardsData";
import { useQueries } from "@tanstack/react-query";
import { fetchManga } from "../api/shikimori";
import { Link, NavLink, useParams } from "react-router-dom";
import EmojiEventsRoundedIcon from "@mui/icons-material/EmojiEventsRounded";

function Awards() {
  const { awardName } = useParams<{ awardName: string }>();

  const award = awardName ? mangaAwards[awardName] : undefined;

  function chunkArray<T>(array: T[], size: number): T[][] {
    return array.reduce<T[][]>((acc, _, i) => {
      if (i % size === 0) acc.push(array.slice(i, i + size));
      return acc;
    }, []);
  }

  const uniqueWinnersIds: string[] = award
    ? [...new Set(Object.values(award.winners).flatMap((ids) => ids))]
    : [];
  const winnersChunks = chunkArray(uniqueWinnersIds, 50);

  const mangaQueries = useQueries({
    queries: winnersChunks.map((chunk) => ({
      queryKey: ["mangaList", chunk],
      queryFn: () =>
        fetchManga({
          limit: chunk.length,
          ids: chunk.join(","),
          order: "popularity",
        }),
    })),
  });

  const isLoading = mangaQueries.some((query) => query.isLoading);
  const error = mangaQueries.find((query) => query.error)?.error;

  const mangaList = mangaQueries.flatMap((query) => query.data || []);

  return (
    <div className={classes.container}>
      {!isLoading && !error && award && <div className={classes.body}>
        <section className={classes.awardInfo}>
          <h1>{award.name}</h1>
          <p>{award.description}</p>
        </section>

        <section className={classes.winners}>
          {isLoading && <p>Загрузка...</p>}
          {error && <p>Ошибка загрузки данных</p>}
          {!isLoading &&
            !error &&
            Object.entries(award.winners).map(([year, ids]) => (
              <div className={classes.yearBlock} key={year}>
                <h2>
                  <EmojiEventsRoundedIcon /> {year}
                </h2>
                <div className={classes.winnerList}>
                  {ids.map((id) => {
                    const manga = mangaList.find(
                      (m) => Number(m.id) === Number(id)
                    );
                    if (!manga) return;

                    return (
                      <Link to={`/mangas/${manga.id}`}>
                        <div className={classes.winnerCard} key={id}>
                          <img src={manga.miniPoster} alt={manga.title} />
                          <div className={classes.winnerInfo}>
                            <h3>{manga.title}</h3>
                          </div>
                        </div>
                      </Link>
                    );
                  })}
                </div>
              </div>
            ))}
        </section>
      </div>}
      <nav className={classes.nav}>
        <ul>
          {[
            { to: "/awards/mangaTaisho", text: "Manga Taisho" },
            {
              to: "/awards/bookStoreRecommendations",
              text: "Манга, рекомендуемая сотрудниками японских книжных магазинов",
            },
            { to: "/awards/tezukaPrie", text: "Tezuka Osamu Cultural Prize" },
            { to: "/awards/kodanshaAward", text: "Kodansha Manga Award" },
            { to: "/awards/shogakukanAward", text: "Shogakukan Manga Award" },
          ].map((link) => (
            <li key={link.to}>
              <NavLink to={link.to}>{link.text}</NavLink>
            </li>
          ))}
        </ul>
      </nav>
    </div>
  );
}

export default Awards;
