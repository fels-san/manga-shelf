import { Link } from "react-router-dom";
import { Manga } from "../types/types";
import classes from "./MangaCard.module.css";
import { stripHtml } from "../utils/utils";

function MangaCard({
  manga,
  variant = "large",
}: {
  manga: Manga;
  variant?: "small" | "large";
}) {
  return (
    <Link to={`/mangas/${manga.id}`}>
      <div
        className={`${classes.card} ${
          variant === "small" ? classes.small : classes.large
        }`}
      >
        <div className={classes.cover}>
          <img src={manga.poster} alt={manga.title} loading="lazy" />
          {variant === "small" && (
            <div className={classes.score}>{manga.score}</div>
          )}
        </div>
        <div className={classes.details}>
          <h2>
            {manga.title}
            {variant === "large" && `, ${manga.airedOn.year}`}
          </h2>
          {variant === "large" && (
            <>
              <ul className={classes.genres}>
                {manga.genres.map((genre, index) => (
                  <li key={index}>{genre}</li>
                ))}
              </ul>
              <p>{stripHtml(manga.description)}</p>
            </>
          )}
        </div>
      </div>
    </Link>
  );
}

export default MangaCard;
