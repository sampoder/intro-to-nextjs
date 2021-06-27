import styles from "../styles/Main.module.css";

function getYesterday(firstDate) {
  let yesterday = new Date(firstDate);
  yesterday.setDate(yesterday.getDate() - 1);
  return yesterday.toISOString().split("T")[0];
}

function getTomorrow(firstDate) {
  let tomorrow = new Date(firstDate);
  tomorrow.setDate(tomorrow.getDate() + 1);
  return tomorrow.toISOString().split("T")[0];
}

export default function MainComponents({
  url,
  date,
  title,
  copyright,
  isToday = false,
}) {
  return (
    <div>
      <div className={styles.controlbox}>
        <span className={styles.date}>{isToday ? "Today" : date}</span>
        <div className={styles.title}>
          <h1>{title}</h1> {copyright}
        </div>
        <div className={styles.buttons}>
          <a href="">Previous</a>
          <a href="">Next</a>
        </div>
      </div>
      <img
        className={styles.img}
        src={
          url
            .replace(
              "https://www.youtube.com/embed/",
              "https://img.youtube.com/vi/"
            )
            .replace("?rel=0", "") +
          (url.includes("youtube") ? "/maxresdefault.jpg" : "")
        }
      />
    </div>
  );
}
