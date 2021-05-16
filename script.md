# 🚀 Lift off with Next.js

- Welcome to this workshop!
- Today we're learning all about Next.js
- My name is Sam
   - High schooler in Singapore
   - Passionate open source dev
   - Like making interactive expiriences
   - Next.js is a big part of that
- Before we get started we need to install Nodejs: https://nodejs.org/en/

---

### Table of Contents

1. What is Next.js & React?
2. What are the key features of Next.js?
3. Applications of Next.js
4. Live Coding Session
5. Q&A Session

---

### What is Next.js & React?

- React is a method of using JavaScript to build user interfaces for the web + mobile
   - The modern method of doing this is defining a function
   - Inside you return a block of JSX
      - JSX is very much like HTML
   - The power of React is the injection of JS
      - For example, you can provide a variable and inject it
- Next.js is an All-in-one React Framework for the Web
- Strips away the unnessacary boilerplate of React
- Provides a simple yet powerful tool

---

### What are the key features of Next.js?

- Hybrid Approach to Rendering
   - Render your pages in all sorts of ways
   - Static Generation
      - All pages rendered on build time
   - Server Side Rendering
      - When a user makes a request
      - The page is then rendered
      - Makes sure all data is up to date
   - Incremental Static Generation
      - The best of both worlds
      - Pages are rendered on build time
      - Then as time goes by these pages are then re-rendered / refreshed
         - In the background
- File based routing
   - For every `.js` file in the `/pages` directory a page is created
- Dynamic routing
   - Building on this you can define a file such as `[planet].js` and then generate a page for every planet
   - Optionally, if a new planet is discovered (RIP Pluto) you can have a new page for Pluto built without rebuilding the site
- API Routes
   - Create an API from within Next.js
   - Express-style API routes that can serve as a basic backend
- Others
   - Image Optimization (Speed up your site + reduce size)
   - Code Splitting (Speed up your site + reduce size)
   - TypeScript Support
   - Fast Refresh (page auto updates in dev mode)
   - Built in CSS Support
   - Enviromental Variables
   - Polyfills for Web JS APIs
   - Internationization

---

### Applications of Next.js

- Landing Pages
- E-commerce Stores
- Web Apps
- Blogs / Content Bases

---

### Live Coding Session

- We'll be build our own version of NASA’s Astronomy Picture of the Day. It will use ISR and Dynamic Routing. Here’s what it will be like. *Show hosted demo.*
- Using Next.js’s key features that we outlined above
- We’ll be doing this togther, now let’s open up a code editor and a terminal.
- Load up our boilerplate:

```javascript
yarn create next-app -e github.com/sampoder/intro-to-nextjs

npx create-next-app
```

- `cd` into our app's directory
- Exploration of boilerplate
- What our template comes with: design
- What we need to do: data fetching, dynamic routing, set up meta tag  and image optimization
- Get API key: [https://api.nasa.gov](https://api.nasa.gov)
- Type into .env
- To begin we will fetch the data for our `index` page
   - Create getStaticProps
   - Use `await fetch` to fetch
   - Then pass to render function
      - Tell the main component that there is nothing after this date

```javascript
import MainComponent from "../components/main";

export default function App({ data }) {
  return (
	<>
	  <MainComponent
		isToday={true}
		{...data}
	  />
	</>
  );
}

export async function getStaticProps() {
  let data = await fetch(
	`https://api.nasa.gov/planetary/apod?api_key=${process.env.KEY}`
  ).then((r) => r.json());
  return { props: { data }, revalidate: 30 };
}
```

- Then we will set up dynamic routing
   - Create `[data].js`, copy over `index.js`
   - getStaticPaths, make today fetch then find 180 days back
      - Helper function:

```javascript
function getDateX(firstDate, daysBack) {
  let yesterday = new Date(firstDate);
  yesterday.setDate(yesterday.getDate() - daysBack);
  return yesterday.toISOString().split("T")[0];
}
```

```javascript
export async function getStaticPaths() {
  function getDateX(firstDate, daysBack) {
	let yesterday = new Date(firstDate);
	yesterday.setDate(yesterday.getDate() - daysBack);
	return yesterday.toISOString().split("T")[0];
  }
  let currentDate = (
	await fetch(
	  `https://api.nasa.gov/planetary/apod?api_key=${process.env.KEY}`
	).then((r) => r.json())
  ).date;
  return {
	paths: [...Array(180).keys()].map((x) => ({
	  params: {
		date: getDateX(currentDate, x),
	  },
	})),
	fallback: true
  };
}
```

   - getStaticProps (adapt from `index.js`)
      - Revalidate 😄
      - Try catch to find 404s

```javascript
export async function getStaticProps({ params }) {
  try {
	let data = await fetch(
	  `https://api.nasa.gov/planetary/apod?api_key=${process.env.KEY}&date=${params.date}`
	).then((r) => r.json());

	let currentDate = (
	  await fetch(
		`https://api.nasa.gov/planetary/apod?api_key=${process.env.KEY}`
	  ).then((r) => r.json())
	).date;

	return {
	  props: { data, today: currentDate == params.date ? true : false },
	  revalidate: 30,
	};
  } catch {
	return { props: { notFound: true } };
  }
}
```

   - Quick update to the render function (error handling, fallback handling, plus today part in the params and the component):

```javascript
import MainComponent from "../components/main";
import Error from "next/error";
import { useRouter } from 'next/router'

export default function App({ data, today, notFound }) {
  const router = useRouter()
  if (notFound) {
	return <Error statusCode={"404"} />;
  }
  if (router.isFallback) {
	return <div>Loading...</div>
  }
  if (today && typeof window != 'undefined'){
	router.replace('/')
  }
  return (
	<>
	  <MainComponent isToday={today} {...data} />
	</>
  );
}
```

- Routing
   - Use helper functions to first get the buttons set up + disable next:
```javascript
<div className={styles.buttons}>
  <a href={`/${getYesterday(date)}`}>Previous</a>
  {isToday == false ? <a href={`/${getTomorrow(date)}`}>Next</a> : ''}
</div>
```

   - next/link
      - `import Link from 'next/link’`
      - Just replace `a` with `Link`
- Meta tags
   - Next head: `import Head from 'next/head’`
   - For Index:
```javascript
import MainComponent from "../components/main";
import Head from 'next/head'

export default function App({ data }) {
  let title = `Today's Astronomy Picture of the Day`
  return (
	<>
	  <Head>
		<title>{title}</title>
		<meta property="og:title" content={title} />
		<meta name="twitter:title" content={title} />
		<meta property="og:image" content={data.url} />
		<meta name="twitter:card" content="summary_large_image" />
		<meta name="twitter:image" content={data.url} />
	  </Head>
	  <MainComponent isToday={true} {...data} />
	</>
  );
}
```

   - For [date]:
```javascript
import MainComponent from "../components/main";
import Error from "next/error";
import { useRouter } from 'next/router'
import Head from 'next/head'

export default function App({ data, today, notFound }) {
  const router = useRouter()
  if (notFound) {
	return <Error statusCode={"404"} />;
  }
  if (router.isFallback) {
	return <div>Loading...</div>
  }
  if (today && typeof window != 'undefined'){
	router.replace('/')
  }
  let title = `${data.date}'s Astronomy Picture of the Day`
  return (
	<>
	  <Head>
		<title>{title}</title>
		<meta property="og:title" content={title} />
		<meta name="twitter:title" content={title} />
		<meta property="og:image" content={data.url} />
		<meta name="twitter:card" content="summary_large_image" />
		<meta name="twitter:image" content={data.url} />
	  </Head>
	  <MainComponent isToday={today} {...data} />
	</>
  );
}
```

- Now we will do image optimization
   - Next.config.js set up
```javascript
module.exports = {
  images: {
	domains: ['apod.nasa.gov', 'img.youtube.com'],
  },
}
```

   - Edit the componenet
```javascript
<Image
  layout="fill"
  priority={true}
  quality={100}
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
```

- [STRETCH] Deploy to Vercel

