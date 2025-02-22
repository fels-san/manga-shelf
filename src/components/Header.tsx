import { Link } from "react-router-dom";
import classes from "./Header.module.css";
import MenuBookRoundedIcon from "@mui/icons-material/MenuBookRounded";

function Header() {
  return (
    <div className={classes.header}>
      <div className={classes.title}>
        <Link to="/">
          <h1>
            <MenuBookRoundedIcon />
            Manga Shelf
          </h1>
        </Link>
      </div>
      <menu className={classes.menu}>
        <ul>
          <li>
            <Link to="/awards/mangaTaisho">Премии</Link>
          </li>
          <li>
            <Link to="/catalog">Каталог</Link>
          </li>
          <li>
            <Link to={`/mangas/random`}>Случайный Выбор</Link>
          </li>
        </ul>
      </menu>
    </div>
  );
}

export default Header;
