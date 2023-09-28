import fs from "fs/promises";
import path from "path";

import { Inter } from "next/font/google";

const inter = Inter({ subsets: ["latin"] });

function Home(props) {
  const { products } = props;

  return (
    <div
      className={`flex flex-col items-center justify-between p-24 ${inter.className}`}
    >
      <h1>Home</h1>
      <ul>
        {products.map((product) => (
          <li key={product.id}>{product.title}</li>
        ))}
      </ul>
    </div>
  );
}

export async function getStaticProps() {
  const filePath = path.join(process.cwd(), "data", "dummy-backend.json");
  const jsonData = await fs.readFile(filePath);
  const data = JSON.parse(jsonData);

  return {
    props: {
      products: data.products,
    },
  };
}

export default Home;
