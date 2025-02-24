import MangaList from "../components/MangaList";
import PopularManga from "../components/PopularManga";

import classes from "./HomePage.module.css";

function HomePage() {
  return (
    <div className={classes.container}>
      <PopularManga />
      <MangaList title="Лучшее за всё время" queryKey="topMangaList" queryParams={{ limit: 20, order: "ranked_shiki" }} />
      <MangaList title="Новинки" queryKey="newMangaList" queryParams={{ limit: 20, order: "aired_on", status: "ongoing" }} />
    </div>
  );
}
export default HomePage;
