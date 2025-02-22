import { useQuery } from "@tanstack/react-query";
import classes from "./Catalog.module.css";
import { fetchManga } from "../api/shikimori";
import { Link } from "react-router-dom";
import { useState } from "react";

import KeyboardArrowLeftRoundedIcon from "@mui/icons-material/KeyboardArrowLeftRounded";
import KeyboardArrowRightRoundedIcon from "@mui/icons-material/KeyboardArrowRightRounded";
import MangaCard from "../components/MangaCard";

type Filters = {
  yearFrom: string;
  yearTo: string;
  status: string;
  sort: string;
};

function Catalog() {
  const [page, setPage] = useState<number>(1);
  const limit = 20;

  const [filters, setFilters] = useState<Filters>({
    yearFrom: "",
    yearTo: "",
    status: "",
    sort: "ranked",
  });

  const {
    data: mangaList,
    isLoading,
    error,
  } = useQuery({
    queryKey: [
      "mangaList",
      { limit, order: filters.sort, status: filters.status, page },
    ],
    queryFn: () =>
      fetchManga({ limit, order: filters.sort, status: filters.status, page }),
    refetchOnWindowFocus: false,
  });

  function applyFilters(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setPage(1);
    const formData = new FormData(event.currentTarget);

    setFilters({
      yearFrom: (formData.get("yearFrom") as string) || "",
      yearTo: (formData.get("yearTo") as string) || "",
      status: (formData.get("status") as string) || "",
      sort: (formData.get("sort") as string) || "ranked",
    });
  }

  return (
    <div className={classes.container}>
      <div className={classes.mangaList}>
        {isLoading && <p>Загрузка...</p>}
        {error && <p>Загрузка...</p>}
        {!isLoading && !error && mangaList && (
          <main className={classes.mangaGrid}>
            {!isLoading &&
              !error &&
              mangaList.map((manga) => (
                <Link to={`/mangas/${manga.id}`}>
                  <MangaCard manga={manga} key={manga.id} variant="small" />
                </Link>
              ))}
          </main>
        )}

        <div className={classes.pagination}>
          <button
            onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
            disabled={page === 1}
          >
            <KeyboardArrowLeftRoundedIcon />
          </button>
          <span>Страница {page}</span>
          <button onClick={() => setPage((prev) => prev + 1)}>
            <KeyboardArrowRightRoundedIcon />
          </button>
        </div>
      </div>

      <aside className={classes.filters}>
        <h2>Фильтр</h2>
        <form onSubmit={applyFilters}>
          <div className={classes.filterGroup}>
            <label htmlFor="yearFrom">Год выхода (от):</label>
            <input
              id="yearFrom"
              name="yearFrom"
              type="number"
              min="1950"
              max="2025"
              placeholder="1950"
            />
          </div>

          <div className={classes.filterGroup}>
            <label htmlFor="yearTo">Год выхода (до):</label>
            <input
              id="yearTo"
              name="yearTo"
              type="number"
              min="1950"
              max="2025"
              placeholder="2025"
            />
          </div>

          <div className={classes.filterGroup}>
            <label htmlFor="status">Статус:</label>
            <select id="status" name="status">
              <option value="">Все</option>
              <option value="ongoing">Сейчас издаётся</option>
              <option value="released">Издано</option>
              <option value="paused">Приостановлено</option>
              <option value="discontinued">Прекращено</option>
            </select>
          </div>

          <div className={classes.filterGroup}>
            <label htmlFor="sort">Сортировка:</label>
            <select id="sort" name="sort">
              <option value="popularity">Популярные</option>
              <option value="ranked">По рейтингу</option>
              <option value="aired_on">Новые</option>
            </select>
          </div>

          <button type="submit" className={classes.applyFilters}>
            Применить
          </button>
        </form>
      </aside>
    </div>
  );
}

export default Catalog;
