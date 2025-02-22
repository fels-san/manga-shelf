import NewManga from "../components/NewManga";
import PopularManga from "../components/PopularManga";
import TopManga from "../components/TopManga";

import classes from "./HomePage.module.css";

function HomePage() {
  return (
    <div className={classes.container}>
      <PopularManga />
      <TopManga />
      <NewManga />
    </div>
  );
}
export default HomePage;
