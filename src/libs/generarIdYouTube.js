// utils/getYoutubeId.js
export const getYoutubeIdFromUrl = (url) => {
  try {
    const u = new URL(url);
    const startUrl = "https://www.youtube.com/embed/";
    if (u.pathname.startsWith("/shorts/")) {
      return startUrl + u.pathname.split("/shorts/")[1].split("?")[0];
    }

    // https://www.youtube.com/watch?v=kodSDI6VvNI
    // youtu.be/kodSDI6VvNI
    if (u.hostname.includes("youtu.be")) {
      console.log(0);
      return startUrl + u.pathname.replace("/", ""); // quita la primera /
    }

    // youtube.com/watch?v=kodSDI6VvNI
    if (u.searchParams.get("v")) {
      console.log(u.searchParams.get("v"));
      return startUrl + u.searchParams.get("v");
    }

    // youtube.com/embed/kodSDI6VvNI
    const paths = u.pathname.split("/");
    const embedIndex = paths.indexOf("embed");
    if (embedIndex !== -1 && paths[embedIndex + 1]) {
      console.log(2);
      return startUrl + paths[embedIndex + 1];
    }

    return null;
  } catch (error) {
    console.error("URL inválida", error);
    return null;
  }
};
